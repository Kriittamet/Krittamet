import { InspectionRecord } from '../types';

export function formatThaiDate(isoString: string, full = false): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '-';
    
    const day = d.getDate();
    const monthIndex = d.getMonth();
    const yearThai = d.getFullYear() + 543;
    
    const thaiMonthsShort = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    
    const thaiMonthsFull = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    const thaiDays = [
      'วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'
    ];

    if (full) {
      return `${thaiDays[d.getDay()]}ที่ ${day} ${thaiMonthsFull[monthIndex]} พ.ศ. ${yearThai}`;
    }
    return `${day} ${thaiMonthsShort[monthIndex]} ${yearThai}`;
  } catch {
    return '-';
  }
}

export function formatThaiTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '-';
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} น.`;
  } catch {
    return '-';
  }
}

export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Compress an image file using browser Canvas to produce a lightweight JPEG data URL
 * preventing localStorage quota overflow while maintaining visual clarity.
 */
export async function compressImage(file: File, maxWidth = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Format a text summary designed for copy-pasting directly into LINE group chats
 */
export function generateLineSummary(
  records: InspectionRecord[],
  dateFormatted: string
): string {
  const passCount = records.filter(r => r.status === 'pass').length;
  const failCount = records.filter(r => r.status === 'fail').length;
  const total = records.length;

  let text = `📋 รายงานผลการตรวจเขตทำความสะอาด\n`;
  text += `🏫 โรงเรียนระโนดวิทยา (สพม.สงขลา สตูล)\n`;
  text += `📅 ประจำ${dateFormatted}\n`;
  text += `⏰ ตรวจบันทึกแล้วทั้งหมด: ${total} เขต\n`;
  text += `-------------------------\n`;
  text += `✅ ผ่านเกณฑ์: ${passCount} เขต\n`;
  text += `❌ ไม่ผ่านเกณฑ์: ${failCount} เขต\n`;

  if (failCount > 0) {
    text += `\n⚠️ เขตที่ต้องปรับปรุงแก้ไขด่วน:\n`;
    const failedRecords = records.filter(r => r.status === 'fail');
    failedRecords.forEach((item, idx) => {
      text += `${idx + 1}. ${item.zoneName} (${item.assignedClass || 'ไม่ระบุห้อง'})\n`;
      text += `   - ปัญหา: ${item.note || 'ไม่ระบุหมายเหตุ'}\n`;
      text += `   - ผู้ตรวจ: ${item.inspectorName}\n`;
    });
    text += `\n* ขอความร่วมมือนักเรียนเวรและครูที่ปรึกษา ช่วยกำกับดูแลแก้ไขให้เรียบร้อยครับ/ค่ะ 🙏`;
  } else if (total > 0) {
    text += `\n✨ ทุกเขตพื้นที่สะอาดเรียบร้อยตามมาตรฐาน ขอขอบคุณนักเรียนเวรและครูทุกท่านครับ/ค่ะ 🌟`;
  } else {
    text += `\n(ยังไม่มีรายการตรวจบันทึกสำหรับวันนี้)`;
  }

  return text;
}

/**
 * Generate CSV file data with UTF-8 BOM for Thai character compatibility in Excel
 */
export function exportToCSV(records: InspectionRecord[], filename = 'ranot_inspections.csv') {
  const headers = ['วันที่', 'เวลา', 'เขตพื้นที่', 'ชั้นเรียนรับผิดชอบ', 'สถานะ', 'ผู้ประเมิน', 'บทบาท', 'หมายเหตุ'];
  const rows = records.map(r => [
    formatThaiDate(r.date),
    formatThaiTime(r.date),
    `"${r.zoneName.replace(/"/g, '""')}"`,
    `"${(r.assignedClass || '').replace(/"/g, '""')}"`,
    r.status === 'pass' ? 'ผ่าน' : 'ไม่ผ่าน',
    `"${r.inspectorName.replace(/"/g, '""')}"`,
    r.inspectorRole,
    `"${(r.note || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
