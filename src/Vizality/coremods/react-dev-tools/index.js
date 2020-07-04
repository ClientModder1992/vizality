/**
 * The extension is successfully loaded, however it seems like
 * the tab tools isn't added appropriately. It *seems* related to a
 * chromium issue but I'm really unsure. Needs further investigation.
 *
 * https://github.com/electron/electron/issues/23662
 * https://bugs.chromium.org/p/chromium/issues/detail?id=1093731
 */

const { existsSync, promises: { mkdir, writeFile } } = require('fs');
const { join } = require('path');
const unzip = require('unzip-crx');
const { get } = require('vizality/http');
const { rmdirRf } = require('vizality/util');

const CRX_URL = 'https://clients2.google.com/service/update2/crx?response=redirect&os=win&arch=x86-64&os_arch=x86-64&nacl_arch=x86-64&prod=chromecrx&prodchannel=unknown&prodversion=83.0.4103.103&acceptformat=crx2&x=id=fmkadmapgofadopljbjfkapdkoienihi%26uc';
const EXT_PATH = join(__dirname, 'ext');
const RDT_PATH = join(EXT_PATH, 'dst');

async function download () {
  const crxRes = await get(CRX_URL);
  const url = crxRes.headers.location;
  const extFile = join(EXT_PATH, url.split('/').pop());
  if (existsSync(EXT_PATH)) {
    if (existsSync(extFile)) {
      // Everything's up to date
      return;
    }
    await rmdirRf(EXT_PATH);
  }
  await mkdir(EXT_PATH);
  const res = await get(url);
  await writeFile(extFile, res.raw);
  return unzip(extFile, RDT_PATH);
}

let id;
module.exports = () => {
  download().then(() => VizalityNative.installExtension(RDT_PATH)).then(eid => id = eid);
  return () => id && VizalityNative.uninstallExtension(id);
};