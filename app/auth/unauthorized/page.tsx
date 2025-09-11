"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Shield, ArrowRight, Home } from "lucide-react";

export default function UnauthorizedPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") || "/chatapp";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-red-100">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Authentication Required
          </CardTitle>
          <CardDescription className="text-gray-600">
            You need to be logged in to access this page
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              The page you&apos;re trying to access requires authentication.
              Please sign in to continue to your requested page.
            </p>

            {redirectTo && redirectTo !== "/chatapp" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Requested page:</strong> {redirectTo}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Link
              href={`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`}
            >
              <Button className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-md transition-all duration-200">
                <ArrowRight className="h-4 w-4 mr-2" />
                Sign In to Continue
              </Button>
            </Link>

            <Link href="/auth/signup">
              <Button
                variant="outline"
                className="w-full py-2 px-4 border-2 hover:bg-gray-50 transition-all duration-200"
              >
                Create New Account
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant="ghost"
                className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
