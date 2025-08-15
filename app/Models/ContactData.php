<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class ContactData extends Model
{
    protected $table = 'contact_data';
    protected $fillable = [
        'contact_id',
        'name',
        'email',
        'status',
        'vps_ip_address',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
}
