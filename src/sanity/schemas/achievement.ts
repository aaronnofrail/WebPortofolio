const achievementSchema = {
  name: 'achievement',
  title: 'Achievement & Certification',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Image Asset', type: 'image', options: { hotspot: true } },
    {
      name: 'tags',
      title: 'Tags / Categories',
      type: 'array',
      of: [{ type: 'string' }]
    }
  ]
};

export default achievementSchema;
