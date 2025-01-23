import { describe, it, expect, afterEach } from 'vitest'
import nock from 'nock'
import getGifs from './getGifs'

describe('getGifs', () => {
  process.env.GIPHY_API = 'FAKE_GIPHY_KEY'

  afterEach(() => {
    nock.cleanAll()
  })

  it('should throw an error if the request fails', async () => {
    nock('https://api.giphy.com')
      .get(/\/v1\/gifs\/search.*/)
      .replyWithError('Network Error')

    await expect(getGifs('celebration')).rejects.toThrow(
      'Failed to fetch GIFs. Please try again later.'
    )
  })

  it('should throw an error if GIPHY_API is missing', async () => {
    const originalKey = process.env.GIPHY_API
    delete process.env.GIPHY_API

    await expect(getGifs('celebration')).rejects.toThrow(
      'Failed to fetch GIFs. Please try again later.'
    )

    process.env.GIPHY_API = originalKey
  })
})
