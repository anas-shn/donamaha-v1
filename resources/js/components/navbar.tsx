// import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Heart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <div className="bg-gradient-primary p-2 rounded-xl">
              <Heart className="h-6 w-6 text-primary-foreground fill-current" />
            </div>
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              doneasy
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Beranda
            </Link>
            <Link href="/donasi" className="text-foreground hover:text-primary transition-colors font-medium">
              Donasi
            </Link>
            <Link href="/riwayat" className="text-foreground hover:text-primary transition-colors font-medium">
              Riwayat
            </Link>
          </div>

          <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
            Gabung
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;