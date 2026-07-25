import React, { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function UploadArea({ onFileSelected, isAnalyzing, uploadedImageUrl }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      onFileSelected(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = '';
  };

  if (isAnalyzing) {
    return (
      <div className="rounded-3xl border-2 border-primary/20 bg-card overflow-hidden shadow-lg shadow-primary/5">
        {uploadedImageUrl ? (
          <div className="relative aspect-[4/3] overflow-hidden">
            <img src={uploadedImageUrl} alt="Your fridge" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent animate-[scan_2s_ease-in-out_infinite]" />
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
              <p className="text-white font-heading font-semibold text-base sm:text-lg">Scanning your ingredients…</p>
            </div>
          </div>
        ) : (
          <div className="aspect-[4/3] flex flex-col items-center justify-center gap-4 p-8">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="font-heading font-semibold text-lg text-foreground">Uploading your photo…</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center transition-all cursor-pointer overflow-hidden ${
          isDragging ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="absolute top-4 left-4 text-3xl opacity-20 rotate-[-15deg] select-none">🥕</div>
        <div className="absolute bottom-4 right-4 text-3xl opacity-20 rotate-12 select-none">🍅</div>
        <div className="absolute top-6 right-8 text-2xl opacity-15 rotate-20 select-none">🥬</div>
        <div className="absolute bottom-6 left-8 text-2xl opacity-15 rotate-[-8deg] select-none">🍋</div>

        <div className="relative flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/12 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-heading font-semibold text-lg text-foreground">Drag &amp; drop your fridge photo</p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse — we'll identify your ingredients with AI</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => fileInputRef.current?.click()} className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-2xl bg-primary text-primary-foreground font-heading font-semibold shadow-sm hover:bg-primary/90 transition-colors">
          <Upload className="w-4 h-4" /> Browse Files
        </button>
        <button onClick={() => cameraInputRef.current?.click()} className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-2xl bg-accent text-accent-foreground font-heading font-semibold shadow-sm hover:bg-accent/90 transition-colors">
          <Camera className="w-4 h-4" /> Use Camera
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleInputChange} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleInputChange} />
    </div>
  );
}
