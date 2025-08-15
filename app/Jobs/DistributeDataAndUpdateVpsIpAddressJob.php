<?php

namespace App\Jobs;

use App\Enums\BotType;
use App\Models\ContactData;
use App\Models\SmtpData;
use App\Models\Vps;
use App\Services\TencentService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class DistributeDataAndUpdateVpsIpAddressJob implements ShouldQueue
{
    use Queueable;

    protected $timeout = 0;
    protected $retries = 0;

    public function __construct(protected Collection $vpsCollection)
    {
        //
    }

    public function handle(): void
    {
        $this->vpsCollection->each(function (Vps $vps) {
            try {
                $this->updateVpsIp($vps);

                $botType = $this->getBotType($vps);
                if (!$botType) {
                    Log::warning("No bot type found for VPS ID {$vps->id}");
                    return;
                }

                match ($botType) {
                    BotType::GMAIL_API->value,
                    BotType::GMAIL_COMPOSE->value,
                    BotType::SMTP_MAILER->value => $this->handleEmailBots($vps),
                    BotType::GMAIL_API_OAUTH->value => $this->handleOauthBots($vps),
                    default => Log::info("No data distribution required for bot type {$botType} (VPS ID {$vps->id})"),
                };
            } catch (Exception $e) {
                Log::error("Failed processing VPS ID {$vps->id}: {$e->getMessage()}", [
                    'exception' => $e
                ]);
            }
        });
    }

    private function updateVpsIp(Vps $vps): void
    {
        $tencent = new TencentService(
            $vps->provider->api_key,
            $vps->provider->api_secret,
            $vps->region
        );

        $ipAddress = $tencent->getPublicIpAddress($vps->instance_id);
        $vps->update(['ip_address' => $ipAddress]);

        Log::info("Updated IP address for VPS ID {$vps->id} → {$ipAddress}");
    }

    private function handleEmailBots(Vps $vps): void
    {
        $smtpPerBot = $this->getSmtpPerBot($vps);
        $contactPerBot = $this->getContactPerBot($vps);

        if ($smtpPerBot > 0) {
            $this->assignSmtpToVps($vps, $smtpPerBot);
            Log::info("Assigned {$smtpPerBot} SMTP(s) to VPS ID {$vps->id}");
        }

        if ($contactPerBot > 0) {
            $this->assignContactsToVps($vps, $contactPerBot);
            Log::info("Assigned {$contactPerBot} contact(s) to VPS ID {$vps->id}");
        }
    }

    private function handleOauthBots(Vps $vps): void
    {
        $smtpPerBot = $this->getSmtpPerBot($vps);

        if ($smtpPerBot > 0) {
            $this->assignSmtpToVps($vps, $smtpPerBot);
            Log::info("Assigned {$smtpPerBot} SMTP(s) to VPS ID {$vps->id}");
        }
    }

    private function getBotType(Vps $vps): ?string
    {
        return $vps->task?->bot_type ?? $vps->gmailApiTask?->bot_type ?? $vps->bot_type;
    }

    private function getSmtpPerBot(Vps $vps): int
    {
        return $vps->task?->smtp_per_bot ?? $vps->gmailApiTask?->smtp_per_bot ?? 0;
    }

    private function getContactPerBot(Vps $vps): int
    {
        return $vps->task?->contact_per_bot ?? 0;
    }

    private function assignSmtpToVps(Vps $vps, int $smtpPerBot): void
    {
        SmtpData::query()
            ->where('smtp_id', $vps->task?->smtp_id ?? $vps->gmailApiTask?->smtp_id)
            ->whereNull('vps_ip_address')
            ->take($smtpPerBot)
            ->update(['vps_ip_address' => $vps->ip_address]);
    }

    private function assignContactsToVps(Vps $vps, int $contactPerBot): void
    {
        ContactData::query()
            ->where('contact_id', $vps->task?->contact_id)
            ->whereNull('vps_ip_address')
            ->take($contactPerBot)
            ->update(['vps_ip_address' => $vps->ip_address]);
    }
}
