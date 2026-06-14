const bioSchema = {
  name: 'bio',
  title: 'Biography & Info',
  type: 'document',
  fields: [
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'role', title: 'Role', type: 'string' },
    { name: 'terminalText', title: 'Terminal Text', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    {
      name: 'philosophy',
      title: 'Philosophy Statements',
      type: 'array',
      of: [{ type: 'text' }]
    },
    {
      name: 'skills',
      title: 'Core Technologies',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ]
};

export default bioSchema;
