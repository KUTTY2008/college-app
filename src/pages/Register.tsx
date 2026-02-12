import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { UserRole } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [batch, setBatch] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Create User in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Send Verification Email
      await sendEmailVerification(user);

      // 3. Create User Document in Firestore
      const userData: any = {
        uid: user.uid,
        name: fullName,
        email: email,
        role: role,
        createdAt: new Date().toISOString(),
      };

      if (role === 'student') {
        userData.rollNumber = rollNumber;
        userData.phone = phone;
        userData.batch = batch;
      }

      await setDoc(doc(db, 'users', user.uid), userData);

      setSuccess("Account created successfully! Please check your email for verification before logging in.");
      
      // Clear form (optional, or redirect after timeout)
      setTimeout(() => navigate('/login'), 5000);

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Email is already registered.");
      } else {
        setError("Failed to create account: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden py-12">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Create Account
            </h2>
            <p className="text-slate-400 mt-2">Join the Nexus Portal</p>
          </div>

          {/* Role Switcher */}
          <div className="flex bg-slate-800/50 p-1 rounded-xl mb-8 relative">
            <div 
              className={cn(
                "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-indigo-600 rounded-lg transition-all duration-300 ease-out",
                role === 'student' ? "left-1" : "left-[calc(50%+4px)]"
              )} 
            />
            <button
              type="button"
              onClick={() => setRole('student')}
              className={cn(
                "flex-1 py-2 text-sm font-medium z-10 transition-colors duration-200",
                role === 'student' ? "text-white" : "text-slate-400 hover:text-slate-200"
              )}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('staff')}
              className={cn(
                "flex-1 py-2 text-sm font-medium z-10 transition-colors duration-200",
                role === 'staff' ? "text-white" : "text-slate-400 hover:text-slate-200"
              )}
            >
              Staff
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-200 p-3 rounded-lg text-sm mb-6">
              {success}
            </div>
          )}

          {!success && (
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />

              {role === 'student' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Roll Number"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      required={role === 'student'}
                    />
                    <Input
                      label="Batch (Year)"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      required={role === 'student'}
                      placeholder="e.g. 2024"
                    />
                  </div>
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required={role === 'student'}
                  />
                </motion.div>
              )}
              
              <Button 
                type="submit" 
                className="w-full mt-6" 
                isLoading={loading}
                size="lg"
              >
                Register as {role === 'student' ? 'Student' : 'Staff'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
