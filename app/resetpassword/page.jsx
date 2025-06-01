"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validatePassword } from "../../lib/passwordvalidation";
import { updateData } from "../../lib/api";
import PasswordInput from "@/components/passwordInput";

import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

const ResetPassword = () => {
  const [newpassword, setNewPassword] = useState("");
  const [repass, setRepass] = useState("");
  const [sap, setSap] = useState("");
  const [error, setError] = useState([]);
  const [retypeError, setRetypeError] = useState("");
  const [resetError, setResetError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sap = params.get("sap");
    setSap(sap);
  }, []);

  const handlePasswordChange = (pas) => {
    setError([]);
    const passErrors = validatePassword(pas);
    setError(passErrors);
    if (!passErrors) {
      setNewPassword(pas);
      matchpass();
    }
  };

  const matchpass = (v) => {
    if (newpassword !== v) {
      setRetypeError("Retyped password dose not match with password");
    } else {
      setRetypeError("");
    }
  };

  const handleRetypePassword = (pass) => {
    matchpass(pass);
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    const form = e.target;
    const password = form.password.value;
    if (!error && !retypeError && !!password && !!newpassword && !!sap) {
      try {
        const res = await updateData("/api/updatepassword", {
          sap,
          password,
          newpassword,
        });

        if (res?.data?.success && res?.data?.redirectTo) {
          Swal.fire(res?.data?.message);
          if (session?.user) {
            router.push("/");
          } else {
            router.push(res?.data.redirectTo);
          }
        }
        console.log(res);
      } catch (error) {
        console.error(error);
        setResetError(error.response.data.error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto w-full max-w-xs  justify-center">
      <form
        className="flex flex-col space-y-2  mx-auto w-full max-w-xs bg-base-200 rounded-xl justify-center p-8 "
        onSubmit={handleResetPassword}
      >
        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Password</span>
          </div>
          <PasswordInput cls="grow" fieldName="password" />
        </div>
        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">New Password </span>
          </div>
          <PasswordInput
            cls="grow"
            fieldName="newpassword"
            handler={handlePasswordChange}
          />
          {error.length > 0 && (
            <div className="flex flex-wrap ">
              <span className="text-xs text-red my-2">{error}</span>
            </div>
          )}
        </div>
        <div className="form-control w-full">
          <div className="label">
            <span className="label-text">Retype New Password </span>
          </div>
          <PasswordInput
            cls="grow"
            fieldName="npassword"
            handler={handleRetypePassword}
          />

          {retypeError && (
            <div className="flex flex-wrap">
              <span className="text-xs text-red my-2">{retypeError}</span>
            </div>
          )}
          {resetError && (
            <div className="flex flex-wrap">
              <span className="text-xs text-red my-2">{resetError}</span>
            </div>
          )}
        </div>
        <div className="form-control w-full">
          <button
            className="btn btn-info btn-soft w-full"
            disabled={error || retypeError}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
