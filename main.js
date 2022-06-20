const isWakeWord = (body) => {
  return body.toLowerCase().startsWith('@einhorn');
};

const getMessage = (body) => {
  switch (body.toLowerCase().trim()) {
    case '@einhorn help':
      const helpMessage = `
      👋 Looks like you need some help. These are the commands I know about:

      @Einhorn HELP: Get this message
      @Einhorn MEMBERS: Get the list of members that are part of this group text

    NOTE: This message was sent directly to you (only).
    If there are other features you'd like to see, let me know!
    `;
      return helpMessage;
    case '@einhorn members':
      const phones = Object.keys(FAMILY_GROUP).map(
        (phone) => `- ${FAMILY_GROUP[phone]}: ${phone} `
      );
      return `Members in this channel:\n${phones.join('\n')}`;
    default:
      return "Sorry, I don't understand that command.";
  }
};

exports.handler = (context, event, callback) => {
  const twiml = new Twilio.twiml.MessagingResponse();

  const fromNum = event.From.replace('+1', '');

  if (isWakeWord(event.Body)) {
    const wakeMessage = getMessage(event.Body);
    twiml.message({ to: fromNum }, wakeMessage);
    return callback(null, twiml);
  }

  Object.keys(FAMILY_GROUP).forEach((phone) => {
    if (phone != fromNum) {
      const message = twiml.message({ to: phone });

      message.body(`${FAMILY_GROUP[fromNum] || event.From}: ${event.Body}`);

      for (let i = 0; i < event.NumMedia; i++) {
        message.media(event['MediaUrl' + i]);
      }
    }
  });
  return callback(null, twiml);
};
