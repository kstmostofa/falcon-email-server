<?php

namespace App\Http\Controllers;

use App\Enums\BotType;
use App\Imports\ContactImport;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('contact/index', [
            'botTypes' => BotType::all(),
        ]);
    }

    public function datatable(Request $request)
    {
        $contacts = Contact::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('contact_name', 'like', "%{$search}%")
                        ->orWhereHas('data', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->bot_type, function ($query, $botType) {
                $query->where('bot_type', $botType);
            })
            ->withCount(['data as total_contacts'])
            ->withCount(['data as sent_count' => function ($query) {
                $query->where('status', true);
            }])
            ->withCount(['data as pending_count' => function ($query) {
                $query->where('status', false);
            }])
            ->paginate($request->per_page ?? 10);

        return $contacts;
    }

    public function store(Request $request)
    {
        $contact = Contact::create([
            'contact_name' => $request->contact_name,
            'bot_type' => $request->bot_type,
        ]);

        Excel::import(new ContactImport($contact), $request->file('file'));

        return to_route('contacts.index')->with('success', __('Contacts imported successfully.'));
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return to_route('contacts.index')->with('success', __('Contact deleted successfully.'));
    }

    public function getContact(Request $request)
    {
        return Contact::where('bot_type', $request->bot_type)
            ->get()
            ->map(function ($contact) {
                return [
                    'value' => $contact->id,
                    'label' => $contact->contact_name
                ];
            });
    }

    public function getContactCount(Request $request)
    {
        $count = Contact::withCount(['data'])
            ->findOrFail($request->contact_id)
            ->data_count;

        return response()->json([
            'count' => $count,
        ]);

    }
}
