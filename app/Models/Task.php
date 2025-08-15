<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Task extends Model
{
    protected $fillable = [
        'name',
        'contact_id',
        'sender_name_id',
        'subject_id',
        'template_id',
        'attachment_id',
        'smtp_id',
        'bot_type',
        'region',
        'thread_count',
        'bot_count',
        'time',
        'status',
        'smtp_count',
        'smtp_limit',
        'smtp_per_bot',
        'thread_capacity',
        'contact_count',
        'contact_per_bot',
        'provider_id',
        'vps_template_id',
        'vps_template_version',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function contactData(): HasManyThrough
    {
        return $this->hasManyThrough(ContactData::class, Contact::class, 'id', 'contact_id', 'contact_id', 'id');
    }

    public function senderName(): BelongsTo
    {
        return $this->belongsTo(SenderName::class);
    }

    public function senderNameData(): HasManyThrough
    {
        return $this->hasManyThrough(SenderNameData::class, SenderName::class, 'id', 'sender_name_id', 'sender_name_id', 'id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function subjectData(): HasManyThrough
    {
        return $this->hasManyThrough(SubjectData::class, Subject::class, 'id', 'subject_id', 'subject_id', 'id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    public function templateData(): HasManyThrough
    {
        return $this->hasManyThrough(TemplateData::class, Template::class, 'id', 'template_id', 'template_id', 'id');
    }

    public function attachment(): BelongsTo
    {
        return $this->belongsTo(Attachment::class);
    }

    public function attachmentData(): HasManyThrough
    {
        return $this->hasManyThrough(AttachmentData::class, Attachment::class, 'id', 'attachment_id', 'attachment_id', 'id');
    }


    public function smtp(): BelongsTo
    {
        return $this->belongsTo(Smtp::class);
    }

    public function smtpData(): HasManyThrough
    {
        return $this->hasManyThrough(SmtpData::class, Smtp::class, 'id', 'smtp_id', 'smtp_id', 'id');
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

}
