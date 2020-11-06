import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slider';
import './styles.scss';

type Props = {
  value: number;
  maxValue: number;
  displayProgress?: boolean;
  onValueChange: (value: number) => void;
};

const ProgressBar = ({
  value,
  maxValue,
  onValueChange,
  displayProgress,
}: Props) => {
  let percentage = 0;
  if (maxValue > 0 && value > 0) {
    percentage = Math.floor((value * 100) / maxValue);
  }

  function onSelectValue(value: any) {
    if (onValueChange) onValueChange(value);
  }

  return (
    <div className="ProgressBar">
      {displayProgress && (
        <span className="ProgressBar__Value">{`${percentage}%`}</span>
      )}
      <Slider
        className="ProgressBar__Slider"
        min={1}
        max={maxValue}
        orientation="horizontal"
        value={value}
        step={1}
        trackClassName={'ProgressBar__Slider__Track'}
        thumbClassName={'ProgressBar__Slider__Thumb'}
        onChange={onSelectValue}
        onSliderClick={onSelectValue}
      />
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  maxValue: PropTypes.number,
  displayProgress: PropTypes.bool,
  onValueChange: PropTypes.func,
};

ProgressBar.defaultProps = {
  maxValue: 100,
};

export default ProgressBar;
