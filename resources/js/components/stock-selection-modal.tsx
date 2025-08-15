// components/stock-selection-modal.tsx
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OrderProduct, Stocks } from '@/types/order';
import React, { useState } from 'react';

interface StockSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStockSelect: (selectedStock: Stocks) => void;
    stockData: OrderProduct;
}

export function StockSelectionModal({ isOpen, onClose, onStockSelect, stockData }: StockSelectionModalProps) {
    const [selectedStockId, setSelectedStockId] = useState<string | null>(null);

    React.useEffect(() => {
        if (isOpen) {
            setSelectedStockId(null);
        }
    }, [isOpen]);
    const handleSelect = () => {
        const stock = stockData.stocks.find((s) => s.id.toString() === selectedStockId);
        if (stock) {
            onStockSelect(stock);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Stock for {stockData.name}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <RadioGroup onValueChange={setSelectedStockId} value={selectedStockId || ''}>
                        {stockData.stocks.map((stock) => (
                            <div key={stock.id} className="flex items-center gap-2 rounded-md border p-2">
                                <RadioGroupItem value={stock.id.toString()} id={`stock-${stock.id}`} />
                                <Label htmlFor={`stock-${stock.id}`} className="flex flex-col gap-1">
                                    <span>Batch: {stock.batch_number}</span>
                                    <span>
                                        Available: {stock.quantity} {stockData.unit.toLocaleUpperCase() || ''}){' '}
                                    </span>
                                    <span>Price: ৳{stock.selling_price}</span>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={onClose} variant="outline">
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSelect} disabled={!selectedStockId}>
                        Select Stock
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
