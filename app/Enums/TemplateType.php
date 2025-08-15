<?php

namespace App\Enums;

enum TemplateType: string
{
    case PLAIN_TEXT = 'PLAIN_TEXT';
    case HTML = 'HTML';

    public static function labels(): array
    {
        return array_map(fn($case) => str_replace('_', ' ', $case->name), self::cases());
    }

    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    public static function all(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => str_replace('_', ' ', $case->name),
        ], self::cases());
    }
}
