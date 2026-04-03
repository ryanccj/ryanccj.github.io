export interface GalleryAlbum {
  slug: string
  name: string
  description?: string
}

export interface GalleryPhoto {
  id: string
  src: string
  title: string
  description?: string
  date?: string
  location?: string
  album: GalleryAlbum['slug']
  width: number
  height: number
  placeholderColor?: string
}

export const galleryAlbums: GalleryAlbum[] = [
  {
    slug: 'ridges-and-trails',
    name: 'Ridges & Trails',
    description: 'Long views, sharp weather, and the quiet rhythm of moving uphill.',
  },
  {
    slug: 'water-and-stone',
    name: 'Water & Stone',
    description: 'Coastlines, canyons, and the colder blue side of outdoor days.',
  },
]

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: '20180702-mount-nanhu',
    src: '/static/gallery/2018/20180702-mount-nanhu.jpg',
    title: 'Mount Nanhu',
    description: 'The junction towards Mt. Nanhu East Peak (2018). \nNikon D850, 60mm, F5.6, 1/400s',
    album: 'ridges-and-trails',
    width: 2048,
    height: 1365,
    placeholderColor: '#7d8c93',
  },
  {
    id: '20171201-alishan-abandoned-railway',
    src: '/static/gallery/2017/20171201-alishan-abandoned-railway.jpg',
    title: 'Alishan Abandoned Railway',
    description: 'Lush greenery along the abandoned Mianyue Line of the Alishan Railway (2017). \nNikon D810, 42mm, F5.6, 1/125s',
    album: 'ridges-and-trails',
    width: 2048,
    height: 1367,
    placeholderColor: '#7d8c93',
  },
  {
    id: '20170908-sea-view-tower',
    src: '/static/gallery/2017/20170908-sea-view-tower.jpg',
    title: 'Sea View Tower',
    description: 'Sunset practice at Sea View Tower (2017). \nNikon D810, 24mm, F16, 10s',
    album: 'water-and-stone',
    width: 2048,
    height: 1367,
    placeholderColor: '#7d8c93',
  },
]
