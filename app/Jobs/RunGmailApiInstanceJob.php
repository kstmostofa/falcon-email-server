<?php

namespace App\Jobs;

use App\Enums\BotType;
use App\Enums\TaskStatus;
use App\Models\GmailApiTask;
use App\Models\Provider;
use App\Models\Task;
use App\Models\Vps;
use App\Services\TencentService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class RunGmailApiInstanceJob implements ShouldQueue
{
    use Queueable;

    protected $timeout = 0;
    protected $retries = 0;

    /**
     * Create a new job instance.
     */
    public function __construct(protected GmailApiTask $task, protected Provider $provider)
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
                        'gmail_api_task_id' => $this->task->id,
                        'provider_id' => $this->provider->id,
                        'instance_id' => $instanceId,
                        'region' => $region,
                        'status' => 'pending',
                        'bot_type' => BotType::GMAIL_API_OAUTH->value,
                    ]);

                    Log::info("Gmail API Instance created for task {$this->task->name} on attempt {$i}: Instance ID {$instanceId}");
                } else {
                    Log::error("Failed to create Gmail API instance for task {$this->task->name} on attempt {$i}: No instance ID returned");
                }
            } catch (Exception $e) {
                Log::error("Failed to create Gmail API instance for task {$this->task->id} on attempt {$i}: " . $e->getMessage());
            }
        }

        $this->task->update(['status' => TaskStatus::COMPLETED->value]);

        Log::info("Gmail API task {$this->task->id} completed successfully.");

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
