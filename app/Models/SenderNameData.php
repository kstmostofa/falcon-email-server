<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SenderNameData extends Model
{
    protected $fillable = [
        'sender_name_id',
        'name',
    ];

    public function name(): BelongsTo
    {
        return $this->belongsTo(SenderName::class);
    }
}
