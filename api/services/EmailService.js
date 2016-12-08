var Mailgun = require('mailgun-js');

// api/services/EmailService.js
module.exports = {

  /**
   * Send a customized welcome email to the specified email address.
   *
   * @required {String} emailAddress
   *   The email address of the recipient.
   * @required {String} firstName
   *   The first name of the recipient.
   */
  sendWelcomeEmail: function (options) {
    // Send an html email.
    Mailgun.sendHtmlEmail({
      apiKey: 'key-3df4cab8a29618a8b4f0e75b3e307d7b',
      domain: 'sandbox5fe2cba9c56e4260b4771b26016533ac.mailgun.org',
      toEmail: options.emailAddress,
      toName: options.firstName,
      subject: 'Welcome, ' + options.firstName + '!',
      textMessage: options.firstName + ',\nThanks for joining our community. If you have any questions, please don\'t hesitate to send them our way. Feel free to reply to this email directly.\n\nSincerely,\nThe Management',
      htmlMessage: options.firstName + ',<br><br><p>Thanks for joining our community. If you have any questions, please don\'t hesitate to send them our way. Feel free to reply to this email directly.</p><br/><span>Sincerely,</span><br/><strong>The Management</strong>',
      fromEmail: 'lopez.urbina.manuel@gmail.com',
      fromName: 'Manuel López Urbina'
    });
  }
};
