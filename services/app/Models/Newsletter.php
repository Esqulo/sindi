<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Newsletter extends Model
{
    use HasFactory;

    protected $table = 'landing_page_users';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    protected $fillable = [
        'name',
        'email',
        'phone'
    ];

    protected $hidden = [
        'name',
        'email',
        'phone',
        'created_at'
    ];

    protected $casts = [
        'email' => 'string',
        'name' => 'string',
        'phone' => 'string',
        'created_at' => 'datetime'
    ];

}
