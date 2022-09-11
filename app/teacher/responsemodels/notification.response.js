class NotificationResponse {
  constructor(recipients) {
    this.recipients = recipients;
  }

  getRecipients() {
    return this.recipients;
  }
}

module.exports = function (recipients) {
  return new NotificationResponse(recipients);
};
