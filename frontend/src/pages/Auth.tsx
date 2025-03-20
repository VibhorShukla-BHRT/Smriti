import React, { useState, useEffect } from 'react';
import { Brain, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

function GlitterBackground() {
  const [glitters, setGlitters] = useState<Array<{ id: number; left: string; top: string; delay: string }>>([]);

  useEffect(() => {
    const newGlitters = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`
    }));
    setGlitters(newGlitters);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {glitters.map((glitter) => (
        <div
          key={glitter.id}
          className="glitter"
          style={{
            left: glitter.left,
            top: glitter.top,
            animationDelay: glitter.delay
          }}
        />
      ))}
    </div>
  );
}

function InputField({ 
  type = "text",
  label, 
  placeholder,
  icon: Icon
}: { 
  type?: string;
  label: string;
  placeholder: string;
  icon: React.ElementType;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200">
          <Icon className="w-4 h-4" />
        </div>
        <input
          type={type}
          className="block w-full pl-10 px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function PasswordInput({ label, placeholder }: { label: string; placeholder: string }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200">
          <Lock className="w-4 h-4" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          className="block w-full pl-10 px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function AuthForm({ isLogin, onToggle }: { isLogin: boolean; onToggle: () => void }) {
  return (
    <div className="auth-card w-full max-w-md p-8 rounded-2xl shadow-xl">
      <div className="flex flex-col items-center mb-8">
        <div className="logo-animation p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
          <Brain className="w-8 h-8 text-white animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Memory Vault: Smriti
        </h1>
        <p className="text-sm text-gray-600 mt-2 text-center italic">Preserving memories, connecting hearts</p>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        {isLogin ? 'Welcome back' : 'Create account'}
      </h2>

      <button className="google-signin-btn w-full py-2.5 px-4 rounded-md bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2 mb-6">
        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
        <span className="text-gray-700 font-medium">Sign in with Google</span>
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <form className="space-y-4">
        {!isLogin && (
          <InputField
            label="Full Name"
            placeholder="Enter your name"
            icon={User}
          />
        )}
        
        <InputField
          type="email"
          label="Email"
          placeholder="Enter your email"
          icon={Mail}
        />

        <PasswordInput 
          label="Password"
          placeholder="Enter your password"
        />

        {!isLogin && (
          <PasswordInput 
            label="Confirm Password"
            placeholder="Confirm your password"
          />
        )}

        {isLogin && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-all duration-300"
              />
              <label className="ml-2 block text-sm text-gray-700">Remember me</label>
            </div>
            <a href="#" className="text-purple-600 hover:text-purple-500 font-medium transition-all duration-300">
              Forgot?
            </a>
          </div>
        )}

        <button
          type="submit"
          className="gradient-button w-full py-2.5 px-4 rounded-md text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 text-base mt-4"
        >
          {isLogin ? 'Sign in' : 'Sign up'}
        </button>

        <div className="text-center mt-4">
          <button 
            type="button"
            onClick={onToggle}
            className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-300"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center p-4">
      <GlitterBackground />
      <AuthForm isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
    </div>
  );
}

export default Auth;