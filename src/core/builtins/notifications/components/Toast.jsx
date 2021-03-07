import { Button, Icon, Flex } from '@vizality/components';
import Webpack from '@vizality/webpack';
import Util from '@vizality/util';
import React from 'react';

const { horizontal } = Webpack.getModule('buttonsWrapper', 'horizontal');
const { marginTop20 } = Webpack.getModule('marginTop20');

const Content = React.memo(({ markdown, content }) => {
  return (
    <div className='vz-toast-content'>
      {markdown
        ? <Markdown source={content} />
        : content
      }
    </div>
  );
});

const Header = React.memo(({ image, icon, markdown, header, content }) => {
  return (
    <div className='vz-toast-meta-wrapper'>
      <div className='vz-toast-decorator'>
        {image &&
        <LazyImage src={image} className='vz-toast-image' />
        }
        {icon &&
          <Icon
            size='40'
            className='vz-toast-icon-wrapper'
            iconClassName='vz-toast-icon'
            name={icon}
          />
        }
      </div>
      <div className='vz-toast-meta'>
        <div className='vz-toast-header'>
          {markdown
            ? <Markdown source={header} />
            : header
          }
        </div>
        {content && <Content markdown={markdown} content={content} />}
      </div>
    </div>
  );
});

const Footer = React.memo(({ buttons }) => {
  return (
    <Flex className={Util.dom.joinClassNames('vz-toast-footer', marginTop20)}>
      <Flex className={Util.dom.joinClassNames('vz-toast-footer-buttons', horizontal)} justify={Flex.Justify.END}>
        {buttons.map((button, i) => {
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
      </Flex>
    </Flex>
  );
});

export default React.memo(props => {
  const Toast =
    typeof props.toast.custom === 'function'
      ? props.toast.custom
      : () => props.toast.custom;

  return (
    props.toast.custom
      ? <Toast {...props.toast.custom.props} />
      : (
        <div className='vz-toast-body-inner' vz-toast-id={props.toast.id}>
          <Header
            markdown={props.toast.markdown}
            image={props.toast.image}
            icon={props.toast.icon}
            header={props.toast.header}
            content={props.toast.content}
          />
          {props.toast.buttons?.length && <Footer buttons={props.toast.buttons} />}
        </div>
      )
  );
});
