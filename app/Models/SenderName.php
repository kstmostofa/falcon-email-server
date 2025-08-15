<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SenderName extends Model
{
    protected $fillable = [
        'name',
    ];

    public function data(): HasMany
    {
        return $this->hasMany(SenderNameData::class);
    }
}
