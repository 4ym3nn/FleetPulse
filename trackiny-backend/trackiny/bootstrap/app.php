<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\EnsureTokenIsValid;
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(

        commands: __DIR__.'/../routes/console.php',
        using: function () {

     Route::middleware('api')
        ->prefix('api')
        ->group(function () {
            require base_path('routes/api.php');
        });


        Route::middleware('web')

            ->group(base_path('routes/web.php'));

    },
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(EnsureTokenIsValid::class);
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
