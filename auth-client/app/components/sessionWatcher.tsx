"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { checkSession } from "../redux/auth/authenticateSlice";

export default function SessionWatcher() {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(
    (state) => state.authenticator.currentUser,
  );

  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      dispatch(checkSession());
    }, 10000);

    return () => clearInterval(interval);
  }, [currentUser, dispatch]);

  return null;
}
