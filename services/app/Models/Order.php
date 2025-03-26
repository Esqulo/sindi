<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    protected $fillable = [
        'purchase_id',
        'product_id',
        'amount',
        'current_unit_price',
        'current_fee_percentage'
    ];

    protected $hidden = [
        'id'
    ];

    protected $casts = [
        'id' => 'integer',
        'purchase_id' => 'integer',
        'product_id' => 'integer',
        'amount' => 'float',
        'current_unit_price' => 'float',
        'current_fee_percentage' => 'float'
    ];

}
