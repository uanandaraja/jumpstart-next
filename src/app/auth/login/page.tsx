"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function ContinueGoogle() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const newWindow = window.open(
      "/api/auth/google",
      "_blank",
      "noopener,noreferrer",
    );
    if (newWindow) newWindow.opener = null;

    // Reset loading state after a short delay
    setTimeout(() => setIsLoading(false), 5000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader className="space-y-4">
          <CardTitle className="text-xl font-semibold text-center">
            Selamat datang di Rangkuman!
          </CardTitle>
          <CardDescription className="text-center">
            Gunakan akun Google kamu untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="group flex h-10 items-center justify-center rounded-3xl border border-gray-200 bg-gradient-to-b from-gray-50 via-gray-50 to-gray-200 px-4 text-gray-950 hover:bg-gradient-to-b hover:from-gray-100 hover:via-gray-100 hover:to-gray-100 active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center group-active:[transform:translate3d(0,1px,0)]">
              {isLoading ? (
                <ImSpinner2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : (
                <FaGoogle className="mr-2 h-3.5 w-3.5" />
              )}
              {isLoading ? "Membuka..." : "Masuk dengan Google"}
            </span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
