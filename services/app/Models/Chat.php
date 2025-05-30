<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Chat extends Model
{
    use HasFactory;

    protected $table = 'chat';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('d/m/Y H:i:s');
    }

    protected $fillable = [
        'title',
        'type',
        'image',
    ];

    protected $hidden = [];

    protected $casts = [
        'id' => 'integer',
        'title' => 'string',
        'type' => 'integer',
        'image' => 'string',
        'created_at' => 'datetime'
    ];
}

