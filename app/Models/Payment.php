<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'donation_id',
        'payment_method',
        'payment_status',
        'paid_at',
    ];

    public function donation()
    {
        return $this->belongsTo(Donation::class);
    }
}
