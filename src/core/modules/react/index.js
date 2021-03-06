import React from 'react';
import { patch } from '../patcher';
import { getOwnerInstance } from '../util/React';
import { waitForElement } from '../util/DOM';
import { getModule } from '../webpack';
import { warn } from '../util/Logger';

export const knownComponents = new Map();
export const unknownComponents = new Set();
export const listeners = new Set();

export class ReactComponent {
  constructor (component, selector, filter, displayName) {
    this.component = component;
    this.selector = selector;
    this.filter = filter;
    this.displayName = displayName;
  }

  forceUpdateAll () {
    if (!this.selector || !this.selector.startsWith('.')) return false;
    document.querySelectorAll(this.selector).forEach(node => {
      const instance = getOwnerInstance(node);
      if (!instance) return;
      instance.forceUpdate();
    });
  }
}

export const addComponentWithName = component => {
  if (!knownComponents.get(component.displayName)) {
    if (!(component instanceof ReactComponent)) {
      component = component = new ReactComponent(component, null, m => m.displayName === name, component.displayName);
    }

    knownComponents.set(component.displayName, component);
    for (const listener of listeners) {
      if (listener.displayName !== component.displayName) continue;
      if (listener.selector && !component.selector) component.selector = listener.selector;
      listener.callback(component);
      listeners.delete(listener);
    }
  }
};

export const addComponentWithoutName = component => {
  if (unknownComponents.has(component)) return;
  for (const listener of listeners) {
    if (!listener.filter || !listener.filter(component)) continue;
    component = new ReactComponent(component, listener.selector ?? null, listener.filter, listener.displayName);
    addComponentWithName(component);
    listeners.delete(listener);
    listener.callback(component);
  }
  if (!component.displayName) unknownComponents.add(component);
};

export const setComponent = component => {
  if (typeof component !== 'function') return;
  if (component.displayName || component.name?.length > 2) {
    component.displayName = component.displayName || component.name;
    addComponentWithName(component);
  } else addComponentWithoutName(component);
};

export const findComponent = filter => {
  const wrapFilter = com => {
    try {
      return filter(com);
    } catch { return false; }
  };

  for (const component of unknownComponents) if (wrapFilter(component)) return new ReactComponent(component, null, filter, null);
  for (const { component } of knownComponents) if (wrapFilter(component)) return component;
};

export const getComponentBySelector = selector => {
  return new Promise(async res => {
    const timeout = setTimeout(() => warn({ labels: [ 'react-components' ], message: `Component with selector '${selector}' was not found after 20 seconds.` }), 20000);
    const resolve = component => {
      clearTimeout(timeout);
      return res(component);
    };
    const node = await waitForElement(selector);
    const instance = getOwnerInstance(node);
    if (!instance) return;
    const type = instance._reactInternalFiber?.type;
    if (!type) return;
    let displayName = null;
    if (type.displayName) ({ displayName } = type);
    const component = new ReactComponent(type, selector, null, displayName);
    resolve(component);
    if (displayName) addComponentWithName(component);
  });
};

export const getComponent = (displayName = '', selector, filter = m => m.displayName === displayName) => {
  if (typeof displayName !== 'string') return false;
  const wrapFilter = comp => {
    try {
      return filter(comp);
    } catch { return false; }
  };

  return new Promise(resolve => {
    if (knownComponents.has(displayName)) {
      const comp = knownComponents.get(displayName);
      if (!comp.selector && selector) comp.selector = selector;
      return resolve(comp);
    }
    for (let component of unknownComponents) {
      if (!wrapFilter(component)) continue;
      unknownComponents.delete(component);
      component = new ReactComponent(component, selector ?? null, filter, displayName);
      resolve(component);
      return knownComponents.set(displayName, component);
    }
    const listener = { filter: wrapFilter, displayName, callback: resolve, selector };
    listeners.add(listener);
    if (selector) {
      getComponentBySelector(selector).then(component => {
        listeners.delete(listener);
        if (component.displayName === displayName) resolve(component);
        addComponentWithName(component);
      });
    }
  });
};

/* Patches */
patch('vz-react-components-createelement', React, 'createElement', ([ component ], res) => {
  if (typeof component === 'function') setComponent(component);
  if (typeof component?.type === 'function') setComponent(component.type);

  return res;
});

React.Component.prototype.componentWillUnmount = function () {
  setComponent(this.constructor);
};

patch('vz-react-components-component-clone_element', React, 'cloneElement', ([ component ], res) => {
  if (typeof component === 'function') setComponent(component);
  if (typeof component?.type === 'function') setComponent(component.type);

  return res;
});

getModule(m => {
  try {
    if (typeof m === 'function' && m.toString().indexOf('createElement') > -1) setComponent(m);
  } catch { }
  return false;
});

export default { getComponentBySelector, findComponent, getComponent, setComponent, addComponentWithName, addComponentWithoutName, unknownComponents, knownComponents };
