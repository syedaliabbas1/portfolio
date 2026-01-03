$testData = @{
    name = "Syed Ali Abbas - Demo Test"
    email = "demo@portfolio.test"
    company = "UCL Computer Science"
    message = "This is an automated test message to verify the contact form is working correctly. If you receive this email, everything is set up properly!"
} | ConvertTo-Json

Write-Host "Testing Contact Form API..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Sending test message..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/contact" `
        -Method Post `
        -Body $testData `
        -ContentType "application/json" `
        -ErrorAction Stop

    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "SUCCESS! Contact form is working perfectly!" -ForegroundColor Green
    Write-Host "Email sent to: syedaliabbas1124@gmail.com" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor White
    $response | ConvertTo-Json
    Write-Host ""
    Write-Host "Please check your email inbox!" -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Green
}
catch {
    Write-Host "==========================================================" -ForegroundColor Red
    Write-Host "FAILED! Error occurred:" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    
    if ($_.ErrorDetails) {
        Write-Host "Details:" -ForegroundColor Yellow
        $_.ErrorDetails.Message | ConvertFrom-Json | ConvertTo-Json
    }
    
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "   1. Dev server is running (npm run dev)" -ForegroundColor Gray
    Write-Host "   2. RESEND_API_KEY is set in .env.local" -ForegroundColor Gray
    Write-Host "   3. Server restarted after adding API key" -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Red
}
