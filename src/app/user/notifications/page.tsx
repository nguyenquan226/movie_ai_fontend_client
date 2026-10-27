"use client"

import { useEffect, useState } from "react"
import PlaylistSidebar from "@/components/users/sidebar"
import Notifications from "@/components/custom/Notification"

export default function ProfilePage() {
    const [userData, setUserData] = useState({ fullName: "User", email: "user@example.com" })

    useEffect(() => {
        const authUser = localStorage.getItem("auth-storage")
        if (authUser) {
            const user = JSON.parse(authUser)
            console.log(user.state.authUser)

            setUserData({
                fullName: user.state.authUser.fullName || "User",
                email: user.state.authUser.email || "user@example.com",
            })
        }
    }, [])

    return (
        <main className="min-h-screen bg-background px-4 pb-8 pt-24 sm:px-6">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row lg:gap-8">
                <PlaylistSidebar userName={userData.fullName} userEmail={userData.email} />
                <section className="min-w-0 flex-1 rounded-2xl border border-border bg-card p-5 text-card-foreground sm:p-8">
                    <h1 className="mb-6 text-2xl font-semibold text-foreground">Thông báo</h1>
                    <Notifications />
                </section>
            </div>
        </main>
    )
}
