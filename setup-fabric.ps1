# Setup script for Hyperledger Fabric network with IPFS for Aarogya Rakshak

# Create directories for artifacts
New-Item -ItemType Directory -Force -Path .\crypto-config
New-Item -ItemType Directory -Force -Path .\channel-artifacts
New-Item -ItemType Directory -Force -Path .\chaincode
New-Item -ItemType Directory -Force -Path .\ipfs-data

# Check if Chocolatey is installed
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Chocolatey package manager..."
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    RefreshEnv
}

# Install IPFS Desktop
if (-not (Get-Command ipfs -ErrorAction SilentlyContinue)) {
    Write-Host "Installing IPFS..."
    choco install go-ipfs -y
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    RefreshEnv
    
    # Initialize IPFS
    Write-Host "Initializing IPFS node..."
    ipfs init
    
    # Configure IPFS for better performance
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
    
    # Start IPFS daemon in background
    Start-Process -NoNewWindow -FilePath "ipfs" -ArgumentList "daemon"
    
    # Wait for IPFS to start
    Start-Sleep -Seconds 5
}

# Download Hyperledger Fabric binaries if not already present
if (-not (Test-Path .\bin\configtxgen.exe)) {
    Write-Host "Downloading Hyperledger Fabric binaries..."
    Invoke-WebRequest -Uri "https://github.com/hyperledger/fabric/releases/download/v2.4.1/hyperledger-fabric-windows-amd64-2.4.1.tar.gz" -OutFile "fabric.tar.gz"
    tar -xzf fabric.tar.gz
    Remove-Item fabric.tar.gz
}

# Generate crypto material
Write-Host "Generating crypto materials..."
.\bin\cryptogen generate --config=.\crypto-config.yaml --output="crypto-config"

# Generate genesis block and channel transaction
Write-Host "Generating genesis block..."
.\bin\configtxgen -profile TwoOrgsOrdererGenesis -channelID system-channel -outputBlock .\channel-artifacts\genesis.block -configPath .

Write-Host "Generating channel transaction..."
.\bin\configtxgen -profile TwoOrgsChannel -outputCreateChannelTx .\channel-artifacts\channel.tx -channelID aarogyachannel -configPath .

# Generate anchor peer updates
Write-Host "Generating anchor peer updates..."
.\bin\configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate .\channel-artifacts\Org1MSPanchors.tx -channelID aarogyachannel -asOrg Org1MSP -configPath .

# Create .env file with IPFS configuration
$envContent = @"
# IPFS Configuration
NEXT_PUBLIC_IPFS_API_URL=http://localhost:5001
NEXT_PUBLIC_IPFS_GATEWAY_URL=https://ipfs.io/ipfs/
NEXT_PUBLIC_IPFS_NODE_TYPE=local

# Hyperledger Fabric Configuration
NEXT_PUBLIC_FABRIC_GATEWAY_URL=http://localhost:8080
"@

$envContent | Out-File -FilePath ".\.env" -Encoding utf8

Write-Host "Setup completed successfully!"
Write-Host "IPFS node is running in the background"
Write-Host "Run 'docker-compose up -d' to start the Hyperledger Fabric network"
Write-Host "Access IPFS WebUI at: http://localhost:5001/webui"