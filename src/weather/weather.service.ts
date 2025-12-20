import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as moment from 'moment';

@Injectable()
export class WeatherService {
  private readonly geoBaseUrl =
    process.env.GEO_BASE_URL || 'https://nominatim.openstreetmap.org/search';
  private readonly tomorrowBaseUrl =
    process.env.TOMORROW_BASE_URL || 'https://api.tomorrow.io/v4';
  private readonly apiKey = process.env.TOMORROW_API_KEY;

  async getWeatherByCity(city: string, date?: string) {
    try {
      if (!this.apiKey) {
        throw new HttpException(
          'Tomorrow.io API key is not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      city = 'Hastings on Hudson, New York 10706'

      // Step 1: Get city coordinates
      const geoResponse = await axios.get(this.geoBaseUrl, {
        params: { q: city, format: 'json', limit: 1 },
      });

      if (!geoResponse.data.length) {
        throw new HttpException('City not found', HttpStatus.NOT_FOUND);
      }

      const { lat, lon, display_name } = geoResponse.data[0];

      // Step 2: Define the date range
      const startDate = date ? moment(date) : moment();
      const endDate = moment(startDate).add(1, 'day');

      // Step 3: Fetch weather data from Tomorrow.io
      const weatherResponse = await axios.get(
        `${this.tomorrowBaseUrl}/timelines`,
        {
          params: {
            location: `${lat},${lon}`,
            fields: [
              'temperature',
              'temperatureMax',
              'temperatureMin',
              'precipitationProbability',
              'windSpeed',
              'weatherCode',
              'humidity',
              'precipitationIntensity',
              'epaIndex',
            ],
            timesteps: ['1d'],
            startTime: startDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
            endTime: endDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
            apikey: this.apiKey,
            units: 'imperial',
          },
        },
      );

      if (!weatherResponse.data?.data?.timelines?.[0]?.intervals?.[0]) {
        throw new HttpException(
          'Weather data not available',
          HttpStatus.NOT_FOUND,
        );
      }

      const dailyData =
        weatherResponse.data.data.timelines[0].intervals[0].values;

      const lastUpdated = weatherResponse.data.data.timelines[0].intervals[0].startTime;

      // Map Tomorrow.io weather codes to conditions
      const currentWeather = {
        temperature: `${Math.round(dailyData.temperature)}°F`,
        windSpeed: `${dailyData.windSpeed} mph`,
        condition: this.getWeatherCondition(dailyData.weatherCode),
        humidity: `${Math.round(dailyData.humidity)}%`,
        precipitation: `${dailyData.precipitationIntensity} in/hr`,
        airQualityIndex: dailyData.epaIndex,
      };

      return {
        location: display_name,
        date: startDate.format('YYYY-MM-DD'),
        maxTemperature: `${Math.round(dailyData.temperatureMax)}°F`,
        minTemperature: `${Math.round(dailyData.temperatureMin)}°F`,
        rainProbability: `${Math.round(dailyData.precipitationProbability)}%`,
        current: currentWeather,
        lastUpdated,
      };
    } catch (error) {
      console.error(
        'Weather API Error:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        error.response?.data || error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private getWeatherCondition(code: number): string {
    const conditions: { [key: number]: string } = {
      1000: 'Clear',
      1100: 'Mostly Clear',
      1101: 'Partly Cloudy',
      1102: 'Mostly Cloudy',
      1001: 'Cloudy',
      2000: 'Fog',
      4000: 'Drizzle',
      4001: 'Rain',
      4200: 'Light Rain',
      4201: 'Heavy Rain',
      5000: 'Snow',
      5001: 'Flurries',
      5100: 'Light Snow',
      5101: 'Heavy Snow',
      6000: 'Freezing Drizzle',
      6001: 'Freezing Rain',
      7000: 'Ice Pellets',
      8000: 'Thunderstorm',
    };
    return conditions[code] || 'Unknown Condition';
  }
}
