<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class EmailToken extends Model
{
    use HasFactory;

    protected $table = 'email_confirmation_codes';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    protected $fillable = [
        'user_id',
        'code',
        'created_at',
        'expires_at',
        'already_used',
        'expired_by_another'
    ];

    protected $hidden = [
        'user_id',
        'code',
        'created_at',
        'expires_at',
        'already_used',
        'expired_by_another'
    ];

    protected $casts = [
        'user_id' => 'integer',
        'code' => 'string',
        'created_at' => 'datetime',
        'expires_at' => 'datetime',
        'already_used' => 'boolean',
        'expired_by_another' => 'boolean',
    ];
}
