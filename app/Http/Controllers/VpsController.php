<?php

namespace App\Http\Controllers;

use App\Enums\BotType;
use App\Jobs\DistributeDataAndUpdateVpsIpAddressJob;
use App\Models\ContactData;
use App\Models\SmtpData;
use App\Models\Vps;
use App\Services\TencentService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VpsController extends Controller
{
    public function index()
    {
        return Inertia::render('vps/index');
    }

    public function datatable(Request $request)
    {
        return Vps::query()
            ->with(['task', 'gmailApiTask', 'provider'])
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'ilike', '%' . $request->search . '%')
                    ->orWhere('ip_address', 'ilike', '%' . $request->search . '%');
            })
            ->orderBy($request->sort ?? 'created_at', $request->direction ?? 'desc')
            ->paginate($request->perPage ?? 10);
    }

    public function updateIpAddress(Vps $vps)
    {
        $tencent = new TencentService($vps->provider->api_key, $vps->provider->api_secret, $vps->region);
        try {
            $ipAddress = $tencent->getPublicIpAddress($vps->instance_id);
            $vps->update(['ip_address' => $ipAddress]);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Failed to update IP address: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'ip_address' => $vps->ip_address,
        ]);
    }

    public function destroy(Vps $vps)
    {
        $tencent = new TencentService($vps->provider->api_key, $vps->provider->api_secret, $vps->region);
        try {
            $tencent->terminateInstance($vps->instance_id);
        } catch (Exception $e) {
            session()->flash('error', 'Maybe the VPS is already deleted or terminated from the provider. anyway, it has been removed from the list.');
        }
        $vps->delete();
        return redirect()->route('vps.index')->with('success', 'VPS deleted successfully.');
    }



    public function updateAllIpAddresses(Request $request)
    {
        $allVps = Vps::whereNull('ip_address')->get();

        if ($allVps->isEmpty()) {
            return back()->with('error', 'No VPS found with null IP address.');
        }

        DistributeDataAndUpdateVpsIpAddressJob::dispatch($allVps);

        return back()->with('success', 'VPS IP addresses update job has been dispatched successfully.');

    }


}
