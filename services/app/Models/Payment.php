<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    protected $fillable = [
        'purchase_id',
        'payment_id',
        'amount',
        'payment_date',
        'payment_method',
        'payment_platform'
    ];

    protected $hidden = [
        'id'
    ];

    protected $casts = [
        'id' => 'integer',
        'purchase_id' => 'integer',
        'payment_id' => 'integer',
        'amount' => 'float',
        'payment_date' => 'datetime',
        'payment_method' => 'string',
        'payment_platform' => 'string'
    ];
}
