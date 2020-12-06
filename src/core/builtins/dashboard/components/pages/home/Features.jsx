const { Button, Icon } = require('@vizality/components');
const { React } = require('@vizality/react');

const Card = React.memo(({ icon, header, description, buttonText, path }) => {
  return (
    <div className='vz-dashboard-home-features-card-wrapper'>
      <div className='vz-dashboard-home-features-card'>
        <Icon name={icon} className='vz-dashboard-home-features-icon-wrapper' iconClassName='vz-dashboard-home-features-icon' width={'100%'} height={'100%'} />
        <div className='vz-dashboard-home-features-card-header'>
          {header}
        </div>
        <div className='vz-dashboard-home-features-card-body'>
          {description}
        </div>
        <div className='vz-dashboard-home-features-card-footer'>
          <Button
            className='vz-dashboard-home-features-button'
            onClick={() => vizality.api.router.navigate(path)}
            size={Button.Sizes.LARGE}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
});

module.exports = React.memo(() => {
  return (
    <div className='vz-dashboard-home-features-wrapper'>
      <div className='vz-dashboard-home-features'>
        <Card
          icon='Plugin'
          header='Discover Plugins'
          description='Explore our vast collection of official plugins. Plugins can add just about any new feature you can imagine to Discord.'
          buttonText='Browse Plugins'
          path='/dashboard/plugins/discover'
        />
        <Card
          icon='Theme'
          header='Discover Themes'
          description='Explore our vast collection of official themes. Themes can change just small portions of the app or they can be full-blown redesigns.'
          buttonText='Browse Themes'
          path='/dashboard/themes/discover'
        />
        <Card
          icon='UnknownUser'
          header='Become a Developer'
          description='Find out what it takes to start making your own plugins and themes. Come check out the guidelines and all the info you need to become an addon developer for Vizality.'
          buttonText='Learn How'
          path='/dashboard/developers'
        />
        <Card
          icon='Science'
          header='Read the Docs'
          description='Read about all the building blocks and tools we provide to make building plugins and themes easier for you.'
          buttonText='Start Reading'
          path='/dashboard/documentation'
        />
      </div>
    </div>
  );
});
