export const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Peshawar',
  'Quetta',
  'Faisalabad',
  'Multan',
  'Other'
];

export const DISCOS = [
  'KESC (K-Electric)',
  'LESCO',
  'IESCO',
  'PESCO',
  'QESCO',
  'FESCO',
  'MEPCO',
  'HESCO',
  'SEPCO',
  'TESCO'
];

export const APPLIANCES = [
  'AC (Inverter)',
  'AC (Non-Inverter)',
  'Fridge',
  'Deep Freezer',
  'Washing Machine',
  'Water Pump (Motor)',
  'Iron',
  'UPS',
  'Generator'
];

// Helper to generate deterministic schedule based on location
export const generateMockSchedule = (city: string = '', disco: string = ''): import('./types').ScheduleSlot[] => {
  if (!city || !disco) return [];

  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const locationHash = hashString(city + disco);
  const numSlots = (locationHash % 2) + 2; 
  const slots: import('./types').ScheduleSlot[] = [];
  
  let currentStart = (locationHash % 6) + 6; 
  
  for (let i = 0; i < numSlots; i++) {
    const duration = (locationHash % 2) + 1; 
    const end = currentStart + duration;
    
    if (end < 24) {
      const confidence = 75 + ((locationHash + i) % 20);
      let status: 'confirmed' | 'predicted' | 'unclear' = 'predicted';
      if (confidence > 90) status = 'confirmed';
      else if (confidence < 80) status = 'unclear';

      slots.push({
        start: `${currentStart.toString().padStart(2, '0')}:00`,
        end: `${end.toString().padStart(2, '0')}:00`,
        confidence,
        status
      });
    }
    
    currentStart = end + 4 + (locationHash % 3); 
  }

  return slots;
};

export const generateMockWeeklyData = () => {
  return {
    totalHoursLost: 14.5,
    outages: [
      { day: 'Monday', duration: 2, time: '14:00 - 16:00' },
      { day: 'Tuesday', duration: 2.5, time: '15:00 - 17:30' },
      { day: 'Wednesday', duration: 1, time: '10:00 - 11:00' },
      { day: 'Thursday', duration: 3, time: '18:00 - 21:00' },
      { day: 'Friday', duration: 2, time: '13:00 - 15:00' },
      { day: 'Saturday', duration: 4, time: '12:00 - 16:00' },
      { day: 'Sunday', duration: 0, time: 'None' },
    ]
  };
};
