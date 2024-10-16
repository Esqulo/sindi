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
        'product_id',
        'purchase_id'
    ];

    protected $hidden = [
        'id'
    ];

    protected $casts = [
        'id' => 'integer',
        'product_id' => 'integer',
        'purchase_id' => 'integer'
    ];

}
