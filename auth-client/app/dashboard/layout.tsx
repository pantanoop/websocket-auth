"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/hooks";
import { Snackbar, Alert } from "@mui/material";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { currentUser, error } = useAppSelector((state) => state.authenticator);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (error === "Session expired") {
      setOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/pages/auth/login");
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
      >
        <Alert severity="warning" variant="filled">
          Session expired. Please login again.
        </Alert>
      </Snackbar>
    </>
  );
}
