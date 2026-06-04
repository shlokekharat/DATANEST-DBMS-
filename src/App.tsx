import { useState, useEffect } from 'react';
import { Student, ActivityLog } from './types';

// Importing sub-modules
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

  // Dual-sync state binding: Listen to Firestore if authenticated, otherwise use local storage
  useEffect(() => {
    if (!user) {
      // Revert to local storage state
      const savedStudents = localStorage.getItem('datanest_students');
      setStudents(savedStudents ? JSON.parse(savedStudents) : INITIAL_STUDENTS);

      const savedLogs = localStorage.getItem('datanest_logs');
      setLogs(savedLogs ? JSON.parse(savedLogs) : INITIAL_LOGS);
      return;
    }

    // Attach premium live listener to Firestore students collection
    const studentsCollection = collection(db, 'students');
    const qStudents = query(studentsCollection, where('ownerId', '==', user.uid));
    
    let isInitialLoad = true;

    const unsubscribeStudents = onSnapshot(qStudents, async (snapshot) => {
      // Auto-seeding default records on user's first login
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

    // Attach premium live listener to Firestore logs collection
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
      // Client-side reverse chronological sorting
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

  // Handle local state persistent sync if user is offline/unauthenticated
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

  // Handle active navigation scrolling indicator updates
  useEffect(() => {
    const sections = [
      'home', 'about-dbms', 'learning-hub', 'sql-playground', 
      'er-diagram', 'quiz', 'dashboard', 'student-database', 
      'analytics', 'activity-log', 'contact'
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // offset top navigation height

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

    setCurrentSection(targetId);
    const element = document.getElementById(targetId);
    if (element) {
      // Offset top navbar dynamically
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const createFormattedTime = () => {
    return new Date().toLocaleTimeString();
  };

  // State update actions (Cloud-first when authenticated)
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

        // Add transaction log
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
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'logs');
      }
    } else {
      setLogs([]);
    }
  };

  const handleRefreshData = () => {
    // Forces metadata checks
  };

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen flex flex-col font-sans transition-colors duration-200">
      
      {/* Sticky Primary Navbar */}
      <Navbar currentSection={currentSection} onNavigate={handleNavigate} />

      {/* Main Single Page Scroll Streams */}
      <main className="flex-1">
        <Home onNavigate={handleNavigate} />
        <AboutDBMS />
        <LearningHub />
        <SqlPlayground />
        <ErDiagram />
        <DbmsQuiz />

        {authLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-gray-500 animate-pulse">Synchronizing academic keys...</p>
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
              onRefreshData={handleRefreshData}
            />
            <Analytics students={students} />
            <ActivityLogsView 
              logs={logs}
              onTriggerBackup={handleTriggerBackup}
              onClearLogs={handleClearLogs}
            />
          </>
        ) : (
          <section id="dashboard" className="py-24 bg-gray-55/30 dark:bg-slate-900/10 border-y border-gray-150 dark:border-slate-850/40 transition-colors duration-200">
            <div className="container mx-auto px-6 flex flex-col items-center">
              <AuthGate />
            </div>
          </section>
        )}

        <ContactSection />
      </main>

      {/* Primary Climax Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}

