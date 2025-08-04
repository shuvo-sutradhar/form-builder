<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        $user = $request->user();
        
        if ($user->hasVerifiedEmail()) {
            if ($user->isAdminOrStaff()) {
                return redirect()->intended(route('dashboard', absolute: false));
            } else {
                return redirect()->intended(route('client.dashboard', absolute: false));
            }
        }
        
        return Inertia::render('auth/VerifyEmail', ['status' => session('status')]);
    }
}
