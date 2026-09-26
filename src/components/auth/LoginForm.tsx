"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";

// Form Şeması (Validasyon Kuralları)
const formSchema = z.object({
    username: z.string().min(1, "Kullanıcı adı boş bırakılamaz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginForm() {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError(null);

        try {
            // Servis üzerinden giriş yapmayı dene
            const response = await loginUser(data);

            // Başarılıysa AuthContext'e bildir (Context otomatik yönlendirecek)
            login(response.token, response.user);

        } catch (err: unknown) {
            // Hata varsa kullanıcıya göster
            const errorMessage = err instanceof Error ? err.message : "Giriş yapılamadı, lütfen bilgilerinizi kontrol edin.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-2">
                <CardTitle className="text-xl font-semibold text-slate-800">Giriş Yap</CardTitle>
                <CardDescription className="text-slate-500">
                    Hesabınıza erişmek için bilgilerinizi girin
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Hata Mesajı Alanı */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2 text-sm font-medium">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="username">Kullanıcı Adı</Label>
                        <Input
                            id="username"
                            placeholder="örnek: admin"
                            {...register("username")}
                            disabled={loading}
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs">{errors.username.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••"
                            {...register("password")}
                            disabled={loading}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs">{errors.password.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Giriş Yapılıyor...
                            </>
                        ) : (
                            "Giriş Yap"
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground justify-center">
                <p>Hesabınız yok mu? Yönetici ile iletişime geçin.</p>
            </CardFooter>
        </Card>
    );
}
