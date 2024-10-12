<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Purchase extends Model
{
    use HasFactory;

    protected $table = 'purchases';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    protected $fillable = [
        'transaction_id',
        'user_id',
        'product',
        'purchase_date',
        'payment_date',
        'payment_method',
        'payment_value',
        'payment_platform'
    ];

    protected $hidden = [
        'id',
        'transaction_id',
        'user_id',
        'product',
        'purchase_date',
        'payment_date',
        'payment_method',
        'payment_value',
        'payment_platform'
    ];

    protected $casts = [
        'id' => 'integer',
        'transaction_id' => 'string',
        'user_id' => 'integer',
        'product' => 'integer',
        'purchase_date' => 'datetime',
        'payment_date' => 'datetime',
        'payment_method' => 'integer',
        'payment_value' => 'integer',
        'payment_platform' => 'string',
    ];
}
