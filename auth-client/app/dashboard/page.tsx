"use client";

import { useEffect } from "react";
import { useAppDispatch } from "../hooks/hooks";
import { validateSession } from "../redux/auth/services/authService";

function Dashboard() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(validateSession);
  }, [dispatch]);
  return <div>welcome t stackoverflow</div>;
}

export default Dashboard;
