import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const OnboardingForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [aadhar, setAadhar] = React.useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    bloodGroup: '',
    allergies: '',
    emergencyContact: '',
    emergencyRelation: '',
    emergencyPhone: '',
    consentToShare: false,
    consentToResearch: false,
    consentToEmergency: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  const validateAadhar = (aadhar) => /^\d{12}$/.test(aadhar);

  const validateStep = (currentStep) => {
    setError('');
    if (currentStep === 1) {
      if (!formData.name) return 'Name is required';
      if (!validateName(formData.name)) return 'Name must contain only letters and spaces';
      if (!formData.dateOfBirth) return 'Date of birth is required';
      if (!formData.gender) return 'Gender is required';
      if (!formData.email) return 'Email is required';
      if (!validateEmail(formData.email)) return 'Email must be a valid @gmail.com address';
      if (!formData.phone) return 'Phone number is required';
      if (!validatePhone(formData.phone)) return 'Phone number must be 10 digits';
      if (!aadhar) return 'Aadhar number is required';
      if (!validateAadhar(aadhar)) return 'Aadhar number must be exactly 12 digits';
    }
    if (currentStep === 2) {
      if (!formData.bloodGroup) return 'Blood group is required';
      if (!formData.emergencyContact) return 'Emergency contact name is required';
      if (!formData.emergencyPhone) return 'Emergency contact phone is required';
    }
    if (currentStep === 3) {
      if (!formData.consentToShare) return 'You must consent to share your medical records with authorized healthcare providers';
    }
    return null;
  };

  const nextStep = () => {
    const error = validateStep(step);
    if (error) {
      setError(error);
      return;
    }
    if (step === 1) {
      // Simulate sending confirmation link to email
      toast({
        title: 'Confirmation Email Sent',
        description: `A confirmation link has been sent to ${formData.email}. Please check your email to confirm.`,
        variant: 'default',
      });
      // Do not advance step until confirmation (simulate by not advancing)
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateStep(step);
    if (error) {
      setError(error);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Format allergies as an array
      const allergiesArray = formData.allergies
        ? formData.allergies.split(',').map(item => item.trim())
        : [];

      // Prepare patient data for blockchain
      const patientData = {
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        contactInfo: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          emergency: {
            name: formData.emergencyContact,
            relation: formData.emergencyRelation,
            phone: formData.emergencyPhone
          }
        }),
        bloodGroup: formData.bloodGroup,
        allergies: allergiesArray,
        aadhar: aadhar,
        // The backend will generate a public key if not provided
      };

      // Call API to create patient on blockchain
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userId': 'admin' // In a real app, this would be the authenticated user's ID
        },
        body: JSON.stringify(patientData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create patient record');
      }

      // Store patient data in local storage
      localStorage.setItem('patientId', data.patientId);
      localStorage.setItem('patientAuth', 'authenticated');
      localStorage.setItem('patientData', JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        aadhar: aadhar
      }));

      setSuccess(true);
      toast({
        title: 'Registration Successful',
        description: 'Your health passport has been created successfully.',
        variant: 'success',
      });

      // Redirect to health passport after a delay
      setTimeout(() => {
        router.push('/patient/health-passport');
      }, 1500);

    } catch (error) {
      console.error('Error creating patient:', error);
      setError(error.message || 'Failed to create patient record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Please provide your basic personal information to create your health passport.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="1234567890"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhar">Aadhar Number</Label>
                <Input
                  id="aadhar"
                  name="aadhar"
                  placeholder="123412341234"
                  value={aadhar}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d{0,12}$/.test(val)) {
                      setAadhar(val);
                    }
                  }}
                  maxLength={12}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="123 Main St, City, State, ZIP"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </CardContent>
          </>
        );

      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
              <CardDescription>
                Please provide your basic medical information and emergency contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) => handleSelectChange('bloodGroup', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies (comma separated)</Label>
                  <Input
                    id="allergies"
                    name="allergies"
                    placeholder="Penicillin, Peanuts, etc."
                    value={formData.allergies}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium">Emergency Contact</h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    placeholder="Jane Doe"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelation">Relationship</Label>
                  <Input
                    id="emergencyRelation"
                    name="emergencyRelation"
                    placeholder="Spouse, Parent, etc."
                    value={formData.emergencyRelation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  placeholder="1234567890"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
          </>
        );

      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle>Consent and Privacy</CardTitle>
              <CardDescription>
                Please review and provide consent for the use of your health data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consentToShare"
                  name="consentToShare"
                  checked={formData.consentToShare}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      consentToShare: checked,
                    });
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="consentToShare"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I consent to share my medical records with authorized healthcare providers
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Your records will only be accessible to healthcare providers you explicitly authorize.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consentToResearch"
                  name="consentToResearch"
                  checked={formData.consentToResearch}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      consentToResearch: checked,
                    });
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="consentToResearch"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I consent to the use of my anonymized data for medical research
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Your data will be anonymized and used to improve healthcare outcomes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consentToEmergency"
                  name="consentToEmergency"
                  checked={formData.consentToEmergency}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      consentToEmergency: checked,
                    });
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="consentToEmergency"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I consent to emergency access to my medical records in life-threatening situations
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    In case of emergency, authorized emergency personnel may access your critical medical information.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  By submitting this form, you acknowledge that your data will be stored securely on a blockchain network
                  with state-of-the-art encryption. You can revoke access or update your information at any time.
                </p>
              </div>
            </CardContent>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full max-w-4xl mx-auto">
        {renderStep()}

        {error && (
          <div className="px-6 pb-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {success && (
          <div className="px-6 pb-4">
            <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Your health passport has been created successfully!</AlertDescription>
            </Alert>
          </div>
        )}

        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}

          {step < 3 ? (
            <Button type="button" onClick={nextStep} className={step === 1 ? 'ml-auto' : ''}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={loading || success}>
              {loading ? 'Creating Health Passport...' : 'Create Health Passport'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};

export default OnboardingForm;