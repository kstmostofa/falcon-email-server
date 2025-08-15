<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Template extends Model
{
    protected $fillable = [
        'name',
        'content_type'
    ];

    public function data(): HasMany
    {
        return $this->hasMany(TemplateData::class);
    }
}
