'use client'

import { useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate.js'
import { CoreContent } from 'pliny/utils/contentlayer.js'
import type { Blog, Paper } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import defaultTagData from 'app/tag-data.json'
import { getListPagination } from './listPagination'

const TWO_COLUMN_QUERY = '(min-width: 2560px)'

function subscribeToColumns(onChange: () => void) {
  const media = window.matchMedia(TWO_COLUMN_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function getTwoColumnSnapshot() {
  return window.matchMedia(TWO_COLUMN_QUERY).matches
}

function getServerSnapshot() {
  return false
}

interface PaginationProps {
  totalPages: number
  currentPage: number
  previousPage?: number
  nextPage?: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog | Paper>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog | Paper>[]
  pagination?: PaginationProps
  listPath?: string
  listLabel?: string
  tagCounts?: Record<string, number>
  tagBasePath?: string
}

function Pagination({ totalPages, currentPage, previousPage, nextPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const hasPrevious = previousPage !== undefined
  const hasNext = nextPage !== undefined

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between" aria-label="Pagination">
        {!hasPrevious && (
          <button className="cursor-auto disabled:opacity-50" disabled>
            Previous
          </button>
        )}
        {hasPrevious && (
          <Link
            href={previousPage === 1 ? `/${basePath}/` : `/${basePath}/page/${previousPage}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span aria-live="polite">
          {currentPage} of {totalPages}
        </span>
        {!hasNext && (
          <button className="cursor-auto disabled:opacity-50" disabled>
            Next
          </button>
        )}
        {hasNext && (
          <Link href={`/${basePath}/page/${nextPage}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  listPath = '/blog',
  listLabel = 'All Posts',
  tagCounts = defaultTagData as Record<string, number>,
  tagBasePath = '/tags',
}: ListLayoutProps) {
  const pathname = usePathname()
  const twoColumns = useSyncExternalStore(
    subscribeToColumns,
    getTwoColumnSnapshot,
    getServerSnapshot
  )
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const isListPage =
    pathname === listPath || pathname === `${listPath}/` || pathname.startsWith(`${listPath}/page/`)

  const responsivePagination = pagination
    ? getListPagination(posts.length, pagination.currentPage, twoColumns)
    : undefined
  const displayPosts = responsivePagination
    ? posts.slice(responsivePagination.startIndex, responsivePagination.endIndex)
    : initialDisplayPosts.length > 0
      ? initialDisplayPosts
      : posts

  return (
    <>
      <div>
        <div className="pb-6 pt-6">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 lg:hidden">
            {title}
          </h1>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="hidden max-h-screen w-[280px] flex-wrap self-start overflow-auto rounded bg-gray-50 pt-5 shadow-md dark:bg-gray-900/70 dark:shadow-gray-800/40 lg:flex">
            <div className="px-6 py-4">
              {isListPage ? (
                <h3 className="font-bold uppercase text-primary-500">{listLabel}</h3>
              ) : (
                <Link
                  href={listPath}
                  className="font-bold uppercase text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                >
                  {listLabel}
                </Link>
              )}
              <ul>
                {sortedTags.map((t) => {
                  const tagSlug = slug(t)
                  const tagPath = `${tagBasePath}/${tagSlug}`

                  return (
                    <li key={t} className="my-3">
                      {pathname === tagPath || pathname === `${tagPath}/` ? (
                        <h3 className="inline px-3 py-2 text-sm font-bold uppercase text-primary-500">
                          {`${t} (${tagCounts[t]})`}
                        </h3>
                      ) : (
                        <Link
                          href={tagPath}
                          className="px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} (${tagCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="min-w-0">
            <ul className="grid grid-cols-1 gap-x-8 min-[2560px]:grid-cols-2">
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags } = post
                return (
                  <li key={path} className="min-w-0 py-5">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                        </dd>
                      </dl>
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl font-bold leading-8 tracking-tight">
                            <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                              {title}
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags?.map((tag) => (
                              <Tag key={tag} text={tag} pathPrefix={tagBasePath} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {responsivePagination && responsivePagination.totalPages > 1 && (
              <Pagination
                currentPage={responsivePagination.currentPage}
                totalPages={responsivePagination.totalPages}
                previousPage={responsivePagination.previousPage}
                nextPage={responsivePagination.nextPage}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
