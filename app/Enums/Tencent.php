<?php

namespace App\Enums;

enum Tencent: string
{
    case TEMPLATE_ID = 'lt-dh287b81';
    case SECRET_ID = 'IKID61jHix1xjLtGWZS9fz84nLiX0IMDrIVh';
    case SECRET_KEY = '5whFaidKn8GAtQmvsfGfrpaAZoqhLo59';
    case API_BASE_URL = 'cvm.intl.tencentcloudapi.com';
    case REGION_SILICON_VALLEY = 'na-siliconvalley';
    case REGION_ASHBURN = 'na-ashburn';
    case SILICON_VALLEY_TEMPLATE_ID = 'lt-2d9qetfd';
    case ASHBURN_TEMPLATE_ID = 'alt-2d9qetfd';
    case API_VERSION = '2017-03-12';
    case SERVICE = 'cvm';

    case PRIVATE_KEY_FILE = 'tencent.pem';

    public static function regions(): array
    {
        return [
            [
                'label' => 'Silicon Valley',
                'value' => self::REGION_SILICON_VALLEY->value,
            ],
            [
                'label' => 'Ashburn',
                'value' => self::REGION_ASHBURN->value,
            ],
        ];
    }

    public static function regionValues(): array
    {
        return [
            self::REGION_SILICON_VALLEY->value,
            self::REGION_ASHBURN->value,
        ];
    }
}
