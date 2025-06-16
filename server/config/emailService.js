const nodemailer = require("nodemailer");

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });
};

// Send email verification
const sendVerificationEmail = async (email, token, username) => {
  try {
    const transporter = createTransporter();

    const verificationUrl = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/verify-email/${token}`;

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Verify Your Email - SocioSphere",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Welcome to SocioSphere!</h1>
            <p style="color: #666; font-size: 16px;">Hi ${username}, please verify your email address</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for signing up! To complete your registration and start using SocioSphere, 
              please click the button below to verify your email address.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #007bff; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; font-weight: bold; 
                        display: inline-block; font-size: 16px;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">
                ${verificationUrl}
              </a>
            </p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>This verification link will expire in 24 hours.</p>
            <p>If you didn't create an account with SocioSphere, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

// Send welcome email after verification
const sendWelcomeEmail = async (email, username) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Welcome to SocioSphere! 🎉",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Welcome to SocioSphere! 🎉</h1>
            <p style="color: #666; font-size: 16px;">Your email has been verified successfully!</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi ${username},
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Congratulations! Your email has been successfully verified and your SocioSphere account is now active.
            </p>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              You can now enjoy all the features of SocioSphere:
            </p>
            <ul style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              <li>Connect with friends and make new connections</li>
              <li>Share your thoughts and experiences</li>
              <li>Discover interesting content from the community</li>
              <li>And much more!</li>
            </ul>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>Thank you for joining our community!</p>
            <p>The SocioSphere Team</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully to:", email);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
};
