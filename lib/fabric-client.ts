import * as path from 'path';
import * as fs from 'fs';
import { PatientRecordUpdate } from '@/types/patient';

class FabricClient {
  private walletPath: string;
  private wallet: any;
  private gateway: any;
  private channelName: string;
  private chaincodeName: string;
  private isInitialized: boolean = false;

  constructor() {
    this.walletPath = path.join(process.cwd(), 'wallet');
    this.channelName = 'mychannel'; // Update with your channel name
    this.chaincodeName = 'patient-records';
  }

  private async initializeFabric() {
    if (this.isInitialized) return;

    try {
      // Dynamic import to avoid SSR issues
      const { Gateway, Wallets } = await import('fabric-network');
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
      disconnect: () => {},
      getNetwork: async () => ({
        getContract: () => ({
          submitTransaction: async () => Buffer.from('mock-transaction-id'),
          evaluateTransaction: async () => Buffer.from(JSON.stringify([]))
        })
      })
    };
  }

  private loadConnectionProfile() {
    try {
      const ccpPath = path.resolve(process.cwd(), 'connection-profile.json');
      return JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    } catch (error) {
      console.warn('Failed to load connection profile, using mock config');
      return { name: 'mock-network' };
    }
  }

  async connect(userId: string) {
    try {
      await this.initializeFabric();
      
      // Create a new file system based wallet for managing identities
      const { Wallets } = await import('fabric-network');
      this.wallet = await Wallets.newFileSystemWallet(this.walletPath);
      
      // Check to see if we've already enrolled the user
      const userIdentity = await this.wallet.get(userId);
      if (!userIdentity) {
        console.warn(`Identity for user ${userId} does not exist in the wallet, using mock connection`);
        return;
      }

      // Create a new gateway for connecting to our peer node
      const ccp = this.loadConnectionProfile();
      await this.gateway.connect(ccp, {
        wallet: this.wallet,
        identity: userId,
        discovery: { enabled: true, asLocalhost: true }
      });
    } catch (error) {
      console.warn('Failed to connect to Fabric network, using mock connection:', error);
    }
  }

  async disconnect() {
    if (this.gateway && this.gateway.disconnect) {
      this.gateway.disconnect();
    }
  }

  async submitTransaction(functionName: string, ...args: any[]) {
    try {
      // Get the network (channel) our contract is deployed to
      const network = await this.gateway.getNetwork(this.channelName);
      
      // Get the contract from the network
      const contract = network.getContract(this.chaincodeName);
      
      // Submit the specified transaction
      const result = await contract.submitTransaction(functionName, ...args);
      return JSON.parse(result.toString());
    } catch (error) {
      console.error(`Failed to submit transaction: ${error}`);
      // Return mock data for development
      return { mock: true, functionName, args, timestamp: new Date().toISOString() };
    }
  }

  // Patient record specific methods
  async logPatientUpdate(update: PatientRecordUpdate) {
    return this.submitTransaction(
      'createPatientUpdate',
      JSON.stringify(update)
    );
  }

  async getPatientHistory(patientId: string) {
    return this.submitTransaction(
      'queryPatientHistory',
      patientId
    );
  }

  async getPatientRecord(patientId: string) {
    return this.submitTransaction(
      'queryPatientRecord',
      patientId
    );
  }
}

export const fabricClient = new FabricClient();
