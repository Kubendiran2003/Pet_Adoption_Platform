import nodemailer from 'nodemailer';

/**
 * Email service for sending notifications
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  /**
   * Send application status update email
   * @param {Object} options - Email options
   */
  async sendApplicationStatusUpdate(options) {
    const message = {
      from: `${process.env.EMAIL_FROM}`,
      to: options.email,
      subject: `Pet Adoption Application Status: ${options.status}`,
      html: `
        <h1>Application Status Update</h1>
        <p>Hello ${options.name},</p>
        <p>Your application for ${options.petName} has been ${options.status}.</p>
        ${options.message ? `<p>Message: ${options.message}</p>` : ''}
        <p>Thank you for using our platform!</p>
      `
    };

    await this.transporter.sendMail(message);
  }

  /**
   * Send new pet listing notification to interested users
   * @param {Object} options - Email options
   */
  async sendNewPetNotification(options) {
    const message = {
      from: `${process.env.EMAIL_FROM}`,
      to: options.email,
      subject: `New Pet Available for Adoption: ${options.petName}`,
      html: `
        <h1>New Pet Available!</h1>
        <p>Hello ${options.name},</p>
        <p>A new pet matching your preferences is now available for adoption:</p>
        <p><strong>${options.petName}</strong> - ${options.petBreed}, ${options.petAge}</p>
        <p>Check out the listing on our platform!</p>
        <p>Thank you for using our service!</p>
      `
    };

    await this.transporter.sendMail(message);
  }

  /**
   * Send new message notification
   * @param {Object} options - Email options
   */
  async sendMessageNotification(options) {
    const message = {
      from: `${process.env.EMAIL_FROM}`,
      to: options.email,
      subject: `New Message Regarding: ${options.subject}`,
      html: `
        <h1>You Have a New Message</h1>
        <p>Hello ${options.name},</p>
        <p>You have received a new message from ${options.senderName}.</p>
        <p>Subject: ${options.subject}</p>
        <p>Please log in to your account to view and respond to this message.</p>
        <p>Thank you for using our platform!</p>
      `
    };

    await this.transporter.sendMail(message);
  }
}

export default new EmailService();