import type React from "react";
import { useNavigate, type NavigateFunction } from "react-router";
import backgroundImage from "./../assets/background.png";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { toast } from "sonner";
import AuthService from "../services/AuthService";
import { useAuth } from "../providers/AuthProvider";

const Main: React.FC = () => {
  const authService = new AuthService();
  const navigate: NavigateFunction = useNavigate();
  const { setToken } = useAuth();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const idToken: string | undefined = credentialResponse.credential;
      if (!idToken) {
        toast.error("No Google token received.");
        return;
      }

      const token: string = await authService.loginWithGoogle(idToken);
      setToken(token);
      toast.success("Signed in with Google successfully!");
      navigate("/home");
    }
    catch (error: any) {
      toast.error("Google login failed, please try again.");
    }
  }

  return (
    <div className="relative h-screen w-full bg-cover bg-center flex items-center justify-center md:justify-start" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="w-full flex justify-center md:justify-start px-6 md:ml-16 lg:ml-24">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md text-white">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-center md:text-left">Welcome to <span className="text-[#9b8af7]">Commumeet</span></h1>
          <p className="text-sm md:text-base mb-8 opacity-80 text-center md:text-left">Connect to join vast community spaces, sharing your passions.</p>
          <div className="flex flex-col gap-4">
            <button onClick={() => navigate("/login")} className="bg-[#4F46E5] hover:bg-[#4338CA] transition-all py-2.5 rounded-lg font-medium w-full cursor-pointer"><p>Sign In</p></button>
            <button onClick={() => navigate("/register")} className="bg-transparent border border-white/40 hover:bg-white/10 transition-all py-2.5 rounded-lg font-medium w-full cursor-pointer"><p>Sign Up</p></button>
            <div className="relative">
              <button id="customGoogleButton" className="bg-white text-gray-900 hover:bg-gray-200 transition-all py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 w-full cursor-pointer">
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5"/>
                <p>Continue with Google</p>
              </button>
              <div className="absolute inset-0 opacity-0">
                <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error("Google login failed.")} text="continue_with" shape="rectangular" size="large" useOneTap={false}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
