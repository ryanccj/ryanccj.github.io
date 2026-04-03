import GalleryGrid from '@/components/gallery/GalleryGrid'
import { galleryAlbums, galleryPhotos } from '@/data/galleryData'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Gallery',
  description: 'Outdoor photographs from trails, cliffs, water, and winter light.',
})

export default function GalleryPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-3 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Gallery
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-gray-500 dark:text-gray-400">
          Photographs from trails, cliffs, water, and the quieter moments in between.
        </p>
      </div>
      <div className="py-10">
        <GalleryGrid albums={galleryAlbums} photos={galleryPhotos} />
      </div>
    </div>
  )
}
