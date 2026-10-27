import { UpgradeVipMessage } from "@/constants/messages/user.message";
import { IUser } from "@/types/user.type";
import { StarIcon } from "lucide-react";

export default function UserStatusInfor({ userInfor }: { userInfor: IUser }) {
  return (
    <>
      <section className="px-4 mt-4">
        <div className="max-w-xl mx-auto flex items-center gap-4 bg-white/5 backdrop-blur-lg p-4 rounded-2xl border border-border/70 shadow-lg">
          <img
            src={"/images/vn_flag.svg"}
            alt="avatar"
            className="w-14 h-14 rounded-full object-cover border border-primary/40"
          />

          <div className="flex-1 ">
            <h3 className="text-foreground font-semibold text-lg flex items-center gap-2">
              {userInfor.fullName}
              <span className="text-primary text-sm flex gap-1 justify-between items-center ">
                <StarIcon /> {userInfor.isVip ? "VIP" : "Free"}
              </span>
            </h3>
            <p className="text-muted-foreground text-xs">
              {userInfor.isVip
                ? UpgradeVipMessage.vipMember
                : UpgradeVipMessage.basicMember}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
