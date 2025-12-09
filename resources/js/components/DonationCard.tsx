import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Clock, Heart, Users } from 'lucide-react';

interface DonationCardProps {
    id: number;
    title: string;
    description: string;
    imagePath: string | null;
    targetAmount: number;
    collectedAmount: number;
    organizerName: string;
    organizerAvatar?: string | null;
    donorsCount?: number;
    daysRemaining?: number;
}

export const DonationCard = ({
    id,
    title,
    description,
    imagePath,
    targetAmount,
    collectedAmount,
    organizerName,
    organizerAvatar,
    donorsCount = 0,
    daysRemaining = 0,
}: DonationCardProps) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const calculateProgress = (collected: number, target: number) => {
        return Math.min((collected / target) * 100, 100);
    };

    const progress = calculateProgress(collectedAmount, targetAmount);

    return (
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
            <Link href={`/campaigns/${id}`}>
                <div className="aspect-[4/3] overflow-hidden">
                    {imagePath ? (
                        <img
                            src={imagePath}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                    ) : (
                        <div className="from-primary/20 to-primary/5 flex h-full w-full items-center justify-center bg-gradient-to-br">
                            <Heart className="text-primary/40 h-16 w-16" />
                        </div>
                    )}
                </div>
            </Link>

            <CardContent className="p-6">
                <Link href={`/campaigns/${id}`}>
                    <h3 className="group-hover:text-primary mb-2 line-clamp-2 text-lg font-semibold text-gray-900 transition-colors dark:text-white">
                        {title}
                    </h3>
                </Link>

                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    oleh {organizerName}
                </p>

                <div className="mb-4">
                    <div className="relative h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-purple-600 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="mb-4 flex items-baseline justify-between">
                    <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatCurrency(collectedAmount)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            terkumpul dari {formatCurrency(targetAmount)}
                        </p>
                    </div>
                </div>

                <div className="mb-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{donorsCount} donatur</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{daysRemaining} hari lagi</span>
                    </div>
                </div>

                <Link href={`/campaigns/${id}`}>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-purple-600 font-semibold text-white transition-opacity hover:opacity-90">
                        <Heart className="mr-2 h-4 w-4 fill-current" />
                        Donasi Sekarang
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
};

export default DonationCard;
