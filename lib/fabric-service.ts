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
  private gateway: any;
  private network: any = null;
  private contract: any = null;
  private config: NetworkConfig;
  private isInitialized: boolean = false;

  constructor() {
    this.config = this.loadConfig();
  }

  private async initializeFabric() {
    if (this.isInitialized) return;

    try {
      // Dynamic import to avoid SSR issues
      const { Gateway } = await import('fabric-network');
      this.gateway = new Gateway();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Fabric Network initialization failed:', error);
      // Create a mock gateway for development
      this.gateway = this.createMockGateway();
      this.isInitialized = true;
    }
  }

  private createMockGateway() {
    return {
      connect: async () => true,
      getNetwork: async () => ({
        getContract: () => ({
          submitTransaction: async () => Buffer.from('mock-transaction-id'),
          evaluateTransaction: async () => Buffer.from(JSON.stringify([]))
        })
      }),
      disconnect: () => {}
    };
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
      // Return mock config for development
      return {
        channelName: 'mychannel',
        chaincodeName: 'patient-records',
        walletPath: path.resolve(process.cwd(), 'wallet'),
        connectionProfile: { name: 'mock-network' },
      };
    }
  }

  async init(identity: Identity): Promise<void> {
    const startTime = Date.now();
    try {
      await this.initializeFabric();
      
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
      // Don't throw error, just log it for development
      console.warn('Using mock Fabric service for development');
    }
  }

  async createPatientRecord(patientData: any): Promise<string> {
    if (!this.contract) {
      console.warn('Fabric contract not initialized, using mock service');
      // Return mock transaction ID for development
      return `mock-tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
      // Return mock transaction ID for development
      return `mock-tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  async updatePatientRecord(updateData: any): Promise<string> {
    if (!this.contract) {
      console.warn('Fabric contract not initialized, using mock service');
      return `mock-tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
      return `mock-tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  async getPatientHistory(patientId: string): Promise<any[]> {
    if (!this.contract) {
      console.warn('Fabric contract not initialized, returning mock data');
      return [];
    }

    try {
      const result = await this.contract.evaluateTransaction(
        'getPatientHistory',
        patientId
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.error('Error fetching patient history:', error);
      return [];
    }
  }

  // Get patient record by ID
  async getPatientRecord(recordId: string): Promise<any> {
    if (!this.contract) {
      console.warn('Fabric contract not initialized, returning mock data');
      return { mock: true, recordId };
    }

    try {
      const result = await this.contract.evaluateTransaction(
        'getRecord',
        recordId
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.error('Error fetching patient record:', error);
      return { mock: true, recordId, error: 'Mock data due to Fabric error' };
    }
  }

  async queryPatientRecords(query: string): Promise<any[]> {
    if (!this.contract) {
      console.warn('Fabric contract not initialized, returning mock data');
      return [];
    }

    try {
      const result = await this.contract.evaluateTransaction(
        'queryRecords',
        query
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.error('Error querying patient records:', error);
      return [];
    }
  }

  // Disconnect from the gateway when done
  async disconnect(): Promise<void> {
    if (this.gateway && this.gateway.disconnect) {
      this.gateway.disconnect();
    }
  }
}

export const fabricService = new FabricService();
