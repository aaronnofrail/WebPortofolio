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
    },
    {
      name: 'caseStudy',
      title: 'Case Study',
      type: 'object',
      fields: [
        { name: 'problem', title: 'Problem/Challenge', type: 'text' },
        { name: 'solution', title: 'Solution/Execution', type: 'text' },
        { name: 'result', title: 'Result/Outcome', type: 'text' }
      ]
    },
    {
      name: 'metrics',
      title: 'Metrics / Key Stats',
      type: 'object',
      fields: [
        { name: 'perf', title: 'Performance Score (e.g. 100% or >98%)', type: 'string' },
        { name: 'sec', title: 'Security Score (e.g. 90%)', type: 'string' },
        { name: 'rel', title: 'Reliability Score (e.g. 92%)', type: 'string' }
      ]
    }
  ]
};

export default projectSchema;
