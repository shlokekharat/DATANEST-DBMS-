import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Student, ActivityLog 
} from './types';
import { 
  Sparkles, Plus, Search, Shield, HelpCircle, X, Terminal, Cpu, Database, 
  Settings, Key, List, MessageSquare, Compass, Send, Command, Loader2
} from 'lucide-react';

// Importing sub-components
import Navbar from './components/Navbar';
import Home from './components/Home';
import AboutDBMS from './components/AboutDBMS';
import LearningHub from './components/LearningHub';
import SqlPlayground from './components/SqlPlayground';
import ErDiagram from './components/ErDiagram';
import DbmsQuiz from './components/DbmsQuiz';
import DatAnestDashboard from './components/DatAnestDashboard';
import StudentDatabase from './components/StudentDatabase';
import Analytics from './components/Analytics';
import ActivityLogsView from './components/ActivityLogsView';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

// Importing Firebase & Auth Context
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc, deleteDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { useAuth } from './context/AuthContext';
import AuthGate from './components/AuthGate';

const INITIAL_STUDENTS: Student[] = [
  {
    id: "101",
    name: "Shloke Jagan Kharat",
    email: "shlokekharat08@gmail.com",
    mobile: "+91 7620780541",
    department: "Computer & IoT",
    course: "B.E. Computer & IoT Engineering",
    city: "Pune",
    address: "Camp, Near Core Tower",
    status: "Active"
  },
  {
    id: "102",
    name: "Aditya Patwardhan",
    email: "aditya.p@example.com",
    mobile: "+91 9845123045",
    department: "Computer & IoT",
    course: "RDBMS Database Design",
    city: "Mumbai",
    address: "Andheri West, Block C",
    status: "Active"
  },
  {
    id: "103",
    name: "Neha Deshmukh",
    email: "neha.d@example.com",
    mobile: "+91 8877551122",
    department: "Information Technology",
    course: "B.Tech Cloud Computing",
    city: "Pune",
    address: "Kothrud Residency",
    status: "Active"
  },
  {
    id: "104",
    name: "Sameer Kulkarni",
    email: "sameer.k@example.com",
    mobile: "+91 7711223344",
    department: "Mechanical Engineering",
    course: "Automation Systems Engineering",
    city: "Nashik",
    address: "MG Road Plaza, Suite 4",
    status: "Inactive"
  },
  {
    id: "105",
    name: "Priyanka Shinde",
    email: "priyanka.s@example.com",
    mobile: "+91 9900887766",
    department: "Electronics Engineering",
    course: "VLSI Relational IC Testing",
    city: "Pune",
    address: "Shivajinagar Heights",
    status: "Active"
  }
];

const INITIAL_LOGS: ActivityLog[] = [
  {
    id: "log_initial_1",
    type: "backup",
    message: "Initial local storage database backup verified safe.",
    timestamp: "10:15:02 AM"
  },
  {
    id: "log_initial_2",
    type: "update",
    message: "Computer & IoT Department tables loaded in 1.40ms.",
    timestamp: "10:14:45 AM"
  },
  {
    id: "log_initial_3",
    type: "add",
    message: "Primary RDBMS Student records loaded and synchronized.",
    timestamp: "10:14:00 AM"
  }
];

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'alert' | 'info';
}

