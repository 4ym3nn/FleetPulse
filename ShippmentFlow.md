sequenceDiagram
    actor CB as Company Business
    actor TB as Transport Business
    participant API as API Gateway
    participant SS as Shipment Service
    participant TS as Tracking Service
    participant DB as Database
    
    Note over CB,DB: Step 1: Company Creates Shipment & Assigns Transport
    CB->>API: POST /shipments<br/>{company_id, transport_id, items, details}
    API->>SS: Validate & Create Shipment
    SS->>DB: INSERT Shipment
    SS->>DB: INSERT ShipmentItems
    DB-->>SS: Return Shipment ID & Tracking Number
    SS->>TS: Create Initial Tracking Event
    TS->>DB: INSERT TrackingEvent "created"
    SS-->>API: Return Shipment Data
    API-->>CB: 201 Created {tracking_number, shipment_id}
    
    Note over CB,DB: Step 2: Transport Views & Accepts Shipment
    TB->>API: GET /shipments?transport_id={id}&status=pending
    API->>SS: Fetch Assigned Shipments
    SS->>DB: SELECT Shipments
    DB-->>SS: Return Shipment List
    SS-->>API: Return Data
    API-->>TB: 200 OK {shipments[]}
    
    TB->>API: PUT /shipments/{id}/accept
    API->>SS: Update Shipment Status
    SS->>DB: UPDATE Shipment status='accepted'
    SS->>TS: Add Tracking Event
    TS->>DB: INSERT TrackingEvent "accepted"
    SS-->>API: Success
    API-->>TB: 200 OK
    
    Note over CB,DB: Step 3: Transport Updates During Transit
    TB->>API: POST /shipments/{id}/tracking<br/>{event_type, location, description}
    API->>TS: Add Tracking Event
    TS->>DB: INSERT TrackingEvent "picked_up/in_transit"
    TS->>SS: Update Shipment Status if needed
    SS->>DB: UPDATE Shipment status
    TS-->>API: Success
    API-->>TB: 201 Created
    
    Note over CB,DB: Step 4: Transport Marks Delivery Complete
    TB->>API: POST /shipments/{id}/deliver
    API->>SS: Mark as Delivered
    SS->>DB: UPDATE Shipment<br/>status='delivered'<br/>actual_delivery=NOW()
    SS->>TS: Add Final Tracking Event
    TS->>DB: INSERT TrackingEvent "delivered"
    SS-->>API: Success
    API-->>TB: 200 OK
    
    Note over CB,DB: Step 5: Company Tracks Shipment Progress
    CB->>API: GET /shipments/{tracking_number}
    API->>SS: Fetch Shipment Details
    SS->>DB: SELECT Shipment with Items
    DB-->>SS: Return Shipment Data
    SS-->>API: Return Data
    API-->>CB: 200 OK {shipment, items, status}
    
    CB->>API: GET /shipments/{id}/tracking
    API->>TS: Fetch Tracking History
    TS->>DB: SELECT TrackingEvents ORDER BY timestamp
    DB-->>TS: Return Events
    TS-->>API: Return Timeline
    API-->>CB: 200 OK {events[]}
