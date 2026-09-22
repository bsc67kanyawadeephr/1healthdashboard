import { HealthRecord, KpiSummary } from '../types';

export function calculateKpis(records: HealthRecord[]): KpiSummary {
  const total = records.length;
  if (total === 0) {
    return {
      totalCount: 0,
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      diabetesRiskCount: 0,
      hypertensionRiskCount: 0,
      avgAge: 0,
      avgBmi: 0,
      avgSbp: 0,
      avgDbp: 0,
      avgPulse: 0,
      avgGlucose: 0,
      avgRiskScore: 0,
      genderRatioText: '0 : 0',
      highRiskRatioText: '0 ใน 0',
      percentHighRisk: 0,
      percentDiabetesRisk: 0,
      percentHypertensionRisk: 0,
      percentSmoker: 0,
      percentAlcohol: 0,
      percentNoExercise: 0,
    };
  }

  let highRiskCount = 0;
  let mediumRiskCount = 0;
  let lowRiskCount = 0;
  let diabetesRiskCount = 0;
  let hypertensionRiskCount = 0;
  let smokerCount = 0;
  let alcoholCount = 0;
  let noExerciseCount = 0;
  let maleCount = 0;
  let femaleCount = 0;

  let sumAge = 0;
  let sumBmi = 0;
  let sumSbp = 0;
  let sumDbp = 0;
  let sumPulse = 0;
  let sumGlucose = 0;
  let sumRiskScore = 0;

  records.forEach((r) => {
    if (r.riskLevel === 'สูง') highRiskCount++;
    else if (r.riskLevel === 'ปานกลาง') mediumRiskCount++;
    else lowRiskCount++;

    if (r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง') diabetesRiskCount++;
    if (r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง') hypertensionRiskCount++;

    if (r.smoking === 'สูบ') smokerCount++;
    if (r.alcohol === 'ดื่ม') alcoholCount++;
    if (r.exercise === 'ไม่ออกกำลังกาย') noExerciseCount++;

    if (r.gender === 'ชาย') maleCount++;
    if (r.gender === 'หญิง') femaleCount++;

    sumAge += r.age;
    sumBmi += r.bmi;
    sumSbp += r.sbp;
    sumDbp += r.dbp;
    sumPulse += r.pulse;
    sumGlucose += r.bloodGlucose;
    sumRiskScore += r.riskScore;
  });

  // Calculate gender ratio
  let genderRatioText = '1 : 1';
  if (maleCount > 0 && femaleCount > 0) {
    if (maleCount >= femaleCount) {
      genderRatioText = `ชาย ${(maleCount / femaleCount).toFixed(1)} : 1 หญิง`;
    } else {
      genderRatioText = `ชาย 1 : ${(femaleCount / maleCount).toFixed(1)} หญิง`;
    }
  } else if (maleCount > 0) {
    genderRatioText = `ชาย 100%`;
  } else if (femaleCount > 0) {
    genderRatioText = `หญิง 100%`;
  }

  // Calculate high risk ratio (e.g. 1 in X people)
  let highRiskRatioText = '-';
  if (highRiskCount > 0) {
    const oneInX = (total / highRiskCount).toFixed(1);
    highRiskRatioText = `1 ใน ${oneInX} คน`;
  } else {
    highRiskRatioText = `0 ใน ${total} คน`;
  }

  return {
    totalCount: total,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    diabetesRiskCount,
    hypertensionRiskCount,
    avgAge: +(sumAge / total).toFixed(1),
    avgBmi: +(sumBmi / total).toFixed(1),
    avgSbp: +(sumSbp / total).toFixed(0),
    avgDbp: +(sumDbp / total).toFixed(0),
    avgPulse: +(sumPulse / total).toFixed(0),
    avgGlucose: +(sumGlucose / total).toFixed(1),
    avgRiskScore: +(sumRiskScore / total).toFixed(1),
    genderRatioText,
    highRiskRatioText,
    percentHighRisk: +((highRiskCount / total) * 100).toFixed(1),
    percentDiabetesRisk: +((diabetesRiskCount / total) * 100).toFixed(1),
    percentHypertensionRisk: +((hypertensionRiskCount / total) * 100).toFixed(1),
    percentSmoker: +((smokerCount / total) * 100).toFixed(1),
    percentAlcohol: +((alcoholCount / total) * 100).toFixed(1),
    percentNoExercise: +((noExerciseCount / total) * 100).toFixed(1),
  };
}

// 3.1 Health Risk Breakdown
export function getHealthRiskAnalytics(records: HealthRecord[]) {
  const total = records.length || 1;

  // 1. ระดับความเสี่ยง
  const riskCounts = { ต่ำ: 0, ปานกลาง: 0, สูง: 0 };
  // 2. เบาหวาน
  const dmCounts = { 'ไม่มี': 0, 'มีแนวโน้ม/เสี่ยง': 0 };
  // 3. ความดันโลหิตสูง
  const htCounts = { 'ไม่มี': 0, 'มีแนวโน้ม/เสี่ยง': 0 };
  // 4. BMI categories
  const bmiCounts: Record<string, number> = {
    'น้ำหนักน้อย/ผอม': 0,
    'ปกติ/สมส่วน': 0,
    'น้ำหนักเกิน/ท้วม': 0,
    'อ้วนระดับ 1': 0,
    'อ้วนระดับ 2': 0,
  };

  records.forEach((r) => {
    if (r.riskLevel in riskCounts) riskCounts[r.riskLevel as keyof typeof riskCounts]++;
    if (r.diabetesScreening in dmCounts) dmCounts[r.diabetesScreening as keyof typeof dmCounts]++;
    if (r.hypertensionScreening in htCounts) htCounts[r.hypertensionScreening as keyof typeof htCounts]++;
    if (r.bmiCategory in bmiCounts) bmiCounts[r.bmiCategory]++;
    else bmiCounts['ปกติ/สมส่วน']++;
  });

  const riskPieData = [
    { name: 'ความเสี่ยงต่ำ', count: riskCounts['ต่ำ'], percentage: +((riskCounts['ต่ำ'] / total) * 100).toFixed(1), color: '#10b981' },
    { name: 'ความเสี่ยงปานกลาง', count: riskCounts['ปานกลาง'], percentage: +((riskCounts['ปานกลาง'] / total) * 100).toFixed(1), color: '#f59e0b' },
    { name: 'ความเสี่ยงสูง', count: riskCounts['สูง'], percentage: +((riskCounts['สูง'] / total) * 100).toFixed(1), color: '#f43f5e' },
  ];

  const dmData = [
    { name: 'ไม่มีความเสี่ยง', value: dmCounts['ไม่มี'], color: '#38bdf8' },
    { name: 'มีแนวโน้ม/เสี่ยง', value: dmCounts['มีแนวโน้ม/เสี่ยง'], color: '#f43f5e' },
  ];

  const htData = [
    { name: 'ไม่มีความเสี่ยง', value: htCounts['ไม่มี'], color: '#38bdf8' },
    { name: 'มีแนวโน้ม/เสี่ยง', value: htCounts['มีแนวโน้ม/เสี่ยง'], color: '#f43f5e' },
  ];

  const bmiData = Object.entries(bmiCounts).map(([cat, count]) => ({
    name: cat,
    count,
    percentage: +((count / total) * 100).toFixed(1),
  }));

  return { riskPieData, dmData, htData, bmiData };
}

// 3.2 Health Trend Breakdown
export function getHealthTrendAnalytics(records: HealthRecord[]) {
  // Sort chronologically
  const sorted = [...records].sort((a, b) => (a.dateFormatted || '').localeCompare(b.dateFormatted || ''));

  // Group by date
  const dateMap = new Map<string, { count: number; sumScore: number; maxScore: number; highRiskCount: number }>();

  sorted.forEach((r) => {
    const key = r.dateFormatted || r.screeningDate;
    if (!dateMap.has(key)) {
      dateMap.set(key, { count: 0, sumScore: 0, maxScore: 0, highRiskCount: 0 });
    }
    const current = dateMap.get(key)!;
    current.count += 1;
    current.sumScore += r.riskScore;
    if (r.riskScore > current.maxScore) current.maxScore = r.riskScore;
    if (r.riskLevel === 'สูง') current.highRiskCount += 1;
  });

  const trendData = Array.from(dateMap.entries()).map(([dateStr, d]) => {
    // Format friendly label: "3 ม.ค.", "5 ม.ค."
    const parts = dateStr.split('-');
    let shortLabel = dateStr;
    if (parts.length === 3) {
      const monthNames = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      const mIdx = parseInt(parts[1], 10);
      shortLabel = `${parseInt(parts[2], 10)} ${monthNames[mIdx] || ''}`;
    }
    return {
      dateRaw: dateStr,
      label: shortLabel,
      avgScore: +(d.sumScore / d.count).toFixed(1),
      maxScore: d.maxScore,
      count: d.count,
      highRiskCount: d.highRiskCount,
    };
  });

  // Group by month
  const monthMap = new Map<string, { count: number; sumScore: number; highRiskCount: number }>();
  sorted.forEach((r) => {
    const m = r.month || '2026-01';
    if (!monthMap.has(m)) monthMap.set(m, { count: 0, sumScore: 0, highRiskCount: 0 });
    const c = monthMap.get(m)!;
    c.count += 1;
    c.sumScore += r.riskScore;
    if (r.riskLevel === 'สูง') c.highRiskCount += 1;
  });

  const monthNamesTh: Record<string, string> = {
    '2026-01': 'มกราคม 2569',
    '2026-02': 'กุมภาพันธ์ 2569',
    '2026-03': 'มีนาคม 2569',
  };

  const monthlyData = Array.from(monthMap.entries()).map(([m, d]) => ({
    month: m,
    name: monthNamesTh[m] || m,
    avgScore: +(d.sumScore / d.count).toFixed(2),
    count: d.count,
    highRiskCount: d.highRiskCount,
    highRiskPercent: +((d.highRiskCount / d.count) * 100).toFixed(1),
  }));

  return { trendData, monthlyData };
}

// 3.3 Health Behavior Breakdown
export function getHealthBehaviorAnalytics(records: HealthRecord[]) {
  const total = records.length || 1;

  // Exercise
  const exerciseMap: Record<string, number> = { 'สม่ำเสมอ': 0, 'บางครั้ง': 0, 'ไม่ออกกำลังกาย': 0 };
  // Smoking
  const smokingMap: Record<string, number> = { 'สูบ': 0, 'ไม่สูบ': 0 };
  // Alcohol
  const alcoholMap: Record<string, number> = { 'ดื่ม': 0, 'ไม่ดื่ม': 0 };

  // By Gender
  const maleBehaviors = { count: 0, smoke: 0, drink: 0, noExercise: 0, regularExercise: 0 };
  const femaleBehaviors = { count: 0, smoke: 0, drink: 0, noExercise: 0, regularExercise: 0 };

  records.forEach((r) => {
    if (r.exercise in exerciseMap) exerciseMap[r.exercise]++;
    if (r.smoking in smokingMap) smokingMap[r.smoking]++;
    if (r.alcohol in alcoholMap) alcoholMap[r.alcohol]++;

    const target = r.gender === 'ชาย' ? maleBehaviors : femaleBehaviors;
    target.count++;
    if (r.smoking === 'สูบ') target.smoke++;
    if (r.alcohol === 'ดื่ม') target.drink++;
    if (r.exercise === 'ไม่ออกกำลังกาย') target.noExercise++;
    if (r.exercise === 'สม่ำเสมอ') target.regularExercise++;
  });

  const exerciseData = [
    { name: 'สม่ำเสมอ', count: exerciseMap['สม่ำเสมอ'], percentage: +((exerciseMap['สม่ำเสมอ'] / total) * 100).toFixed(1), color: '#10b981' },
    { name: 'บางครั้ง', count: exerciseMap['บางครั้ง'], percentage: +((exerciseMap['บางครั้ง'] / total) * 100).toFixed(1), color: '#f59e0b' },
    { name: 'ไม่ออกกำลังกาย', count: exerciseMap['ไม่ออกกำลังกาย'], percentage: +((exerciseMap['ไม่ออกกำลังกาย'] / total) * 100).toFixed(1), color: '#f43f5e' },
  ];

  const genderComparisonData = [
    {
      behavior: 'สูบบุหรี่',
      ชาย: maleBehaviors.count > 0 ? +((maleBehaviors.smoke / maleBehaviors.count) * 100).toFixed(1) : 0,
      หญิง: femaleBehaviors.count > 0 ? +((femaleBehaviors.smoke / femaleBehaviors.count) * 100).toFixed(1) : 0,
    },
    {
      behavior: 'ดื่มแอลกอฮอล์',
      ชาย: maleBehaviors.count > 0 ? +((maleBehaviors.drink / maleBehaviors.count) * 100).toFixed(1) : 0,
      หญิง: femaleBehaviors.count > 0 ? +((femaleBehaviors.drink / femaleBehaviors.count) * 100).toFixed(1) : 0,
    },
    {
      behavior: 'ไม่ออกกำลังกาย',
      ชาย: maleBehaviors.count > 0 ? +((maleBehaviors.noExercise / maleBehaviors.count) * 100).toFixed(1) : 0,
      หญิง: femaleBehaviors.count > 0 ? +((femaleBehaviors.noExercise / femaleBehaviors.count) * 100).toFixed(1) : 0,
    },
    {
      behavior: 'ออกกำลังกายสม่ำเสมอ',
      ชาย: maleBehaviors.count > 0 ? +((maleBehaviors.regularExercise / maleBehaviors.count) * 100).toFixed(1) : 0,
      หญิง: femaleBehaviors.count > 0 ? +((femaleBehaviors.regularExercise / femaleBehaviors.count) * 100).toFixed(1) : 0,
    },
  ];

  return { exerciseData, smokingMap, alcoholMap, genderComparisonData };
}

// 4. Advanced Analytics & Cross-tabulations:
// - กลุ่มอายุที่มีความเสี่ยงสูง
// - พื้นที่ที่มีผู้เสี่ยงสูง
// - ความสัมพันธ์ระหว่าง BMI กับความดัน
// - พฤติกรรมกับระดับความเสี่ยง
export function getAdvancedCrossAnalytics(records: HealthRecord[]) {
  // A. กลุ่มอายุที่มีความเสี่ยงสูง
  const ageGroups: Record<string, { label: string; total: number; low: number; mid: number; high: number }> = {
    '<30': { label: 'ต่ำกว่า 30 ปี', total: 0, low: 0, mid: 0, high: 0 },
    '30-44': { label: '30 - 44 ปี', total: 0, low: 0, mid: 0, high: 0 },
    '45-59': { label: '45 - 59 ปี', total: 0, low: 0, mid: 0, high: 0 },
    '>=60': { label: '60 ปีขึ้นไป (ผู้สูงอายุ)', total: 0, low: 0, mid: 0, high: 0 },
  };

  records.forEach((r) => {
    let groupKey = '>=60';
    if (r.age < 30) groupKey = '<30';
    else if (r.age < 45) groupKey = '30-44';
    else if (r.age < 60) groupKey = '45-59';

    const g = ageGroups[groupKey];
    g.total++;
    if (r.riskLevel === 'สูง') g.high++;
    else if (r.riskLevel === 'ปานกลาง') g.mid++;
    else g.low++;
  });

  const ageRiskData = Object.values(ageGroups).map((g) => ({
    ageGroup: g.label,
    ความเสี่ยงต่ำ: g.low,
    ความเสี่ยงปานกลาง: g.mid,
    ความเสี่ยงสูง: g.high,
    total: g.total,
    highRiskPercent: g.total > 0 ? +((g.high / g.total) * 100).toFixed(1) : 0,
  }));

  // B. พื้นที่ที่มีผู้เสี่ยงสูง
  const areaMap = new Map<string, { area: string; total: number; low: number; mid: number; high: number; sumBmi: number; sumSbp: number }>();
  records.forEach((r) => {
    if (!areaMap.has(r.area)) {
      areaMap.set(r.area, { area: r.area, total: 0, low: 0, mid: 0, high: 0, sumBmi: 0, sumSbp: 0 });
    }
    const item = areaMap.get(r.area)!;
    item.total++;
    item.sumBmi += r.bmi;
    item.sumSbp += r.sbp;
    if (r.riskLevel === 'สูง') item.high++;
    else if (r.riskLevel === 'ปานกลาง') item.mid++;
    else item.low++;
  });

  const areaRiskData = Array.from(areaMap.values())
    .map((a) => ({
      area: a.area,
      total: a.total,
      low: a.low,
      mid: a.mid,
      high: a.high,
      highRiskPercent: a.total > 0 ? +((a.high / a.total) * 100).toFixed(1) : 0,
      avgBmi: a.total > 0 ? +(a.sumBmi / a.total).toFixed(1) : 0,
      avgSbp: a.total > 0 ? +(a.sumSbp / a.total).toFixed(0) : 0,
    }))
    .sort((a, b) => b.highRiskPercent - a.highRiskPercent);

  // C. ความสัมพันธ์ระหว่าง BMI กับความดัน (Scatter / Quadrant)
  const bmiBpScatter = records.map((r) => ({
    id: r.id,
    bmi: r.bmi,
    sbp: r.sbp,
    dbp: r.dbp,
    age: r.age,
    gender: r.gender,
    riskLevel: r.riskLevel,
    riskScore: r.riskScore,
    name: `${r.id} (${r.gender} ${r.age} ปี)`,
  }));

  // D. พฤติกรรมกับระดับความเสี่ยง
  // Comparison: สูบ vs ไม่สูบ, ดื่ม vs ไม่ดื่ม, ออกกำลังกาย vs ไม่ออก
  const behaviorVsRisk = [
    {
      group: 'สูบบุหรี่',
      total: records.filter((r) => r.smoking === 'สูบ').length,
      highRisk: records.filter((r) => r.smoking === 'สูบ' && r.riskLevel === 'สูง').length,
    },
    {
      group: 'ไม่สูบบุหรี่',
      total: records.filter((r) => r.smoking === 'ไม่สูบ').length,
      highRisk: records.filter((r) => r.smoking === 'ไม่สูบ' && r.riskLevel === 'สูง').length,
    },
    {
      group: 'ดื่มแอลกอฮอล์',
      total: records.filter((r) => r.alcohol === 'ดื่ม').length,
      highRisk: records.filter((r) => r.alcohol === 'ดื่ม' && r.riskLevel === 'สูง').length,
    },
    {
      group: 'ไม่ดื่มแอลกอฮอล์',
      total: records.filter((r) => r.alcohol === 'ไม่ดื่ม').length,
      highRisk: records.filter((r) => r.alcohol === 'ไม่ดื่ม' && r.riskLevel === 'สูง').length,
    },
    {
      group: 'ไม่ออกกำลังกาย',
      total: records.filter((r) => r.exercise === 'ไม่ออกกำลังกาย').length,
      highRisk: records.filter((r) => r.exercise === 'ไม่ออกกำลังกาย' && r.riskLevel === 'สูง').length,
    },
    {
      group: 'ออกกำลังกายสม่ำเสมอ',
      total: records.filter((r) => r.exercise === 'สม่ำเสมอ').length,
      highRisk: records.filter((r) => r.exercise === 'สม่ำเสมอ' && r.riskLevel === 'สูง').length,
    },
  ].map((b) => ({
    behavior: b.group,
    total: b.total,
    highRisk: b.highRisk,
    percent: b.total > 0 ? +((b.highRisk / b.total) * 100).toFixed(1) : 0,
  }));

  return { ageRiskData, areaRiskData, bmiBpScatter, behaviorVsRisk };
}

// 5. สรุปผลการคัดกรองจำแนกตามพื้นที่และกลุ่มประชากร (Area & Demographic Summary)
export interface AreaDemographicSummaryRow {
  area: string;
  gender: string;
  count: number;
  avgAge: number;
  avgBmi: number;
  avgSbp: number;
  avgDbp: number;
  avgGlucose: number;
  highRiskCount: number;
  highRiskPercent: number;
  diabetesRiskPercent: number;
  hypertensionRiskPercent: number;
  avgRiskScore: number;
}

export function getAreaDemographicSummary(records: HealthRecord[]): AreaDemographicSummaryRow[] {
  const map = new Map<string, {
    area: string;
    gender: string;
    count: number;
    sumAge: number;
    sumBmi: number;
    sumSbp: number;
    sumDbp: number;
    sumGlucose: number;
    highRiskCount: number;
    dmRiskCount: number;
    htRiskCount: number;
    sumRiskScore: number;
  }>();

  records.forEach((r) => {
    const key = `${r.area}_${r.gender}`;
    if (!map.has(key)) {
      map.set(key, {
        area: r.area,
        gender: r.gender,
        count: 0,
        sumAge: 0,
        sumBmi: 0,
        sumSbp: 0,
        sumDbp: 0,
        sumGlucose: 0,
        highRiskCount: 0,
        dmRiskCount: 0,
        htRiskCount: 0,
        sumRiskScore: 0,
      });
    }

    const item = map.get(key)!;
    item.count++;
    item.sumAge += r.age;
    item.sumBmi += r.bmi;
    item.sumSbp += r.sbp;
    item.sumDbp += r.dbp;
    item.sumGlucose += r.bloodGlucose;
    item.sumRiskScore += r.riskScore;
    if (r.riskLevel === 'สูง') item.highRiskCount++;
    if (r.diabetesScreening === 'มีแนวโน้ม/เสี่ยง') item.dmRiskCount++;
    if (r.hypertensionScreening === 'มีแนวโน้ม/เสี่ยง') item.htRiskCount++;
  });

  return Array.from(map.values())
    .map((item) => ({
      area: item.area,
      gender: item.gender,
      count: item.count,
      avgAge: +(item.sumAge / item.count).toFixed(1),
      avgBmi: +(item.sumBmi / item.count).toFixed(1),
      avgSbp: +(item.sumSbp / item.count).toFixed(0),
      avgDbp: +(item.sumDbp / item.count).toFixed(0),
      avgGlucose: +(item.sumGlucose / item.count).toFixed(1),
      highRiskCount: item.highRiskCount,
      highRiskPercent: +((item.highRiskCount / item.count) * 100).toFixed(1),
      diabetesRiskPercent: +((item.dmRiskCount / item.count) * 100).toFixed(1),
      hypertensionRiskPercent: +((item.htRiskCount / item.count) * 100).toFixed(1),
      avgRiskScore: +(item.sumRiskScore / item.count).toFixed(1),
    }))
    .sort((a, b) => a.area.localeCompare(b.area, 'th') || a.gender.localeCompare(b.gender, 'th'));
}
