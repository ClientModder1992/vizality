import { findInReactTree } from '@vizality/util/react';
import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';
import { Regexes } from '@vizality/constants';

export const labels = [ 'Components' ];

export default main => {
  const Anchor = getModule(m => m.default?.displayName === 'Anchor');
  const { anchor } = getModule('anchor', 'anchorUnderlineOnHover');
  const vizalityRegex = new RegExp(`${Regexes.DISCORD}/vizality`, 'i');
  const vizalityProtocolRegex = new RegExp('^(vizality://)', 'i');
  const userRegex = new RegExp(`${Regexes.DISCORD}/users/`, 'i');
  const discordRegex = new RegExp(`${Regexes.DISCORD}`, 'i');

  patch('vz-attributes-anchors', Anchor, 'default', (_, res) => {
    try {
      const props = findInReactTree(res, r => r.className?.includes(anchor) && r.href);
      if (!props) return;
      /*
       * Make Vizality route links open in the app.
       */
      if (vizalityRegex.test(props.href)) {
        const route = props.href?.replace(discordRegex, '');
        props.onClick = e => {
          e.preventDefault();
          vizality.api.routes.navigateTo(route);
        };
      }
      /*
       * Make Vizality protocol links open in the app.
       */
      if (vizalityProtocolRegex.test(props.href)) {
        const route = props.href?.replace(vizalityProtocolRegex, '');
        props.onClick = e => {
          e.preventDefault();
          vizality.api.routes.navigateTo(`/vizality/${route}`);
        };
      }
      /*
       * Make user links open in user profile modals in the app.
       */
      if (userRegex.test(props.href)) {
        const userId = props.href?.replace(userRegex, '');
        props.onClick = e => {
          e.preventDefault();
          if (!userId) return;
          // @todo Use Discord module for this after it's set up.
          getModule('getUser').getUser(userId)
            .then(() => getModule('open', 'fetchProfile').open(userId))
            .catch(() => vizality.api.notifications.sendToast({
              header: 'User Not Found',
              type: 'User Not Found',
              content: 'That user was unable to be located.',
              icon: 'PersonRemove'
            }));
        };
      }
    } catch (err) {
      return main.error(main._labels.concat(labels.concat('Anchor')), err);
    }
  });
  return () => unpatch('vz-attributes-anchors');
};
