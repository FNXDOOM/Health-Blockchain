# Chaincode Deployment Script for Hyperledger Fabric
# This script packages, installs, approves, and commits the patient-records chaincode

$ErrorActionPreference = "Stop"

# Configuration
$CHANNEL_NAME="healthchannel"
$CC_NAME="patient-records"
$CC_SRC_PATH="../chaincode/patient-records"
$CC_VERSION="1.0"
$CC_SEQUENCE="1"
$CC_INIT_FCN="InitLedger"
$CC_END_POLICY="AND('Org1MSP.peer')"
$CC_COLL_CONFIG=""
$DELAY="3"
$MAX_RETRY="5"

Write-Host "==== Starting chaincode deployment ===="

# Environment setup
$ENV:FABRIC_CFG_PATH = "../config"

# Create the chaincode package
Write-Host "Creating chaincode package..."
Set-Location -Path $CC_SRC_PATH
go mod vendor
Set-Location -Path "../../scripts"

../bin/peer lifecycle chaincode package ${CC_NAME}.tar.gz `
  --path ${CC_SRC_PATH} `
  --lang golang `
  --label ${CC_NAME}_${CC_VERSION}

if (-not $?) {
    Write-Error "Error packaging chaincode"
    exit 1
}

# Set environment variables for peer0.org1
$ENV:CORE_PEER_TLS_ENABLED = "true"
$ENV:CORE_PEER_LOCALMSPID = "Org1MSP"
$ENV:CORE_PEER_TLS_ROOTCERT_FILE = "../crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
$ENV:CORE_PEER_MSPCONFIGPATH = "../crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp"
$ENV:CORE_PEER_ADDRESS = "localhost:7051"

# Install the chaincode on peer0.org1
Write-Host "Installing chaincode on peer0.org1.example.com..."
../bin/peer lifecycle chaincode install ${CC_NAME}.tar.gz

if (-not $?) {
    Write-Error "Error installing chaincode on peer0.org1"
    exit 1
}

# Get the package ID
Write-Host "Getting chaincode package ID..."
$PACKAGE_ID = (../bin/peer lifecycle chaincode queryinstalled | Select-String -Pattern "${CC_NAME}_${CC_VERSION}:([^,]+)" | ForEach-Object { $_.Matches.Groups[1].Value })

if (-not $PACKAGE_ID) {
    Write-Error "Could not get package ID. Check if chaincode was installed correctly."
    exit 1
}

Write-Host "Package ID: $PACKAGE_ID"

# Approve the chaincode for Org1
Write-Host "Approving chaincode for Org1..."
../bin/peer lifecycle chaincode approveformyorg -o localhost:7050 `
  --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION `
  --package-id $PACKAGE_ID --sequence $CC_SEQUENCE `
  --init-required

if (-not $?) {
    Write-Error "Error approving chaincode definition for org1"
    exit 1
}

# Check commit readiness
Write-Host "Checking commit readiness..."
../bin/peer lifecycle chaincode checkcommitreadiness `
  --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION `
  --sequence $CC_SEQUENCE --init-required

# Commit the chaincode definition
Write-Host "Committing chaincode definition to channel..."
../bin/peer lifecycle chaincode commit -o localhost:7050 `
  --channelID $CHANNEL_NAME --name $CC_NAME --version $CC_VERSION `
  --sequence $CC_SEQUENCE --init-required

if (-not $?) {
    Write-Error "Error committing chaincode definition to channel"
    exit 1
}

# Initialize the chaincode
Write-Host "Initializing the chaincode..."
../bin/peer chaincode invoke -o localhost:7050 `
  --channelID $CHANNEL_NAME --name $CC_NAME `
  --isInit -c '{"Args":["InitLedger"]}'

if (-not $?) {
    Write-Error "Error initializing chaincode"
    exit 1
}

Write-Host "==== Chaincode successfully deployed ===="
Write-Host "Channel: $CHANNEL_NAME"
Write-Host "Chaincode: $CC_NAME"
Write-Host "Version: $CC_VERSION"
Write-Host "Sequence: $CC_SEQUENCE"