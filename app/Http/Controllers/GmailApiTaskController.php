<?php

namespace App\Http\Controllers;

use App\Enums\TaskStatus;
use App\Http\Requests\GmailApiTaskRequest;
use App\Jobs\RunGmailApiInstanceJob;
use App\Jobs\RunInstanceJob;
use App\Models\GmailApiTask;
use App\Models\Provider;
use App\Models\Task;
use Illuminate\Http\Request;

class GmailApiTaskController extends Controller
{
    public function index()
    {
        return inertia('gmail-api-task/index');
    }

    public function datatable(Request $request)
    {
        return GmailApiTask::query()
            ->with(['smtp', 'provider'])
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'ilike', '%' . $request->search . '%');
            })
            ->withCount(['smtpData as smtp_count'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    }

    public function store(GmailApiTaskRequest $request)
    {
        $provider = Provider::findOrFail($request->provider_id);
        $vps_template_id = $provider->template_id;
        $vps_template_version = $provider->template_version;

        GmailApiTask::create(array_merge($request->validated(), [
            'status' => TaskStatus::PENDING,
            'vps_template_id' => $vps_template_id,
            'vps_template_version' => $vps_template_version,
        ]));

        return redirect()->route('gmail_api_tasks.index')->with('success', __('Gmail API task created successfully.'));
    }

    public function start(GmailApiTask $task)
    {

        RunGmailApiInstanceJob::dispatch($task, $task->provider);
        $task->update(['status' => TaskStatus::PROCESSING->value]);

        return back()->with('success', 'Task is now running.');
    }

    public function destroy(GmailApiTask $gmail_api_task)
    {
        $gmail_api_task->delete();
        return back()->with('success', __('Gmail API task deleted successfully.'));
    }
}
