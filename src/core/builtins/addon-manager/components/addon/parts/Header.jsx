const { React, React: { useReducer } } = require('@vizality/react');
const { Switch } = require('@vizality/components');
const { getModule } = require('@vizality/webpack');

module.exports = React.memo(({ manifest, isEnabled, onToggle }) => {
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);
  const authors = [].concat(manifest.author);
  const authorIds = [].concat(manifest.authorId);

  return (
    <div className='vz-addon-card-header'>
      <div className='vz-addon-card-icon'>
        <img className='vz-addon-card-icon-img' src={'https://www.w3schools.com/w3images/avatar5.png'} />
      </div>
      <div className='vz-addon-card-metadata'>
        <div className='vz-addon-card-name-author'>
          <div className='vz-addon-card-name'>{manifest.name}</div>
          <span className='vz-addon-card-version'>{manifest.version}</span>
        </div>
        <div className='vz-addon-card-authors'>
          {authors.length && authors.map((author, i) =>
            <div
              className='vz-addon-card-author'
              vz-author-id={authorIds.length && authorIds[i] ? authorIds[i] : null}
              onClick={async (e) => {
                e.stopPropagation();
                if (!authorIds.length || !authorIds[i]) return;
                // @todo This doesn't work, fix it.
                return Promise.all(getModule('getUser').getUser(authorIds[i]))
                  .then(() => getModule('open', 'fetchProfile').open(authorIds[i]))
                  .catch(() => vizality.api.notices.sendToast(`some-random-${(Math.random().toString(36) + Date.now()).substring(2, 6)}`, {
                    header: 'User Not Found',
                    content: `We were unable to locate that user.`,
                    type: 'error'
                  }));
              }}
            >
              {author}
            </div>)
          }
        </div>
      </div>
      <div className='vz-addon-card-toggle-wrapper'>
        <Switch
          className='vz-addon-card-toggle'
          value={isEnabled}
          onChange={v => {
            onToggle(v.target.checked);
            forceUpdate();
          }}
        />
      </div>
    </div>
  );
});
