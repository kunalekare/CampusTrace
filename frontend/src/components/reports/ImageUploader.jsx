import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, Loader2, X, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';
import { reportService } from '../../services/reportService';

export function ImageUploader({ onUploaded, initialBlobName = null, initialUrl = null }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedBlob, setUploadedBlob] = useState(initialBlobName);
  const [previewUrl, setPreviewUrl] = useState(initialUrl);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WEBP, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');
    setError('');

    // Generate local preview immediately for great UX
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setUploading(true);
    try {
      const data = await reportService.uploadImage(file);
      setUploadedBlob(data.blobName);
      if (data.url) {
        setPreviewUrl(data.url);
      }
      onUploaded(data.blobName, data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload photo to Azure Storage. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setUploadedBlob(null);
    setFileName('');
    setFileSize('');
    setError('');
    onUploaded(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Photograph (Stored on Azure Blob Storage)
        </label>
        {uploadedBlob && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Verified on Azure
          </span>
        )}
      </div>

      {previewUrl ? (
        /* Image Preview Card */
        <div className="relative rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-50/30 to-slate-50 overflow-hidden shadow-sm transition">
          <div className="relative h-56 sm:h-64 w-full bg-slate-900/5">
            <img
              src={previewUrl}
              alt="Uploaded item preview"
              className="w-full h-full object-contain p-2"
            />

            {/* Azure Storage live indicator */}
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Azure Blob: {uploadedBlob ? 'Uploaded & Secured' : 'Uploading...'}</span>
            </div>

            {/* Remove / Replace buttons */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-lg shadow-sm border border-slate-200 transition text-xs flex items-center gap-1"
                title="Replace photo"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition text-xs"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {uploading && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                <span className="text-xs font-semibold">Streaming to Azure Blob Container...</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2 truncate">
              <ImageIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold text-slate-800 truncate">{fileName || uploadedBlob || 'Item Photo'}</span>
              {fileSize && <span className="text-slate-400 text-[11px]">({fileSize})</span>}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold tracking-tight">Active In Report</span>
          </div>
        </div>
      ) : (
        /* Upload Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/60 scale-[1.01]'
              : 'border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            Drop item photo here, or <span className="text-blue-600 hover:underline">browse files</span>
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            JPEG, PNG, WEBP, or GIF up to 5MB â€¢ Automatically encrypted on Azure Blob Storage
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Clear photos dramatically increase algorithm matching accuracy
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <X className="w-4 h-4 flex-shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}