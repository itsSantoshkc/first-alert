import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "../../contexts/AuthContext";

const signUpSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    location: z.string().min(2, "Location must be at least 2 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpData = z.infer<typeof signUpSchema>;

const SignUpPage: React.FC = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<SignUpData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const registerUser = async (data: SignUpData) => {
    const res = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return res.json();
  };

  const { mutate, isPending, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      const { accessToken, userData } = data;
      setAuth({
        user: userData,
        accessToken: accessToken,
      });
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      router.navigate({ to: "/" });

      setErrors({});
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = signUpSchema.safeParse(formData);

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
      <div className="bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 sm:p-12 w-full max-w-140">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">User Registration</h2>
          <p className="text-gray-500 text-sm px-4">
            Enter your details to create a new account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-gray-400 transition"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Server Error */}
          {error && (
            <p className="text-red-500 text-sm">{(error as Error).message}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full cursor-pointer bg-[#FBCF9E] hover:bg-[#f2b978] text-black font-bold rounded-xl py-3.5 mt-4 transition disabled:opacity-60"
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <a href="#" className="font-bold text-black hover:underline">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
};

export default SignUpPage;
