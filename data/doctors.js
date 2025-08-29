// Dummy doctor data
export const dummyDoctors = [
  {
    name: "Nikhil Kumar",
    did: "DOC2024001",
    licenseNumber: "KA12345678",
    phone: "9876543210",
    email: "nikhil.kumar@hospital.com",
    specialization: "Cardiologist",
    hospital: "City General Hospital"
  },
  // Add more doctors as needed
];

export const verifyDoctor = (did, licenseNumber) => {
  return dummyDoctors.find(
    doctor => doctor.did === did && doctor.licenseNumber === licenseNumber
  );
};

export const generateOTP = () => {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
};
