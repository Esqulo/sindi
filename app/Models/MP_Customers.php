<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class MP_Customers extends Model
{
    use HasFactory;

    protected $table = 'mp_customers';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    protected $fillable = [
        'user_id',
        'mp_usertoken'
    ];

    protected $hidden = [
        'id',
        'user_id',
        'mp_usertoken'
    ];

    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'mp_usertoken' => 'string'
    ];
}
