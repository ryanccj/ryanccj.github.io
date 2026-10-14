import GalleryGrid from '@/components/gallery/GalleryGrid'
import { galleryAlbums, galleryPhotos } from '@/data/galleryData'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Gallery',
  description: 'Outdoor photographs from trails, cliffs, water, and winter light.',
})

export default function GalleryPage() {
  return (
    <div>
      <div className="pb-6 pt-6 lg:p-0">
        <h1 className="text-2xl font-extrabold leading-8 tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl sm:leading-9 lg:sr-only">
          Gallery
        </h1>
      </div>
      <div className="py-10">
        <GalleryGrid albums={galleryAlbums} photos={galleryPhotos} />
      </div>
    </div>
  )
}
