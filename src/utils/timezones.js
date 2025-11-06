// Timezone data with common cities grouped by timezone offset
export const TIMEZONES = [
  // Americas
  { offset: 'GMT-10', city: 'Honolulu', tz: 'Pacific/Honolulu' },
  { offset: 'GMT-9', city: 'Anchorage', tz: 'America/Anchorage' },
  { offset: 'GMT-8', city: 'Los Angeles', tz: 'America/Los_Angeles' },
  { offset: 'GMT-8', city: 'Vancouver', tz: 'America/Vancouver' },
  { offset: 'GMT-7', city: 'Denver', tz: 'America/Denver' },
  { offset: 'GMT-7', city: 'Phoenix', tz: 'America/Phoenix' },
  { offset: 'GMT-6', city: 'Chicago', tz: 'America/Chicago' },
  { offset: 'GMT-6', city: 'Mexico City', tz: 'America/Mexico_City' },
  { offset: 'GMT-5', city: 'New York', tz: 'America/New_York' },
  { offset: 'GMT-5', city: 'Toronto', tz: 'America/Toronto' },
  { offset: 'GMT-5', city: 'Bogotá', tz: 'America/Bogota' },
  { offset: 'GMT-4', city: 'Caracas', tz: 'America/Caracas' },
  { offset: 'GMT-3', city: 'Buenos Aires', tz: 'America/Argentina/Buenos_Aires' },
  { offset: 'GMT-3', city: 'São Paulo', tz: 'America/Sao_Paulo' },
  { offset: 'GMT-3', city: 'Santiago', tz: 'America/Santiago' },

  // Europe & Africa
  { offset: 'GMT+0', city: 'London', tz: 'Europe/London' },
  { offset: 'GMT+0', city: 'Dublin', tz: 'Europe/Dublin' },
  { offset: 'GMT+0', city: 'Lisbon', tz: 'Europe/Lisbon' },
  { offset: 'GMT+1', city: 'Paris', tz: 'Europe/Paris' },
  { offset: 'GMT+1', city: 'Berlin', tz: 'Europe/Berlin' },
  { offset: 'GMT+1', city: 'Rome', tz: 'Europe/Rome' },
  { offset: 'GMT+1', city: 'Madrid', tz: 'Europe/Madrid' },
  { offset: 'GMT+2', city: 'Athens', tz: 'Europe/Athens' },
  { offset: 'GMT+2', city: 'Cairo', tz: 'Africa/Cairo' },
  { offset: 'GMT+2', city: 'Jerusalem', tz: 'Asia/Jerusalem' },
  { offset: 'GMT+3', city: 'Moscow', tz: 'Europe/Moscow' },
  { offset: 'GMT+3', city: 'Istanbul', tz: 'Europe/Istanbul' },
  { offset: 'GMT+3', city: 'Nairobi', tz: 'Africa/Nairobi' },

  // Asia
  { offset: 'GMT+4', city: 'Dubai', tz: 'Asia/Dubai' },
  { offset: 'GMT+5', city: 'Karachi', tz: 'Asia/Karachi' },
  { offset: 'GMT+5:30', city: 'Mumbai', tz: 'Asia/Kolkata' },
  { offset: 'GMT+5:30', city: 'Delhi', tz: 'Asia/Kolkata' },
  { offset: 'GMT+6', city: 'Dhaka', tz: 'Asia/Dhaka' },
  { offset: 'GMT+7', city: 'Bangkok', tz: 'Asia/Bangkok' },
  { offset: 'GMT+7', city: 'Jakarta', tz: 'Asia/Jakarta' },
  { offset: 'GMT+8', city: 'Singapore', tz: 'Asia/Singapore' },
  { offset: 'GMT+8', city: 'Hong Kong', tz: 'Asia/Hong_Kong' },
  { offset: 'GMT+8', city: 'Beijing', tz: 'Asia/Shanghai' },
  { offset: 'GMT+9', city: 'Tokyo', tz: 'Asia/Tokyo' },
  { offset: 'GMT+9', city: 'Seoul', tz: 'Asia/Seoul' },
  { offset: 'GMT+10', city: 'Sydney', tz: 'Australia/Sydney' },
  { offset: 'GMT+10', city: 'Melbourne', tz: 'Australia/Melbourne' },
  { offset: 'GMT+12', city: 'Auckland', tz: 'Pacific/Auckland' }
]

export const getLocalTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const findTimezoneByCity = (cityName) => {
  return TIMEZONES.find(tz =>
    tz.city.toLowerCase().includes(cityName.toLowerCase())
  )
}

export const getTimezonesByOffset = (offset) => {
  return TIMEZONES.filter(tz => tz.offset === offset)
}
