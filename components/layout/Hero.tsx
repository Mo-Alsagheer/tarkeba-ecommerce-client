import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function Hero() {
  return (
    <section className="bg-[#E5E5E5] overflow-hidden pt-28 pb-12 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Text Content - Right Side in RTL */}
          <div className="flex-1 space-y-6 text-right z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-black leading-[1.1]">
              اكتشف سحر
              <br />
              العطور الفاخرة
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 max-w-xl leading-relaxed font-medium">
              دع حواسك تسافر مع كل رشة. تجربة عطرية فريدة تنتظرك. جرب التميز الآن.
            </p>
            
            <div className="pt-4">
              <Link href="/products">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 text-lg px-8 h-14 rounded-full">
                 اكتشف المزيد
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Content - Left Side in RTL */}
          <div className="flex-1 relative w-full max-w-md md:max-w-xl">
            <div className="relative aspect-square md:aspect-4/5 w-full">
               <Image 
                 src="/hero-perfume3.png" 
                 alt="Luxury Perfume" 
                 fill
                 className="object-contain drop-shadow-2xl"
                 priority
               />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
