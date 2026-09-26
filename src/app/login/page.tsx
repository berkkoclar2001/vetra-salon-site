"use client";

import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex-col items-center justify-center p-4">

            <div className="mb-8 flex flex-col items-center gap-3">
                <Link href="/">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl shadow-md border border-white/50 bg-white">
                        <Image
                            src="/logo.jpg"
                            alt="Vetra App Software Logo"
                            fill
                            className="object-contain p-2"
                        />
                    </div>
                </Link>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Vetra App Software Paneli</h1>
            </div>

            <div className="w-full max-w-sm md:max-w-md">
                <LoginForm />
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} Vetra App Software Yazılım Sistemleri
            </p>
        </div>
    );
}
