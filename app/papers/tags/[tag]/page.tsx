import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allPapers } from 'contentlayer/generated'
import paperTagData from 'app/paper-tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag: tagParam } = await params
  const tag = decodeURI(tagParam)
  return genPageMetadata({
    title: tag,
    description: `${siteMetadata.title} ${tag} tagged papers`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/papers/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = paperTagData as Record<string, number>

  return Object.keys(tagCounts).map((tag) => ({
    tag: encodeURI(tag),
  }))
}

export default async function PaperTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: tagParam } = await params
  const tag = decodeURI(tagParam)
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(allPapers.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )

  return (
    <ListLayout
      posts={filteredPosts}
      title={title}
      listPath="/papers"
      listLabel="All Papers"
      tagCounts={paperTagData as Record<string, number>}
      tagBasePath="/papers/tags"
    />
  )
}
