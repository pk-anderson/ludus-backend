import { v4 as uuidv4 } from 'uuid';

export function generateSessionId() {
  const fullUuid = uuidv4();
  const sessionId = fullUuid.replace(/-/g, '').substring(0, 32);

  return sessionId;
}
