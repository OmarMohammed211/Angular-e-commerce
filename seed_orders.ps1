
$baseUrl = "http://localhost:3000"

# 1. Create User
$user = @{ name = "Mina Wael"; email = "mina@elevare.com"; password = "password123" }
$userResponse = Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -Body ($user | ConvertTo-Json) -ContentType "application/json"
$userId = $userResponse.user._id
Write-Host "User ID: $userId"

# 2. Get Products
$products = Invoke-RestMethod -Uri "$baseUrl/products" -Method Get
$prod1 = $products[0]._id
$prod2 = $products[1]._id

# 3. Add to Cart
Invoke-RestMethod -Uri "$baseUrl/cart/add" -Method Post -Body (@{ userId = $userId; productId = $prod1; quantity = 1 } | ConvertTo-Json) -ContentType "application/json"
Invoke-RestMethod -Uri "$baseUrl/cart/add" -Method Post -Body (@{ userId = $userId; productId = $prod2; quantity = 1 } | ConvertTo-Json) -ContentType "application/json"

# 4. Checkout
$checkout = @{ userId = $userId; shippingAddress = "Doha, Qatar" }
$orderResponse = Invoke-RestMethod -Uri "$baseUrl/orders/checkout" -Method Post -Body ($checkout | ConvertTo-Json) -ContentType "application/json"

Write-Host "Order Created: $($orderResponse._id)"
