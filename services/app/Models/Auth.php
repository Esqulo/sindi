<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Auth extends Model
{
    use HasFactory;

    protected $table = 'auth';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    protected $fillable = [
        'user_id',
        'token',
        'expires_at'
    ];

    protected $hidden = [
        'id',
        'user_id',
        'token',
        'created_at',
        'expires_at'
    ];

    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'token' => 'string',
        'created_at' => 'datetime',
        'expires_at' => 'datetime'
    ];
}
