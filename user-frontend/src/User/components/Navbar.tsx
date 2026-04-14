import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = {
    firstName: "John",
    lastName: "Doe",
  };
  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Click outside to close dropdown handler
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute top-6 left-0 right-0 z-10 px-6 flex justify-end items-start pointer-events-none">
      {/* Left Side: Pills */}
      {/* <div className="flex gap-3 pointer-events-auto">
        <button className="bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 rounded-full px-5 py-3 font-bold text-sm hover:bg-white transition">
          Dashboard
        </button>

        <button className="bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 rounded-full px-5 py-3 font-bold text-sm hover:bg-white transition flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          Alerts
        </button>
      </div> */}

      {/* Right Side: User Avatar & Dropdown */}
      <div className="relative pointer-events-auto" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-[#FBCF9E] text-black shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-sm hover:bg-[#f2b978] transition"
        >
          {initials}
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 py-2 overflow-hidden transform origin-top-right transition-all">
            <div className="px-4 py-3 border-b border-gray-100 mb-1">
              <p className="text-sm font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">Agent Account</p>
            </div>

            <button className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition">
              Profile
            </button>
            <button className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition">
              Alert History
            </button>

            <div className="h-px w-full bg-gray-100 my-1"></div>

            <button
              onClick={() => console.log("Logging out...")}
              className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
