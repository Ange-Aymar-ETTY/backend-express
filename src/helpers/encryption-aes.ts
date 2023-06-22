import { CONFIG } from "../config";
import CryptoJS from "crypto-js";

export class EncryptionAES {

    static encrypt(data) {
        try {
            return CryptoJS.AES.encrypt(JSON.stringify(data), CONFIG.TOKEN_AES).toString();
        } catch (e) {
            console.log(e);
        }
    }

    static decrypt(data) {
        const bytes = CryptoJS.AES.decrypt(data, CONFIG.TOKEN_AES);
        try {
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        } catch (e) {
            return bytes.toString(CryptoJS.enc.Utf8);
        }
    }
}