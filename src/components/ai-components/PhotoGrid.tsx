"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Photo {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface PhotoGridProps {
  photos: Photo[];
  translations: any;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, translations }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(!photos);
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState<number[]>([]);
  const photosPerPage = 9;

  useEffect(() => {
    setIsLoading(!photos);
    if (photos) {
      setDisplayedPhotos(photos.slice(0, photosPerPage));
    }
  }, [photos]);

  useEffect(() => {
    console.log('translations : ', translations);
  }, []);

  const loadMore = async () => {
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * photosPerPage;
    const endIndex = startIndex + photosPerPage;
    
    const newPhotosIndexes = Array.from({ length: photosPerPage }, (_, i) => startIndex + i);
    setLoadingPhotos(newPhotosIndexes);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setDisplayedPhotos([...displayedPhotos, ...photos.slice(startIndex, endIndex)]);
    setCurrentPage(nextPage);
    setIsLoadingMore(false);
    setLoadingPhotos([]);
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 grid grid-cols-3 gap-2">
        {[...Array(9)].map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-sm" />
        ))}
      </div>
    );
  }

  const renderPhotoOrSkeleton = (photo: Photo, index: number) => {
    if (loadingPhotos.includes(index)) {
      return (
        <Skeleton 
          key={index}
          className="aspect-square w-full rounded-sm"
        />
      );
    }

    return (
      <div 
        key={index}
        className="relative aspect-square overflow-hidden rounded-sm cursor-pointer"
        onClick={() => setSelectedPhoto(photo)}
      >
        <Image
          src={photo.url}
          alt={photo.alt}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
          sizes="(max-width: 768px) 33vw, 33vw"
        />
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-2">
        {displayedPhotos.map((photo, index) => renderPhotoOrSkeleton(photo, index))}
      </div>

      {isLoadingMore && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[...Array(9)].map((_, i) => (        
            <Skeleton key={i} className="aspect-square w-full rounded-sm" />
          ))}
        </div>
      )}

      {photos.length > displayedPhotos.length && (
        <div className="w-full flex justify-center mt-4">
          <Badge 
            onClick={loadMore}
            variant="outline"
            className="px-6 font-doto cursor-pointer rounded-full dark:bg-white/10 bg-black/10 dark:text-white border-none"
          >
            {isLoadingMore ? translations.loading.loading : translations.loading.loadMore}
          </Badge>
        </div>
      )}

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full p-0 overflow-hidden bg-transparent border-0">
          <DialogTitle className="sr-only">
            Photo View
          </DialogTitle>
          {selectedPhoto && (
            <div className="relative w-full h-full min-h-[50vh]">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoGrid;