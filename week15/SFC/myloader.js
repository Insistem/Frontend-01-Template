var parser = require('./parser');

module.exports = function (source, map) {
  const DOMTree = parser.parserHTML(source);

  let template = null;
  let script = null;
  let style = null;

  for (let node of DOMTree.children) {
    if (node.tagName === 'template') {
      template = node.children.find(e => e.type != 'text');
    }
    if (node.tagName === 'script') {
      script = node.children[0].content;
    }
    if (node.tagName === 'style') {
      style = JSON.stringify(node.children[0].content);
    }
  }

  let visit = node => {
    if (node.type === 'text') {
      return JSON.stringify(node.content);
    }
    let attrs = {};
    for (let attribute of node.attributes) {
      attrs[attribute.name] = attribute.value;
    }
    let children = node.children.map(node => visit(node));
    return `createElement("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`;
  };

  const r = `
import { createElement } from './createElement';

export class Carousel {
    constructor(type) {
        this.root = null;
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();

        if (${Boolean(style)}) {
            const styleEl = document.createElement('style');
            styleEl.innerHTML = ${style};
            document.head.appendChild(styleEl);
        }
    }

    setAttribute(name, value) {
      this.attributes.set(name, value);
    }
  
    appendChild(child) {
      this.children.push(child);
    }
    render() {
       return ${visit(template)}
    }
    mountTo(parent) {
     this.render().mountTo(parent);
   }
}

export default Carousel;
  `;

  return r;
};
