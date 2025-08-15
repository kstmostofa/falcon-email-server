import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImageInputProps {
    onChange: (file: File | null) => void;
    error?: string;
    previewUrl?: string;
}

export default function ImageUploader({ onChange, error, previewUrl }: ImageInputProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(previewUrl || null);

    const handleFile = (file: File) => {
        onChange(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setPreview(null);
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="grid gap-2">
            <div
                className="relative flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 p-6 transition hover:border-gray-400"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {!preview ? (
                    <div className="flex flex-col items-center text-center">
                        <UploadCloud className="h-10 w-10 text-gray-400" />
                        <p className="mt-2 font-medium text-gray-700">Drag & drop files here</p>
                        <p className="text-sm text-gray-500">Or click to browse</p>
                        <Button type="button" variant="outline" className="mt-4">
                            Browse file
                        </Button>
                    </div>
                ) : (
                    <>
                        <img src={preview} alt="Preview" className="bg-accent absolute inset-0 h-full w-full object-contain" />
                        <Button
                            type="button"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                clearImage();
                            }}
                            className="bg-opacity-70 hover:bg-opacity-100 absolute top-2 right-2 h-6 w-6 cursor-pointer rounded-full bg-white p-1 shadow"
                            title="Remove image"
                        >
                            <X className="h-4 w-4 text-red-600" />
                        </Button>
                    </>
                )}
            </div>

            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
