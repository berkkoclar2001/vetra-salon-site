// src/lib/api.ts
import axios from 'axios';

// Backend adresini buraya yazacağız.
// Şimdilik yerel makine (localhost) varsayıyoruz.
// Arkadaşın sana gerçek adresi verince burayı değiştireceksin.
const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İlerde buraya "Interceptor" ekleyip Token işlemlerini yapacağız.
import Cookies from "js-cookie";

// 1. İstek (Request) Interceptor: Her isteğe Token ekle
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // Token'ı çerezden al
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Header'a ekle
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Yanıt (Response) Interceptor: Token geçersizse çıkış yap
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Eğer sunucudan "401 Yetkisiz" hatası gelirse
    if (error.response && error.response.status === 401) {
      console.error("Oturum süresi doldu, çıkış yapılıyor...");
      Cookies.remove("token");
      window.location.href = "/login"; // Giriş sayfasına yönlendir
    }
    return Promise.reject(error);
  }
);

export default api;