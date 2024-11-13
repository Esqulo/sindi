<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class GoogleUserCredential extends Model
{
    use HasFactory;
    protected $table = 'google_user_credentials';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    protected $fillable = [
        'user_id',
        'calendar_token',
        'calendar_refresh_token',
        'calendar_expires_in',
        'calendar_created_at'
    ];

    protected $hidden = [
        'user_id',
        'calendar_token',
        'calendar_refresh_token',
        'calendar_expires_in',
        'calendar_created_at'
    ];

    protected $casts = [
        'user_id' => "integer",
        'calendar_token' => "string",
        'calendar_refresh_token' => "string",
        'calendar_expires_in' => "datetime",
        'calendar_created_at' => "datetime",
    ];
}
