const { AsyncComponent } = require('@vizality/components');
const { Flux, getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

const Editor = require('./Editor');

const QuickCode = React.memo(props => {
  return (
    <>
      <Editor {...props} />
    </>
  );
});

module.exports = AsyncComponent.from((async () => {
  const windowStore = await getModule('getWindow');
  return Flux.connectStores([ windowStore, vizality.api.settings.store ], () => ({
    guestWindow: windowStore.getWindow('DISCORD_VIZALITY_CUSTOM_CSS'),
    windowOnTop: windowStore.getIsAlwaysOnTop('DISCORD_VIZALITY_CUSTOM_CSS'),
    ...vizality.api.settings._fluxProps('quick-code')
  }))(QuickCode);
})());

