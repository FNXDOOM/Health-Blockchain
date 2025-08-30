import { logIPFS } from './logger';

type IpfsConfig = {
  host: string;
  port: number;
  protocol: string;
};

class IpfsService {
  private client: any;
  private config: IpfsConfig;
  private isInitialized: boolean = false;

  constructor() {
    this.config = {
      host: process.env.NEXT_PUBLIC_IPFS_API_URL || 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    };
  }

  private async initializeClient() {
    if (this.isInitialized) return;

    try {
      // Dynamic import to avoid SSR issues
      const { create } = await import('ipfs-http-client');
      this.client = create(this.config);
      this.isInitialized = true;
    } catch (error) {
      console.warn('IPFS client initialization failed:', error);
      // Create a mock client for development
      this.client = this.createMockClient();
      this.isInitialized = true;
    }
  }

  private createMockClient() {
    return {
      version: async () => ({ version: 'mock-ipfs' }),
      add: async (data: any) => ({ 
        cid: { toString: () => `mock-cid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` } 
      }),
      cat: async function* (cid: string) {
        yield Buffer.from(JSON.stringify({ mock: true, cid }));
      }
    };
  }

  private getAuth() {
    if (process.env.NEXT_PUBLIC_IPFS_PROJECT_ID && process.env.NEXT_PUBLIC_IPFS_API_KEY) {
      return {
        username: process.env.NEXT_PUBLIC_IPFS_PROJECT_ID,
        password: process.env.NEXT_PUBLIC_IPFS_API_KEY,
      };
    }
    return undefined;
  }

  async init() {
    try {
      await this.initializeClient();
      const version = await this.client.version();
      console.log('IPFS node version:', version.version);
      return true;
    } catch (error) {
      console.error('Failed to connect to IPFS node:', error);
      return false;
    }
  }

  async uploadData(data: Record<string, any>): Promise<string> {
    const startTime = Date.now();
    const dataId = data.id || 'unknown';
    const dataType = data.type || 'unknown';
    
    try {
      await this.initializeClient();
      
      logIPFS('UPLOAD_DATA_START', { 
        dataId,
        dataType,
        size: JSON.stringify(data).length
      });
      
      const content = JSON.stringify(data);
      const buffer = Buffer.from(content);
      
      logIPFS('ADD_TO_IPFS', { 
        dataId,
        size: buffer.length,
        type: 'json'
      });
      
      const { cid } = await this.client.add(buffer);
      const cidStr = cid.toString();
      
      logIPFS('UPLOAD_DATA_SUCCESS', {
        dataId,
        cid: cidStr,
        duration: `${Date.now() - startTime}ms`
      });
      
      return cidStr;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      // Return a mock CID for development
      return `mock-cid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  async getData<T = any>(cid: string): Promise<T> {
    const startTime = Date.now();
    
    try {
      await this.initializeClient();
      
      logIPFS('FETCH_DATA_START', { cid });
      
      const stream = this.client.cat(cid);
      let data = '';
      let chunkCount = 0;
      let totalSize = 0;
      
      for await (const chunk of stream) {
        data += chunk.toString();
        chunkCount++;
        totalSize += chunk.length;
      }
      
      const result = JSON.parse(data) as T;
      
      logIPFS('FETCH_DATA_SUCCESS', {
        cid,
        chunkCount,
        size: totalSize,
        duration: `${Date.now() - startTime}ms`
      });
      
      return result;
    } catch (error) {
      console.error('Error fetching from IPFS:', error);
      // Return mock data for development
      return { mock: true, cid, error: 'Mock data due to IPFS error' } as T;
    }
  }

  async uploadFile(file: File): Promise<string> {
    const startTime = Date.now();
    
    try {
      await this.initializeClient();
      
      logIPFS('UPLOAD_FILE_START', {
        fileName: file.name,
        type: file.type,
        size: file.size
      });
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      logIPFS('ADD_FILE_TO_IPFS', {
        fileName: file.name,
        size: buffer.length
      });
      
      const { cid } = await this.client.add({
        path: file.name,
        content: buffer,
      });
      
      const cidStr = cid.toString();
      
      logIPFS('UPLOAD_FILE_SUCCESS', {
        fileName: file.name,
        cid: cidStr,
        duration: `${Date.now() - startTime}ms`
      });
      
      return cidStr;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      // Return a mock CID for development
      return `mock-file-cid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  getGatewayUrl(cid: string, filename?: string): string {
    const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL || 'https://ipfs.io/ipfs/';
    const url = new URL(cid, gateway);
    if (filename) {
      url.pathname = `${url.pathname}/${filename}`;
    }
    return url.toString();
  }
}

export const ipfsService = new IpfsService();

export default ipfsService;
