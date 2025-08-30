'use client';
import { DoctorNftPanel } from "@/components/doctor-nft-panel"

const currentDoctor = {
  name: "Nikhil Kumar",
  specialization: "Cardiologist",
  hospital: "City General Hospital",
  licenseNumber: "KA12345678"
};

export default function DoctorNftPanelPage() {
  return (
    <div className="space-y-6">
      <DoctorNftPanel currentDoctor={currentDoctor} />
    </div>
  )
}