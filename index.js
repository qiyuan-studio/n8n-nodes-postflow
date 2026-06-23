const { PostFlow } = require('./nodes/PostFlow/PostFlow.node');
const { PostFlowApi } = require('./credentials/PostFlowApi.credentials');

module.exports = {
  nodeTypes: [PostFlow],
  credentialTypes: [PostFlowApi],
};
