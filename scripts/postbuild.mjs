import rss from './rss.mjs'
import { writeFile } from 'node:fs/promises'

async function postbuild() {
  await rss()
  await writeFile(new URL('../out/.nojekyll', import.meta.url), '')
}

postbuild()
