const { React, React: { useReducer } } = require('@vizality/react');
const { Switch } = require('@vizality/components');
const { getModule } = require('@vizality/webpack');

module.exports = React.memo(({ manifest, isEnabled, onToggle }) => {
  const [ , forceUpdate ] = useReducer(x => x + 1, 0);
  const authors = [].concat(manifest.author);
  const authorIds = [].concat(manifest.authorId);

  const tempAvatars = [
    'https://extensions-discovery-images.twitch.tv/wi08ebtatdc7oj83wtl9uxwz807l8b/1.1.92/logo659f7669-7978-4c89-9824-0fc19d37ef93',
    'https://zfh2irvx2jb4s60f02jq0ajm8vwgka.ext-twitch.tv/zfh2irvx2jb4s60f02jq0ajm8vwgka/1.0.19/41bd9c99a4eece8e06a904ed8d836fbe/internal/icon/130/325/636459721332061885.png',
    'https://lgpf9j7y8n1ja9onkb6w7bxfkhk2zl.ext-twitch.tv/lgpf9j7y8n1ja9onkb6w7bxfkhk2zl/1.1.5/c1307fe2c0c568cec21214518e6e2888/internal/icon/130/121/636459646678738355.png',
    'https://extensions-discovery-images.twitch.tv/qfo4cabtj30xwc9isonpmdpevbkm2c/0.0.1/logoba06d652-2a05-4ea0-95ce-734ff5c59114',
    'https://extensions-discovery-images.twitch.tv/bttsqjy6dnv05acplp5vy0mflgrh3z/2.1.2/logoc4a9c200-59b8-4281-95b9-981ba714a1fb',
    'https://extensions-discovery-images.twitch.tv/kfk78htcdbpe5gfpzbzcmnhzhe5vud/0.0.8/logo6dfa7252-8958-45e4-9e41-00dc021cd3c9',
    'https://extensions-discovery-images.twitch.tv/a0nm5zyyzi0tgb805iaflj1yd2c5x5/2019.10/logo3d070295-faf5-4ed2-9a5d-9deeba28011b',
    'https://extensions-discovery-images.twitch.tv/oafn7vvzfyzyccwrwrt233221oe5wq/0.1.17/logoed4c3440-0900-4a92-807c-d4923f3940d8',
    'https://fe5a78xkj1lnk9wefpk295p6x3dsvl.ext-twitch.tv/fe5a78xkj1lnk9wefpk295p6x3dsvl/0.1.3/51546e027ad69d8b77d131617560c237/internal/icon/150/202/636594938527406363.png',
    'https://extensions-discovery-images.twitch.tv/kr7m1hz7esldlrptruk0fd76l6yq36/1.1.12/logoa9a7abd8-6c3f-4379-b1cd-bc3ca242e1a2',
    'https://extensions-discovery-images.twitch.tv/qcxdzgqw0sd1u50wqtwodjfd5dmkxz/1.0.0/logob0d92bd7-06d2-442a-b260-e70aacf6d09e'
  ];

  return (
    <div className='vz-addon-card-header'>
      <div className='vz-addon-card-icon'>
        <img className='vz-addon-card-icon-img' src={tempAvatars[Math.floor(Math.random() * tempAvatars.length)]} />
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
