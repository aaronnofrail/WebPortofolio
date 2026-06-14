const experienceSchema = {
  name: 'experience',
  title: 'Job Experience',
  type: 'document',
  fields: [
    { name: 'jobTitle', title: 'Job Title', type: 'string' },
    { name: 'company', title: 'Company', type: 'string' },
    { name: 'period', title: 'Period', type: 'string' },
    { name: 'status', title: 'Status Display', type: 'string' },
    {
      name: 'responsibilities',
      title: 'Responsibilities',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'tags',
      title: 'Tags / Technologies Used',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ]
};

export default experienceSchema;
