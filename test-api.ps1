# PowerShell script to test the Event Management API

# 1. Test Health Check
Write-Host "=== Testing Health Check ===" -ForegroundColor Green
Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET

Write-Host "`n=== Seeding Database ===" -ForegroundColor Green
# Run the seed script first
node utils/seedData.js --seed

Write-Host "`n=== Testing Get Events ===" -ForegroundColor Green
# 2. Test Get Events for Restaurant
try {
    $getResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/getEventData/61b6fa7db0f0f8e3bc44c7d9" -Method GET
    $getResponse | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error getting events: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Testing Create Event ===" -ForegroundColor Green
# 3. Test Create New Event
$createEventBody = @{
    restaurant_id = "61b6fa7db0f0f8e3bc44c7d9"
    event_title = "PowerShell Test Event"
    event_description = "This is a test event created via PowerShell"
    cover_image = "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
    entry_fee_per_person = 400
    start_date = "2025-08-20"
    end_date = "2025-08-20"
    start_time = "19:00"
    end_time = "23:00"
    contact_address = "PowerShell Test Address, Dhaka"
    email = "powershell@test.com"
    mobile = "+880987654321"
    is_active = $true
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/addEvent" -Method POST -Body $createEventBody -ContentType "application/json"
    Write-Host "Event created successfully!" -ForegroundColor Green
    $createResponse | ConvertTo-Json -Depth 10
    
    # Store the created event ID for update/delete tests
    $eventId = $createResponse.data._id
    Write-Host "Created Event ID: $eventId" -ForegroundColor Yellow
    
} catch {
    Write-Host "Error creating event: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n=== Testing Update Event ===" -ForegroundColor Green
# 4. Test Update Event (if we have an event ID) - FIXED TIME FORMAT
if ($eventId) {
    $updateEventBody = @{
        _id = $eventId
        event_title = "Updated PowerShell Event"
        event_description = "This event has been updated via PowerShell"
        start_time = "20:00"
        end_time = "23:30"
        entry_fee_per_person = 500
    } | ConvertTo-Json
    
    try {
        $updateResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/updateEvent" -Method PUT -Body $updateEventBody -ContentType "application/json"
        Write-Host "Event updated successfully!" -ForegroundColor Green
        $updateResponse | ConvertTo-Json -Depth 10
    } catch {
        Write-Host "Error updating event: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody" -ForegroundColor Red
        }
    }
}

Write-Host "`n=== Testing Delete Event ===" -ForegroundColor Green
# 5. Test Delete Event (if we have an event ID)
if ($eventId) {
    $deleteEventBody = @{
        _id = $eventId
    } | ConvertTo-Json
    
    try {
        $deleteResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/DeleteEvent" -Method DELETE -Body $deleteEventBody -ContentType "application/json"
        Write-Host "Event deleted successfully!" -ForegroundColor Green
        $deleteResponse | ConvertTo-Json -Depth 10
    } catch {
        Write-Host "Error deleting event: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== All Tests Completed ===" -ForegroundColor Green