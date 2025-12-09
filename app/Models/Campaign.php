<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'organizer_id',
        'title',
        'full_description',
        'target_amount',
        'collected_amount',
        'status',
        'image_path',
        'start_date',
        'end_date',
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}
