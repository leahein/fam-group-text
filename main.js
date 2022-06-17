exports.handler = (context, event, callback) => {

  const twiml = new Twilio.twiml.MessagingResponse();

  const fromNum = event.From.replace('+1', '')

  Object.keys(FAMILY_GROUP).forEach(phone => {

    if(phone != fromNum) {

      const message = twiml.message({ to: phone });

      message.body(`${FAMILY_GROUP[fromNum] || event.From}: ${event.Body}`);

      for (let i = 0; i < event.NumMedia; i++) {
        message.media(event['MediaUrl' + i]);
      }
    }
  })
  return callback(null, twiml);
};
