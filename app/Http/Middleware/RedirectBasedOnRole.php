<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectBasedOnRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only redirect if user is authenticated and accessing dashboard
        if (auth()->check() && $request->is('dashboard')) {
            $user = auth()->user();

            // Redirect admin to Filament admin panel
            if ($user->role === 'admin') {
                return redirect('/admin');
            }
        }

        return $next($request);
    }
}
