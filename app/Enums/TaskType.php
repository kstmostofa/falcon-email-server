<?php

namespace App\Enums;

enum TaskType: string
{
    case GMAIL_API = 'GMAIL_API';
    case GMAIL_API_OAUTH = 'GMAIL_API_OAUTH';
    case GMAIL_COMPOSE = 'GMAIL_COMPOSE';
    case SMTP_MAILER = 'SMTP_MAILER';

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
