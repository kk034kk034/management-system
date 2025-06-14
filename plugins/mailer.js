// plugins/mailer.js
import FastifyPlugin from 'fastify-plugin'
import process from 'node:process'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

async function mailerPlugin(fastify) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // false=STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    debug: false,
    logger: false
  })

  fastify.decorate('sendEmail', async (to, subject, text, html) => {
    try {
      console.log('Preparing to send email...')
      const mailOptions = {
        from: `"PLANET CloudViewer" <noreply@planet.com.tw>`,
        to,
        subject,
        text,
        html
      }
      const info = await transporter.sendMail(mailOptions)
      console.log('Email sent: %s', info.messageId)
      return info
    } catch (error) {
      console.error('Error sending email:', error.message)
      throw error
    }
  })
}

export default FastifyPlugin(mailerPlugin)
// dummy for CodeRabbit

// dummy for CodeRabbit
