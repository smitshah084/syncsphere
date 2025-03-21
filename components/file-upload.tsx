"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  // Handle the upload completion with file type awareness
  const handleUploadComplete = (res: any) => {
    if (!res || res.length === 0) return;
    
    const file = res[0];
    const url = file.url;
    const fileName = file.name || "";
    const isPdf = fileName.toLowerCase().endsWith('.pdf');
    
    // For PDFs, add a custom prefix to the URL to identify it later
    // This helps other components know this is a PDF without checking extensions
    if (isPdf) {
      // Store the file as a special format: pdf::url
      onChange(`pdf::${url}`);
    } else {
      // For images, just store the URL directly
      onChange(url);
    }
  };
  
  // Handle rendering based on the stored value
  if (!value) {
    return (
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
        }}
      />
    );
  }
  
  // Check if this is a PDF (by our custom format)
  if (value.startsWith('pdf::')) {
    const pdfUrl = value.replace('pdf::', '');
    const fileName = pdfUrl.split('/').pop() || 'document.pdf';
    
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {fileName}
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  
  // If not a PDF, assume it's an image
  return (
    <div className="relative h-20 w-20">
      <Image
        fill
        src={value}
        alt="Upload"
        className="rounded-full"
      />
      <button
        onClick={() => onChange("")}
        className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};