import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router";
import backgroundImage from "./../assets/background.png";
import { toast } from "sonner";
import AuthService from "../services/auth.service";
import { FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

const ForgotPassword: React.FC = () => {
  const authService: AuthService = new AuthService();
  const navigate: NavigateFunction = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [exists, setExists] = useState<boolean | null>(null);
  const emailPattern: RegExp =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const verifyEmailErrorMessage = "Please enter a valid email address.";
  const DEBOUNCE_DELAY = 600;

  useEffect(() => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !emailPattern.test(cleanEmail)) {
      setExists(null);
      return;
    }

    const delay = setTimeout(async () => {
      setIsChecking(true);
      try {
        const emailExists: boolean = await authService.checkEmailAvailability(cleanEmail);
        setExists(!emailExists);
      }
      catch {
        setExists(null);
      }
      finally {
        setIsChecking(false);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(delay);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!emailPattern.test(email)) {
      toast.error(verifyEmailErrorMessage);
      return;
    }

    try {
      await authService.sendResetPasswordMail(email);
      toast.success("A reset password link has been sent.");
      setEmail("");
    }
    catch (error: any) {
      switch (error.message) {
        case "EMAIL_NOT_FOUND":
          toast.error("No account found with this email.");
          break;
        case "EMAIL_SENDING_FAILED": {
          toast.error("Sending the email failed, please retry again later.");
          break;
        }
        case "GRAPHQL_ERROR": {
          toast.error("Something went wrong, please try again later.");
          break;
        }
        default:
          toast.error("Something went wrong, please try again later.");
          break;
      }
    }
  };

  return (
    <div className="relative h-screen w-full bg-cover bg-center flex items-center justify-center md:justify-start" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="w-full flex justify-center md:justify-start px-6 md:ml-16 lg:ml-24">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md text-white">
          <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-center md:text-left">Forgot your <span className="text-[#9b8af7]">password</span>?</h1>
          <p className="text-sm md:text-base mb-8 opacity-80 text-center md:text-left">Enter your email below and we’ll send you a link to reset your password.</p>
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-1 relative">
              <label htmlFor="email" className="text-sm font-medium opacity-90">Email address</label>
              <div className="relative">
                <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} pattern={emailPattern.source} title={verifyEmailErrorMessage} required className={`bg-white/20 border rounded-lg px-4 py-2 text-white placeholder-gray-300 w-full pr-10 ${exists === true ? "border-green-400" : exists === false ? "border-red-400" : "border-white/30"} focus:outline-none focus:ring-2 focus:ring-[#9b8af7] transition-colors duration-200`}/>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isChecking ? (
                    <FaSpinner className="w-4 h-4 text-gray-300 animate-spin" />
                  ) : exists === true ? (
                    <FaCheck className="w-4 h-4 text-green-400" />
                  ) : exists === false ? (
                    <FaTimes className="w-4 h-4 text-red-400" />
                  ) : null}
                </div>
              </div>
              {exists !== null && !isChecking && (
                <p className={`text-xs font-semibold mt-1 transition-colors duration-200 ${ exists ? "text-green-400" : "text-red-400" }`}>{exists ? "An account was found for this email." : "This email doesn’t exist in our system."}</p>
              )}
            </div>
            <button type="submit" onClick={handleSubmit} className="bg-[#4F46E5] hover:bg-[#4338CA] transition-all py-2.5 rounded-lg font-medium mt-2 cursor-pointer">
              <p>Send Reset Link</p>
            </button>
            <div className="flex items-center justify-between text-sm mt-3 opacity-80">
              <p onClick={() => navigate("/login")} className="hover:text-[#9b8af7] transition cursor-pointer">Back to Sign In</p>
              <p onClick={() => navigate("/register")} className="hover:text-[#9b8af7] transition cursor-pointer">Create an account</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
