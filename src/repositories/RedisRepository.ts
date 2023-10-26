import Redis from "ioredis";
import { Game } from "../interfaces/Game";

const redis = new Redis({
    host: "localhost",
    port: 6379, 
  });

export async function getCache(key: string) {
  try { 
      const cacheData = await redis.get(key);
      return cacheData
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function saveCache(key: string, data: string) {
    try { 
        await redis.setex(key, 3600, data)
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
