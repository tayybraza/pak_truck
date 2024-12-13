let Verification_Email_Template = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        .main {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(to bottom, #7bd29b75 30%, #ffffff 70%);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            margin: auto;
            width: 100%;
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 0px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            text-align: center;
            padding: 30px;
            box-sizing: border-box;
        }

        .header {
            background-color: #f44336;
            padding: 30px;
            color: white;
            font-size: 32px;
            font-weight: bold;
            border-radius: 8px;
        }

        .header img {
            width: 120px;
            margin-bottom: 15px;
            border-radius: 8px;
        }

        .platform-name {
            font-size: 24px;
            font-weight: normal;
            margin-top: 5px;
        }

        .content {
            padding: 20px;
            color: #333;
            line-height: 1.6;
            background-color: #f9f9f9;
            border-radius: 8px;
            margin-top: 20px;
        }

        .verification-code {
            display: block;
            margin: 30px 0;
            font-size: 28px;
            color: #fff;
            background-color: #58b749cc;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            font-weight: bold;
            letter-spacing: 3px;
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
            /* box-shadow: 0 0 15px #f8b44d, 0 0 30px #f8b44d, 0 0 45px #f8b44d; */
            animation: glow 1.5s infinite alternate;
        }

        @keyframes glow {
            0% {
                box-shadow: 0 0 10px #f8b44d, 0 0 20px #f8b44d, 0 0 30px #f8b44d;
            }

            100% {
                box-shadow: 0 0 20px #f8b44d, 0 0 40px #f8b44d, 0 0 60px #f8b44d;
            }
        }


        .cta-button {
            background-color: #4caf50;
            color: white;
            padding: 18px 35px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            display: inline-block;
            transition: background-color 0.3s ease;
            margin-top: 20px;
        }

        .cta-button:hover {
            background-color: #388e3c;
        }

        .footer {
            background-color: #f1f1f1;
            padding: 20px;
            color: #777;
            font-size: 14px;
            text-align: center;
            border-radius: 8px;
            margin-top: 30px;
        }

        p {
            margin: 0 0 20px;
        }
    </style>
</head>

<body>
    <div class="main">
    <div class="container">
        <div class="header">
            <div>Welcome to Pakistani Truck!</div>
            <div class="platform-name">Your Email Verification</div>
        </div>
        <div class="content">
            <p>Hey there!</p>
            <p>We're excited to have you on board. To complete your registration with Pakistani Truck, please verify
                your email by entering the following code:</p>
            <span class="verification-code">{verificationCode}</span>
            <p>If you didn’t sign up, no further action is needed. If you need assistance, our team is here to help!</p>
            <a href="#" class="cta-button">Confirm Your Email</a>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Pakistani Truck. All rights reserved.</p>
        </div>
    </div>
    </div>

</body>

</html>
`;




const Welcome_Email_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Community</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #ddd;
        }
        .header {
            background-color: #007BFF;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 26px;
            font-weight: bold;
        }
        .content {
            padding: 25px;
            line-height: 1.8;
        }
        .welcome-message {
            font-size: 18px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            margin: 20px 0;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #ddd;
        }
        p {
            margin: 0 0 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Welcome to Our Community!</div>
        <div class="content">
            <p class="welcome-message">Hello {name},</p>
            <p>We’re thrilled to have you join us! Your registration was successful, and we’re committed to providing you with the best experience possible.</p>
            <p>Here’s how you can get started:</p>
            <ul>
                <li>Explore our features and customize your experience.</li>
                <li>Stay informed by checking out our blog for the latest updates and tips.</li>
                <li>Reach out to our support team if you have any questions or need assistance.</li>
            </ul>
            <a href="#" class="button">Get Started</a>
            <p>If you need any help, don’t hesitate to contact us. We’re here to support you every step of the way.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

`;


let Forget_Password_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #ddd;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 26px;
            font-weight: bold;
        }
        .content {
            padding: 25px;
            color: #333;
            line-height: 1.8;
        }
        .verification-code {
            display: block;
            margin: 20px 0;
            font-size: 22px;
            color: #4CAF50;
            background: #e8f5e9;
            border: 1px dashed #4CAF50;
            padding: 10px;
            text-align: center;
            border-radius: 5px;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #ddd;
        }
        p {
            margin: 0 0 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Reset Your Password</div>
        <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. Use the OTP (One-Time Password) below to reset your password:</p>
            <span class="verification-code">{verificationCode}</span>
            <p>Please note that this OTP is valid for 10 minutes only. If you did not request a password reset, please ignore this email, and your account will remain secure.</p>
            <p>If you have any concerns or need assistance, feel free to contact our support team.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

const password_Reset_Successfully_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Community</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #ddd;
        }
        .header {
            background-color: #007BFF;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 26px;
            font-weight: bold;
        }
        .content {
            padding: 25px;
            line-height: 1.8;
        }
        .welcome-message {
            font-size: 18px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            margin: 20px 0;
            background-color: #007BFF;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            color: #777;
            font-size: 12px;
            border-top: 1px solid #ddd;
        }
        p {
            margin: 0 0 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Password Reset Successful!</div>
        <div class="content">
            <p class="welcome-message">Hello</p>
            <p>Your password has been successfully reset. You can now log in to your account using your new password.</p>
            <p>Here’s how you can get started:</p>
            <ul>
                <li>Explore our features and customize your experience.</li>
                <li>Thank you for using pak truck!</li>
                <li>Reach out to our support team if you have any questions or need assistance.</li>
            </ul>
            <a href="#" class="button">Get Started</a>
            <p>If you need any help, don’t hesitate to contact us. We’re here to support you every step of the way.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

`;


module.exports = { Verification_Email_Template, Welcome_Email_Template, Forget_Password_Template, password_Reset_Successfully_Template }
