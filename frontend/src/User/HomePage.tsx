import React from "react";

const HomePage: React.FC = () => {
  // Mock user data
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  };

  const dottedPattern = {
    backgroundImage: "radial-gradient(circle, #1a1a1a 3px, transparent 3px)",
    backgroundSize: "24px 24px",
    backgroundPosition: "0 0",
  };

  return (
    <div className="min-h-screen bg-[#FDF8EF] font-sans flex flex-col justify-between relative overflow-hidden text-[#1a1a1a]">
      {/* --- HEADER --- */}
      <header className="w-full flex justify-between items-start p-6 md:p-10 relative z-20">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Razor</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
            Dashboard
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <div className="w-10 h-10 bg-[#FBCF9E] rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
        </div>
      </header>

      {/* --- BACKGROUND DECORATIONS (Consistent with Login/Reg) --- */}
      <div className="absolute left-10 bottom-32 hidden lg:flex items-end z-0 opacity-40">
        <div className="w-24 h-48 bg-[#FDE29D]" style={dottedPattern}></div>
      </div>
      <div className="absolute right-10 bottom-32 hidden lg:flex items-end z-0 opacity-40">
        <div className="w-20 h-40 bg-[#FBCF9E]" style={dottedPattern}></div>
      </div>
      <div className="absolute bottom-32 w-full h-px bg-gray-200 z-0 hidden lg:block"></div>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-10 w-full max-w-[400px] text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#CDE6A5] rounded-3xl mb-4 transform rotate-3 shadow-sm">
              <svg
                className="w-10 h-10 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Welcome back!</h2>
            <p className="text-gray-500 text-sm mt-1">
              You are successfully logged in.
            </p>
          </div>

          <div className="bg-[#FDF8EF] rounded-2xl p-6 mb-8 border border-orange-100">
            <div className="mb-4">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-1">
                Full Name
              </label>
              <p className="text-lg font-semibold">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 block mb-1">
                Email Address
              </label>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => console.log("Logging out...")}
            className="w-full border-2 border-gray-100 hover:border-red-100 hover:bg-red-50 text-gray-600 hover:text-red-600 font-bold rounded-xl py-3.5 transition flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full text-center p-6 text-sm text-gray-400 relative z-20">
        Razor Platform v1.0.2 &nbsp;|&nbsp;{" "}
        <a href="#" className="hover:text-black">
          Support
        </a>
      </footer>
    </div>
  );
};

export default HomePage;
