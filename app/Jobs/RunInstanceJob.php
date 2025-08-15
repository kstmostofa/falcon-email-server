<?php

namespace App\Jobs;

use App\Enums\TaskStatus;
use App\Models\Provider;
use App\Models\Task;
use App\Models\Vps;
use App\Services\SshService;
use App\Services\TencentService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class RunInstanceJob implements ShouldQueue
{
    use Queueable;

    protected $timeout = 0;
    protected $retries = 0;

    /**
     * Create a new job instance.
     */
    public function __construct(protected Task $task, protected Provider $provider)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $limit = $this->task->bot_count;
        $region = $this->task->region;
        $templateId = $this->task->vps_template_id;
        $templateVersion = $this->task->vps_template_version;

        $providerName = $this->provider->name;
        $apiKey = $this->provider->api_key;
        $apiSecret = $this->provider->api_secret;

        /** @var TencentService $tencent */
        $tencent = new TencentService($apiKey, $apiSecret, $region);

        for ($i = 1; $i <= $limit; $i++) {
            try {
                $instanceId = $tencent->runInstances($templateId, $templateVersion);

                if ($instanceId) {
                    Vps::create([
                        'task_id' => $this->task->id,
                        'provider_id' => $this->provider->id,
                        'instance_id' => $instanceId,
                        'region' => $region,
                        'status' => 'pending',
                        'bot_type' => $this->task->bot_type,
                    ]);
                    Log::info("Instance created for task {$this->task->name} on attempt {$i}: Instance ID {$instanceId}");
                } else {
                    Log::error("Failed to create instance for task {$this->task->name} on attempt {$i}: No instance ID returned");
                }
            } catch (Exception $e) {
                Log::error("Failed to create instance for task {$this->task->id} on attempt {$i}: " . $e->getMessage());
            }
        }

        $this->task->update(['status' => TaskStatus::COMPLETED->value]);
        Log::info("Task {$this->task->id} completed with provider {$this->provider->name}");

    }

    /**
     * Handle a job failure.
     */
    public function failed(Exception $exception): void
    {
        $this->task->update(['status' => TaskStatus::FAILED->value]);
        Log::error("Job failed for task {$this->task->id} with provider {$this->provider->name}: " . $exception->getMessage());
    }
}
