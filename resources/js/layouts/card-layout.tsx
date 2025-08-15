import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { JSX } from 'react';

interface CardLayoutProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    cardAction?: JSX.Element;
}

export default function CardLayout({ children, title, description, cardAction }: CardLayoutProps) {
    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <CardTitle className="text-2xl">{title}</CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>
                    {cardAction && <div>{cardAction}</div>}
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </div>
    );
}
