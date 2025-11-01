import { sendEmail, formatAgentEmail } from '../../utils/email-handler.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = req.body;

    // Basic validation
    if (!data.fullName || !data.email || !data.phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: Full Name, Email, and Phone are required.' 
      });
    }

    // Format email content
    const emailContent = formatAgentEmail(data);
    
    // Send email notification
    await sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      ...emailContent
    });

    console.log('Field executive registration processed:', { 
      name: data.fullName, 
      email: data.email,
      location: `${data.city}, ${data.state}`,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Registration successful! We will contact you within 24 hours.' 
    });

  } catch (error) {
    console.error('Error processing agent registration:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again or contact support.' 
    });
  }
}
