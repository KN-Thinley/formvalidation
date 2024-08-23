"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "./ui/use-toast";

const SignUpForm = () => {
  interface SignUpFormProps {
    email: string;
    fullname: string;
    age: number;
    gender: string;
    password: string;
    confirmPassword: string;
  }

  const [formData, setFormData] = useState<SignUpFormProps>({
    email: "",
    fullname: "",
    age: 0,
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [valid, setValid] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));

    const newErrors = validateField(name, value);
    setErrors((prev) => ({ ...prev, ...newErrors }));

    setValid((prev) => ({
      ...prev,
      [name]: !newErrors[name],
    }));
  };

  const validateField = (name: string, value: string | number) => {
    const newErrors: Record<string, string> = {};

    if (name === "email") {
      if (!value) {
        newErrors.email = "Email is required";
      } else if (typeof value === "string" && !value.includes("@")) {
        newErrors.email = "Email is invalid";
      } else {
        delete errors.email;
      }
    }

    if (name === "fullname") {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!value) {
        newErrors.fullname = "Full Name is required";
      } else if (typeof value === "string" && !nameRegex.test(value)) {
        newErrors.fullname = "Name can only contain letters and spaces";
      } else if (typeof value === "string" && value.length < 2) {
        newErrors.fullname = "Full name too short";
      } else {
        delete errors.fullname;
      }
    }

    if (name === "age") {
      if (!value) {
        newErrors.age = "Age is required";
      } else if (Number(value) <= 18 || Number(value) > 100) {
        newErrors.age = "Age must be between 18 and 100";
      } else {
        delete errors.age;
      }
    }

    if (name === "gender") {
      if (!value) {
        newErrors.gender = "Gender is required";
      } else {
        delete errors.gender;
      }
    }

    if (name === "password") {
      const bannedWords = ["gcit", "vle", "gyalpozhing", "password"];
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!value) {
        newErrors.password = "Password is required";
      } else if (
        typeof value === "string" &&
        bannedWords.some((word) => value.includes(word))
      ) {
        newErrors.password = "Password cannot contain organizational words";
      } else if (typeof value === "string" && value.length < 6) {
        newErrors.password = "Password too short";
      } else if (typeof value === "string" && !passwordRegex.test(value)) {
        newErrors.password =
          "Password must contain uppercase, lowercase, number, and special character";
      } else {
        delete errors.password;
      }
    }

    if (name === "confirmPassword") {
      if (!value) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (value !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete errors.confirmPassword;
      }
    }

    return newErrors;
  };
  const validate = () => {
    const allErrors: Record<string, string> = {};
    for (const key in formData) {
      const fieldErrors = validateField(
        key,
        formData[key as keyof SignUpFormProps]
      );

      Object.assign(allErrors, fieldErrors);
    }
    return allErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Submit form
      console.log("formdata", formData);
      try {
        const response = await fetch(
          "http://localhost:4000/api/users/register",
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
            description: "Account created successfully",
          });
        } else {
          toast({
            title: "Uh Oh! Something went wrong",
            variant: "destructive",
            description: data.message,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Sign Up</h2>
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
              id="email"
              name="email"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email
                  ? "border-red-500"
                  : valid.email
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.fullname
                  ? "border-red-500"
                  : valid.fullname
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              value={formData.fullname}
              onChange={handleChange}
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.age
                  ? "border-red-500"
                  : valid.age
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              value={formData.age}
              onChange={handleChange}
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.gender
                  ? "border-red-500"
                  : valid.gender
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
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
              id="password"
              name="password"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.password
                  ? "border-red-500"
                  : valid.password
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              name="confirmPassword"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.confirmPassword
                  ? "border-red-500"
                  : valid.confirmPassword
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-indigo-600"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span className="ml-2 text-sm text-gray-700">Show Password</span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign Up
            </button>
          </div>
          <p className="mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
