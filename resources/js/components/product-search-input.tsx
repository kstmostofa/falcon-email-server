import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ProductImage } from '@/types/product';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface ProductOption {
    id: string;
    name: string;
    images: ProductImage[];
    unit: string;
}

interface ProductSearchSelectProps {
    onProductSelect: (product: ProductOption) => void;
    isProduction?: boolean | null;
    apiUrl?: string;
}

export function ProductSearchInput({ onProductSelect, isProduction = null, apiUrl }: ProductSearchSelectProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ProductOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<ProductOption | null>(null);

    const fetchData = async (query: string) => {
        setLoading(true);
        try {
            const url = new URL(apiUrl ? apiUrl : route('filter.products'), window.location.origin);
            if (query) url.searchParams.set('search', query);
            if (isProduction !== null) url.searchParams.set('is_production', String(isProduction));
            else url.searchParams.delete('is_production');

            const res = await fetch(url.toString());
            const json = await res.json();
            setResults(json);
        } catch (err) {
            console.error('Failed to fetch select options:', err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (query) {
            const delayDebounceFn = setTimeout(() => {
                fetchData(query);
            }, 300);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setResults([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const handleSelect = (product: ProductOption) => {
        setSelected(product);
        setResults([]);
        onProductSelect(product);
        setQuery('');
    };

    return (
        <div className="relative w-full">
            <Input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full" />
            {!loading && results.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow-lg">
                    {results.map((product) => (
                        <li
                            key={product.id}
                            className={cn('hover:bg-accent cursor-pointer p-2', selected?.id === product.id ? 'bg-accent' : '')}
                            onClick={() => handleSelect(product)}
                        >
                            <div className="flex items-center justify-between">
                                {/*//show product image if available*/}
                                <div className="flex items-center space-x-2">
                                    <img
                                        src={product.images[0] ? product.images[0]?.image_url : 'No image'}
                                        alt={product.name}
                                        className="mr-2 h-8 w-8 rounded-md border"
                                    />
                                    <span className="text-sm font-medium">{product.name}</span>
                                </div>

                                {selected?.id === product.id && <Check className="text-green-500" />}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
