export class SensorValue {
  brightnessValue: number;
  MAC: string;
  id: number;
  timeMicroseconds: number;
  date: Date;

  constructor(brightnessValue: number, MAC: string, id: number, timeMicroseconds: number) {
    this.brightnessValue = brightnessValue;
    this.MAC = MAC;
    this.id = id;
    this.timeMicroseconds = timeMicroseconds;
    this.date = this.convertTimeMicrosecondsToDate(timeMicroseconds);
  }

  convertTimeMicrosecondsToDate(time_start: number) {
    return new Date(1000 * (time_start / 1000000));
  }

  static getHourFromTimestamp(timestampMicroseconds: number): number {
    const date = new Date(timestampMicroseconds / 1000); // Convert microseconds to milliseconds
    return date.getHours();
  }

  static calculateAverageBrightnessPerHour(sensorValues: SensorValue[]): { hour: number; averageBrightness: number }[] {
    const hourStats: { [hour: number]: { sum: number; count: number } } = {};

    // Calculate the sum and count of brightness values for each hour
    sensorValues.forEach((sensor) => {
      const hour = SensorValue.getHourFromTimestamp(sensor.timeMicroseconds);
      if (!hourStats[hour]) {
        hourStats[hour] = { sum: 0, count: 0 };
      }
      hourStats[hour].sum += sensor.brightnessValue;
      hourStats[hour].count += 1;
    });

    // Calculate the average brightness for each hour and handle missing hours
    const averageBrightnessPerHour = [];
    for (let hour = 0; hour < 24; hour++) {
      if (!hourStats[hour] || hourStats[hour].count === 0) {
        averageBrightnessPerHour.push({ hour, averageBrightness: 0 });
      } else {
        averageBrightnessPerHour.push({
          hour,
          averageBrightness: hourStats[hour].sum / hourStats[hour].count,
        });
      }
    }

    return averageBrightnessPerHour;
  }

  static countBrightnessBelowThresholdAfterExceedancePerHour(sensorValues: SensorValue[], brightnessThreshold: number): { hour: number; belowThresholdCount: number }[] {
    // Sort the sensorValues array based on timestamp in ascending order
    const sortedSensorValues = sensorValues.sort((a, b) => a.timeMicroseconds - b.timeMicroseconds);

    const hourStats: { [hour: number]: number } = {};

    let previousValueExceededThreshold = false;

    // Count the number of times brightness is below the threshold after exceeding it for each hour
    sortedSensorValues.forEach((sensor) => {
      const hour = SensorValue.getHourFromTimestamp(sensor.timeMicroseconds);
      if (!hourStats[hour]) {
        hourStats[hour] = 0;
      }

      const currentValueBelowThreshold = sensor.brightnessValue < brightnessThreshold;

      if (currentValueBelowThreshold && previousValueExceededThreshold) {
        hourStats[hour]++;
      }

      previousValueExceededThreshold = !currentValueBelowThreshold && sensor.brightnessValue > brightnessThreshold;
    });

    // Create an array with the hour and the corresponding below threshold count
    const belowThresholdPerHour = [];
    for (let hour = 0; hour < 24; hour++) {
      const belowThresholdCount = hourStats[hour] || 0;
      belowThresholdPerHour.push({ hour, belowThresholdCount });
    }

    return belowThresholdPerHour;
  }
}    
