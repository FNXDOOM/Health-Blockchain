/**
 * Blockchain Service for HealthX Passport
 * This service provides an interface to interact with the Hyperledger Fabric blockchain network
 */


const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

class BlockchainService {
  constructor() {
    this.channelName = 'aarogyachannel';
    this.chaincodeName = 'patient-records';
    this.mspOrg1 = 'Org1MSP';
    this.walletPath = path.join(process.cwd(), 'wallet');
    this.connectionProfilePath = path.join(process.cwd(), 'connection-profile.json');
  }

  /**
   * Initialize the wallet and connection profile
   */
  async initialize() {
    try {
      // Create the wallet if it doesn't exist
      if (!fs.existsSync(this.walletPath)) {
        fs.mkdirSync(this.walletPath, { recursive: true });
      }

      // Check if connection profile exists
      if (!fs.existsSync(this.connectionProfilePath)) {
        throw new Error(`Connection profile not found at ${this.connectionProfilePath}`);
      }

      console.log('Blockchain service initialized successfully');
      return true;
    } catch (error) {
      console.error(`Failed to initialize blockchain service: ${error}`);
      throw error;
    }
  }

  /**
   * Enroll an admin user with the Fabric CA
   */
  async enrollAdmin() {
    try {
      // Load the connection profile
      const connectionProfile = JSON.parse(fs.readFileSync(this.connectionProfilePath, 'utf8'));
      
      // Create a new CA client for interacting with the CA
      const caInfo = connectionProfile.certificateAuthorities['ca.org1.example.com'];
      const caTLSCACerts = caInfo.tlsCACerts.pem;
      const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

      // Create a new file system based wallet for managing identities
      const wallet = await Wallets.newFileSystemWallet(this.walletPath);

      // Check to see if we've already enrolled the admin user
      const identity = await wallet.get('admin');
      if (identity) {
        console.log('An identity for the admin user "admin" already exists in the wallet');
        return;
      }

      // Enroll the admin user, and import the new identity into the wallet
      const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: this.mspOrg1,
        type: 'X.509',
      };
      await wallet.put('admin', x509Identity);
      console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
    } catch (error) {
      console.error(`Failed to enroll admin user "admin": ${error}`);
      throw error;
    }
  }

  /**
   * Register and enroll a new user with the Fabric CA
   * @param {string} userId - The ID of the user to register
   */
  async registerUser(userId) {
    try {
      // Load the connection profile
      const connectionProfile = JSON.parse(fs.readFileSync(this.connectionProfilePath, 'utf8'));
      
      // Create a new CA client for interacting with the CA
      const caInfo = connectionProfile.certificateAuthorities['ca.org1.example.com'];
      const caTLSCACerts = caInfo.tlsCACerts.pem;
      const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

      // Create a new file system based wallet for managing identities
      const wallet = await Wallets.newFileSystemWallet(this.walletPath);

      // Check to see if we've already enrolled the user
      const userIdentity = await wallet.get(userId);
      if (userIdentity) {
        console.log(`An identity for the user ${userId} already exists in the wallet`);
        return;
      }

      // Check to see if we've already enrolled the admin user
      const adminIdentity = await wallet.get('admin');
      if (!adminIdentity) {
        console.log('An identity for the admin user "admin" does not exist in the wallet');
        console.log('Run the enrollAdmin.js application before retrying');
        throw new Error('Admin identity not found');
      }

      // Build a user object for authenticating with the CA
      const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
      const adminUser = await provider.getUserContext(adminIdentity, 'admin');

      // Register the user, enroll the user, and import the new identity into the wallet
      const secret = await ca.register({
        affiliation: 'org1.department1',
        enrollmentID: userId,
        role: 'client'
      }, adminUser);
      
      const enrollment = await ca.enroll({
        enrollmentID: userId,
        enrollmentSecret: secret
      });
      
      const x509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: this.mspOrg1,
        type: 'X.509',
      };
      
      await wallet.put(userId, x509Identity);
      console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
      return true;
    } catch (error) {
      console.error(`Failed to register user ${userId}: ${error}`);
      throw error;
    }
  }

  /**
   * Submit a transaction to the blockchain
   * @param {string} userId - The ID of the user submitting the transaction
   * @param {string} fcn - The chaincode function to invoke
   * @param {string[]} args - The arguments to pass to the chaincode function
   * @returns {Promise<string>} - The transaction result
   */
  async submitTransaction(userId, fcn, args) {
    try {
      // Load the connection profile
      const connectionProfile = JSON.parse(fs.readFileSync(this.connectionProfilePath, 'utf8'));

      // Create a new file system based wallet for managing identities
      const wallet = await Wallets.newFileSystemWallet(this.walletPath);

      // Check to see if we've already enrolled the user
      const identity = await wallet.get(userId);
      if (!identity) {
        throw new Error(`An identity for the user ${userId} does not exist in the wallet`);
      }

      // Create a new gateway for connecting to the peer node
      const gateway = new Gateway();
      await gateway.connect(connectionProfile, {
        wallet,
        identity: userId,
        discovery: { enabled: true, asLocalhost: true }
      });

      // Get the network (channel) our contract is deployed to
      const network = await gateway.getNetwork(this.channelName);

      // Get the contract from the network
      const contract = network.getContract(this.chaincodeName);

      // Submit the transaction
      const result = await contract.submitTransaction(fcn, ...args);
      console.log(`Transaction ${fcn} has been submitted`);

      // Disconnect from the gateway
      await gateway.disconnect();

      return result.toString();
    } catch (error) {
      console.error(`Failed to submit transaction: ${error}`);
      throw error;
    }
  }

  /**
   * Evaluate a transaction on the blockchain (query only)
   * @param {string} userId - The ID of the user evaluating the transaction
   * @param {string} fcn - The chaincode function to invoke
   * @param {string[]} args - The arguments to pass to the chaincode function
   * @returns {Promise<string>} - The query result
   */
  async evaluateTransaction(userId, fcn, args) {
    try {
      // Load the connection profile
      const connectionProfile = JSON.parse(fs.readFileSync(this.connectionProfilePath, 'utf8'));

      // Create a new file system based wallet for managing identities
      const wallet = await Wallets.newFileSystemWallet(this.walletPath);

      // Check to see if we've already enrolled the user
      const identity = await wallet.get(userId);
      if (!identity) {
        throw new Error(`An identity for the user ${userId} does not exist in the wallet`);
      }

      // Create a new gateway for connecting to the peer node
      const gateway = new Gateway();
      await gateway.connect(connectionProfile, {
        wallet,
        identity: userId,
        discovery: { enabled: true, asLocalhost: true }
      });

      // Get the network (channel) our contract is deployed to
      const network = await gateway.getNetwork(this.channelName);

      // Get the contract from the network
      const contract = network.getContract(this.chaincodeName);

      // Evaluate the transaction
      const result = await contract.evaluateTransaction(fcn, ...args);

      // Disconnect from the gateway
      await gateway.disconnect();

      return result.toString();
    } catch (error) {
      console.error(`Failed to evaluate transaction: ${error}`);
      throw error;
    }
  }

  /**
   * Create a new patient on the blockchain
   * @param {string} userId - The ID of the user creating the patient
   * @param {Object} patientData - The patient data
   * @returns {Promise<string>} - The transaction result
   */
  async createPatient(userId, patientData) {
    const {
      id,
      name,
      dateOfBirth,
      gender,
      contactInfo,
      bloodGroup,
      allergies,
      publicKey
    } = patientData;

    const args = [
      id,
      name,
      dateOfBirth,
      gender,
      contactInfo,
      bloodGroup,
      JSON.stringify(allergies),
      publicKey
    ];

    return this.submitTransaction(userId, 'CreatePatient', args);
  }

  /**
   * Create a new patient record on the blockchain
   * @param {string} userId - The ID of the user creating the record
   * @param {Object} recordData - The record data
   * @returns {Promise<string>} - The transaction result
   */
  async createPatientRecord(userId, recordData) {
    const {
      id,
      patientId,
      doctorId,
      recordType,
      description,
      diagnosis,
      treatment,
      medications,
      encryptedData,
      accessControl
    } = recordData;

    const args = [
      id,
      patientId,
      doctorId,
      recordType,
      description,
      diagnosis,
      treatment,
      JSON.stringify(medications),
      encryptedData,
      JSON.stringify(accessControl)
    ];

    return this.submitTransaction(userId, 'CreatePatientRecord', args);
  }

  /**
   * Query a patient from the blockchain
   * @param {string} userId - The ID of the user querying the patient
   * @param {string} patientId - The ID of the patient to query
   * @returns {Promise<Object>} - The patient data
   */
  async queryPatient(userId, patientId) {
    const result = await this.evaluateTransaction(userId, 'QueryPatient', [patientId]);
    return JSON.parse(result);
  }

  /**
   * Query a patient record from the blockchain
   * @param {string} userId - The ID of the user querying the record
   * @param {string} recordId - The ID of the record to query
   * @returns {Promise<Object>} - The record data
   */
  async queryPatientRecord(userId, recordId) {
    const result = await this.evaluateTransaction(userId, 'QueryPatientRecord', [recordId]);
    return JSON.parse(result);
  }

  /**
   * Query all records for a patient from the blockchain
   * @param {string} userId - The ID of the user querying the records
   * @param {string} patientId - The ID of the patient to query records for
   * @returns {Promise<Object[]>} - The patient records
   */
  async queryPatientRecordsByPatient(userId, patientId) {
    const result = await this.evaluateTransaction(userId, 'QueryPatientRecordsByPatient', [patientId]);
    return JSON.parse(result);
  }

  /**
   * Update a patient record on the blockchain
   * @param {string} userId - The ID of the user updating the record
   * @param {Object} recordData - The updated record data
   * @returns {Promise<string>} - The transaction result
   */
  async updatePatientRecord(userId, recordData) {
    const {
      id,
      description,
      diagnosis,
      treatment,
      medications,
      encryptedData,
      accessControl
    } = recordData;

    const args = [
      id,
      description,
      diagnosis,
      treatment,
      JSON.stringify(medications),
      encryptedData,
      JSON.stringify(accessControl)
    ];

    return this.submitTransaction(userId, 'UpdatePatientRecord', args);
  }

  /**
   * Grant emergency access to a patient's records
   * @param {string} userId - The ID of the user granting access
   * @param {string} patientId - The ID of the patient
   * @param {string} emergencyProviderId - The ID of the emergency provider
   * @returns {Promise<string>} - The transaction result
   */
  async grantEmergencyAccess(userId, patientId, emergencyProviderId) {
    const args = [patientId, emergencyProviderId];
    return this.submitTransaction(userId, 'GrantEmergencyAccess', args);
  }

  /**
   * Revoke emergency access to a patient's records
   * @param {string} userId - The ID of the user revoking access
   * @param {string} patientId - The ID of the patient
   * @param {string} emergencyProviderId - The ID of the emergency provider
   * @returns {Promise<string>} - The transaction result
   */
  async revokeEmergencyAccess(userId, patientId, emergencyProviderId) {
    const args = [patientId, emergencyProviderId];
    return this.submitTransaction(userId, 'RevokeEmergencyAccess', args);
  }
}

module.exports = BlockchainService;