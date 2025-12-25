export interface UserProfile {
  id: string;
  name: string;
  designation: string;
  headquarters: string;
  payLevel: string;
  basicPay: string;
  pfNumber: string;
  department: string;
  // New fields from Image 2
  branch: string;
  division: string;
  dailyRate: string; // Used to calculate the Amount column automatically
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  trainNo: string;
  depStation: string;
  depTime: string; // HH:mm
  arrStation: string;
  arrTime: string; // HH:mm
  distance: string;
  purpose: string; // Col 9
  percentClaimed: '100' | '70' | '30' | 'Nil'; // Col 8
  amount: string; // Col 10 (Calculated)
  otherDistance?: string; // Col 11 (Optional)
  remarks?: string; // Col 12 (Optional)
}

export const STATION_HINTS = [
  "CSMT", "DADAR", "THANE", "KYN", "PUNE", "NK", "BSL", "NGP", "SUR", "MMR", "KARAD", "SHENOLI", "TARGAON"
];

export const PURPOSE_HINTS = [
  "Official Duty",
  "Breakdown Duty",
  "Meeting at HQ",
  "Training",
  "Court Attendance",
  "Along with CS/KARAD",
  "Stay at TA/Z"
];
