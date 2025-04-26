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
        'user_type',
        'name',
        'email',
        'email_verified_at',
        'phone',
        'phone_verified_at',
        'birthdate',
        'avatar',
        'doc_number',
        'id_number',
        'password',
        'position',
        'active',
        'state',
        'city',
        'neighbourhood',
        'address',
        'number',
        'complement',
        'cep',
        'bio',
        'reviews_count',
        'gender',
        'marital_status',
        'work_since',
        'last_accepted_terms',
        'created_at',
        'updated_at'
    ];

    protected $hidden = [
        'email',
        'email_verified_at',
        'phone',
        'phone_verified_at',
        'birthdate',
        'doc_number',
        'id_number',
        'password',
        'active',
        'state',
        'city',
        'neighbourhood',
        'address',
        'number',
        'complement',
        'cep',
        'gender',
        'marital_status',
        'work_since',
        'last_accepted_terms',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'user_type' => 'integer',
        'name' => 'string',
        'email' => 'string',
        'email_verified_at' => 'datetime',
        'phone' => 'string',
        'phone_verified_at' => 'datetime',
        'birthdate' => 'datetime',
        'avatar' => 'string',
        'doc_number' => 'string',
        'id_number' => 'string',
        'password' => 'string',
        'position' => 'string',
        'active' => 'integer',
        'state' => 'string',
        'city' => 'string',
        'neighbourhood' => 'string',
        'address' => 'string',
        'number' => 'string',
        'complement' => 'string',
        'cep' => 'string',
        'bio' => 'string',
        'reviews_count' => 'integer',
        'gender' => 'string',
        'marital_status' => 'string',
        'work_since' => 'datetime',
        'last_accepted_terms' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

}
