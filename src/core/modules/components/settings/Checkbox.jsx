const { getModuleByDisplayName, getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

const AsyncComponent = require('../AsyncComponent');
const Divider = require('../Divider');

const Checkbox = AsyncComponent.from(getModuleByDisplayName('Checkbox', true));

module.exports = React.memo(props => {
  const Flex = getModuleByDisplayName('Flex');
  const { marginBottom20 } = getModule('marginBottom20');

  return (
    <Flex className={marginBottom20} direction={Flex.Direction.VERTICAL}>
      <Checkbox {...props}/>
      <Divider/>
    </Flex>
  );
});

/**
 * AVAILABLE PROPS
 *
 * align={ 'alignCenter-MrlN6q' }
 * color={ '#7289da' }
 * disabled={ false }
 * onChange={ '' }
 * readOnly={ false }
 * reverse={ false }
 * shape={ 'box-mmYMsp' }
 * size={ 24 }
 * type={ 'inverted' }
 * value={ true }
 */
