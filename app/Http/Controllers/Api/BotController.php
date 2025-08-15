<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactResource;
use App\Http\Resources\SmtpResource;
use App\Models\Contact;
use App\Models\ContactData;
use App\Models\SmtpData;
use App\Models\Vps;
use Illuminate\Http\Request;

class BotController extends Controller
{

    public function getContacts(Request $request)
    {
        $contacts = ContactData::query()
            ->where('vps_ip_address', $request->ip())
            ->get();

        return ContactResource::collection($contacts);
    }


    public function updateContact(Request $request, ContactData $contactData)
    {
        $contact = ContactData::findOrFail($contactData->id);
        $contact->update($request->all());

        return new ContactResource($contact);
    }

    public function bulkUpdateContacts(Request $request)
    {
        ContactData::query()
            ->whereIn('id', $request->input('contact_ids'))
            ->update([
                'status' => $request->input('status'),
            ]);

        return ContactResource::collection(
            ContactData::query()
                ->whereIn('id', $request->input('contact_ids'))
                ->get()
        );
    }

    public function getSmtp(Request $request)
    {
        $smtps = SmtpData::query()
            ->where('vps_ip_address', $request->ip())
            ->get();

        return SmtpResource::collection($smtps);
    }

    public function updateSmtp(Request $request, SmtpData $smtpData)
    {
        $smtp = SmtpData::findOrFail($smtpData->id);
        $smtp->update($request->all());

        return new SmtpResource($smtp);
    }

    public function bulkUpdateSmtp(Request $request)
    {
        SmtpData::query()
            ->whereIn('id', $request->input('smtp_ids'))
            ->update($request->except('smtp_ids'));

        return SmtpResource::collection(
            SmtpData::query()
                ->whereIn('id', $request->input('smtp_ids'))
                ->get()
        );
    }

    public function getSenderNames(Request $request)
    {
        $vps = Vps::query()
            ->where('ip_address', $request->ip())
            ->first();

        $senderNames = $vps->task?->senderNameData?->pluck('name')->toArray();

        return response()->json([
            'data' => $senderNames,
        ]);
    }

    public function getSubjects(Request $request)
    {
        $vps = Vps::query()
            ->where('ip_address', $request->ip())
            ->first();

        $subjects = $vps->task?->subjectData?->pluck('subject')->toArray();

        return response()->json([
            'data' => $subjects,
        ]);
    }

    public function getTemplates(Request $request)
    {
        $vps = Vps::query()
            ->where('ip_address', $request->ip())
            ->first();

        $templates = $vps->task?->templateData->pluck('content')->toArray();

        return response()->json([
            'data' => $templates,
        ]);
    }

    public function getAttachments(Request $request)
    {
        $vps = Vps::query()
            ->where('ip_address', $request->ip())
            ->first();

        $attachments = $vps->task?->attachmentData->pluck('file_url')->toArray();

        return response()->json([
            'data' => $attachments,
        ]);
    }

    public function sendHeartbeat(Request $request)
    {
        $vps = Vps::query()
            ->where('ip_address', $request->ip())
            ->first();

        if(!$vps) {
            return response()->json(['error' => 'VPS not found'], 404);
        }

        $vps->update(['last_heartbeat' => now()]);

        return response()->json(['message' => 'Heartbeat received successfully']);
    }


}
