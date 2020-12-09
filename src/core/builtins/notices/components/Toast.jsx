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
    return (
      <div id={this.props.id}
        className={joinClassNames(
          this.props.className,
          'vz-toast', {
            'vz-isClosing': this.props.closing,
            [`vz-is${this.props.position}`]: this.props.position,
            'vz-isBottomRight': !this.props.position
          })}
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
      <Tooltip
        className='vz-toast-header-extra'
        text={this.props.tooltip || null}
        position='left'
      >
        {this.props.image &&
          <img
            src={this.props.image}
            className={joinClassNames('vz-toast-image', this.props.imageClassName)}
          />
        }
        {this.props.icon &&
          <Icon
            size={this.props.iconSize || '40px'}
            className='vz-toast-icon-wrapper'
            iconClassName='vz-toast-icon'
            name={this.props.icon}
          />
        }
      </Tooltip>
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
