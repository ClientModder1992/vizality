// const { Table } = require('@vizality/components');
import React, { memo, useState, useEffect } from 'react';

import { Icon, KeyboardShortcut, KeybindRecorder, Avatar, Text, HeaderBarContainer, CarouselWithPreview, ApplicationCommandDiscoverySectionList, ApplicationStoreListingCarousel, FormNotice } from '@vizality/components';
import { getModuleByDisplayName } from '@vizality/webpack';
import { warn } from '../../../modules/util/Logger';

const TransitionGroup = getModuleByDisplayName('TransitionGroup');
const SlideIn = getModuleByDisplayName('SlideIn');

// eslint-disable-next-line no-empty-function

const KeybindEntry = (() => {
  let keybindentry;
  try {
    const UserSettingsKeybinds = getModuleByDisplayName('FluxContainer(UserSettingsKeybinds)')?.prototype?.render?.call({ memoizedGetStateFromStores: () => ({}) });
    if (!UserSettingsKeybinds) throw 'Failed to get UserSettingsKeybinds component!';
    const [ keybind ] = UserSettingsKeybinds.type?.prototype?.renderKeybinds?.call({ keybindActionTypes: {}, keybindDescriptions: {} }, [ {} ]);
    if (!keybind) throw 'Failed to render fake Keybind!';
    keybindentry = keybind.props?.children?.type;
    if (!keybindentry) throw 'Failed to get KeybindEntry component!';
  } catch (error) {
    warn({ labels: [ 'Test' ], message: error });
    keybindentry = () => null;
  }

  return keybindentry;
})();

export default memo(() => {
  return (
    <>
      {/* <Sticker
        className='pie'
        src='https://i.giphy.com/media/wTgYlmxctT2O4/giphy.webp'
      />
      <Emote name='Bob' src="https://cdn.discordapp.com/avatars/97549189629636608/42091c785e85fc5c20b9f1733d6b802a.png" /> */}
      <HeaderBarContainer>
        <Text>I like pie</Text>
      </HeaderBarContainer>
      <TransitionGroup>
        <SlideIn>
          <FormNotice
            className='poo'
            type={FormNotice.Types.WARNING}
            title={'i like'}
            body={'apple pie'}
          />
        </SlideIn>
      </TransitionGroup>
      <ApplicationStoreListingCarousel
        className='poog'
        autoplayInterval={8000}
        pageSize='small'
        paused='false'
        items={[
          {
            src: 'vz-plugin://example-plugin-settings/screenshots/preview-1.png',
            type: 1
          },
          {
            src: 'vz-plugin://copy-raw-message/screenshots/preview-1.png',
            type: 1
          },
          {
            src: 'vz-plugin://channel-members-activity-icons/screenshots/preview-1.png',
            type: 1
          },
          {
            src: 'vz-plugin://heyzere/screenshots/preview-1.png',
            type: 1
          }
        ]}
      />
      {/* <CarouselWithPreview
        align={CarouselWithPreview.Alignment.CENTER}
        animate={true}
        currentIndex={1}
        edgeItems={0}
        gutter={0}
        height={360}
        hideOverflow={true}
        width='100%'
        itemSize={{
          height: 495,
          margin: 20,
          width: 880
        }}
        items={[
          {
            height: 720,
            src: 'https://cdn.discordapp.com/app-assets/557494559257526272/store/557680775231963146.mp4',
            thumbnailSrc: 'https://cdn.discordapp.com/app-assets/557494559257526272/store/557680775231963146.png?size=1024',
            type: 3,
            width: 1280
          },
          {
            height: 720,
            src: 'https://cdn.discordapp.com/app-assets/557494559257526272/store/557581646803763205.png?size=1024',
            type: 1,
            width: 1280
          },
          {
            height: 720,
            src: 'https://cdn.discordapp.com/app-assets/557494559257526272/store/557681753020563464.png?size=1024',
            type: 1,
            width: 1280
          },
          {
            height: 720,
            src: 'https://cdn.discordapp.com/app-assets/557494559257526272/store/557681895693877258.png?size=1024',
            type: 1,
            width: 1280
          }
        ]}
        renderItem={handleRender}
      /> */}
      {/* <Avatar
        isTyping={true}
        isMobile={true}
        src='https://cdn.discordapp.com/avatars/597905003717459968/74809b431684d381a5ed0637f8adbf91.png'
        status='online'
        statusTooltip={true}
        size={Avatar.Sizes.SIZE_32}
      /> */}
      <KeybindEntry
        keybind={{ managed: false, id: '1', action: 'TOGGLE_MUTE', shortcut: [] }}
        keybindActionTypes={[
          { label: 'Unassigned', value: 'UNASSIGNED' },
          { label: 'Push to Talk (Normal)', value: 'TOGGLE_MUTE' }
        ]}
        keybindDescriptions={{
          UNASSIGNED: 'Navigate backward in page history',
          TOGGLE_MUTE: 'asdasd asda dasda ds'
        }}
      />
      <video autoPlay loop autoPictureInPicture controls={false}>
        <source src="https://www.kelp.agency/wp-content/uploads/2020/06/orbit_1_1.webm" type="video/webm" />
      </video>
      <KeybindRecorder defaultValue={[]} />
      <KeyboardShortcut shortcut='ctrl+p' />
      <KeyboardShortcut shortcut='ctrl+l' />
      <KeyboardShortcut shortcut='ctrl+a' />
      <KeyboardShortcut shortcut='ctrl+y' />
    </>
  );
});
