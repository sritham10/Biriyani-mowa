"use client";
import React, { useEffect, useState } from "react";

type UserType = {
  city: string;
  country: string;
  email: string;
  isAdmin: boolean;
  name: string;
  phone: string;
  postal: string;
  streetAddress: string;
  _id: string;
};

export default function useProfileCheck() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserType | null>(null);

  const userInfo = async () => {
    setLoading(false);
    const res = await fetch("/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setIsAdmin(data.isAdmin);
    setLoading(true);
    setUserData(data);
  };

  useEffect(() => {
    userInfo();
  }, []);

  return { loading, isAdmin, userData };
}
