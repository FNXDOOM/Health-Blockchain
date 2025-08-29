import { Gateway, Network, Contract } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ipfsService } from './ipfs';
import { logFabric } from './logger';

// Types
type Identity = {
  credentials: {
    certificate: string;
    privateKey: string;
  };
  mspId: string;
  type: string;
};

type NetworkConfig = {
  channelName: string;
  chaincodeName: string;
  walletPath: string;
  connectionProfile: any;
};

class FabricService {
  private gateway: Gateway;
  private network: Network | null = null;
  private contract: Contract | null = null;
  private config: NetworkConfig;

  constructor() {
    this.gateway = new Gateway();
    this.config = this.loadConfig();
  }

  private loadConfig(): NetworkConfig {
    try {
      const connectionProfilePath = path.resolve(
        process.cwd(),
        'connection-profile.json'
      );
      const connectionProfile = JSON.parse(
        fs.readFileSync(connectionProfilePath, 'utf8')
      );

      return {
        channelName: process.env.FABRIC_CHANNEL_NAME || 'mychannel',
        chaincodeName: process.env.FABRIC_CHAINCODE_NAME || 'patient-records',
        walletPath: path.resolve(process.cwd(), 'wallet'),
        connectionProfile,
      };
    } catch (error) {
      console.error('Failed to load Fabric configuration:', error);
      throw new Error('Failed to load Fabric configuration');
    }
  }

  async init(identity: Identity): Promise<void> {
    const startTime = Date.now();
    try {
      logFabric('INIT', { 
        identity: identity.mspId,
        channel: this.config.channelName,
        chaincode: this.config.chaincodeName 
      });

      await this.gateway.connect(
        this.config.connectionProfile,
        {
          identity: identity.mspId,
          discovery: { enabled: true, asLocalhost: true },
        }
      );

      this.network = await this.gateway.getNetwork(this.config.channelName);
      this.contract = this.network.getContract(this.config.chaincodeName);

      const endTime = Date.now();
      logFabric('INIT_SUCCESS', { 
        duration: `${endTime - startTime}ms`,
        network: this.config.channelName,
        contract: this.config.chaincodeName
      });
    } catch (error) {
      console.error('Failed to initialize Fabric service:', error);
      throw new Error('Failed to connect to Hyperledger Fabric network');
    }
  }

  async createPatientRecord(patientData: any): Promise<string> {
    if (!this.contract) {
      const error = new Error('Fabric contract not initialized');
      logFabric('CREATE_RECORD_ERROR', { error: error.message });
      throw error;
    }

    const startTime = Date.now();
    const recordId = uuidv4();
    const transactionId = uuidv4();
    
    try {
      logFabric('CREATE_RECORD_START', { 
        recordId,
        patientId: patientData.id,
        transactionId
      });
      
      const timestamp = new Date().toISOString();
      
      // Store patient data in IPFS
      const cid = await ipfsService.uploadData(patientData);
      
      const record = {
        id: recordId,
        patientId: patientData.id,
        cid,
        type: 'PATIENT_CREATE',
        timestamp,
        updatedBy: patientData.updatedBy || 'system',
        transactionId,
      };

      logFabric('SUBMIT_TRANSACTION', {
        function: 'createRecord',
        recordId,
        cid,
        transactionId
      });

      await this.contract.submitTransaction(
        'createRecord',
        JSON.stringify(record)
      );

      const endTime = Date.now();
      logFabric('CREATE_RECORD_SUCCESS', { 
        recordId,
        transactionId,
        duration: `${endTime - startTime}ms`
      });

      return transactionId;
    } catch (error) {
      console.error('Error creating patient record:', error);
      throw new Error(`Failed to create patient record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePatientRecord(updateData: any): Promise<string> {
    if (!this.contract) {
      throw new Error('Fabric contract not initialized');
    }

    try {
      const transactionId = uuidv4();
      const timestamp = new Date().toISOString();
      
      // Store update in IPFS
      const cid = await ipfsService.uploadData(updateData);
      
      const update = {
        ...updateData,
        cid,
        timestamp,
        transactionId,
        type: 'PATIENT_UPDATE',
      };

      await this.contract.submitTransaction(
        'updateRecord',
        JSON.stringify(update)
      );

      return transactionId;
    } catch (error) {
      console.error('Error updating patient record on blockchain:', error);
      throw new Error('Failed to update patient record on blockchain');
    }
  }

  async getPatientHistory(patientId: string): Promise<any[]> {
    if (!this.contract) {
      throw new Error('Fabric contract not initialized');
    }

    try {
      const result = await this.contract.evaluateTransaction(
        'getPatientHistory',
        patientId
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.error('Error fetching patient history:', error);
      throw new Error(`Failed to fetch patient history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get patient record by ID
  async getPatientRecord(recordId: string): Promise<any> {
    if (!this.contract) {
      throw new Error('Fabric contract not initialized');
    }

    try {
      const result = await this.contract.evaluateTransaction(
        'getRecord',
        recordId
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.error('Error fetching patient record:', error);
      throw new Error(`Failed to fetch patient record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async queryPatientRecords(query: string): Promise<any[]> {
    if (!this.contract) {
      throw new Error('Fabric contract not initialized');
    }

    try {
      const result = await this.contract.evaluateTransaction(
        'queryRecords',
        query
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.error('Error querying patient records:', error);
      throw new Error(`Failed to query patient records: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }


  // Disconnect from the gateway when done
  async disconnect(): Promise<void> {
    this.gateway.disconnect();
  }
}

export const fabricService = new FabricService();
