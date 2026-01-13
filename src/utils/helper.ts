import * as fs from 'fs';
import * as path from 'path';

export function generateOTP(): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

export function generateHtmlTemplate(templatePath: string, fields: Record<string, string>): string {
    const htmlTemplate: string = fs.readFileSync(templatePath, 'utf-8');
    console.log(htmlTemplate);
    const regex = /\{\{([^}]+)\}\}/g;
    const htmlWithReplacedFields: string = htmlTemplate.replace(regex, (match, placeholder) => {
        if (fields.hasOwnProperty(placeholder)) return fields[placeholder];
        return match;
    });
    return htmlWithReplacedFields;
}
