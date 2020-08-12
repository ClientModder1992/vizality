const { React, getModuleByDisplayName, getModule } = require('@webpack');
const { AsyncComponent, Icon } = require('@components');
const { route: { goTo } } = require('@discord');

const AccountPanel = AsyncComponent.from(getModuleByDisplayName('AccountConnected', true));

class MainNav extends React.Component {
  render () {
    return (
      <nav className='vizality-main-nav'>
        <div className='vizality-main-nav__section-left'>
          <div className='vizality-main-nav__logo'></div>
          <div className='vizality-main-nav__link' onClick={() => goTo('dm')}>
            <Icon wrapperClassName='vizality-main-nav__link-icon-wrapper' type='mail'></Icon>
            <p className='vizality-main-nav__link-text'>Messages</p>
          </div>
          <div className='vizality-main-nav__link' onClick={() => goTo('discover')}>
            <Icon wrapperClassName='vizality-main-nav__link-icon-wrapper' type='discover'></Icon>
            <p className='vizality-main-nav__link-text'>Discover</p>
          </div>
          <div className='vizality-main-nav__link' onClick={() => goTo('friends')}>
            <Icon wrapperClassName='vizality-main-nav__link-icon-wrapper' type='users'></Icon>
            <p className='vizality-main-nav__link-text'>Friends</p>
          </div>
          <div className='vizality-main-nav__link' onClick={() => goTo('library')}>
            <Icon wrapperClassName='vizality-main-nav__link-icon-wrapper' type='backpack'></Icon>
            <p className='vizality-main-nav__link-text'>Library</p>
          </div>
        </div>
        <div className='vizality-main-nav__section-middle'>
          <div className='vizality-main-nav__search'>
            <div className='vizality-main-nav__search-inner'>
              <input className='vizality-main-nav__search-input' type='text' placeholder='Search' />
              <Icon wrapperClassName='vizality-main-nav__search-icon-wrapper' type='search'></Icon>
            </div>
          </div>
        </div>
        <div className='vizality-main-nav__section-right'>
          <div className='vizality-main-nav__inbox' onClick={() => getModule('TOGGLE_INBOX').TOGGLE_INBOX.action()}>
            <Icon wrapperClassName='vizality-main-nav__inbox-icon-wrapper' type='notification-bell'></Icon>
          </div>
          <div className='vizality-main-nav__account-panel'>
            <div className='vizality-main-nav__account-panel-inner'>
              <AccountPanel />
              {/* <div className='vizality-main-navigation-account-avatar-container'>
                <div className='vizality-main-navigation-account-avatar image-33JSyf' style={{ backgroundImage: `url(${this.userAvatarURL})` }}></div>
              </div>
              <div className='vizality-main-navigation-account-details-outer'>
                <div className='vizality-main-navigation-account-details-inner'>
                  <div className='vizality-main-navigation-account-username-container'>
                    <span className='vizality-main-navigation-account-username'>{this.username}</span>
                  </div>
                  <div class='vizality-main-navigation-account-status-container'>
                    <div className={`${this.userStatus} vizality-main-navigation-account-status-indicator`}></div>
                    <div className='vizality-main-navigation-account-activity-container'>
                      <span className='vizality-main-navigation-account-activity'>{this.activity ? this.activityTypeText + this.activity.name : ''}</span>
                    </div>
                  </div>
                </div>
                <icon className='tc-icon vizality-main-navigation-account-arrow'></icon>
              </div> */}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

module.exports = MainNav;
