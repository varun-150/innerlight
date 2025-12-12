
import React, { useState } from 'react';
import { BeliefSystem, User } from '../types';
import { ArrowRight, Lock, Mail, User as UserIcon, Phone, Sun, CheckCircle } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [belief, setBelief] = useState<BeliefSystem>(BeliefSystem.SPIRITUALITY);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    // Simulate Network Request
    setTimeout(() => {
        if (isSignup) {
            // REGISTRATION SUCCESS
            setLoading(false);
            setIsSignup(false); // Switch to Login view
            setFeedback({ type: 'success', text: 'Account created successfully! Please log in.' });
            setPassword(''); // Clear password for security/UX
        } else {
            // LOGIN SUCCESS
            const mockUser: User = {
                userId: 'user-' + Math.random().toString(36).substr(2, 9),
                name: name || (email.split('@')[0]),
                age: parseInt(age) || 20,
                gender: gender || 'Prefer not to say',
                email,
                phoneNumber: phone,
                belief,
                createdAt: new Date().toISOString(),
                isPremium: false
            };
            
            // Persist to local storage to simulate "Remember Me"
            localStorage.setItem('innerlight_user', JSON.stringify(mockUser));
            onLogin(mockUser);
            setLoading(false);
        }
    }, 1500);
  };

  const toggleMode = () => {
      setIsSignup(!isSignup);
      setFeedback(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transition-all animate-fade-in-up">
        <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
                <div className="relative w-16 h-16 flex items-center justify-center">
                     <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-40"></div>
                     <Sun className="text-orange-500 relative z-10" size={48} strokeWidth={2} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
                INNER<span className="text-indigo-600">LIGHT</span>
            </h1>
            <p className="text-slate-500">Your journey to spiritual balance begins here.</p>
        </div>

        {feedback && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {feedback.type === 'success' && <CheckCircle size={18} />}
                {feedback.text}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
                <>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            required 
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <input 
                                type="number" 
                                placeholder="Age" 
                                required 
                                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                                value={age}
                                onChange={e => setAge(e.target.value)}
                            />
                        </div>
                        <div className="relative flex-1">
                            <select
                                required
                                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-slate-700 appearance-none"
                                value={gender}
                                onChange={e => setGender(e.target.value)}
                            >
                                <option value="" disabled>Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                    <div className="relative">
                         <Phone className="absolute left-4 top-3.5 text-slate-400" size={20} />
                         <input 
                            type="tel" 
                            placeholder="Phone Number" 
                            required 
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Belief System</label>
                        <select 
                            className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-slate-700"
                            value={belief}
                            onChange={(e) => setBelief(e.target.value as BeliefSystem)}
                        >
                            {Object.values(BeliefSystem).map(b => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    required 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                    type="password" 
                    placeholder="Password" 
                    required 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            {!isSignup && (
                <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                        <input type="checkbox" className="rounded text-indigo-500 focus:ring-indigo-500" />
                        Remember me
                    </label>
                    <button type="button" className="text-indigo-600 hover:text-indigo-800 font-medium">Forgot?</button>
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
                {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
                {!loading && <ArrowRight size={20} />}
            </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-slate-500">
                {isSignup ? "Already have an account?" : "New to InnerLight?"}{" "}
                <button 
                    onClick={toggleMode} 
                    className="text-indigo-600 font-bold hover:underline"
                >
                    {isSignup ? "Login" : "Sign Up"}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};
