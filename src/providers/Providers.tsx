import React from "react";
import GoogleOAuthLoginProvider from "./GoogleOAuthLoginProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <GoogleOAuthLoginProvider>
    {children}
  </GoogleOAuthLoginProvider>
)

export default Providers;
