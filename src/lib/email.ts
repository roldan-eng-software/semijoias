import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@simoesemijoias.com.br'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.log('=== MODO DESENVOLVIMENTO - E-MAIL NÃO ENVIADO ===')
    console.log(`Para: ${to}`)
    console.log(`Assunto: ${subject}`)
    console.log('HTML:', html.substring(0, 200) + '...')
    console.log('=================================================')
    return { success: true, mock: true }
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    return { success: false, error }
  }
}

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verificationUrl = `${APP_URL}/auth/verificar?token=${token}`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background-color: #4a2c2a; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif;">✨ Simone Semijoias</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #4a2c2a; margin: 0 0 20px 0; font-size: 22px; font-family: Georgia, serif;">
                    Confirme seu e-mail
                  </h2>
                  
                  <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Olá ${name || 'Cliente'}, obrigado por se cadastrar na Simone Semijoias!
                  </p>
                  
                  <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Para confirmar seu e-mail e ativar sua conta, clique no botão abaixo:
                  </p>
                  
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${verificationUrl}" style="display: inline-block; background-color: #b76e79; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                          Confirmar meu e-mail
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                    Se o botão não funcionar, copie e cole este link no seu navegador:<br>
                    <span style="color: #b76e79; word-break: break-all;">${verificationUrl}</span>
                  </p>
                  
                  <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 30px 0 0 0; border-top: 1px solid #eeeeee; padding-top: 20px;">
                    Este link expira em 24 horas.<br>
                    Se você não criou uma conta na Simone Semijoias, ignore este e-mail.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center;">
                  <p style="color: #999999; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} Simone Semijoias. Todos os direitos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: '✨ Confirme seu e-mail - Simone Semijoias',
    html,
  })
}

export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  orderNumber: string,
  total: number
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background-color: #4a2c2a; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif;">✨ Simone Semijoias</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <span style="font-size: 60px;">✅</span>
                  </div>
                  
                  <h2 style="color: #4a2c2a; margin: 0 0 20px 0; font-size: 22px; font-family: Georgia, serif; text-align: center;">
                    Pedido confirmado!
                  </h2>
                  
                  <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0; text-align: center;">
                    Olá ${name || 'Cliente'}, recebemos seu pedido com sucesso!
                  </p>
                  
                  <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px;">Número do pedido</p>
                    <p style="margin: 0; color: #4a2c2a; font-size: 24px; font-weight: bold;">${orderNumber}</p>
                  </div>
                  
                  <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <p style="margin: 0 0 5px 0; color: #999999; font-size: 14px;">Total pago</p>
                    <p style="margin: 0; color: #b76e79; font-size: 28px; font-weight: bold;">R$ ${total.toFixed(2).replace('.', ',')}</p>
                  </div>
                  
                  <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                    Você pode acompanhar o status do seu pedido na área "Meus Pedidos" do seu perfil.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center;">
                  <p style="color: #999999; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} Simone Semijoias. Todos os direitos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `✅ Pedido ${orderNumber} confirmado - Simone Semijoias`,
    html,
  })
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resetUrl = `${APP_URL}/auth/redefinir-senha?token=${token}`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background-color: #4a2c2a; padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-family: Georgia, serif;">✨ Simone Semijoias</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #4a2c2a; margin: 0 0 20px 0; font-size: 22px; font-family: Georgia, serif;">
                    Esqueceu sua senha?
                  </h2>
                  
                  <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Olá ${name || 'Cliente'}, recebemos uma solicitação para redefinir a senha da sua conta.
                  </p>
                  
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <a href="${resetUrl}" style="display: inline-block; background-color: #b76e79; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                          Redefinir minha senha
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                    Se você não solicitou a redefinição de senha, ignore este e-mail. Sua conta permanece segura.
                  </p>
                  
                  <p style="color: #999999; font-size: 12px; line-height: 1.6; margin: 30px 0 0 0; border-top: 1px solid #eeeeee; padding-top: 20px;">
                    Este link expira em 1 hora.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center;">
                  <p style="color: #999999; font-size: 12px; margin: 0;">
                    © ${new Date().getFullYear()} Simone Semijoias. Todos os direitos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: '🔐 Redefinir sua senha - Simone Semijoias',
    html,
  })
}
