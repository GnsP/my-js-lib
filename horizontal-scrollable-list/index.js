/**
 *  Horizontal Scrollable List Component
 */

import { onScrollStop, Scroller } from './scroller';
import React, { Component } from 'react';

let style = {};
style.purismHorizontalScrollRow = 'purism-horizontal-scroll-row';
style.purismHorizontalScrollLeftButtonBar = 'purism-horizontal-scroll-left-button-bar';
style.purismHorizontalScrollButtonContainer = 'purism-horizontal-scroll-button-container';
style.purismHorizontalScrollCircularButton = 'purism-horizontal-scroll-circular-button';
style.unstyledA = 'unstyledA';
style.purismHorizontalScrollContainer = 'purism-horizontal-scroll-container';
style.purismHorizontalScrollRightButtonBar = 'purism-horizontal-scroll-right-button-bar';

export default class HorizontalScrollableList extends Component {
  static displayName = 'HorizontalScrollableList';
  static showScrollButtonThreshold = 30;
  static defaultProps = {
    children: [ <div /> ]
  };

  constructor (props) {
    super(props);
    this.listChildrenRefs = [];
    this.childrenOffsets = [];
    this.scrollWidth = 0;
    this.offsetLeft = 0;
    this.currentOffset = 0;

    this.state = {
      nextButton: true,
      prevButton: false,
      isScrolling: false
    };
  }

  componentDidMount () {
    // Keep it async. Otherwise init gets called before CSS is applied and we get incorrect values of width
    window.setTimeout(() => this.initialize(), 0);
  }

  render () {

    return (
      <div className={style.purismHorizontalScrollRow}>

        <div className={`${style.purismHorizontalScrollLeftButtonBar} ${this.state.prevButton ? '' : 'hide-d'}`}>
          <div className={style.purismHorizontalScrollButtonContainer}>
            <div className={style.purismHorizontalScrollCircularButton} >
              <a className={style.unstyledA} onClick={this.handleBackwardScroll} role='button'>
                {
                  this.props.navLeftIcon || '<'
                }
              </a>
            </div>
          </div>
        </div>

        <div
          className={style.purismHorizontalScrollContainer}
          ref={this.getScrollContainerRef}
        >
          <ul ref={this.getScrollableRef}>
          {
            React.Children.map( this.props.children, (child, index) =>
              (<li ref={this.getChildRef(index)} key={index}>
                { child }
              </li>)
            )
          }
          </ul>
        </div>

        <div className={`${style.purismHorizontalScrollRightButtonBar} ${this.state.nextButton ? '' : 'hide-d'}`}>
          <div className={style.purismHorizontalScrollButtonContainer}>
            <div className={style.purismHorizontalScrollCircularButton} >
              <a className={style.unstyledA} onClick={this.handleForwardScroll} role='button'>
                {
                  this.props.navRightIcon || '>'
                }
              </a>
            </div>
          </div>
        </div>

      </div>
    );
  }

  adjustScroll = () => {
    const currentPos = this.scrollable.scrollLeft + this.offsetLeft;
    for (let i = 0; i < this.childrenOffsets.length; i += 1) {
      if (this.childrenOffsets[i] >= currentPos) {
        this.currentOffset = i;
        break;
      }
    }

    const nextButton = this.scrollable.scrollLeft < ( this.scrollable.scrollWidth
      - this.scrollWidth - HorizontalScrollableList.showScrollButtonThreshold );
    const prevButton = this.scrollable.scrollLeft > HorizontalScrollableList.showScrollButtonThreshold;

    this.setState ( (prev) => ({
      ...prev,
      nextButton,
      prevButton,
      isScrolling: false
    }));
  }

  procBackwardScroll = () => {
    const scrollLeftBound = this.scrollable.scrollLeft;
    let scrollRightBound = scrollLeftBound + this.scrollWidth;

    for (let i = 0; i < this.childrenOffsets.length; i += 1) {
      if (this.childrenOffsets[i] < scrollLeftBound) {
        continue;
      } else {
        scrollRightBound = this.childrenOffsets[i + 1];
        break;
      }
    }

    const pos = scrollRightBound - this.scrollWidth;
    if (this.scroller) {
      this.scroller.scrollTo(pos);
    } else {
      this.scrollable.scrollLeft = pos;
      this.adjustScroll();
    }
  }

  handleBackwardScroll = () => {
    if (!this.state.isScrolling) {
      this.setState (
        (prev) => ({
          ...prev,
          isScrolling: true
        }),
        this.procBackwardScroll
      );
    }
  }

  procForwardScroll = () => {
    let scrollLeftBound = this.scrollable.scrollLeft;
    const scrollRightBound = scrollLeftBound + this.scrollWidth;

    for (let i = 0; i < this.childrenOffsets.length; i += 1) {
      if (this.childrenOffsets[i] <= scrollRightBound) {
        scrollLeftBound = this.childrenOffsets[i - 1];
        continue;
      } else {
        break;
      }
    }

    if (this.scroller) {
      this.scroller.scrollTo(scrollLeftBound);
    } else {
      this.scrollable.scrollLeft = scrollLeftBound;
      this.adjustScroll();
    }
  }

  handleForwardScroll = () => {
    if (!this.state.isScrolling) {
      this.setState ({ isScrolling: true }, this.procForwardScroll );
    }
  }

  initialize = () => {
    this.offsetLeft = this.scrollContainer.offsetLeft;
    this.scrollable.scrollLeft = this.currentOffset;
    this.scrollWidth = this.scrollContainer.offsetWidth;
    this.childrenOffsets = this.listChildrenRefs.map( (el) => el.offsetLeft - this.offsetLeft );
    this.scroller = new Scroller(this.scrollable, {duration: 1000, callback: this.adjustScroll});
    onScrollStop(this.scrollable, this.adjustScroll);
  }

  getChildRef (index) {
    return o => {
      this.listChildrenRefs[index] = o;
    };
  }

  getScrollContainerRef = (o) => {
    this.scrollContainer = o;
  }

  getScrollableRef = (o) => {
    this.scrollable = o;
  }
}
