<?php

namespace App\Http\Controllers;

use App\Http\Requests\SenderNameRequest;
use App\Models\Contact;
use App\Models\ContactData;
use App\Models\SenderName;
use App\Models\SenderNameData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;

class SenderNameController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        return Inertia::render('sender_name/index');
    }

    /**
     * Get the data for the datatable.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */

    public function datatable(Request $request): LengthAwarePaginator
    {
        return SenderName::query()
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->withCount('data as count')
            ->orderBy('name')
            ->paginate($request->per_page ?? 10);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(SenderNameRequest $request)
    {
        $senderName = SenderName::create($request->validated());

        $file = $request->file('file');

        if ($file) {
            $lines = file($file->getRealPath(), FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

            $bulkInsert = [];
            $timestamp = now();

            foreach ($lines as $line) {
                $name = trim($line);

                if (!empty($name)) {
                    $bulkInsert[] = [
                        'sender_name_id' => $senderName->id,
                        'name' => $name,
                        'created_at' => $timestamp,
                        'updated_at' => $timestamp,
                    ];
                }
            }

            $bulkInsert = collect($bulkInsert)->unique('name')->values()->all();
            SenderNameData::insert($bulkInsert);
        }
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(SenderName $senderName): RedirectResponse
    {
        $senderName->data()->delete();
        $senderName->delete();

        return to_route('sender_name.index')->with('success', 'Sender name deleted successfully.');
    }

    public function getSenderName(Request $request)
    {
        return SenderName::get()
            ->map(function ($contact) {
                return [
                    'value' => $contact->id,
                    'label' => $contact->name,
                ];
            });
    }
}
