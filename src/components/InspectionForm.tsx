import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  XCircle,
  Camera,
  Trash2,
  Save,
  AlertCircle,
  Building,
  User,
} from 'lucide-react';
import { Zone, InspectionRecord, InspectorRole } from '../types';
import { compressImage } from '../utils/helpers';

interface InspectionFormProps {
  zones: Zone[];
  currentRole: InspectorRole;
  inspectorName: string;
  onSaveRecord: (record: Omit<InspectionRecord, 'id' | 'date'>) => void;
  onViewDaily: () => void;
  preselectedZoneId?: string;
}

export const InspectionForm: React.FC<InspectionFormProps> = ({
  zones,
  currentRole,
  inspectorName,
  onSaveRecord,
  onViewDaily,
  preselectedZoneId,
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(
    preselectedZoneId || (zones.length > 0 ? zones[0].id : '')
  );
  const [status, setStatus] = useState<'pass' | 'fail'>('pass');
  const [customInspectorName, setCustomInspectorName] = useState<string>(inspectorName);
  const [note, setNote] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  // Quick preset tags for fail notes
  const quickTags = [
    'มีเศษขยะและแก้วน้ำใต้โต๊ะ',
    'ถังขยะเต็ม ยังไม่ได้นำไปเท',
    'ใบไม้แห้งร่วงหล่นยังไม่กวาด',
    'มีน้ำขัง/พื้นเปียกสกปรก',
    'โต๊ะเก้าอี้จัดวางไม่เป็นระเบียบ',
  ];

  const handleStatusChange = (newStatus: 'pass' | 'fail') => {
    setStatus(newStatus);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setImageFileName(file.name);
      const compressedDataUrl = await compressImage(file);
      setImagePreview(compressedDataUrl);
    } catch (err) {
      console.error('Image compression failed', err);
      alert('ไม่สามารถประมวลผลไฟล์ภาพได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTag = (tag: string) => {
    if (!note) {
      setNote(tag);
    } else if (!note.includes(tag)) {
      setNote(`${note}, ${tag}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedZoneId) {
      alert('กรุณาเลือกเขตพื้นที่ความรับผิดชอบ');
      return;
    }

    if (status === 'fail' && !note.trim()) {
      alert('กรณีผลการตรวจไม่ผ่าน กรุณากรอกหมายเหตุหรือปัญหาที่พบ');
      return;
    }

    const currentZone = zones.find((z) => z.id === selectedZoneId);
    if (!currentZone) return;

    onSaveRecord({
      zoneId: currentZone.id,
      zoneName: currentZone.name,
      assignedClass: currentZone.assignedClass,
      inspectorRole: currentRole,
      inspectorName: customInspectorName.trim() || inspectorName || 'ผู้ตรวจเวร',
      status,
      note: note.trim(),
      image: imagePreview || undefined,
    });

    setSubmitSuccess(true);
    // Reset form for next entry
    setNote('');
    handleRemoveImage();
    setStatus('pass');

    // Advance to next zone if available
    const currentIndex = zones.findIndex((z) => z.id === selectedZoneId);
    if (currentIndex >= 0 && currentIndex < zones.length - 1) {
      setSelectedZoneId(zones[currentIndex + 1].id);
    }

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 4500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Notification Banner */}
      {submitSuccess && (
        <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 shadow-sm flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-sm">บันทึกผลการตรวจเรียบร้อยแล้ว!</p>
              <p className="text-xs text-emerald-700">ข้อมูลถูกอัปเดตลงในรายงานประจำวันทันที</p>
            </div>
          </div>
          <button
            onClick={onViewDaily}
            className="text-xs font-semibold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
          >
            ดูสรุปรายวัน
          </button>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">แบบบันทึกผลการตรวจเขต</h2>
              <p className="text-xs text-blue-100 mt-0.5">
                ประเมินความสะอาดและความเป็นระเบียบเรียบร้อย โรงเรียนระโนดวิทยา
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-xs">
              <Building className="w-4 h-4 text-blue-200" />
              <span>{zones.length} เขตพื้นที่</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Zone Selector */}
          <div>
            <label className="block text-slate-800 font-bold text-sm mb-2">
              เขตพื้นที่ความรับผิดชอบ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="zone"
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                required
                className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              >
                <option value="">-- กรุณาเลือกเขตทำความสะอาด --</option>
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} ({zone.assignedClass})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Zone Quick Info */}
            {selectedZone && (
              <div className="mt-2.5 p-3 bg-blue-50/70 rounded-xl border border-blue-200/70 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-blue-900 bg-blue-200/60 px-2 py-0.5 rounded">
                    ชั้น {selectedZone.assignedClass}
                  </span>
                  <span className="text-slate-600">ครูที่ปรึกษา: {selectedZone.advisorTeacher}</span>
                </div>
                <span className="text-slate-500">{selectedZone.locationArea}</span>
              </div>
            )}
          </div>

          {/* Overall Evaluation Status (Pass / Fail only) */}
          <div>
            <label className="block text-slate-800 font-bold text-sm mb-2.5">
              ผลการประเมิน <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleStatusChange('pass')}
                className={`p-4 rounded-xl border-2 font-bold text-base flex flex-col sm:flex-row items-center justify-center gap-2.5 transition cursor-pointer ${
                  status === 'pass'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2
                  className={`w-6 h-6 ${status === 'pass' ? 'text-emerald-600' : 'text-slate-400'}`}
                />
                <span>ผ่านเกณฑ์</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('fail')}
                className={`p-4 rounded-xl border-2 font-bold text-base flex flex-col sm:flex-row items-center justify-center gap-2.5 transition cursor-pointer ${
                  status === 'fail'
                    ? 'bg-red-50 border-red-500 text-red-700 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <XCircle
                  className={`w-6 h-6 ${status === 'fail' ? 'text-red-600' : 'text-slate-400'}`}
                />
                <span>ไม่ผ่านเกณฑ์</span>
              </button>
            </div>
          </div>

          {/* Note & Evidence Section (Highlighted when fail, optional when pass) */}
          <div
            className={`p-4 rounded-xl transition ${
              status === 'fail'
                ? 'bg-red-50/70 border border-red-300'
                : 'bg-slate-50 border border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <label
                className={`font-bold text-sm flex items-center gap-1.5 ${
                  status === 'fail' ? 'text-red-700' : 'text-slate-700'
                }`}
              >
                {status === 'fail' ? (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <Camera className="w-4 h-4 text-slate-500" />
                )}
                <span>
                  {status === 'fail' ? 'แนบหลักฐานและระบุจุดที่ต้องแก้ไข' : 'แนบภาพถ่าย / หมายเหตุเพิ่มเติม (ไม่บังคับ)'}
                </span>
                {status === 'fail' && <span className="text-red-600">*</span>}
              </label>
            </div>

            {/* Quick preset tags for fast entry */}
            {status === 'fail' && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                <span className="text-xs text-slate-500 self-center mr-1">เลือกด่วน:</span>
                {quickTags.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="text-xs bg-white hover:bg-red-100 text-red-800 border border-red-200 px-2 py-1 rounded-md transition"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Note Textarea */}
            <div className="mb-4">
              <textarea
                rows={status === 'fail' ? 3 : 2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required={status === 'fail'}
                placeholder={
                  status === 'fail'
                    ? 'ระบุปัญหา เช่น มีเศษขยะตกค้างใต้บันได, ถังขยะเต็ม, ไม่ได้ปิดก๊อกน้ำ...'
                    : 'หมายเหตุเพิ่มเติม (ถ้ามี เช่น ทำความสะอาดเรียบร้อยดีมาก)...'
                }
                className={`w-full p-3 rounded-lg border text-sm focus:outline-none focus:ring-2 transition bg-white ${
                  status === 'fail'
                    ? 'border-red-300 focus:ring-red-400 placeholder:text-red-300 text-slate-800'
                    : 'border-slate-300 focus:ring-blue-400 placeholder:text-slate-400 text-slate-800'
                }`}
              />
            </div>

            {/* Photo upload input */}
            <div>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="hidden"
                  id="camera-input"
                />
                <label
                  htmlFor="camera-input"
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition shadow-xs ${
                    status === 'fail'
                      ? 'bg-red-600 hover:bg-red-700 text-white border-transparent'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>{imagePreview ? 'เปลี่ยนรูปภาพ' : 'ถ่ายภาพ / แนบรูปหลักฐาน'}</span>
                </label>

                {isCompressing && (
                  <span className="text-xs text-blue-600 animate-pulse">กำลังปรับขนาดรูปภาพ...</span>
                )}
                {imageFileName && !isCompressing && (
                  <span className="text-xs text-slate-500 truncate max-w-xs">{imageFileName}</span>
                )}
              </div>

              {/* Photo Preview Thumbnail */}
              {imagePreview && (
                <div className="mt-3 relative inline-block group">
                  <img
                    src={imagePreview}
                    alt="หลักฐาน"
                    className="w-36 h-28 object-cover rounded-lg border-2 border-slate-300 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md transition"
                    title="ลบรูปภาพ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Inspector Info Customizer */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-slate-700 text-xs font-medium mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>ผู้ประเมิน / ตรวจสอบ</span>
            </label>
            <input
              type="text"
              value={customInspectorName}
              onChange={(e) => setCustomInspectorName(e.target.value)}
              placeholder="ชื่อ-สกุล ผู้ตรวจ (เช่น ครูสมศรี ศรีสุข หรือ นร.เวรประจำวัน)"
              className="w-full p-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition text-slate-800"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>บันทึกผลการตรวจเขต</span>
          </button>
        </form>
      </div>
    </div>
  );
};
