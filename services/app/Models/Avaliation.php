<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Avaliation extends Model
{
    use HasFactory;

    protected $table = 'avaliations';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    protected $fillable = [
        'from',
        'to',
        'deal',
        'stars',
        'message'
    ];

    protected $hidden = [
        "deal"
    ];

    protected $casts = [
        'id' => 'integer',
        'from' => 'integer',
        'to' => 'integer',
        'stars' => 'integer',
        'message' => 'string',
        'created_at' => 'datetime'
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'from');
    }
}
