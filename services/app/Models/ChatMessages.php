<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Chat extends Model
{
    use HasFactory;

    protected $table = 'chat_messages';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('d/m/Y H:i:s');
    }

    protected $fillable = [
        'chat_id',
        'from',
        'message',
    ];

    protected $hidden = [];

    protected $casts = [
        'chat_id' => 'integer',
        'from' => 'integer',
        'message' => 'string'
    ];
}

