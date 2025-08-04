<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        switch ($role) {
            case 'admin':
                if (!$user->isAdmin()) {
                    abort(403, 'Access denied. Admin role required.');
                }
                break;
            case 'staff':
                if (!$user->isStaff()) {
                    abort(403, 'Access denied. Staff role required.');
                }
                break;
            case 'client':
                if (!$user->isClient()) {
                    abort(403, 'Access denied. Client role required.');
                }
                break;
            case 'admin_or_staff':
                if (!$user->isAdminOrStaff()) {
                    abort(403, 'Access denied. Admin or Staff role required.');
                }
                break;
            default:
                abort(400, 'Invalid role specified.');
        }

        return $next($request);
    }
}
