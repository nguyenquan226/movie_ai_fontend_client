"use client";

import { useState, useEffect } from "react";
import { AvatarUser } from "./upload/avatar";
import { useAuthStore } from "@/stores/authStore";
import { userServices } from "@/services";
import { toast } from "sonner";
import { AuthenticationsMessage } from "@/constants/messages/user.message";

export default function ProfileRight() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingAvt, setIsUpdatingAvt] = useState(false);
  const [tempName, setTempName] = useState("");
  const [selectedGender, setSelectedGender] = useState("O");
  const [avtUrl, setAvtUrl] = useState("");

  const { authUser, isAuthenticated, setAuthUser } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && authUser) {
      setTempName(authUser.fullName || "");
      setAvtUrl(authUser.avatarUrl);
      setSelectedGender(authUser.genderCode || "O");
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const handleSave = async () => {
    if (tempName.trim() && authUser) {
      const updatedUser: any = {
        userId: authUser.userId,
        fullName: tempName.trim(),
        genderCode: selectedGender,
        avatarUrl: avtUrl,
      };
      try {
        console.log("Check user", updatedUser);
        const res = await userServices.CallUpdateProfile(updatedUser);
        console.log("check res", res);
        if (res && res.EC === 1) {
          setAuthUser(updatedUser);
          await new Promise((r) => setTimeout(r, 500));
          toast.success(AuthenticationsMessage.updateSucess);
        } else {
          await new Promise((r) => setTimeout(r, 500));
          toast.error(AuthenticationsMessage.updateError);
        }
      } catch (error) {
        console.log("error from profile Right Component: ", error);
        toast.error(AuthenticationsMessage.updateError);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-64 flex-1 p-5 sm:p-8" role="status" aria-live="polite">
        <div className="text-center text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-64 flex-1 p-5 sm:p-8">
        <div className="text-center text-muted-foreground">
          Không có dữ liệu người dùng
        </div>
      </div>
    );
  }

  console.log("check avt", avtUrl);

  return (
    <section className="min-w-0 flex-1 rounded-2xl border border-border bg-card p-5 text-card-foreground sm:p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold text-foreground sm:text-3xl">Tài khoản</h1>
          <p className="text-sm text-muted-foreground">Cập nhật thông tin tài khoản</p>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-8">
            <p className="mb-3 block text-sm text-muted-foreground">Email</p>
            <div className="rounded-lg border border-border bg-background px-4 py-3 text-foreground">
              {authUser.email}
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="profile-name" className="mb-3 block text-sm text-muted-foreground">
              Tên hiển thị
            </label>
            <input
              id="profile-name"
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <fieldset className="mb-8">
            <legend className="mb-4 text-sm text-muted-foreground">Giới tính</legend>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="M"
                  checked={selectedGender === "M"}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-4 h-4 disabled:opacity-50"
                />
                <label
                  htmlFor="male"
                  className="cursor-pointer text-sm text-foreground"
                >
                  Nam
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="F"
                  checked={selectedGender === "F"}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-4 h-4 disabled:opacity-50"
                />
                <label
                  htmlFor="female"
                  className="cursor-pointer text-sm text-foreground"
                >
                  Nữ
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="O"
                  checked={selectedGender === "O"}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-4 h-4 disabled:opacity-50"
                />
                <label
                  htmlFor="other"
                  className="cursor-pointer text-sm text-foreground"
                >
                  Khác
                </label>
              </div>
            </div>
          </fieldset>

          <button
            type="button"
            onClick={handleSave}
            className="min-h-11 rounded-lg bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:px-8"
          >
            Cập nhật
          </button>
        </div>

        <AvatarUser
          setAvtUrl={setAvtUrl}
          isUpdatingAvt={isUpdatingAvt}
          setIsUpdatingAvt={setIsUpdatingAvt}
          imageUrl={avtUrl || authUser.avatarUrl || "/images/vn_flag.svg"}
        />
      </div>
    </section>
  );
}
