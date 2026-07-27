import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import os from 'os';

const VAULT_DIR = path.join(os.homedir(), '.synaps');
const VAULT_FILE = path.join(VAULT_DIR, 'vault.enc');

// Machine-specific secret key derived from OS hostname & user info
function getMachineKey(): Buffer {
  const info = `${os.hostname()}-${os.userInfo().username}-synaps-vault-v1`;
  return crypto.createHash('sha256').update(info).digest();
}

export interface KeyringSecrets {
  sessionToken?: string;
  userEmail?: string;
  orgId?: string;
  geminiApiKey?: string;
  openaiApiKey?: string;
  openrouterApiKey?: string;
  ollamaBaseUrl?: string;
}

export function saveSecretVault(secrets: KeyringSecrets): void {
  try {
    if (!fs.existsSync(VAULT_DIR)) {
      fs.mkdirSync(VAULT_DIR, { recursive: true });
    }

    const key = getMachineKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const jsonStr = JSON.stringify(secrets);
    let encrypted = cipher.update(jsonStr, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    const vaultPayload = JSON.stringify({
      iv: iv.toString('hex'),
      encrypted,
      authTag,
      updatedAt: new Date().toISOString()
    });

    fs.writeFileSync(VAULT_FILE, vaultPayload, { encoding: 'utf8', mode: 0o600 });
    console.log('[KEYRING] Encrypted secrets saved securely to OS Vault.');
  } catch (err: any) {
    console.error('[KEYRING] Failed to save encrypted vault:', err.message);
  }
}

export function loadSecretVault(): KeyringSecrets {
  try {
    if (!fs.existsSync(VAULT_FILE)) {
      return {};
    }

    const rawPayload = fs.readFileSync(VAULT_FILE, 'utf8');
    const parsed = JSON.parse(rawPayload);

    const key = getMachineKey();
    const iv = Buffer.from(parsed.iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(Buffer.from(parsed.authTag, 'hex'));

    let decrypted = decipher.update(parsed.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted) as KeyringSecrets;
  } catch (err: any) {
    console.warn('[KEYRING] Vault read warning:', err.message);
    return {};
  }
}

export function clearSecretVault(): void {
  try {
    if (fs.existsSync(VAULT_FILE)) {
      fs.unlinkSync(VAULT_FILE);
      console.log('[KEYRING] OS Vault credentials cleared.');
    }
  } catch (err: any) {
    console.error('[KEYRING] Failed to clear vault:', err.message);
  }
}
