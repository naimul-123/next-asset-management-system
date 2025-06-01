"use client";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { useAuth } from '../../contexts/authContext';
import { postData } from "../../lib/api";
import Swal from "sweetalert2";
import PasswordInput from "@/components/passwordInput";

const Login = () => {
  const { data: session, status } = useSession();
  const [sap, setSap] = useState("");
  const [password, setPassword] = useState("");
  const [loginerror, setLoginError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await postData("/api/checkisdefault", { sap, password });
      if (res.data.isDefaultPassword) {
        router.push(`/resetpassword?sap=${sap}`);
      } else {
        await signIn("credentials", {
          sap,
          password,
          redirect: true,
          callbackUrl: "/",
        });
      }
    } catch (error) {
      setLoginError(error.response.data.error);
    }
  };

  return (
    <div className="flex flex-col max-w-xs mx-auto  min-h-full justify-center">
      <form className="bg-[#f7f7f7] p-8 rounded-xl" onSubmit={handleLogin}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">SAP ID</span>
          </label>
          <input
            name="sapid"
            type="text"
            placeholder="SAP ID"
            className="input input-bordered input-sm"
            onChange={(e) => setSap(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <PasswordInput fieldName="password" handler={setPassword} />
        </div>
        <div className="form-control mt-2 justify-center">
          <button className="btn btn-info btn-soft w-full">Login</button>
        </div>
        {loginerror && (
          <div className="label flex-col max-w-xs ">
            <span className="text-xs text-danger">{loginerror}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
