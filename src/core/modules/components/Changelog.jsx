import React, { memo } from 'react';
import { promisify } from 'util';
import cp from 'child_process';
import { promises } from 'fs';
import { join } from 'path';

import { open as openModal, close as closeModal } from '@vizality/modal';
import { getModule, getModuleByDisplayName } from '@vizality/webpack';
import { joinClassNames } from '@vizality/util/dom';
import { Directories } from '@vizality/constants';
import { Confirm } from '@vizality/components';
import { Builtin } from '@vizality/entities';
import { Messages } from '@vizality/i18n';

const Changelog = join(Directories.ROOT, 'CHANGELOG.md');
const exec = promisify(cp.exec);
const { readFile } = promises;

export default memo(({ source }) => {
  useEffect(() => {
    const getSource = async () => {
      const md = await readFile(source, 'utf-8');
      // For Vizality Changelog
      setMarkdown(md.replace(/{(fixed|added|improved|progress)( marginTop)?}/g, '').replace(/(# Changelog)/, '').trim());
    };

    if (existsSync(source)) {
      getSource();
    } else {
      setMarkdown(source.trim());
    }
  }, [ markdown ]);
  const changelogObject = await this.formatChangelog();
  const ChangeLog = await this._getChangeLogsComponent();

  
  const _getChangeLogsComponent = async () => {
    if (!this._ChangeLog) {
      const _this = this;
      const { video, image } = getModule('video', 'image', 'added');
      const DiscordChangeLog = getModuleByDisplayName('ChangelogStandardTemplate');

      class ChangeLog extends DiscordChangeLog {
        constructor (props) {
          super(props);

          this.close = this.close.bind(this);
          this.onClose = props.onClose;
          this.onCloseRequest = props.onClose;
          this.handleScroll = () => void 0;
          this.track = () => void 0;
          this.oldRenderHeader = this.renderHeader;
          this.renderHeader = this.renderNewHeader.bind(this);
        }

        renderNewHeader () {
          const header = this.oldRenderHeader();
          header.props.children[0].props.children = `Vizality - ${header.props.children[0].props.children}`;
          return header;
        }

        renderVideo () {
          if (!_this.changelog.image) {
            return null;
          }

          return <img src={_this.changelog.image} className={joinClassNames(image, video)} />;
        }

        renderFooter () {
          const { anchor, anchorUnderlineOnHover } = getModule('anchorUnderlineOnHover');
          const { colorStandard } = getModule('colorStandard');
          const footer = super.renderFooter();
          footer.props.children =
            <div className={joinClassNames('vz-changelog-modal-footer', colorStandard)}>
              Missed an update?
              <a
                className={joinClassNames('vz-changelog-modal-footer-a', anchor, anchorUnderlineOnHover)}
                onClick={() => vizality.api.routes.navigateTo('changelog')}
              > Check out our full changelog history.</a>
            </div>;

          return footer;
        }

        close () {
          this.onClose();
        }
      }

      this._ChangeLog = ChangeLog;
    }
    return this._ChangeLog;
  }

  const formatChangelog = async () => {
    const log = await readFile(Changelog, 'utf-8');

    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g;
    const date = log.match(dateRegex)[0];
    const previousDate = log.match(dateRegex)[1];

    const body = log.slice(log.search(date) + 11, log.search(previousDate) - 13).trim();

    this.settings.set('lastChangelog', this.changelog.id);

    return {
      id: this.changelog.id,
      date,
      locale: 'en-us',
      revision: 1,
      body
    };
  }

  return (
    <ChangeLog changeLog={changelogObject} {...props} />
  );
});
