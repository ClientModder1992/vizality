const { Menu, Icon } = require('@components');
const { React } = require('@react');

module.exports = class ContextMenu extends React.PureComponent {
  render () {
    return (
      <>
        <Menu.MenuSeparator/>
        <Menu.MenuItem id='vizality' label='Vizality' vizalityContextMenu>
          <Menu.MenuItem
            id={'home'}
            label={'Home'}
            icon={() => <Icon name='Home' width='100%' height='100%' />}
            action={() => vizality.api.router.go('/dashboard/home')}
          />
          <Menu.MenuItem
            id={'settings'}
            label={'Settings'}
            icon={() => <Icon name='Gear' width='100%' height='100%' />}
            action={() => vizality.api.router.go('/dashboard/settings')}
          />
          <Menu.MenuItem
            id={'plugins'}
            label={'Plugins'}
            icon={() => <Icon name='Plugin' width='100%' height='100%' />}
            action={() => vizality.api.router.go('/dashboard/plugins')}
          />
          <Menu.MenuItem
            id={'themes'}
            label={'Themes'}
            icon={() => <Icon name='Theme' width='100%' height='100%' />}
            action={() => vizality.api.router.go('/dashboard/themes')}
          />
          <Menu.MenuItem
            id={'snippets'}
            label={'Snippets'}
            icon={() => <Icon name='InlineCode' width='100%' height='100%' />}
            action={() => vizality.api.router.go('/dashboard/snippets')}
          />
          <Menu.MenuItem
            id={'theme-editor'}
            label={'Theme Editor'}
            icon={() => <Icon name='Editor' width='100%' height='100%' />}
            disabled={true}
          />
          <Menu.MenuSeparator/>
          <Menu.MenuItem
            id={'developers'}
            label={'Developers'}
            icon={() => <Icon name='UnknownUser' width='100%' height='100%' />}
            action={() => vizality.api.router.go('/dashboard/developers')}
          />
          <Menu.MenuItem
            id={'documentation'}
            label={'Documentation'}
            icon={() => <Icon name='Science' width='100%' height='100%' />}
            action={() => vizality.api.router.go('/dashboard/documentation')}
          >
            <Menu.MenuItem
              id={'getting-started'}
              label={'Getting Started'}
              action={() => vizality.api.router.go('/dashboard/documentation/getting-started')}
            />
            <Menu.MenuItem
              id={'plugins'}
              label={'Plugins'}
              action={() => vizality.api.router.go('/dashboard/documentation/plugins')}
            />
            <Menu.MenuItem
              id={'themes'}
              label={'Themes'}
              action={() => vizality.api.router.go('/dashboard/documentation/themes')}
            />
            <Menu.MenuItem
              id={'screenshots'}
              label={'Screenshots'}
              action={() => vizality.api.router.go('/dashboard/documentation/screenshots')}
            />
            <Menu.MenuItem
              id={'icons'}
              label={'Components'}
              action={() => vizality.api.router.go('/dashboard/documentation/components/icons')}
            />
            <Menu.MenuItem
              id={'markdown'}
              label={'Markdown'}
              action={() => vizality.api.router.go('/dashboard/documentation/markdown')}
            />
            <Menu.MenuItem
              id={'error-test'}
              label={'Error Test'}
              action={() => vizality.api.router.go('/dashboard/documentation/error-test')}
            />
            <Menu.MenuItem
              id={'test'}
              label={'Test'}
              action={() => vizality.api.router.go('/dashboard/documentation/test')}
            />
          </Menu.MenuItem>
          <Menu.MenuItem
            id={'experiments'}
            label={'Experiments'}
            icon={() => <Icon name='Experiment' width='100%' height='100%' />}
            action={() => vizality.api.router.go('/dashboard/experiments')}
          />
          <Menu.MenuSeparator/>
          <Menu.MenuItem
            id={'updates'}
            label={'Updates'}
            icon={() => <Icon name='CloudDownload' width='100%' height='100%' />}
            action={() => vizality.api.router.go('/dashboard/updates')}
          />
          <Menu.MenuItem
            id={'changelog'}
            label={'Changelog'}
            icon={() => <Icon name='History' width='100%' height='100%' />}
            action={() => vizality.api.router.go('/dashboard/changelog')}
          />
        </Menu.MenuItem>
      </>
    );
  }
};
