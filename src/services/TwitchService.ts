import { TwitchResponse } from './../interfaces/Twitch';
import { getLatestTwitchToken, createTwitchToken } from '../repositories/AccessRepository';
import { getTwitchAccessToken } from '../igdb/Twitch';

export async function getTwitchAccessTokenOrFetch(): Promise<TwitchResponse> {
  try {
    const latestToken = await getLatestTwitchToken();
    if (!latestToken || (latestToken.created_at.getTime() / 1000) + latestToken.expires_in <= Math.floor(Date.now() / 1000)) {
        const twitchTokenResponse = await getTwitchAccessToken();
        await createTwitchToken(
        twitchTokenResponse.access_token,
        twitchTokenResponse.expires_in,
        new Date() 
        );

        return twitchTokenResponse;
    } else {
      const response: TwitchResponse = {
        access_token: latestToken.access_token,
        expires_in: latestToken.expires_in,
        token_type: 'bearer',
      };    
      return response;
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
}