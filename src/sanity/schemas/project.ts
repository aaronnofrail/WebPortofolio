const projectSchema = {
  name: 'project',
  title: 'Project Record',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'image', title: 'Thumbnail Image', type: 'image', options: { hotspot: true } },
    {
      name: 'tags',
      title: 'Tags / Tech Stack',
      type: 'array',
      of: [{ type: 'string' }]
    },
    { name: 'githubUrl', title: 'GitHub URL', type: 'url' },
    { name: 'demoUrl', title: 'Live Demo URL', type: 'url' },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'Active' },
          { title: 'Completed', value: 'Completed' },
          { title: 'Archived', value: 'Archived' },
          { title: 'In Progress', value: 'In Progress' }
        ]
      }
    }
  ]
};

export default projectSchema;
