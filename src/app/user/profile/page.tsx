"use client";

import { useEffect, useState } from "react";
import PlaylistSidebar from "@/components/users/sidebar";
import ProfileRight from "@/components/users/profile-right";
import { useAuthStore } from "@/stores/authStore";

export default function ProfilePage() {
  const { authUser, isAuthenticated } = useAuthStore();
  // const [userData, setUserData] = useState({
  //   fullName: "User",
  //   email: "user@example.com",
  // });
  const [userEmail, setUserEmail] = useState("");
  const [userFullName, setUserFullName] = useState("");
  useEffect(() => {
    if (!isAuthenticated || !authUser) return;

    setUserEmail(authUser.email);
    setUserFullName(authUser.fullName);
  }, [authUser]);

  return (
    <main className="min-h-screen bg-background px-4 pb-8 pt-24 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:gap-8">
        <PlaylistSidebar userName={userFullName} userEmail={userEmail} />
        <ProfileRight />
      </div>
    </main>
  );
}
