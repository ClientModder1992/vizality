/*
 * MIT License
 *
 * Copyright (c) 2019-2020 Zachary Rauen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


import { getModule } from '@vizality/webpack';
import { Builtin } from '@vizality/core';

let Analytics, Reporter, Sentry;

export default class Privacy extends Builtin {
  onStart () {
    Analytics = getModule('getSuperPropertiesBase64');
    Reporter = getModule('submitLiveCrashReport');
    Sentry = {
      main: window.__SENTRY__.hub,
      client: window.__SENTRY__.hub.getClient()
    };

    Analytics.__oldTrack = Analytics.track;
    Analytics.track = () => void 0;

    Reporter.__oldSubmitLiveCrashReport = Reporter.submitLiveCrashReport;
    Reporter.submitLiveCrashReport = () => void 0;

    Sentry.client.close();
    Sentry.main.getScope().clear();
    Sentry.main.__oldAddBreadcrumb = Sentry.main.addBreadcrumb;
    Sentry.main.addBreadcrumb = () => void 0;

    window.__oldConsole = window.console;

    Object.assign(window.console, [ 'debug', 'info', 'warn', 'error', 'log', 'assert' ].forEach(method => {
      if (window.console[method].__sentry_original__) {
        window.console[method] = window.console[method].__sentry_original__;
      } else if (window.console[method].__REACT_DEVTOOLS_ORIGINAL_METHOD__) {
        window.console[method].__REACT_DEVTOOLS_ORIGINAL_METHOD__ = window.console[method].__REACT_DEVTOOLS_ORIGINAL_METHOD__.__sentry_original__;
      }
    }));
  }

  onStop () {
    Analytics.track = Analytics.__oldTrack;
    Reporter.submitLiveCrashReport = Reporter.__oldSubmitLiveCrashReport;
    Sentry.main.addBreadcrumb = Sentry.main.__oldAddBreadcrumb;
    Sentry.client.getOptions().enabled = true;
    window.console = window.__oldConsole;
  }
}
