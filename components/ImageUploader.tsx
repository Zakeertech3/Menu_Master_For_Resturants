import React, { useState, useRef } from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { RetakeIcon } from './icons/RetakeIcon';

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleRetake = () => {
    setPreviewUrl(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
      <div className="flex flex-col items-center justify-center w-full">
        {previewUrl ? (
          <div className="w-full text-center">
            <img src={previewUrl} alt="Menu preview" className="max-h-96 w-auto mx-auto rounded-lg object-contain" />
            <button
              onClick={handleRetake}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
            >
              <RetakeIcon className="h-5 w-5 mr-2" />
              Change Photo
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-2xl text-center cursor-pointer hover:border-brand-primary hover:bg-brand-light/50 transition-colors" onClick={triggerFileInput}>
            <CameraIcon className="h-12 w-12 text-brand-primary/50" />
            <p className="mt-2 text-lg font-semibold text-brand-dark">Scan or Upload Menu</p>
            <p className="text-sm text-gray-500">Tap here to open your camera or gallery</p>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;