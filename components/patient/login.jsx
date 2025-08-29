import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const PatientLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const generateOTP = () => {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const validateAadhar = (aadhar) => /^\d{12}$/.test(aadhar);

  const handleSendOTP = async () => {
    if (!email || !validateEmail(email)) {
      toast({ title: 'Error', description: 'Please enter a valid @gmail.com email', variant: 'destructive' });
      return;
    }
    if (!aadhar || !validateAadhar(aadhar)) {
      toast({ title: 'Error', description: 'Aadhar number must be exactly 12 digits', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // Generate and send OTP (in real app, this would be sent via SMS/Email)
      const otp = generateOTP();
      setOtpSent(otp);
      setShowOtpInput(true);
      setResendTimer(30); // 30 seconds cooldown

      // In production, you would send this OTP to the patient's phone/email
      console.log(`OTP for Aadhar ${aadhar}: ${otp}`);
      
      toast({ 
        title: 'OTP Sent', 
        description: `A 6-digit OTP has been sent to your registered contact details`,
        variant: 'default' 
      });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send OTP', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (resendTimer > 0) return;
    
    const otp = generateOTP();
    setOtpSent(otp);
    setResendTimer(30);
    
    console.log(`New OTP for Aadhar ${aadhar}: ${otp}`);
    
    toast({ 
      title: 'New OTP Sent', 
      description: `A new OTP has been sent to your registered contact details`,
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
    localStorage.setItem('patientAuth', 'authenticated');
    
    toast({ 
      title: 'Login Successful', 
      description: 'Welcome back!',
      variant: 'success' 
    });
    
    // Redirect to health passport after a short delay
    setTimeout(() => {
      router.push('/patient/health-passport');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Patient Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showOtpInput ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadhar">Aadhar Number</Label>
                <Input
                  id="aadhar"
                  type="text"
                  maxLength={12}
                  value={aadhar}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setAadhar(val);
                  }}
                  placeholder="123412341234"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleSendOTP}
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Dummy Aadhar: 123412341234</p>
                <p>Dummy Email: test@gmail.com</p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium">Enter OTP</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit code to your registered contact details
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

export default PatientLogin;
