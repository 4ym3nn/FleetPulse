<?php

namespace App\Http\Controllers;

use  App\Enums;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\User;
use App\Models\Transport;
use App\Models\Company;
Enum UserType : string
{
    case COMPANY='company';
    case TRANSPORT='transport';
}
class UserController extends Controller
{
   public function isTransport(){
        return $this->role === 'transport';
    }
     public function isCompany(){
        return $this->role === 'company';
    }
   function login() {
        $incomingFields=request()->validate([
            'email'=>['required','email'],
            'password'=>['required']
        ]);
        if (auth()->attempt($incomingFields)) {
            session()->regenerate();
        return response()->json([
            'message' => 'User logged in succesfully'
        ],201);
        }
         else {
            return back()->withErrors(['email'=>'Invalid Credentials'])->onlyInput('email');
    }
     }
    function register() {
        $incomingFields=request()->validate([
            'name'=>['required','min:3','max:20',Rule::Unique('users','username')],
            'email'=>['required','email',Rule::Unique('users','email')],
            'password'=>['required'],
            'type'=>['required',Rule::enum(UserType::class)]
        ]);
        $incomingFields['password']=bcrypt($incomingFields['password']);
        $user=  User::create($incomingFields);
           if ($user->type === 'company') {
            Company::create([
                'user_id' => $user->id,
                'company_name' => '',
                'registration_number' => '',
                'address' => '',
                'phone' => '',
                'contact_person' => ''
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
                'contact_person' => ''
            ]);
        }
        auth()->login($user);
        return response()->json([
            'message' => 'User registered succesfully'
        ],201);


    }
    function logout() {
        $incomingFields=request()->validate([
            'username'=>['required','min:3','max:20'],
            'email'=>['required','email'],
            'password'=>['required']
        ]);
    }



}
