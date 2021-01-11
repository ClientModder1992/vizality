import React, { memo } from 'react';

import { AsyncComponent } from '@vizality/components';
import { Flux, getModule } from '@vizality/webpack';

import Editor from './Editor';

const QuickCode = memo(props => {
  return (
    <>
      <Editor {...props} />
    </>
  );
});

export default AsyncComponent.from((async () => {
  const windowStore = await getModule('getWindow');
  return Flux.connectStores([ windowStore, vizality.api.settings.store ], () => ({
    guestWindow: windowStore.getWindow('DISCORD_VIZALITY_CUSTOM_CSS'),
    windowOnTop: windowStore.getIsAlwaysOnTop('DISCORD_VIZALITY_CUSTOM_CSS'),
    ...vizality.api.settings._fluxProps('vz-quick-code')
  }))(QuickCode);
})());

