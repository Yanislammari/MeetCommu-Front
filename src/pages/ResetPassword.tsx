import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, type NavigateFunction } from "react-router";
import backgroundImage from "./../assets/background-alt.png";
import { toast } from "sonner";
import AuthService from "../services/auth.service";

const ResetPassword: React.FC = () => {
  const authService: AuthService = new AuthService();
  const navigate: NavigateFunction = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isTokenProvided, setIsTokenProvided] = useState<boolean>(false);
  const [isTokenExpired, setIsTokenExpired] = useState<boolean>(false);
  const [isTokenInvalid, setIsTokenInvalid] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const token: string | null = searchParams.get("token");
  const passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const verifyPasswordErrorMessage: string = "Password must contain at least 8 characters, including an uppercase, lowercase, number and special character.";

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        toast.error("Invalid or missing token.");
        setIsTokenProvided(false);
        return;
      }

      setIsTokenProvided(true);

      try {
        const isValid: boolean = await authService.verifyResetPasswordToken(token);
        setIsTokenExpired(!isValid);
      }
      catch (error: any) {
        if (error.message === "TOKEN_EXPIRED") {
          console.log("test");
          toast.error("Your reset link has expired.");
          setIsTokenExpired(true);
        }
        else if (error.message === "INVALID_TOKEN") {
          toast.error("The token is invalid.");
          setIsTokenInvalid(true);
        }
        else {
          toast.error("Invalid reset link.");
          setIsTokenExpired(true);
        }
      }
    }

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!passwordPattern.test(password)) {
      toast.error(verifyPasswordErrorMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.resetPassword(password, token);
      toast.success("Password successfully reset! You can now sign in.");
      navigate("/login");
    }
    catch (error: any) {
      switch (error.message) {
        case "TOKEN_EXPIRED":
          toast.error("Your reset link has expired. Please request a new one.");
          break;
        case "INVALID_TOKEN":
          toast.error("Invalid reset link.");
          break;
        case "RESET_PASSWORD_FAILED": {
          toast.error("Error during reset password.");
          break;
        }
        case "GRAPHQL_ERROR": {
          toast.error("Something went wrong. Please try again later.");
          break;
        }
        default:
          toast.error("Something went wrong. Please try again later.");
          break;
      }
    }
    finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative h-screen w-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="w-full max-w-md px-6">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white text-center">
          {!isTokenProvided ? (
            <div>
              <h1 className="text-2xl font-semibold text-red-400 mb-3">Token Missing</h1>
              <p className="opacity-80 mb-6">No token was found in your reset link. Please request a new one.</p>
              <button onClick={() => navigate("/forgot-password")} className="bg-[#4F46E5] hover:bg-[#4338CA] transition-all py-2.5 px-4 rounded-lg font-medium"><p>Request New Link</p></button>
            </div>
          ) : isTokenInvalid ? (
            <div>
              <h1 className="text-2xl font-semibold text-red-400 mb-3">Invalid Link</h1>
              <p className="opacity-80 mb-6">The password reset link is invalid or has been tampered with.</p>
              <button onClick={() => navigate("/forgot-password")} className="bg-[#4F46E5] hover:bg-[#4338CA] transition-all py-2.5 px-4 rounded-lg font-medium"><p>Request New Link</p></button>
            </div>
          ) : isTokenExpired ? (
            <div>
              <h1 className="text-2xl font-semibold text-yellow-400 mb-3">Link Expired</h1>
              <p className="opacity-80 mb-6">Your reset link has expired. Please request a new one to reset your password. </p>
              <button onClick={() => navigate("/forgot-password")} className="bg-[#4F46E5] hover:bg-[#4338CA] transition-all py-2.5 px-4 rounded-lg font-medium"><p>Request New Link</p></button>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-semibold mb-4">Reset your <span className="text-[#9b8af7]">password</span></h1>
              <p className="text-sm opacity-80 mb-8">Enter your new password below to complete the reset process.</p>
              <form className="flex flex-col gap-5 text-left">
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm font-medium opacity-90">New password</label>
                  <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} pattern={passwordPattern.source} title={verifyPasswordErrorMessage} required className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9b8af7] placeholder-gray-300 text-white"/>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium opacity-90">Confirm password</label>
                  <input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9b8af7] placeholder-gray-300 text-white"/>
                </div>
                <button type="submit" onClick={handleSubmit} disabled={isSubmitting} className={`bg-[#4F46E5] hover:bg-[#4338CA] transition-all py-2.5 rounded-lg font-medium mt-2 cursor-pointer ${ isSubmitting ? "opacity-60 cursor-not-allowed" : "" }`}><p>{isSubmitting ? "Resetting..." : "Reset Password"}</p></button>
                <div className="flex items-center justify-center text-sm mt-3 opacity-80">
                  <p onClick={() => navigate("/login")} className="hover:text-[#9b8af7] transition cursor-pointer">Back to Sign In</p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
