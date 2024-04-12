import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
require('dotenv').config();
import * as request from 'request';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class encryptionService {
  async encryptData(text: any,key=process.env.DB_ENCRYPTION_KEY): Promise<string> {
    if(text===undefined||text===null){
      return null
    }
    const IV_LENGTH = 16;
    const textString = text.toString();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(textString, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + encrypted;
  }

  async decryptData(encryptedText: any,key=process.env.DB_ENCRYPTION_KEY): Promise<string> {
    if(encryptedText===null){
      return null
    }
    const IV_LENGTH = 16;
    const iv = Buffer.from(encryptedText.slice(0, IV_LENGTH * 2), 'hex');
    const encrypted = encryptedText.slice(IV_LENGTH * 2);
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

// Replace these with your actual values
async randomString(): Promise<string> {
  const randomUuid = uuidv4();
  const formattedUuid: string = randomUuid.replace(/-/g, '').substring(0, 32);
  return formattedUuid;
}



async getTimestamp(): Promise<number> {
    return Math.floor(Date.now());
}

async generateSignature(secret: string, toHashing: string): Promise<string> {
    const hmac = crypto.createHmac('sha512', secret);
    hmac.update(toHashing);
    return hmac.digest('hex').toUpperCase();
}

async binancePublicKey(api_key, secret_key): Promise<string> {
  const timestamp = await this.getTimestamp();
  const nonce = await this.randomString();
  const payload = '';
  const payload_to_sign = `${timestamp}\n${nonce}\n${payload}\n`;
  const signature = await this.generateSignature(secret_key, payload_to_sign);

  const headers = {
      "Content-Type": "application/json;charset=utf-8",
      "User-Agent": "binance-pay-connector/1.0.0",
      "BinancePay-Timestamp": String(timestamp),
      "BinancePay-Nonce": nonce,
      "BinancePay-Certificate-SN": api_key,
      "BinancePay-Signature": signature,
  };

  return new Promise<string>((resolve, reject) => {
      request.post({
          url: "https://bpay.binanceapi.com/binancepay/openapi/certificates",
          headers: headers
      }, (error, response, body) => {
          if (!error && response.statusCode == 200) {
              const data = JSON.parse(body);
              const cert_public = data['data'][0]['certPublic'];
              resolve(cert_public); // Resolve the promise with the certificate public key
          } else {
              resolve(''); // Resolve with empty string on error
          }
      });
  });
}
}

export default encryptionService;


