<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Contact extends Model
{
    protected $fillable = [
        'contact_name',
        'bot_type',
    ];

    public function data(): HasMany
    {
        return $this->hasMany(ContactData::class);
    }

}
