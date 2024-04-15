import Image from "next/image";
import Link from 'next/link';


export default function Home() {
  return (
    <header className="mb-8 border-b">
      <div className="flex items-center justify-between mx-auto max-w-2xl px-4 sm:px-6 lg:max-2-7xl">
        <Link href="/">
          <h1 className="text-2xl font-bold">E-Store</h1>
        </Link>
      </div>
    </header>
  );
}
