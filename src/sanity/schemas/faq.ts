const faqSchema = {
  name: 'faq',
  title: 'Frequently Asked Questions',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string' },
    { name: 'answer', title: 'Answer', type: 'text' },
    { name: 'order', title: 'Display Order', type: 'number' }
  ]
};

export default faqSchema;
