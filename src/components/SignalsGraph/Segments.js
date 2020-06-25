import React from 'react';

export default function Segments({ showNames, segments, axisLength }) {
  const activeSegments = segments.filter((seg) => {
    return seg.isActive;
  });

  return activeSegments.map(({ duration }, i) => {
    const begin = duration ? duration / 60000 : duration;
    const widthPercent = (100 * duration) / axisLength;

    return (
      <div
        key={i}
        style={{
          textAlign: 'center',
          width: `${widthPercent}%`,
          borderRight: '2px solid rgba(0, 0, 0, 0.5)'
        }}>
        {showNames ? <label>{`S${i + 1}`}</label> : null}
      </div>
    );
  });
}
