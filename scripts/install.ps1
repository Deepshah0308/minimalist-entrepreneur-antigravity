# PowerShell script for 'The Minimalist Entrepreneur' skills installation on Windows

Write-Host "🚀 Installing 'Minimalist Entrepreneur' skills for Antigravity on Windows..." -ForegroundColor Cyan

# Determine target directory
$TargetDir = Join-Path $HOME ".gemini\antigravity\skills"

# Create target directory if it doesn't exist
if (-not (Test-Path $TargetDir)) {
    Write-Host "📂 Creating directory $TargetDir..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $TargetDir -Force
}

# Determine source directory
$SourceDir = $PSScriptRoot

# Copy skills folder content
Write-Host "📦 Copying skills..." -ForegroundColor Yellow
Copy-Item -Path "$SourceDir\..\skills\*" -Destination $TargetDir -Recurse -Force

Write-Host "✅ Successfully installed 'Minimalist Entrepreneur' skills to $TargetDir!" -ForegroundColor Green
Write-Host "💡 You can now use these skills in Antigravity." -ForegroundColor Green
