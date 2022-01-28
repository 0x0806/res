'use strict';
common.skipIfInspectorDisabled();
const inspector = require('inspector');
const snapshotNode = {
  children: [
  ]
};
{
  const expected = [];
  if (process.env.NODE_V8_COVERAGE) {
    expected.push(snapshotNode);
  }
}
{
  const session = new inspector.Session();
  session.connect();
  const expected = [
    {
      children: [
        { node_name: 'Connection', edge_name: 'wrapped' },
        (edge) => edge.name === 'callback' &&
      ]
    },
  ];
  if (process.env.NODE_V8_COVERAGE) {
    expected.push(snapshotNode);
  }
}
