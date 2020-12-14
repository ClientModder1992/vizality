// const { Table } = require('@vizality/components');
const { React, React: { useState, useEffect } } = require('@vizality/react');
const { Icon, KeyboardShortcut, KeybindRecorder, Avatar, CarouselWithPreview, ApplicationStoreListingCarousel } = require('@vizality/components');
const { getModule, getModuleByDisplayName } = require('@vizality/webpack');

const { EmbedVideo } = getModule(m => m.EmbedVideo);

const KeybindEntry = getModuleByDisplayName('FluxContainer(UserSettingsKeybinds)').prototype.render.call({ memoizedGetStateFromStores: () => {} }).type.prototype.renderKeybinds.call({ props: {} }, [ [] ])[0].props.children.type;

module.exports = React.memo(() => {
  return (
    <>
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
        size='SIZE_32'
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
