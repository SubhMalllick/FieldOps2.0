import nodemailer from 'nodemailer';

/**
 * Send email notification for form submissions
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    // Create transporter using Gmail
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Email options
    const mailOptions = {
      from: `FieldOps <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
      replyTo: process.env.EMAIL_USER,
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email notification');
  }
}

/**
 * Format business registration email content
 */
export function formatBusinessEmail(data) {
  const { companyName, industryType, fullName, phone, email, monthlyNeeds } = data;
  
  return {
    subject: `🚀 New Business Registration: ${companyName}`,
    text: `
      NEW BUSINESS REGISTRATION - FIELDOPS
      
      Company Name: ${companyName}
      Industry Type: ${industryType}
      Contact Person: ${fullName}
      Phone: ${phone}
      Email: ${email}
      Monthly Verification Needs: ${monthlyNeeds}
      
      Timestamp: ${new Date().toISOString()}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">🎉 New Business Registration - FieldOps</h2>
        </div>
        <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px;">
          <h3 style="color: #1e293b; margin-bottom: 15px;">Company Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Company Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${companyName}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Industry Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${industryType}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Contact Person:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${fullName}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${phone}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${email}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Monthly Needs:</strong></td><td style="padding: 8px 0;">${monthlyNeeds}</td></tr>
          </table>
        </div>
        <div style="color: #64748b; font-size: 12px; margin-top: 20px; text-align: center;">
          <p>Sent from FieldOps Registration System</p>
          <p>Timestamp: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `
  };
}

/**
 * Format field executive registration email content
 */
export function formatAgentEmail(data) {
  const { fullName, email, phone, city, state, experience } = data;
  
  return {
    subject: `👤 New Field Executive: ${fullName} - ${city}, ${state}`,
    text: `
      NEW FIELD EXECUTIVE REGISTRATION - FIELDOPS
      
      Full Name: ${fullName}
      Email: ${email}
      Phone: ${phone}
      Location: ${city}, ${state}
      Experience: ${experience}
      
      Timestamp: ${new Date().toISOString()}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h2 style="margin: 0;">🌟 New Field Executive Registration</h2>
        </div>
        <div style="background: #f0fdf4; padding: 20px; border-radius: 0 0 10px 10px;">
          <h3 style="color: #1e293b; margin-bottom: 15px;">Executive Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #bbf7d0;"><strong>Full Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #bbf7d0;">${fullName}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #bbf7d0;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #bbf7d0;">${email}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #bbf7d0;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #bbf7d0;">${phone}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #bbf7d0;"><strong>Location:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #bbf7d0;">${city}, ${state}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>Experience:</strong></td><td style="padding: 8px 0;">${experience}</td></tr>
          </table>
        </div>
        <div style="color: #64748b; font-size: 12px; margin-top: 20px; text-align: center;">
          <p>Sent from FieldOps Registration System</p>
          <p>Timestamp: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `
  };
}
