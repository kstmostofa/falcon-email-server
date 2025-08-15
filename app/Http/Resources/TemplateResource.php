<?php

namespace App\Http\Resources;

use App\Models\TemplateData;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin TemplateData */
class TemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'content_type' => $this->content_type,

        ];
    }
}
