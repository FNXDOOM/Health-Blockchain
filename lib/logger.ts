import { Writable } from 'stream';

class TerminalLogger extends Writable {
  private readonly startTime: number;
  private readonly serviceName: string;

  constructor(serviceName: string) {
    super({ objectMode: true });
    this.startTime = Date.now();
    this.serviceName = serviceName;
  }

  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    const timestamp = new Date().toISOString();
    const uptime = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    const message = typeof chunk === 'object' 
      ? JSON.stringify(chunk, null, 2)
      : String(chunk);
    
    process.stdout.write(`[${timestamp}] [${this.serviceName}] [${uptime}s] ${message}\n`);
    callback();
  }
}

export const fabricLogger = new TerminalLogger('FABRIC');
export const ipfsLogger = new TerminalLogger('IPFS');

export function logFabric(action: string, data?: any) {
  fabricLogger.write({
    action,
    ...(data && { data })
  });
}

export function logIPFS(action: string, data?: any) {
  ipfsLogger.write({
    action,
    ...(data && { data })
  });
}
