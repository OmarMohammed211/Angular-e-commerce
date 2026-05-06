
$baseUrl = "http://localhost:3000"

# 1. Create Categories
$categories = @(
    @{ name = "Perfumes & Fragrances"; description = "Exquisite scents from around the world."; image = "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800" },
    @{ name = "Luxury Watches"; description = "Timeless craftsmanship and precision."; image = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800" },
    @{ name = "Designer Bags"; description = "Elegant accessories for every occasion."; image = "https://images.unsplash.com/photo-1584917033904-7911fe7a3c1c?auto=format&fit=crop&q=80&w=800" }
)

$catIds = @{}

foreach ($cat in $categories) {
    Write-Host "Creating Category: $($cat.name)..."
    $response = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Post -Body ($cat | ConvertTo-Json) -ContentType "application/json"
    $catIds[$cat.name] = $response._id
    Write-Host "Created Category ID: $($response._id)"
}

# 2. Create Products
$products = @(
    @{ name = "Oud Noir Fragrance"; price = 450; stock = 25; description = "A deep, smoky oud with hints of saffron and leather."; image = "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800"; categoryId = $catIds["Perfumes & Fragrances"] },
    @{ name = "Elysian Chronograph"; price = 3200; stock = 10; description = "Sleek stainless steel watch with a midnight blue dial."; image = "https://images.unsplash.com/photo-1524592091214-8c96af1c2ad4?auto=format&fit=crop&q=80&w=800"; categoryId = $catIds["Luxury Watches"] },
    @{ name = "Heritage Leather Tote"; price = 1850; stock = 15; description = "Handcrafted italian leather tote in rich mahogany."; image = "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800"; categoryId = $catIds["Designer Bags"] },
    @{ name = "Velvet Rose Perfume"; price = 380; stock = 40; description = "Delicate Bulgarian rose with a vanilla base."; image = "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800"; categoryId = $catIds["Perfumes & Fragrances"] },
    @{ name = "Minimalist Gold Timepiece"; price = 2100; stock = 8; description = "18k gold plated watch with a minimalist design."; image = "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800"; categoryId = $catIds["Luxury Watches"] }
)

foreach ($prod in $products) {
    Write-Host "Creating Product: $($prod.name)..."
    Invoke-RestMethod -Uri "$baseUrl/products" -Method Post -Body ($prod | ConvertTo-Json) -ContentType "application/json"
}

Write-Host "Seeding complete!"
