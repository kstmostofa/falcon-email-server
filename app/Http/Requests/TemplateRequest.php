<?php

namespace App\Http\Requests;

use App\Enums\TemplateType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TemplateRequest extends FormRequest
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
            'content_type' => [
                'required',
                'string',
                Rule::in(TemplateType::values()),
            ],
            'file' => 'nullable|required_if:content_type,PLAIN_TEXT|file|mimes:txt',
            'templates' => 'nullable|required_if:content_type,HTML|array',
            'templates.*' => 'nullable|required_with:templates|string',
        ];
    }
}
