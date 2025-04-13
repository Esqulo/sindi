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
        'worker',
        'hirer',
        'counter_prev',
        'counter_next',
        'answered_at',
        'starts_at',
        'expires_at',
        'place',
        'message',
        'purchase_id'
    ];

    protected $hidden = [
    ];

    protected $casts = [
        'id' => 'integer',
        'value' => 'float',
        'from' => 'integer',
        'to' => 'integer',
        'created_at' => 'datetime',
        'answer' => 'integer',
        'worker' => 'integer',
        'hirer' => 'integer',
        'answered_at' => 'datetime',
        'counter_prev' => 'integer',
        'counter_next' => 'integer',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'place' => 'integer',
        'message' => 'string',
        'purchase_id' => 'integer'
    ];
}
