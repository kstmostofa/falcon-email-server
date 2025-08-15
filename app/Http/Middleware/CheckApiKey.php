<?php

namespace App\Http\Middleware;

use App\Enums\ApiKey;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckApiKey
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $except = [
            'api/generate-api-key',
        ];

        if ($request->is($except)) {
            return $next($request);
        }

        $apiKey = $request->header('X-API-KEY');
        $payload = ApiKey::PAYLOAD->value . '-' . $request->ip();
        $secret = ApiKey::SECRET->value;

        $validApiKey = hash_hmac('sha256', $payload, $secret);
        if (!$apiKey) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'API key is missing.'
            ], \Illuminate\Http\Response::HTTP_UNAUTHORIZED);
        }

        if (!hash_equals($validApiKey, $apiKey)) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'Invalid API key.'
            ], \Illuminate\Http\Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
