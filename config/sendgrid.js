const sgMail = require("@sendgrid/mail");
const sendGridApiKey = process.env.SENDGRID_API_KEY;

const emailConfig = () => {
  sgMail.setApiKey(sendGridApiKey);
  sgMail.setSubstitutionWrappers("{{", "}}");
  return sgMail;
};

const sendEmail = async (from, subject, template, substitutions = "") => {
  try {
    const sendMail = emailConfig();
    const msg = {
      to: "iyayiemmanuel1@gmail.com",
      from,
      subject,
      templateId: template,
      substitutions,
    };
    if (options.substitutions) {
      msg.dynamic_template_data = Object.assign({}, substitutions);
      return await sendMail.send(message, (err, result) => {
        if (err) {
          console.log("sendgrid-err:::", err);
        } else {
          console.log("sendgrid-res:::", result[0].statusCode, result);
        }
      });
    }
  } catch (e) {
    console.error("err-from-email:::", e);
  }
};

module.exports = {
  sendEmail,
};
