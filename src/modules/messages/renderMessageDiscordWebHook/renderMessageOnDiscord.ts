import getGifs from '../fetchGifs/getGifs'
import axios from 'axios'

const { DISCORD_WEBHOOK_URL } = process.env

// Retrieves data coming from POST (some learner has completed sprint) AND RECEIVES getGifs() function which fetches and retrieves gifs from GIPHY API
// Merges User data (user name, sprint title, congrats message) + gif
//  Sends them to Discord Chat
export default async (
  userName: string,
  sprintTitle: string,
  congratsMessage: string
) => {
  // Fetches gifs from GIPHY API
  const gifUrl = await getGifs()
  await axios.post(DISCORD_WEBHOOK_URL as string, {
    content: `@${userName} has just completed ${sprintTitle} 
${congratsMessage}`,

    embeds: [
      {
        image: {
          url: gifUrl,
        },
      },
    ],
  })
}
