import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram } from 'lucide-react';
import { DESCRIPTIONS, NAVIGATION } from '@/constants';

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-right">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{DESCRIPTIONS.FOOTER.ABOUT_TARKEBA_TITLE}</h3>
            <p className="text-sm text-muted-foreground">
             {DESCRIPTIONS.FOOTER.ABOUT_TARKEBA}
            </p>
            <div className="flex gap-4 mt-4 justify-center md:justify-start">
              <Link href="https://www.instagram.com/tarkeba_perfume/" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://facebook.com" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://tiktok.com" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">السياسات</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/shipping-delivery" className="text-muted-foreground hover:text-primary">
                  الشحن والتوصيل
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{NAVIGATION.FOOTER.CUSTOMER_SERVICE_TITLE}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/account/orders" className="text-muted-foreground hover:text-primary">
                  {NAVIGATION.FOOTER.CUSTOMER_SERVICE.TRACK_ORDER}
                </Link>
              </li>
              <li>
                <Link href="/account/returns" className="text-muted-foreground hover:text-primary">
                  {NAVIGATION.FOOTER.CUSTOMER_SERVICE.RETURNS}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                 {NAVIGATION.FOOTER.CUSTOMER_SERVICE.FAQ}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{NAVIGATION.FOOTER.CONTACT_TITLE}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{NAVIGATION.FOOTER.CONTACT.EMAIL_LABEL}: {NAVIGATION.FOOTER.CONTACT.EMAIL}</li>
              <li>{NAVIGATION.FOOTER.CONTACT.PHONE_LABEL}: {NAVIGATION.FOOTER.CONTACT.PHONE}</li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} تركيبة. {DESCRIPTIONS.FOOTER.COPYRIGHT}</p>
        </div>
      </div>
    </footer>
  );
}
