import { CONFIG } from '../config';
import { IMailer, ITemplate } from './interfaces';
import { ROLE } from './constantes';
import { PythonShell } from 'python-shell';
import axios from 'axios';
import nodeMailer from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';

export const sendSMS = (Message: string, Tel: string) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                CONFIG.SMS_URL,
                {
                    phone_number: Tel,
                    message: Message
                },
                {
                    headers: {
                        'Content-Type': "application/json",
                        'Authorization': CONFIG.SMS_TOKEN,
                        'Source': CONFIG.SMS_SOURCE
                    }
                }
            )
            .then(res => res.data.error ? reject(res.data) : resolve(res.data))
            .catch(() => reject({ error: true, message: "L'envoi a échoué" }));
    });
}

export const generatePassword = (passwordLength = 8) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#%ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
        const rnum = Math.floor(Math.random() * chars.length);
        password += chars.substring(rnum, rnum + 1);
    }

    return password;
};

export const readHTMLFile = (path, callback) => {
    fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
        if (err) {
            callback(err);
            throw err;
        }
        else {
            callback(null, html);
        }
    });
};

export const sendMail = (mailOptions: IMailer, data: ITemplate, attemps = 0) => {
    return new Promise((resolve, reject) => {
        const transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: { user: CONFIG.EMAIL_FROM, pass: CONFIG.EMAIL_PASSWORD }
        });

        const pathFile = path.resolve(__dirname, '..', 'views/template/', data.source)
        readHTMLFile(pathFile, (err, html) => {
            if (err)
                console.log('Error file mail:', err);

            const template = handlebars.compile(html);
            mailOptions.html = (data.parameter) ? template(data.parameter) : template({});
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    if (attemps < 3) {
                        sendMail(mailOptions, data, attemps++);
                    } else {
                        reject(false);
                    }
                } else {
                    resolve(true);
                }
            });
        });
    });
}

export const splitQuery = (splitValue: any) => {
    if (!(splitValue in ROLE || splitValue == undefined)) {
        return splitValue.toString().replace(/ /g, '').split(',');
    }

    return null;
}

export const execPython = (script: string, args: string[] = []) => {
    return new Promise((resolve, reject) => {
        const options: any = {
            mode: 'json',
            pythonPath: CONFIG.PYTHONPATH,
            pythonOptions: ['-u'],
            scriptPath: path.resolve(__dirname, '..', 'scripts'),
            args
        };

        PythonShell.run(script, options, (err, output: any) => {
            if (err) {
                reject({ message: "Erreur lors du traitement" });
            } else {
                resolve({ data: output[0] || null });
            }
        });
    });
}