import type React from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useAuth } from "../providers/AuthProvider";
import { useEffect } from "react";

const Home: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <div className="flex h-screen bg-[#0f0f1a] text-white">
      {/* === Sidebar === */}
      

      {/* === Main content === */}
      <main className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar  userConnected={user} />
        {/* Feed */}
        <section className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-semibold mb-4">Home</h2>
          
        </section>
      </main>
    </div>
  );
};

export default Home;

const SidebarButton: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }> = ({
  icon,
  label,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 px-3 py-2 rounded-lg transition-all ${
      active ? "bg-[#9b8af7]/20 text-[#9b8af7]" : "hover:bg-white/10 text-gray-300"
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="hidden md:block text-sm font-medium">{label}</span>
  </button>
);
