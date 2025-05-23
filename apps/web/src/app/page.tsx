'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LeftColumn } from '@/components/left-column/LeftColumn';
import { RightColumn } from '@/components/right-column/RightColumn';
import { UploadModal } from '@/components/upload/UploadModal';

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(true);
  const [hasPDF, setHasPDF] = useState(false);

  // This will be implemented later when we handle file uploads
  const handleFileUpload = () => {
    setIsUploadModalOpen(false);
    setHasPDF(true);
  };

  if (!hasPDF) {
    return (
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setHasPDF(true); // TODO: Remove close button functionality once PDF upload is implemented
        }}
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
