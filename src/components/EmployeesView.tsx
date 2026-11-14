import React, { useState } from 'react';
import { Users, Search, Calendar } from 'lucide-react';
import { Employee, UserRole } from '../types';
import { Language, translations } from '../translations';

interface EmployeesViewProps {
  employees: Employee[];
  role: UserRole;
  onOpenLogin: () => void;
  language: Language;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({ employees, role, onOpenLogin, language }) => {
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-1 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>{t.companyName}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            {t.employeeDirectoryTitle}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            {t.employeeDirectorySubtitle}
          </p>
        </div>

        {role === 'guest' && (
          <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 p-4 rounded-2xl flex items-center justify-between gap-4">
            <p className="text-xs font-semibold">
              {t.guestLoginNotice}
            </p>
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 whitespace-nowrap shadow-sm"
            >
              {t.employeeLogin}
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchEmployee}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
          />
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={emp.photoUrl}
                  alt={emp.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{emp.name}</h3>
                    {emp.rollNumber === 'FAV-001' && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                        BOSS
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-indigo-600 font-mono mt-0.5">
                    {t.rollNo}: {emp.rollNumber}
                  </p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5 flex items-center gap-1.5">
                    <span>{emp.role}</span>
                    <span className="text-[10px] bg-indigo-50 border border-indigo-200 px-2 py-0.2 rounded-full text-indigo-700 font-bold">
                      {emp.employmentType || t.employmentType}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">{t.department}:</span>
                  <span className="font-bold text-slate-800">{emp.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">{t.mobileNumber}:</span>
                  <span className="font-mono font-bold text-indigo-600">{emp.mobileNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">{t.aadhaarNumber}:</span>
                  <span className="font-mono font-bold text-slate-700">
                    {role === 'guest' ? 'XXXX-XXXX-' + emp.aadhaarNumber.slice(-4) : emp.aadhaarNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">{t.email}:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[180px]">{emp.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-500">{t.address}:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[180px]">{emp.address}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                {t.joined}: {emp.joiningDate}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                {t.active}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
