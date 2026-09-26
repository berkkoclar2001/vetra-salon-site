import Image from "next/image";
import BrowserFrame from "./BrowserFrame";

type Props = {
    src: string;
    alt: string;
    /** Tarayıcı çubuğunda gösterilecek sahte adres. */
    address?: string;
    priority?: boolean;
};

/**
 * Gerçek panel ekran görüntüsünü tarayıcı çerçevesi içinde gösterir.
 * İskelet/placeholder mockup yerine ürünün kendisini gösterdiği için
 * hero'nun ikna gücünü taşıyan ana görsel budur.
 */
export default function PanelShot({ src, alt, address, priority = false }: Props) {
    return (
        // Mobilde tüm ekran okunamayacak kadar küçülüyor; görsel sol üst köşeye yakınlaşıp kırpılır.
        <BrowserFrame address={address}>
            <Image
                src={src}
                alt={alt}
                width={1500}
                height={940}
                priority={priority}
                sizes="(max-width: 1024px) 100vw, 1280px"
                className="block h-[360px] w-full object-cover object-left-top sm:h-auto"
            />
        </BrowserFrame>
    );
}
