"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/hooks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { currentUser, error } = useAppSelector((state) => state.authenticator);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/pages/auth/login");
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return <>{children}</>;
}
