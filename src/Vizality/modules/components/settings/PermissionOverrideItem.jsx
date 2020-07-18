/**
 * @todo: Fix this
 *
 * const { getModuleByDisplayName, React } = require('vizality/webpack');
 * const AsyncComponent = require('../AsyncComponent');
 * const FormItem = require('./FormItem');
 *
 * const PermissionOverride = AsyncComponent.from(getModuleByDisplayName('PermissionOverrideItem'));
 *
 * module.exports = class TextInput extends React.Component {
 * render () {
 * const { children: title, note, required } = this.props;
 * delete this.props.children;
 *
 * return (
 * <FormItem title={title} note={note} required={required}>
 * <PermissionOverride {...this.props}/>
 * </FormItem>
 * );
 * }
 * };
 *
 * /**
 * AVAILABLE PROPS
 *
 * className={ 'marginBottom20-32qID7' }
 * disabled={ false }
 * hideBorder={ false } // divider
 * note={ 'Members with this permission can change the channel\'s name or delete it.' }
 * onChange={ '' }
 * value={ 'DENY' } // 'DENY', 'ALLOW', 'PASSTHROUGH'
 */
