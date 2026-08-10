'use client';

import { useState, useRef } from 'react';
import { CloudUpload, Image as ImageIcon, X, Check, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImageUploadDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export function ImageUploadDropzone({
  value,
  onChange,
  label = 'Product Image',
  placeholder = 'https://...',
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase text-slate-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
        >
          <LinkIcon className="h-3 w-3" />
          {showUrlInput ? 'Use File Upload' : 'Paste Image URL'}
        </button>
      </div>

      {showUrlInput ? (
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono text-slate-900"
        />
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : value
              ? 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50'
              : 'border-slate-300 bg-slate-50 hover:border-primary hover:bg-slate-100/80'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {value ? (
            <div className="flex items-center gap-4 w-full justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm">
                  <img src={value} alt="Uploaded preview" className="h-full w-full object-contain" />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-emerald-600" /> Image Uploaded Ready
                  </p>
                  <p className="text-[10px] text-slate-500 truncate font-mono max-w-[200px] sm:max-w-[300px]">
                    {value.startsWith('data:') ? 'Local Image File (Data URL)' : value}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center gap-1.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <CloudUpload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to upload image or drag & drop
                </p>
                <p className="text-[10px] text-slate-400">
                  Supports PNG, JPG, WEBP or GIF files
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
