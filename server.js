require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para envio de email
app.post('/send-email', async (req, res) => {
    console.log("Verificando Variáveis de Ambiente no Vercel -> EMAIL_USER existe?", !!process.env.EMAIL_USER, "| EMAIL_PASS existe?", !!process.env.EMAIL_PASS);

    // Configurar Nodemailer aqui dentro para garantir que pegue o process.env no momento da requisição
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Nome, email e mensagem são obrigatórios.' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Envia para você mesmo
        replyTo: email,
        subject: `Novo Contato do Portfólio: ${subject || 'Sem assunto'}`,
        html: `
            <h2>Nova Mensagem de Contato</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
            <p><strong>Assunto:</strong> ${subject || 'Não informado'}</p>
            <h3>Mensagem:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: 'Email enviado com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao enviar o email.' });
    }
});


// Iniciar servidor localmente (Ignorado no Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

// Exportar para o Vercel Serverless
module.exports = app;
