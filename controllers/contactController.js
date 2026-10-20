import nodemailer from 'nodemailer';
import Message from '../models/Message.js';

/**
 * Configure Nodemailer Transporter
 */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * @desc   Submit contact form inquiry and trigger email notification
 * @route  POST /api/contact
 * @access Public
 */
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields',
      });
    }

    // 1. Save message to MongoDB
    const savedMessage = await Message.create({
      name,
      email,
      subject: subject || 'Portfolio Inquiry from Recruiter/Client',
      message,
    });

    // 2. Dispatch Email Notification via Nodemailer (if configured)
    const transporter = createTransporter();
    let emailSent = false;

    if (transporter) {
      try {
        const mailOptions = {
          from: `"Portfolio Telemetry" <${process.env.EMAIL_USER}>`,
          to: process.env.ADMIN_NOTIFICATION_EMAIL || process.env.EMAIL_USER,
          replyTo: email,
          subject: `⚡ [Portfolio Alert] ${subject || 'New Contact Message'} from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0c0d14; color: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #00f3ff;">
              <h2 style="color: #00f3ff; margin-bottom: 5px;">⚡ New Inbound Portfolio Message</h2>
              <p style="color: #888; font-size: 13px; margin-top: 0;">Transmission received via Goutam Gupta's System Architect Portal</p>
              <hr style="border: 0; border-top: 1px solid #222; margin: 20px 0;" />
              <table style="width: 100%; color: #fff; font-size: 14px;">
                <tr><td style="color: #ff00ff; width: 120px; font-weight: bold;">Sender:</td><td>${name}</td></tr>
                <tr><td style="color: #ff00ff; font-weight: bold;">Email:</td><td><a href="mailto:${email}" style="color: #00f3ff;">${email}</a></td></tr>
                <tr><td style="color: #ff00ff; font-weight: bold;">Subject:</td><td>${subject || 'General Inquiry'}</td></tr>
                <tr><td style="color: #ff00ff; font-weight: bold;">Timestamp:</td><td>${new Date().toLocaleString('en-IN', {
                  timeZone: process.env.TZ || 'Asia/Kolkata',
                  dateStyle: 'medium',
                  timeStyle: 'medium',
                  hour12: true,
                })} (IST)</td></tr>
              </table>
              <div style="margin-top: 25px; padding: 15px; background: rgba(0, 243, 255, 0.05); border-left: 3px solid #00f3ff; border-radius: 4px;">
                <h4 style="margin: 0 0 10px 0; color: #00f3ff;">Transmission Content:</h4>
                <p style="white-space: pre-wrap; line-height: 1.6; margin: 0; color: #e0e0e0;">${message}</p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        emailSent = true;
      } catch (mailError) {
        console.error('[EMAIL NOTIFICATION WARNING] Nodemailer failed to send email:', mailError.message);
        // Do not crash, message is safely in MongoDB
      }
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been transmitted successfully to Goutam Gupta. Thank you!',
      emailDispatched: emailSent,
      data: savedMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Fetch all contact messages
 * @route  GET /api/contact
 * @access Private/Admin
 */
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Mark message as read
 * @route  PATCH /api/contact/:id/read
 * @access Private/Admin
 */
export const markMessageRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete message
 * @route  DELETE /api/contact/:id
 * @access Private/Admin
 */
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
