<?php

namespace App\Http\Resources;

use App\Models\SmtpData;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin SmtpData */
class SmtpResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'password' => $this->password,
            'recovery_email' => $this->recovery_email,
            'oauth_json' => $this->oauth_json,
            'access_token' => $this->access_token,
            'refresh_token' => $this->refresh_token,
            'smtp_host' => $this->smtp_host,
            'smtp_port' => $this->smtp_port,
            'smtp_domain_name' => $this->smtp_domain_name,
            'last_refresh_time' => $this->last_refresh_time,
            'status' => $this->status,
            'count' => $this->count,
        ];
    }
}
