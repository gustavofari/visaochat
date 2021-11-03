// Start listen whatsapp messages
export async function start(client, replies) {
  console.log("Chatbot started...");
  let parentReply = 0;
  client.onMessage(async (message) => {
    const body = message.body.toLowerCase();
    const reply = replies.find((o) => o.pattern.test(body));
    if (reply && message.isGroupMsg === false) {
      if (reply.parent === parentReply) {
        console.log("Watch: ", reply.pattern);
        parentReply = reply.id;
        if (reply.hasOwnProperty('link')) {
          await client
            .sendLinkPreview(message.from, reply.link, reply.message)
            .then(result => console.log("Result (sendLinkPreview): ", message.from, '>', result.to.remote._serialized, ':', reply.message))
            .catch(err => console.error("Error (sendLinkPreview): ", err));
        } else if (reply.hasOwnProperty('buttons') && reply.hasOwnProperty('description')) {
          await client
            .sendButtons(message.from, reply.message, reply.buttons, reply.description)
            .then(result => console.log("Result (sendButtons): ", message.from, '>', result.to.remote._serialized, ':', reply.message))
            .catch(err => console.error("Error (sendButtons): ", err));
        } else {  
          await client
            .sendText(message.from, reply.message)
            .then(result => console.log("Result (sendText): ", message.from, '>', result.to.remote._serialized, ':', reply.message))
            .catch(err => console.error("Error (sendText): ", err));
        }
      }
    }
  });
}