import type React from "react";
import { useState } from "react";
import backgroundImage from "./../assets/background.png";
import { toast } from "sonner";
import AuthService from "../services/auth.service";
import { useNavigate, type NavigateFunction } from "react-router";

const Login: React.FC = () => {
  const authService: AuthService = new AuthService();
  const navigate: NavigateFunction = useNavigate();
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const usernamePattern: RegExp = /^[A-Za-z0-9_.-]{2,}$/;
  const verifyIdentifierErrorMessage: string = "Please enter a valid email address or username.";
  const verifyPasswordErrorMessage: string = "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      toast.error("Please fill in both email and password fields.");
      return;
    }

    if (!emailPattern.test(identifier) && !usernamePattern.test(identifier)) {
      toast.error(verifyIdentifierErrorMessage);
      return;
    }

    if (!passwordPattern.test(password)) {
      toast.error(verifyPasswordErrorMessage);
      return;
    }

    try {
      const token: string = await authService.login(identifier, password);

      if (!token) {
        toast.error("The login did not return a valid token.")
        return;
      }

      localStorage.setItem("token", token);
      toast.success("Successfully signed in!");
      navigate("/home");
    }
    catch (error: any) {
      switch (error.message) {
        case "INVALID_EMAIL_CREDENTIALS": {
          toast.error("No account found with this email.");
          break;
        }
        case "INVALID_USERNAME_CREDENTIALS": {
          toast.error("No account found for this username.");
          break;
        }
        case "INVALID_PASSWORD_CREDENTIALS": {
          toast.error("Incorrect password, please try again.");
          break;
        }
        case "GRAPHQL_ERROR": {
          toast.error("Internal servor error, please retry later.");
          break;
        }
        default: {
          toast.error("Internal servor error, please retry later.");
          break;
        }
      }
    }
  }

  return (
    <div className="relative h-screen w-full bg-cover bg-center flex items-center justify-center md:justify-start" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="w-full flex justify-center md:justify-start px-6 md:ml-16 lg:ml-24">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md text-white">
          <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-center md:text-left">Connect to <span className="text-[#9b8af7]">Commumeet</span></h1>
          <p className="text-sm md:text-base mb-8 opacity-80 text-center md:text-left">Welcome back! Please enter your credentials to access your account.</p>
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="identifier" className="text-sm font-medium opacity-90">Email or Username</label>
              <input id="identifier" type="text" placeholder="you@example.com or john_doe" value={identifier} onChange={(e) => setIdentifier(e.target.value)} pattern={emailPattern.source} title={verifyIdentifierErrorMessage} required className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9b8af7] placeholder-gray-300 text-white"/>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium opacity-90">Password</label>
              <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} pattern={passwordPattern.source} title={verifyPasswordErrorMessage} required className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9b8af7] placeholder-gray-300 text-white"/>
            </div>
            <button type="submit" onClick={handleSubmit} className="bg-[#4F46E5] hover:bg-[#4338CA] transition-all py-2.5 rounded-lg font-medium mt-4 cursor-pointer"><p>Sign In</p></button>
            <div className="flex items-center justify-between text-sm mt-3 opacity-80">
              <p className="hover:text-[#9b8af7] transition cursor-pointer">Forgot password?</p>
              <p onClick={() => navigate("/register")} className="hover:text-[#9b8af7] transition cursor-pointer">Create an account</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
