import { Button } from '@/components/ui/button';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { Monitor, Moon, Sun } from 'lucide-react';
import { HTMLAttributes } from 'react';

export default function AppearanceSwitcher({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();

    const appearances: Appearance[] = ['light', 'dark', 'system'];

    const icons = {
        light: <Sun style={{ transform: 'scale(1.2)' }} />,
        dark: <Moon style={{ transform: 'scale(1.2)' }} />,
        system: <Monitor style={{ transform: 'scale(1.2)' }} />,
    };

    const nextAppearance = (): Appearance => {
        const currentIndex = appearances.indexOf(appearance);
        return appearances[(currentIndex + 1) % appearances.length];
    };

    return (
        <div className={cn('inline-flex items-center', className)} {...props}>
            <Button variant="secondary" onClick={() => updateAppearance(nextAppearance())}>
                {icons[appearance]}
            </Button>
        </div>
    );
}
