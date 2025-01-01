"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="flex  items-center justify-center min-h-screen w-full bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full text-center">
        <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your transaction has been successfully completed.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-sm font-medium text-gray-700 uppercase">Payment Details</h2>
          <ul className="text-gray-600 text-sm mt-2 space-y-1">
            <li><strong>Order ID:</strong> #123456789</li>
            <li><strong>Amount:</strong> ₹999.00</li>
            <li><strong>Date:</strong> Dec 27, 2024</li>
          </ul>
        </div>
        <Link href="/dashboard">
          <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
