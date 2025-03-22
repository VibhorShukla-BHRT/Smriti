import React, { useState, useEffect } from 'react';
import { Brain, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router'

function GlitterBackground() {
  const [glitters, setGlitters] = useState([]);

  useEffect(() => {
    const newGlitters = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 2}s`
    }));
    setGlitters(newGlitters);
  }, []);

  // return (
  //   <div className="fixed inset-0 overflow-hidden">
  //     {glitters.map((glitter) => (
  //       <div
  //         key={glitter.id}
  //         className="glitter"
  //         style={{
  //           left: glitter.left,
  //           top: glitter.top,
  //           animationDelay: glitter.delay
  //         }}
  //       />
  //     ))}
  //   </div>
  // );
}

function InputField({ type = "text", label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200">
          {/* <Icon className="w-4 h-4" /> */}
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="block w-full pl-10 px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

function PasswordInput({ label, placeholder, value, onChange }) {
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
          value={value}
          onChange={onChange}
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

function AuthForm({ isLogin, onToggle, loginData, setLoginData, signupData, setSignupData }) {
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await fetch("http://localhost:3000/api/v1/user/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      })
      .then((response) => {
        if(!response.ok) {
          throw new Error('Signin failed')
        }
        return response.json()
      })
      .then((data) => {
        navigate("/")
      })
      .catch(error => {
        console.error("Error during signup:", error);
      });
    } else {
      await fetch("http://localhost:3000/api/v1/user/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signupData)
      })
      .then((response) => {
        if(!response.ok) {
          throw new Error('Signup failed')
        }
        return response.json()
      })
      .then((data) => {
        navigate("/")
      })
      .catch(error => {
        console.error("Error during signup:", error);
      });
    }
  };

  return (
    <div className="auth-card w-full max-w-md p-8 rounded-2xl shadow-xl bg-white">
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

      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isLogin && (
          <InputField
            label="Full Name"
            placeholder="Enter your name"
            icon={User}
            value={signupData.name}
            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
          />
        )}

        <InputField
          type="email"
          label="Email"
          placeholder="Enter your email"
          icon={Mail}
          value={isLogin ? loginData.email : signupData.email}
          onChange={(e) => isLogin
            ? setLoginData({ ...loginData, email: e.target.value })
            : setSignupData({ ...signupData, email: e.target.value })
          }
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={isLogin ? loginData.password : signupData.password}
          onChange={(e) => isLogin
            ? setLoginData({ ...loginData, password: e.target.value })
            : setSignupData({ ...signupData, password: e.target.value })
          }
        />

        {!isLogin && (
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={signupData.confirmPassword}
            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
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
          className="gradient-button w-full py-2.5 px-4 rounded-md text-white bg-purple-600 hover:bg-purple-700 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 text-base mt-4"
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
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center p-4 pt-[5rem]">
      <GlitterBackground />
      <AuthForm
        isLogin={isLogin}
        onToggle={() => setIsLogin(!isLogin)}
        loginData={loginData}
        setLoginData={setLoginData}
        signupData={signupData}
        setSignupData={setSignupData}
      />
    </div>
  );
}

export default Auth;
