import  crypto  from 'crypto';

const algorithm = 'aes-256-gcm';
const key = crypto.scryptSync(process.env.ENCRYPTION_SECRET, 'salt', 32); // 256-bit key

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  

  return {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    encryptedData: encrypted
  };
}

function decrypt(hash) {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(hash.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(hash.authTag, 'hex'));
  
  let decrypted = decipher.update(hash.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export default { encrypt, decrypt };
