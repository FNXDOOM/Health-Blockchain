/**
 * HealthX Passport API Server
 * This server provides RESTful APIs to interact with the Hyperledger Fabric blockchain
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const BlockchainService = require('./blockchain-service');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Configure middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create patient-specific directory
    const patientId = req.params.patientId || 'temp';
    const patientDir = path.join(uploadsDir, patientId);
    if (!fs.existsSync(patientDir)) {
      fs.mkdirSync(patientDir, { recursive: true });
    }
    cb(null, patientDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const fileId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${fileId}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    // Accept images, PDFs, and common document formats
    const allowedFileTypes = [
      'image/jpeg', 'image/png', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and office documents are allowed.'));
    }
  }
});

// Initialize blockchain service
const blockchainService = new BlockchainService();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'HealthX Passport API is running' });
});

// Initialize blockchain service
app.get('/api/blockchain/init', async (req, res) => {
  try {
    await blockchainService.initialize();
    res.status(200).json({ success: true, message: 'Blockchain service initialized successfully' });
  } catch (error) {
    console.error(`Error initializing blockchain service: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Enroll admin user
app.post('/api/blockchain/enroll-admin', async (req, res) => {
  try {
    await blockchainService.enrollAdmin();
    res.status(200).json({ success: true, message: 'Admin enrolled successfully' });
  } catch (error) {
    console.error(`Error enrolling admin: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Register user
app.post('/api/blockchain/register-user', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    await blockchainService.registerUser(userId);
    res.status(200).json({ success: true, message: `User ${userId} registered successfully` });
  } catch (error) {
    console.error(`Error registering user: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create patient
app.post('/api/patients', async (req, res) => {
  try {
    const { userId } = req.headers;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID is required in headers' });
    }
    
    const patientData = req.body;
    if (!patientData.id) {
      patientData.id = uuidv4();
    }
    
    // Generate key pair for patient if not provided
    if (!patientData.publicKey) {
      const { publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem'
        }
      });
      patientData.publicKey = publicKey;
    }
    
    await blockchainService.createPatient(userId, patientData);
    res.status(201).json({ success: true, patientId: patientData.id, message: 'Patient created successfully' });
  } catch (error) {
    console.error(`Error creating patient: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get patient
app.get('/api/patients/:patientId', async (req, res) => {
  try {
    const { userId } = req.headers;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID is required in headers' });
    }
    
    const { patientId } = req.params;
    const patient = await blockchainService.queryPatient(userId, patientId);
    res.status(200).json({ success: true, patient });
  } catch (error) {
    console.error(`Error getting patient: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create patient record
app.post('/api/patients/:patientId/records', async (req, res) => {
  try {
    const { userId } = req.headers;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID is required in headers' });
    }
    
    const { patientId } = req.params;
    const recordData = req.body;
    
    if (!recordData.id) {
      recordData.id = uuidv4();
    }
    
    recordData.patientId = patientId;
    
    await blockchainService.createPatientRecord(userId, recordData);
    res.status(201).json({ success: true, recordId: recordData.id, message: 'Patient record created successfully' });
  } catch (error) {
    console.error(`Error creating patient record: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get patient record
app.get('/api/patients/:patientId/records/:recordId', async (req, res) => {
  try {
    const { userId } = req.headers;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID is required in headers' });
    }
    
    const { recordId } = req.params;
    const record = await blockchainService.queryPatientRecord(userId, recordId);
    res.status(200).json({ success: true, record });
  } catch (error) {
    console.error(`Error getting patient record: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all patient records
app.get('/api/patients/:patientId/records', async (req, res) => {
  try {
    const { userId } = req.headers;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID is required in headers' });
    }
    
    const { patientId } = req.params;
    const records = await blockchainService.queryPatientRecordsByPatient(userId, patientId);
    res.status(200).json({ success: true, records });
  } catch (error) {
    console.error(`Error getting patient records: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update patient record
app.put('/api/patients/:patientId/records/:recordId', async (req, res) => {
  try {
    const { userId } = req.headers;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID is required in headers' });
    }
    
    const { recordId } = req.params;
    const recordData = req.body;
    recordData.id = recordId;
    
    await blockchainService.updatePatientRecord(userId, recordData);
    res.status(200).json({ success: true, message: 'Patient record updated successfully' });
  } catch (error) {
    console.error(`Error updating patient record: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Grant emergency access
app.post('/api/patients/:patientId/emergency-access', async (req, res) => {
  try {
    const { userId } = req.headers;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID is required in headers' });
    }
    
    const { patientId } = req.params;
    const { emergencyProviderId } = req.body;
    
    if (!emergencyProviderId) {
      return res.status(400).json({ success: false, message: 'Emergency provider ID is required' });
    }
    
    await blockchainService.grantEmergencyAccess(userId, patientId, emergencyProviderId);
    res.status(200).json({ success: true, message: 'Emergency access granted successfully' });
  } catch (error) {
    console.error(`Error granting emergency access: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Revoke emergency access
app.delete('/api/patients/:patientId/emergency-access/:providerId', async (req, res) => {
  try {
    const { userId } = req.headers;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID is required in headers' });
    }
    
    const { patientId, providerId } = req.params;
    
    await blockchainService.revokeEmergencyAccess(userId, patientId, providerId);
    res.status(200).json({ success: true, message: 'Emergency access revoked successfully' });
  } catch (error) {
    console.error(`Error revoking emergency access: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload file for a patient
app.post('/api/patients/:patientId/files', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const { patientId } = req.params;
    const { recordId, recordType, description } = req.body;
    
    // Create metadata for the file
    const fileMetadata = {
      id: uuidv4(),
      patientId,
      recordId: recordId || uuidv4(),
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      recordType: recordType || 'document',
      description: description || 'Uploaded document',
      uploadedAt: new Date().toISOString()
    };
    
    // Save metadata to a JSON file
    const metadataPath = path.join(path.dirname(req.file.path), `${path.basename(req.file.path)}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(fileMetadata, null, 2));
    
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: fileMetadata.id,
        recordId: fileMetadata.recordId,
        fileName: fileMetadata.fileName,
        fileType: fileMetadata.fileType,
        fileSize: fileMetadata.fileSize
      }
    });
  } catch (error) {
    console.error(`Error uploading file: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get files for a patient
app.get('/api/patients/:patientId/files', (req, res) => {
  try {
    const { patientId } = req.params;
    const patientDir = path.join(uploadsDir, patientId);
    
    if (!fs.existsSync(patientDir)) {
      return res.status(200).json({ success: true, files: [] });
    }
    
    const files = [];
    fs.readdirSync(patientDir).forEach(file => {
      if (file.endsWith('.json')) {
        const metadataPath = path.join(patientDir, file);
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        files.push({
          id: metadata.id,
          recordId: metadata.recordId,
          fileName: metadata.fileName,
          fileType: metadata.fileType,
          fileSize: metadata.fileSize,
          recordType: metadata.recordType,
          description: metadata.description,
          uploadedAt: metadata.uploadedAt
        });
      }
    });
    
    res.status(200).json({ success: true, files });
  } catch (error) {
    console.error(`Error getting files: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Download a file
app.get('/api/patients/:patientId/files/:fileId', (req, res) => {
  try {
    const { patientId, fileId } = req.params;
    const patientDir = path.join(uploadsDir, patientId);
    
    if (!fs.existsSync(patientDir)) {
      return res.status(404).json({ success: false, message: 'Patient directory not found' });
    }
    
    // Find the metadata file for the requested file
    let metadataFile = null;
    fs.readdirSync(patientDir).forEach(file => {
      if (file.endsWith('.json')) {
        const metadataPath = path.join(patientDir, file);
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        if (metadata.id === fileId) {
          metadataFile = metadata;
        }
      }
    });
    
    if (!metadataFile) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    // Check if the actual file exists
    if (!fs.existsSync(metadataFile.filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }
    
    // Set appropriate headers and send the file
    res.setHeader('Content-Type', metadataFile.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${metadataFile.fileName}"`);
    
    const fileStream = fs.createReadStream(metadataFile.filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error(`Error downloading file: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a file
app.delete('/api/patients/:patientId/files/:fileId', (req, res) => {
  try {
    const { patientId, fileId } = req.params;
    const patientDir = path.join(uploadsDir, patientId);
    
    if (!fs.existsSync(patientDir)) {
      return res.status(404).json({ success: false, message: 'Patient directory not found' });
    }
    
    // Find the metadata file for the requested file
    let metadataFile = null;
    let metadataPath = null;
    fs.readdirSync(patientDir).forEach(file => {
      if (file.endsWith('.json')) {
        const currentMetadataPath = path.join(patientDir, file);
        const metadata = JSON.parse(fs.readFileSync(currentMetadataPath, 'utf8'));
        if (metadata.id === fileId) {
          metadataFile = metadata;
          metadataPath = currentMetadataPath;
        }
      }
    });
    
    if (!metadataFile) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    // Delete the actual file if it exists
    if (fs.existsSync(metadataFile.filePath)) {
      fs.unlinkSync(metadataFile.filePath);
    }
    
    // Delete the metadata file
    fs.unlinkSync(metadataPath);
    
    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error(`Error deleting file: ${error}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`HealthX Passport API server running on port ${port}`);
});

module.exports = app;