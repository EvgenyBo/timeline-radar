import React, { Component } from 'react';
import { TimeRange } from 'pondjs';
import { channelsMap } from './data.js';
import PropTypes from 'prop-types';
import { getRandomColor, createPoints, timeToMs } from './utils.js';
import SignalsGraph from '../SignalsGraph/SignalsGraph';
import cloneDeep from 'lodash/cloneDeep';

const viewChannel = channelsMap.channels[0];
const { signals, segments, channelsChirpsTimeValue } = viewChannel;

const axisLength =
  segments[segments.length - 1].startTime +
  segments[segments.length - 1].duration;

const dataSegments = segments.map((seg) => ({
  ...seg,
  startTime: seg.startTime * 60 * 1000,
  duration: seg.duration * 60 * 1000
}));

const dataLines = signals.map((signal, i) => {
  return {
    name: signal.id,
    color: getRandomColor(),
    selected: true,
    columns: ['time', signal.id],
    points: createPoints(signal.timeValue, axisLength, i * 2) // .map((t) => [t.time, t.value])
  };
});

const dataChirps = {
  name: channelsChirpsTimeValue.chirpId,
  columns: ['time', channelsChirpsTimeValue.chirpId],
  points: createPoints(channelsChirpsTimeValue.timeValue, axisLength, 0) //channelsChirpsTimeValue.timeValue.map((t) => [t.time, t.value])
};

console.log('dataChirps', dataChirps)
console.log('dataLines', dataLines)
console.log('axisLength', axisLength)

export default class ChannelView extends Component {
  constructor() {
    const initialRange = new TimeRange([0, axisLength * 60000]);

    super();
    this.state = {
      brushrange: initialRange,
      timerange: initialRange,
      dataLines,
      dataSegmentsDynamic: dataSegments,
      axisLengthDynamic: axisLength * 60000
    };
  }

  handleTimeRangeChange = (timerange) => {
    const start = timeToMs(timerange.begin());
    const end = timeToMs(timerange.end());

    const newDynamicSegments = cloneDeep(dataSegments)
      .filter((seg) => {
        let segStart = seg.startTime;
        let segDuration = seg.duration;
        let isInRange =
          (segStart <= start && segStart + segDuration > start) ||
          (segStart < end && segStart + segDuration > end) ||
          (segStart >= start && segStart + segDuration <= end);
        return isInRange;
      })
      .map((seg, i, segments) => {
        if (i === 0) {
          seg.duration = seg.startTime + seg.duration - start;
          seg.startTime = 0;
        } else {
          if (i === segments.length - 1) {
            seg.duration = end - seg.startTime;
          }
          seg.startTime = segments[i - 1].startTime + segments[i - 1].duration;
        }
        return seg;
      });


    if (timerange) {
      this.setState({
        brushrange: timerange,
        dataSegmentsDynamic: newDynamicSegments,
        axisLengthDynamic: end - start
      });
    }
  };

  setSelected = (selected) => {
    this.setState((prevState) => ({
      dataLines: prevState.dataLines.map((d) =>
        d.name === selected ? { ...d, selected: !d.selected } : d
      )
    }));
  };

  render() {
    const { brushrange, dataLines, dataSegmentsDynamic, axisLengthDynamic } = this.state;

    return (
      <div style={{ width: this.props.width }}>
        <SignalsGraph
          segments={dataSegmentsDynamic}
          hasBrush={false}
          dataChirps={dataChirps}
          dataLines={dataLines}
          brushrange={brushrange}
          axisLength={axisLengthDynamic}
          handleTimeRangeChange={this.handleTimeRangeChange}
          setSelected={this.setSelected}
          lineHeight={15}
        />
        <SignalsGraph
          segments={dataSegments}
          showSegmentsNames
          hasBrush={true}
          axisLength={axisLength * 60000}
          dataChirps={dataChirps}
          dataLines={dataLines}
          brushrange={brushrange}
          handleTimeRangeChange={this.handleTimeRangeChange}
          setSelected={this.setSelected}
          lineHeight={15}
        />
      </div>
    );
  }
}

ChannelView.propTypes = {
  width: PropTypes.string
};
