import React, { Component } from 'react';
import cn from '../../util/cn';

export default class Segmented extends Component {
  static displayName = 'Segmented';
  static dividerWidth = 24;

  static defaultProps = {
    direction: 'horizontal'
  }

  constructor (props) {
    super (props);
    this.state = {
      dividerPosition: 0.5,
      lock: false,
      containerDim: null,
      firstDim: null,
      secondDim: null
    }
  }

  componentDidMount () {
    const containerDim = this.props.direction == 'vertical' ? this.container.offsetHeight : this.container.offsetWidth;
    const firstDim = containerDim * this.state.dividerPosition - Segmented.dividerWidth / 2;
    const secondDim = containerDim * (1 - this.state.dividerPosition) - Segmented.dividerWidth / 2;

    this.setState({
      containerDim,
      firstDim,
      secondDim
    });
  }

  onDragEnd = event => {
    const { direction } = this.props;
    const pos = direction === 'vertical' ? event.clientY : event.clientX;
    const begin = direction === 'vertical' ? this.container.offsetTop : this.container.offsetLeft;

    const firstDim = pos - begin;
    const secondDim = this.state.containerDim - (firstDim + Segmented.dividerWidth);
    const dividerPosition = (pos + Segmented.dividerWidth / 2) / this.state.containerDim;

    this.setState({
      dividerPosition,
      firstDim,
      secondDim,
      lock: false
    });
  }

  onDragStart = event => {
    this.setState({
      lock: true
    });
  }

  render () {
    const { direction } = this.props;
    const {
      dividerPosition,
      lock,
      firstDim,
      secondDim
    } = this.state;

    return (
      <div
        className={`
          ${direction === 'vertical' ? "purism-segmented-vert" : "purism-segmented-horz"}
          ${this.props.className}
        `}
        ref={x => this.container = x}
      >
        <div
          className="purism-segmented-segment"
          style={{
            [direction === 'vertical' ? 'height' : 'width']: firstDim
          }}
        >
          {this.props.first}
        </div>
        <div
          className="purism-segmented-divider"
          draggable={true}
          onDrag={this.onDrag}
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        />
        <div
          className="purism-segmented-segment"
          style={{
            [direction === 'vertical' ? 'height' : 'width']: secondDim
          }}
        >
          {this.props.second}
        </div>
      </div>
    );
  }
}
