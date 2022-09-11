class NotificationResponse {
  constructor(recipients) {
    this.recipients = recipients;
  }

  getRecipients() {
    return this.recipients;
  }
}

module.exports = { NotificationResponse };
