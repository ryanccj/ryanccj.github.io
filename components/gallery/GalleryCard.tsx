import Image from 'next/image'
import { GalleryPhoto } from '@/data/galleryData'

interface GalleryCardProps {
  photo: GalleryPhoto
  onClick: () => void
  transitionState?: 'idle' | 'fading-out' | 'fading-in'
}

export default function GalleryCard({
  photo,
  onClick,
  transitionState = 'idle',
}: GalleryCardProps) {
  const transitionClass =
    transitionState === 'fading-out'
      ? 'gallery-card-filter-out'
      : transitionState === 'fading-in'
        ? 'gallery-card-filter-in'
        : ''

  return (
    <div className={`gallery-masonry-item ${transitionClass}`}>
      <button
        type="button"
        onClick={onClick}
        className="gallery-card-shell group w-full text-left"
        aria-label={`Open photo ${photo.title}`}
      >
        <div
          className="relative overflow-hidden rounded-[1.75rem]"
          style={{ backgroundColor: photo.placeholderColor || '#d4d4d4' }}
        >
          <Image
            src={photo.src}
            alt={photo.description || photo.title}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            loading="lazy"
            className="gallery-card-image h-auto w-full object-cover"
          />
          <div className="gallery-card-overlay">
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">{photo.title}</p>
              {photo.location ? (
                <p className="mt-1 text-sm text-white/80 transition duration-300 group-hover:text-white">
                  {photo.location}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}
