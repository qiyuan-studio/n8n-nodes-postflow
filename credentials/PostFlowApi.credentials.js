module.exports = {
  name: 'postFlowApi',
  displayName: 'PostFlow AI API',
  documentationUrl: 'https://github.com/qiyuan-studio/postflow-ai',
  properties: [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your PostFlow AI API key from the dashboard',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://postflow.ai',
      description: 'Your PostFlow AI instance URL (for self-hosted)',
    },
  ],
  authenticate: {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  },
  test: {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/api/open/v1/me',
      method: 'GET',
    },
  },
};
