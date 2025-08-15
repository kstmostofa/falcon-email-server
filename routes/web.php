<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('contacts', \App\Http\Controllers\ContactController::class)
        ->only(['index', 'store', 'destroy'])
        ->names('contacts');
    Route::get('contact/datatable', [\App\Http\Controllers\ContactController::class, 'datatable'])->name('contacts.datatable');
    Route::get('get-contact', [\App\Http\Controllers\ContactController::class, 'getContact'])->name('get_contact');
    Route::get('get-contact-count', [\App\Http\Controllers\ContactController::class, 'getContactCount'])->name('get_contact_count');

    Route::resource('sender-name', \App\Http\Controllers\SenderNameController::class)
        ->only(['index', 'store', 'destroy'])
        ->names('sender_name');
    Route::get('sender-name/datatable', [\App\Http\Controllers\SenderNameController::class, 'datatable'])->name('sender_name.datatable');
    Route::get('get-sender-name', [\App\Http\Controllers\SenderNameController::class, 'getSenderName'])->name('get_sender_name');


    Route::resource('subjects', \App\Http\Controllers\SubjectController::class)
        ->only(['index', 'store', 'destroy'])
        ->names('subjects');
    Route::get('subjects/datatable', [\App\Http\Controllers\SubjectController::class, 'datatable'])->name('subjects.datatable');
    Route::get('get-subject', [\App\Http\Controllers\SubjectController::class, 'getSubject'])->name('get_subject');

    Route::resource('templates', \App\Http\Controllers\TemplateController::class)
        ->only(['index', 'create', 'store', 'destroy'])
        ->names('templates');
    Route::get('templates/datatable', [\App\Http\Controllers\TemplateController::class, 'datatable'])->name('templates.datatable');
    Route::get('templates/get-template', [\App\Http\Controllers\TemplateController::class, 'getTemplate'])->name('get_template');

    Route::resource('attachments', \App\Http\Controllers\AttachmentController::class)
        ->only(['index', 'store', 'destroy'])
        ->names('attachments');
    Route::get('attachments/datatable', [\App\Http\Controllers\AttachmentController::class, 'datatable'])->name('attachments.datatable');
    Route::get('get-attachment', [\App\Http\Controllers\AttachmentController::class, 'getAttachment'])->name('get_attachment');

    Route::resource('smtp', \App\Http\Controllers\SmtpController::class)
        ->only(['index', 'store', 'destroy'])
        ->names('smtp');
    Route::get('smtp/datatable', [\App\Http\Controllers\SmtpController::class, 'datatable'])->name('smtp.datatable');
    Route::get('get-smtp', [\App\Http\Controllers\SmtpController::class, 'getSmtp'])->name('get_smtp');
    Route::get('get-smtp-count', [\App\Http\Controllers\SmtpController::class, 'getSmtpCount'])->name('get_smtp_count');

    Route::get('tasks', [\App\Http\Controllers\TaskController::class, 'index'])->name('tasks.index');
    Route::get('tasks/datatable', [\App\Http\Controllers\TaskController::class, 'datatable'])->name('tasks.datatable');
    Route::post('tasks/store', [\App\Http\Controllers\TaskController::class, 'store'])->name('tasks.store');
    Route::post('tasks/{task}/start', [\App\Http\Controllers\TaskController::class, 'start'])->name('tasks.start');

    Route::resource('gmail-api-tasks', \App\Http\Controllers\GmailApiTaskController::class)
        ->only(['index', 'store', 'destroy'])
        ->names('gmail_api_tasks');
    Route::get('gmail-api-tasks/datatable', [\App\Http\Controllers\GmailApiTaskController::class, 'datatable'])->name('gmail_api_tasks.datatable');
    Route::post('gmail-api-tasks/{task}/start', [\App\Http\Controllers\GmailApiTaskController::class, 'start'])->name('gmail_api_tasks.start');

    Route::resource('providers', \App\Http\Controllers\ProviderController::class)
        ->only(['index', 'store', 'destroy'])
        ->names('providers');
    Route::get('providers/datatable', [\App\Http\Controllers\ProviderController::class, 'datatable'])->name('providers.datatable');
    Route::get('get-provider', [\App\Http\Controllers\ProviderController::class, 'getProvider'])->name('get_provider');
    Route::get('get-region', [\App\Http\Controllers\ProviderController::class, 'getRegion'])->name('get_region');

    Route::get('vps', [\App\Http\Controllers\VpsController::class, 'index'])->name('vps.index');
    Route::get('vps/datatable', [\App\Http\Controllers\VpsController::class, 'datatable'])->name('vps.datatable');
    Route::delete('vps/{vps}', [\App\Http\Controllers\VpsController::class, 'destroy'])->name('vps.destroy');
    Route::get('vps/update-ip-address/{vps}', [\App\Http\Controllers\VpsController::class, 'updateIpAddress'])->name('vps.update_ip_address');
    Route::get('update-all-vps-ip-address', [\App\Http\Controllers\VpsController::class, 'updateAllIpAddresses'])->name('update_all_vps_ip_address');
});

Route::get('test', [\App\Http\Controllers\TencentController::class, 'index'])->name('test');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
