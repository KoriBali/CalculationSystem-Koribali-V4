import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";
import { setAuthSession, isAuthenticated } from "../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/calculation");
    }
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Interactive Background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string().required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoginError("");

        const authData = await loginUser(values);

        setAuthSession(authData);

        navigate("/calculation");
      } catch (error) {
        setLoginError(
          error.message || "Access denied. Please check your credentials.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans antialiased overflow-hidden"
    >
      {/* Interactive Gradient */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(
                500px circle at ${x}px ${y}px,
                rgba(13, 59, 102, 0.12),
                transparent 70%
              )`,
          ),
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[950px] flex flex-col md:flex-row bg-white shadow-[0_20px_50px_rgba(13,59,102,0.1)] rounded-2xl overflow-hidden border border-slate-100"
      >
        {/* LEFT PANEL */}
        <div className="hidden md:flex md:w-[400px] bg-[#0d3b66] p-12 flex-col justify-between text-white relative">
          <div>
            <div className="flex items-center gap-4 mb-16">
              <div className="bg-white p-2 rounded-xl shadow-lg">
                <img
                  src="/images/koribali-logo.webp"
                  alt="koribali icon"
                  className="w-8 h-8 object-contain"
                />
              </div>

              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-none">
                  KORI BALI
                </span>

                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                  Structural Calculation System
                </span>
              </div>
            </div>

            <h2 className="text-3xl font-bold leading-tight tracking-tight">
              Pole Structure <br />
              Calculation{" "}
              <span className="font-light text-white/60">System</span>
            </h2>

            <p className="mt-6 text-sm text-white/50 leading-relaxed font-medium">
              Engineering-grade calculations for structural safety, load
              capacity, and infrastructure reliability.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-bold text-white/50 uppercase tracking-wider bg-white/5 py-3 px-4 rounded-xl border border-white/10 backdrop-blur-sm">
            <ShieldCheck size={16} className="text-white/80" />
            Authorized Personnel Only
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-5 sm:p-10 lg:p-16 bg-white flex flex-col justify-center">
          {/* Mobile Logo */}
          <div className="flex md:hidden items-center gap-3 mb-8">
            <div className="bg-slate-50 p-1 rounded-lg border border-slate-100 shadow-sm">
              <img
                src="/images/koribali-logo.webp"
                alt="koribali icon"
                className="w-8 h-8 object-contain"
              />
            </div>

            <span className="text-[15px] font-black text-[#0d3b66] uppercase tracking-tighter">
              KORI BALI
            </span>
          </div>

          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
              Login Access
            </h1>

            <div className="flex items-center gap-1 md:gap-2 mt-3">
              <div className="h-1.5 flex-1 bg-slate-200 rounded-l-xl" />
              <div className="h-1.5 w-16 bg-[#0d3b66] rounded-r-xl" />
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Error Alert */}
            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-red-50 border border-red-100 px-4 py-3 flex items-center justify-between text-red-700 text-[12px] font-semibold rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={15} />
                      <span>{loginError}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setLoginError("")}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* EMAIL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                Email Address
              </label>

              <div className="relative group">
                <Mail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 size-4 ${
                    formik.touched.email && formik.errors.email
                      ? "text-red-400"
                      : "text-slate-400 group-focus-within:text-[#0d3b66]"
                  }`}
                />

                <input
                  type="email"
                  placeholder="name@gmail.com"
                  {...formik.getFieldProps("email")}
                  className={`w-full bg-slate-50 border-2 text-sm py-3.5 pl-11 pr-4 outline-none rounded-lg transition-all ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-200 bg-red-50/30"
                      : "border-slate-200 focus:border-[#0d3b66] focus:bg-white"
                  }`}
                />
              </div>

              <div className="h-5 ml-1">
                {formik.touched.email && formik.errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-red-600 font-bold flex items-center gap-1.5"
                  >
                    <AlertCircle size={12} />
                    {formik.errors.email}
                  </motion.p>
                )}
              </div>
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">
                Password
              </label>

              <div className="relative group">
                <Lock
                  className={`absolute left-4 top-1/2 -translate-y-1/2 size-4 ${
                    formik.touched.password && formik.errors.password
                      ? "text-red-400"
                      : "text-slate-400 group-focus-within:text-[#0d3b66]"
                  }`}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...formik.getFieldProps("password")}
                  className={`w-full bg-slate-50 border-2 text-sm py-3.5 pl-11 pr-12 outline-none rounded-lg transition-all ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-200 bg-red-50/30"
                      : "border-slate-200 focus:border-[#0d3b66] focus:bg-white"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#0d3b66]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="h-5 ml-1">
                {formik.touched.password && formik.errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-red-600 font-bold flex items-center gap-1.5"
                  >
                    <AlertCircle size={12} />
                    {formik.errors.password}
                  </motion.p>
                )}
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-[#0d3b66] text-white font-black py-4 px-6 rounded-lg shadow-xl shadow-[#0d3b66]/20 hover:bg-[#0a2e50] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs mt-4"
            >
              {formik.isSubmitting ? "Processing..." : "Authorize Access"}

              <ChevronRight size={18} />
            </button>
          </form>

          {/* FOOTER */}
          <footer className="mt-8 md:mt-12 border-t border-slate-100 pt-4 md:pt-8">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
              Precision Engineering • KORI BALI
            </p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
