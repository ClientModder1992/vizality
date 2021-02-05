import React from 'react';

import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

export default () => {
  const DragSourceConnectedGuild = getModule('LurkingGuild');
  const { DecoratedComponent } = DragSourceConnectedGuild.default;

  const g = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current;
  const ogUseMemo = g.useMemo;
  const ogUseState = g.useState;
  const ogUseEffect = g.useEffect;
  const ogUseLayoutEffect = g.useLayoutEffect;
  const ogUseCallback = g.useCallback;
  const ogUseContext = g.useContext;
  const ogUseRef = g.useRef;

  g.useMemo = (f) => f();
  g.useState = (v) => [ v, () => void 0 ];
  g.useCallback = (v) => v;
  g.useContext = (ctx) => ctx._currentValue;
  g.useEffect = () => null;
  g.useLayoutEffect = () => null;
  g.useRef = () => ({});

  const Guild = new DecoratedComponent({ guildId: null }).type;

  g.useMemo = ogUseMemo;
  g.useState = ogUseState;
  g.useCallback = ogUseCallback;
  g.useContext = ogUseContext;
  g.useEffect = ogUseEffect;
  g.useLayoutEffect = ogUseLayoutEffect;
  g.useRef = ogUseRef;

  patch('vz-attributes-guilds', Guild.prototype, 'render', function (_, res) {
    // This was needed for guilds with outages, not sure if it's needed anymore.
    if (!res) return _;

    const { audio, badge: mentions, selected, unread, video, screenshare, guildId } = this.props;

    res.props['vz-guild-id'] = guildId;
    res.props['vz-unread'] = Boolean(unread) && '';
    res.props['vz-selected'] = Boolean(selected) && '';
    res.props['vz-audio'] = Boolean(audio) && '';
    res.props['vz-video'] = Boolean(video) && '';
    res.props['vz-screenshare'] = Boolean(screenshare) && '';
    res.props['vz-mentioned'] = Boolean(mentions > 0) && '';

    return res;
  });

  return () => unpatch('vz-attributes-guilds');
};
