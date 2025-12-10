import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    UsersIcon,
    MegaphoneIcon,
    CurrencyDollarIcon,
    CreditCardIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

interface Stats {
    total_users: number;
    total_admins: number;
    total_organizers: number;
    total_regular_users: number;
    total_campaigns: number;
    active_campaigns: number;
    completed_campaigns: number;
    draft_campaigns: number;
    total_donations: number;
    total_donations_count: number;
    pending_donations: number;
    pending_donations_amount: number;
    total_payments: number;
    pending_payments: number;
    completed_payments: number;
    failed_payments: number;
}

interface Donation {
    id: number;
    amount: number;
    donor_name: string;
    campaign_title: string;
    status: string;
    created_at: string;
}

interface Campaign {
    id: number;
    title: string;
    organizer_name: string;
    status: string;
    target_amount: number;
    collected_amount: number;
    progress: number;
    created_at: string;
}

interface ChartData {
    month: string;
    amount: number;
    count: number;
}

interface Props {
    stats: Stats;
    recent_donations: Donation[];
    recent_campaigns: Campaign[];
    donations_chart: ChartData[];
}

export default function Dashboard({ stats, recent_donations, recent_campaigns, donations_chart }: Props) {
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const statCards = [
        {
            name: 'Total Users',
            value: stats.total_users,
            icon: UsersIcon,
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            description: `${stats.total_admins} admins, ${stats.total_organizers} organizers`,
        },
        {
            name: 'Total Campaigns',
            value: stats.total_campaigns,
            icon: MegaphoneIcon,
            color: 'bg-green-500',
            textColor: 'text-green-600',
            bgColor: 'bg-green-50',
            description: `${stats.active_campaigns} active campaigns`,
        },
        {
            name: 'Total Donations',
            value: formatRupiah(stats.total_donations),
            icon: CurrencyDollarIcon,
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            description: `${stats.total_donations_count} completed donations`,
        },
        {
            name: 'Pending Payments',
            value: stats.pending_payments,
            icon: CreditCardIcon,
            color: 'bg-red-500',
            textColor: 'text-red-600',
            bgColor: 'bg-red-50',
            description: `${stats.completed_payments} completed`,
        },
    ];

    const getStatusBadge = (status: string) => {
        const statusClasses: Record<string, string> = {
            completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
            failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
            cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
            active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        };

        return (
            <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    statusClasses[status] || statusClasses.pending
                }`}
            >
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Overview of your application statistics and recent activities
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.name}
                                className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800"
                            >
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 rounded-lg ${stat.bgColor} p-3`}>
                                            <Icon className={`h-6 w-6 ${stat.textColor}`} />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {stat.name}
                                            </p>
                                            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                                                {stat.value}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {stat.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Donations Chart */}
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Donations Over Time
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Last 6 months donation trends
                        </p>
                        <div className="mt-6 space-y-4">
                            {donations_chart.map((data, index) => {
                                const maxAmount = Math.max(...donations_chart.map((d) => d.amount));
                                const percentage = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;

                                return (
                                    <div key={index}>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                {data.month}
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {formatRupiah(data.amount)} ({data.count})
                                            </span>
                                        </div>
                                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                            <div
                                                className="h-full bg-blue-500 transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Campaign Statistics
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Campaign status breakdown
                        </p>
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-green-500" />
                                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                                        Active Campaigns
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {stats.active_campaigns}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                                        Completed Campaigns
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {stats.completed_campaigns}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-gray-500" />
                                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                                        Draft Campaigns
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {stats.draft_campaigns}
                                </span>
                            </div>
                            <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Pending Donations
                                    </span>
                                    <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                                        {stats.pending_donations} ({formatRupiah(stats.pending_donations_amount)})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Donations */}
                    <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Recent Donations
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recent_donations.length > 0 ? (
                                    recent_donations.map((donation) => (
                                        <div
                                            key={donation.id}
                                            className="flex items-start justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-gray-700"
                                        >
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {donation.donor_name}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    {donation.campaign_title}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                    {donation.created_at}
                                                </p>
                                            </div>
                                            <div className="ml-4 text-right">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {formatRupiah(donation.amount)}
                                                </p>
                                                <div className="mt-1">{getStatusBadge(donation.status)}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                        No recent donations
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Campaigns */}
                    <div className="rounded-lg bg-white shadow dark:bg-gray-800">
                        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Recent Campaigns
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recent_campaigns.length > 0 ? (
                                    recent_campaigns.map((campaign) => (
                                        <div
                                            key={campaign.id}
                                            className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-gray-700"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {campaign.title}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        by {campaign.organizer_name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                                        {campaign.created_at}
                                                    </p>
                                                </div>
                                                <div className="ml-4">{getStatusBadge(campaign.status)}</div>
                                            </div>
                                            <div className="mt-3">
                                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                                    <span>Progress</span>
                                                    <span className="font-medium">{campaign.progress}%</span>
                                                </div>
                                                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                                    <div
                                                        className="h-full bg-green-500 transition-all"
                                                        style={{ width: `${Math.min(campaign.progress, 100)}%` }}
                                                    />
                                                </div>
                                                <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                                    <span>{formatRupiah(campaign.collected_amount)}</span>
                                                    <span>{formatRupiah(campaign.target_amount)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                        No recent campaigns
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
