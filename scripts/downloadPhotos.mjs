
import fs from 'node:fs/promises'
import path from 'node:path'
import { words } from '../src/data/words.js'

const output = path.resolve('public/images/words')
await fs.mkdir(output, { recursive: true })

const searches = {
  mother: 'mother with child photo',
  father: 'father with child photo',
  brother: 'young man portrait photo',
  sister: 'young woman portrait photo',
  grandfather: 'elderly man portrait photo',
  grandmother: 'elderly woman portrait photo',
  house: 'house exterior photo',
  door: 'wooden door photo',
  window: 'house window photo',
  table: 'wooden table photo',
  chair: 'chair furniture photo',
  bed: 'bed furniture photo',
  mountain: 'mountain landscape photograph',
  river: 'river landscape photograph',
  lake: 'lake landscape photograph',
  tree: 'single tree photograph',
  flower: 'flower photograph',
  sun: 'sun sky photograph',
  bread: 'bread food photograph',
  milk: 'glass of milk photograph',
  apple: 'red apple photograph',
  water: 'glass of water photograph',
  meat: 'meat food photograph',
  egg: 'chicken egg photograph',
  dog: 'dog animal photograph',
  cat: 'cat animal photograph',
  horse: 'horse animal photograph',
  cow: 'cow animal photograph',
  sheep: 'sheep animal photograph',
  bird: 'bird animal photograph',
  red: 'red color object photograph',
  blue: 'blue color object photograph',
  green: 'green color object photograph',
  yellow: 'yellow color object photograph',
  white: 'white color object photograph',
  black: 'black color object photograph',
  one: 'number one numeral',
  two: 'number two numeral',
  three: 'number three numeral',
  four: 'number four numeral',
  five: 'number five numeral',
  six: 'number six numeral',
  dress: 'dress clothing photograph',
  trousers: 'trousers clothing photograph',
  shirt: 'shirt clothing photograph',
  shoes: 'shoes footwear photograph',
  hat: 'hat clothing photograph',
  jacket: 'jacket clothing photograph',
  studying: 'person studying photograph',
  writing: 'person writing photograph',
  walking: 'person walking photograph',
  sleeping: 'person sleeping photograph',
  drinking: 'person drinking water photograph',
  eating: 'person eating photograph',
  vehicle: 'car vehicle photograph',
  bus: 'bus vehicle photograph',
  train: 'train vehicle photograph',
  airplane: 'airplane photograph',
  bicycle: 'bicycle photograph',
  ship: 'ship photograph',
}

const credits = []
const uniqueWords = [...new Map(
  words.map((word) => [word.image, word])
).values()]

async function getPhoto(query) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: '6',
    gsrlimit: '10',
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata',
    iiurlwidth: '900',
  })

  const response = await fetch(
    `https://commons.wikimedia.org/w/api.php?${params}`,
    {
      headers: {
        'User-Agent': 'QazaqLearnStudentProject/1.0 (educational prototype)',
      },
    }
  )

  
if (!response.ok) {
  if (response.status === 429) {
    const retryAfter = response.headers.get('retry-after')

    throw new Error(
      `RATE_LIMITED: Retry-After=${retryAfter ?? 'not provided'}`
    )
  }

  throw new Error(`Search failed: ${response.status}`)
}


  const data = await response.json()

  const pages = Object.values(data.query?.pages ?? {})
    .sort((a, b) => (a.index ?? 99) - (b.index ?? 99))

  for (const page of pages) {
    const info = page.imageinfo?.[0]
    if (!info?.thumburl) continue

    const license =
      info.extmetadata?.LicenseShortName?.value ?? ''

    const allowed =
      /CC BY|CC0|Public domain|PD-|CC-BY/i.test(license)

    if (!allowed) continue

    if (!info.mime?.startsWith('image/')) continue
    if (info.mime === 'image/svg+xml') continue

    return {
      url: info.thumburl,
      source: info.descriptionurl,
      license,
      artist: info.extmetadata?.Artist?.value ?? '',
      title: page.title,
    }
  }

  return null
}

for (const word of uniqueWords) {
  const filename = path.basename(word.image)
  const filepath = path.join(output, filename)


  try {
    await fs.access(filepath)
    console.log(`SKIPPED: ${filename} (already exists)`)
    continue
  } catch {
    // File does not exist; download it.
  }

  try {
    const photo = await getPhoto(
      searches[word.imageSearch] ?? word.english
    )

    if (!photo) {
      console.log(`NOT FOUND: ${filename}`)
      continue
    }

    const response = await fetch(photo.url)

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`)
    }

    const image = Buffer.from(
      await response.arrayBuffer()
    )

    await fs.writeFile(filepath, image)

    credits.push({
      word: word.english,
      file: filename,
      source: photo.source,
      title: photo.title,
      artist: photo.artist,
      license: photo.license,
    })

    console.log(`DOWNLOADED: ${filename}`)
  } catch (error) {
    console.log(`FAILED: ${filename} - ${error.message}`)

    if (error.message.startsWith('RATE_LIMITED')) {
    console.log('Wikimedia rate limit reached. Stopping downloads.')
    break
   }
  }

  await new Promise((resolve) => setTimeout(resolve, 3000))
}

await fs.writeFile(
  path.join(output, 'photo-credits.json'),
  JSON.stringify(credits, null, 2)
)

console.log('Finished. Review all images before using them.')
