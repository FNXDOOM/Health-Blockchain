export interface Doctor {
  id: string;
  name: string;
  did: string;
  licenseNumber: string;
  phone: string;
  email: string;
  specialization: string;
  hospital: string;
  isActive: boolean;
  lastActive?: Date;
  ipfsHash?: string;
  publicKey?: string;
}
