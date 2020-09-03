const { React } = require('@webpack');

module.exports = React.memo(
  (props) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 21" {...props}>
    <path
      fill='currentColor'
      d="M1.60772 16C1.60772 17.1 2.49904 18 3.58843 18H11.5112C12.6006 18 13.4919 17.1 13.4919 16V6C13.4919 4.9 12.6006 4 11.5112 4H3.58843C2.49904 4 1.60772 4.9 1.60772 6V16ZM4.74714 8.17C4.83876 8.0773 4.94759 8.00375 5.06739 7.95357C5.1872 7.90339 5.31563 7.87756 5.44534 7.87756C5.57504 7.87756 5.70347 7.90339 5.82328 7.95357C5.94309 8.00375 6.05191 8.0773 6.14354 8.17L7.54984 9.59L8.95614 8.17C9.04782 8.07742 9.15667 8.00398 9.27647 7.95387C9.39627 7.90377 9.52467 7.87798 9.65433 7.87798C9.784 7.87798 9.9124 7.90377 10.0322 7.95387C10.152 8.00398 10.2608 8.07742 10.3525 8.17C10.4442 8.26258 10.517 8.37249 10.5666 8.49346C10.6162 8.61442 10.6417 8.74407 10.6417 8.875C10.6417 9.00593 10.6162 9.13558 10.5666 9.25654C10.517 9.37751 10.4442 9.48742 10.3525 9.58L8.94623 11L10.3525 12.42C10.4442 12.5126 10.517 12.6225 10.5666 12.7435C10.6162 12.8644 10.6417 12.9941 10.6417 13.125C10.6417 13.2559 10.6162 13.3856 10.5666 13.5065C10.517 13.6275 10.4442 13.7374 10.3525 13.83C10.2608 13.9226 10.152 13.996 10.0322 14.0461C9.9124 14.0962 9.784 14.122 9.65433 14.122C9.52467 14.122 9.39627 14.0962 9.27647 14.0461C9.15667 13.996 9.04782 13.9226 8.95614 13.83L7.54984 12.41L6.14354 13.83C6.05185 13.9226 5.943 13.996 5.8232 14.0461C5.7034 14.0962 5.575 14.122 5.44534 14.122C5.31567 14.122 5.18727 14.0962 5.06747 14.0461C4.94768 13.996 4.83883 13.9226 4.74714 13.83C4.65545 13.7374 4.58272 13.6275 4.5331 13.5065C4.48348 13.3856 4.45794 13.2559 4.45794 13.125C4.45794 12.9941 4.48348 12.8644 4.5331 12.7435C4.58272 12.6225 4.65545 12.5126 4.74714 12.42L6.15344 11L4.74714 9.58C4.65533 9.48749 4.58249 9.3776 4.53279 9.25662C4.4831 9.13565 4.45752 9.00597 4.45752 8.875C4.45752 8.74403 4.4831 8.61435 4.53279 8.49338C4.58249 8.3724 4.65533 8.26251 4.74714 8.17ZM11.0161 1L10.3129 0.29C10.1347 0.11 9.87716 0 9.61967 0H5.48C5.22251 0 4.96502 0.11 4.78675 0.29L4.0836 1H1.60772C1.06303 1 0.617371 1.45 0.617371 2C0.617371 2.55 1.06303 3 1.60772 3H13.4919C14.0366 3 14.4823 2.55 14.4823 2C14.4823 1.45 14.0366 1 13.4919 1H11.0161Z"
    />
  </svg>
);
