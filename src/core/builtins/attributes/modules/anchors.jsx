const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/i;

const getYoutubeVideoId = url => {
  const match = url.match(youtubeRegex);

  return (match && match[2].length === 11)
    ? match[2]
    : null;
};

module.exports = async () => {
  const Anchor = getModule(m => m.default && m.default.displayName === 'Anchor');
  patch('vz-attributes-anchors', Anchor, 'default', (_, res) => {
    if (!res.props || !res.props.href) return res;

    // Make Vizality routes open in the app
    if (new RegExp(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com\/vizality/i).test(res.props.href)) {
      const route = res.props.href.replace(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com\/vizality/i, '');
      res.props.onClick = e => {
        e.preventDefault();
        vizality.api.router.navigate(route);
      };
    }

    // Make user links open in user profile modals in the app
    if (new RegExp(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com\/users\//i).test(res.props.href)) {
      const userId = res.props.href.replace(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com\/users\//i, '');
      res.props.onClick = e => {
        e.preventDefault();
        // @todo This doesn't work, fix it.
        Promise.all(() => getModule('open', 'fetchProfile').open(userId))
          .catch(() => vizality.api.notices.sendToast(`some-random-${(Math.random().toString(36) + Date.now()).substring(2, 6)}`, {
            header: 'User Not Found',
            content: `We were unable to locate that user.`,
            type: 'error'
          }));
      };
    }

    if (new RegExp(youtubeRegex).test(res.props.href)) {
      res.props.onClick = e => {
        e.preventDefault();
        const id = getYoutubeVideoId(res.props.href);
        vizality.api.popups.openWindow({ alwaysOnTop: true, render: props =>
          <iframe
            width='100%'
            height='100%'
            src={`https://www.youtube.com/embed/${id}?autoplay=1`}
            frameBorder='0'
            allowFullScreen='allowfullscreen'
            allow='autoplay'
            {...props}
          />
        }, { width: 494, height: 300 });
      };
    }

    return res;
  });

  return () => unpatch('vz-attributes-anchors');
};
