<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleBasedAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_staff_can_access_admin_dashboard(): void
    {
        $staff = User::factory()->staff()->create();

        $response = $this->actingAs($staff)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_client_cannot_access_admin_dashboard(): void
    {
        $client = User::factory()->client()->create();

        $response = $this->actingAs($client)->get('/dashboard');

        $response->assertStatus(403);
    }

    public function test_client_can_access_client_dashboard(): void
    {
        $client = User::factory()->client()->create();

        $response = $this->actingAs($client)->get('/client/dashboard');

        $response->assertStatus(200);
    }

    public function test_admin_cannot_access_client_dashboard(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get('/client/dashboard');

        $response->assertStatus(403);
    }

    public function test_staff_cannot_access_client_dashboard(): void
    {
        $staff = User::factory()->staff()->create();

        $response = $this->actingAs($staff)->get('/client/dashboard');

        $response->assertStatus(403);
    }

    public function test_user_redirected_to_login_when_not_authenticated(): void
    {
        $response = $this->get('/dashboard');

        $response->assertRedirect('/login');
    }

    public function test_last_login_updated_on_login(): void
    {
        $user = User::factory()->create();
        
        $this->actingAs($user)->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $user->refresh();
        
        $this->assertNotNull($user->last_login);
    }
} 