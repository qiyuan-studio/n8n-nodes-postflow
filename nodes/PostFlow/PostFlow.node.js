const { NodeOperationError } = require('n8n-workflow');

class PostFlow {
  constructor() {
    this.description = {
      displayName: 'PostFlow AI',
      name: 'postFlow',
      icon: 'file:postflow.svg',
      group: ['transform'],
      version: 1,
      subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
      description: 'Interact with PostFlow AI API for content generation and publishing',
      defaults: {
        name: 'PostFlow AI',
      },
      inputs: ['main'],
      outputs: ['main'],
      credentials: [
        {
          name: 'postFlowApi',
          required: true,
        },
      ],
      properties: [
        {
          displayName: 'Resource',
          name: 'resource',
          type: 'options',
          noDataExpression: true,
          options: [
            { name: 'Content', value: 'content' },
            { name: 'Analytics', value: 'analytics' },
          ],
          default: 'content',
        },
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          noDataExpression: true,
          displayOptions: { show: { resource: ['content'] } },
          options: [
            { name: 'Generate with AI', value: 'generate', description: 'Generate content using AI', action: 'Generate content with AI' },
            { name: 'Create', value: 'create', description: 'Create a new content post', action: 'Create a content post' },
            { name: 'Get Many', value: 'getAll', description: 'Get all content posts', action: 'Get all content posts' },
            { name: 'Publish', value: 'publish', description: 'Publish content to social platforms', action: 'Publish content' },
          ],
          default: 'generate',
        },
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          noDataExpression: true,
          displayOptions: { show: { resource: ['analytics'] } },
          options: [
            { name: 'Get Analytics', value: 'get', description: 'Get analytics data', action: 'Get analytics data' },
          ],
          default: 'get',
        },
        // AI Generate fields
        {
          displayName: 'Topic / Prompt',
          name: 'topic',
          type: 'string',
          typeOptions: { rows: 3 },
          default: '',
          required: true,
          displayOptions: { show: { resource: ['content'], operation: ['generate'] } },
          description: 'Topic or prompt for AI content generation',
        },
        {
          displayName: 'Platform',
          name: 'platform',
          type: 'options',
          displayOptions: { show: { resource: ['content'], operation: ['generate'] } },
          options: [
            { name: 'All Platforms', value: 'all' },
            { name: 'X (Twitter)', value: 'twitter' },
            { name: 'Reddit', value: 'reddit' },
            { name: '小红书', value: 'xiaohongshu' },
            { name: '抖音', value: 'douyin' },
          ],
          default: 'all',
        },
        {
          displayName: 'Tone',
          name: 'tone',
          type: 'options',
          displayOptions: { show: { resource: ['content'], operation: ['generate'] } },
          options: [
            { name: 'Professional', value: 'professional' },
            { name: 'Casual', value: 'casual' },
            { name: 'Humorous', value: 'humorous' },
            { name: 'Inspirational', value: 'inspirational' },
            { name: 'Educational', value: 'educational' },
          ],
          default: 'professional',
        },
        {
          displayName: 'Length',
          name: 'length',
          type: 'options',
          displayOptions: { show: { resource: ['content'], operation: ['generate'] } },
          options: [
            { name: 'Short (Tweet)', value: 'short' },
            { name: 'Medium (Post)', value: 'medium' },
            { name: 'Long (Article)', value: 'long' },
          ],
          default: 'medium',
        },
        // Create fields
        {
          displayName: 'Title',
          name: 'title',
          type: 'string',
          default: '',
          displayOptions: { show: { resource: ['content'], operation: ['create'] } },
        },
        {
          displayName: 'Content',
          name: 'content',
          type: 'string',
          typeOptions: { rows: 5 },
          default: '',
          required: true,
          displayOptions: { show: { resource: ['content'], operation: ['create'] } },
        },
        {
          displayName: 'Platforms',
          name: 'platforms',
          type: 'multiOptions',
          displayOptions: { show: { resource: ['content'], operation: ['create'] } },
          options: [
            { name: 'X (Twitter)', value: 'twitter' },
            { name: 'Reddit', value: 'reddit' },
            { name: '小红书', value: 'xiaohongshu' },
            { name: '抖音', value: 'douyin' },
          ],
          default: [],
        },
        {
          displayName: 'Schedule At',
          name: 'scheduledAt',
          type: 'dateTime',
          default: '',
          displayOptions: { show: { resource: ['content'], operation: ['create'] } },
        },
        // Publish fields
        {
          displayName: 'Content ID',
          name: 'contentId',
          type: 'string',
          default: '',
          required: true,
          displayOptions: { show: { resource: ['content'], operation: ['publish'] } },
        },
        // Analytics fields
        {
          displayName: 'Platform',
          name: 'platform',
          type: 'options',
          displayOptions: { show: { resource: ['analytics'], operation: ['get'] } },
          options: [
            { name: 'All Platforms', value: 'all' },
            { name: 'X (Twitter)', value: 'twitter' },
            { name: 'Reddit', value: 'reddit' },
            { name: '小红书', value: 'xiaohongshu' },
            { name: '抖音', value: 'douyin' },
          ],
          default: 'all',
        },
        {
          displayName: 'Days',
          name: 'days',
          type: 'number',
          default: 7,
          displayOptions: { show: { resource: ['analytics'], operation: ['get'] } },
        },
      ],
    };
  }

  async execute() {
    const items = this.getInputData();
    const returnData = [];

    const credentials = await this.getCredentials('postFlowApi');
    const baseUrl = credentials.baseUrl || 'https://postflow.ai';
    const apiKey = credentials.apiKey;

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i);
        const operation = this.getNodeParameter('operation', i);

        if (resource === 'content') {
          if (operation === 'generate') {
            const response = await this.helpers.httpRequest({
              method: 'POST',
              url: `${baseUrl}/api/open/v1/content/generate`,
              headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
              body: {
                topic: this.getNodeParameter('topic', i),
                platform: this.getNodeParameter('platform', i) === 'all' ? undefined : this.getNodeParameter('platform', i),
                tone: this.getNodeParameter('tone', i),
                length: this.getNodeParameter('length', i),
              },
            });
            returnData.push({ json: response });
          } else if (operation === 'create') {
            const response = await this.helpers.httpRequest({
              method: 'POST',
              url: `${baseUrl}/api/open/v1/content`,
              headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
              body: {
                title: this.getNodeParameter('title', i) || undefined,
                content: this.getNodeParameter('content', i),
                platforms: this.getNodeParameter('platforms', i),
                scheduledAt: this.getNodeParameter('scheduledAt', i) || undefined,
              },
            });
            returnData.push({ json: response });
          } else if (operation === 'getAll') {
            const response = await this.helpers.httpRequest({
              method: 'GET',
              url: `${baseUrl}/api/open/v1/content`,
              headers: { 'Authorization': `Bearer ${apiKey}` },
            });
            returnData.push({ json: response });
          } else if (operation === 'publish') {
            const response = await this.helpers.httpRequest({
              method: 'POST',
              url: `${baseUrl}/api/open/v1/content/${this.getNodeParameter('contentId', i)}/publish`,
              headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            });
            returnData.push({ json: response });
          }
        } else if (resource === 'analytics' && operation === 'get') {
          const response = await this.helpers.httpRequest({
            method: 'GET',
            url: `${baseUrl}/api/open/v1/analytics`,
            headers: { 'Authorization': `Bearer ${apiKey}` },
            qs: {
              platform: this.getNodeParameter('platform', i) === 'all' ? undefined : this.getNodeParameter('platform', i),
              days: this.getNodeParameter('days', i),
            },
          });
          returnData.push({ json: response });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message } });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error);
      }
    }

    return [returnData];
  }
}

module.exports = { PostFlow };
