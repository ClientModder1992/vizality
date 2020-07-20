const { React, i18n: { Messages } } = require('@webpack');
const { Modal, Card, FormTitle } = require('@components');

const License = ({ spdx, license: { name, url, permissions, conditions, limitations } }) => {
  const data = {
    permissions,
    conditions,
    limitations
  };

  return (
    <Modal className='vizality-entity-license-modal'>
      <Modal.Header>
        <FormTitle tag='h4'>{name}</FormTitle>
      </Modal.Header>
      <Modal.Content>
        <p className='vizality-entity-license-modal-description'>{Messages[`VIZALITY_ENTITIES_LICENSE_DESC_${spdx}`]}</p>
        <Card className='vizality-entity-license-modal-card'>
          {Messages.VIZALITY_ENTITIES_LICENSE_DISCLAIMER.format({ url })}
        </Card>
        {[ 'permissions', 'limitations', 'conditions' ].map(type =>
          <div key={type} className={`vizality-entity-license-modal-data ${type}`}>
            <FormTitle tag='h4'>{Messages[`VIZALITY_ENTITIES_LICENSE_${type.toUpperCase()}`]}</FormTitle>
            {data[type].map(perm => <div key={perm} className='vizality-entity-license-modal-entry'>
              <span>{Messages[`VIZALITY_ENTITIES_LICENSE_${perm}_NAME`]}</span>
              <div>{perm === 'PATENT_USE'
                ? type === 'permissions'
                  ? Messages.VIZALITY_ENTITIES_LICENSE_PATENT_USE_DESC_ALLOWED
                  : Messages.VIZALITY_ENTITIES_LICENSE_PATENT_USE_DESC_FORBIDDEN
                : Messages[`VIZALITY_ENTITIES_LICENSE_${perm}_DESC`]}</div>
            </div>)}
          </div>
        )}
      </Modal.Content>
    </Modal>
  );
}

module.exports = License;
