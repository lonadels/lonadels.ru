'use client';

import {Button} from '@/components/ui/button';
import {useCallback, useState} from 'react';
import {If, Then} from 'react-if';
import {Loader2Icon} from 'lucide-react';
import HelloEntity from '@/entities/hello.entity';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Home() {
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [result, setResult] = useState<string | null>(null);

    const handleButtonClick = useCallback(() => {
        setLoading(true);
        fetch('/api/hello')
            .then(async res => {
                const data: HelloEntity = await res.json();
                setResult(data.message);
                setOpen(true);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div
            className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <Button onClick={handleButtonClick} aria-busy={loading} disabled={loading}>
                    <If condition={loading}>
                        <Then>
                            <Loader2Icon className="animate-spin"/>
                        </Then>
                    </If>
                    Тест
                </Button>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Результат</AlertDialogTitle>
                            <AlertDialogDescription>
                                {result}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction>Закрыть</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </main>
        </div>
    );
}
