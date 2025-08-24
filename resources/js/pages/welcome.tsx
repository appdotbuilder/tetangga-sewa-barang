import React from 'react';
import { router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MapPin, Search, Filter } from 'lucide-react';

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
    average_rating: number;
    total_reviews: number;
    category: {
        id: number;
        name: string;
        icon: string;
    };
    owner: {
        id: number;
        name: string;
    };
}

interface Category {
    id: number;
    name: string;
    icon: string;
    description: string;
}

interface Props {
    items: {
        data: Item[];
        links: Record<string, unknown>[];
        current_page: number;
        last_page: number;
    };
    categories: Category[];
    filters: {
        search?: string;
        category_id?: string;
        location?: string;
    };
    [key: string]: unknown;
}

export default function Welcome({ items, categories, filters }: Props) {
    const [searchTerm, setSearchTerm] = React.useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = React.useState(filters.category_id || '');
    const [location, setLocation] = React.useState(filters.location || '');

    const handleSearch = () => {
        const params: Record<string, string> = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category_id = selectedCategory;
        if (location) params.location = location;

        router.get('/', params);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setLocation('');
        router.get('/');
    };

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

    return (
        <AppShell>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Hero Section */}
                <div className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                                🏘️ <span className="text-blue-600">SewaBarang</span> Tetangga
                            </h1>
                            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                                Platform komunitas untuk sewa-menyewa barang dengan tetangga. 
                                Hemat biaya, bangun relasi, dan kurangi sampah! 💚
                            </p>
                        </div>

                        {/* Search Section */}
                        <div className="mt-10 max-w-4xl mx-auto">
                            <div className="bg-white p-6 rounded-lg shadow-lg border">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="md:col-span-2">
                                        <Input
                                            type="text"
                                            placeholder="Cari barang yang ingin disewa..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full"
                                            icon={<Search className="w-4 h-4" />}
                                        />
                                    </div>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Semua Kategori</SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.icon} {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="text"
                                        placeholder="Lokasi"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        icon={<MapPin className="w-4 h-4" />}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <Button onClick={handleSearch} className="px-8">
                                        <Search className="w-4 h-4 mr-2" />
                                        Cari Barang
                                    </Button>
                                    <Button variant="outline" onClick={clearFilters}>
                                        <Filter className="w-4 h-4 mr-2" />
                                        Reset Filter
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                        {categories.slice(0, 8).map((category) => (
                            <Badge
                                key={category.id}
                                variant={selectedCategory === category.id.toString() ? 'default' : 'secondary'}
                                className="cursor-pointer px-4 py-2 text-sm"
                                onClick={() => {
                                    setSelectedCategory(category.id.toString());
                                    router.get('/', { 
                                        ...filters, 
                                        category_id: category.id.toString() 
                                    });
                                }}
                            >
                                {category.icon} {category.name}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Items Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    {items.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.data.map((item) => (
                                    <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-200">
                                        <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
                                            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                                                <span className="text-4xl">{item.category.icon}</span>
                                            </div>
                                        </div>
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
                                                <Badge variant="secondary" className="text-xs">
                                                    {item.category.name}
                                                </Badge>
                                            </div>
                                            <CardDescription className="line-clamp-2">
                                                {item.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pb-2">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-1">
                                                    {renderStars(Math.round(item.average_rating))}
                                                    <span className="text-sm text-gray-600 ml-1">
                                                        ({item.total_reviews} ulasan)
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    <span className="line-clamp-1">{item.pickup_address}</span>
                                                </div>
                                                <div className="text-sm space-y-1">
                                                    {item.daily_rate && (
                                                        <div>Harian: <span className="font-semibold text-green-600">{formatCurrency(item.daily_rate)}</span></div>
                                                    )}
                                                    {item.weekly_rate && (
                                                        <div>Mingguan: <span className="font-semibold text-green-600">{formatCurrency(item.weekly_rate)}</span></div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button 
                                                className="w-full" 
                                                onClick={() => router.get(`/items/${item.id}`)}
                                            >
                                                Lihat Detail
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {items.last_page > 1 && (
                                <div className="flex justify-center mt-8">
                                    <div className="flex space-x-2">
                                        {items.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                onClick={() => router.get('/', { ...filters, page: items.current_page - 1 })}
                                            >
                                                Previous
                                            </Button>
                                        )}
                                        <span className="flex items-center px-4 py-2 text-sm text-gray-600">
                                            Halaman {items.current_page} dari {items.last_page}
                                        </span>
                                        {items.current_page < items.last_page && (
                                            <Button
                                                variant="outline"
                                                onClick={() => router.get('/', { ...filters, page: items.current_page + 1 })}
                                            >
                                                Next
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">
                                Tidak ada barang yang ditemukan
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Coba ubah kata kunci pencarian atau filter yang dipilih
                            </p>
                            <Button onClick={clearFilters}>
                                Reset Pencarian
                            </Button>
                        </div>
                    )}
                </div>

                {/* Feature Highlights */}
                <div className="bg-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900">
                                ✨ Kenapa Pilih SewaBarang Tetangga?
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="text-4xl mb-4">💰</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hemat Biaya</h3>
                                <p className="text-gray-600">
                                    Sewa barang yang jarang dipakai dengan harga terjangkau, 
                                    tidak perlu beli baru!
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-4">🤝</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Komunitas Lokal</h3>
                                <p className="text-gray-600">
                                    Berinteraksi dengan tetangga sekitar, 
                                    bangun hubungan yang lebih dekat.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-4">🌱</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ramah Lingkungan</h3>
                                <p className="text-gray-600">
                                    Kurangi sampah dengan memanfaatkan barang yang sudah ada
                                    di sekitar kita.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}