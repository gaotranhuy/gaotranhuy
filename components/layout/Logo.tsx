import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
      aria-label="Gạo Trần Huy"
    >
      <Image
        src="/logo.png"
        alt="Gạo Trần Huy"
        width={52}
        height={52}
        priority
      />

      <div className="hidden sm:block">
        <h2 className="text-xl font-bold text-green-700">
          Gạo Trần Huy
        </h2>

        <p className="text-xs text-gray-500">
          Gạo ngon • Đặc sản • Đà Nẵng
        </p>
      </div>
    </Link>
  );
}
