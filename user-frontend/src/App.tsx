// src/App.tsx
import { Outlet } from "@tanstack/react-router";
import Navbar from "./User/components/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* existing pages render here */}
    </>
  );
}
