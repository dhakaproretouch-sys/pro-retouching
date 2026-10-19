import React, { useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Upload,
  FileImage,
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Link as LinkIcon,
  HelpCircle,
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { useServices, useSettings } from '../hooks/usePublic';
import { postFreeTest } from '../lib/publicApi';
import { getApiErrorMessage } from '../lib/api';

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface UploadedFilePreview {
  id: string;
  name: string;
  size: string;
  previewUrl?: string;
  file: File;
}

export const FreeTest: React.FC = () => {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const defaultService = searchParams.get('service') || 'clipping-path';
  const { services } = useServices();
  const { settings } = useSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(defaultService);
  const [cloudLink, setCloudLink] = useState('');
  const [instructions, setInstructions] = useState('');
  const [turnaround, setTurnaround] = useState('12h');
  const [honeypot, setHoneypot] = useState('');
  const [files, setFiles] = useState<UploadedFilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFilePreview[] = [];

    Array.from(fileList).forEach((file) => {
      if (files.length + newFiles.length >= MAX_FILES) {
        showToast({
          title: `Maximum ${MAX_FILES} files for Free Test`,
          message: 'If you have a bigger catalog, include a cloud drive link below.',
          type: 'info',
        });
        return;
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        showToast({
          title: 'Unsupported file format',
          message: `${file.name}: only JPG, PNG, and WebP images are accepted.`,
          type: 'error',
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        showToast({
          title: 'File too large',
          message: `${file.name}: each file must be 5 MB or smaller.`,
          type: 'error',
        });
        return;
      }

      const sizeFormatted =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      newFiles.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: sizeFormatted,
        previewUrl: URL.createObjectURL(file),
        file,
      });
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      showToast({ title: 'Please provide your name and email', type: 'error' });
      return;
    }

    if (files.length === 0) {
      showToast({
        title: 'Please upload at least one sample image',
        message: 'The backend requires uploaded files; a cloud link alone cannot be processed yet.',
        type: 'error',
      });
      return;
    }

    // Honeypot: bots fill hidden fields — pretend success and bail.
    if (honeypot) {
      setSubmittedSuccess(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('whatsapp', phone);
      formData.append('service', service);
      files.forEach((f) => formData.append('files', f.file));
      await postFreeTest(formData);
      setSubmittedSuccess(true);
      showToast({
        title: 'Free Test Request Received!',
        message: 'Our senior retouching team will process your sample images within 12 hours.',
        type: 'success',
      });
    } catch (error) {
      showToast({
        title: 'Could not submit free test',
        message: getApiErrorMessage(
          error,
          'File uploads are temporarily unavailable. Please try again later or contact us on WhatsApp.'
        ),
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/70 via-rose-50/30 to-white py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>100% Free · No Credit Card Required</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0F2A55] tracking-tight">
            Request a Free Sample Test
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Send 2–3 sample images for a free test. Evaluate our hand-drawn clipping paths, ghost mannequin alignment, and retouching with zero commitment.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {submittedSuccess ? (
            <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200 text-center shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-heading font-extrabold text-[#0F2A55]">
                Sample Images Received!
              </h2>
              <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                Thank you, <span className="font-semibold text-slate-900">{name}</span>. Our lead quality analyst has assigned your sample files to a dedicated Photoshop pod. We will deliver the retouched files to{' '}
                <span className="font-semibold text-slate-900">{email}</span> within 12 hours.
              </p>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/70 text-xs text-amber-900 max-w-md mx-auto text-left flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Need urgent response? Ping us directly on WhatsApp with your email address for instant prioritized processing.
                </span>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={`https://wa.me/${(settings.whatsapp || '').replace(/\D/g, '')}?text=Hi%20Pro%20Retouching%2C%20I%20just%20submitted%20a%20free%20test%20under%20${encodeURIComponent(
                    email
                  )}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm rounded-xl shadow-md transition-all"
                >
                  Confirm on WhatsApp
                </a>
                <button
                  onClick={() => {
                    setSubmittedSuccess(false);
                    setFiles([]);
                    setCloudLink('');
                    setInstructions('');
                  }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl transition-all"
                >
                  Submit Another Test
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl space-y-8"
            >
              {/* Honeypot: hidden from humans, bots tend to fill it */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              {/* Step 1: User Info */}
              <div>
                <h3 className="text-lg font-heading font-bold text-[#0F2A55] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0F2A55] text-white text-xs flex items-center justify-center">
                    1
                  </span>
                  <span>Contact Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@brand.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      WhatsApp / Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Service Selection */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-lg font-heading font-bold text-[#0F2A55] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0F2A55] text-white text-xs flex items-center justify-center">
                    2
                  </span>
                  <span>Service & Requirements</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Select Service *
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    >
                      {services.map((srv) => (
                        <option key={srv.slug} value={srv.slug}>
                          {srv.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Preferred Delivery Speed
                    </label>
                    <select
                      value={turnaround}
                      onChange={(e) => setTurnaround(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    >
                      <option value="12h">Express 12 Hours (Standard Free Test)</option>
                      <option value="6h">Priority 6 Hours</option>
                      <option value="24h">Standard 24 Hours</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Editing Instructions / Brand Style Guide
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g. Remove background and set to pure white (#ffffff), add natural soft drop shadow, keep inner neck label, maintain fabric texture..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              {/* Step 3: File Upload */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-heading font-bold text-[#0F2A55] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0F2A55] text-white text-xs flex items-center justify-center">
                      3
                    </span>
                    <span>Upload 2–3 Sample Photos</span>
                  </h3>
                  <span className="text-xs text-amber-600 font-semibold">
                    {files.length} / 3 images uploaded
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Send 2-3 sample images for a free test. Formats supported: JPG, PNG, WebP (up to 5MB each).
                </p>

                {/* Drag & Drop Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-slate-300 hover:border-amber-400 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFilesAdded(e.target.files)}
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click to browse or drag and drop your sample images here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    High-resolution images give the best demonstration of edge precision
                  </p>
                </div>

                {/* Files Preview List */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          {file.previewUrl ? (
                            <img
                              src={file.previewUrl}
                              alt={file.name}
                              className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                              <FileImage className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">
                              {file.name}
                            </p>
                            <p className="text-slate-400">{file.size}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Cloud Link Alternative */}
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Or Provide a Cloud Storage Link (Dropbox / Google Drive / WeTransfer)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/... or https://we.tl/..."
                    value={cloudLink}
                    onChange={(e) => setCloudLink(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Ensure link access permissions are set to "Anyone with the link can view/download".
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Files handled strictly under confidentiality agreement</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-9 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <span>Submitting test...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>Submit Free Test Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
