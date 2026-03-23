import nodemailer, { Transporter } from 'nodemailer';
import logger from '../utils/logger';
import { BadRequestError } from '../utils/errors';

type SendEmailInput = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
};

const DEFAULT_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'no-reply@fabricflow.local';
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';



export const emailService = {
  transporter: null as Transporter | null,

  isConfigured(): boolean {
    return this.isEmailServiceConfigured();
  },

  getTransporter(): Transporter {
    if (!this.isConfigured()) {
      throw new BadRequestError('Email service is not configured');
    }

    if (!this.transporter) {
      this.transporter = this.createSmtpTransporter();
    }

    return this.transporter;
  },

  async sendEmail(input: SendEmailInput): Promise<void> {
    const { to, subject, text, html, from } = input;
    if (!subject?.trim()) {
      throw new BadRequestError('Email subject is required');
    }

    if (!this.hasNonEmptyContent(text, html)) {
      throw new BadRequestError('Either text or html content is required to send email');
    }

    const normalizedRecipients = this.normalizeRecipients(to);
    const resolvedFrom = from?.trim() || DEFAULT_FROM_EMAIL;

    const transporter = this.getTransporter();

    try {
      await transporter.sendMail({
        from: resolvedFrom,
        to: normalizedRecipients,
        subject: subject.trim(),
        text,
        html,
      });

      logger.info('Email sent successfully', {
        to: normalizedRecipients,
        subject: subject.trim(),
      });
    } catch (error) {
      logger.error('Failed to send email', {
        to: normalizedRecipients,
        subject: subject.trim(),
        error,
      });
      throw error;
    }
  },

  // helper private methods
  hasNonEmptyContent(text?: string, html?: string): boolean {
    return Boolean(text?.trim() || html?.trim());
  },

  normalizeRecipients(to: string | string[]): string | string[] {
    if (Array.isArray(to)) {
      const recipients = to.map((email) => email.trim()).filter(Boolean);
      if (recipients.length === 0) {
        throw new BadRequestError('At least one recipient email is required');
      }
      return recipients;
    }

    const recipient = to.trim();
    if (!recipient) {
      throw new BadRequestError('Recipient email is required');
    }
    return recipient;
  },

  isEmailServiceConfigured(): boolean {
    return Boolean(
      SMTP_HOST &&
      SMTP_USER &&
      SMTP_PASS &&
      Number.isInteger(SMTP_PORT) &&
      SMTP_PORT > 0
    );
  },

  createSmtpTransporter(): Transporter {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      connectionTimeout: 15000, // 15 seconds
      greetingTimeout: 15000,
      socketTimeout: 15000,
    });
  }
};
