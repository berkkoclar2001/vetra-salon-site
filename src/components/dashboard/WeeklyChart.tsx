"use client";

import { Session } from "@/types";
import { format, addDays, startOfDay } from "date-fns";
import { tr } from "date-fns/locale";

interface WeeklyChartProps {
    sessions: Session[];
}

export default function WeeklyChart({ sessions }: WeeklyChartProps) {
    const today = startOfDay(new Date());

    // Gelecek 7 günü oluştur
    const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

    // Günlük verileri hazırla
    const data = next7Days.map(day => {
        const dayStr = format(day, "yyyy-MM-dd");
        const count = sessions.filter(s => s.date === dayStr).length;
        return {
            day: day,
            label: format(day, "EEE", { locale: tr }), // Pzt, Sal
            fullDate: format(day, "d MMM", { locale: tr }), // 3 Şub
            count: count
        };
    });

    // En yüksek değeri bul (Grafik ölçeği için)
    const maxCount = Math.max(...data.map(d => d.count), 5); // En az 5 olsun ki grafik çok basık durmasın

    return (
        <div className="w-full h-full flex flex-col justify-end gap-2 p-2">
            <div className="flex-1 flex items-end justify-between gap-2">
                {data.map((item, idx) => {
                    const heightPercent = (item.count / maxCount) * 100;
                    const isToday = idx === 0;

                    return (
                        <div key={idx} className="flex flex-col items-center gap-2 group w-full">
                            <div className="relative w-full flex justify-end flex-col items-center h-[200px]">
                                {/* Tooltip (Hover) */}
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                                    {item.fullDate}: {item.count} Ders
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                                </div>

                                {/* Bar */}
                                <div
                                    className={`w-full max-w-[30px] rounded-t-lg transition-all duration-500 ease-out relative ${isToday ? 'bg-blue-600' : 'bg-blue-200 group-hover:bg-blue-300'}`}
                                    style={{ height: `${Math.max(heightPercent, 4)}%` }} // En az %4 yükseklik olsun
                                >
                                    {item.count > 0 && (
                                        <span className={`absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-bold ${isToday ? 'text-blue-700' : 'text-slate-500'}`}>
                                            {item.count}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span className={`text-xs font-medium ${isToday ? 'text-blue-700 font-bold' : 'text-slate-400'}`}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
