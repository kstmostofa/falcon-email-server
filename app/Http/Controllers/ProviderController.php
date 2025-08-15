<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProviderRequest;
use App\Models\Provider;
use Illuminate\Http\Request;

class ProviderController extends Controller
{
    public function index()
    {
        return inertia('provider/index', [
            'providers' => \App\Enums\Provider::all(),
        ]);
    }

    public function datatable(Request $request)
    {
        return Provider::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->paginate($request->per_page ?? 10);

    }

    public function store(ProviderRequest $request)
    {
        Provider::create($request->validated());

        return redirect()->route('providers.index')->with('success', __('Provider created successfully.'));
    }

    public function destroy(Provider $provider)
    {
        $provider->delete();

        return redirect()->route('providers.index')->with('success', __('Provider deleted successfully.'));
    }

    public function getProvider(Request $request)
    {
        return Provider::query()
            ->get()
            ->map(function ($provider) {
                return [
                    'value' => $provider->id,
                    'label' => $provider->name . ' (' . $provider->template_id . ')',
                ];
            });
    }

    public function getRegion(Request $request)
    {
        return Provider::query()
            ->where('id', $request->provider_id)
            ->get()
            ->map(function ($provider) {
                return [
                    'value' => $provider->region,
                    'label' => $provider->region,
                ];
            });
    }
}
