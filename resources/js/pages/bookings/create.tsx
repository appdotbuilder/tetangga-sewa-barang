import React from 'react';
import { useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, Calculator } from 'lucide-react';

interface Item {
    id: number;
    name: string;
    description: string;
    daily_rate: number | null;
    weekly_rate: number | null;
    monthly_rate: number | null;
    deposit: number | null;
    category: {
        name: string;
        icon: string;
    };
    owner: {
        name: string;
    };
}

interface Props {
    item: Item;
    [key: string]: unknown;
}



export default function BookingCreate({ item }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        item_id: item.id,
        start_date: '',
        end_date: '',
        rate_type: '',
        notes: '',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const calculateTotal = () => {
        if (!data.start_date || !data.end_date || !data.rate_type) return 0;

        // Calculate days for future use
        // const startDate = new Date(data.start_date);
        // const endDate = new Date(data.end_date);
        // const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        let rate = 0;
        switch (data.rate_type) {
            case 'daily':
                rate = item.daily_rate || 0;
                break;
            case 'weekly':
                rate = item.weekly_rate || 0;
                break;
            case 'monthly':
                rate = item.monthly_rate || 0;
                break;
        }

        return rate + (item.deposit || 0);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('bookings.store'));
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Button 
                            variant="outline" 
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Item Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="text-2xl mr-2">{item.category.icon}</span>
                                    {item.name}
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Badge>{item.category.name}</Badge>
                                    <Badge variant="secondary">Pemilik: {item.owner.name}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-4">
                                    {item.description}
                                </CardDescription>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-3">💰 Tarif Sewa</h4>
                                    <div className="space-y-2">
                                        {item.daily_rate && (
                                            <div className="flex justify-between">
                                                <span>Harian:</span>
                                                <span className="font-semibold text-green-600">
                                                    {formatCurrency(item.daily_rate)}
                                                </span>
                                            </div>
                                        )}
                                        {item.weekly_rate && (
                                            <div className="flex justify-between">
                                                <span>Mingguan:</span>
                                                <span className="font-semibold text-green-600">
                                                    {formatCurrency(item.weekly_rate)}
                                                </span>
                                            </div>
                                        )}
                                        {item.monthly_rate && (
                                            <div className="flex justify-between">
                                                <span>Bulanan:</span>
                                                <span className="font-semibold text-green-600">
                                                    {formatCurrency(item.monthly_rate)}
                                                </span>
                                            </div>
                                        )}
                                        {item.deposit && (
                                            <div className="flex justify-between border-t pt-2">
                                                <span>Deposit:</span>
                                                <span className="font-semibold text-blue-600">
                                                    {formatCurrency(item.deposit)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Booking Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Ajukan Sewa
                                </CardTitle>
                                <CardDescription>
                                    Isi detail periode sewa yang diinginkan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tanggal Mulai
                                            </label>
                                            <Input
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                            />
                                            {errors.start_date && (
                                                <div className="text-red-600 text-sm mt-1">{errors.start_date}</div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tanggal Selesai
                                            </label>
                                            <Input
                                                type="date"
                                                value={data.end_date}
                                                onChange={(e) => setData('end_date', e.target.value)}
                                                min={data.start_date || new Date().toISOString().split('T')[0]}
                                                required
                                            />
                                            {errors.end_date && (
                                                <div className="text-red-600 text-sm mt-1">{errors.end_date}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Jenis Tarif
                                        </label>
                                        <Select value={data.rate_type} onValueChange={(value) => setData('rate_type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenis tarif" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {item.daily_rate && (
                                                    <SelectItem value="daily">
                                                        Harian - {formatCurrency(item.daily_rate)}
                                                    </SelectItem>
                                                )}
                                                {item.weekly_rate && (
                                                    <SelectItem value="weekly">
                                                        Mingguan - {formatCurrency(item.weekly_rate)}
                                                    </SelectItem>
                                                )}
                                                {item.monthly_rate && (
                                                    <SelectItem value="monthly">
                                                        Bulanan - {formatCurrency(item.monthly_rate)}
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {errors.rate_type && (
                                            <div className="text-red-600 text-sm mt-1">{errors.rate_type}</div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Catatan (Opsional)
                                        </label>
                                        <Textarea
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Tambahkan catatan atau permintaan khusus..."
                                            rows={3}
                                        />
                                        {errors.notes && (
                                            <div className="text-red-600 text-sm mt-1">{errors.notes}</div>
                                        )}
                                    </div>

                                    {/* Cost Summary */}
                                    {data.start_date && data.end_date && data.rate_type && (
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <Calculator className="w-4 h-4 mr-2 text-blue-600" />
                                                <h4 className="font-semibold text-blue-900">Estimasi Biaya</h4>
                                            </div>
                                            <div className="text-2xl font-bold text-blue-900">
                                                {formatCurrency(calculateTotal())}
                                            </div>
                                            <div className="text-sm text-blue-700 mt-1">
                                                *Termasuk deposit {item.deposit ? formatCurrency(item.deposit) : 'Rp 0'}
                                            </div>
                                        </div>
                                    )}

                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        disabled={processing}
                                    >
                                        {processing ? 'Mengirim...' : 'Kirim Pengajuan Sewa'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}