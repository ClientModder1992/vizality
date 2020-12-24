import React from 'react';

import { toPlural, toTitleCase } from '@vizality/util/string';
import { FormTitle } from '@vizality/components';

import AddonList from '@vizality/builtins/addon-manager/components/addons/List';

export default {
  command: 'manage',
  description: 'Allows you to manage your addons directly in chat.',
  usage: '{c}',
  executor (_, type) {
    const result = {
      type: 'rich',
      color: type === 'plugin' ? 0x42ffa7 : 0xb68aff,
      provider: {
        name: <>
          <FormTitle tag='h2' className='vz-addon-manager-command-addon-manage-header'>
            {`Manage ${toTitleCase(toPlural(type))}`}
          </FormTitle>
          <AddonList className='vz-addons-list-embed' type={type} displayType='compact' limit={8} />
        </>
      }
    };

    return {
      send: false,
      result
    };
  }
};
