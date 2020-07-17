const { React, getModuleByDisplayName } = require('vizality/webpack');
const { joinClassNames } = require('vizality/util');
const { AsyncComponent, Button, Tooltip, Icon } = require('vizality/components');

const Progress = AsyncComponent.from(getModuleByDisplayName('Progress'));

class Toast extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      timeout: null,
      progress: 100
    };
  }

  componentDidMount () {
    if (this.props.timeout && !isNaN(this.props.timeout)) {
      const timeout = setTimeout(() => vizality.api.notices.closeToast(this.props.id), this.props.timeout);
      this.setState({ timeout });

      let timeLeft = this.props.timeout;

      setInterval(() => {
        timeLeft -= 1000;
        this.setState({ progress: (timeLeft / this.props.timeout) * 100 });
      }, 1e3);
    }
  }

  render () {
    if (!this.props.icon && this.props.type) {
      switch (this.props.type) {
        case 'err':
        case 'error':
        case 'danger':
          this.props.icon = 'remove-circle';
          break;
        case 'info':
        case 'information':
          this.props.icon = 'info-circle';
          break;
        case 'success':
          this.props.icon = 'check-circle';
          break;
        case 'warn':
        case 'warning':
        case 'caution':
          this.props.icon = 'exclamation-circle';
          break;
      }
    }

    return (
      <div id={this.props.id}
        className={joinClassNames(
          this.props.className,
          'vizality-toast', {
            'vz-isClosing': this.props.closing,
            [`vz-is${this.props.position}`]: this.props.position,
            'vz-isBottomRight': !this.props.position
          })}
        onClick={() => {
          clearTimeout(this.state.timeout);
          vizality.api.notices.closeToast(this.props.id);
        }}
        vz-toast-type={this.props.type || 'info'}
        style={this.props.style}
      >
        <div className='vizality-toast-contents'>
          {this.props.header && this.renderHeader()}
          {this.props.content && this.renderContent()}
        </div>
        {this.renderFooter()}
        {this.state.timeout && !this.props.hideProgressBar && this.renderProgress()}
      </div>
    );
  }

  renderHeader () {
    return <div className='vizality-toast-header'>
      {this.props.icon && (
        <Tooltip
          className='vizality-toast-extra'
          text={`${this.props.type
            ? this.props.type.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase())
            : this.props.header}`}
          position='left'
        >
          {this.props.image
            ? <img src={this.props.image} alt='' className={joinClassNames('vizality-toast-image', this.props.imageClassName)} />
            : <Icon wrapperClassName='vizality-toast-icon-wrapper' className='vizality-toast-icon' type={this.props.icon} />}
        </Tooltip>
      )}
      {this.props.header}
    </div>;
  }

  renderContent () {
    return <div className='vizality-toast-message'>
      {this.props.content}
    </div>;
  }

  renderFooter () {
    return <div className='vizality-toast-footer'>
      <div className='vizality-toast-pro-tip'>
        {/* @i18n: Do this. */}
        Click to dismiss
      </div>
      {this.props.buttons && Array.isArray(this.props.buttons) && (
        <div className='vizality-toast-buttons'>
          {this.props.buttons.map((button, i) => {
            const btnProps = {};
            [ 'size', 'look', 'color' ].forEach(prop => {
              if (button[prop]) {
                const value = button[prop].includes('-')
                  ? button[prop]
                  : Button[`${prop.charAt(0).toUpperCase() + prop.slice(1)}s`][button[prop].toUpperCase()];
                if (value) {
                  btnProps[prop] = value;
                }
              }
            });

            if (!btnProps.size) {
              btnProps.size = Button.Sizes.SMALL;
            }

            return <Button
              key={i}
              {...btnProps}
              onClick={() => {
                if (button.onClick) {
                  button.onClick();
                }
              }}
            >
              {button.text}
            </Button>;
          })}
        </div>
      )}
    </div>;
  }

  renderProgress () {
    return <Progress
      percent={this.state.progress}
      foregroundGradientColor={[ '#738ef5', '#738ef5' ]}
      animate={true}
    />;
  }
}

module.exports = Toast;
