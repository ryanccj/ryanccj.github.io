export const POSTS_PER_PAGE = 5

export function getListPagination(totalPosts: number, routePage: number, twoColumns: boolean) {
  // Static URLs address five-post batches. Pair adjacent batches on wide screens so
  // existing links retain their posts when the viewport changes.
  const pagesPerView = twoColumns ? 2 : 1
  const routePages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE))
  const safeRoutePage = Math.min(
    routePages,
    Math.max(1, Number.isInteger(routePage) ? routePage : 1)
  )
  const currentPage = Math.ceil(safeRoutePage / pagesPerView)
  const totalPages = Math.ceil(routePages / pagesPerView)
  const firstRoutePage = (currentPage - 1) * pagesPerView + 1
  const startIndex = (firstRoutePage - 1) * POSTS_PER_PAGE

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex: Math.min(totalPosts, startIndex + POSTS_PER_PAGE * pagesPerView),
    previousPage: currentPage > 1 ? firstRoutePage - pagesPerView : undefined,
    nextPage: currentPage < totalPages ? firstRoutePage + pagesPerView : undefined,
  }
}
