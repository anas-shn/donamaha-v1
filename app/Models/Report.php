<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'author_id',
        'title',
        'content',
        'image_path',
        'total_spent',
        'published_at',
    ];

    protected $casts = [
        'total_spent' => 'integer',
        'published_at' => 'datetime',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
