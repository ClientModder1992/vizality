const { React } = require('vizality/webpack');

module.exports = React.memo(
  (props) => <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' {...props}>
    <path
      fill='#4F545C' fillRule='evenodd' clipRule='evenodd'
      d='M16 7.64528C16 8.43528 14.72 9.02528 14.48 9.73528C14.24 10.4453 14.92 11.7353 14.48 12.3253C14.04 12.9153 12.64 12.6753 12.02 13.1253C11.4 13.5753 11.23 14.9653 10.48 15.2153C9.73 15.4653 8.81 14.4153 8.01 14.4153C7.21 14.4153 6.26 15.4153 5.54 15.2153C4.82 15.0153 4.62 13.5753 4 13.1253C3.38 12.6753 2 12.9453 1.54 12.3253C1.08 11.7053 1.77 10.4853 1.54 9.73528C1.31 8.98528 0 8.43528 0 7.64528C0 6.85528 1.28 6.26528 1.52 5.55528C1.76 4.84528 1.08 3.55528 1.52 2.96528C1.96 2.37528 3.37 2.61528 4 2.16528C4.63 1.71528 4.78 0.325284 5.53 0.0452838C6.28 -0.234716 7.2 0.875284 8 0.875284C8.8 0.875284 9.75 -0.124716 10.47 0.0752838C11.19 0.275284 11.38 1.71528 12 2.16528C12.62 2.61528 14 2.34528 14.46 2.96528C14.92 3.58528 14.23 4.80528 14.46 5.55528C14.69 6.30528 16 6.85528 16 7.64528Z'
    />
    <path
      fill='white'
      d='M7.4 11.2153L4 8.66529L5 7.30529L7 8.83529L10.64 4.04529L12 5.04529L7.4 11.2153Z'
    />
  </svg>
);
