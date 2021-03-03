import { getCaller } from '@vizality/util/file';
import { API } from '@vizality/entities';

export default class Patches extends API {
  constructor () {
    super();
    this.patches = {};
  }

  stop () {
    delete vizality.api.patches;
    this.removeAllListeners();
  }
}
