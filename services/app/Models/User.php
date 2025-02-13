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
        'state',
        'city',
        'neighbourhood',
        'address',
        'number',
        'complement',
        'cep',
        'avatar',
        'bio',
        'user_type',
        'last_accepted_terms',
        'reviews_count'
    ];

    protected $hidden = [
        'doc_number',
        'phone',
        'password',
        'email_verified_at',
        'phone_verified_at',
        'updated_at',
        'address',
        'cep',
        'is_admin',
        'last_accepted_terms'
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
        'state' => 'string',
        'city' => 'string',
        'neighbourhood' => 'string',
        'address' => 'string',
        'number' => 'string',
        'complement' => 'string',
        'cep' => 'string',
        'avatar' => 'string',
        'bio' => 'string',
        'reviews_count' => 'integer',
        'user_type' => 'integer',
        'last_accepted_terms' => 'datetime'
    ];

}
