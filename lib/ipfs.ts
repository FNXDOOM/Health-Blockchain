import { create, IPFSHTTPClient } from 'ipfs-http-client';
import { Buffer } from 'buffer';
import { logIPFS } from './logger';

type IpfsConfig = {
  host: string;
  port: number;
  protocol: string;
};

class IpfsService {
  private client: IPFSHTTPClient;
  private config: IpfsConfig;

  constructor() {
    this.config = {
      host: process.env.NEXT_PUBLIC_IPFS_API_URL || 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    };

    this.client = create(this.config);
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
      const version = await this.client.version();
      console.log('IPFS node version:', version.version);
      return true;
    } catch (error) {
      console.error('Failed to connect to IPFS node:', error);
      throw new Error('Failed to connect to IPFS node');
    }
  }

  async uploadData(data: Record<string, any>): Promise<string> {
    const startTime = Date.now();
    const dataId = data.id || 'unknown';
    const dataType = data.type || 'unknown';
    
    try {
      logIPFS('UPLOAD_DATA_START', { 
        dataId,
        dataType,
        size: Buffer.byteLength(JSON.stringify(data))
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
      throw new Error('Failed to upload data to IPFS');
    }
  }

  async getData<T = any>(cid: string): Promise<T> {
    const startTime = Date.now();
    
    try {
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
      throw new Error('Failed to fetch data from IPFS');
    }
  }

  async uploadFile(file: File): Promise<string> {
    const startTime = Date.now();
    
    try {
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
      throw new Error('Failed to upload file to IPFS');
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
