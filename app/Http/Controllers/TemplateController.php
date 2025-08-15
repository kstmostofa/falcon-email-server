<?php

namespace App\Http\Controllers;

use App\Enums\TemplateType;
use App\Http\Requests\TemplateRequest;
use App\Models\Template;
use App\Models\TemplateData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TemplateController extends Controller
{
    public function index()
    {
        return Inertia::render('template/index');
    }

    public function datatable(Request $request)
    {
        return Template::query()
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->withCount('data as count')
            ->orderBy('name')
            ->paginate($request->per_page ?? 10);
    }

    public function create()
    {
        $templateTypes = TemplateType::all();
        return Inertia::render('template/create', [
            'templateTypes' => $templateTypes,
        ]);
    }

    public function store(TemplateRequest $request)
    {
        $template = Template::create($request->validated());
        if ($request->content_type === TemplateType::PLAIN_TEXT->value) {
            $file = $request->file('file');
            if ($file) {
                $lines = file($file->getRealPath(), FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

                $bulkInsert = [];
                $timestamp = now();

                foreach ($lines as $line) {
                    $data = trim($line);

                    if (!empty($data)) {
                        $bulkInsert[] = [
                            'template_id' => $template->id,
                            'content' => $data,
                            'content_type' => TemplateType::PLAIN_TEXT->value,
                            'created_at' => $timestamp,
                            'updated_at' => $timestamp,
                        ];
                    }
                }

                $bulkInsert = collect($bulkInsert)->unique('content')->values()->all();
                TemplateData::insert($bulkInsert);
            }
        }

        if ($request->content_type === TemplateType::HTML->value) {
            $templates = $request->input('templates', []);

            $bulkInsert = [];
            $timestamp = now();
            foreach ($templates as $content) {
                $content = trim($content);

                if (!empty($content)) {
                    $bulkInsert[] = [
                        'template_id' => $template->id,
                        'content' => $content,
                        'content_type' => TemplateType::HTML->value,
                        'created_at' => $timestamp,
                        'updated_at' => $timestamp,
                    ];
                }
            }
            $bulkInsert = collect($bulkInsert)->unique('content')->values()->all();

            TemplateData::insert($bulkInsert);
        }

        return to_route('templates.index')->with('success', 'Template created successfully.');
    }

    public function destroy(Template $template)
    {
        $template->data()->delete();
        $template->delete();

        return to_route('templates.index')->with('success', 'Template deleted successfully.');
    }

    public function getTemplate(Request $request)
    {
        return Template::query()
            ->get()
            ->map(function ($template) {
                return [
                    'value' => $template->id,
                    'label' => $template->name,
                ];
            });
    }
}
