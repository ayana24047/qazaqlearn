
import fs from 'node:fs/promises'
import path from 'node:path'
import { words } from '../src/data/words.js'

const API_KEY = process.env.PIXABAY_API_KEY

if (!API_KEY) {
  throw new Error('PIXABAY_API_KEY is missing in .env')
}

const outputDir = path.resolve('public/images/words')
await fs.mkdir(outputDir, { recursive: true })

const searchTerms = {
  mother: 'mother child',
  father: 'father child',
  brother: 'brother',
  sister: 'sister',
  grandfather: 'grandfather',
  grandmother: 'grandmother',
  studying: 'student studying',
  writing: 'person writing',
  walking: 'person walking',
  sleeping: 'person sleeping',
  drinking: 'drinking water',
  eating: 'person eating',
}

const creditsPath = path.join(outputDir, 'pixabay-credits.json')

let credits = []

try {
  credits = JSON.parse(await fs.readFile(creditsPath, 'utf8'))
} catch {
  credits = []
}

const uniqueWords = [
  ...new Map(words.map(word => [word.image, word])).values()
]

for (const word of uniqueWords) {
  const filename = path.basename(word.image)
  const filepath = path.join(outputDir, filename)

  // Download a fresh candidate into a separate folder,
  // without overwriting the existing image.
  const candidateDir = path.resolve(
    'public/images/pixabay-candidates'
  )

  await fs.mkdir(candidateDir, { recursive: true })

  const candidatePath = path.join(candidateDir, filename)

  try {
    await fs.access(candidatePath)
    console.log(`SKIPPED: ${filename}`)
    continue
  } catch {
    // Candidate not downloaded yet
  }

  const query = searchTerms[word.imageSearch] ??
    word.imageSearch ??
    word.english

  try {
    const params = new URLSearchParams({
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: '5',
    })

    const response = await fetch(
      `https://pixabay.com/api/?${params}`
    )

    if (response.status === 429) {
      console.log('Rate limit reached. Stopping.')
      break
    }

    if (!response.ok) {
      throw new Error(`Pixabay API error: ${response.status}`)
    }

    const data = await response.json()
    const photo = data.hits?.[0]

    if (!photo) {
      console.log(`NOT FOUND: ${filename}`)
      continue
    }

    const imageUrl = photo.webformatURL
    const imageResponse = await fetch(imageUrl)

    if (!imageResponse.ok) {
      throw new Error(
        `Image download error: ${imageResponse.status}`
      )
    }

    const imageBuffer = Buffer.from(
      await imageResponse.arrayBuffer()
    )

    await fs.writeFile(candidatePath, imageBuffer)

    credits.push({
      word: word.english,
      filename,
      photographer: photo.user,
      source: photo.pageURL,
      imageId: photo.id,
    })

    console.log(`DOWNLOADED: ${filename}`)
  } catch (error) {
    console.log(`FAILED: ${filename} - ${error.message}`)
  }

  await new Promise(resolve => setTimeout(resolve, 1500))
}

await fs.writeFile(
  creditsPath,
  JSON.stringify(credits, null, 2)
)

console.log('Finished downloading candidate photos.')
