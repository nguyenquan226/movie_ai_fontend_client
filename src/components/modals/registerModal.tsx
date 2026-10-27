"use client";

import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import modalVariants from "@/constants/modalVariants";
import Atropos from "atropos/react";
import "atropos/css";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { RegisterInput } from "@/types/authen.type";
import { Eye, EyeOff, Loader } from "lucide-react";
import { authService } from "@/services";
import { AuthenticationsMessage } from "@/constants/messages/user.message";
import { useAuthStore } from "@/stores/authStore";
import { useAuthModalStore } from "@/stores/authModalStore";
import { loadingTime } from "@/constants/modalLoadingTime";

export default function LoginModal() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    isAuthenticated,
    setAuthenticated,
    loginAction,
    setIsSigningUp,
    isSigningUp,
  } = useAuthStore();
  const { isRegisterModalOpen, closeRegisterModal, switchToLogin } =
    useAuthModalStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    watch,
    reset,
  } = useForm<RegisterInput & { confirmPassword: string }>({
    mode: "onSubmit",
  });

  const passwordValue = watch("password");

  const handleRegister = async (userRegisterInput: RegisterInput) => {
    setIsSigningUp(true);
    try {
      const registerResponse = await authService.callRegister(
        userRegisterInput
      );

      if (registerResponse && registerResponse.EC === 1) {
        setTimeout(() => {
          handleCloseRegisterModal();
          setIsSigningUp(false);
          toast.success(AuthenticationsMessage.registerSuccess);
        }, loadingTime.register);
      }
      if (registerResponse && registerResponse.EC === 0) {
        toast.error(AuthenticationsMessage.registerExistEmail);
        console.log("check res exist email", registerResponse);
        setIsSigningUp(false);
      }
    } catch (error) {
      console.log("error sign up", error);
      setIsSigningUp(false);
      toast.error(AuthenticationsMessage.errorRegister);
    }
  };

  const handleCloseRegisterModal = () => {
    reset();
    closeRegisterModal();
    setShowPassword(false);
  };

  useEffect(() => {
    if (!isRegisterModalOpen) {
      reset();
      clearErrors();
    }
  }, [isRegisterModalOpen, clearErrors, reset]);

  return (
    <AnimatePresence>
      {isRegisterModalOpen && (
        // Overlay
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => {
            handleCloseRegisterModal();
          }}
        >
          {/* Modal Box */}
          <motion.div
            key="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[600px] bg-secondary/95 backdrop-blur-md
                       rounded-2xl shadow-2xl overflow-hidden flex"
          >
            {/* Close Button */}
            <button
              onClick={() => {
                handleCloseRegisterModal();
              }}
              className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/*Left Side: Atropos 3D Card */}
            <div className="hidden md:flex w-1/2 bg-[#151a25] items-center justify-center relative">
              <Atropos
                className="my-atropos w-[85%] h-[85%] rounded-2xl shadow-2xl bg-white overflow-hidden"
                activeOffset={40}
                shadowScale={1.05}
                highlight={true}
                rotateTouch="scroll-y"
                shadow={true}
                style={{ backgroundColor: "#0f1419" }}
              >
                <div className="relative w-full h-full">
                  <img
                    data-atropos-offset="-5"
                    src="/images/login_poster.webp"
                    alt="Cinematic scene"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    data-atropos-offset="10"
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 text-foreground"
                  ></div>
                  <div
                    data-atropos-offset="15"
                    className="absolute top-6 right-6 px-3 py-1 text-xs font-semibold drop-shadow-[0_0_8px_rgba(255,100,0,0.6)]
                      text-foreground rounded-full shadow-[0_0_10px_rgba(255,0,128,0.6)]
                      bg-gradient-to-r from-pink-600 via-fuchsia-500 to-purple-500"
                  >
                    HOT
                  </div>
                </div>
              </Atropos>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-foreground text-3xl font-bold mb-2">Đăng ký</h2>
              <p className="text-muted-foreground mb-6">
                Nếu bạn đã có tài khoản,{" "}
                <span
                  onClick={() => {
                    switchToLogin();
                  }}
                  className="text-primary cursor-pointer hover:underline"
                >
                  đăng nhập ngay
                </span>
              </p>

              <form
                className="space-y-4"
                onSubmit={handleSubmit((data) => {
                  const { confirmPassword, ...inputUser } = data;
                  console.log("input regiester:", inputUser);
                  handleRegister(inputUser);
                })}
              >
                <Input
                  {...register("fullName", {
                    required: "Tên người dùng là bắt buộc",
                    pattern: {
                      value: /^(?!\d+$)[A-Za-zÀ-ỹ0-9\s]+$/u,
                      message:
                        "Tên không được chứa ký tự đặc biệt và không được chỉ toàn số",
                    },
                    minLength: {
                      value: 3,
                      message: "Tên phải có ít nhất 3 ký tự",
                    },
                  })}
                  type="text"
                  placeholder="Tên người dùng"
                  className="w-full bg-[#252d3d] border-border text-foreground placeholder:text-muted-foreground/70 h-12 mb-0
                             focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary input-selection-yellow caret-color"
                />
                <div className="min-h-[16px] my-[16px]">
                  {errors.fullName && (
                    <p className="text-red-400 text-xs animate-in fade-in slide-in-from-top-1 duration-200 ">
                      {errors.fullName?.message || " "}
                    </p>
                  )}
                </div>
                <Input
                  {...register("email", {
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email không hợp lệ",
                    },
                  })}
                  type="text"
                  placeholder="Email"
                  className="w-full bg-[#252d3d] border-border text-foreground placeholder:text-muted-foreground/70 h-12 mb-0
                             focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary input-selection-yellow caret-color"
                />
                <div className="min-h-[16px] my-[16px]">
                  {errors.email && (
                    <p className="text-red-400 text-xs animate-in fade-in slide-in-from-top-1 duration-200 ">
                      {errors.email?.message || " "}
                    </p>
                  )}
                </div>
                <div className="relative w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    autoComplete="off"
                    className="w-full bg-[#252d3d] text-foreground border-border h-12
               focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary
              input-selection-yellow pr-10"
                    {...register("password", {
                      required: "Mật khẩu là bắt buộc",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </div>
                </div>
                <div className="min-h-[16px] my-[16px]">
                  {errors.password && (
                    <p className="text-red-400 text-xs  animate-in fade-in slide-in-from-top-1 duration-200  ">
                      {errors.password?.message || " "}
                    </p>
                  )}
                </div>
                <div className="relative w-full">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu"
                    autoComplete="off"
                    className="w-full bg-[#252d3d] text-foreground border-border h-12
               focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary
              input-selection-yellow pr-10"
                    {...register("confirmPassword", {
                      required: "Vui lòng xác nhận mật khẩuu",
                      validate: (value: string) => {
                        return (
                          value === passwordValue ||
                          "Mật khẩu xác nhận không khớp, vui lòng nhập lại"
                        );
                      },
                    })}
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </div>
                </div>
                <div className="min-h-[16px] my-[16px]">
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs  animate-in fade-in slide-in-from-top-1 duration-200  ">
                      {errors.confirmPassword?.message || " "}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  // disabled={isSigningUp}
                  className={`w-full py-3 rounded-lg font-bold text-[#0f1419] transition-[color,background-color,border-color,opacity,transform,box-shadow]
                    bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600
                    flex items-center justify-center gap-2
                    ${isSigningUp ? "cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  {isSigningUp ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Đang tạo tài khoản...
                    </>
                  ) : (
                    "Đăng ký"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
