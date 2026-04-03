import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'
import { allPapers } from 'contentlayer/generated'
import paperTagData from 'app/paper-tag-data.json'

const POSTS_PER_PAGE = 5

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(allPapers.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default async function PapersPaginationPage({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const { page } = await params
  const posts = allCoreContent(sortPosts(allPapers))
  const pageNumber = parseInt(page)
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
