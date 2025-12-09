import DonationCard from "@/components/donation-card";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Heart, Users, Target, TrendingUp } from "lucide-react";

const Index = () => {
  // Mock data untuk donasi populer
  const popularDonations = [
    {
      id: "1",
      title: "Bantu Pembangunan Perpustakaan Kampus",
      organizer: "Himpunan Mahasiswa Teknik",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop",
      target: 50000000,
      collected: 35000000,
      donors: 234,
      daysLeft: 15,
    },
    {
      id: "2",
      title: "Beasiswa untuk Mahasiswa Kurang Mampu",
      organizer: "BEM Universitas Indonesia",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop",
      target: 100000000,
      collected: 75000000,
      donors: 456,
      daysLeft: 30,
    },
    {
      id: "3",
      title: "Renovasi Laboratorium Komputer",
      organizer: "Fakultas Ilmu Komputer",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop",
      target: 30000000,
      collected: 18000000,
      donors: 123,
      daysLeft: 20,
    },
    {
      id: "4",
      title: "Program Peduli Sesama Mahasiswa",
      organizer: "Organisasi Kemahasiswaan",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop",
      target: 25000000,
      collected: 20000000,
      donors: 189,
      daysLeft: 10,
    },
  ];

  const stats = [
    {
      icon: Heart,
      value: "500+",
      label: "Donasi Terkumpul",
    },
    {
      icon: Users,
      value: "10K+",
      label: "Donatur Aktif",
    },
    {
      icon: Target,
      value: "5M+",
      label: "Dana Tersalurkan",
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Tingkat Keberhasilan",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-20 pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Heart className="h-4 w-4 fill-current" />
                Platform Donasi Mahasiswa #1 di Indonesia
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
              Wujudkan Impian,
              <br />
              Berbagi Kebaikan
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Platform donasi yang menghubungkan mahasiswa untuk saling membantu.
              Mulai galang dana atau donasi untuk kampanye yang kamu percaya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6">
                <Heart className="h-5 w-5 mr-2 fill-current" />
                Mulai Donasi
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                Galang Dana
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 text-center shadow-elegant hover:shadow-hover transition-all duration-300 hover:-translate-y-1 border border-border/40"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Donations Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Donasi Populer</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kampanye donasi yang sedang trending dan membutuhkan dukunganmu
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {popularDonations.map((donation) => (
              <DonationCard key={donation.id} {...donation} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-2">
              Lihat Semua Donasi
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
