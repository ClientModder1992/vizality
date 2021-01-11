// const { Table } = require('@vizality/components');
import React, { memo, useState, useEffect } from 'react';

import { Icon, KeyboardShortcut, KeybindRecorder, Avatar, Text, HeaderBarContainer, CarouselWithPreview, ApplicationCommandDiscoverySectionList, ApplicationStoreListingCarousel, FormNotice } from '@vizality/components';
import { getModuleByDisplayName } from '@vizality/webpack';

const TransitionGroup = getModuleByDisplayName('TransitionGroup');
const SlideIn = getModuleByDisplayName('SlideIn');

// eslint-disable-next-line no-empty-function
const KeybindEntry = getModuleByDisplayName('FluxContainer(UserSettingsKeybinds)').prototype.render.call({ memoizedGetStateFromStores: () => {} }).type.prototype.renderKeybinds.call({ props: {} }, [ [] ])[0].props.children.type;

export default memo(() => {
  console.log(HeaderBarContainer);
  return (
    <>
      <HeaderBarContainer>
        <Text>I like pie</Text>
      </HeaderBarContainer>
      <ApplicationCommandDiscoverySectionList
        activeSectionIndex={0}
        sections={[
          {
            icon: '/assets/6debd47ed13483642cf09e832ed0bc1b.png',
            id: '-1',
            isBuiltIn: true,
            name: 'Built-In'
          }
        ]}
      />
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
      <Avatar
        isTyping={true}
        isMobile={true}
        src='https://cdn.discordapp.com/avatars/597905003717459968/74809b431684d381a5ed0637f8adbf91.png'
        status='online'
        statusTooltip={true}
        size={Avatar.Sizes.SIZE_32}
      />
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
