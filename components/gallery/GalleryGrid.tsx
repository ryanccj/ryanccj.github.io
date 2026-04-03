'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { GalleryAlbum, GalleryPhoto } from '@/data/galleryData'
import GalleryCard from './GalleryCard'
import PhotoLightbox from './PhotoLightbox'

interface GalleryGridProps {
  albums: GalleryAlbum[]
  photos: GalleryPhoto[]
}

type FilterState = 'idle' | 'fading-out' | 'fading-in'

export default function GalleryGrid({ albums, photos }: GalleryGridProps) {
  const [activeAlbum, setActiveAlbum] = useState('all')
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null)
  const [filterState, setFilterState] = useState<FilterState>('idle')
  const [, startTransition] = useTransition()
  const timeoutsRef = useRef<number[]>([])

  const filteredPhotos =
    activeAlbum === 'all' ? photos : photos.filter((photo) => photo.album === activeAlbum)

  const selectedIndex = selectedPhotoId
    ? filteredPhotos.findIndex((photo) => photo.id === selectedPhotoId)
    : -1

  const activeAlbumMeta = albums.find((album) => album.slug === activeAlbum)

  const clearTimers = () => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    timeoutsRef.current = []
  }

  const queueTimer = (callback: () => void, delay: number) => {
    const timeoutId = window.setTimeout(callback, delay)
    timeoutsRef.current.push(timeoutId)
  }

  const handleFilterChange = (nextAlbum: string) => {
    if (nextAlbum === activeAlbum) {
      return
    }

    clearTimers()
    setFilterState('fading-out')

    queueTimer(() => {
      startTransition(() => {
        setActiveAlbum(nextAlbum)
        setSelectedPhotoId((currentPhotoId) => {
          if (!currentPhotoId) {
            return null
          }

          const nextPhotos =
            nextAlbum === 'all' ? photos : photos.filter((photo) => photo.album === nextAlbum)

          return nextPhotos.some((photo) => photo.id === currentPhotoId) ? currentPhotoId : null
        })
      })
      setFilterState('fading-in')
      queueTimer(() => setFilterState('idle'), 220)
    }, 130)
  }

  useEffect(() => {
    return () => clearTimers()
  }, [])

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleFilterChange('all')}
            className={`gallery-filter-pill ${activeAlbum === 'all' ? 'gallery-filter-pill-active' : ''}`}
            aria-pressed={activeAlbum === 'all'}
          >
            All
          </button>
          {albums.map((album) => (
            <button
              key={album.slug}
              type="button"
              onClick={() => handleFilterChange(album.slug)}
              className={`gallery-filter-pill ${activeAlbum === album.slug ? 'gallery-filter-pill-active' : ''}`}
              aria-pressed={activeAlbum === album.slug}
            >
              {album.name}
            </button>
          ))}
        </div>

        <div className="max-w-2xl">
          <p className="text-sm leading-7 text-gray-500 dark:text-gray-400">
            {activeAlbum === 'all'
              ? 'A small set of outdoor frames arranged by mood rather than chronology.'
              : activeAlbumMeta?.description}
          </p>
        </div>

        <div className="gallery-masonry" aria-live="polite" aria-busy={filterState !== 'idle'}>
          {filteredPhotos.map((photo) => (
            <GalleryCard
              key={photo.id}
              photo={photo}
              onClick={() => setSelectedPhotoId(photo.id)}
              transitionState={filterState}
            />
          ))}
        </div>
      </div>

      <PhotoLightbox
        photos={filteredPhotos}
        currentIndex={selectedIndex >= 0 ? selectedIndex : 0}
        isOpen={selectedIndex >= 0}
        onClose={() => setSelectedPhotoId(null)}
        onSelect={(index) => setSelectedPhotoId(filteredPhotos[index]?.id ?? null)}
      />
    </>
  )
}
