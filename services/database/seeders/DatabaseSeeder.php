<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'password' => bcrypt('123456'),
            'doc_number' => '00000000000',
            'phone' => '88999999999',
            'state' => 'CE',
            'city' => 'Ubajara',
            'address' => 'Rua Exemplo',
            'number' => '123',
            'birthdate' => '1990-01-01',
            'cep' => '62350000',
            'is_admin' => 1,
            'user_type' => 1,
            'active' => 1,
        ]);
    }
}
