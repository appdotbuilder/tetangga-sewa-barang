import React from 'react';
import { router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, User, Shield, ArrowLeft } from 'lucide-react';

interface Item {
    id: number;
    name: string;
    description: string;
    photos: string[] | null;
    daily_rate: number | null;
    weekly_rate: number | null;
    monthly_rate: number | null;
    deposit: number | null;
    status: string;
    pickup_address: string;
    max_radius_km: number;
    average_rating: number;
    total_reviews: number;
    created_at: string;
    category: {
        id: number;
        name: string;
        icon: string;
    };
    owner: {
        id: number;
        name: string;
        owner_rating: number;
        total_owner_reviews: number;
    };
    reviews: Array<{
        id: number;
        rating: number;
        comment: string;
        created_at: string;
        reviewer: {
            name: string;
        };
    }>;
}

interface Props {
    item: Item;
    canEdit: boolean;
    [key: string]: unknown;
}

export default function ItemShow({ item, canEdit }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
        ));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'rented': return 'bg-red-100 text-red-800';
            case 'maintenance': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available': return 'Tersedia';
            case 'rented': return 'Sedang Disewa';
            case 'maintenance': return 'Maintenance';
            case 'inactive': return 'Tidak Aktif';
            default: return status;
        }
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Button 
                            variant="outline" 
                            onClick={() => router.get('/')}
                            className="mb-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Beranda
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Item Images */}
                            <Card>
                                <CardContent className="p-0">
                                    <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-t-lg overflow-hidden">
                                        <div className="w-full h-96 flex items-center justify-center">
                                            <span className="text-8xl">{item.category.icon}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Item Details */}
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-3xl">{item.name}</CardTitle>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge>{item.category.name}</Badge>
                                                <Badge 
                                                    className={getStatusColor(item.status)}
                                                    variant="secondary"
                                                >
                                                    {getStatusText(item.status)}
                                                </Badge>
                                            </div>
                                        </div>
                                        {canEdit && (
                                            <Button 
                                                variant="outline"
                                                onClick={() => router.get(`/items/${item.id}/edit`)}
                                            >
                                                Edit Item
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed mb-6">
                                        {item.description}
                                    </CardDescription>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-4">
                                        {renderStars(Math.round(item.average_rating))}
                                        <span className="text-lg font-medium">{item.average_rating.toFixed(1)}</span>
                                        <span className="text-gray-600">({item.total_reviews} ulasan)</span>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center text-gray-700 mb-4">
                                        <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                                        <span>{item.pickup_address}</span>
                                        <span className="ml-2 text-sm text-gray-500">
                                            (Radius {item.max_radius_km} km)
                                        </span>
                                    </div>

                                    {/* Pricing */}
                                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                        <h3 className="font-semibold mb-3">💰 Tarif Sewa</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {item.daily_rate && (
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {formatCurrency(item.daily_rate)}
                                                    </div>
                                                    <div className="text-sm text-gray-600">per hari</div>
                                                </div>
                                            )}
                                            {item.weekly_rate && (
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {formatCurrency(item.weekly_rate)}
                                                    </div>
                                                    <div className="text-sm text-gray-600">per minggu</div>
                                                </div>
                                            )}
                                            {item.monthly_rate && (
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {formatCurrency(item.monthly_rate)}
                                                    </div>
                                                    <div className="text-sm text-gray-600">per bulan</div>
                                                </div>
                                            )}
                                        </div>
                                        {item.deposit && (
                                            <div className="mt-4 text-center">
                                                <div className="flex items-center justify-center">
                                                    <Shield className="w-4 h-4 mr-2 text-blue-500" />
                                                    <span className="text-sm text-gray-700">
                                                        Deposit: {formatCurrency(item.deposit)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Reviews Section */}
                            {item.reviews.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>💬 Ulasan Penyewa</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {item.reviews.slice(0, 5).map((review) => (
                                                <div key={review.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{review.reviewer.name}</span>
                                                            <div className="flex">
                                                                {renderStars(review.rating)}
                                                            </div>
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(review.created_at).toLocaleDateString('id-ID')}
                                                        </span>
                                                    </div>
                                                    {review.comment && (
                                                        <p className="text-gray-700">{review.comment}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Owner Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <User className="w-5 h-5 mr-2" />
                                        Pemilik
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                                            {item.owner.name.charAt(0).toUpperCase()}
                                        </div>
                                        <h3 className="font-semibold text-lg">{item.owner.name}</h3>
                                        <div className="flex items-center justify-center gap-1 mt-2">
                                            {renderStars(Math.round(item.owner.owner_rating))}
                                            <span className="text-sm text-gray-600 ml-1">
                                                ({item.owner.total_owner_reviews} ulasan)
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Booking Actions */}
                            {item.status === 'available' && !canEdit && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>📅 Sewa Barang Ini</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Button 
                                            className="w-full mb-3"
                                            onClick={() => router.get(`/items/${item.id}/book`)}
                                        >
                                            Ajukan Sewa
                                        </Button>
                                        <p className="text-sm text-gray-600 text-center">
                                            Pengajuan akan dikirim ke pemilik untuk persetujuan
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Item Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>ℹ️ Informasi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Kategori:</span>
                                        <span className="font-medium">{item.category.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Dipublikasi:</span>
                                        <span className="font-medium">
                                            {new Date(item.created_at).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <Badge 
                                            className={getStatusColor(item.status)}
                                            variant="secondary"
                                        >
                                            {getStatusText(item.status)}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}