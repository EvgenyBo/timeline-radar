import { randomIntFromInterval } from './utils.js';

const channelMap = ({ id, segmentsTimeLines = [], channels = [] }) => ({ id, segmentsTimeLines, channels });

const channelViewGraphData = ({ targetChannel, chirpsStaggering, powerStaggeringirp, segments = [], signals = [], channelsChirpsTimeValue }) => ({ targetChannel, chirpsStaggering, powerStaggeringirp, segments, signals, channelsChirpsTimeValue });

const segment = ({ id, segment_index, isActive, startTime, duration }) => ({ id, segment_index, isActive, startTime, duration });

const channelsChirpsTimeValue = ({ chirpId, timeValue = [] }) => ({ chirpId, timeValue });

const signal = ({ id, timeValue }) => ({ id, timeValue });

const timeValue = ({ time, value }) => ({ time, value });

const createTimeValues = (axisTimeLength) => {
  let timeValues = [];
  let value = randomIntFromInterval(0, 1)
  for (let i = 0; i <= axisTimeLength; i+= randomIntFromInterval(1, 5)) {
    value = value === 0 ? 1 : 0;
    timeValues.push(timeValue({ time: i, value }));
  }
  return timeValues
}

const createSegments = (number) => {
  let segments = [];

  for (let i = 0; i < number; i++) {
    let startTime = i > 0 ? (segments[i - 1].startTime + segments[i - 1].duration) : 0;
    segments.push(segment({ id: `segment${i}`, segment_index: i, isActive: true, startTime, duration: randomIntFromInterval(1,3) }));
  }
  return segments;
}

const createSignals = (number) => {
  let signals = [];

  for (let i = 0; i < number; i ++) {
    signals.push(signal({ id: `signal${i}`, timeValue: createTimeValues(10) }))
  }

  return signals;
}

const createChannels = (number) => {
  let channels = [];

  for (let i = 0; i < number; i++) {
    channels.push(channelViewGraphData({
      targetChannel: `channel${i}`,
      isActive: false,
      isSelected: true,
      chirpsStaggering: null,
      powerStaggeringirp: null,
      segments: createSegments(5),
      signals: createSignals(40),
      channelsChirpsTimeValue: channelsChirpsTimeValue({ chirpId: 'chirp1', timeValue: createTimeValues(10) })
    }))
  }
  return channels;
}

export const channelsMap = channelMap({
  id: 'myChannelMap',
  segmentsTimeLines: createSegments(8),
  channels: createChannels(30)
});




