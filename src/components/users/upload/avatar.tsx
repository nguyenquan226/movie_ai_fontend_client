import { UploadAvt } from "./upload";

interface AvatarUserProps {
  imageUrl: string;
  setAvtUrl: (url: string) => void;
  isUpdatingAvt: boolean;
  setIsUpdatingAvt: (value: boolean) => void;
}

export const AvatarUser = ({
  imageUrl,
  setAvtUrl,
  isUpdatingAvt,
  setIsUpdatingAvt,
}: AvatarUserProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-40 h-40 rounded-full flex items-center justify-center shadow-xl"
        style={{
          borderColor: "#FFD875",
          boxShadow: "0 12px 24px rgba(255, 216, 117, 0.3)",
        }}
      >
        {isUpdatingAvt ? (
          <div className="w-40 h-40 rounded-full bg-accent/60 animate-pulse shadow-[0_0_20px_rgba(255,215,0,0.2)]" />
        ) : (
          <img
            src={imageUrl}
            alt="User Avatar"
            className="w-40 h-40 rounded-full cursor-pointer transition object-cover object-center"
          />
        )}
      </div>

      <UploadAvt setAvtUrl={setAvtUrl} setIsUpdatingAvt={setIsUpdatingAvt} />
    </div>
  );
};
