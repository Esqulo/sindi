<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Meeting extends Model
{
    use HasFactory;

    protected $table = 'meetings';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

    protected $fillable = [
        'address',
        'type',
        'time',
        'from',
        'to'
    ];

    protected $hidden = [
        'from',
        'to',
        'requester', 
        'recipient'
    ];

    protected $casts = [
        'id' => 'integer',
        'address' => 'string',
        'type' => 'integer',
        'time' => 'datetime',
        'from' => 'integer',
        'to' => 'integer',
        'created_at' => 'datetime'
    ];

    public function requester()
    {
        return $this->belongsTo(User::class, 'from');
    }

    public function recipient()
    {
        return $this->belongsTo(User::class, 'to');
    }

    // Customiza a saída no JSON para exibir o nome dos usuários
    protected $appends = ['from_name', 'to_name'];

    public function getFromNameAttribute()
    {
        return $this->requester->name;
    }

    public function getToNameAttribute()
    {
        return $this->recipient->name;
    }

    public function toArray()
    {
        $array = parent::toArray();
        $array['from'] = $this->getFromNameAttribute();
        $array['to'] = $this->getToNameAttribute();
        unset($array['from_name'], $array['to_name']);
        return $array;
    }

}
