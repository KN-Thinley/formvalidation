"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "./ui/use-toast";
const LoginForm = () => {
  interface LoginFormProps {
    email: string;
    password: string;
  }

  const { toast } = useToast();

  const [formData, setFormData] = useState<LoginFormProps>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [valid, setValid] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const validateField = (name: string, value: string) => {
    const newErrors: Record<string, string> = {};

    if (name === "email") {
      if (!value) {
        newErrors.email = "Email is required";
      } else if (typeof value === "string" && !value.includes("@")) {
        newErrors.email = "Enter a valid email format";
      } else {
        delete errors.email;
      }
    }

    if (name === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

      if (!value) {
        newErrors.password = "Password is required";
      } else if (typeof value === "string" && !passwordRegex.test(value)) {
        newErrors.password =
          "Password must contain uppercase, lowercase, number, and special character";
      } else {
        delete errors.password;
      }
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const newErrors = validateField(name, value);

    setErrors((prev) => ({ ...prev, ...newErrors }));

    setValid((prev) => ({
      ...prev,
      [name]: !newErrors[name],
    }));
  };

  const validate = () => {
    const allErrors: Record<string, string> = {};
    for (const key in formData) {
      const fieldErrors = validateField(
        key,
        formData[key as keyof LoginFormProps]
      );

      Object.assign(allErrors, fieldErrors);
    }
    return allErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const allErrors = validate();
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
    } else {
      try {
        const response = await fetch(
          "https://formvalidation-server.onrender.com/api/users/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast({
            variant: "default",
            description: "Login Successful",
          });
          console.log("User login successful");
        } else {
          toast({
            variant: "destructive",
            title: "Uh Oh! Something went wrong",
            description: "Login Failed, Check your credentials",
          });
          console.log(
            "User login failed, Check your credentials " + data.message
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border  rounded-md shadow-sm ${
                errors.email
                  ? "border-red-500"
                  : valid.email
                  ? "border-green-500"
                  : "border-gray-300"
              } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password
                  ? "border-red-500"
                  : valid.password
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="mb-4 flex space-x-2 items-center">
            <input
              type="checkbox"
              name="showPassword"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="block"
            />
            <label
              htmlFor="showPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Show Password
            </label>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white p-2 rounded"
            >
              Login
            </button>
          </div>
          <p>
            Don&apos;t have an account?{" "}
            <Link href={"/signup"} className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
