import React, { Component } from 'react';
import { TimeRange } from 'pondjs';
import { channelsMap } from '../ChannelView/data';
import PropTypes from 'prop-types';
import { getRandomColor, createPoints } from '../ChannelView/utils.js';
import SignalsGraph from '../SignalsGraph/SignalsGraph';
import cloneDeep from 'lodash/cloneDeep';

const { channels, segmentsTimeLines: segments } = channelsMap;
//const { signals, segments, channelsChirpsTimeValue } = viewChannel;


const signals = channels.reduce((allSignals, ch) => (allSignals.concat(ch.signals)), []);
const chirps = channels.reduce((allChirps, ch) => ([...allChirps, {...ch.channelsChirpsTimeValue}]), []);


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

const dataChirps = chirps.map((chirp, i) => {
  return {
    name: chirp.chirpId,
    color: getRandomColor(),
    selected: true,
    columns: ['time', chirp.chirpId],
    points: createPoints(chirp.timeValue, axisLength, i * 2) // .map((t) => [t.time, t.value])
  };
});


export default class ChannelView extends Component {
  constructor() {
    const initialRange = new TimeRange([0, axisLength * 60000]);

    super();
    this.state = {
      brushrange: initialRange,
      timerange: initialRange,
      dataLines,
      dataSegmentsDynamic: dataSegments,
      axisLengthDynamic: axisLength
    };
  }

  handleTimeRangeChange = (timerange) => {
    const start = timerange.begin().getMinutes();
    const end = timerange.end().getMinutes();

    const toMinutes = (ms) => ms / 60000;
    const toMs = (min) => min * 60000;

    const newDynamicSegments = cloneDeep(dataSegments)
      .filter((seg) => {
        let segStart = toMinutes(seg.startTime);
        let segDuration = toMinutes(seg.duration);
        let isInRange =
          (segStart <= start && segStart + segDuration > start) ||
          (segStart < end && segStart + segDuration > end) ||
          (segStart >= start && segStart + segDuration <= end);
        return isInRange;
      })
      .map((seg, i, segments) => {
        if (i === 0) {
          seg.duration = seg.startTime + seg.duration - toMs(start);
          seg.startTime = 0;
        } else {
          if (i === segments.length - 1) {
            seg.duration = toMs(end) - seg.startTime;
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
          dataChirps={null}
          dataLines={dataChirps}
          brushrange={brushrange}
          axisLength={axisLengthDynamic}
          handleTimeRangeChange={this.handleTimeRangeChange}
          setSelected={this.setSelected}
          lineHeight={10}
        />
        <SignalsGraph
          segments={dataSegments}
          hasBrush={false}
          axisLength={axisLength}
          dataChirps={null}
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
