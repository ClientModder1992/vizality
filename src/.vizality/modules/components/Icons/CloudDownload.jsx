const { React } = require('@react');

module.exports = React.memo(
  (props) => <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 21' {...props}>
    <path
      fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'
      d='M8.59741 15.0117L12.5588 19.0117L16.5202 15.0117 M12.5588 10.0117V19.0117 M21.3531 16.1017C22.2141 15.4903 22.8598 14.6178 23.1965 13.6108C23.5331 12.6038 23.5432 11.5147 23.2253 10.5015C22.9074 9.48829 22.278 8.60374 21.4285 7.97621C20.5789 7.34869 19.5535 7.01082 18.5009 7.01165H17.2531C16.9552 5.83953 16.3979 4.7509 15.6231 3.82773C14.8482 2.90456 13.8761 2.17091 12.7798 1.68201C11.6836 1.1931 10.4918 0.961679 9.2941 1.00517C8.09645 1.04866 6.92417 1.36592 5.86552 1.93308C4.80688 2.50023 3.88944 3.3025 3.18229 4.27948C2.47514 5.25646 1.99671 6.3827 1.783 7.5734C1.56929 8.76411 1.62588 9.98825 1.9485 11.1537C2.27113 12.3191 2.85139 13.3954 3.64559 14.3017'
    />
  </svg>
);
