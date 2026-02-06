"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { validateSession } from "../redux/auth/services/authService";
import { useRouter } from "next/navigation";
import { logout, setOtp } from "../redux/auth/authenticateSlice";
import { socket } from "../libraries/socket.library";

function Dashboard() {
  const [otp, setotp] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  // const { currentUser } = useAppSelector((state) => state.authenticator);
  // useEffect(() => {
  //   if (currentUser) {
  //     socket.connect();
  //   }
  // }, []);
  useEffect(() => {
    validateSession();
    socket.on("otp", (data) => {
      setotp(data);
      // dispatch(setOtp(data));
    });
    socket.on("logout", () => {
      dispatch(logout());
      socket.disconnect();
      router.replace("/pages/auth/login");
    });
  }, [dispatch]);
  // const { otp } = useAppSelector((state) => state.authenticator);
  return (
    <div>
      welcome t stackoverflow
      {otp && <div>your otp :{otp}</div>}
    </div>
  );
}

export default Dashboard;
