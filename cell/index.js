/**
 *  Cell Component
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from '../../util/cn';

export const Cell = ({ span, divide, offset, narrow, grow, className, children, ...rest }) => (
  <div
    className={cn`
      ${className}
      cell
      cell-n-${span}
      cell-d-${divide || span}
      ${{
        [`cell-o-${offset}`] : offset,
        'cell-w-narrow' : narrow,
        'cell-o-grow' : grow
      }}
    `}
    { ...rest }
  >
    {children}
  </div>
);

Cell.displayName = 'Cell';
Cell.propTypes = {
  span: PropTypes.number.isRequired,
  divide: PropTypes.number,
  offset: PropTypes.number,
  className: PropTypes.string
};
Cell.defaultProps = {
  span: 1,
  className: ''
};

export default Cell;
