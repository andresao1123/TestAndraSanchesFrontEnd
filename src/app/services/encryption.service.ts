import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private secretKey = environment.secretKey; // Replace with a strong secret key

  encrypt(data: string): string|null{
    const encrypted = CryptoJS.AES.encrypt(data, this.secretKey).toString();
    return encodeURIComponent(encrypted);
  }

  decrypt(encryptedData: string): string|null {
    const decrypted = CryptoJS.AES.decrypt(decodeURIComponent(encryptedData), this.secretKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}