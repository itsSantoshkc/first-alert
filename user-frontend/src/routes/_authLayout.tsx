import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isTokenExpired } from "../utilities/jwtHelper";

export const Route = createFileRoute("/_authLayout")({
  component: RouteComponent,
  beforeLoad: () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !isTokenExpired(accessToken)) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function RouteComponent() {
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
      <Outlet />
    </div>
  );
}
