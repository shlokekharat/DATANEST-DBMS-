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

  // Hovered state for tooltip quick viewer
  const [hoveredStudentId, setHoveredStudentId] = useState<string | null>(null);

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

  React.useEffect(() => {
    const handleOpenAddTrigger = () => {
      handleOpenAdd();
    };

    const handleAiFilterTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<{ search?: string; dept?: string; status?: string }>;
      if (customEvent.detail) {
        if (customEvent.detail.search !== undefined) setSearchTerm(customEvent.detail.search);
        if (customEvent.detail.dept !== undefined) setDeptFilter(customEvent.detail.dept);
        if (customEvent.detail.status !== undefined) setStatusFilter(customEvent.detail.status);
        
        addToast("Database fields filtered via DATANEST AI.", "success");
      }
    };

    window.addEventListener('datanest-open-add', handleOpenAddTrigger);
    window.addEventListener('datanest-ai-filter' as any, handleAiFilterTrigger);
    
    return () => {
      window.removeEventListener('datanest-open-add', handleOpenAddTrigger);
      window.removeEventListener('datanest-ai-filter' as any, handleAiFilterTrigger);
    };
  }, [students]);

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
    <section id="student-database" className="py-24 relative bg-[#0B1020]">
      <div className="container mx-auto px-6">
        
        {/* Module Header titles */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-mono tracking-wider uppercase text-[#00D9FF] font-bold">
            Administrative Modules
          </h2>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-[#F8FAFC] mt-1">
            Student Register Database
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-[#4F8CFF] to-[#6C63FF] mx-auto mt-4 rounded-full shadow-lg shadow-[#4F8CFF]/20" />
          <p className="text-[#94A3B8] mt-4 text-base font-sans">
            A stateful CRUD utility storing relational students in reactive memory tables. Modify, add, search, and export schemas instantly.
          </p>
        </div>

        {/* Global Controls & Filter Ribbon */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#00D9FF]" />
            <input
              id="student-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student full name or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#0B1020] border border-white/10 rounded-xl text-xs font-sans text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#00D9FF] transition duration-200"
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
                className="appearance-none pl-3.5 pr-8 py-2.5 bg-[#0B1020] border border-white/10 rounded-xl text-xs font-mono font-bold text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF] cursor-pointer"
              >
                <option value="" className="bg-[#0B1020] text-[#F8FAFC]">All Departments</option>
                <option value="Computer & IoT" className="bg-[#0B1020] text-[#F8FAFC]">Computer & IoT</option>
                <option value="Information Technology" className="bg-[#0B1020] text-[#F8FAFC]">Information Technology</option>
                <option value="Mechanical Engineering" className="bg-[#0B1020] text-[#F8FAFC]">Mechanical Engineering</option>
                <option value="Electronics Engineering" className="bg-[#0B1020] text-[#F8FAFC]">Electronics Engineering</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#00D9FF] pointer-events-none" />
            </div>

            {/* Filter by Status dropdown */}
            <div className="relative inline-block">
              <select
                id="status-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3.5 pr-8 py-2.5 bg-[#0B1020] border border-white/10 rounded-xl text-xs font-mono font-bold text-[#F8FAFC] focus:outline-none focus:border-[#00D9FF] cursor-pointer"
              >
                <option value="" className="bg-[#0B1020] text-[#F8FAFC]">All Statuses</option>
                <option value="Active" className="bg-[#0B1020] text-[#F8FAFC]">Active Only</option>
                <option value="Inactive" className="bg-[#0B1020] text-[#F8FAFC]">Inactive Only</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#00D9FF] pointer-events-none" />
            </div>

            {/* Quick Refresh Sync Button */}
            <button
              id="student-refresh-btn"
              onClick={handleResetFilters}
              className="p-2.5 bg-[#0B1020] hover:bg-white/5 text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl border border-white/10 cursor-pointer transition duration-150"
              title="Reset Filters & Sync Records"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Export CSV action */}
            <button
              id="student-export-csv-btn"
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-[#151C33] text-[#00D9FF] font-sans text-xs font-bold rounded-xl border border-white/10 hover:bg-[#151C33]/70 transition flex items-center space-x-1.5 cursor-pointer"
              title="Export database table to CSV file download"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline-block">Export CSV</span>
            </button>

            {/* Main CTA: Add Record */}
            <button
              id="student-add-record-btn"
              onClick={handleOpenAdd}
              className="btn-primary px-4 py-2.5 text-white font-sans text-xs font-bold rounded-xl hover:opacity-90 active:scale-97 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>

          </div>
        </div>

        {/* Database Rows Table View */}
        <div className="glass-panel rounded-2xl border border-white/10 shadow-sm overflow-hidden bg-[#151C33]/65 text-[#F8FAFC]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0B1020]/60 text-[#94A3B8] font-mono text-xs border-b border-white/10">
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
              <tbody className="divide-y divide-white/5 text-xs">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr 
                      key={student.id} 
                      className="hover:bg-[#151C33] duration-150 font-sans text-[#CBD5E1]"
                    >
                      {/* ID tag */}
                      <td className="p-4 text-center font-mono font-bold text-[#00D9FF]">
                        {student.id}
                      </td>

                      {/* Name user block with Quick View Tooltip */}
                      <td className="p-4 font-bold text-[#F8FAFC] relative">
                        <div 
                          className="flex items-center space-x-2 cursor-pointer group/name select-none"
                          onMouseEnter={() => setHoveredStudentId(student.id)}
                          onMouseLeave={() => setHoveredStudentId(null)}
                        >
                          <div className="w-6.5 h-6.5 rounded-full bg-[#0B1020] border border-white/10 text-[#00D9FF] flex items-center justify-center font-mono font-bold text-[10px] uppercase select-none transition-transform duration-200 group-hover/name:scale-110">
                            {student.name.charAt(0)}
                          </div>
                          <span className="hover:text-[#00D9FF] transition-colors duration-150 border-b border-dashed border-white/10 pb-0.5">
                            {student.name}
                          </span>
                        </div>

                        {/* Interactive Tooltip Card */}
                        <AnimatePresence>
                          {hoveredStudentId === student.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.96, y: 12 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.96, y: 8 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-8 top-full mt-2.5 z-40 w-76 bg-[#151C33]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-4 text-left font-sans select-none pointer-events-none text-white overflow-hidden"
                            >
                              {/* Design Accent Bar */}
                              <div className={`absolute top-0 left-0 right-0 h-1 ${
                                student.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                              }`} />

                              {/* Student Identity and Header */}
                              <div className="flex items-start justify-between mb-3 pt-1">
                                <div>
                                  <h4 className="text-[13px] font-display font-black text-[#F8FAFC] leading-tight tracking-tight">
                                    {student.name}
                                  </h4>
                                  <p className="text-[9px] font-mono text-[#00D9FF] mt-0.5 font-bold">
                                    Roll ID: {student.id}
                                  </p>
                                </div>
                                <span className={`text-[8px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded ${
                                  student.status === 'Active' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {student.status}
                                </span>
                              </div>

                              {/* Student Metadata Lines */}
                              <div className="space-y-2 text-[10px] text-[#CBD5E1] border-t border-white/10 pt-2.5">
                                <div className="flex items-center space-x-2">
                                  <Sparkles className="w-3.5 h-3.5 text-[#00D9FF] shrink-0" />
                                  <span className="font-mono text-[#4F8CFF] font-semibold truncate">
                                    {student.department}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Mail className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                                  <span className="truncate text-[#CBD5E1] font-sans">
                                    {student.email}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Phone className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                                  <span className="font-mono text-[#CBD5E1]">
                                    {student.mobile}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <BookOpen className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                                  <span className="truncate text-[#CBD5E1] font-sans">
                                    {student.course}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                                  <span className="text-[#CBD5E1] font-sans">
                                    {student.city}
                                  </span>
                                </div>
                              </div>

                              {/* Tooltip hint footer */}
                              <div className="mt-3.5 pt-2 border-t border-white/10 flex items-center space-x-1 text-[8px] font-mono text-[#94A3B8]">
                                <span className="inline-block w-1 h-1 bg-[#4F8CFF] rounded-full animate-ping" />
                                <span>Hover to view summary | Eye icon for full details</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>

                      {/* Contact fields */}
                      <td className="p-4 text-[#CBD5E1]">{student.email}</td>
                      <td className="p-4 font-mono text-[11px] text-[#CBD5E1]">{student.mobile}</td>

                      {/* Dept context */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-[#0B1020] text-[10px] font-mono text-[#00D9FF] rounded-lg shrink-0 border border-white/10">
                          {student.department}
                        </span>
                      </td>

                      {/* City */}
                      <td className="p-4 text-[#CBD5E1]">{student.city}</td>

                      {/* Status state */}
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono font-extrabold ${
                          student.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
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
                            className="p-2 text-[#94A3B8] hover:text-[#00D9FF] hover:bg-white/5 rounded-xl cursor-pointer duration-150"
                            title="View student profile details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* EDIT record */}
                          <button
                            id={`student-action-edit-${student.id}`}
                            onClick={() => handleOpenEdit(student)}
                            className="p-2 text-[#94A3B8] hover:text-[#4F8CFF] hover:bg-white/5 rounded-xl cursor-pointer duration-150"
                            title="Edit student records information"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* DELETE record */}
                          <button
                            id={`student-action-delete-${student.id}`}
                            onClick={() => handleOpenDelete(student)}
                            className="p-2 text-[#94A3B8] hover:text-rose-400 hover:bg-white/5 rounded-xl cursor-pointer duration-150"
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
                    <td colSpan={8} className="p-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-4 max-w-sm mx-auto">
                        <span className="text-5xl select-none animate-pulse" role="img" aria-label="Folder">📂</span>
                        <div>
                          <h3 className="text-sm font-mono font-bold text-[#00D9FF] uppercase tracking-wider">No Records Found</h3>
                          <p className="font-sans text-xs text-[#94A3B8] mt-1">Start by adding your first student to the database schema registry.</p>
                        </div>
                        <button
                          id="empty-state-add-record-btn"
                          onClick={handleOpenAdd}
                          className="btn-primary px-5 py-2.5 rounded-xl font-sans text-xs font-bold text-white shadow-lg flex items-center space-x-1.5 cursor-pointer hover:opacity-90 active:scale-95 transition"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Record</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Records Table details footer tag */}
          <div className="bg-[#0B1020]/40 px-6 py-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
            <span>Query output state: {filteredStudents.length} entries shown.</span>
            <span className="hidden sm:inline-block">Physical Table Storage Engine: RDBMS memory storage keys.</span>
          </div>
        </div>

        {/* ==================== 1. POPUP FORM: ADD RECORD ==================== */}
        <AnimatePresence>
          {isAddOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddOpen(false)} className="absolute inset-0 bg-[#0B1020]/80 backdrop-blur-md" />
              
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#151C33]/95 rounded-3xl w-full max-w-lg shadow-2xl border border-white/15 overflow-hidden flex flex-col z-10 max-h-[90vh] backdrop-blur-xl">
                
                {/* Header */}
                <div className="p-5 border-b border-white/10 bg-[#0B1020]/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <User className="w-5 h-5 text-[#00D9FF]" />
                    <h3 className="font-display font-extrabold text-[#F8FAFC] uppercase tracking-wider text-sm">Add Student Record</h3>
                  </div>
                  <button id="add-modal-close" onClick={() => setIsAddOpen(false)} className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 rounded-xl cursor-pointer transition"><X className="w-5 h-5" /></button>
                </div>

                {/* Form fields */}
                <form id="add-student-form" onSubmit={handleSaveAdd} className="p-6 space-y-4 overflow-y-auto text-[#CBD5E1]">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Student Roll ID (PK) *</label>
                      <input
                        id="add-roll-input"
                        type="text"
                        value={formId}
                        onChange={(e) => setFormId(e.target.value)}
                        placeholder="e.g. 101"
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] placeholder-slate-500 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:border-[#00D9FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Full Name *</label>
                      <input
                        id="add-name-input"
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Shloke Kharat"
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] placeholder-slate-500 rounded-xl text-xs font-sans font-bold focus:outline-none focus:border-[#00D9FF]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Email Address *</label>
                      <input
                        id="add-email-input"
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="shloke@example.com"
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] placeholder-slate-500 rounded-xl text-xs font-sans font-medium focus:outline-none focus:border-[#00D9FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Mobile Number *</label>
                      <input
                        id="add-mobile-input"
                        type="text"
                        value={formMobile}
                        onChange={(e) => setFormMobile(e.target.value)}
                        placeholder="+91 7620780541"
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] placeholder-slate-500 rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-[#00D9FF]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Department</label>
                      <select
                        id="add-dept-select"
                        value={formDept}
                        onChange={(e) => setFormDept(e.target.value)}
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] rounded-xl text-xs font-sans font-semibold focus:outline-none focus:border-[#00D9FF] cursor-pointer"
                      >
                        <option value="Computer & IoT" className="bg-[#0B1020] text-[#F8FAFC]">Computer & IoT</option>
                        <option value="Information Technology" className="bg-[#0B1020] text-[#F8FAFC]">Information Technology</option>
                        <option value="Mechanical Engineering" className="bg-[#0B1020] text-[#F8FAFC]">Mechanical Engineering</option>
                        <option value="Electronics Engineering" className="bg-[#0B1020] text-[#F8FAFC]">Electronics Engineering</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Course Theme</label>
                      <input
                        id="add-course-input"
                        type="text"
                        value={formCourse}
                        onChange={(e) => setFormCourse(e.target.value)}
                        placeholder="B.E. Computer Engineering"
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] placeholder-slate-500 rounded-xl text-xs font-sans font-medium focus:outline-none focus:border-[#00D9FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Primary Address</label>
                    <input
                      id="add-address-input"
                      type="text"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="Camp Road, South District"
                      className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] placeholder-slate-500 rounded-xl text-xs font-sans font-medium focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Residence City</label>
                      <input
                        id="add-city-input"
                        type="text"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        placeholder="Pune"
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] placeholder-slate-500 rounded-xl text-xs font-sans font-medium focus:outline-none focus:border-[#00D9FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Status</label>
                      <select
                        id="add-status-select"
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] rounded-xl text-xs font-sans font-semibold focus:outline-none focus:border-[#00D9FF] cursor-pointer"
                      >
                        <option value="Active" className="bg-[#0B1020] text-[#F8FAFC]">Active</option>
                        <option value="Inactive" className="bg-[#0B1020] text-[#F8FAFC]">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 border-t border-white/10 flex justify-end space-x-2.5 text-xs font-sans">
                    <button id="add-form-reset" type="button" onClick={() => { setFormName(''); setFormEmail(''); setFormMobile(''); setFormAddress(''); }} className="px-4 py-2.5 bg-[#0B1020] border border-white/10 text-[#CBD5E1] hover:bg-white/5 rounded-xl font-bold cursor-pointer transition">Reset</button>
                    <button id="add-form-cancel" type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2.5 bg-[#0B1020] border border-white/10 text-[#CBD5E1] hover:bg-white/5 rounded-xl font-bold cursor-pointer transition">Cancel</button>
                    <button id="add-form-save" type="submit" className="btn-primary px-5 py-2.5 text-white font-bold rounded-xl cursor-pointer hover:shadow-lg transition">Save Student</button>
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditOpen(false)} className="absolute inset-0 bg-[#0B1020]/80 backdrop-blur-md" />
              
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#151C33]/95 rounded-3xl w-full max-w-lg shadow-2xl border border-white/15 overflow-hidden flex flex-col z-10 max-h-[90vh] backdrop-blur-xl text-[#CBD5E1]">
                
                {/* Header */}
                <div className="p-5 border-b border-white/10 bg-[#0B1020]/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <Edit3 className="w-5 h-5 text-[#4F8CFF]" />
                    <h3 className="font-display font-extrabold text-[#F8FAFC] uppercase tracking-wider text-sm">Update Student Record</h3>
                  </div>
                  <button id="edit-modal-close" onClick={() => setIsEditOpen(false)} className="p-2 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 rounded-xl cursor-pointer transition"><X className="w-5 h-5" /></button>
                </div>

                {/* Form fields */}
                <form id="edit-student-form" onSubmit={handleSaveEdit} className="p-6 space-y-4 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Student Roll ID (PK)</label>
                      <input
                        id="edit-roll-disabled"
                        type="text"
                        value={formId}
                        disabled
                        className="w-full p-2.5 bg-[#0B1020]/50 border border-white/5 opacity-60 rounded-xl text-xs font-mono font-semibold text-[#94A3B8]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Full Name *</label>
                      <input
                        id="edit-name-input"
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Shloke Kharat"
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] placeholder-slate-500 rounded-xl text-xs font-sans font-bold focus:outline-none focus:border-[#00D9FF]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Email Address *</label>
                      <input
                        id="edit-email-input"
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="shloke@example.com"
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] placeholder-slate-500 rounded-xl text-xs font-sans font-medium focus:outline-none focus:border-[#00D9FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Mobile Number *</label>
                      <input
                        id="edit-mobile-input"
                        type="text"
                        value={formMobile}
                        onChange={(e) => setFormMobile(e.target.value)}
                        placeholder="+91 7620780541"
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] placeholder-slate-500 rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-[#00D9FF]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Department</label>
                      <select
                        id="add-dept-select"
                        value={formDept}
                        onChange={(e) => setFormDept(e.target.value)}
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] rounded-xl text-xs font-sans font-semibold focus:outline-none focus:border-[#00D9FF] cursor-pointer"
                      >
                        <option value="Computer & IoT" className="bg-[#0B1020] text-[#F8FAFC]">Computer & IoT</option>
                        <option value="Information Technology" className="bg-[#0B1020] text-[#F8FAFC]">Information Technology</option>
                        <option value="Mechanical Engineering" className="bg-[#0B1020] text-[#F8FAFC]">Mechanical Engineering</option>
                        <option value="Electronics Engineering" className="bg-[#0B1020] text-[#F8FAFC]">Electronics Engineering</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Course Theme</label>
                      <input
                        id="edit-course-input"
                        type="text"
                        value={formCourse}
                        onChange={(e) => setFormCourse(e.target.value)}
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] placeholder-slate-500 rounded-xl text-xs font-sans font-medium focus:outline-none focus:border-[#00D9FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Primary Address</label>
                    <input
                      id="edit-address-input"
                      type="text"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] placeholder-slate-500 rounded-xl text-xs font-sans font-medium focus:outline-none focus:border-[#00D9FF]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Residence City</label>
                      <input
                        id="edit-city-input"
                        type="text"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] placeholder-slate-500 rounded-xl text-xs font-sans font-medium focus:outline-none focus:border-[#00D9FF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase font-bold text-[#00D9FF] mb-1">Status</label>
                      <select
                        id="add-status-select"
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Inactive')}
                        className="w-full p-2.5 bg-[#0B1020] border border-white/10 text-[#F8FAFC] rounded-xl text-xs font-sans font-semibold focus:outline-none focus:border-[#00D9FF] cursor-pointer"
                      >
                        <option value="Active" className="bg-[#0B1020] text-[#F8FAFC]">Active</option>
                        <option value="Inactive" className="bg-[#0B1020] text-[#F8FAFC]">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 border-t border-white/10 flex justify-end space-x-2.5 text-xs font-sans">
                    <button id="edit-form-cancel" type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2.5 bg-[#0B1020] border border-white/10 text-[#CBD5E1] hover:bg-white/5 rounded-xl font-bold cursor-pointer transition">Cancel</button>
                    <button id="edit-form-save" type="submit" className="btn-primary px-5 py-2.5 text-white font-bold rounded-xl cursor-pointer hover:shadow-lg transition">Save Updates</button>
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
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteOpen(false)} className="absolute inset-0 bg-[#0B1020]/80 backdrop-blur-md" />
              
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#151C33]/95 rounded-3xl w-full max-w-sm shadow-xl border border-white/15 p-6 text-center z-10 backdrop-blur-xl">
                <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl w-fit mx-auto mb-4 border border-rose-500/25 shadow-lg">
                  <AlertTriangle className="w-8 h-8" />
                </div>

                <h3 className="text-base font-display font-black text-[#F8FAFC] mb-2">Are you sure you want to delete this record?</h3>
                <p className="text-xs text-[#94A3B8] font-sans leading-relaxed mb-6">
                  This action is irreversible. The student schema row belonging to <strong className="text-[#F8FAFC] font-semibold">{activeStudent.name} (RollNo: {activeStudent.id})</strong> will be removed permanently from the database logs.
                </p>

                <div className="flex items-center justify-center space-x-2 text-xs font-sans font-bold">
                  <button id="delete-confirm-cancel" onClick={() => setIsDeleteOpen(false)} className="px-4 py-2.5 bg-[#0B1020] hover:bg-white/5 border border-white/10 text-[#CBD5E1] rounded-xl cursor-pointer transition">Cancel</button>
                  <button id="delete-confirm-yes" onClick={handleConfirmDelete} className="px-5 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 cursor-pointer shadow-md transition">Yes, Delete Record</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ==================== 4. PROFILE POPUP: VIEW RECORD ==================== */}
        <AnimatePresence>
          {isViewOpen && activeStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsViewOpen(false)} className="absolute inset-0 bg-[#0B1020]/80 backdrop-blur-md" />
              
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-[#151C33]/95 rounded-3xl w-full max-w-sm shadow-2xl border border-white/15 overflow-hidden flex flex-col z-10 backdrop-blur-xl">
                
                {/* Visual Cover Accent */}
                <div className="h-20 bg-gradient-to-r from-[#00D9FF]/20 via-[#4F8CFF]/20 to-[#6C63FF]/20 relative">
                  <span className="absolute top-3.5 right-3.5 text-[9px] font-mono font-black text-[#00D9FF] bg-[#0B1020] px-2.5 py-0.5 rounded-full border border-white/10 select-none">ID: {activeStudent.id}</span>
                </div>

                {/* Avatar Overlay */}
                <div className="relative px-6">
                  <div className="absolute -top-10 left-6 w-18 h-18 rounded-2xl bg-[#151C33] p-1.5 shadow-xl border border-white/15 flex items-center justify-center">
                    <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#00D9FF] via-[#4F8CFF] to-[#6C63FF] text-white flex items-center justify-center font-mono font-black text-2xl select-none">
                      {activeStudent.name.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Body metadata list */}
                <div className="pt-12 p-6 space-y-4 text-[#CBD5E1]">
                  {/* Name header */}
                  <div>
                    <h3 className="text-lg font-display font-black text-[#F8FAFC] leading-tight">{activeStudent.name}</h3>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="text-[10px] font-mono text-[#00D9FF] font-bold uppercase">{activeStudent.department}</span>
                      <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        activeStudent.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                      }`}>{activeStudent.status}</span>
                    </div>
                  </div>

                  {/* Interactive Details items grids */}
                  <div className="space-y-3.5 pt-4 border-t border-white/10 text-xs">
                    
                    {/* Mail */}
                    <div className="flex items-center space-x-3 text-[#CBD5E1]">
                      <Mail className="w-4 h-4 text-[#00D9FF]" />
                      <span className="truncate">{activeStudent.email}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-3 text-[#CBD5E1]">
                      <Phone className="w-4 h-4 text-[#00D9FF]" />
                      <span className="font-mono">{activeStudent.mobile}</span>
                    </div>

                    {/* Course */}
                    <div className="flex items-center space-x-3 text-[#CBD5E1]">
                      <BookOpen className="w-4 h-4 text-[#00D9FF]" />
                      <span>{activeStudent.course}</span>
                    </div>

                    {/* Address place */}
                    <div className="flex items-center space-x-3 text-[#CBD5E1]">
                      <MapPin className="w-4 h-4 text-[#00D9FF]" strokeWidth={1.8} />
                      <span>{activeStudent.address}, {activeStudent.city}</span>
                    </div>

                  </div>

                </div>

                {/* Profile actions footer closer */}
                <div className="p-4 bg-[#0B1020]/60 border-t border-white/10 flex justify-end">
                  <button
                    id="profile-modal-close"
                    onClick={() => setIsViewOpen(false)}
                    className="px-5 py-2 bg-[#0B1020] border border-white/10 text-[#CBD5E1] hover:bg-white/5 rounded-xl font-bold text-xs cursor-pointer transition"
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
                className={`p-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-sans font-bold border backdrop-blur-xl pointer-events-auto ${
                  t.type === 'alert'
                    ? 'bg-rose-500/10 text-rose-450 border-rose-500/20'
                    : 'bg-[#151C33]/95 text-[#F8FAFC] border-white/10'
                }`}
              >
                {t.type === 'alert' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <Check className="w-4 h-4 text-emerald-450 bg-emerald-500/10 rounded-full p-0.5 shrink-0 border border-emerald-500/20" />
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
