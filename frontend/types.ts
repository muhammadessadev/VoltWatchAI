export interface UserProfile {
  name: string;
  city: string;
  area: string;
  disco: string;
  appliances: string[];
}

export interface ScheduleSlot {
  start: string;
  end: string;
  confidence: number;
  status: 'confirmed' | 'predicted' | 'unclear';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface TrackerState {
  upsBattery: number;
  generatorFuel: number;
}

export type TabType = 'dashboard' | 'planner' | 'chat' | 'map' | 'tracker' | 'reports' | 'profile';
