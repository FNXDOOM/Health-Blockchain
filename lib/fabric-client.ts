import { Gateway, Wallets, X509WalletMixin } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';
import { PatientRecordUpdate } from '@/types/patient';

const ccpPath = path.resolve(__dirname, '../connection-profile.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

class FabricClient {
  private walletPath: string;
  private wallet: any;
  private gateway: Gateway;
  private channelName: string;
  private chaincodeName: string;

  constructor() {
    this.walletPath = path.join(process.cwd(), 'wallet');
    this.channelName = 'mychannel'; // Update with your channel name
    this.chaincodeName = 'patient-records';
    this.gateway = new Gateway();
  }

  async connect(userId: string) {
    // Create a new file system based wallet for managing identities
    this.wallet = await Wallets.newFileSystemWallet(this.walletPath);
    
    // Check to see if we've already enrolled the user
    const userIdentity = await this.wallet.get(userId);
    if (!userIdentity) {
      throw new Error(`An identity for the user ${userId} does not exist in the wallet`);
    }

    // Create a new gateway for connecting to our peer node
    await this.gateway.connect(ccp, {
      wallet: this.wallet,
      identity: userId,
      discovery: { enabled: true, asLocalhost: true }
    });
  }

  async disconnect() {
    this.gateway.disconnect();
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
      throw error;
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
