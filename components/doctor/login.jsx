import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { verifyDoctor, generateOTP } from '@/data/doctors';

const DoctorLogin = () => {
  const router = useRouter();
  const [did, setDid] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [otpSent, setOtpSent] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleSendOTP = () => {
    if (!did || !licenseNumber) {
      toast({ title: 'Error', description: 'DID and License Number are required', variant: 'destructive' });
      return;
    }

    const doctor = verifyDoctor(did, licenseNumber);
    if (!doctor) {
      toast({ title: 'Error', description: 'Invalid credentials. Please check your DID and License Number.', variant: 'destructive' });
      return;
    }

    // Generate and send OTP (in real app, this would be sent via SMS)
    const otp = generateOTP();
    setOtpSent(otp);
    setCurrentDoctor(doctor);
    setShowOtpInput(true);
    setResendTimer(30); // 30 seconds cooldown

    // In production, you would send this OTP to the doctor's phone number
    console.log(`OTP for ${doctor.name}: ${otp}`);
    
    toast({ 
      title: 'OTP Sent', 
      description: `An OTP has been sent to the registered phone number ending with ${doctor.phone.slice(-4)}`,
      variant: 'default' 
    });
  };

  const handleResendOTP = () => {
    if (resendTimer > 0) return;
    
    const otp = generateOTP();
    setOtpSent(otp);
    setResendTimer(30);
    
    console.log(`New OTP for ${currentDoctor.name}: ${otp}`);
    
    toast({ 
      title: 'New OTP Sent', 
      description: `A new OTP has been sent to your registered phone number`,
      variant: 'default' 
    });
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      toast({ title: 'Error', description: 'Please enter a valid 6-digit OTP', variant: 'destructive' });
      return;
    }

    if (otp !== otpSent) {
      toast({ title: 'Error', description: 'Invalid OTP. Please try again.', variant: 'destructive' });
      return;
    }

    // Set authentication status
    localStorage.setItem('doctorAuth', 'authenticated');
    localStorage.setItem('currentDoctor', JSON.stringify(currentDoctor));
    
    toast({ 
      title: 'Login Successful', 
      description: `Welcome back, Dr. ${currentDoctor.name}`,
      variant: 'success' 
    });
    
    // Redirect to doctor dashboard
    setTimeout(() => {
      router.push('/doctor');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Doctor Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showOtpInput ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="did">Doctor ID (DID)</Label>
                <Input
                  id="did"
                  placeholder="Enter your Doctor ID"
                  value={did}
                  onChange={(e) => setDid(e.target.value.toUpperCase())}
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input
                  id="license"
                  placeholder="Enter your license number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleSendOTP}
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
              
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium">Enter OTP</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit code to the phone number ending with {currentDoctor?.phone?.slice(-4) || '****'}
                </p>
              </div>
              
              <div className="flex justify-center space-x-2">
                <Input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setOtp(value);
                  }}
                  placeholder="000000"
                  className="text-center text-xl font-mono tracking-widest w-48"
                />
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0}
                  className={`text-primary ${resendTimer > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpInput(false);
                    setOtp('');
                  }}
                  className="text-primary hover:underline"
                >
                  Change Details
                </button>
              </div>
              
              <Button 
                className="w-full mt-4" 
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              
              <div className="text-center text-xs text-muted-foreground mt-4">
                <p>Check the browser console for the OTP</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorLogin;
