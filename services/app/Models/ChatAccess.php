<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Chat extends Model
{
    use HasFactory;

    protected $table = 'chat_access';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('d/m/Y H:i:s');
    }

    protected $fillable = [
        'user_id',
        'chat_id'
    ];

    protected $hidden = [
        'user_id',
        'chat_id'
    ];

    protected $casts = [
        'user_id' => 'integer',
        'chat_id' => 'integer'
    ];
}

