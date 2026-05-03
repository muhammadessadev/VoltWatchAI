export interface UserProfile {
  name: string;
  city: string;
  area: string;
  provider: string;
  appliances: string[];
}

export interface OutageSlot {
  id: string;
  startTime: string;
  endTime: string;
  type: 'Predicted' | 'Confirmed';
  confidence: number;
}

export const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta'];
export const PROVIDERS = ['KESC (K-Electric)', 'LESCO', 'IESCO', 'PESCO', 'QESCO', 'FESCO', 'MEPCO', 'HESCO'];
export const APPLIANCES = [
  'AC (Inverter)', 'AC (Non-Inverter)',
  'Fridge', 'Deep Freezer',
  'Washing Machine', 'Water Pump (Motor)',
  'Iron', 'UPS',
  'Generator'
];
