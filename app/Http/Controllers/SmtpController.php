<?php

namespace App\Http\Controllers;

use App\Enums\BotType;
use App\Imports\SmtpImport;
use App\Models\Contact;
use App\Models\Smtp;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class SmtpController extends Controller
{
    public function index()
    {
        return Inertia::render('smtp/index', [
            'botTypes' => BotType::all(),
        ]);
    }

    public function datatable(Request $request)
    {
        return Smtp::query()
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->withCount('data as count')
            ->orderBy('name')
            ->paginate($request->per_page ?? 10);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'bot_type' => 'required|in:' . implode(',', BotType::values()),
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        $smtp = Smtp::create($request->only(['name', 'bot_type']));

        Excel::import(new SmtpImport($smtp), $request->file('file'));

        return redirect()->route('smtp.index')->with('success', 'SMTP settings saved successfully.');
    }

    public function destroy(Smtp $smtp)
    {
        $smtp->data()->delete();
        $smtp->delete();

        return redirect()->route('smtp.index')->with('success', 'SMTP settings deleted successfully.');
    }

    public function getSmtp(Request $request)
    {
        return Smtp::query()
            ->where('bot_type', $request->bot_type)
            ->get()
            ->map(function ($smtp) {
                return [
                    'value' => $smtp->id,
                    'label' => $smtp->name,
                ];
            });
    }

    public function getSmtpCount(Request $request)
    {

        $count = Smtp::withCount(['data'])
            ->findOrFail($request->smtp_id)
            ->data_count;

        return response()->json([
            'count' => $count,
        ]);


    }
}
