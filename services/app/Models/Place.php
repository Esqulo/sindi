<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Place extends Model
{
    use HasFactory;

    protected $table = 'places';
    public $timestamps = false;

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    protected $fillable = [
        'name',
        'owner_id',
        'state',
        'city',
        'neighbourhood',
        'address',
        'number',
        'cep',
        'units',
        'coordinates',
        'third_party_services',
        'had_professional_trustee_before'
    ];
    
    protected $hidden = [
        'state',
        'city',
        'neighbourhood',
        'units',
        'third_party_services',
        'had_professional_trustee_before'
    ];

    protected $casts = [
        'name' => 'string',
        'owner_id' => 'integer',
        'state' => 'string',
        'city' => 'string',
        'neighbourhood' => 'string',
        'address' => 'string',
        'number' => 'string',
        'cep' => 'string',
        'units' => 'integer',
        'coordinates' => 'string',
        'third_party_services' => 'boolean',
        'had_professional_trustee_before' => 'boolean'
    ];

}
