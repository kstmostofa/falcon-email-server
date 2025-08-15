<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SmtpData extends Model
{
    protected $fillable = [
        'smtp_id',
        'email',
        'password',
        'recovery_email',
        'oauth_json',
        'access_token',
        'refresh_token',
        'smtp_host',
        'smtp_port',
        'smtp_domain_name',
        'last_refresh_time',
        'status',
        'count',
        'vps_ip_address',
    ];

    public function smtp(): BelongsTo
    {
        return $this->belongsTo(Smtp::class, 'smtp_id');
    }
}
