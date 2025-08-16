<?php

use App\Enums\ApiKey;
use App\Http\Controllers\Api\BotController;
use App\Http\Middleware\CheckApiKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('generate-api-key', function (Request $request) {
    $payload = ApiKey::PAYLOAD->value . '-' . $request->ip();
    $secret = ApiKey::SECRET->value;
    $apiKey = hash_hmac('sha256', $payload, $secret);
    return response()->json([
        'api_key' => $apiKey,
        'message' => 'API key generated successfully.',
    ], \Illuminate\Http\Response::HTTP_CREATED);
});

Route::middleware(CheckApiKey::class)->prefix('v1')->group(function () {
    Route::get('get-contacts', [BotController::class, 'getContacts'])->name('bot.get_contacts');
    Route::put('update-contact/{contactData}', [BotController::class, 'updateContact'])->name('bot.update_contact');
    Route::put('bulk-update-contacts', [BotController::class, 'bulkUpdateContacts'])->name('bot.bulk_update_contacts');

    Route::get('get-smtp', [BotController::class, 'getSmtp'])->name('bot.get_smtp');
    Route::put('update-smtp/{smtpData}', [BotController::class, 'updateSmtp'])->name('bot.update_smtp');
    Route::put('bulk-update-smtp', [BotController::class, 'bulkUpdateSmtp'])->name('bot.bulk_update_smtp');

    Route::get('get-sender-names', [BotController::class, 'getSenderNames'])->name('bot.get_sender_names');
    Route::get('get-subjects', [BotController::class, 'getSubjects'])->name('bot.get_subjects');
    Route::get('get-templates', [BotController::class, 'getTemplates'])->name('bot.get_templates');
    Route::get('get-attachments', [BotController::class, 'getAttachments'])->name('bot.get_attachments');

    Route::post('send-heartbeat', [BotController::class, 'sendHeartbeat'])->name('bot.send_heartbeat');


    Route::get('get-bot', function (Request $request) {
        $botdirectory = base_path('python_bot');
        $zipFileName = 'bot.zip';
        $zip = new ZipArchive();
        if ($zip->open($zipFileName, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            $files = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($botdirectory),
                RecursiveIteratorIterator::LEAVES_ONLY
            );

            foreach ($files as $name => $file) {
                if (!$file->isDir()) {
                    $filePath = $file->getRealPath();
                    $relativePath = substr($filePath, strlen($botdirectory) + 1);
                    $zip->addFile($filePath, $relativePath);
                }
            }
            $zip->close();
        }

        return response()->download($zipFileName)->deleteFileAfterSend(true);
    })->name('bot.get_bot');

});


