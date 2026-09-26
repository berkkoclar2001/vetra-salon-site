"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Kullanıcı bilgilerini tutacak tip (Şimdilik basit tutuyoruz)
interface User {
  id: number;
  username: string;
  role: "admin" | "staff";
}

// Context içinde neler olacak?
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

// Context'i oluşturduk (Başlangıç değeri undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider bileşeni: Tüm uygulamayı saracak ve oturum bilgisini dağıtacak
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Uygulama ilk açıldığında çalışır:
  // Eğer çerezlerde (cookie) bir token varsa, kullanıcıyı giriş yapmış sayarız.
  useEffect(() => {
    const token = Cookies.get("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Kullanıcı verisi okunamadı", error);
        Cookies.remove("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false); // Yüklenme bitti
  }, []);

  // Giriş Fonksiyonu
  const login = (token: string, userData: User) => {
    Cookies.set("token", token, { expires: 1 }); // 1 gün geçerli
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    router.push("/dashboard"); // Başarılı girişten sonra yönlendirme
  };

  // Çıkış Fonksiyonu
  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login"); // Çıkış yapınca giriş ekranına at
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook: Diğer bileşenlerde kolayca kullanmak için
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
