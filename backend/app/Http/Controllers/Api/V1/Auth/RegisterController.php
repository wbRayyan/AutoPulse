<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Actions\Auth\RegisterOrganization;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class RegisterController extends Controller
{
    /**
     * Register a new organization with its owner and issue an API token.
     */
    public function __invoke(RegisterRequest $request, RegisterOrganization $registerOrganization): JsonResponse
    {
        $owner = $registerOrganization->handle($request->validated());

        $token = $owner->createToken('api')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => new UserResource($owner),
                'token' => $token,
            ],
        ], Response::HTTP_CREATED);
    }
}