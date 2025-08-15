<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubjectRequest;
use App\Models\SenderName;
use App\Models\SenderNameData;
use App\Models\Subject;
use App\Models\SubjectData;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class SubjectController extends Controller
{

    public function index()
    {
        return Inertia::render('subject/index');
    }

    public function datatable(Request $request): LengthAwarePaginator
    {
        return Subject::query()
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->withCount('data as count')
            ->orderBy('name')
            ->paginate($request->per_page ?? 10);
    }
    public function store(SubjectRequest $request)
    {
        $subject = Subject::create($request->validated());

        $file = $request->file('file');

        if ($file) {
            $lines = file($file->getRealPath(), FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

            $bulkInsert = [];
            $timestamp = now();

            foreach ($lines as $line) {
                $data = trim($line);

                if (!empty($data)) {
                    $bulkInsert[] = [
                        'subject_id' => $subject->id,
                        'subject' => $data,
                        'created_at' => $timestamp,
                        'updated_at' => $timestamp,
                    ];
                }
            }

            $bulkInsert = collect($bulkInsert)->unique('subject')->values()->all();
            SubjectData::insert($bulkInsert);
        }
    }

    public function destroy(Subject $subject)
    {
        $subject->data()->delete();
        $subject->delete();

        return to_route('subjects.index')->with('success', 'Subject deleted successfully.');
    }

    public function getSubject(Request $request)
    {
       return Subject::query()
            ->get()
            ->map(function ($subject) {
                return [
                    'value' => $subject->id,
                    'label' => $subject->name,
                ];
            });

    }
}
