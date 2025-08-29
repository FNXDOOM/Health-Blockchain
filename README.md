# HealthX Passport - Blockchain-Powered Health Records

HealthX Passport is a secure, blockchain-based health record management system that gives patients control over their medical data while allowing seamless sharing with authorized healthcare providers.

## Features

- **Blockchain Security**: Patient records secured on a private Hyperledger Fabric blockchain
- **Patient Control**: Patients decide who can access their medical records and for how long
- **Doctor Verification**: Healthcare providers are verified on the blockchain
- **Emergency Access**: Zero-knowledge proof technology for emergency access
- **File Management**: Secure upload, storage, and sharing of medical documents
- **Audit Trail**: Immutable record of all access to patient data

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express
- **Blockchain**: Hyperledger Fabric
- **Storage**: CouchDB (for blockchain state), File system (for documents)
- **Authentication**: JWT, Blockchain-based identity

## Prerequisites

- Docker and Docker Compose
- Node.js (v14+)
- PowerShell (for Windows setup scripts)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/healthx-passport.git
cd healthx-passport
```

### 2. Set Up Hyperledger Fabric Network

```powershell
# Run the setup script to download Fabric binaries and generate crypto materials
./setup-fabric.ps1

# Start the Fabric network
docker-compose up -d
```

### 3. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install API server dependencies
cd api
npm install
cd ..
```

### 4. Deploy Chaincode

```bash
# Package and install the chaincode
./scripts/deploy-chaincode.ps1
```

### 5. Start the Application

```bash
# Start the API server
cd api
npm run dev

# In a new terminal, start the frontend application
cd ..
npm run dev
```

## Blockchain Network Architecture

The Hyperledger Fabric network consists of:

- 1 Certificate Authority (CA)
- 1 Orderer node
- 1 Peer node (peer0.org1.example.com)
- 1 CouchDB instance (for state database)
- 1 CLI container (for administrative tasks)

## API Documentation

### Patient APIs

- `POST /api/patients` - Register a new patient
- `GET /api/patients/:id` - Get patient information
- `POST /api/patients/:id/records` - Create a new patient record
- `GET /api/patients/:id/records` - Get all records for a patient
- `GET /api/patients/:id/records/:recordId` - Get a specific record
- `POST /api/patients/:id/consent` - Manage consent for doctor access

### Doctor APIs

- `POST /api/doctors/verify-identity` - Verify doctor identity
- `GET /api/doctors/:id/patients` - Get patients accessible to doctor
- `POST /api/emergency-access` - Request emergency access to patient records

### Blockchain APIs

- `POST /api/verify-record` - Verify record integrity on blockchain
- `GET /api/blockchain/info` - Get blockchain network information

## Security Features

### Zero-Knowledge Proofs

The system uses zero-knowledge proofs for emergency access, allowing doctors to prove they have emergency access rights without revealing the patient's private key.

### Consent Management

Patients explicitly grant and revoke access to their records. All consent changes are recorded on the blockchain for audit purposes.

### Data Privacy

Patient data is encrypted and stored off-chain, with only hash references stored on the blockchain.

## Development Guidelines

### Adding New Chaincode Functions

1. Modify the `chaincode/patient-records/patient-records.go` file
2. Update the corresponding API endpoints in `api/blockchain-service.js`
3. Deploy the updated chaincode using the deployment script

### Frontend Components

The application uses a component-based architecture:

- `/components/patient` - Patient-facing components
- `/components/doctor` - Doctor-facing components
- `/components/ui` - Shared UI components

## License

MIT