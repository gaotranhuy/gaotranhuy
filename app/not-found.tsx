import Link from "next/link";

export default function NotFound() {

  return (

    <main className="flex min-h-screen flex-col items-center justify-center gap-6">

      <h1 className="text-5xl font-bold">

        404

      </h1>

      <p>Trang không tồn tại.</p>

      <Link href="/">

        Về Trang Chủ

      </Link>

    </main>

  );

}
