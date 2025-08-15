<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum VpsVendor: string
{
    case AWS = 'AWS';
    case TENCENT = 'TENCENT';
    case HETZNER = 'HETZNER';


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
