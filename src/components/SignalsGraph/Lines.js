import React from 'react';
import {
  Charts,
  ChartContainer,
  ChartRow,
  Resizable,
  YAxis,
  LineChart,
  Brush
} from 'react-timeseries-charts';
import { TimeSeries } from 'pondjs';

export default function Lines({
  dataLines,
  handleTimeRangeChange,
  timeRange,
  brushrange,
  hasBrush,
  setSelected,
  lineHeight
}) {
  const Signals = dataLines.map((dataLine) => {
    const timeseries = new TimeSeries(dataLine);

    return (
      <LineChart
        axis="axis1"
        key={dataLine.name}
        series={timeseries}
        style={{
          [dataLine.name]: {
            normal: {
              stroke: dataLine.color,
              fill: 'none',
              opacity: 0.2,
              strokeWidth: 2
            },
            highlighted: {
              stroke: dataLine.color,
              fill: 'none',
              strokeWidth: 2
            },
            selected: {
              stroke: dataLine.color,
              fill: 'none',
              strokeWidth: 2
            },
            muted: {
              stroke: dataLine.color,
              fill: 'none',
              opacity: 0.2,
              strokeWidth: 2
            }
          }
        }}
        interpolation="curveStepBefore"
        columns={[dataLine.name]}
        selection={dataLine.selected ? dataLine.name : ''}
        onSelectionChange={(selection) => setSelected(selection)}
      />
    );
  });

  return (
    <Resizable>
      <ChartContainer // buttom chart with brush
        showGrid={true}
        hideTimeAxis
        paddingLeft={5}
        paddingRight={10}z
        timeRange={timeRange}>
        <ChartRow debug={false} height={dataLines.length * lineHeight}>
          {hasBrush && (
            <Brush
              timeRange={brushrange}
              onTimeRangeChanged={handleTimeRangeChange}
            />
          )}
          <YAxis visible={false} id="axis1" min={0} max={dataLines.length + 2} type="linear" />
          <Charts>{Signals}</Charts>
        </ChartRow>
      </ChartContainer>
    </Resizable>
  );
}
