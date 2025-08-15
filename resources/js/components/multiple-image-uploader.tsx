import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface MultipleImageUploaderProps {
    onChange: (files: File[]) => void;
    error?: string;
    previewUrls?: string[];
    multiple?: boolean;
}

export default function MultipleImageUploader({ onChange, error, previewUrls = [], multiple = true }: MultipleImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previews, setPreviews] = useState<string[]>(previewUrls);
    const [files, setFiles] = useState<File[]>([]);

    const handleFiles = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return;

        const fileArray = Array.from(selectedFiles);
        // const newPreviews: string[] = [];
        const newFiles: File[] = [];

        fileArray.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
            newFiles.push(file);
        });

        const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
        setFiles(updatedFiles);
        onChange(updatedFiles);
        if (!multiple) setPreviews([]);
    };

    const clearImage = (index: number) => {
        const updatedFiles = [...files];
        const updatedPreviews = [...previews];
        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);
        setFiles(updatedFiles);
        setPreviews(updatedPreviews);
        onChange(updatedFiles);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div className="grid gap-2">
            <div
                className="relative flex h-48 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 p-6 transition hover:border-gray-400"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {previews.length === 0 ? (
                    <div className="flex flex-col items-center text-center">
                        <UploadCloud className="h-10 w-10 text-gray-400" />
                        <p className="mt-2 font-medium text-gray-700">Drag & drop files here</p>
                        <p className="text-sm text-gray-500">Or click to browse</p>
                        <Button type="button" variant="outline" className="mt-4">
                            Browse file{multiple && 's'}
                        </Button>
                    </div>
                ) : (
                    <div className="flex w-full flex-wrap items-center justify-center gap-4 overflow-y-auto">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative rounded-md border border-dashed">
                                <img src={preview} alt={`Preview ${index + 1}`} className="h-32 w-32 rounded-md object-cover" />
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearImage(index);
                                    }}
                                    className="bg-opacity-70 hover:bg-opacity-100 absolute -top-2 -right-2 h-6 w-6 cursor-pointer rounded-full bg-white p-1 shadow"
                                    title="Remove image"
                                >
                                    <X className="h-4 w-4 text-red-600" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <input type="file" accept="image/*" multiple={multiple} ref={inputRef} className="hidden" onChange={(e) => handleFiles(e.target.files)} />

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
