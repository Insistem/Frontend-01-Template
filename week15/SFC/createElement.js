export class Text {
  constructor(text) {
    this.root = document.createTextNode(text);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

export class Wrapper {
  //config
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }
  // attribute
  setAttribute(name, value) {
    // console.log('Parent -> setAttribute -> name, value', name, value);
    this.root.setAttribute(name, value);
  }
  addEventListener() {
    this.root.addEventListener(...arguments);
  }
  // children
  appendChild(child) {
    this.children.push(child);
    child.mountTo(this.root);
  }
  // 挂载在parent元素，首次挂载在body元素下，然后循环挂载child在this.root下
  get style() {
      return this.root.style
  }
  mountTo(parent) {
    parent.appendChild(this.root);

    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }
}

export function createElement(Cls, attributes, ...children) {
  // 传入config
  let o = null;

  if (typeof Cls === 'string') {
    o = new Wrapper(Cls);
  } else {
    o = new Cls({});
  }

  for (let name in attributes) {
    o.setAttribute(name, attributes[name]);
  }

  let visit = children => {
    for (let child of children) {
      if (typeof child === 'object' && child instanceof Array) {
        visit(child);
        continue;
      }

      if (typeof child === 'string') {
        child = new Text(child);
      }

      o.appendChild(child);
    }
  };

  visit(children);

  return o;
}
