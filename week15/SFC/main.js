import { createElement } from './createElement';
import { Timeline, Animation } from '../animation/animation.js';
// import { Carousel } from './carousel.view'

class Carousel {
  constructor(type) {
    this.root = null;
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }
  // attribute
  setAttribute(name, value) {
    // console.log('Parent -> setAttribute -> name, value', name, value);
    this.attributes.set(name, value);
  }

  appendChild(child) {
    this.children.push(child);
  }

  autoCarousel() {
    const children = this.children;
    let position = 0;
    const data = this.attributes.get('data');
    // 不能有DOM操作，不能改变元素结构，因为语义变了,所以需要改变CSS
    let nextPic = () => {
      let nextPosition = (position + 1) % data.length;
      // 当前播放到哪里
      let current = children[position];
      let next = children[nextPosition];

      current.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';

      // form
      current.style.transform = `translateX(${-100 * position}%)`;
      // 将下一个img放在了下一个位置
      next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

      // requestAnimationFrame需要嵌套多一个requestAnimationFrame
      // 两段修改transition需要使用setTimeout分割，否则会合并触发
      setTimeout(() => {
        // 使用css控制
        current.style.transition = '';
        next.style.transition = '';
        // to
        current.style.transform = `translateX(${-100 - 100 * position}%)`;
        next.style.transform = `translateX(${-100 * nextPosition}%)`;

        position = nextPosition;
      }, 16);

      setTimeout(nextPic, 3000);
    };
    setTimeout(nextPic, 3000);
  }

  moveCarousel() {
    const children = this.children;
    let position = 0;
    const data = this.attributes.get('data');
    this.root.addEventListener('mousedown', e => {
      let startX = e.clientX;

      let lastPosition = (position - 1 + data.length) % data.length;
      let nextPosition = (position + 1) % data.length;

      let current = children[position];
      let last = children[lastPosition];
      let next = children[nextPosition];

      // 关闭transition
      current.style.transition = 'ease 0s';
      last.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';

      // form
      current.style.transform = `translateX(${-500 * position}px)`;
      last.style.transform = `translateX(${-500 - 500 * lastPosition}px)`;
      next.style.transform = `translateX(${500 - 500 * nextPosition}px)`;

      const move = event => {
        // 获取偏移值： 移动的xy轴各自减去开始mousedown的xy轴
        let x = event.clientX - startX;

        current.style.transform = `translateX(${x - 500 * position}px)`;
        last.style.transform = `translateX(${x - 500 - 500 * lastPosition}px)`;
        next.style.transform = `translateX(${x + 500 - 500 * nextPosition}px)`;
      };

      const up = event => {
        let offset = 0;
        let x = event.clientX - startX;
        if (x > 250) {
          // 鼠标右移动
          offset = 1;
        } else if (x < -250) {
          // 鼠标左移动
          offset = -1;
        }

        // 打开transition动画
        current.style.transition = '';
        last.style.transition = '';
        next.style.transition = '';

        current.style.transform = `translateX(${offset * 500 - 500 * position}px)`;
        last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPosition}px)`;
        next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition}px)`;

        position = (position - offset + data.length) % data.length;
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
  }

  render() {
    const data = this.attributes.get('data');
    this.children = data.map(url => {
      let element = <img class="" src={url} />;
      element.addEventListener('dragstart', e => e.preventDefault());
      return element;
    });
    this.root = <div class="carousel">{this.children}</div>;

    // 自动播放
    this.autoCarousel();
    // 鼠标滑动
    this.moveCarousel();

    return this.root;
  }

  // 挂载在parent元素，首次挂载在body元素下，然后循环挂载child在this.root下
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}

const data = [
  'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
  'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
  'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
];

const component = <Carousel data={data} />;
component.mountTo(document.body);
console.log('component', component);
