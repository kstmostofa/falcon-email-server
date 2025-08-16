<?php

namespace App\Http\Controllers;

use App\Enums\BotType;
use App\Enums\TaskStatus;
use App\Enums\Tencent;
use App\Http\Requests\TaskRequest;
use App\Jobs\RunInstanceJob;
use App\Models\Contact;
use App\Models\Provider;
use App\Models\SenderName;
use App\Models\Smtp;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        return Inertia::render('task/index', [
            'botTypes' => BotType::all([BotType::GMAIL_API_OAUTH->value]),
            'regions' => Tencent::regions(),
        ]);
    }

    public function datatable(Request $request)
    {
        $tasks = Task::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->bot_type, function ($query, $botType) {
                $query->where('bot_type', $botType);
            })
            ->with(['contact', 'senderName', 'subject', 'template', 'attachment', 'smtp'])
            ->withCount(['contactData as sent_count' => function ($query) {
                $query->where('status', true);
            }])
            ->withCount(['contactData as pending_count' => function ($query) {
                $query->where('status', false);
            }])
            ->paginate($request->per_page ?? 10);

        return $tasks;
    }

    public function store(TaskRequest $request)
    {

        $smtpCount = Smtp::withCount(['data'])
            ->findOrFail($request->smtp_id)->data_count;


        if ($smtpCount < $request->smtp_count) {
            return back()->withErrors(['smtp_count' => 'You don\'t have enough SMTP accounts.']);
        }

        $provider = Provider::findOrFail($request->provider_id);
        $vps_template_id = $provider->template_id;
        $vps_template_version = $provider->template_version;

        $task = Task::create(array_merge($request->validated(), [
            'status' => TaskStatus::PENDING,
            'vps_template_id' => $vps_template_id,
            'vps_template_version' => $vps_template_version,
        ]));

        return back()->with('success', 'Task created successfully.');
    }

    public function start(Task $task)
    {

        RunInstanceJob::dispatch($task, $task->provider);
        $task->update(['status' => TaskStatus::PROCESSING->value]);

        return back()->with('success', 'Task is now running.');
    }
}
