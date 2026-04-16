import React, { useState } from "react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "@tanstack/react-router";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<any, any>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const loginUser = async (data: LoginData) => {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Login failed");
    }

    return res.json();
  };

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const { accessToken, userData } = data;
      setAuth({
        user: userData,
        accessToken: accessToken,
      });
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      router.navigate({ to: "/" });
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    mutate(result.data);
  };

  return (
    <main className="grow flex items-center justify-center p-6 relative z-10">
      <div className="bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-10 sm:p-12 w-full max-w-120">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">First Alert Login</h2>
          <p className="text-gray-500 text-sm px-4">
            Hey, Enter your details to get sign in to your account
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <input
              type="text"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Passcode"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition pr-16"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Trouble signing in link */}
          <div className="pt-1">
            <a href="#" className="text-sm font-semibold hover:underline">
              Having trouble in sign in?
            </a>
          </div>

          {/* Server Error */}
          {error && (
            <p className="text-red-500 text-sm">{(error as Error).message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#FBCF9E] hover:bg-[#f2b978] text-black font-bold rounded-xl py-3.5 mt-2 transition disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="#" className="font-bold text-black hover:underline">
            Create Now
          </a>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
