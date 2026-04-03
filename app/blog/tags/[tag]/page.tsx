import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import blogTagData from 'app/blog-tag-data.json'
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
    description: `${siteMetadata.title} ${tag} tagged blog posts`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/blog/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = blogTagData as Record<string, number>

  return Object.keys(tagCounts).map((tag) => ({
    tag: encodeURI(tag),
  }))
}

export default async function BlogTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: tagParam } = await params
  const tag = decodeURI(tagParam)
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1)
  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )

  return (
    <ListLayout
      posts={filteredPosts}
      title={title}
      listPath="/blog"
      listLabel="All Posts"
      tagCounts={blogTagData as Record<string, number>}
      tagBasePath="/blog/tags"
    />
  )
}
