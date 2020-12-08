const { AsyncComponent, Button, Tooltip, Icon } = require('@vizality/components');
const { getModuleByDisplayName } = require('@vizality/webpack');
const { joinClassNames } = require('@vizality/util');
const { React } = require('@vizality/react');

const Progress = AsyncComponent.from(getModuleByDisplayName('Progress'));

module.exports = class Toast extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      timeout: null,
      progress: 100
    };

    this.props.type = this.props.type || 'info';
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
          this.props.icon = 'Activity';
          break;
        case 'info':
        case 'information':
          this.props.icon = 'Activity';
          break;
        case 'success':
          this.props.icon = 'Activity';
          break;
        case 'warn':
        case 'warning':
        case 'caution':
          this.props.icon = 'Activity';
          break;
      }
    }

    return (
      <div id={this.props.id}
        className={joinClassNames(
          this.props.className,
          'vz-toast', {
            'vz-isClosing': this.props.closing,
            [`vz-is${this.props.position}`]: this.props.position,
            'vz-isBottomRight': !this.props.position
          })}
        vz-toast-type={this.props.type}
        style={this.props.style}
      >
        <div className='vz-toast-inner'>
          <Icon
            name='Close'
            size='18px'
            className='vz-toast-close-wrapper'
            iconClassName='vz-toast-close'
            onClick={() => {
              clearTimeout(this.state.timeout);
              vizality.api.notices.closeToast(this.props.id);
            }}
          />
          {this.props.header && this.renderHeader()}
          {this.renderFooter()}
        </div>
        {this.state.timeout && !this.props.hideProgressBar && this.renderProgress()}
      </div>
    );
  }

  renderHeader () {
    return <div className='vz-toast-header'>
      {this.props.icon && (
        <Tooltip
          className='vz-toast-header-extra'
          text={`${this.props.type
            ? this.props.type.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase())
            : this.props.header}`}
          position='left'
        >
          {this.props.image
            ? <img src={this.props.image} alt='' className={joinClassNames('vz-toast-image', this.props.imageClassName)} />
            : <Icon size={this.props.iconSize || '40px'} className='vz-toast-icon-wrapper' iconClassName='vz-toast-icon' name={this.props.icon} />
          }
        </Tooltip>
      )}
      <div className='vz-toast-header-content'>
        <div className='vz-toast-header-title'>
          {this.props.header}
        </div>
        {this.props.content && this.renderContent()}
      </div>
    </div>;
  }

  renderContent () {
    return <div className='vz-toast-header-message'>
      {this.props.content}
    </div>;
  }

  renderFooter () {
    return (
      <>
        {this.props.buttons &&
          <div className='vz-toast-footer'>
            {Array.isArray(this.props.buttons) && (
              <div className='vz-toast-buttons'>
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
          </div>
        }
      </>
    );
  }

  renderProgress () {
    return <Progress
      percent={this.state.progress}
      foregroundGradientColor={[ '#738ef5', '#738ef5' ]}
      animate={true}
    />;
  }
};
