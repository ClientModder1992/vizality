import React from 'react';

export default {
  UpToDate: () => <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
    <path
      fill='#43b581'
      d='M11.19 1.36l-7 3.11C3.47 4.79 3 5.51 3 6.3V11c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6.3c0-.79-.47-1.51-1.19-1.83l-7-3.11c-.51-.23-1.11-.23-1.62 0zm-1.9 14.93L6.7 13.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l5.88-5.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.59 6.59c-.38.39-1.02.39-1.41 0z'
    />
  </svg>,
  Update: ({ color, animated }) =>
    <svg className={animated ? 'animated' : ''} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
      <path
        fill={color || '#faa61a'}
        d='M10.997,8.747v3.68c0,0.35,0.19,0.68,0.49,0.86l3.12,1.85c0.36,0.21,0.82,0.09,1.03-0.26c0.21-0.36,0.1-0.82-0.26-1.03 l-2.87-1.71v-3.4c-0.01-0.4-0.35-0.74-0.76-0.74S10.997,8.337,10.997,8.747z'
      />
      <path
        fill={color || '#faa61a'}
        d='M20.997,9.497v-5.29c0-0.45-0.54-0.67-0.85-0.35l-1.78,1.78c-1.81-1.81-4.39-2.85-7.21-2.6c-4.19,0.38-7.64,3.75-8.1,7.94 c-0.6,5.42,3.63,10.02,8.94,10.02c4.59,0,8.38-3.44,8.93-7.88c0.07-0.6-0.4-1.12-1-1.12c-0.5,0-0.92,0.37-0.98,0.86 c-0.43,3.49-3.44,6.19-7.05,6.14c-3.71-0.05-6.84-3.18-6.9-6.9c-0.06-3.9,3.11-7.1,7-7.1c1.93,0,3.68,0.79,4.95,2.05l-2.09,2.09c-0.32,0.32-0.1,0.86,0.35,0.86h5.29C20.777,9.997,20.997,9.777,20.997,9.497z'
      />
    </svg>,
  Paused: () => <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
    <path
      fill='#faa61a'
      d='M10 16c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55.45 1 1 1zm2-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm2-4c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1s-1 .45-1 1v6c0 .55.45 1 1 1z'
    />
  </svg>,
  Error: () => <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
    <path
      fill='#f04747'
      d='M12 7c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1s-1-.45-1-1V8c0-.55.45-1 1-1zm-.01-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-3h-2v-2h2v2z'
    />
  </svg>,

  Vizality: (props) => <svg {...props} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 447 447'>
    <path
      fill='currentColor'
      d='M387.3,100.3c-11.9-11.9-31.2-11.9-43.1,0l-65.15,65.15l-48.6-48.6L295.6,51.7c11.9-11.9,11.9-31.2,0-43.1 c-11.9-11.9-31.2-11.9-43.1,0l-65.15,65.15L172.7,59.1c-2.7-2.7-7-2.7-9.7,0l-24.1,24.1c-2.7,2.7-2.7,7,0,9.7l4.8,4.8l-80.2,80.2 c-17,17-17,44.6,0,61.6l27.1,27.1l-24.2,24.2c-2.7,2.7-2.7,7,0,9.7l10.065,10.065C59.842,331.969,61.344,362.944,81,382.6l62.7,62.7 c2.7,2.7,7.1,2.9,9.8,0.2s2.7-7,0-9.7L90.7,373c-14.347-14.257-15.819-36.63-4.437-52.637L95.4,329.5c2.7,2.6,7,2.6,9.7,0l24.2-24.2 l27.1,27.1c16.9,17,44.6,17,61.6,0l80.2-80.2l4.8,4.8c2.7,2.7,7,2.7,9.7,0l24.1-24.1c2.7-2.7,2.7-7,0-9.7l-14.65-14.65l65.15-65.15 C399.2,131.5,399.2,112.2,387.3,100.3z'
    />
  </svg>,
  Plugin: (props) => <svg {...props} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
    <path
      fill='currentColor'
      d='M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z'
    />
  </svg>,
  Theme: (props) => <svg {...props} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
    <path
      fill='currentColor'
      d='M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z'
    />
  </svg>
};
