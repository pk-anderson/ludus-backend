import { TwitchResponse } from './../interfaces/Twitch';
import * as dotenv from 'dotenv';
import { ENV_VARIABLE_NOT_CONFIGURED } from '../utils/consts';
dotenv.config();


export async function getTwitchAccessToken(): Promise<TwitchResponse> {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  
    if (!clientId || !clientSecret) {
      throw new Error(ENV_VARIABLE_NOT_CONFIGURED);
    }
  
    try {
      const response = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, {
        method: 'POST',
      });
  
      if (response.ok) {
        const data: TwitchResponse = await response.json();
        return data;
      } else {
        throw new Error(`${response.statusText}`);
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }