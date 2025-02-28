<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class UserSavedCard extends Model
{
    use HasFactory;

    protected $table = 'user_saved_cards';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    protected $fillable = [
        'mp_card_id',
        'last_four_digits',
        'type',
        'flag',
        'user_id'
    ];

    protected $hidden = [
        'mp_card_id',
        'type',
        'user_id'
    ];

    protected $casts = [
        'mp_card_id' => 'string',
        'last_four_digits' => 'string',
        'type' => 'string',
        'flag' => 'string',
        'user_id' => 'integer'
    ];
}
