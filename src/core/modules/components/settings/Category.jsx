const { getModule, getModuleByDisplayName } = require('@vizality/webpack');
const { joinClassNames } = require('@vizality/util');
const { React } = require('@vizality/react');

const AsyncComponent = require('../AsyncComponent');
const Icon = require('../Icon');

const DFormItem = AsyncComponent.from(getModuleByDisplayName('FormItem', true));
const FormText = AsyncComponent.from(getModuleByDisplayName('FormText', true));

module.exports = React.memo(props => {
  const { name, description, children, opened, onChange } = props;
  const Flex = getModuleByDisplayName('Flex');
  const classes = {
    flex: joinClassNames(Flex.Direction.VERTICAL, Flex.Justify.START, Flex.Align.STRETCH, Flex.Wrap.NO_WRAP),
    divider: getModule(m => Object.keys(m).join('') === 'divider').divider,
    dividerDefault: getModule('dividerDefault').dividerDefault,
    description: getModule('formText', 'description').description,
    labelRow: getModule('labelRow').labelRow,
    title: getModule('labelRow').title
  };

  return (
    <DFormItem className={joinClassNames('vz-c-settings-category', classes.flex)}>
      <div
        className={joinClassNames('vz-c-settings-category-title', 'vz-c-settings-title')}
        onClick={() => onChange(!opened)}
        vz-opened={opened ? '' : null}
      >
        <div className='vz-c-settings-category-title-inner'>
          <div className={classes.labelRow}>
            <label class={classes.title}>
              {name}
            </label>
          </div>
          <FormText className={classes.description}>
            {description}
          </FormText>
        </div>
        <Icon className='vz-c-settings-category-title-icon-wrapper' name='RightCaret' width='18' height='18' />
      </div>
      {opened && <div className='vz-c-settings-category-inner'>
        {children}
      </div>}
    </DFormItem>
  );
});
