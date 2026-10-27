"use client";

import { useEffect, useState } from "react";
import PlaylistSidebar from "@/components/users/sidebar";
import { useAuthStore } from "@/stores/authStore";
import { userPlaylistStore } from "@/stores/playlistStore";
import PlaylistContent from "@/components/users/playlists/PlayListContent";
export default function ProfilePage() {
  const { authUser, isAuthenticated } = useAuthStore();
  const [userEmail, setUserEmail] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const { userPlaylists, fetchPlaylists, isLoadingPlaylist } =
    userPlaylistStore();

  useEffect(() => {
    if (!isAuthenticated || !authUser) return;

    setUserEmail(authUser.email);
    setUserFullName(authUser.fullName);

    fetchPlaylists();
  }, [authUser]);

  return (
    <main className="min-h-screen bg-background px-4 pb-8 pt-24 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:gap-8">
        <PlaylistSidebar userName={userFullName} userEmail={userEmail} />{" "}
        <PlaylistContent
          userPlaylists={userPlaylists}
          fetchPlaylists={fetchPlaylists}
          isLoadingPlaylist={isLoadingPlaylist}
        />
      </div>
    </main>
  );
}