export default function App() {
  const [currentSection, setCurrentSection] = useState<string>('home');
  const { user, loading: authLoading } = useAuth();

  // Load database rows
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('datanest_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  // Load write-ahead logs
  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('datanest_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // UI state overlays
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessageInput, setAiMessageInput] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSectionLoading, setIsSectionLoading] = useState(false);

  // Default AI bot message feed
  const [aiFeed, setAiFeed] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    { 
      sender: 'assistant', 
      text: "Hello! I am DATANEST AI, your smart DBMS mentor. Try asking 'Show Computer Department students', 'Search Sameer', or ask any concept like 'What does ACID stand for?'" 
    }
  ]);

  // Unified global notification system
  const showToast = (message: string, type: 'success' | 'alert' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      // Ctrl + K -> Open main command search block
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      // Ctrl + N -> Navigate & Trigger Student Registry Insertion popup
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNavigate('student-database');
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('datanest-open-add'));
        }, 150);
        showToast("⌨️ Shortcut: New Student form requested", "info");
      }
      // Ctrl + F -> Navigate & Focus local table finder input
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        handleNavigate('student-database');
        setTimeout(() => {
          const searchInput = document.getElementById('student-search-input');
          if (searchInput) {
            searchInput.focus();
            (searchInput as HTMLInputElement).select();
          }
        }, 300);
        showToast("⌨️ Shortcut: Student query index focused", "info");
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [user]);

  // Dual-sync state binding: Listen to Firestore if authenticated, otherwise use local storage
  useEffect(() => {
    if (!user) {
      const savedStudents = localStorage.getItem('datanest_students');
      setStudents(savedStudents ? JSON.parse(savedStudents) : INITIAL_STUDENTS);

      const savedLogs = localStorage.getItem('datanest_logs');
      setLogs(savedLogs ? JSON.parse(savedLogs) : INITIAL_LOGS);
      return;
    }

    const studentsCollection = collection(db, 'students');
    const qStudents = query(studentsCollection, where('ownerId', '==', user.uid));
    
    let isInitialLoad = true;

    const unsubscribeStudents = onSnapshot(qStudents, async (snapshot) => {
      if (isInitialLoad && snapshot.empty) {
        isInitialLoad = false;
        try {
          const promises = INITIAL_STUDENTS.map(async (student) => {
            const docRef = doc(db, 'students', student.id);
            await setDoc(docRef, {
              ...student,
              ownerId: user.uid,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          });
          const logPromises = INITIAL_LOGS.map(async (log) => {
            const docRef = doc(db, 'logs', log.id);
            await setDoc(docRef, {
              ...log,
              ownerId: user.uid,
              createdAt: serverTimestamp()
            });
          });
          await Promise.all([...promises, ...logPromises]);
        } catch (seedError) {
          console.error("Error seeding initial data: ", seedError);
        }
        return;
      }
      
      isInitialLoad = false;

      const docsList: Student[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        docsList.push({
          id: d.id,
          name: d.name,
          email: d.email,
          mobile: d.mobile || '',
          department: d.department || '',
          course: d.course || '',
          city: d.city || '',
          address: d.address || '',
          status: d.status || 'Active',
        });
      });
      setStudents(docsList);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'students');
    });

    const logsCollection = collection(db, 'logs');
    const qLogs = query(logsCollection, where('ownerId', '==', user.uid));
    
    const unsubscribeLogs = onSnapshot(qLogs, (snapshot) => {
      const logsList: ActivityLog[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        logsList.push({
          id: d.id,
          type: d.type as any,
          message: d.message,
          timestamp: d.timestamp || new Date().toLocaleTimeString(),
        });
      });
      logsList.sort((a, b) => b.id.localeCompare(a.id));
      setLogs(logsList);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'logs');
    });

    return () => {
      unsubscribeStudents();
      unsubscribeLogs();
    };
  }, [user]);

  // Local state persistence fallbacks
  useEffect(() => {
    if (!user) {
      localStorage.setItem('datanest_students', JSON.stringify(students));
    }
  }, [students, user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('datanest_logs', JSON.stringify(logs));
    }
  }, [logs, user]);

  // Scroll section highlight matching
  useEffect(() => {
    const sections = [
      'home', 'about-dbms', 'learning-hub', 'sql-playground', 
      'er-diagram', 'quiz', 'dashboard', 'student-database', 
      'analytics', 'activity-log', 'contact'
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      for (const sect of sections) {
        const el = document.getElementById(sect);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            const isProtected = ['dashboard', 'student-database', 'analytics', 'activity-log'].includes(sect);
            const targetSection = (!user && isProtected) ? 'dashboard' : sect;
            setCurrentSection(targetSection);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user]);

  const handleNavigate = (sectionId: string) => {
    const isProtected = ['dashboard', 'student-database', 'analytics', 'activity-log'].includes(sectionId);
    const targetId = (!user && isProtected) ? 'dashboard' : sectionId;

    // Trigger premium Loading Skeletons for simulated processing delay
    setIsSectionLoading(true);
    setTimeout(() => {
      setIsSectionLoading(false);
      setCurrentSection(targetId);
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
    }, 450);
  };

  const createFormattedTime = () => {
    return new Date().toLocaleTimeString();
  };

  // Transaction mutation actions containing notification toasts mappings
  const handleAddStudent = async (newStudent: Student) => {
    if (user) {
      try {
        const studentRef = doc(db, 'students', newStudent.id);
        await setDoc(studentRef, {
          ...newStudent,
          ownerId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        const time = createFormattedTime();
        const logId = `log_${Date.now()}`;
        const logRef = doc(db, 'logs', logId);
        await setDoc(logRef, {
          id: logId,
          type: 'add',
          message: `New Student Added: ${newStudent.name} (RollNo: ${newStudent.id}) successfully committed to cloud.`,
          timestamp: time,
          ownerId: user.uid,
          createdAt: serverTimestamp()
        });
        showToast("✅ Record Added Successfully", "success");
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `students/${newStudent.id}`);
      }
    } else {
      setStudents(prev => [newStudent, ...prev]);
      const time = createFormattedTime();
      const newLog: ActivityLog = {
        id: `log_${Date.now()}`,
        type: 'add',
        message: `New Student Added: ${newStudent.name} (RollNo: ${newStudent.id}) successfully committed.`,
        timestamp: time
      };
      setLogs(prev => [newLog, ...prev]);
      showToast("✅ Record Added Successfully", "success");
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    if (user) {
      try {
        const studentRef = doc(db, 'students', updatedStudent.id);
        await updateDoc(studentRef, {
          ...updatedStudent,
          ownerId: user.uid,
          updatedAt: serverTimestamp()
        });

        const time = createFormattedTime();
        const logId = `log_${Date.now()}`;
        const logRef = doc(db, 'logs', logId);
        await setDoc(logRef, {
          id: logId,
          type: 'update',
          message: `Record Updated Successfully: ${updatedStudent.name} (RollNo: ${updatedStudent.id}) fields mutated.`,
          timestamp: time,
          ownerId: user.uid,
          createdAt: serverTimestamp()
        });
        showToast("✏️ Student Updated", "success");
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `students/${updatedStudent.id}`);
      }
    } else {
      setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
      const time = createFormattedTime();
      const newLog: ActivityLog = {
        id: `log_${Date.now()}`,
        type: 'update',
        message: `Record Updated Successfully: ${updatedStudent.name} (RollNo: ${updatedStudent.id}) fields mutated.`,
        timestamp: time
      };
      setLogs(prev => [newLog, ...prev]);
      showToast("✏️ Student Updated", "success");
    }
  };

  const handleDeleteStudent = async (id: string) => {
    const targetStudent = students.find(s => s.id === id);
    const name = targetStudent ? targetStudent.name : 'Unknown';

    if (user) {
      try {
        await deleteDoc(doc(db, 'students', id));

        const time = createFormattedTime();
        const logId = `log_${Date.now()}`;
        const logRef = doc(db, 'logs', logId);
        await setDoc(logRef, {
          id: logId,
          type: 'delete',
          message: `Record Deleted Successfully: ${name} (RollNo: ${id}) removed from cloud.`,
          timestamp: time,
          ownerId: user.uid,
          createdAt: serverTimestamp()
        });
        showToast("🗑 Record Deleted", "alert");
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `students/${id}`);
      }
    } else {
      setStudents(prev => prev.filter(s => s.id !== id));
      const time = createFormattedTime();
      const newLog: ActivityLog = {
        id: `log_${Date.now()}`,
        type: 'delete',
        message: `Record Deleted Successfully: ${name} (RollNo: ${id}) removed from active memory.`,
        timestamp: time
      };
      setLogs(prev => [newLog, ...prev]);
      showToast("🗑 Record Deleted", "alert");
    }
  };

  const handleTriggerBackup = async () => {
    const time = createFormattedTime();
    if (user) {
      try {
        const logId = `log_${Date.now()}`;
        const logRef = doc(db, 'logs', logId);
        await setDoc(logRef, {
          id: logId,
          type: 'backup',
          message: `Database Backup Completed: snapshot created online with timestamp '${time}'.`,
          timestamp: time,
          ownerId: user.uid,
          createdAt: serverTimestamp()
        });
        showToast("💾 Database Backup Completed", "success");
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `logs/backup_${Date.now()}`);
      }
    } else {
      const newLog: ActivityLog = {
        id: `log_${Date.now()}`,
        type: 'backup',
        message: `Database Backup Completed: snapshot created with timestamp '${time}'.`,
        timestamp: time
      };
      setLogs(prev => [newLog, ...prev]);
      showToast("💾 Database Backup Completed", "success");
    }
  };

  const handleClearLogs = async () => {
    if (user) {
      try {
        const logsCollection = collection(db, 'logs');
        const qLogs = query(logsCollection, where('ownerId', '==', user.uid));
        const qSnapshot = await getDocs(qLogs);
        const deletePromises = qSnapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
        await Promise.all(deletePromises);
        showToast("🗑 Activity logs database wiped", "alert");
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'logs');
      }
    } else {
      setLogs([]);
      showToast("🗑 Activity logs database wiped", "alert");
    }
  };

  // AI Mentoring Agent engine response simulator
  const handleSendAiMessage = (e: FormEvent) => {
    e.preventDefault();
    const queryStr = aiMessageInput.trim();
    if (!queryStr) return;

    setAiFeed(prev => [...prev, { sender: 'user', text: queryStr }]);
    setAiMessageInput('');

    // Simulated parsing logic
    setTimeout(() => {
      const lower = queryStr.toLowerCase();
      let responseText = "Understood. I have evaluated your custom DBMS prompt, but that didn't match a direct relational table mutation index shortcut. Try asking 'Show Computer Department students' to filter the active grid nodes!";

      if (lower.includes('computer') || lower.includes('iot')) {
        window.dispatchEvent(new CustomEvent('datanest-ai-filter', {
          detail: { search: '', dept: 'Computer & IoT' }
        }));
        handleNavigate('student-database');
        responseText = "Found 127 academic records matches. I have automatically filtered the Students table for the 'Computer & IoT' department. Feel free to inspect! 📂";
      } else if (lower.includes('inactive')) {
        window.dispatchEvent(new CustomEvent('datanest-ai-filter', {
          detail: { search: '', status: 'Inactive' }
        }));
        handleNavigate('student-database');
        responseText = "Grid filtered. Displaying only students flagged as 'Inactive' across the term blocks.";
      } else if (lower.includes('list all') || lower.includes('reset') || lower.includes('clear filter')) {
        window.dispatchEvent(new CustomEvent('datanest-ai-filter', {
          detail: { search: '', dept: 'ALL', status: 'ALL' }
        }));
        handleNavigate('student-database');
        responseText = "Filter schema fully refreshed! Synchronizing and listing all student registry rows.";
      } else if (lower.includes('sameer')) {
        window.dispatchEvent(new CustomEvent('datanest-ai-filter', {
          detail: { search: 'Sameer' }
        }));
        handleNavigate('student-database');
        responseText = "Match found! Filtering queries for 'Sameer'. Relational node highlighted below.";
      } else if (lower.includes('acid')) {
        responseText = "📚 DBMS Intel: ACID stands for Atomicity, Consistency, Isolation, and Durability. These properties represent standard transaction safety properties designed to safeguard structural database consistency.";
      } else if (lower.includes('primary') && lower.includes('key')) {
        responseText = "🔑 Primary Key Rule: A Primary Key is a constraint forcing an attribute to unique, non-null values. This guarantees every row inside a relation is uniquely solvable!";
      }

      setAiFeed(prev => [...prev, { sender: 'assistant', text: responseText }]);
    }, 600);
  };

  // Command palette execution
  const executeCommand = (command: string) => {
    setIsCommandPaletteOpen(false);
    setPaletteQuery('');

    if (command === 'add') {
      handleNavigate('student-database');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('datanest-open-add'));
      }, 200);
    } else if (command === 'search') {
      handleNavigate('student-database');
      setTimeout(() => {
        const input = document.getElementById('student-search-input');
        input?.focus();
      }, 350);
    } else if (command === 'analytics') {
      handleNavigate('analytics');
    } else if (command === 'logs') {
      handleNavigate('activity-log');
    } else if (command === 'playground') {
      handleNavigate('sql-playground');
    } else if (command === 'learning') {
      handleNavigate('learning-hub');
    } else if (command === 'er') {
      handleNavigate('er-diagram');
    }
  };

  // Filter commands for palette
  const allCommands = [
    { title: 'Add Student (Form Insert)', desc: 'Ctrl + N shortcut', cmd: 'add', icon: <Plus className="w-4 h-4 text-[#00D9FF]" /> },
    { title: 'Search Record Row (Filter Index)', desc: 'Ctrl + F shortcut', cmd: 'search', icon: <Search className="w-4 h-4 text-[#4F8CFF]" /> },
    { title: 'Open Live Analytics charts', desc: 'Direct dashboard route', cmd: 'analytics', icon: <Compass className="w-4 h-4 text-[#6C63FF]" /> },
    { title: 'View Transaction Activity Logs', desc: 'Rollback history audits', cmd: 'logs', icon: <List className="w-4 h-4 text-emerald-400" /> },
    { title: 'Launch SQL Sandbox Playground', desc: 'Compile queries local', cmd: 'playground', icon: <Terminal className="w-4 h-4 text-[#00D9FF]" /> },
    { title: 'Visit DBMS Learning Hub', desc: 'Master RDBMS fundamental structures', cmd: 'learning', icon: <Compass className="w-4 h-4 text-[#4F8CFF]" /> },
    { title: 'Render Interactive ER Diagrams', desc: 'Visual relational topology mapping', cmd: 'er', icon: <Cpu className="w-4 h-4 text-[#6C63FF]" /> },
  ];

  const filteredCommands = allCommands.filter(c => 
    c.title.toLowerCase().includes(paletteQuery.toLowerCase()) || 
    c.desc.toLowerCase().includes(paletteQuery.toLowerCase())
  );

  return (
    <div className="bg-[#0B1020] text-[#F8FAFC] min-h-screen flex flex-col font-sans transition-colors duration-200">
      
      {/* Sticky Primary Navbar */}
      <Navbar currentSection={currentSection} onNavigate={handleNavigate} />

      {/* Main Single Page Scroll Streams */}
      <main className="flex-1 relative">

        {/* Global Loading Skeletons Overlay */}
        <AnimatePresence>
          {isSectionLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#0B1020]/95 backdrop-blur-md flex flex-col justify-center items-center px-6"
            >
              <div className="w-full max-w-4xl space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-5 h-5 text-[#00D9FF] animate-spin" />
                    <span className="text-sm font-mono tracking-wider text-[#94A3B8] uppercase">Fetching relational nodes...</span>
                  </div>
                  <div className="w-16 h-3 bg-white/5 rounded animate-pulse" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="h-28 bg-[#151C33]/70 rounded-2xl border border-white/10 animate-pulse flex flex-col justify-between p-4">
                    <div className="w-8 h-8 bg-white/5 rounded-xl" />
                    <div className="w-1/2 h-4 bg-white/5 rounded-lg" />
                  </div>
                  <div className="h-28 bg-[#151C33]/70 rounded-2xl border border-white/10 animate-pulse flex flex-col justify-between p-4">
                    <div className="w-8 h-8 bg-white/5 rounded-xl" />
                    <div className="w-2/3 h-4 bg-white/5 rounded-lg" />
                  </div>
                  <div className="h-28 bg-[#151C33]/70 rounded-2xl border border-white/10 animate-pulse flex flex-col justify-between p-4">
                    <div className="w-8 h-8 bg-white/5 rounded-xl" />
                    <div className="w-1/3 h-4 bg-white/5 rounded-lg" />
                  </div>
                </div>

                <div className="h-44 bg-[#151C33]/60 rounded-3xl border border-white/10 animate-pulse p-6 space-y-3">
                  <div className="w-1/4 h-5 bg-white/5 rounded-md" />
                  <div className="w-full h-3 bg-white/5 rounded-md" />
                  <div className="w-5/6 h-3 bg-white/5 rounded-md" />
                  <div className="w-2/3 h-3 bg-white/5 rounded-md" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Home Block */}
        <Home onNavigate={handleNavigate} />
        
        {/* Conceptual/About Block */}
        <AboutDBMS />
        
        {/* Education Sandbox Module */}
        <LearningHub />
        
        {/* Interactive SQL Compiler sandbox */}
        <SqlPlayground />
        
        {/* Dynamic relational topology diagram canvas */}
        <ErDiagram />
        
        {/* Relational DBMS Quiz Block */}
        <DbmsQuiz />

        {authLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#00D9FF] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-slate-500 animate-pulse">Synchronizing cloud database keys...</p>
          </div>
        ) : user ? (
          <>
            <DatAnestDashboard 
              students={students} 
              logs={logs} 
              onNavigate={handleNavigate} 
              onTriggerBackup={handleTriggerBackup} 
            />
            <StudentDatabase 
              students={students}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onRefreshData={() => {}}
            />
            <Analytics students={students} />
            <ActivityLogsView 
              logs={logs}
              onTriggerBackup={handleTriggerBackup}
              onClearLogs={handleClearLogs}
            />
          </>
        ) : (
          <section id="dashboard" className="py-24 bg-[#0B1020] border-t border-white/10 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/20 to-transparent" />
            <div className="container mx-auto px-6 flex flex-col items-center">
              <AuthGate />
            </div>
          </section>
        )}

        {/* Contact/Query Section */}
        <ContactSection />
      </main>

      {/* Primary Climax Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Notification Toasts Container Overlay Component */}
      <div id="datanest-toasts-container" className="fixed top-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.18 } }}
              className={`p-4 rounded-2xl border shadow-2xl flex items-center space-x-3 pointer-events-auto bg-[#151C33]/90 backdrop-blur-xl ${
                t.type === 'alert' 
                  ? 'border-rose-500/20 text-rose-200' 
                  : t.type === 'info'
                    ? 'border-[#00D9FF]/20 text-[#00D9FF]'
                    : 'border-emerald-500/20 text-emerald-200'
              }`}
            >
              <div className="text-xs font-mono font-bold flex-1 select-none leading-relaxed">
                {t.message}
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
                className="hover:text-white text-slate-500 transition cursor-pointer text-[10px] font-bold p-1 shrink-0"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Ctrl + K Command Palette Modal */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
            {/* Modal backdrop click closer */}
            <div className="absolute inset-0" onClick={() => setIsCommandPaletteOpen(false)} />

            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              className="relative w-full max-w-xl bg-[#151C33]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg flex flex-col font-sans"
            >
              
              {/* Search Box Header */}
              <div className="flex items-center space-x-3 p-4 border-b border-white/10 bg-[#0B1020]/60">
                <Command className="w-5 h-5 text-[#00D9FF]" />
                <input 
                  type="text"
                  placeholder="Search anything..."
                  value={paletteQuery}
                  onChange={(e) => setPaletteQuery(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-sm text-white placeholder-slate-400 font-mono"
                  autoFocus
                />
                <button 
                  onClick={() => setIsCommandPaletteOpen(false)} 
                  className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Match Entries */}
              <div className="max-h-80 overflow-y-auto p-2">
                <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                  Command shortcuts
                </div>

                {filteredCommands.length > 0 ? (
                  <div className="space-y-0.5">
                    {filteredCommands.map((c) => (
                      <button
                        key={c.cmd}
                        onClick={() => executeCommand(c.cmd)}
                        className="w-full text-left p-3.5 hover:bg-white/5 rounded-xl duration-150 flex items-center justify-between group cursor-pointer border border-transparent hover:border-white/5"
                      >
                        <div className="flex items-center space-x-3.5">
                          <div className="p-2 bg-[#0B1020]/75 rounded-lg border border-white/5">
                            {c.icon}
                          </div>
                          <div>
                            <p className="text-xs font-mono font-bold text-white group-hover:text-[#00D9FF]">{c.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{c.desc}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 group-hover:text-white bg-[#0B1020] px-2 py-0.5 rounded border border-white/5 uppercase">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 font-mono">
                    ⚠️ No specific RDBMS actions matched your search phrase
                  </div>
                )}
              </div>

              {/* Footer instruction guidelines */}
              <div className="p-3 border-t border-white/10 bg-[#0b1020]/70 text-right text-[10px] font-mono text-slate-500 flex justify-between">
                <span>Ctrl + K trigger</span>
                <span>Press Esc to escape modal</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Smart DATANEST AI Assistant */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        <AnimatePresence>
          {isAiOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.94 }}
              className="w-80 md:w-96 h-[400px] bg-[#151C33]/95 border border-white/15 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md flex flex-col mb-4 bg-gradient-to-b from-[#151C33]/95 to-[#0B1020]/95 shadow-black/40"
            >
              {/* Chatbot Header */}
              <div className="p-4 bg-[#0B1020] border-b border-white/10 flex justify-between items-center shadow">
                <div className="flex items-center space-x-2 text-left">
                  <div className="relative">
                    <div className="p-2 bg-gradient-to-r from-[#00D9FF] to-[#4F8CFF] rounded-xl text-white">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#22C55E] rounded-full ring-2 ring-[#0B1020] animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">DATANEST AI</h3>
                    <p className="text-[10px] text-slate-400 font-sans">Active Relational Mentor</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsAiOpen(false)}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Message Feed Display */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin flex flex-col text-left">
                {aiFeed.map((f, index) => (
                  <div 
                    key={index}
                    className={`flex ${f.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`p-3 max-w-[85%] rounded-2xl text-xs leading-relaxed ${
                      f.sender === 'user' 
                        ? 'bg-gradient-to-r from-[#4F8CFF] to-[#6C63FF] text-white rounded-tr-none shadow' 
                        : 'bg-[#0B1020] border border-white/5 text-slate-200 rounded-tl-none shadow-sm font-sans'
                    }`}>
                      {f.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input form panel */}
              <form onSubmit={handleSendAiMessage} className="p-3 bg-[#0B1020] border-t border-white/10 flex space-x-2 items-center">
                <input 
                  type="text"
                  placeholder="Ask any DBMS query..."
                  value={aiMessageInput}
                  onChange={(e) => setAiMessageInput(e.target.value)}
                  className="w-full bg-[#151C33] border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]"
                />
                <button 
                  type="submit"
                  className="p-2.5 bg-[#4F8CFF] hover:bg-[#4F8CFF]/80 text-white rounded-xl cursor-pointer active:scale-95 transition shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle trigger avatar */}
        <button
          id="datanest-floating-ai-btn"
          onClick={() => setIsAiOpen(prev => !prev)}
          className="p-4 bg-gradient-to-r from-[#00D9FF] via-[#4F8CFF] to-[#6C63FF] text-white hover:scale-108 duration-200 rounded-full cursor-pointer shadow-2xl flex items-center space-x-2 animate-bounce ring-4 ring-[#0B1020]"
        >
          <Sparkles className="w-5 h-5 text-white" />
          <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest hidden md:inline-block pr-1 select-none">
            🤖 DATANEST AI
          </span>
        </button>
      </div>

    </div>
  );
}
