import { HealthRecord } from '../types';
import { rawInitialRecords } from '../data/defaultData';

export const SHEET_ID = '11dK-AFiGZo2CDpK3FxXy9f2H5WB11nBZD0sYBMVAc5o';

// Function to classify BMI according to Asian-Pacific WHO criteria
export function getBmiCategory(bmi: number): string {
  if (isNaN(bmi) || bmi <= 0) return 'ไม่ระบุ';
  if (bmi < 18.5) return 'น้ำหนักน้อย/ผอม';
  if (bmi < 23.0) return 'ปกติ/สมส่วน';
  if (bmi < 25.0) return 'น้ำหนักเกิน/ท้วม';
  if (bmi < 30.0) return 'อ้วนระดับ 1';
  return 'อ้วนระดับ 2';
}

// Convert D/M/YYYY or DD/MM/YYYY into YYYY-MM-DD
export function normalizeDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.trim().split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return dateStr;
}

// Format Date object to Thai display string
export function formatThaiDateTime(date: Date): string {
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  
  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const thaiYear = date.getFullYear() + 543;
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day} ${month} ${thaiYear} เวลา ${hours}:${minutes}:${seconds} น.`;
}

// CSV row parsing helper
export function parseCsvData(csvText: string): HealthRecord[] {
  const lines = csvText.split(/\r\n|\r|\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const records: HealthRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV splitter that respects commas inside quotes if any
    const values: string[] = [];
    let inQuotes = false;
    let current = '';
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const rowMap: Record<string, string> = {};
    headers.forEach((header, index) => {
      if (header) {
        rowMap[header] = values[index] ? values[index].replace(/^"|"$/g, '').trim() : '';
      }
    });

    const id = rowMap['รหัสบุคคล'] || `H${String(i).padStart(4, '0')}`;
    const rawDate = rowMap['วันที่คัดกรอง'] || '';
    const dateFormatted = normalizeDate(rawDate);
    const area = rowMap['พื้นที่'] || 'ไม่ระบุ';
    const gender = (rowMap['เพศ'] === 'ชาย' || rowMap['เพศ'] === 'หญิง') ? rowMap['เพศ'] : 'ไม่ระบุ';
    const age = parseFloat(rowMap['อายุ']) || 0;
    const height = parseFloat(rowMap['ส่วนสูง_cm']) || 0;
    const weight = parseFloat(rowMap['น้ำหนัก_kg']) || 0;
    const bmi = parseFloat(rowMap['BMI']) || (height > 0 ? +(weight / Math.pow(height / 100, 2)).toFixed(1) : 0);
    const sbp = parseFloat(rowMap['SBP_mmHg']) || 0;
    const dbp = parseFloat(rowMap['DBP_mmHg']) || 0;
    const pulse = parseFloat(rowMap['ชีพจร_bpm']) || 0;
    const bloodGlucose = parseFloat(rowMap['น้ำตาล_mg_dL']) || 0;
    const smoking = rowMap['สูบบุหรี่'] || 'ไม่สูบ';
    const alcohol = rowMap['ดื่มแอลกอฮอล์'] || 'ไม่ดื่ม';
    const exercise = rowMap['การออกกำลังกาย'] || 'ไม่ออกกำลังกาย';
    const diabetesScreening = rowMap['เบาหวาน_คัดกรอง'] || 'ไม่มี';
    const hypertensionScreening = rowMap['ความดันโลหิตสูง_คัดกรอง'] || 'ไม่มี';
    const riskScore = parseFloat(rowMap['คะแนนความเสี่ยง']) || 0;
    const riskLevel = rowMap['ระดับความเสี่ยง'] || (riskScore >= 4 ? 'สูง' : riskScore >= 2 ? 'ปานกลาง' : 'ต่ำ');
    const month = rowMap['เดือน'] || (dateFormatted ? dateFormatted.substring(0, 7) : '2026-01');

    records.push({
      id,
      screeningDate: rawDate,
      dateFormatted,
      area,
      gender,
      age,
      height,
      weight,
      bmi,
      bmiCategory: getBmiCategory(bmi),
      sbp,
      dbp,
      pulse,
      bloodGlucose,
      smoking,
      alcohol,
      exercise,
      diabetesScreening,
      hypertensionScreening,
      riskScore,
      riskLevel,
      month
    });
  }

  return records;
}

// JSONP fallback fetcher via Google Visualization API
function fetchViaJsonp(): Promise<HealthRecord[]> {
  return new Promise((resolve, reject) => {
    const callbackName = `gvizCallback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const script = document.createElement('script');
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('JSONP timeout'));
    }, 8000);

    const cleanup = () => {
      clearTimeout(timer);
      if (script.parentNode) script.parentNode.removeChild(script);
      // @ts-ignore
      delete window[callbackName];
    };

    // Prepare global handler for Google Visualization Query response
    // @ts-ignore
    window.google = window.google || {};
    // @ts-ignore
    window.google.visualization = window.google.visualization || {};
    // @ts-ignore
    window.google.visualization.Query = {
      setResponse: (response: any) => {
        cleanup();
        try {
          if (response && response.table && response.table.rows) {
            const cols = response.table.cols.map((c: any) => c.label || '');
            const parsedRecords: HealthRecord[] = [];
            
            response.table.rows.forEach((row: any, idx: number) => {
              const rowMap: Record<string, any> = {};
              row.c.forEach((cell: any, cIdx: number) => {
                const header = cols[cIdx];
                if (header && cell) {
                  rowMap[header] = cell.f ?? cell.v ?? '';
                }
              });

              const id = rowMap['รหัสบุคคล'] || `H${String(idx + 1).padStart(4, '0')}`;
              const rawDate = rowMap['วันที่คัดกรอง'] || '';
              const dateFormatted = normalizeDate(rawDate);
              const area = rowMap['พื้นที่'] || 'ไม่ระบุ';
              const gender = rowMap['เพศ'] || 'ไม่ระบุ';
              const age = Number(rowMap['อายุ']) || 0;
              const height = Number(rowMap['ส่วนสูง_cm']) || 0;
              const weight = Number(rowMap['น้ำหนัก_kg']) || 0;
              const bmi = Number(rowMap['BMI']) || 0;
              const sbp = Number(rowMap['SBP_mmHg']) || 0;
              const dbp = Number(rowMap['DBP_mmHg']) || 0;
              const pulse = Number(rowMap['ชีพจร_bpm']) || 0;
              const bloodGlucose = Number(rowMap['น้ำตาล_mg_dL']) || 0;
              const smoking = rowMap['สูบบุหรี่'] || 'ไม่สูบ';
              const alcohol = rowMap['ดื่มแอลกอฮอล์'] || 'ไม่ดื่ม';
              const exercise = rowMap['การออกกำลังกาย'] || 'ไม่ออกกำลังกาย';
              const diabetesScreening = rowMap['เบาหวาน_คัดกรอง'] || 'ไม่มี';
              const hypertensionScreening = rowMap['ความดันโลหิตสูง_คัดกรอง'] || 'ไม่มี';
              const riskScore = Number(rowMap['คะแนนความเสี่ยง']) || 0;
              const riskLevel = rowMap['ระดับความเสี่ยง'] || (riskScore >= 4 ? 'สูง' : riskScore >= 2 ? 'ปานกลาง' : 'ต่ำ');
              const month = rowMap['เดือน'] || (dateFormatted ? dateFormatted.substring(0, 7) : '2026-01');

              parsedRecords.push({
                id,
                screeningDate: rawDate,
                dateFormatted,
                area,
                gender,
                age,
                height,
                weight,
                bmi,
                bmiCategory: getBmiCategory(bmi),
                sbp,
                dbp,
                pulse,
                bloodGlucose,
                smoking,
                alcohol,
                exercise,
                diabetesScreening,
                hypertensionScreening,
                riskScore,
                riskLevel,
                month
              });
            });
            resolve(parsedRecords);
          } else {
            reject(new Error('Invalid table format'));
          }
        } catch (e) {
          reject(e);
        }
      }
    };

    script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&t=${Date.now()}`;
    script.onerror = () => {
      cleanup();
      reject(new Error('Failed to load JSONP script'));
    };
    document.body.appendChild(script);
  });
}

// Master load function
export async function fetchHealthData(): Promise<{
  records: HealthRecord[];
  lastUpdated: Date;
  source: 'proxy' | 'direct' | 'jsonp' | 'snapshot';
}> {
  // Strategy 1: Local proxy endpoint /api/sheet-data
  try {
    const res = await fetch(`/api/sheet-data?t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const csv = await res.text();
      const records = parseCsvData(csv);
      if (records.length > 0) {
        return { records, lastUpdated: new Date(), source: 'proxy' };
      }
    }
  } catch (e) {
    // Continue to next strategy
  }

  // Strategy 2: Direct Google Sheet CSV export
  try {
    const directUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&t=${Date.now()}`;
    const res = await fetch(directUrl, { mode: 'cors' });
    if (res.ok) {
      const csv = await res.text();
      const records = parseCsvData(csv);
      if (records.length > 0) {
        return { records, lastUpdated: new Date(), source: 'direct' };
      }
    }
  } catch (e) {
    // Continue to next strategy
  }

  // Strategy 3: JSONP (always bypasses browser CORS)
  try {
    const records = await fetchViaJsonp();
    if (records && records.length > 0) {
      return { records, lastUpdated: new Date(), source: 'jsonp' };
    }
  } catch (e) {
    // Fall through to snapshot
  }

  // Strategy 4: Initial snapshot fallback
  return {
    records: rawInitialRecords,
    lastUpdated: new Date(),
    source: 'snapshot'
  };
}
