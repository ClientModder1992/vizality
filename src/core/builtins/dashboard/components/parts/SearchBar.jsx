const { Clickable, Icon } = require('@vizality/components');
const { getModule } = require('@vizality/webpack');
const { Messages } = require('@vizality/i18n');
const { React } = require('@vizality/react');

module.exports = React.memo(({ placeholder, onSearch }) => {
  const { size12 } = getModule('size12');
  const { colorMuted } = getModule('colorMuted');
  const { inputWrapper, inputDefault } = getModule('inputWrapper');
  const mdl1 = getModule('searchBoxInputWrapper');
  const mdl2 = getModule('searchBox', 'search');

  const [ value, setValue ] = React.useState('');
  const [ focused, setFocused ] = React.useState(false);

  return (
    <div className={mdl2.container}>
      <div className={mdl2.search}>
        <div className={`${mdl1.searchBox} ${mdl2.searchBox}`}>
          <div className={`${inputWrapper} ${mdl1.searchBoxInputWrapper}`}>
            <input
              type='text'
              name='search'
              value={value}
              maxLength={100}
              autoComplete='off'
              placeholder={placeholder}
              className={`${inputDefault} ${mdl1.searchBoxInput} ${mdl2.searchBoxInput}`}
              onKeyPress={e => e.which === 13 && onSearch(value) | e.target.blur()}
              onChange={e => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>
          {value.length > 1 && focused && <div className={`${mdl1.cta} ${size12} ${colorMuted}`}>
            {Messages.GUILD_DISCOVERY_SEARCH_ENTER_CTA}
          </div>}
          {value.length > 0
            ? <Clickable className={mdl1.clear} onClick={() => setValue('') | onSearch(null)}>
              <Icon name='CloseCircle' className={`${mdl1.clearIcon} ${mdl2.closeIcon}`} width={24} height={24}/>
            </Clickable>
            : <Icon name='Search' className={`${mdl1.searchIcon} ${mdl2.searchIcon}`} width={24} height={24}/>}
        </div>
      </div>
    </div>
  );
});
