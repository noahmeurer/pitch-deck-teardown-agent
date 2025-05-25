'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LeftColumn } from '@/components/left-column/LeftColumn';
import { RightColumn } from '@/components/right-column/RightColumn';
import { UploadModal } from '@/components/upload/UploadModal';

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(true);
  const [hasPDF, setHasPDF] = useState(false);

  // TODO: This will be implemented later when we handle file uploads
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();

    formData.append('file', file);
      
    try {
      const response = await fetch

    } catch (err) {

    } finally {
      setHasPDF(true);
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
