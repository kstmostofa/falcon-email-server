<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GmailApiTaskRequest extends FormRequest
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
            'smtp_id' => 'required|exists:smtps,id',
            'provider_id' => 'required|exists:providers,id',
            'name' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'time' => 'required|integer|min:1',
            'smtp_count' => 'required|integer|min:1',
            'bot_speed' => 'required|integer|min:1',
            'smtp_per_bot' => 'required|integer|min:1',
            'bot_count' => 'required|integer|min:1',
//            'vps_template_id' => 'required|string|max:255',
//            'vps_template_version' => 'required|string|max:255',
        ];
    }
}
