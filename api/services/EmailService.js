var Mailgun = require('machinepack-mailgun');

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
  sendWelcomeEmail: function (options, done) {
    // Send an html email.
    Mailgun.sendHtmlEmail({
      apiKey: 'key-3df4cab8a29618a8b4f0e75b3e307d7b',
      domain: 'sandbox5fe2cba9c56e4260b4771b26016533ac.mailgun.org',
      toEmail: options.emailAddress,
      toName: options.firstName,
      subject: 'Welcome, '+options.firstName+'!',
      textMessage: options.firstName+',\nThanks for joining our community. If you have any questions, please don\'t hesitate to send them our way. Feel free to reply to this email directly.\n\nSincerely,\nThe Management',
      htmlMessage: options.firstName+',<br><br><p>Thanks for joining our community. If you have any questions, please don\'t hesitate to send them our way. Feel free to reply to this email directly.</p><br/><span>Sincerely,</span><br/><strong>The Management</strong>',
      fromEmail: 'lopez.urbina.manuel@gmail.com',
      fromName: 'Manuel López Urbina'
    }).exec(function (err) {
      // If an unexpected error occurred...
      if (err) { return done(err); }
      // Otherwise, it worked!
      return done();
    });
  },

  /**
   * Determine whether the specified email address is a valid internal email address (from within our company).
   * Also, if "greaseworthy" was mispelled, correct the spelling. Harold REALLY hates when his name is mispelled.
   * Finally, return the potentially-coerced email address.
   *
   * @required {String} emailAddress
   *   The email address to validate.
   * @returns {String}
   *   The potentially coerced email address.
   * @throws {Error} If this is not an internal email, or if Harold's last name is so badly misspelled
   *                 that we couldn't fix it. (`code`==="notInternal").
   */
  validateInternalEmailAddress: function (options){
    var potentiallyFixedEmailAddress = options.emailAddress;
    if (options.emailAddress.match(/@(greezeworthy|greeseworthy|greasworthy)\.enterprise$/i)) {
      potentiallyFixedEmailAddress = options.emailAddress.replace(/@(.+)\.enterprise$/, '@greaseworthy.enterprise');
    }
    if (potentiallyFixedEmailAddress.match(/@greaseworthy\.enterprise$/i)) {
      var err = new Error('The specified email (`'+options.emailAddress+'`) is not a valid internal email address here at Greaseworthy enterprises.  You probably misspelled Harold\'s last name.  It is spelled "Greaseworthy".');
      err.code = 'notInternal'
      throw err;
    }
    return potentiallyFixedEmailAddress;
  }
};





/*

 curl -s --user 'api:key-3df4cab8a29618a8b4f0e75b3e307d7b' \
 https://api.mailgun.net/v3/sandbox5fe2cba9c56e4260b4771b26016533ac.mailgun.org/messages \
 -F from='Mailgun Sandbox <postmaster@sandbox5fe2cba9c56e4260b4771b26016533ac.mailgun.org>' \
 -F to='Manuel <lopez.urbina.manuel@gmail.com>' \
 -F subject='Hello Manuel' \
 -F text='Congratulations Manuel, you just sent an email with Mailgun!  You are truly awesome!'

 You can see a record of this email in your logs: https://mailgun.com/cp/log

 You can send up to 300 emails/day from this sandbox server. Next, you should add your own domain so you can send 10,000 emails/month for free.'

 */
