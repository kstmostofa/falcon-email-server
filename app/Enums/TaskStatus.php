<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum TaskStatus: string
{
    case PENDING = 'PENDING';
    case PROCESSING = 'PROCESSING';
    case COMPLETED = 'COMPLETED';
    case FAILED = 'FAILED';

    public static function labels(): array
    {
        return array_map(fn($case) => Str::replace('_', ' ', $case->name), self::cases());
    }

    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    public static function all(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => Str::replace('_', ' ', $case->name),
        ], self::cases());
    }
}
