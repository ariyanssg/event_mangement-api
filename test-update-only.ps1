# Test only the update functionality
Write-Host "=== Testing Update Event Fix ===" -ForegroundColor Green

# First create an event to update
$createEventBody = @{
    restaurant_id = "61b6fa7db0f0f8e3bc44c7d9"
    event_title = "Test Update Event"
    event_description = "This event will be updated"
    cover_image = "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
    entry_fee_per_person = 300
    start_date = "2025-08-25"
    end_date = "2025-08-25"
    start_time = "18:00"
    end_time = "22:00"
    contact_address = "Test Address"
    email = "test@example.com"
    mobile = "+880123456789"
    is_active = $true
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/addEvent" -Method POST -Body $createEventBody -ContentType "application/json"
    $eventId = $createResponse.data._id
    Write-Host "Created test event with ID: $eventId" -ForegroundColor Green
    
    # Now test the update
    $updateEventBody = @{
        _id = $eventId
        event_title = "Updated Event Title"
        event_description = "This event has been successfully updated"
        start_time = "19:30"
        end_time = "23:30"
        entry_fee_per_person = 450
    } | ConvertTo-Json
    
    $updateResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/updateEvent" -Method PUT -Body $updateEventBody -ContentType "application/json"
    Write-Host "✅ Event updated successfully!" -ForegroundColor Green
    $updateResponse | ConvertTo-Json -Depth 10
    
    # Clean up - delete the test event
    $deleteBody = @{ _id = $eventId } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:3000/api/v1/admin/DeleteEvent" -Method DELETE -Body $deleteBody -ContentType "application/json" | Out-Null
    Write-Host "✅ Test event cleaned up" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}