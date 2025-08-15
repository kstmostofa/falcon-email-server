<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateData extends Model
{
    protected $fillable = [
        'template_id',
        'content',
        'content_type',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

}
