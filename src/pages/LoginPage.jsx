import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const LoginPage = () => {
    const navigate = useNavigate();
  
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
  
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
  
    const onSubmit = (data) => {
      setLoading(true);
      // Add rememberMe flag to the login data
      const loginData = { ...data, rememberMe };
      LogINHandler(loginData);
    };
  
    const LogINHandler = async (data) => {
      try {
        // Send the login request
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/login`,
          data
        );
  
        setLoading(false);
  
        if (response.data.success) {
          // On successful login, store the user data in localStorage
          localStorage.setItem("email", response.data.data.email);
          localStorage.setItem("token", response.data.data.token);
          
          // Redirect the user to the home page
          navigate("/");
  
          // Show a success message
          toast.success(response.data.message || "Login successful");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      } catch (error) {
        setLoading(false);
        toast.error("An error occurred. Please try again.");
        console.log("Login error:", error);
      }
    };
  
    const handleRemember = () => {
      setRememberMe((prevValue) => !prevValue);
    };
  
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit(onSubmit)();
      }
    };

  return (
    <div className="flex flex-col justify-center items-center gap-3 w-full h-screen px-8">
      <div className="flex flex-col justify-center items-center w-full">
        <img
          src="../public/Logo_PC_blue.png"
          alt=" Manage Logo"
          draggable="false"
        />
        <h1 className="font-semibold text-[30px] text-center">
          Sign in to ManageMate
        </h1>
        <p className="text-[#002338] text-center">Please login to continue</p>
      </div>

      <div className="w-full flex justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="">
          {/* email input */}
          <div>
            <label
              htmlFor="email"
              className="block text-[16px] font-normal text-black"
            >
              Email <span className="text-red-400">*</span>
            </label>

            <input
              {...register("email", { required: true })}
              className="w-[300px] lg:w-[480px] h-[52px] rounded-[6px] border-[2px] border-[#C1C1C1] outline-none focus:border-blue-400 px-3"
              type="email"
              placeholder="Enter Your Email"
              required
              onKeyDown={handleKeyPress}
            />
            {/* {authError && <p className="text-red-400">{authError?.email}</p>} */}
            {errors.email && <p className="text-red-400">This field is required</p>}
          </div>

          {/* password input */}
          <div>
            <div className="flex flex-row justify-between items-start mt-3">
              <label
                htmlFor="password"
                className="block text-[16px] text-black font-normal"
              >
                Password <span className="text-red-400">*</span>
              </label>
            </div>

            <input
              {...register("password", { required: true })}
              className="w-[300px] lg:w-[480px] h-[52px] rounded-[6px] border-[2px] border-[#C1C1C1] outline-none focus:border-blue-400 px-3"
              type="password"
              placeholder="Enter Your Password"
              required
              onKeyDown={handleKeyPress}
            />
            {/* {authError && <p className="text-red-400">{authError?.password}</p>} */}
            {errors.password && <p className="text-red-400">This field is required</p>}
          </div>

          {/* Remember me checkbox */}
          <div className="flex flex-row justify-between items-center gap-3 mt-3">
            <div className="flex flex-row justify-start items-center gap-1">
              <input
                onClick={handleRemember}
                type="checkbox"
                name="remember"
                id="remember"
                className="cursor-pointer mb-0 bg-[#D9D9D9]"
              />
              <label
                htmlFor="remember"
                className="block text-[16px] text-[#002338B2] font-normal cursor-pointer"
              >
                Remember Me?
              </label>
            </div>
          </div>

          {/* Submit button */}
          {loading ? (
            <button
              type="submit"
              disabled
              className="w-[300px] lg:w-[480px] h-[52px] text-white rounded-[30px] mt-2 cursor-not-allowed bg-[#62BA47]"
            >
              Logging in...
            </button>
          ) : (
            <button
              type="submit"
              className="w-[300px] lg:w-[480px] h-[52px] text-white rounded-[30px] mt-2 bg-blue-600 hover:bg-[#0179a7]"
            >
              Login
            </button>
          )}
        </form>
      </div>

      <div className="mt-5 w-full lg:w-[500px] flex flex-col justify-center items-center">
        <p className="text-center mt-3">
          Don't you have an account?{" "}
          <span className="text-[#009DDA] underline">Ask an Admin</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
