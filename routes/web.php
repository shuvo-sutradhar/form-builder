<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\CheckRole;

// Register the role middleware
Route::aliasMiddleware('role', CheckRole::class);

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Client Dashboard (no prefix)
Route::get('dashboard', function () {
    return Inertia::render('clients/Dashboard', [
        'user' => auth()->user()
    ]);
})->middleware(['auth', 'verified', 'role:client'])->name('client.dashboard');

// Admin/Staff routes with /admin prefix
Route::prefix('admin')->middleware(['auth', 'verified', 'role:admin_or_staff'])->group(function () {
    // Admin/Staff Dashboard
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard/Index', [
            'user' => auth()->user()
        ]);
    })->name('dashboard');

    // Admin/Staff Orders (example route)
    Route::get('orders', function () {
        return Inertia::render('admin/dashboard/Orders', [
            'user' => auth()->user()
        ]);
    })->name('orders');

    // Form routes
    Route::prefix('form')->group(function () {
        // Form index (list all forms)
        Route::get('/', function () {
            return Inertia::render('admin/form/Index', [
                'user' => auth()->user()
            ]);
        })->name('admin.form.index');

        // Create new form
        Route::get('/create', function () {
            return Inertia::render('admin/form/Create', [
                'user' => auth()->user()
            ]);
        })->name('admin.form.create');

                     // Edit existing form
             Route::get('/{id}/edit', function ($id) {
                 return Inertia::render('admin/form/Edit', [
                     'user' => auth()->user(),
                     'formId' => $id
                 ]);
             })->name('admin.form.edit');

             // Preview form
             Route::get('/{id}/show', function ($id) {
                 return Inertia::render('admin/form/Show', [
                     'user' => auth()->user(),
                     'formId' => $id
                 ]);
             })->name('admin.form.show');
    });
});

// Redirect based on role after login
Route::get('redirect-after-login', function () {
    $user = auth()->user();
    
    if ($user->isAdminOrStaff()) {
        return redirect()->route('dashboard');
    } else {
        return redirect()->route('client.dashboard');
    }
})->middleware(['auth', 'verified'])->name('redirect.after.login');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
