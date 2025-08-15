<?php

namespace App\Http\Requests;

use App\Enums\BotType;
use App\Enums\Tencent;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'bot_type' => [
                'required',
                'string',
                Rule::in(BotType::values())
            ],
            'contact_id' => 'required|exists:contacts,id',
            'sender_name_id' => 'required|exists:sender_names,id',
            'subject_id' => 'required|exists:subjects,id',
            'template_id' => 'required|exists:templates,id',
            'attachment_id' => 'required|exists:attachments,id',
            'smtp_id' => 'required|exists:smtps,id',
            'smtp_limit' => 'required|integer|min:1',
            'time' => 'required|integer|min:1',
            'contact_count' => 'required|integer',
            'bot_count' => 'required|integer|min:1',
            'thread_count' => 'required|integer|min:1',
            'thread_capacity' => 'required|integer|min:1',
            'smtp_per_bot' => 'required|integer|min:1',
            'smtp_count' => ['required', 'integer', 'min:1'],
            'region' => [
                'required',
                'string',
            ],
            'contact_per_bot' => 'required|integer|min:1',
            'provider_id' => 'required|exists:providers,id',
        ];
    }
}
