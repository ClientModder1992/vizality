const { React } = require('vizality/webpack');

module.exports = React.memo(
  (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <g fill="currentColor">
      <path
        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1z M15 5H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z">
      </path>
    </g>
  </svg>
);
