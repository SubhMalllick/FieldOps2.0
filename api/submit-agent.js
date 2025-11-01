import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      fullName,
      email,
      phone,
      city,
      state,
      experience
    } = req.body;

    // Basic validation
    if (!fullName || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Prepare email content
    const emailContent = {
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `👤 New Field Executive: ${fullName} - ${city}, ${state}`,
      text: `
        NEW FIELD EXECUTIVE REGISTRATION - FIELDOPS
        -------------------------------------------
        Full Name: ${fullName}
        Email: ${email}
        Phone: ${phone}
        City: ${city}
        State: ${state}
        Experience: ${experience}
        
        Submitted: ${new Date().toLocaleString()}
        IP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
                .content { background: #f0fdf4; padding: 20px; border-radius: 0 0 10px 10px; }
                .field { margin-bottom: 10px; }
                .label { font-weight: bold; color: #1e293b; }
                .footer { color: #64748b; font-size: 12px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>🌟 New Field Executive Registration</h2>
            </div>
            <div class="content">
                <h3 style="color: #1e293b;">Executive Details:</h3>
                <div class="field"><span class="label">Full Name:</span> ${fullName}</div>
                <div class="field"><span class="label">Email:</span> ${email}</div>
                <div class="field"><span class="label">Phone:</span> ${phone}</div>
                <div class="field"><span class="label">Location:</span> ${city}, ${state}</div>
                <div class="field"><span class="label">Experience:</span> ${experience}</div>
            </div>
            <div class="footer">
                <p>Submitted: ${new Date().toLocaleString()}</p>
                <p>IP: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}</p>
            </div>
        </body>
        </html>
      `
    };

    // Send email notification
    await transporter.sendMail(emailContent);

    console.log('Field executive registration received:', { fullName, email, city });

    return res.status(200).json({ 
      success: true, 
      message: 'Registration successful! We will contact you within 24 hours.' 
    });

  } catch (error) {
    console.error('Error processing agent registration:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again.' 
    });
  }
}
