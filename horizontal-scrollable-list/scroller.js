/**
 *  Smooth Scrolling mechanism class
 */


export function easeInOutQuadratic (ellapsed, startPos, distance, duration) {
  let time = ellapsed;
  time /= duration / 2;
  if (time < 1) {

    return distance / 2 * time * time + startPos;
  }
  time--;

  return -distance / 2 * (time * (time - 2) - 1) + startPos;
}

export class Scroller {
  static defaultDuration = 300;
  static defaultOffset = 0;
  static defaultEasing = easeInOutQuadratic;
  static defaultCallback = () => {};

  constructor (container, options, axis = 'x') {
    this.container = container;
    this.axis = axis;
    this.start = (this.isHorizontal()) ? this.container.scrollLeft : this.container.scrollTop;
    this.options = {
      duration: options.duration || Scroller.defaultDuration,
      offset: options.offset || Scroller.defaultOffset,
      callback: options.callback || Scroller.defaultCallback,
      easing: options.easing || Scroller.defaultEasing
    };
    this.distance = this.options.offset;
    this.duration = typeof this.options.duration === 'function'
      ? this.options.duration(this.distance)
      : this.options.duration;
  }

  isHorizontal () {
    return this.axis === 'x' || this.axis === 'X';
  }

  scrollTo = (pos) => {
    this.start = this.isHorizontal() ? this.container.scrollLeft : this.container.scrollTop;
    this.distance = this.options.offset + pos - this.start;
    requestAnimationFrame ( this.loop );
  }

  loop = (time) => {
    if (!this.timeStart) {
      this.timeStart = time;
    }
    this.ellapsed = time - this.timeStart;
    this.next = this.options.easing (this.ellapsed, this.start, this.distance, this.duration);

    if (this.isHorizontal()) {
      this.container.scrollLeft = this.next;
    }
    else {
      this.container.scrollTop = this.next;
    }

    if (this.ellapsed < this.duration) {
      requestAnimationFrame ( this.loop );
    }
    else {
      this.end();
    }
  }

  end = () => {
    if (this.isHorizontal()) {
      this.container.scrollLeft = this.start + this.distance;
    }
    else {
      this.container.scrollTop = this.start + this.distance;
    }

    if (this.options.callback) {
      this.options.callback();
    }

    this.timeStart = undefined;
  }

}


export function onScrollStop (element, callback, delay = 200) {
  let isScrolling = false;
  element.addEventListener ('scroll', () => {
    if (isScrolling) {
      window.clearTimeout (isScrolling);
    }
    isScrolling = window.setTimeout(callback, delay);
  });
}
