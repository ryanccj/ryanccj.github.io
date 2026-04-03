'use client'

import { useEffect, useEffectEvent, useRef, useState } from 'react'
import Image from 'next/image'
import { GalleryPhoto } from '@/data/galleryData'

interface PhotoLightboxProps {
  photos: GalleryPhoto[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onSelect: (index: number) => void
}

const closeAnimationMs = 180
const slideAnimationMs = 260
const swipeThreshold = 50

function formatDate(date?: string) {
  if (!date) {
    return null
  }

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(parsed)
}

export default function PhotoLightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onSelect,
}: PhotoLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const slideTimerRef = useRef<number | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [slideDirection, setSlideDirection] = useState<-1 | 0 | 1>(0)

  const photo = photos[currentIndex]
  const photoCount = photos.length
  const formattedDate = formatDate(photo?.date)

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const clearSlideTimer = () => {
    if (slideTimerRef.current !== null) {
      window.clearTimeout(slideTimerRef.current)
      slideTimerRef.current = null
    }
  }

  const requestClose = useEffectEvent(() => {
    if (!isOpen || isClosing) {
      return
    }

    clearCloseTimer()
    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, closeAnimationMs)
  })

  const moveTo = useEffectEvent((direction: -1 | 1) => {
    if (photoCount < 2) {
      return
    }

    const nextIndex = (currentIndex + direction + photoCount) % photoCount
    clearSlideTimer()
    setSlideDirection(direction)
    onSelect(nextIndex)
    slideTimerRef.current = window.setTimeout(() => setSlideDirection(0), slideAnimationMs)
  })

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (isOpen && photo) {
      if (!dialog.open) {
        previousFocusRef.current = document.activeElement as HTMLElement | null
        dialog.showModal()
      }

      requestAnimationFrame(() => {
        closeButtonRef.current?.focus()
      })
      return
    }

    if (dialog.open) {
      dialog.close()
    }

    previousFocusRef.current?.focus()
  }, [isOpen, photo])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (!isOpen || !dialogRef.current) {
      return
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveTo(1)
      return
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveTo(-1)
      return
    }

    if (event.key !== 'Tab') {
      return
    }

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => element.offsetParent !== null)

    if (focusable.length === 0) {
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const activeElement = document.activeElement as HTMLElement | null

    if (event.shiftKey && (activeElement === first || !dialogRef.current.contains(activeElement))) {
      event.preventDefault()
      last.focus()
      return
    }

    if (!event.shiftKey && (activeElement === last || !dialogRef.current.contains(activeElement))) {
      event.preventDefault()
      first.focus()
    }
  })

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const listener = (event: KeyboardEvent) => handleKeyDown(event)
    document.addEventListener('keydown', listener)

    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [isOpen])

  useEffect(() => {
    return () => {
      clearCloseTimer()
      clearSlideTimer()
    }
  }, [])

  if (!photo) {
    return null
  }

  return (
    <dialog
      ref={dialogRef}
      className="gallery-lightbox"
      aria-label={`${photo.title}, ${currentIndex + 1} of ${photoCount}`}
      onCancel={(event) => {
        event.preventDefault()
        requestClose()
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          requestClose()
        }
      }}
    >
      <div
        className={`gallery-lightbox-panel ${isClosing ? 'gallery-lightbox-panel-closing' : ''}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              Photo Viewer
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {currentIndex + 1} / {photoCount}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => requestClose()}
            className="gallery-lightbox-icon"
            aria-label="Close photo viewer"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="relative mt-6 flex min-h-[50vh] items-center justify-center">
          <button
            type="button"
            onClick={() => moveTo(-1)}
            className="gallery-lightbox-nav left-3 md:left-6"
            aria-label="View previous photo"
          >
            <span aria-hidden="true">‹</span>
          </button>

          <div
            className="w-full px-12 md:px-20"
            onTouchStart={(event) => {
              touchStartXRef.current = event.touches[0]?.clientX ?? null
            }}
            onTouchEnd={(event) => {
              const touchEndX = event.changedTouches[0]?.clientX
              const touchStartX = touchStartXRef.current

              touchStartXRef.current = null

              if (touchStartX === null || typeof touchEndX !== 'number') {
                return
              }

              const deltaX = touchEndX - touchStartX
              if (Math.abs(deltaX) < swipeThreshold) {
                return
              }

              moveTo(deltaX < 0 ? 1 : -1)
            }}
          >
            <div key={photo.id} data-direction={slideDirection} className="gallery-lightbox-media">
              <Image
                src={photo.src}
                alt={photo.description || photo.title}
                width={photo.width}
                height={photo.height}
                priority
                sizes="100vw"
                className="mx-auto max-h-[68vh] w-auto rounded-[1.75rem] object-contain shadow-2xl shadow-black/30"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => moveTo(1)}
            className="gallery-lightbox-nav right-3 md:right-6"
            aria-label="View next photo"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <div className="mt-6 grid gap-6 border-t border-gray-200/80 pt-6 dark:border-gray-800/80 md:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-50">
              {photo.title}
            </h2>
            {photo.description ? (
              <p className="max-w-2xl whitespace-pre-line text-sm leading-7 text-gray-600 dark:text-gray-300">
                {photo.description}
              </p>
            ) : null}
          </div>
          <dl className="grid gap-3 text-sm text-gray-600 dark:text-gray-300">
            {formattedDate ? (
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Date
                </dt>
                <dd className="mt-1">{formattedDate}</dd>
              </div>
            ) : null}
            {photo.location ? (
              <div>
                <dt className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  Location
                </dt>
                <dd className="mt-1">{photo.location}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                Album
              </dt>
              <dd className="mt-1">
                {photo.album
                  .split('-')
                  .map((part) => part[0].toUpperCase() + part.slice(1))
                  .join(' ')}
              </dd>
            </div>
          </dl>
        </div>

        <p className="sr-only" aria-live="polite">
          Viewing {photo.title}, photo {currentIndex + 1} of {photoCount}
        </p>
      </div>
    </dialog>
  )
}
