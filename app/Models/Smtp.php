<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Smtp extends Model
{
    protected $fillable = [
        'name',
        'bot_type',
    ];

    public function data(): HasMany
    {
        return $this->hasMany(SmtpData::class);
    }
}
