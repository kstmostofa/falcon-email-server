<?php

namespace App\Imports;

use App\Models\Contact;
use App\Models\ContactData;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithSkipDuplicates;
use Maatwebsite\Excel\Concerns\WithValidation;

class ContactImport implements ToCollection, WithHeadingRow, WithValidation, WithChunkReading, ShouldQueue, WithSkipDuplicates
{
    public $timeout = 0;
    public $tries = 0;

    public function __construct(protected Contact $contact)
    {
        // You can initialize any properties or dependencies here if needed
    }

    public function collection(Collection $collection)
    {
        $data = $collection->map(function ($row) {
            return [
                'contact_id' => $this->contact->id,
                'name' => $row['name'],
                'email' => $row['email'],
                'status' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        })->toArray();

        ContactData::insert($data);

        Log::info(count($data) . ' contacts imported successfully.');
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ];
    }

    public function chunkSize(): int
    {
        return 1000;
    }


}
