<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class GmailApiTask extends Model
{
    protected $fillable = [
        'smtp_id',
        'provider_id',
        'name',
        'region',
        'time',
        'smtp_count',
        'bot_speed',
        'smtp_per_bot',
        'bot_count',
        'vps_template_id',
        'vps_template_version',
        'status',
    ];

    public function smtp(): BelongsTo
    {
        return $this->belongsTo(Smtp::class);
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function smtpData(): HasManyThrough
    {
        return $this->hasManyThrough(SmtpData::class, Smtp::class, 'id', 'smtp_id', 'smtp_id', 'id');
    }


}
