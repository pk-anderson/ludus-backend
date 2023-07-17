export function isValidEmail(email: string): boolean {
    // Expressão regular para validar o email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    // Teste se o email corresponde ao padrão da expressão regular
    return emailRegex.test(email);
  }
  