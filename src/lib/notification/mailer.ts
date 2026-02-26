import nodemailer from 'nodemailer'
import { env } from '../config/env'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || 'smtp.example.com',
  port: Number(env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: env.SMTP_USER || '',
    pass: env.SMTP_PASS || '',
  },
})

export async function sendEmail(to: string, subject: string, text: string) {
  try {
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM || 'no-reply@flytosky.com',
      to,
      subject,
      text,
    })
    console.log('Email sent:', info.messageId)
    return info
n  } catch (error) {
    console.error('Failed to send email', error)
    throw error
  }
}
