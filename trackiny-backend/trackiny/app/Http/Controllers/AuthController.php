<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Transport;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

enum UserType: string
{
    case COMPANY = 'company';
    case TRANSPORT = 'transport';
}
class AuthController extends Controller
{
    public function login(Request $request)
    {
        $incomingFields = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        $user = User::where('email', $request->email)->first();
        if (! $user) {
            return response()->json(['message' => 'user does not exists'], 400);
        }
        $isAuthenticated=Hash::check($request->password, $user->password);
        if (!$isAuthenticated)  {

            return response()->json(['message' => 'password is incorrect'], 400);
        } else {
            $token = $user->createToken($user->name);
            return response()->json(['token' => $token->plainTextToken], 200);
        }

    }

    public function register(Request $request)
    {
        $incomingFields = $request->validate([
            'name' => ['required', 'min:3', 'max:20', Rule::Unique('users', 'username')],
            'email' => ['required', 'email', Rule::Unique('users', 'email')],
            'password' => ['required'],
            'type' => ['required', Rule::enum(UserType::class)],
        ]);
        $incomingFields['password'] = bcrypt($incomingFields['password']);
        $user = User::create($incomingFields);
        if ($user->type === 'company') {
            Company::create([
                'user_id' => $user->id,
                'company_name' => '',
                'registration_number' => '',
                'address' => '',
                'phone' => '',
                'contact_person' => '',
            ]);
        } elseif ($user->type === 'transport') {
            Transport::create([
                'user_id' => $user->id,
                'company_name' => '',
                'license_number' => '',
                'fleet_size' => 0,
                'registration_number' => '',
                'address' => '',
                'phone' => '',
                'contact_person' => '',
            ]);
        }

        return response()->json([
            'message' => 'User registered succesfully',
        ], 201);

    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['User logged out succesfully']);
    }
}
