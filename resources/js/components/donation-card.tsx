import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Progress } from "@/components/ui/progress";

interface DonationCardProps {
  id: string;
  title: string;
  organizer: string;
  image: string;
  target: number;
  collected: number;
  donors: number;
  daysLeft: number;
}

const DonationCard = ({
  id,
  title,
  organizer,
  image,
  target,
  collected,
  donors,
  daysLeft,
}: DonationCardProps) => {
  const percentage = (collected / target) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Link href={`/donasi/${id}`}>
      <Card className="group overflow-hidden border-border/40 hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h3 className="font-bold text-lg line-clamp-2 mb-1 text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">oleh {organizer}</p>
          </div>

          <div className="space-y-2">
            <Progress value={percentage} className="h-2" />
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="font-bold text-foreground">{formatCurrency(collected)}</p>
                <p className="text-muted-foreground">terkumpul dari {formatCurrency(target)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{donors} donatur</span>
            </div>
            <div>• {daysLeft} hari lagi</div>
          </div>

          <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">
            <Heart className="h-4 w-4 mr-2 fill-current" />
            Donasi Sekarang
          </Button>
        </div>
      </Card>
    </Link>
  );
};

export default DonationCard;
