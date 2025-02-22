import axios from 'axios'

const { GIPHY_API } = process.env

export default async (query: string = 'celebration'): Promise<string> => {
  try {
    const giphyResponse = await axios.get(
      `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API}&q=${query}&limit=50&offset=0&rating=g&lang=en&bundle=messaging_non_clips`
    )

    const gifs = giphyResponse.data.data

    if (!gifs || gifs.length === 0) {
      throw new Error('No GIFS found for the provided query')
    }

    const randomNumber = Math.floor(Math.random() * 51)

    // const gifUrl = gifs[0].images.original.url
    const gifUrl = gifs[randomNumber].images.original.url

    return gifUrl
  } catch (error) {
    console.error('Error fetching GIFs from Giphy:', error)
    throw new Error('Failed to fetch GIFs. Please try again later.')
  }
}
