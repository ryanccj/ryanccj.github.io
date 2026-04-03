import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import { allPapers } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import paperTagData from 'app/paper-tag-data.json'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Papers' })

export default function PapersPage() {
  const posts = allCoreContent(sortPosts(allPapers))
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="Papers"
      listPath="/papers"
      listLabel="All Papers"
      tagCounts={paperTagData as Record<string, number>}
      tagBasePath="/papers/tags"
    />
  )
}
