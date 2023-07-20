import bcrypt from 'bcryptjs';

export async function encryptPassword(password: string): Promise<string> {
  try {
    // Gerando o salt (custo 10 é o padrão)
    const salt = await bcrypt.genSalt(10);

    // Gerando o hash da senha com o salt
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    throw new Error(`Erro ao criptografar a senha: ${error}`);
  }
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    if (!hashedPassword) {
      // Caso a senha criptografada seja undefined, retornar false
      return false;
    }
    // Comparando a senha com o hash armazenado
    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch;
  } catch (error) {
    console.error('Erro ao comparar as senhas:', error);
    throw new Error(`Erro ao comparar as senhas: ${error}`);
  }
}
