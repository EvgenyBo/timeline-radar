import React from 'react';
import {
  Charts,
  ChartContainer,
  ChartRow,
  Resizable,
  YAxis,
  Brush,
  AreaChart
} from 'react-timeseries-charts';
import { TimeSeries } from 'pondjs';
import { styler } from 'react-timeseries-charts';
import { timeToMs } from '../ChannelView/utils'

const style = styler([{ key: 'chirp1', color: 'lightblue' }]);

export default function Chirps({
  timeRange,
  dataChirps,
  hasBrush,
  brushrange,
  handleTimeRangeChange
}) {
  const chirpSeries = new TimeSeries(dataChirps);
  return (
    <Resizable>
      <ChartContainer // buttom chirps with brush
        showGrid={true}
        paddingLeft={5}
        paddingRight={10}
        format={(t) => {
          return timeToMs(t);
        }}
        timeRange={timeRange}>
        <ChartRow debug={false} height="50">
          {hasBrush && (
            <Brush
              timeRange={brushrange}
              onTimeRangeChanged={handleTimeRangeChange}
            />
          )}
          <YAxis
            id="traffic"
            visible={false}
            min={0}
            max={1}
            absolute
            type="linear"
          />
          <Charts>
            <AreaChart
              axis="traffic"
              style={style.areaChartStyle()}
              interpolation="curveStepBefore"
              columns={{ up: [dataChirps.name], down: [] }}
              series={chirpSeries}
            />
          </Charts>
        </ChartRow>
      </ChartContainer>
    </Resizable>
  );
}
