const { React, getModuleByDisplayName, i18n: { Messages } } = require('vizality/webpack');
const { Card, AsyncComponent } = require('vizality/components');
const { Modal } = require('vizality/components/modal');

const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle'));

module.exports = ({ spdx, license: { name, url, permissions, conditions, limitations } }) => {
  const data = {
    permissions,
    conditions,
    limitations
  };

  return (
    <Modal className='vizality-product-license-modal'>
      <Modal.Header>
        <FormTitle tag='h4'>{name}</FormTitle>
      </Modal.Header>
      <Modal.Content>
        <p className='vizality-product-license-modal-desc'>{Messages[`VIZALITY_PLUGINS_LICENSE_DESC_${spdx}`]}</p>
        <Card className='vizality-product-license-modal-card'>
          {Messages.VIZALITY_PLUGINS_LICENSE_DISCLAIMER.format({ url })}
        </Card>
        {[ 'permissions', 'limitations', 'conditions' ].map(type =>
          <div key={type} className={`vizality-product-license-modal-data ${type}`}>
            <FormTitle tag='h4'>{Messages[`VIZALITY_PLUGINS_LICENSE_${type.toUpperCase()}`]}</FormTitle>
            {data[type].map(perm => <div key={perm} className='vizality-product-license-modal-entry'>
              <span>{Messages[`VIZALITY_PLUGINS_LICENSE_${perm}_NAME`]}</span>
              <div>{perm === 'PATENT_USE'
                ? type === 'permissions'
                  ? Messages.VIZALITY_PLUGINS_LICENSE_PATENT_USE_DESC_ALLOWED
                  : Messages.VIZALITY_PLUGINS_LICENSE_PATENT_USE_DESC_FORBIDDEN
                : Messages[`VIZALITY_PLUGINS_LICENSE_${perm}_DESC`]}</div>
            </div>)}
          </div>
        )}
      </Modal.Content>
    </Modal>
  );
};
