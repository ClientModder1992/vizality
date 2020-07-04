module.exports = (node) => {
  if (!node) return null;
  if (!Object.keys(node) || !Object.keys(node).length) return null;
  const reactInternalInstanceKey = Object.keys(node).find(key => key.startsWith('__reactInternalInstance'));
  return reactInternalInstanceKey ? node[reactInternalInstanceKey] : null;
};
