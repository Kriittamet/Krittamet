import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  Download,
  RefreshCw,
  LogOut,
  X,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { InspectionRecord, Zone } from '../types';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminPassword: string;
  onUpdatePassword: (newPass: string) => void;
  onLogoutAdmin: () => void;
  onResetData: () => void;
  onClearInspections: () => void;
  inspections: InspectionRecord[];
  zones: Zone[];
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  adminPassword,
  onUpdatePassword,
  onLogoutAdmin,
  onResetData,
  onClearInspections,
  inspections,
  zones,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (oldPassword !== adminPassword) {
      setError('รหัสผ่านเดิมไม่ถูกต้อง');
      return;
    }

    if (newPassword.length < 4) {
      setError('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    onUpdatePassword(newPassword);
    setSuccess('เปลี่ยนรหัสผ่านแอดมินสำเร็จแล้ว!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setSuccess(null);
    }, 4000);
  };

  const handleExportJSON = () => {
    const backupData = {
      system: 'Ranot Wittaya School Cleaning Inspection System',
      backupDate: new Date().toISOString(),
      zones,
      inspections,
    };
    const jsonBlob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ranot_system_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">การจัดการระบบแอดมิน</h3>
              <p className="text-xs text-slate-500">โรงเรียนระโนดวิทยา</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Change Password Form */}
        <form onSubmit={handleChangePassword} className="mt-5 space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-slate-500" />
            <span>เปลี่ยนรหัสผ่านแอดมิน</span>
          </h4>

          <div>
            <label className="block text-xs text-slate-600 mb-1">รหัสผ่านปัจจุบัน</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านเดิม"
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">รหัสผ่านใหม่</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="อย่างน้อย 4 ตัวอักษร"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="กรอกซ้ำอีกครั้ง"
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
          >
            บันทึกรหัสผ่านใหม่
          </button>
        </form>

        {/* System Utilities */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            การสำรองข้อมูลและรีเซ็ต
          </h4>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleExportJSON}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>ดาวน์โหลดไฟล์สำรองข้อมูลระบบทั้งหมด (JSON)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onResetData();
                onClose();
              }}
              className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>คืนค่าข้อมูลเริ่มต้นของโรงเรียน (Reset Demo Data)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('คุณต้องการลบประวัติการตรวจทั้งหมดใช่หรือไม่? (การกระทำนี้ไม่สามารถย้อนกลับได้)')) {
                  onClearInspections();
                  onClose();
                }
              }}
              className="w-full py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>ล้างประวัติการตรวจทั้งหมด ({inspections.length} รายการ)</span>
            </button>
          </div>
        </div>

        {/* Logout of Admin */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-500">สถานะ: ผู้ดูแลระบบสูงสุด</span>
          <button
            type="button"
            onClick={() => {
              onLogoutAdmin();
              onClose();
            }}
            className="py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบแอดมิน</span>
          </button>
        </div>
      </div>
    </div>
  );
};
