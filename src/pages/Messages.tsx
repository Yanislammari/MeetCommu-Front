import type React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { MENU_ITEMS } from "../constants/MenuItems";
import { useAuth } from "../providers/AuthProvider";

const Messages: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-[#0f0f1a] text-white">
      <Sidebar menuItems={MENU_ITEMS} userConnected={user} />
      <main className="flex-1 flex flex-col">
        <Navbar userConnected={user} />
      </main>
    </div>
  )
}

export default Messages;
