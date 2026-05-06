
$path1 = "src/app/features/admin/products/product-manager.component.ts"
$content1 = Get-Content $path1
# Line 159 is index 158. We want to remove it.
$newContent1 = @()
for ($i = 0; $i -lt $content1.Length; $i++) {
    if ($i -ne 158) {
        $newContent1 += $content1[$i]
    }
}
$newContent1 | Set-Content $path1

$path2 = "src/app/features/admin/categories/category-manager.component.ts"
$content2 = Get-Content $path2
# Line 118 is index 117. We want to remove it.
$newContent2 = @()
for ($i = 0; $i -lt $content2.Length; $i++) {
    if ($i -ne 117) {
        $newContent2 += $content2[$i]
    }
}
$newContent2 | Set-Content $path2
