"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/services/supabase/client";
import { InsetCard } from "@/components/ui/inset-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, BookOpen, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AxiomMark } from "@/components/brand/AxiomLogo";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [track, setTrack] = useState("STEM");
  const [enrollmentCode, setEnrollmentCode] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Welcome back to AxiomProof!");
      
      // Check user role from metadata or default to route
      const userRole = data.user?.user_metadata?.role;
      if (userRole === "teacher") {
        router.push("/teacher");
      } else {
        router.push("/workspace");
      }
      router.refresh();
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message || "Sign in failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            school_name: schoolName,
            academic_track: track,
            enrollment_code: enrollmentCode || undefined,
          },
        },
      });

      if (error) throw error;

      toast.success(
        data.session
          ? "Account created and logged in!"
          : "Account created! Please check your email to confirm registration."
      );

      if (data.session) {
        if (role === "teacher") {
          router.push("/teacher");
        } else {
          router.push("/workspace");
        }
        router.refresh();
      } else {
        setMode("signin");
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error?.message || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 selection:bg-primary/20 selection:text-primary">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-40">
        <div className="w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]" />
      </div>

      {/* Top back navigation */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Website
        </Link>
        <span className="text-[11px] font-semibold text-muted-foreground tracking-wider uppercase">
          Portal Gateway
        </span>
      </div>

      {/* Main Card */}
      <InsetCard className="w-full max-w-md p-6 md:p-8 z-10 border border-border shadow-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="size-12 rounded-full bg-primary/15 text-primary grid place-items-center mx-auto mb-3">
            <AxiomMark size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
            {mode === "signin" ? "Sign In to AxiomProof" : "Create Research Account"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5">
            {mode === "signin"
              ? "Access your formative research audits, literature coach & Viva-Voce defense"
              : "Deterministic academic research verification & defense rehearsal engine"}
          </p>
        </div>

        {/* Mode Toggle Pills */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full mb-6">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`py-2 text-xs font-bold rounded-full transition-all duration-300 cursor-pointer ${
              mode === "signin"
                ? "bg-[#0d1217] dark:bg-white text-white dark:text-[#0d1217] shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`py-2 text-xs font-bold rounded-full transition-all duration-300 cursor-pointer ${
              mode === "signup"
                ? "bg-[#0d1217] dark:bg-white text-white dark:text-[#0d1217] shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
          {mode === "signup" && (
            <>
              {/* Role Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      role === "student"
                        ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary shadow-xs"
                        : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-card/40 text-muted-foreground hover:border-black/30 dark:hover:border-white/30"
                    }`}
                  >
                    <BookOpen className="size-4 text-primary shrink-0" />
                    <div>
                      <div className="text-xs font-bold leading-tight">Student</div>
                      <div className="text-[10px] text-muted-foreground">Researcher</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("teacher")}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      role === "teacher"
                        ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary shadow-xs"
                        : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-card/40 text-muted-foreground hover:border-black/30 dark:hover:border-white/30"
                    }`}
                  >
                    <ShieldCheck className="size-4 text-primary shrink-0" />
                    <div>
                      <div className="text-xs font-bold leading-tight">Adviser</div>
                      <div className="text-[10px] text-muted-foreground">SHS Teacher</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Juan Dela Cruz"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-black/10 dark:border-white/10 bg-background/90 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>

              {/* School / Institution Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  School / University / Institution Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Philippine Science High School, UST, Ateneo, Canubing NHS"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-black/10 dark:border-white/10 bg-background/90 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>

              {role === "student" && (
                <div className="grid grid-cols-2 gap-3">
                  {/* Academic Track */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Track / Strand
                    </label>
                    <select
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-full border border-black/10 dark:border-white/10 bg-background/90 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    >
                      <option value="STEM">STEM</option>
                      <option value="HUMSS">HUMSS</option>
                      <option value="GAS">GAS</option>
                      <option value="TVL_ICT">TVL (ICT)</option>
                      <option value="TVL_IA">TVL (IA)</option>
                    </select>
                  </div>

                  {/* Enrollment Code */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Section Code (Opt)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. STEM2026"
                      value={enrollmentCode}
                      onChange={(e) => setEnrollmentCode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full border border-black/10 dark:border-white/10 bg-background/90 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 uppercase transition-all"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. researcher@school.edu.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full border border-black/10 dark:border-white/10 bg-background/90 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full border border-black/10 dark:border-white/10 bg-background/90 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-full text-xs font-bold uppercase tracking-wider bg-primary text-white hover:bg-primary/90 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Processing...
              </span>
            ) : mode === "signin" ? (
              "Sign In"
            ) : (
              `Register as ${role === "teacher" ? "Adviser" : "Student"}`
            )}
          </Button>
        </form>

        {/* Security & Access Notice */}
        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-[11px] text-muted-foreground">
            Protected by institutional authentication. Only authorized researchers and faculty advisors may access research defense sessions.
          </p>
        </div>
      </InsetCard>
    </div>
  );
}
