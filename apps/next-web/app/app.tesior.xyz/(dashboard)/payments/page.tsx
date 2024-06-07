"use client";

import React from "react";
import usePayments from "@/lib/swr/usePayments"

export default function CreateTaskPage() {
  const { payments, error, loading } = usePayments();

  if (error) return <div>Failed to load payments</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex">
      {
        payments?.map((payment) => (
          <div key={payment.id}>
            <h1>{payment.amount}</h1>
            <p>{payment.user_id}</p>
          </div>
        ))
      }

    </div>
  );
}
