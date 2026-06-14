const messageSchema = {
  name: 'message',
  title: 'Inbox Message',
  type: 'document',
  fields: [
    { name: 'name', title: 'Sender Name', type: 'string' },
    { name: 'email', title: 'Sender Email', type: 'string' },
    { name: 'subject', title: 'Subject', type: 'string' },
    { name: 'message', title: 'Message Body', type: 'text' },
    { name: 'receivedAt', title: 'Received At', type: 'datetime' }
  ]
};

export default messageSchema;
