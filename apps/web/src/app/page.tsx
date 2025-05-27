'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LeftColumn } from '@/components/left-column/LeftColumn';
import { RightColumn } from '@/components/right-column/RightColumn';
import { UploadModal } from '@/components/upload/UploadModal';
import { config } from '@/config/env';
import { useDocumentContext } from '@/context/DocumentContext';

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(true);
  const [hasPDF, setHasPDF] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { setDocumentUrl } = useDocumentContext();

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);
      
    try {
      console.log('performing upload request');
      const response = await fetch(`${config.backendUrl}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setHasPDF(true);
        setIsUploadModalOpen(false);
        console.log(data.data.fullPath);
        setDocumentUrl(`${config.supabaseUrl}/storage/v1/object/public/${data.data.fullPath}`);
      } else {
        throw new Error(data.error || 'Upload failed');
      }

    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload file');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  if (!hasPDF) {
    return (
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
        }}
        onFileUpload={handleFileUpload}
        isUploading={isUploading}
        error={uploadError}
      />
    );
  }

  return (
    <MainLayout
      leftColumn={<LeftColumn />}
      rightColumn={<RightColumn />}
    />
  );
}
