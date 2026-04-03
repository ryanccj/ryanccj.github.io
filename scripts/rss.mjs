import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import { escape } from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
import { sortPosts } from 'pliny/utils/contentlayer.js'

const tagData = JSON.parse(readFileSync(new URL('../app/tag-data.json', import.meta.url), 'utf8'))
const blogTagData = JSON.parse(
  readFileSync(new URL('../app/blog-tag-data.json', import.meta.url), 'utf8')
)
const paperTagData = JSON.parse(
  readFileSync(new URL('../app/paper-tag-data.json', import.meta.url), 'utf8')
)
const allBlogs = JSON.parse(
  readFileSync(new URL('../.contentlayer/generated/Blog/_index.json', import.meta.url), 'utf8')
)
const allPapers = JSON.parse(
  readFileSync(new URL('../.contentlayer/generated/Paper/_index.json', import.meta.url), 'utf8')
)

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/${post.path}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/${post.path}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (config, posts, page = 'feed.xml', channelPath = 'blog') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/${channelPath}</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

async function generateRSS(config, allPosts, page = 'feed.xml') {
  const publishPosts = allPosts.filter((post) => post.draft !== true)
  // RSS for blog post
  if (publishPosts.length > 0) {
    const rss = generateRss(config, sortPosts(publishPosts), page)
    writeFileSync(`./public/${page}`, rss)
  }

  if (publishPosts.length > 0) {
    writeTagFeeds(config, publishPosts, tagData, 'tags', page)
  }
}

function writeTagFeeds(config, posts, tagCounts, baseDir, page = 'feed.xml') {
  for (const tag of Object.keys(tagCounts)) {
    const filteredPosts = sortPosts(
      posts.filter((post) => post.tags?.map((t) => slug(t)).includes(tag))
    )
    if (filteredPosts.length === 0) {
      continue
    }

    const rss = generateRss(config, filteredPosts, `${baseDir}/${tag}/${page}`, `${baseDir}/${tag}`)
    const rssPath = path.join('public', ...baseDir.split('/'), tag)
    mkdirSync(rssPath, { recursive: true })
    writeFileSync(path.join(rssPath, page), rss)
  }
}

const rss = () => {
  const publishBlogs = allBlogs.filter((post) => post.draft !== true)
  const publishPapers = allPapers.filter((post) => post.draft !== true)

  generateRSS(siteMetadata, [...publishBlogs, ...publishPapers])
  writeTagFeeds(siteMetadata, publishBlogs, blogTagData, 'blog/tags')
  writeTagFeeds(siteMetadata, publishPapers, paperTagData, 'papers/tags')
  console.log('RSS feed generated...')
}
export default rss
