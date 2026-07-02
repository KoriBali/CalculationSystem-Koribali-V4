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
  CheckCircle,
  Layers,
  FileText,
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
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-playing carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: "Precision Engineering",
      desc: "Bantu perhitungan struktur dengan presisi tinggi berdasarkan standar terbaru.",
      icon: <CheckCircle className="w-5 h-5" />,
      image: "/images/pole-slide-1.png"
    },
    {
      title: "All-in-One Workflow",
      desc: "Bingung dengan tugas desain dan perhitungan terpisah? Di sini bisa sekaligus jalan.",
      icon: <Layers className="w-5 h-5" />,
      image: "/images/pole-slide-2.png"
    },
    {
      title: "Instant Validation",
      desc: "Dapatkan langsung hasil laporan perhitungan (OK/NG) untuk memastikan keamanan.",
      icon: <FileText className="w-5 h-5" />,
      image: "/images/pole-slide-3.png"
    }
  ];

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
      className="relative min-h-screen bg-[#0d3b66] flex flex-col md:flex-row font-sans antialiased overflow-hidden"
    >
      {/* Interactive Gradient Spotlight (Cyan/Light Blue) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(
                600px circle at ${x}px ${y}px,
                rgba(51, 153, 204, 0.2),
                transparent 70%
              )`,
          ),
        }}
      />

      {/* LEFT PANEL (Dark Blue) */}
      <div className="relative z-10 w-full md:w-[45%] lg:w-[40%] flex flex-col justify-between p-8 md:p-12 lg:p-20 text-white min-h-[35vh] md:min-h-screen">
        {/* Top text */}
        <div className="hidden md:block">
          <p className="text-white/60 text-xs font-medium tracking-wide uppercase">
            Engineering-grade calculations
          </p>
        </div>

        {/* Center / Hero text & Carousel */}
        <div className="mt-auto md:mt-0 md:mb-12 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-[54px] font-semibold leading-[1.1] tracking-tight mb-8">
            Pole Structure<br />
            Calculation<br />
            System
          </h2>

          {/* Animated Features Carousel */}
          <div className="hidden md:flex flex-1 relative w-full max-w-[400px] mt-10 mb-8 mx-auto md:mx-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col h-full"
              >
                {/* AI Generated Marketing Image - Full Portrait */}
                <div className="flex-1 w-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl mb-6 bg-[#0a2e50] relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d3b66] via-transparent to-transparent z-10 opacity-60" />
                  <img 
                    src={features[activeSlide].image} 
                    alt={features[activeSlide].title} 
                    className="w-full h-full object-cover transition-transform duration-[4000ms] ease-out hover:scale-105" 
                  />
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  <div className="flex items-center gap-3 text-[#3399cc]">
                    {features[activeSlide].icon}
                    <h3 className="font-bold text-lg md:text-xl text-white">{features[activeSlide].title}</h3>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed max-w-[90%]">
                    {features[activeSlide].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Dots */}
            <div className="absolute -bottom-2 left-0 flex gap-2">
              {features.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${activeSlide === idx ? "w-6 bg-[#3399cc]" : "w-1.5 bg-white/20"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="hidden md:flex items-center gap-3 text-[11px] font-bold text-[#3399cc] uppercase tracking-wider mt-auto">
          <ShieldCheck size={18} />
          Authorized Personnel Only
        </div>
      </div>

      {/* RIGHT PANEL (White) */}
      <div className="relative z-20 flex-1 bg-white rounded-t-[40px] md:rounded-t-none md:rounded-l-[40px] lg:rounded-l-[50px] shadow-[-20px_0_50px_rgba(0,0,0,0.15)] flex flex-col px-6 py-10 sm:p-12 lg:px-24 lg:py-16 overflow-y-auto">
        
        {/* Top Header: Logo */}
        <div className="flex items-center justify-between mb-16 md:mb-24">
          <div className="flex items-center gap-3">
            <img
              src="/images/koribali-logo.webp"
              alt="koribali icon"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <span className="text-[20px] md:text-[22px] font-bold text-slate-800 tracking-tight">
              KORI BALI
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium hover:text-slate-800 cursor-pointer transition-colors">
            <Mail size={16} />
            <span className="hidden sm:block">Contact Admin</span>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="w-full max-w-[420px] mx-auto flex-1 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-medium text-slate-800 tracking-tight mb-10 md:mb-12">
            Sign In
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {/* Error Alert */}
            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-4"
                >
                  <div className="bg-red-50 border border-red-100 px-4 py-3 flex items-center justify-between text-red-700 text-[12px] font-semibold rounded-2xl">
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
            <div className="flex flex-col gap-1">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Email or Username"
                  {...formik.getFieldProps("email")}
                  className={`w-full bg-transparent border text-sm py-4 px-6 outline-none rounded-full transition-all ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-300 ring-4 ring-red-50"
                      : "border-slate-200 hover:border-slate-300 focus:border-[#3399cc] focus:ring-4 focus:ring-[#3399cc]/10"
                  }`}
                />
              </div>

              <div className="h-5 ml-4 mt-1">
                {formik.touched.email && formik.errors.email && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-red-500 flex items-center gap-1.5"
                  >
                    <AlertCircle size={12} />
                    {formik.errors.email}
                  </motion.p>
                )}
              </div>
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1">
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...formik.getFieldProps("password")}
                  className={`w-full bg-transparent border text-sm py-4 pl-6 pr-14 outline-none rounded-full transition-all ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-300 ring-4 ring-red-50"
                      : "border-slate-200 hover:border-slate-300 focus:border-[#3399cc] focus:ring-4 focus:ring-[#3399cc]/10"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>

              <div className="flex justify-between items-start mt-2">
                <div className="h-5 ml-4">
                  {formik.touched.password && formik.errors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px] text-red-500 flex items-center gap-1.5"
                    >
                      <AlertCircle size={12} />
                      {formik.errors.password}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2 flex flex-col gap-3">
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-gradient-to-r from-[#0d3b66] to-[#3399cc] text-white font-medium py-4 px-6 rounded-full shadow-lg shadow-[#3399cc]/20 hover:shadow-[#3399cc]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm md:text-base mt-2"
              >
                {formik.isSubmitting ? "Signing in..." : "Sign In"}
                {!formik.isSubmitting && <ChevronRight size={18} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthSession({ 
                    token: 'guest-session-token', 
                    user: { name: 'Guest User', email: 'guest@koribali.com' } 
                  });
                  navigate('/calculation');
                }}
                className="w-full bg-white border-2 border-slate-200 text-slate-600 hover:text-slate-800 font-medium py-3.5 px-6 rounded-full hover:border-slate-300 hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm md:text-base"
              >
                Login as Guest
              </button>
            </div>
          </form>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="mt-16 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} Kori Bali Inc.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span className="cursor-pointer hover:text-slate-600">Privacy Policy</span>
            <span className="cursor-pointer hover:text-slate-600">Terms of Use</span>
          </div>
        </div>
      </div>
    </div>
  );
}
