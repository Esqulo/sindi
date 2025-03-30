<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Products extends Model
{
    use HasFactory;

    protected $table = 'products';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    protected $fillable = [
        'name',
        'price',
        'fee_percentage',
        'description',
        'active',
        'main_category',
        'user_id'
    ];

    protected $hidden = [
        'main_category',
        'fee_percentage',
        'active'
    ];

    protected $casts = [
        'id' => 'integer',
        'name' => 'string',
        'price' => 'float',
        'fee_percentage' => 'float',
        'description' => 'string',
        'active' => 'boolean',
        'main_category' => 'integer',
        'user_id' => 'integer'
    ];

}
