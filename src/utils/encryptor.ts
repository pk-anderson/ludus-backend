import bcrypt from 'bcryptjs';

export async function encryptPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
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
      return false;
    }
    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch;
  } catch (error) {
    console.error('Erro ao comparar as senhas:', error);
    throw new Error(`Erro ao comparar as senhas: ${error}`);
  }
}

export function convertByteaToBase64(bytea: Buffer | null): string | null {
  if (!bytea) {
      return null;
  }
  return `data:image/jpeg;base64,${bytea.toString('base64')}`;
}
