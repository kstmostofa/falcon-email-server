<?php

namespace App\Imports;

use App\Models\Contact;
use App\Models\ContactData;
use App\Models\Smtp;
use App\Models\SmtpData;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\RegistersEventListeners;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithSkipDuplicates;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Events\AfterImport;
use PHPUnit\Event\Code\Throwable;

class SmtpImport implements ToCollection, WithHeadingRow, WithValidation, WithChunkReading, ShouldQueue, WithSkipDuplicates
{
    public $timeout = 0;
    public $tries = 0;

    public function __construct(protected Smtp $smtp)
    {
        // You can initialize any properties or dependencies here if needed
    }
    public function collection(Collection $collection)
    {
        $data = $collection->map(function ($row) {
            return [
                'smtp_id' => $this->smtp->id,
                'email' => $row['email'],
                'password' => $row['password'],
                'recovery_email' => $row['recovery_email'] ?? null,
                'smtp_host' => $row['smtp_host'] ?? null,
                'smtp_port' => $row['smtp_port'] ?? null,
                'smtp_domain_name' => $row['smtp_domain_name'] ?? null,
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        })->toArray();

        SmtpData::insert($data);

        Log::info(count($data) . ' SMTP accounts imported successfully.');
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email|max:255',
            'recover_email' => 'nullable|email|max:255',
            'password' => 'required|string|max:255',
            'smtp_host' => 'nullable|string|max:255',
            'smtp_port' => 'nullable|integer',
            'smtp_domain_name' => 'nullable|string|max:255',
        ];
    }

    public function chunkSize(): int
    {
        return 1000;
    }

}
