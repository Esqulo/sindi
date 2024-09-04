<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class User extends Model
{
    use HasFactory;

    protected $table = 'users';

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    protected $fillable = [
        'email',
        'name',
        'doc_number',
        'phone',
        'password',
        'email_verified_at',
        'phone_verified_at',
        'created_at',
        'updated_at',
        'active',
        'birthdate',
        'address',
        'cep',
        'avatar',
        'bio',
        'reviews_count'
    ];

    protected $hidden = [
        'doc_number',
        'phone',
        'password',
        'email_verified_at',
        'phone_verified_at',
        'updated_at',
        'adress',
        'cep',
        'is_admin'
    ];

    protected $casts = [
        'email' => 'string',
        'name' => 'string',
        'doc_number' => 'string',
        'phone' => 'string',
        'password' => 'string',
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'created_at' => 'date',
        'updated_at' => 'datetime',
        'active' => 'boolean',
        'birthdate' => 'date',
        'address' => 'string',
        'cep' => 'string',
        'avatar' => 'string',
        'bio' => 'string',
        'reviews_count' => 'integer'
    ];

}
