import { TwitchResponse } from './../interfaces/Twitch';
import { getLatestTwitchToken, createTwitchToken } from '../repositories/AccessRepository';
import { getTwitchAccessToken } from '../igdb/Twitch';

export async function getTwitchAccessTokenOrFetch(): Promise<TwitchResponse> {
  try {
    const latestToken = await getLatestTwitchToken();

    // Se o token não existir ou estiver expirado
    if (!latestToken || (latestToken.created_at.getTime() / 1000) + latestToken.expires_in <= Math.floor(Date.now() / 1000)) {
        // Requisitar um novo token para a Twitch
        const twitchTokenResponse = await getTwitchAccessToken();

        // Armazenar o novo token na tabela
        await createTwitchToken(
        twitchTokenResponse.access_token,
        twitchTokenResponse.expires_in,
        new Date() 
        );

        return twitchTokenResponse;
    } else {
      // Se o token existir e não estiver expirado, retorná-lo como resposta
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