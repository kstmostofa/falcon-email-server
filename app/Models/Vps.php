<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vps extends Model
{
    protected $fillable = [
        'task_id',
        'gmail_api_task_id',
        'instance_id',
        'ip_address',
        'provider_id',
        'status',
        'region',
        'last_heartbeat',
        'bot_type',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function gmailApiTask(): BelongsTo
    {
        return $this->belongsTo(GmailApiTask::class);
    }

    public function smtp(): BelongsTo
    {
        return $this->belongsTo(SmtpData::class, 'vps_ip_address', 'ip_address');
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(ContactData::class, 'vps_ip_address', 'ip_address');
    }
}
