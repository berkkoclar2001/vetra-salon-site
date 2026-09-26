// src/components/shared/PaginationControl.tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

interface Props {
  currentPage: number;       // Şu an kaçıncı sayfadayız?
  totalPages: number;        // Toplam kaç sayfa var?
  onPageChange: (page: number) => void; // Sayfa değişince ne olsun?
}

export default function PaginationControl({ currentPage, totalPages, onPageChange }: Props) {
  return (
    <Pagination className="mt-4 flex justify-end">
      <PaginationContent className="flex gap-2">

        {/* ÖNCEKİ BUTONU */}
        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1} // 1. sayfadaysak tıklanamasın
            onClick={() => onPageChange(currentPage - 1)}
          >
            Önceki
          </Button>
        </PaginationItem>

        {/* ORTA BİLGİ (Sayfa 1 / 50) */}
        <div className="flex items-center px-4 text-sm font-medium">
          Sayfa {currentPage} / {totalPages}
        </div>

        {/* SONRAKİ BUTONU */}
        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages} // Son sayfadaysak tıklanamasın
            onClick={() => onPageChange(currentPage + 1)}
          >
            Sonraki
          </Button>
        </PaginationItem>

      </PaginationContent>
    </Pagination>
  );
}