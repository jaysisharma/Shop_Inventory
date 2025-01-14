// src/pages/Login.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

// Validation schema using Yup
const schema = yup.object({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  // Initialize useNavigate for redirection
  const navigate = useNavigate();

  // Hook form with Yup validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // State for toggling password visibility and remember me checkbox
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Submit Handler
  const onSubmit = (data) => {
    console.log("Form Submitted", data);
    alert("Login successful!");

    // Save a token to localStorage (simulate authentication)
    localStorage.setItem("authToken", "your-token-here");

    // Redirect to the homepage
    navigate("/");

    // Clear form fields after submission
    reset();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Section - Image and Logo */}
      <div className="hidden md:block w-full md:w-2/3 bg-gray-100 relative">
        <div className="absolute top-6 left-6">
          <h1 className="text-4xl font-bold text-blue-600">INVPRO</h1>
          <p className="text-sm text-gray-600 italic">Simplify Inventory Management</p>
        </div>
        <img
          src="https://via.placeholder.com/600x800" // Replace with your image URL
          alt="Login Visual"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-6">
        <div className="w-full px-16">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-4">Welcome Back</h2>
          <p className="text-center text-gray-600 mb-8">
            Access your dashboard and manage your inventory efficiently.
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={`mt-1 block w-full px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`mt-1 block w-full px-4 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter your password"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900 transition"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:outline-none"
            >
              Log In
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-6 text-center">
            Don&apos;t have an account yet?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>

          <div className="text-center mt-8">
            <a
              href="/forgot-password"
              className="text-blue-500 hover:underline text-sm"
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
