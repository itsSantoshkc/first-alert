import React from "react";

const SignUpPage: React.FC = () => {
  // Utility for the dotted background pattern found on the decorative blocks
  const dottedPattern = {
    backgroundImage: "radial-gradient(circle, #1a1a1a 3px, transparent 3px)",
    backgroundSize: "24px 24px",
    backgroundPosition: "0 0",
  };

  return (
    <div className="min-h-screen bg-[#FDF8EF] font-sans flex flex-col justify-between relative overflow-hidden text-[#1a1a1a]">
      {/* --- HEADER --- */}
      <header className="w-full flex justify-between items-start p-6 md:p-10 relative z-20">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold tracking-tight">
            First Alert
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <button className="bg-[#FBCF9E] text-black font-semibold py-2.5 px-6 rounded-lg text-sm transition hover:bg-[#f2b978]">
            Log in
          </button>
        </div>
      </header>

      {/* --- BACKGROUND DECORATIONS --- */}
      {/* Left Abstract Elements */}
      <div className="absolute left-10 bottom-40 hidden lg:flex items-end z-0">
        <div
          className="w-24 h-48 bg-[#FDE29D] border-2 border-transparent"
          style={dottedPattern}
        ></div>
        <div className="w-20 h-24 bg-white border border-gray-200 shadow-sm flex items-center justify-center ml-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>
        <div className="absolute -top-16 -left-4 w-32 h-10 border-t-2 border-gray-400 rounded-t-[50%] opacity-50"></div>
        <div className="absolute -top-8 left-16 w-16 h-8 border-b-2 border-gray-400 rounded-b-[50%] opacity-50"></div>
      </div>

      {/* Right Abstract Elements */}
      <div className="absolute right-10 bottom-40 hidden lg:flex items-end z-0">
        <div className="w-24 h-32 bg-white border border-gray-200 shadow-sm mr-4 relative">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-16 h-24 bg-gray-800 rounded-t-full"></div>
          <div className="absolute -top-12 -left-10 w-12 h-10 bg-[#CDE6A5] rounded-tl-lg shadow-sm transform -rotate-12"></div>
        </div>
        <div
          className="w-20 h-40 bg-[#FBCF9E] border-2 border-transparent"
          style={dottedPattern}
        ></div>
        <div className="absolute -top-20 right-10 w-24 h-12 border-t-2 border-gray-400 rounded-t-[50%] opacity-50"></div>
      </div>

      <div className="absolute bottom-40 w-full h-px bg-gray-300 z-0 hidden lg:block"></div>

      {/* --- MAIN REGISTRATION CARD --- */}
      <main className="grow flex items-center justify-center p-6 relative z-10">
        {/* Widened max-w slightly from 480px to 560px to accommodate two-column fields nicely */}
        <div className="bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 sm:p-12 w-full max-w-140">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">User Registration</h2>
            <p className="text-gray-500 text-sm px-4">
              Enter your details to create a new account
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>

            {/* Email Input */}
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition"
            />

            {/* Phone & Location Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition"
              />
              <input
                type="text"
                placeholder="Location"
                className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition"
              />
            </div>

            {/* Passwords Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition pr-12"
                />
                {/* <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-800"
                >
                  Hide
                </button> */}
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition pr-12"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full cursor-pointer bg-[#FBCF9E] hover:bg-[#f2b978] text-black font-bold rounded-xl py-3.5 mt-4 transition"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          {/* <div className="flex items-center gap-4 my-6">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs font-medium text-gray-500">
              Or Sign up with
            </span>
            <hr className="flex-1 border-gray-200" />
          </div> */}

          {/* Social Logins */}
          {/* <div className="grid grid-cols-3 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-xs font-bold hidden sm:block">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="text-xs font-bold hidden sm:block">
                Apple ID
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 hover:bg-gray-50 transition">
              <svg
                className="w-5 h-5 text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.2 11.4c0-1.2.9-1.9 2.2-1.9h1.4V7.2s-1.3-.2-2.5-.2c-2.5 0-4.2 1.5-4.2 4.4V13H8.8v2.9h2.3v7.3h3.1v-7.3h2.1l.3-2.9h-2.4v-1.6z" />
              </svg>
              <span className="text-xs font-bold hidden sm:block">
                Facebook
              </span>
            </button>
          </div> */}

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <a href="#" className="font-bold text-black hover:underline">
              Log in
            </a>
          </p>
        </div>
      </main>

      {/* --- FOOTER --- */}
    </div>
  );
};

export default SignUpPage;
