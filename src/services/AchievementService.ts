import { 
    listUserAchievements
} from "../repositories/AchievementsRepository";
import { LIST_ENTITY_ERROR } from "../utils/consts";

export async function listByUserService(userId: number) {
    try {
        const data = await listUserAchievements(userId);

        return { success: true, statusCode: 200, data };
    } catch (error) {
        return { success: false, statusCode: 500, error: `${LIST_ENTITY_ERROR}:${error}` };
    }
}