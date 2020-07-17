const { React, getModule, i18n: { Messages } } = require('vizality/webpack');
const { joinClassNames} = require('vizality/util');
const { Icon, Tooltip } = require('vizality/components');

// @todo: Figure out a way to re-enable the button if the snippet gets removed. Requires reload for now.
class SnippetButton extends React.Component {
  render () {
    const classes = {
      ...getModule('button', 'wrapper', 'disabled'),
      ...getModule('icon', 'isHeader')
    };

    const applied = Object.keys(this.props.main.snippets).includes(`_${this.props.message.id}`);
    return (
      <div className={joinClassNames('vizality-snippet-apply', { applied })}>
        <Tooltip className={classes.button} text={applied ? Messages.VIZALITY_SNIPPET_APPLIED : Messages.VIZALITY_SNIPPET_APPLY} position='top'>
          <Icon wrapperClassName={classes.icon} type={applied ? 'remove-circle' : 'add-circle'}
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
}

module.exports = SnippetButton;
