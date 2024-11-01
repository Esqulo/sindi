<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Deal extends Model
{
    use HasFactory;

    protected $table = 'deals';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    protected $fillable = [
        'value',
        'from',
        'to',
        'answer',
        'counter_prev',
        'counter_next',
        'answered_at',
        'starts_at',
        'expires_at',
        'place',
        'message'
    ];

    protected $hidden = [
    ];

    protected $casts = [
        'id' => 'integer',
        'value' => 'float',
        'from' => 'integer',
        'to' => 'integer',
        'created_at' => 'datetime',
        'answer' => 'boolean',
        'answered_at' => 'datetime',
        'counter_prev' => 'integer',
        'counter_next' => 'integer',
        'starts_at' => 'date',
        'expires_at' => 'date',
        'place' => 'integer',
        'message' => 'string'
    ];
}
