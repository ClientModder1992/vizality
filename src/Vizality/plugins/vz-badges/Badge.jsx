const { React, i18n: { Messages } } = require('vizality/webpack');
const { Clickable, Tooltip, Icons: { badges } } = require('vizality/components');

module.exports = ({ badge, color, onClick }) => {
  const Badge = badges[badge[0].toUpperCase() + badge.toLowerCase().slice(1)];

  return (
    <Tooltip text={Messages[`VIZALITY_BADGES_${badge.toUpperCase()}`]} position='top'>
      <Clickable onClick={onClick} className={`vizality-badge ${badge}`}>
        <Badge style={{ '--badge-color': `#${color}` }}/>
      </Clickable>
    </Tooltip>
  );
};
