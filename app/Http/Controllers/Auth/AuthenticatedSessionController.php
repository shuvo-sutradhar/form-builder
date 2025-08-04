<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Update last login timestamp
        Auth::user()->updateLastLogin();

        // Redirect based on user role
        $user = Auth::user();
        $intended = $request->session()->get('url.intended');
        
        // If there's an intended URL, check if the user can access it
        if ($intended && $intended !== route('home')) {
            // Check if the intended URL is accessible by the user's role
            if (str_contains($intended, '/admin/') && !$user->isAdminOrStaff()) {
                // Client trying to access admin routes, redirect to client dashboard
                $request->session()->forget('url.intended');
                return redirect()->route('client.dashboard');
            } elseif (str_contains($intended, '/dashboard') && !str_contains($intended, '/admin/') && $user->isAdminOrStaff()) {
                // Admin/Staff trying to access client dashboard, redirect to admin dashboard
                $request->session()->forget('url.intended');
                return redirect()->route('dashboard');
            }
        }
        
        // Default role-based redirect
        if ($user->isAdminOrStaff()) {
            return redirect()->intended(route('dashboard', absolute: false));
        } else {
            return redirect()->intended(route('client.dashboard', absolute: false));
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
