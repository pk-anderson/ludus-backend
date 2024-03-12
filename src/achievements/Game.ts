import { 
    unlockAchievement,
    userAchievementUnlocked
} from "../repositories/AchievementsRepository";

const GAMELIBRARY_ACHIEVEMENT_ID = 2;
const GAMES_REQUIRED_FOR_ACHIEVEMENT = 5;

export async function checkGameLibraryAchievement(userId: number, games: number) {
    try {
        if (games < GAMES_REQUIRED_FOR_ACHIEVEMENT) {
            return; 
        }

        const isUnlocked = await userAchievementUnlocked(userId, GAMELIBRARY_ACHIEVEMENT_ID);

        if (!isUnlocked) {
            await unlockAchievement(userId, GAMELIBRARY_ACHIEVEMENT_ID);
        }
    } catch (error) {
        console.error(`Erro ao verificar o achievement de jogos: ${error}`);
    }
}