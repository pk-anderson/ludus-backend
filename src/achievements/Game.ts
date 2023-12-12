import { 
    unlockAchievement,
    userAchievementUnlocked
} from "../repositories/AchievementsRepository";

const GAMELIBRARY_ACHIEVEMENT_ID = 2;
const GAMES_REQUIRED_FOR_ACHIEVEMENT = 5;

export async function checkGameLibraryAchievement(userId: number, games: number) {
    try {
        // Verifica se o usuário atingiu o número de jogos necessário para o achievement
        if (games < GAMES_REQUIRED_FOR_ACHIEVEMENT) {
            return; 
        }

        // Verifica se o achievement já foi desbloqueado para o usuário
        const isUnlocked = await userAchievementUnlocked(userId, GAMELIBRARY_ACHIEVEMENT_ID);

        // Se o achievement não estiver desbloqueado, desbloqueia
        if (!isUnlocked) {
            await unlockAchievement(userId, GAMELIBRARY_ACHIEVEMENT_ID);
        }
    } catch (error) {
        console.error(`Erro ao verificar o achievement de jogos: ${error}`);
    }
}