"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/hooks";
import { validateSession } from "../redux/auth/services/authService";
import { useRouter } from "next/navigation";
import { logout } from "../redux/auth/authenticateSlice";
import { socket } from "../libraries/socket.library";

function Dashboard() {
  const [otp, setotp] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(validateSession);
    socket.on("otp", (data) => {
      setotp(data);
    });
    socket.on("logout", () => {
      dispatch(logout());
      socket.disconnect();
      router.replace("/pages/auth/login");
    });
  }, [dispatch]);
  return (
    <div>
      welcome t stackoverflow
      {otp && <div>your otp :{otp}</div>}
    </div>
  );
}

export default Dashboard;
