import Image from "next/image";
import Link from 'next/link';
import Hero from '../components/hero';


export default function Home() {
  return (
    <div className="bg-white pb-6 sm:pb-8 lg:pb-12">
      <Hero/>
    </div>
  );
}
