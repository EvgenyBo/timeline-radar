export const getRandomColor = function() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const randomIntFromInterval = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const createPoints = (timeValue, axisLength, yHeight) => {

  const points = [];
  let timeValueIndex = 0;
  let nextTime = timeValue[timeValueIndex + 1]
    ? timeValue[timeValueIndex + 1].time
    : axisLength;
  let currentValue = timeValue[timeValueIndex].value + yHeight;

  for (let i = 0; i < axisLength; i++) {
    if (i < nextTime) {
      points.push([i * 60 * 1000, currentValue]);
    } else {
      timeValueIndex++;
      currentValue = timeValue[timeValueIndex] ? timeValue[timeValueIndex].value + yHeight : currentValue;
      points.push([i * 60 * 1000, currentValue]);
      nextTime = timeValue[timeValueIndex + 1]
        ? timeValue[timeValueIndex + 1].time
        : axisLength;
    }
  }
  return points;
};

// convert date string to milliseconds 
export const timeToMs = (time) => {
  return (time.getMinutes() * 60 * 1000) + (time.getSeconds() * 1000) + time.getMilliseconds();
}
