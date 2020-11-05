const { getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

const SearchBar = require('./SearchBar');

module.exports = React.memo(({ catchLine, subtext, placeholder, onSearch }) => {
  const { base } = getModule('base');
  const { size24, size16 } = getModule('size24');
  const { headerImage, headerContentWrapper, headerContent, searchHeader,
    searchTitle, searchSubtitle } = getModule('headerContentWrapper');

  return (
    <div className={searchHeader}>
      <img src='https://discord.com/assets/3e0acf6d69894a5d20deb7c513cd1412.svg' alt='' className={headerImage}/>
      <div className={headerContentWrapper}>
        <div className={headerContent}>
          <h3 className={`${searchTitle} ${size24} ${base}`}>{catchLine}</h3>
          {subtext && <div className={`${searchSubtitle} ${size16}`}>{subtext}</div>}
          <SearchBar placeholder={placeholder} onSearch={onSearch}/>
        </div>
      </div>
    </div>
  );
});
