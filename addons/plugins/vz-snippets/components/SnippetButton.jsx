const { Icon, Tooltip } = require('@components');
const { joinClassNames } = require('@utilities');
const { getModule } = require('@webpack');
const { Messages } = require('@i18n');
const { React } = require('@react');

// @todo: Figure out a way to re-enable the button if the snippet gets removed. Requires reload for now.
module.exports = class SnippetButton extends React.Component {
  render () {
    const classes = {
      ...getModule('button', 'wrapper', 'disabled'),
      ...getModule('icon', 'isHeader')
    };

    const applied = Object.keys(this.props.main.snippets).includes(`_${this.props.message.id}`);
    return (
      <div className={joinClassNames('vizality-snippet-apply', { applied })}>
        <Tooltip className={classes.button} text={applied ? Messages.VIZALITY_SNIPPET_APPLIED : Messages.VIZALITY_SNIPPET_APPLY} position='top'>
          <Icon name='Science'/*wrapperClassName={classes.icon} type={applied ? 'remove-circle' : 'add-circle'}*/
            onClick={() => {
              if (!applied) {
                this.props.main._applySnippet(this.props.message).then(() => this.forceUpdate()); // yes ik its ew
              } else {
                this.props.main._removeSnippet(this.props.message).then(() => this.forceUpdate()); // yes ik its ew
              }
            }}></Icon>
        </Tooltip>
      </div>
    );
  }
};
