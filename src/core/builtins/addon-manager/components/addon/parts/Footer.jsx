const { Button, Divider } = require('@vizality/components');
const { Messages } = require('@vizality/i18n');
const { React } = require('@vizality/react');

module.exports = React.memo(({ onUninstall }) => {
  return (
    <>
      <Divider/>
      <div className='vz-addon-card-footer'>
        <div className='buttons'>
          {typeof onUninstall === 'function' &&
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onUninstall();
            }}
            color={Button.Colors.RED}
            look={Button.Looks.FILLED}
            size={Button.Sizes.SMALL}
          >
            {Messages.APPLICATION_CONTEXT_MENU_UNINSTALL}
          </Button>}
        </div>
      </div>
    </>
  );
});
