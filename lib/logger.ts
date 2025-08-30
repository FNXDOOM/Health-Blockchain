// Simple logger that works in both Node.js and browser environments
function createLogger(serviceName: string) {
  return {
    log: (action: string, data?: any) => {
      const timestamp = new Date().toISOString();
      const message = {
        timestamp,
        service: serviceName,
        action,
        ...(data && { data })
      };
      
      if (typeof window !== 'undefined') {
        // Browser environment
        console.log(`[${serviceName}] ${action}`, data || '');
      } else {
        // Node.js environment
        console.log(`[${timestamp}] [${serviceName}] ${action}`, data ? JSON.stringify(data, null, 2) : '');
      }
    }
  };
}

export const fabricLogger = createLogger('FABRIC');
export const ipfsLogger = createLogger('IPFS');

export function logFabric(action: string, data?: any) {
  fabricLogger.log(action, data);
}

export function logIPFS(action: string, data?: any) {
  ipfsLogger.log(action, data);
}
