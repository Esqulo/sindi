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
        return $date->format('Y-m-d H:i');
    }

    protected $fillable = [
        'from',
        'to',
        'message'
    ];

    protected $hidden = [
        'id'
    ];

    protected $casts = [
        'id' => 'integer',
        'from' => 'integer',
        'to' => 'integer',
        'sent_at' => 'datetime',
        'received_at' => 'datetime',
        'read_at' => 'datetime',
        'message' => 'string'
    ];
}

