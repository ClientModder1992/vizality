import { getOwnerInstance, findInTree, forceUpdateElement } from '@vizality/util/react';
import { waitForElement } from '@vizality/util/dom';
import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export const labels = [ 'Guilds' ];

export default async main => {
  const { blobContainer } = getModule('blobContainer');
  const { listItem } = getModule('guildSeparator', 'listItem');
  const instance = getOwnerInstance(await waitForElement(`.${blobContainer}`));
  const reactInstance = instance?._reactInternalFiber || instance?._reactInternals;
  const Guild = findInTree(reactInstance, n => n.type?.displayName === 'Guild', { walkable: [ 'return' ] })?.type;
  patch('vz-attributes-guilds', Guild?.prototype, 'render', function (_, res) {
    try {
      /*
       * This was needed for guilds with outages before, not sure if it's still needed.
       */
      if (!res) return _;
      const { audio, badge: mentions, selected, unread, video, screenshare, guildId } = this.props;
      res.props['vz-guild-id'] = guildId;
      res.props['vz-unread'] = Boolean(unread) && '';
      res.props['vz-selected'] = Boolean(selected) && '';
      res.props['vz-audio'] = Boolean(audio) && '';
      res.props['vz-video'] = Boolean(video) && '';
      res.props['vz-screenshare'] = Boolean(screenshare) && '';
      res.props['vz-mentioned'] = Boolean(mentions > 0) && '';
    } catch (err) {
      return main.error(main._labels.concat(labels.concat('Guild')), err);
    }
  });
  setImmediate(() => forceUpdateElement(`.${listItem}`, true));
  return () => unpatch('vz-attributes-guilds');
};
