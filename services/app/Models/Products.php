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
        'description',
        'active',
        'main_category'
    ];

    protected $hidden = [
        'main_category'
    ];

    protected $casts = [
        'id' => 'integer',
        'name' => 'string',
        'price' => 'float',
        'description' => 'string',
        'active' => 'boolean',
        'main_category' => 'integer'
    ];

}
