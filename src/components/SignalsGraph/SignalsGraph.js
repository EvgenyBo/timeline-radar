import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { TimeRange } from 'pondjs';
import Lines from './Lines';
import Chirps from './Chirps';
import Segments from './Segments';
import PropTypes from "prop-types";

export default function SignalsGraph({
  dataLines,
  dataChirps,
  segments,
  hasBrush,
  lineHeight,
  brushrange,
  handleTimeRangeChange,
  setSelected,
  axisLength,
  showSegmentsNames
}) {
  const timeRange = !hasBrush ? new TimeRange([brushrange.begin(), brushrange.end()]) : new TimeRange([0, axisLength])

  return (
    <div style={{ paddingTop: '2em', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          zIndex: 1,
          top: 0,
          flexDirection: 'row',
          position: 'absolute',
          width: '100%',
          height: '92%',
          border: '2px solid rgba(0, 0, 0, 0.5)',
          marginLeft: '4px',
          paddingRight: '10px',
          boxSizing: 'border-box'
        }}>
        <Segments
          showNames={showSegmentsNames}
          segments={segments}
          axisLength={axisLength}
        />
      </div>
      <Scrollbars
        renderTrackHorizontal={(props) => (
          <div
            {...props}
            className="track-horizontal"
            style={{ display: 'none' }}
          />
        )}
        renderThumbHorizontal={(props) => (
          <div
            {...props}
            className="thumb-horizontal"
            style={{ display: 'none' }}
          />
        )}
        style={{ height: 300, zIndex: 1, position: 'relative' }}>
  
          <Lines
            hasBrush={hasBrush}
            lineHeight={lineHeight}
            dataLines={dataLines}
            timeRange={timeRange}
            handleTimeRangeChange={handleTimeRangeChange}
            brushrange={brushrange}
            setSelected={setSelected}
          />
      </Scrollbars>
        {dataChirps && <Chirps
          hasBrush={hasBrush}
          timeRange={timeRange}
          dataChirps={dataChirps}
          brushrange={brushrange}
          handleTimeRangeChange={handleTimeRangeChange}
        />}
    </div>
  );
}

SignalsGraph.defaultProps = {
  dataLines: PropTypes.array,
  dataChirps: PropTypes.object,
  segments: PropTypes.array,
  hasBrush: PropTypes.bool,
  brushrange: PropTypes.string,
  handleTimeRangeChange: PropTypes.func,
  setSelected: PropTypes.string
};
