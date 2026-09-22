export interface HealthRecord {
  id: string; // รหัสบุคคล เช่น H0001
  screeningDate: string; // วันที่คัดกรอง เช่น 3/1/2026
  dateFormatted: string; // YYYY-MM-DD
  area: string; // พื้นที่: เมือง, เหนือ, ใต้, ตะวันออก, ตะวันตก
  gender: 'ชาย' | 'หญิง' | string; // เพศ
  age: number; // อายุ
  height: number; // ส่วนสูง cm
  weight: number; // น้ำหนัก kg
  bmi: number; // BMI
  bmiCategory: string; // ผอม, ปกติ, ท้วม, อ้วน 1, อ้วน 2
  sbp: number; // ความดันตัวบน SBP mmHg
  dbp: number; // ความดันตัวล่าง DBP mmHg
  pulse: number; // ชีพจร bpm
  bloodGlucose: number; // น้ำตาลในเลือด mg/dL
  smoking: 'สูบ' | 'ไม่สูบ' | string; // สูบบุหรี่
  alcohol: 'ดื่ม' | 'ไม่ดื่ม' | string; // ดื่มแอลกอฮอล์
  exercise: 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย' | string; // การออกกำลังกาย
  diabetesScreening: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string; // เบาหวาน_คัดกรอง
  hypertensionScreening: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string; // ความดันโลหิตสูง_คัดกรอง
  riskScore: number; // คะแนนความเสี่ยง
  riskLevel: 'ต่ำ' | 'ปานกลาง' | 'สูง' | string; // ระดับความเสี่ยง
  month: string; // เดือน เช่น 2026-01
}

export interface FilterState {
  area: string;
  gender: string;
  month: string;
  dateStart: string;
  dateEnd: string;
  riskLevel: string;
  search: string;
}

export interface KpiSummary {
  // 1. จำนวน (Count)
  totalCount: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  diabetesRiskCount: number;
  hypertensionRiskCount: number;
  
  // 2. ค่าเฉลี่ย (Average)
  avgAge: number;
  avgBmi: number;
  avgSbp: number;
  avgDbp: number;
  avgPulse: number;
  avgGlucose: number;
  avgRiskScore: number;
  
  // 3. สัดส่วน (Ratio)
  genderRatioText: string; // e.g. "ชาย 1 : 1.13 หญิง"
  highRiskRatioText: string; // e.g. "1 ใน 2.5 คน"
  
  // 4. ร้อยละ (Percentage)
  percentHighRisk: number;
  percentDiabetesRisk: number;
  percentHypertensionRisk: number;
  percentSmoker: number;
  percentAlcohol: number;
  percentNoExercise: number;
}

export type ActiveNavTab = 'overview' | 'risk_trend' | 'behavior_corr' | 'detail_table';
