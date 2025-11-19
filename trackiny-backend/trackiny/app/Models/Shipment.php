<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\ShipmentItem;
use App\Models\Company;
use App\Models\Transport;
class Shipment extends Model
{
    protected $fillable = [
        'company_id',
        'transport_id',
        'origin_address',
        'destination_address',
        'pickup_date',
        'estimated_delivery',
        'actual_delivery',
        'status',
        'total_weight',
        'priority',
        'notes',
    ];
    protected $hidden = [
        'tracking_number'
    ];

    public static function booted() {
        static::creating(function ($model){
            $model->tracking_number=Str::uuid();
        });
    }
       public function shipment_item():HasMany
    {
        return $this->hasMany(ShipmentItem::class,'shipment_id','id');
    }
    public function shipment_company():BelongsTo {
        return $this->belongsTo(Company::class,'company_id','id');

    }
    public function shipment_transport():BelongsTo {
        return $this->belongsTo(Transport::class,'transport_id','id');
    }

}
