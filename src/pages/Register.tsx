import type React from "react";
import { useState, useEffect } from "react";
import backgroundImage from "./../assets/background.png";
import AuthService from "../services/AuthService";
import { useNavigate, type NavigateFunction } from "react-router";
import { FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "../providers/AuthProvider";

const Register: React.FC = () => {
  const authService: AuthService = new AuthService();
  const navigate: NavigateFunction = useNavigate();
  const { setToken } = useAuth();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | undefined>(undefined);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const firstNamePattern: RegExp = /^[A-Za-zÀ-ÿ]{2,}$/;
  const lastNamePattern: RegExp = /^[A-Za-zÀ-ÿ]{2,}$/;
  const usernamePattern: RegExp = /^[A-Za-z0-9_.-]{2,}$/;
  const emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const verifyFirstNameErrorMessage: string = "First name must contain at least 2 letters.";
  const verifyLastNameErrorMessage: string = "Last name must contain at least 2 letters.";
  const verifyUsernameErrorMessage: string = "Username must contain at least 2 characters.";
  const verifyEmailErrorMessage: string = "Please enter a valid email address!";
  const verifyPasswordErrorMessage: string = "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character!";
  const DEBOUNCE_DELAY: number = 600;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !username || !email || !password) {
      toast.error("Please fill in both all required fields.");
      return;
    }

    if (!firstNamePattern.test(firstName)) {
      toast.error(verifyFirstNameErrorMessage);
      return;
    }

    if (!lastNamePattern.test(lastName)) {
      toast.error(verifyLastNameErrorMessage);
      return;
    }

    if (!usernamePattern.test(username)) {
      toast.error(verifyUsernameErrorMessage);
      return;
    }

    if (!emailPattern.test(email)) {
      toast.error(verifyEmailErrorMessage);
      return;
    }

    if (!passwordPattern.test(password)) {
      toast.error(verifyPasswordErrorMessage);
      return;
    }

    try {
      const token: string = await authService.register(firstName, lastName, username, email, password, profilePicture);

      if (!token) {
        toast.error("The register did not return a valid token.")
        return;
      }

      setToken(token);
      toast.success("Successfully registered!");
      navigate("/home");
    }
    catch (error: any) {
      switch (error.message) {
        case "EMAIL_ALREADY_EXISTS": {
          toast.error("Email already exists, try to sing in.");
          break;
        }
        case "USERNAME_ALREADY_EXISTS": {
          toast.error("Username already taken, try another one.");
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

  useEffect(() => {
    const cleanUsername: string = username.trim();

    if (!cleanUsername || cleanUsername.length < 2) {
      setIsAvailable(null);
      return;
    }

    const delay: number = setTimeout(async () => {
      setIsChecking(true);
      try {
        const available = await authService.checkUsernameAvailability(cleanUsername);
        setIsAvailable(available);
      }
      catch {
        setIsAvailable(null);
      } 
      finally {
        setIsChecking(false);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(delay);
  }, [username]);

  return (
    <div className="relative h-screen w-full bg-cover bg-center flex items-center justify-center md:justify-start" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="w-full flex justify-center md:justify-start px-4 md:ml-12 lg:ml-20">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-sm text-white">
          <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-center md:text-left">Create your <span className="text-[#9b8af7]">Commumeet</span> account</h1>
          <p className="text-sm opacity-80 mb-6 text-center md:text-left">Join the community and start connecting today.</p>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:gap-3 gap-4">
              <div className="flex flex-col gap-2 w-full lg:w-1/2">
                <label htmlFor="firstName" className="text-sm font-medium opacity-90">First name</label>
                <input id="firstName" type="text" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} pattern={firstNamePattern.source} title={verifyFirstNameErrorMessage} required className="input input-bordered bg-white/20 border-white/30 focus:ring-2 focus:ring-[#9b8af7] text-white placeholder-gray-300"/>
              </div>
              <div className="flex flex-col gap-2 w-full lg:w-1/2">
                <label htmlFor="lastName" className="text-sm font-medium opacity-90">Last name</label>
                <input id="lastName" type="text" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} pattern={lastNamePattern.source} title={verifyLastNameErrorMessage} required className="input input-bordered bg-white/20 border-white/30 focus:ring-2 focus:ring-[#9b8af7] text-white placeholder-gray-300"/>
              </div>
            </div>
            <div className="flex flex-col gap-1 relative">
              <label htmlFor="username" className="text-sm font-medium opacity-90">Username</label>
              <div className="relative">
                <input id="username" type="text" placeholder="john_doe" value={username} onChange={(e) => setUsername(e.target.value)} pattern={usernamePattern.source} title={verifyUsernameErrorMessage} required className={`input input-bordered bg-white/20 text-white placeholder-gray-300 w-full pr-10 border ${isAvailable === true ? "border-green-400" : isAvailable === false ? "border-red-400": "border-white/30"} transition-colors duration-200`}/>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isChecking ? (
                    <FaSpinner className="w-4 h-4 text-gray-300 animate-spin" />
                  ) : isAvailable === true ? (
                    <FaCheck className="w-4 h-4 text-green-400" />
                  ) : isAvailable === false ? (
                    <FaTimes className="w-4 h-4 text-red-400" />
                  ) : null}
                </div>
              </div>
              {isAvailable !== null && !isChecking && (
                <p className={`text-xs font-semibold mt-1 transition-colors duration-200 ${ isAvailable ? "text-green-400" : "text-red-400" }`}>{isAvailable ? "Username available." : "Username already taken."}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium opacity-90">Email</label>
              <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} pattern={emailPattern.source} title={verifyEmailErrorMessage} required className="input input-bordered bg-white/20 border-white/30 focus:ring-2 focus:ring-[#9b8af7] text-white placeholder-gray-300"/>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium opacity-90">Password</label>
              <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} pattern={passwordPattern.source} title={verifyPasswordErrorMessage} required className="input input-bordered bg-white/20 border-white/30 focus:ring-2 focus:ring-[#9b8af7] text-white placeholder-gray-300"/>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profilePicture" className="text-sm font-medium opacity-90">Profile picture (optional)</label>
              <div className="relative w-full">
                <label htmlFor="profilePicture" className="flex items-center bg-white/10 border border-white/30 rounded-lg text-white text-sm px-3 py-2 cursor-pointer">
                  <span className="bg-[#4F46E5] hover:bg-[#4338CA] transition-all text-white font-medium rounded-lg px-3 py-1.5 mr-3">Choose file</span>
                  <span className="truncate opacity-80">{profilePicture ? profilePicture.name : "No file chosen"}</span>
                </label>
                <input id="profilePicture" type="file" accept="image/*" onChange={(e) => setProfilePicture(e.target.files?.[0])} className="hidden"/>
              </div>
            </div>
            <button type="submit" onClick={handleSubmit} className="btn bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium rounded-lg mt-2"><p>Register</p></button>
            <div className="flex items-center justify-between text-xs mt-3 opacity-80">
              <p>Already have an account?</p>
              <p onClick={() => navigate("/login")} className="hover:text-[#9b8af7] transition cursor-pointer">Sign in</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
