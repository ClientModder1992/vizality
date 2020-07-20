const { React, getModule, i18n: { Messages } } = require('@webpack');
const { Button } = require('@components');
const { Modal } = require('@components/modal');
const { close: closeModal } = require('vizality/modal');

const Header = require('./Header');

class DonateModal extends React.PureComponent {
  constructor () {
    super();
    this.state = {
      easterEgg: Math.floor(Math.random() * 100) === 69
    };
  }

  render () {
    const { colorStandard } = getModule('colorStandard');

    return <Modal className={`vizality-donate-modal ${colorStandard}`}>
      <Header/>
      <Modal.Content>
        <h3 className='vizality-donate-title'>{Messages.VIZALITY_CUTIE_TITLE}</h3>
        <h4 className='vizality-donate-subtitle'>{Messages.VIZALITY_CUTIE_SUBTITLE}</h4>
        <div className='vizality-donate-tier'>
          <img className='icon' src='https://cdn.discordapp.com/emojis/396521773115637780.png' alt='Tier 1'/>
          <div className='details'>
            <span className='price'>{Messages.VIZALITY_CUTIE_TIER_1_PRICE.format()}</span>
            <span className='perk'>{Messages.VIZALITY_CUTIE_TIER_1_DESC.format()}</span>
          </div>
        </div>
        <div className='vizality-donate-tier'>
          <img className='icon' src='https://cdn.discordapp.com/emojis/580597913512574976.png' alt='Tier 2'/>
          <div className='details'>
            <span className='price'>{Messages.VIZALITY_CUTIE_TIER_2_PRICE.format()}</span>
            <span className='perk'>{Messages.VIZALITY_CUTIE_TIER_2_DESC.format()}</span>
          </div>
        </div>
        <div className='vizality-donate-tier'>
          <img className='icon' src='https://cdn.discordapp.com/emojis/583258319150645248.png' alt='Tier 3'/>
          <div className='details'>
            <span className='price'>{Messages.VIZALITY_CUTIE_TIER_3_PRICE.format()}</span>
            <span className='perk'>{Messages.VIZALITY_CUTIE_TIER_3_DESC.format()}</span>
          </div>
        </div>
        {this.state.easterEgg && <div className='vizality-donate-tier'>
          <img className='icon' src='https://cdn.discordapp.com/emojis/404298286699249664.png' alt='Tier Infinite'/>
          <div className='details'>
            <span className='price'>{Messages.VIZALITY_CUTIE_TIER_EASTER_PRICE.format()}</span>
            <span className='perk'>{Messages.VIZALITY_CUTIE_TIER_EASTER_DESC.format()}</span>
          </div>
        </div>}
      </Modal.Content>
      <Modal.Footer>
        <a href='https://patreon.com/vizality' target='_blank'>
          <Button onClick={() => closeModal()}>{Messages.VIZALITY_CUTIE_DONATE}</Button>
        </a>
        <Button
          onClick={() => closeModal()} look={Button.Looks.LINK}
          color={Button.Colors.TRANSPARENT}
        >
          {Messages.USER_ACTIVITY_NEVER_MIND}
        </Button>
      </Modal.Footer>
    </Modal>;
  }
}

module.exports = DonateModal;
