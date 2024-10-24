<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class OfferedServices extends Model
{
    use HasFactory;

    protected $table = 'offered_services';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'price'
    ];

    protected $hidden = [
        'id'
    ];

    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'name' => 'string',
        'description' => 'string',
        'price' => 'float'
    ];
}
