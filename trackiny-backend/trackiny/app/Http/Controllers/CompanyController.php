<?php



namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Shipment;

class CompanyController extends Controller
{
    public function addShipment()
    {
        $shipment = request()->validate([
            'company_id' => 'required|integer|exists:companies,id',
            'transport_id' => 'required|integer|exists:transports,id',
            'origin_address' => 'required|string',
            'destination_address' => 'required|string',
            'pickup_date' => 'required|date',
            'estimated_delivery' => 'required|date|after_or_equal:pickup_date',
            'actual_delivery' => 'nullable|date|after_or_equal:pickup_date',
            'status' => 'required|string',
            'total_weight' => 'required|numeric|min:0',
            'priority' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $company = Company::findOrFail($shipment['company_id']);
        unset($shipment['company_id']);

        return $company->shipments()->create($shipment);
    }

    public function updateShipment()
    {
        $updated_shipment = request()->validate([
            'company_id' => 'required|integer|exists:companies,id',
            'transport_id' => 'nullable|integer|exists:transports,id',
            'origin_address' => 'nullable|string',
            'destination_address' => 'nullable|string',
            'pickup_date' => 'nullable|date',
            'estimated_delivery' => 'nullable|date|after_or_equal:pickup_date',
            'actual_delivery' => 'nullable|date|after_or_equal:pickup_date',
            'status' => 'nullable|string',
            'total_weight' => 'nullable|numeric|min:0',
            'priority' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);
        $company_id=$updated_shipment->company_id;
        unset($updated_shipment['company_id']);
        $company = Company::find($company_id);
        $shipment = $company->shipments->findOrFail($shipment_id);
        return $shipment->update($updated_shipment);
    }


}
