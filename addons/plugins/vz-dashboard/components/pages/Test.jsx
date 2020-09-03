const { SVG: { WaveDivider } } = require('@components');
const { React } = require('@webpack');

const Layout = require('../parts/Layout');

module.exports = React.memo(() => {
  return (
    <Layout>
      <WaveDivider />
    </Layout>
  );
});
