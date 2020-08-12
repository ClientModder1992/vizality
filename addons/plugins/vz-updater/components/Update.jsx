const { React, i18n: { Messages } } = require('@webpack');
const { Button } = require('@components');

const Icons = require('./Icons');

class Update extends React.PureComponent {
  constructor () {
    super();
    this.plugin = vizality.manager.plugins.get('vz-updater');
  }

  render () {
    const { name, icon, repo, commits, updating, onSkip, onDisable } = this.props;
    return <div className='update'>
      <div className='title'>
        <div className='icon'>
          {React.createElement(Icons[icon])}
        </div>
        <div className='name'>{name}</div>
        <div className='actions'>
          {updating
            ? <Button color={Button.Colors.GREEN} disabled>
              {Messages.VIZALITY_UPDATES_UPDATING_ITEM}
            </Button>
            : <>
              <Button look={Button.Looks.OUTLINED} color={Button.Colors.RED} onClick={onSkip}>
                {Messages.VIZALITY_UPDATES_SKIP}
              </Button>
              <Button color={Button.Colors.RED} onClick={onDisable}>
                {Messages.VIZALITY_UPDATES_DISABLE}
              </Button>
            </>}
        </div>
      </div>
      <div className='summary'>
        {commits.map(commit => <div key={commit.id}>
          <a href={`https://github.com/${repo}/commit/${commit.id}`} target='_blank'>
            <code>{commit.id.substring(0, 7)}</code>
          </a>
          <span>{commit.message} - {commit.author}</span>
        </div>)}
      </div>
    </div>;
  }
}

module.exports = Update;
