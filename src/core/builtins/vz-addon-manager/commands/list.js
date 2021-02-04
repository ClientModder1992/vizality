import React from 'react';

import { LazyImageZoomable, ImageModal, Tooltip, Anchor } from '@vizality/components';
import { toPlural, toTitleCase } from '@vizality/util/string';
import { getMediaDimensions } from '@vizality/util/file';
import { open as openModal } from '@vizality/modal';

export default {
  command: 'list',
  description: 'Displays a list of currently installed addons.',
  options: [
    { name: 'all', required: true },
    { name: 'enabled', required: true },
    { name: 'disabled', required: true }
  ],
  executor: async (args, type) => {
    let addons, result;

    switch (args[0]) {
      case 'all': addons = vizality.manager[toPlural(type)].keys; break;
      case 'enabled': addons = vizality.manager[toPlural(type)].getEnabledKey(); break;
      case 'disabled': addons = vizality.manager[toPlural(type)].getDisabledKeys(); break;
    }

    if (!addons.length) {
      switch (args[0]) {
        case 'all': result = `You have no ${toPlural(type)} installed.`; break;
        case 'enabled': result = `You have no ${toPlural(type)} enabled.`; break;
        case 'disabled': result = `You have no ${toPlural(type)} disabled.`; break;
      }

      return {
        send: false,
        result
      };
    }

    const items = [];

    const renderAddonItem = async (addonId) => {
      const addon = vizality.manager[toPlural(type)].get(addonId);
      addon && items.push(
        <div className='vz-embed-table-grid-row'>
          <div className='vz-embed-table-grid-row-inner'>
            <LazyImageZoomable
              className='vz-manager-command-list-embed-table-addon-image-wrapper'
              imageClassName='vz-manager-command-list-embed-table-addon-img'
              src={addon.manifest.icon}
              width='20'
              height='20'
              shouldLink={false}
              onClick={async () => {
                const albumDimensions = await getMediaDimensions(addon.manifest.icon);
                openModal(() =>
                  <ImageModal
                    src={addon.manifest.icon}
                    width={albumDimensions.width}
                    height={albumDimensions.height}
                  />);
              }}
            />
            <Tooltip text={addonId}>
              <Anchor
                type={type}
                addonId={addonId}
                className='vz-embed-table-grid-row-inner-text'
              >
                {addon.manifest.name}
              </Anchor>
            </Tooltip>
          </div>
          <div className='vz-embed-table-grid-row-inner'>
            <Anchor
              type='user'
              userId={addon.manifest.author.id}
              className='vz-embed-table-grid-row-inner-text'
            >
              {typeof addon.manifest.author === 'string' ? addon.manifest.author : addon.manifest.author.name}
            </Anchor>
          </div>
          <div className='vz-embed-table-grid-row-inner'>
            {addon.manifest.version}
          </div>
        </div>
      );
    };

    const renderItems = async () => {
      return Promise.all(addons.map(renderAddonItem));
    };

    result = {
      type: 'rich',
      color: type === 'plugin' ? 0x42ffa7 : 0xb68aff,
      title: `${args[0] === 'all' ? '' : `${toTitleCase(args[0])} `}${toTitleCase(toPlural(type))} List`,
      description: `${addons.length} ${args[0] === 'all' ? '' : `${args[0].toLowerCase()} `}${toPlural(type)} were found.`,
      footer: {
        text: <>
          {await renderItems().then(() => {
            return (
              <div className='vz-embed-table vz-manager-command-list-embed-table'>
                <div className='vz-embed-table-grid-header vz-embed-table-grid-row'>
                  <div className='vz-embed-table-grid-header-inner'>
                    Name
                  </div>
                  <div className='vz-embed-table-grid-header-inner'>
                    Author
                  </div>
                  <div className='vz-embed-table-grid-header-inner'>
                    Version
                  </div>
                </div>
                {items.map(item => item)}
              </div>
            );
          })}
        </>
      }
    };

    return {
      send: false,
      result
    };
  },

  autocomplete (args, type) {
    if (args.length > 1) {
      return false;
    }

    return {
      commands:[
        {
          command: 'all',
          description: `List of all ${toPlural(type)}.`
        },
        {
          command: 'enabled',
          description: `List of all enabled ${toPlural(type)}.`
        },
        {
          command: 'disabled',
          description: `List of all disabled ${toPlural(type)}.`
        }
      ]
    };
  }
};
