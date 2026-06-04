import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Filter, ArrowUpDown, ChevronDown, RefreshCw, 
  Download, Eye, Edit3, Trash2, X, Sparkles, User, AlertTriangle, 
  MapPin, Mail, Phone, BookOpen, Check 
} from 'lucide-react';
import { Student } from '../types';

interface StudentDatabaseProps {
  students: Student[];
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onDeleteStudent: (id: string) => void;
  onRefreshData: () => void;
}

export default function StudentDatabase({ 
  students, 
  onAddStudent, 
  onUpdateStudent, 
  onDeleteStudent,
  onRefreshData
}: StudentDatabaseProps) {
  // Query Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals Overlay Toggle States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Active student pointer for modals
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  // Success Toasts manager
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'alert' }[]>([]);

  // Form schemas
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formDept, setFormDept] = useState('Computer & IoT');
  const [formCourse, setFormCourse] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  const addToast = (msg: string, type: 'success' | 'alert' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleOpenAdd = () => {
    // Populate form with empty
    const nextIdNum = students.length > 0 
      ? Math.max(...students.map(s => parseInt(s.id, 10)).filter(n => !isNaN(n))) + 1 
      : 101;
    setFormId(nextIdNum.toString());
    setFormName('');
    setFormEmail('');
    setFormMobile('');
    setFormDept('Computer & IoT');
    setFormCourse('B.E. Computer Engineering');
    setFormAddress('');
    setFormCity('Pune');
    setFormStatus('Active');
    
    setIsAddOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId.trim() || !formName.trim() || !formEmail.trim() || !formMobile.trim()) {
      addToast("Please fill in all required fields.", "alert");
      return;
    }

    // Check duplicate ID
    if (students.some(s => s.id === formId.trim())) {
      addToast(`Student ID '${formId}' already exists. Use a unique Roll Number.`, "alert");
      return;
    }

    const newStudent: Student = {
      id: formId.trim(),
      name: formName.trim(),
      email: formEmail.trim(),
      mobile: formMobile.trim(),
      department: formDept,
      course: formCourse.trim() || 'RDBMS Fundamentals',
      address: formAddress.trim() || 'Camp Area',
      city: formCity.trim() || 'Pune',
      status: formStatus
    };

    onAddStudent(newStudent);
    setIsAddOpen(false);
    addToast("Record Added Successfully.", "success");
  };

  const handleOpenEdit = (student: Student) => {
    setActiveStudent(student);
    setFormId(student.id);
    setFormName(student.name);
    setFormEmail(student.email);
    setFormMobile(student.mobile);
    setFormDept(student.department);
    setFormCourse(student.course);
    setFormAddress(student.address);
    setFormCity(student.city);
    setFormStatus(student.status);

    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMobile.trim()) {
      addToast("Please fill in all core fields.", "alert");
      return;
    }

    const updatedStudent: Student = {
      id: formId,
      name: formName.trim(),
      email: formEmail.trim(),
      mobile: formMobile.trim(),
      department: formDept,
      course: formCourse.trim() || 'RDBMS Fundamentals',
      address: formAddress.trim() || 'Pune Center',
      city: formCity.trim() || 'Pune',
      status: formStatus
    };

    onUpdateStudent(updatedStudent);
    setIsEditOpen(false);
    addToast("Record Updated Successfully.", "success");
  };

  const handleOpenDelete = (student: Student) => {
    setActiveStudent(student);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (activeStudent) {
      onDeleteStudent(activeStudent.id);
      setIsDeleteOpen(false);
      addToast("Record Deleted Successfully.", "success");
      setActiveStudent(null);
    }
  };

  const handleOpenView = (student: Student) => {
    setActiveStudent(student);
    setIsViewOpen(true);
  };

  // CSV Generator Downloader
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      addToast("No student records available to export.", "alert");
      return;
    }

    // Header header row
    const headers = ['Student ID', 'Full Name', 'Email Address', 'Mobile Number', 'Department', 'Course Topic', 'Resident City', 'Academic Status'];
    const rows = filteredStudents.map(student => [
      student.id,
      `"${student.name.replace(/"/g, '""')}"`,
      student.email,
      student.mobile,
      `"${student.department.replace(/"/g, '""')}"`,
      `"${student.course.replace(/"/g, '""')}"`,
      student.city,
      student.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `datanest_student_records_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast("CSM Export Completed successfully.", "success");
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDeptFilter('');
    setStatusFilter('');
    onRefreshData();
    addToast("Student collection synced.", "success");
  };

  // Filter computation pipeline
  const filteredStudents = students.filter(student => {
    const sId = student.id.toLowerCase();
    const sName = student.name.toLowerCase();
    const sDept = student.department.toLowerCase();
    const sStatus = student.status.toLowerCase();

    const matchesSearch = sId.includes(searchTerm.toLowerCase()) || sName.includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter ? sDept === deptFilter.toLowerCase() : true;
    const matchesStatus = statusFilter ? sStatus === statusFilter.toLowerCase() : true;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <section id="student-database" className="py-24 relative bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-950">
      <div className="container mx-auto px-6">
        
        {/* Module Header titles */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-mono tracking-wider uppercase text-blue-600 dark:text-blue-400 font-bold">
            Administrative Modules
          </h2>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white mt-1">
            Student Register Database
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-base font-sans">
            A stateful CRUD utility storing relational students in reactive memory tables. Modify, add, search, and export schemas instantly.
          </p>
        </div>

        {/* Global Controls & Filter Ribbon */}
        <div className="glass-panel p-5 rounded-2xl border border-gray-150 dark:border-slate-800 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              id="student-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student full name or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans focus:outline-none focus:border-blue-500 dark:focus:border-blue-500"
            />
          </div>

          {/* Core selection filters */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Filter by Department dropdown */}
            <div className="relative inline-block">
              <select
                id="dept-filter-select"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2.5 bg-gray-50/50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-mono font-bold text-gray-750 dark:text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Departments</option>
                <option value="Computer & IoT">Computer & IoT</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Electronics Engineering">Electronics Engineering</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-405 pointer-events-none" />
            </div>

            {/* Filter by Status dropdown */}
            <div className="relative inline-block">
              <select
                id="status-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2.5 bg-gray-50/50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-mono font-bold text-gray-750 dark:text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive Only</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-405 pointer-events-none" />
            </div>

            {/* Quick Refresh Sync Button */}
            <button
              id="student-refresh-btn"
              onClick={handleResetFilters}
              className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-slate-950/40 dark:hover:bg-slate-900 text-gray-500 dark:text-slate-400 rounded-xl border border-gray-200 dark:border-slate-850 cursor-pointer"
              title="Reset Filters & Sync Records"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Export CSV action */}
            <button
              id="student-export-csv-btn"
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-sans text-xs font-bold rounded-xl border border-emerald-100 dark:border-emerald-900/40 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/50 transition flex items-center space-x-1.5 cursor-pointer"
              title="Export database table to CSV file download"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline-block">Export CSV</span>
            </button>

            {/* Main CTA: Add Record */}
            <button
              id="student-add-record-btn"
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-sans text-xs font-bold rounded-xl hover:opacity-90 active:scale-97 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>

          </div>
        </div>

        {/* Database Rows Table View */}
        <div className="glass-panel rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm overflow-hidden bg-white/75 dark:bg-slate-900/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/50 dark:bg-slate-950/40 text-gray-700 dark:text-gray-300 font-mono text-xs border-b border-gray-150 dark:border-slate-850">
                  <th className="p-4 font-bold text-center w-16">ID</th>
                  <th className="p-4 font-bold">Student Full Name</th>
                  <th className="p-4 font-bold">Email</th>
                  <th className="p-4 font-bold">Mobile</th>
                  <th className="p-4 font-bold">Department</th>
                  <th className="p-4 font-bold">City</th>
                  <th className="p-4 font-bold text-center">Status</th>
                  <th className="p-4 font-bold text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-850 text-xs">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-blue-50/10 dark:hover:bg-slate-900/20 duration-150 font-sans"
                    >
                      {/* ID tag */}
                      <td className="p-4 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                        {student.id}
                      </td>

                      {/* Name user block */}
                      <td className="p-4 font-bold text-gray-900 dark:text-white">
                        <div className="flex items-center space-x-2">
                          <div className="w-6.5 h-6.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono font-bold text-[10px] uppercase select-none">
                            {student.name.charAt(0)}
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </td>

                      {/* Contact fields */}
                      <td className="p-4 text-gray-500 dark:text-gray-400">{student.email}</td>
                      <td className="p-4 font-mono text-[11px] text-gray-500 dark:text-gray-400">{student.mobile}</td>

                      {/* Dept context */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 text-[10px] font-mono text-gray-700 dark:text-slate-300 rounded-lg shrink-0">
                          {student.department}
                        </span>
                      </td>

                      {/* City */}
                      <td className="p-4 text-gray-500 dark:text-gray-400">{student.city}</td>

                      {/* Status state */}
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-extrabold ${
                          student.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/40 dark:border-emerald-900/20'
                            : 'bg-red-50 text-red-650 dark:bg-red-950/40 dark:text-red-400 border border-red-105/45 dark:border-red-900/20'
                        }`}>
                          {student.status}
                        </span>
                      </td>

                      {/* Modifying Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          
                          {/* VIEW profil */}
                          <button
                            id={`student-action-view-${student.id}`}
                            onClick={() => handleOpenView(student)}
                            className="p-2 text-gray-405 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                            title="View student profile details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* EDIT record */}
                          <button
                            id={`student-action-edit-${student.id}`}
                            onClick={() => handleOpenEdit(student)}
                            className="p-2 text-gray-405 dark:text-gray-500 hover:text-indigo-650 dark:hover:text-indigo-450 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                            title="Edit student records information"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* DELETE record */}
                          <button
                            id={`student-action-delete-${student.id}`}
                            onClick={() => handleOpenDelete(student)}
                            className="p-2 text-gray-405 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                            title="Delete student schema entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertTriangle className="w-8 h-8 text-yellow-500" />
                        <p className="font-mono text-xs text-yellow-600 dark:text-yellow-400 font-bold">No Records Matched</p>
                        <p className="font-sans text-xs text-gray-400 max-w-sm mt-0.5">Try altering the search query, selecting another class filter, or click Sync database.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Records Table details footer tag */}
          <div className="bg-gray-50/50 dark:bg-slate-950/20 px-6 py-3 border-t border-gray-150 dark:border-slate-850 flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>Query output state: {filteredStudents.length} entries shown.</span>
            <span className="hidden sm:inline-block">Physical Table Storage Engine: RDBMS memory storage keys.</span>
          </div>
        </div>

        {/* ==================== 1. POPUP FORM: ADD RECORD ==================== */}
        <AnimatePresence>
          {isAddOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddOpen(false)} className="absolute inset-0 bg-slate-950/50 backdrop-blur-md" />
              
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col z-10 max-h-[90vh]">
                
                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/40 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <User className="w-5 h-5 text-blue-500" />
                    <h3 className="font-display font-extrabold text-blue-900 dark:text-white uppercase tracking-wider text-sm">Add Student Record</h3>
                  </div>
                  <button id="add-modal-close" onClick={() => setIsAddOpen(false)} className="p-1 text-gray-450 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"><X className="w-5 h-5" /></button>
                </div>

                {/* Form fields */}
                <form id="add-student-form" onSubmit={handleSaveAdd} className="p-6 space-y-4 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Student Roll ID (PK) *</label>
                      <input
                        id="add-roll-input"
                        type="text"
                        value={formId}
                        onChange={(e) => setFormId(e.target.value)}
                        placeholder="e.g. 101"
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-mono font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Full Name *</label>
                      <input
                        id="add-name-input"
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Shloke Kharat"
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Email Address *</label>
                      <input
                        id="add-email-input"
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="shloke@example.com"
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Mobile Number *</label>
                      <input
                        id="add-mobile-input"
                        type="text"
                        value={formMobile}
                        onChange={(e) => setFormMobile(e.target.value)}
                        placeholder="+91 7620780541"
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-mono font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Department</label>
                      <select
                        id="add-dept-select"
                        value={formDept}
                        onChange={(e) => setFormDept(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-semibold text-gray-750 dark:text-slate-300"
                      >
                        <option value="Computer & IoT">Computer & IoT</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Electronics Engineering">Electronics Engineering</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Course Theme</label>
                      <input
                        id="add-course-input"
                        type="text"
                        value={formCourse}
                        onChange={(e) => setFormCourse(e.target.value)}
                        placeholder="B.E. Computer Engineering"
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Primary Address</label>
                    <input
                      id="add-address-input"
                      type="text"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="Camp Road, South District"
                      className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Residence City</label>
                      <input
                        id="add-city-input"
                        type="text"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        placeholder="Pune"
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Status</label>
                      <select
                        id="add-status-select"
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-semibold text-gray-750 dark:text-slate-300"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end space-x-2.5 text-xs font-sans">
                    <button id="add-form-reset" type="button" onClick={() => { setFormName(''); setFormEmail(''); setFormMobile(''); setFormAddress(''); }} className="px-4 py-2.5 bg-gray-105 hover:bg-gray-200 dark:bg-slate-800 rounded-xl font-bold cursor-pointer transition">Reset</button>
                    <button id="add-form-cancel" type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2.5 bg-gray-105 hover:bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold cursor-pointer transition">Cancel</button>
                    <button id="add-form-save" type="submit" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl cursor-pointer hover:shadow-lg transition">Save Student</button>
                  </div>

                </form>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ==================== 2. POPUP FORM: UPDATE/EDIT RECORD ==================== */}
        <AnimatePresence>
          {isEditOpen && activeStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditOpen(false)} className="absolute inset-0 bg-slate-950/50 backdrop-blur-md" />
              
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col z-10 max-h-[90vh]">
                
                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/40 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Edit3 className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-display font-extrabold text-blue-900 dark:text-white uppercase tracking-wider text-sm">Update Student Record</h3>
                  </div>
                  <button id="edit-modal-close" onClick={() => setIsEditOpen(false)} className="p-1 text-gray-450 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"><X className="w-5 h-5" /></button>
                </div>

                {/* Form fields */}
                <form id="edit-student-form" onSubmit={handleSaveEdit} className="p-6 space-y-4 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Student Roll ID (PK)</label>
                      <input
                        id="edit-roll-disabled"
                        type="text"
                        value={formId}
                        disabled
                        className="w-full p-2.5 bg-gray-100 dark:bg-slate-955 opacity-60 rounded-xl text-xs font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Full Name *</label>
                      <input
                        id="edit-name-input"
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Shloke Kharat"
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Email Address *</label>
                      <input
                        id="edit-email-input"
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="shloke@example.com"
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Mobile Number *</label>
                      <input
                        id="edit-mobile-input"
                        type="text"
                        value={formMobile}
                        onChange={(e) => setFormMobile(e.target.value)}
                        placeholder="+91 7620780541"
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-mono font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Department</label>
                      <select
                        id="add-dept-select"
                        value={formDept}
                        onChange={(e) => setFormDept(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-semibold text-gray-750 dark:text-slate-300"
                      >
                        <option value="Computer & IoT">Computer & IoT</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Electronics Engineering">Electronics Engineering</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Course Theme</label>
                      <input
                        id="edit-course-input"
                        type="text"
                        value={formCourse}
                        onChange={(e) => setFormCourse(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Primary Address</label>
                    <input
                      id="edit-address-input"
                      type="text"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Residence City</label>
                      <input
                        id="edit-city-input"
                        type="text"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-gray-400 mb-1">Status</label>
                      <select
                        id="add-status-select"
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                        className="w-full p-2.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-sans font-semibold text-gray-750 dark:text-slate-300"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-end space-x-2.5 text-xs font-sans">
                    <button id="edit-form-cancel" type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2.5 bg-gray-105 hover:bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold cursor-pointer transition">Cancel</button>
                    <button id="edit-form-save" type="submit" className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl cursor-pointer hover:shadow-lg transition">Save Updates</button>
                  </div>

                </form>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ==================== 3. CONFIRMATION POPUP: DELETE RECORD ==================== */}
        <AnimatePresence>
          {isDeleteOpen && activeStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteOpen(false)} className="absolute inset-0 bg-slate-950/50 backdrop-blur-md" />
              
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-xl border border-gray-100 dark:border-slate-800 p-6 text-center z-10">
                <div className="p-3 bg-red-50 dark:bg-red-950 text-red-500 rounded-2xl w-fit mx-auto mb-4 border border-red-100 dark:border-red-900/60 shadow-lg">
                  <AlertTriangle className="w-8 h-8" />
                </div>

                <h3 className="text-base font-display font-black text-gray-950 dark:text-white mb-2">Are you sure you want to delete this record?</h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed mb-6">
                  This action is irreversible. The student schema row belonging to <strong className="text-slate-900 dark:text-white font-semibold">{activeStudent.name} (RollNo: {activeStudent.id})</strong> will be removed permanently from the database logs.
                </p>

                <div className="flex items-center justify-center space-x-2 text-xs font-sans font-bold">
                  <button id="delete-confirm-cancel" onClick={() => setIsDeleteOpen(false)} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 text-gray-650 dark:text-slate-400 rounded-xl cursor-pointer">Cancel</button>
                  <button id="delete-confirm-yes" onClick={handleConfirmDelete} className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 cursor-pointer shadow-md">Yes, Delete Record</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ==================== 4. PROFILE POPUP: VIEW RECORD ==================== */}
        <AnimatePresence>
          {isViewOpen && activeStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsViewOpen(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
              
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col z-10">
                
                {/* Visual Cover Accent */}
                <div className="h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 relative">
                  <span className="absolute top-3.5 right-3.5 text-[9px] font-mono font-black text-white bg-slate-950/45 px-2.5 py-0.5 rounded-full border border-white/20 select-none">ID: {activeStudent.id}</span>
                </div>

                {/* Avatar Overlay */}
                <div className="relative px-6">
                  <div className="absolute -top-10 left-6 w-18 h-18 rounded-2xl bg-white dark:bg-slate-900 p-1.5 shadow-xl border border-gray-100 dark:border-slate-800 flex items-center justify-center">
                    <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-650 text-white flex items-center justify-center font-mono font-black text-2xl select-none">
                      {activeStudent.name.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Body metadata list */}
                <div className="pt-12 p-6 space-y-4">
                  {/* Name header */}
                  <div>
                    <h3 className="text-lg font-display font-black text-gray-900 dark:text-white leading-tight">{activeStudent.name}</h3>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="text-[10px] font-mono text-indigo-500 font-bold uppercase">{activeStudent.department}</span>
                      <circle className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        activeStudent.status === 'Active' ? 'text-emerald-500 bg-emerald-50/10' : 'text-red-500 bg-red-50/10'
                      }`}>{activeStudent.status}</span>
                    </div>
                  </div>

                  {/* Interactive Details items grids */}
                  <div className="space-y-3.5 pt-4 border-t border-gray-100 dark:border-slate-800 text-xs">
                    
                    {/* Mail */}
                    <div className="flex items-center space-x-3 text-gray-650 dark:text-slate-300">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{activeStudent.email}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-3 text-gray-650 dark:text-slate-300">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-mono">{activeStudent.mobile}</span>
                    </div>

                    {/* Course */}
                    <div className="flex items-center space-x-3 text-gray-650 dark:text-slate-300">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span>{activeStudent.course}</span>
                    </div>

                    {/* Address place */}
                    <div className="flex items-center space-x-3 text-gray-650 dark:text-slate-300">
                      <MapPin className="w-4 h-4 text-gray-400" strokeWidth={1.8} />
                      <span>{activeStudent.address}, {activeStudent.city}</span>
                    </div>

                  </div>

                </div>

                {/* Profile actions footer closer */}
                <div className="p-4 bg-gray-50/50 dark:bg-slate-950/40 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                  <button
                    id="profile-modal-close"
                    onClick={() => setIsViewOpen(false)}
                    className="px-5 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs hover:bg-gray-200 cursor-pointer transition"
                  >
                    Close Profile
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ==================== SCREEN FLOATING TOASTS ALERTS CONTAINER ==================== */}
        <div id="floating-toasts-shelf" className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm pointer-events-none">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.9 }}
                className={`p-3.5 rounded-2xl shadow-xl flex items-center space-x-3 text-xs font-sans font-bold border pointer-events-auto ${
                  t.type === 'alert'
                    ? 'bg-red-500 text-white border-red-650'
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-800 dark:border-slate-200'
                }`}
              >
                {t.type === 'alert' ? (
                  <AlertTriangle className="w-4 h-4 text-white shrink-0" />
                ) : (
                  <Check className="w-4 h-4 text-emerald-400 bg-emerald-950/60 rounded-full p-0.5 shrink-0" />
                )}
                <span>{t.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
