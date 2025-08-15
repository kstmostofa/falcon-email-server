<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AttachmentController extends Controller
{
    public function index()
    {
        return Inertia::render('attachment/index');
    }

    public function datatable(Request $request)
    {
        return Attachment::query()
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
            'file' => 'required|array',
            'file.*' => 'file|mimes:jpg,jpeg,png,gif,pdf,', // Adjust file types and size as needed
        ]);

        $attachment = Attachment::create(['name' => $request->name]);
        foreach ($request->file('file') as $file) {
            $path = $file->store('attachments', 'public');
            $attachment->data()->create([
                'path' => $path,
                'file_url' => Storage::disk('public')->url($path),
            ]);
        }

        return redirect()->route('attachments.index')->with('success', 'Attachment uploaded successfully.');
    }

    public function destroy(Attachment $attachment)
    {
        foreach ($attachment->data as $data) {
            Storage::disk('public')->delete($data->path);
            $data->delete();
        }
        $attachment->delete();

        return redirect()->route('attachments.index')->with('success', 'Attachment deleted successfully.');
    }

    public function getAttachment(Request $request)
    {
        return Attachment::query()
            ->get()
            ->map(function ($attachment) {
                return [
                    'value' => $attachment->id,
                    'label' => $attachment->name,
                ];
            });
    }
}
