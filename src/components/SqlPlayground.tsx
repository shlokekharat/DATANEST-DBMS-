import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, AlertTriangle, Terminal, Code, Database, TableProperties, Sparkles } from 'lucide-react';

interface SQLRow {
  RollNo: number;
  Name: string;
  Department: string;
}

const DEFAULT_SQL_CODE = `CREATE TABLE Student(
  RollNo INT PRIMARY KEY,
  Name VARCHAR(50),
  Department VARCHAR(30)
);

INSERT INTO Student VALUES(1, 'Shloke', 'Computer & IoT');

SELECT * FROM Student;

UPDATE Student SET Department='IT' WHERE RollNo=1;

DELETE FROM Student WHERE RollNo=1;`;

const DEMO_CREATE = `CREATE TABLE Student(
  RollNo INT PRIMARY KEY,
  Name VARCHAR(50),
  Department VARCHAR(30)
);`;

const DEMO_INSERT = `INSERT INTO Student VALUES(1, 'Shloke', 'Computer & IoT');\nINSERT INTO Student VALUES(2, 'Aditya', 'Computer & IoT');\nINSERT INTO Student VALUES(3, 'Neha', 'Information Technology');`;
const DEMO_SELECT = `SELECT * FROM Student;`;
const DEMO_UPDATE = `UPDATE Student SET Department='IT' WHERE RollNo=1;`;
const DEMO_DELETE = `DELETE FROM Student WHERE RollNo=1;`;

export default function SqlPlayground() {
  const [sqlCode, setSqlCode] = useState<string>(DEFAULT_SQL_CODE);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "System loaded. Storage Engine standard database initialized.",
    "Ready for SQL statement execution. Click 'Execute Query' to see live schema results."
  ]);
  
  // Real active local state for simulated SQL database rows
  const [tableExists, setTableExists] = useState<boolean>(true);
  const [studentRows, setStudentRows] = useState<SQLRow[]>([
    { RollNo: 1, Name: 'Shloke', Department: 'Computer & IoT' },
    { RollNo: 2, Name: 'Pranav', Department: 'Information Technology' },
    { RollNo: 3, Name: 'Aarti', Department: 'Computer & IoT' }
  ]);
  const [queryMatchedTable, setQueryMatchedTable] = useState<SQLRow[] | null>([
    { RollNo: 1, Name: 'Shloke', Department: 'Computer & IoT' },
    { RollNo: 2, Name: 'Pranav', Department: 'Information Technology' },
    { RollNo: 3, Name: 'Aarti', Department: 'Computer & IoT' }
  ]);

  const handleShortcutClick = (code: string, desc: string) => {
    setSqlCode(code.trim());
    setConsoleLogs(prev => [...prev, `Loaded shortcut: ${desc}`]);
  };

  const handleReset = () => {
    setSqlCode(DEFAULT_SQL_CODE);
    setTableExists(true);
    const originalRows = [
      { RollNo: 1, Name: 'Shloke', Department: 'Computer & IoT' },
      { RollNo: 2, Name: 'Pranav', Department: 'Information Technology' },
      { RollNo: 3, Name: 'Aarti', Department: 'Computer & IoT' }
    ];
    setStudentRows(originalRows);
    setQueryMatchedTable(originalRows);
    setConsoleLogs([
      "Storage engine state refreshed to default simulation database.",
      "Table 'Student' containing 3 mock records is loaded."
    ]);
  };

  const executeSimulatedSQL = () => {
    const cleanLines = sqlCode
      .toLowerCase()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    let logs: string[] = [];
    let updatedRows = [...studentRows];
    let showTable = true;
    let tableSetupState = tableExists;

    logs.push(`Parser: Compiling SQL query statements...`);

    // Let's iterate over statement structures
    for (const statement of cleanLines) {
      if (statement.includes('create table student')) {
        tableSetupState = true;
        logs.push(`SUCCESS: Table 'Student' created successfully. (Cols: RollNo INT, Name VARCHAR, Department VARCHAR)`);
      } else if (statement.includes('insert into student')) {
        if (!tableSetupState) {
          logs.push(`ERROR: Table 'Student' does not exist! Execute CREATE TABLE first.`);
          showTable = false;
        } else {
          // Parse values
          // Values: (1, 'Shloke', 'Computer & IoT')
          try {
            if (statement.includes('1') && statement.includes('shloke')) {
              if (!updatedRows.some(r => r.RollNo === 1)) {
                updatedRows.push({ RollNo: 1, Name: 'Shloke', Department: 'Computer & IoT' });
                logs.push(`SUCCESS: INSERT INTO Student VALUES(1, 'Shloke', 'Computer & IoT') - 1 row affected.`);
              } else {
                logs.push(`WARNING: PRIMARY KEY Violation. RollNo '1' already exists.`);
              }
            } else if (statement.includes('2') && statement.includes('aditya')) {
              if (!updatedRows.some(r => r.RollNo === 2)) {
                updatedRows.push({ RollNo: 2, Name: 'Aditya', Department: 'Computer & IoT' });
                logs.push(`SUCCESS: INSERT INTO Student VALUES(2, 'Aditya', 'Computer & IoT') - 1 row affected.`);
              } else {
                logs.push(`WARNING: PRIMARY KEY Violation. RollNo '2' already exists.`);
              }
            } else if (statement.includes('3') && statement.includes('neha')) {
              if (!updatedRows.some(r => r.RollNo === 3)) {
                updatedRows.push({ RollNo: 3, Name: 'Neha', Department: 'Information Technology' });
                logs.push(`SUCCESS: INSERT INTO Student VALUES(3, 'Neha', 'Information Technology') - 1 row affected.`);
              } else {
                logs.push(`WARNING: PRIMARY KEY Violation. RollNo '3' already exists.`);
              }
            } else {
              // Standard generic insert parsed simulation
              const matchValues = statement.match(/\(([^)]+)\)/);
              if (matchValues && matchValues[1]) {
                const parts = matchValues[1].split(',').map(p => p.trim().replace(/['"]/g, ''));
                if (parts.length >= 3) {
                  const rNo = parseInt(parts[0], 10);
                  const sName = parts[1];
                  const sDept = parts[2];
                  if (!isNaN(rNo)) {
                    if (!updatedRows.some(r => r.RollNo === rNo)) {
                      updatedRows.push({ RollNo: rNo, Name: sName, Department: sDept });
                      logs.push(`SUCCESS: INSERT INTO Student VALUES(${rNo}, '${sName}', '${sDept}') - 1 row affected.`);
                    } else {
                      logs.push(`WARNING: PRIMARY KEY Violation. Row with RollNo ${rNo} already exists.`);
                    }
                  }
                }
              }
            }
          } catch(e) {
            logs.push(`COMPILE WARNING: Nested parentheses syntaxes simulated.`);
          }
        }
      } else if (statement.includes('select * from student') || statement.includes('select *')) {
        if (!tableSetupState) {
          logs.push(`ERROR: Relation 'Student' is missing.`);
          showTable = false;
        } else {
          logs.push(`SUCCESS: SELECT * FROM Student returned columns successfully.`);
        }
      } else if (statement.includes('update student')) {
        if (!tableSetupState) {
          logs.push(`ERROR: Relation 'Student' is missing. Action aborted.`);
        } else {
          // Parse set department='IT' where rollno=1
          const matchRollNo = statement.match(/rollno\s*=\s*(\d+)/);
          const targetRoll = matchRollNo ? parseInt(matchRollNo[1], 10) : 1;
          
          let changedCount = 0;
          updatedRows = updatedRows.map(row => {
            if (row.RollNo === targetRoll) {
              changedCount++;
              if (statement.includes("department='it'") || statement.includes("department='information technology'")) {
                return { ...row, Department: 'Information Technology' };
              } else if (statement.includes("department='it'") || statement.includes("department='it'")) {
                return { ...row, Department: 'IT' };
              } else {
                return { ...row, Department: 'Information Technology' };
              }
            }
            return row;
          });
          logs.push(`SUCCESS: UPDATE Student SET Department - ${changedCount} row(s) updated.`);
        }
      } else if (statement.includes('delete from student')) {
        if (!tableSetupState) {
          logs.push(`ERROR: Relation 'Student' does not exist.`);
        } else {
          const matchRollNo = statement.match(/rollno\s*=\s*(\d+)/);
          const targetRoll = matchRollNo ? parseInt(matchRollNo[1], 10) : 1;
          const preLength = updatedRows.length;
          updatedRows = updatedRows.filter(row => row.RollNo !== targetRoll);
          const diff = preLength - updatedRows.length;
          logs.push(`SUCCESS: DELETE FROM Student WHERE RollNo=${targetRoll} - ${diff} row(s) deleted.`);
        }
      } else {
        logs.push(`INFO: Executing statement: '${statement.substring(0, 30)}...'`);
      }
    }

    setTableExists(tableSetupState);
    setStudentRows(updatedRows);
    setQueryMatchedTable(showTable ? updatedRows : null);
    
    // Conclude with total stats
    logs.push(`--------------------------------------`);
    logs.push(`Query completed in 1.40ms | Status: OK`);

    setConsoleLogs(prev => [...prev, ...logs]);
  };

  return (
    <section id="sql-playground" className="py-24 bg-slate-900 border-y border-slate-950 text-white relative">
      <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-2xl pointer-events-none" />

      <div className="container mx-auto px-6">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-indigo-950/80 rounded-full border border-indigo-900 text-xs font-mono text-indigo-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Interactive Database Virtual Machine</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white mt-1">
            Academic SQL Sandbox
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full" />
          <p className="text-slate-400 mt-4 text-base font-sans">
            Write structured queries directly inside our responsive editor, compile commands sequentially, and view table states updated inside the visualizer below.
          </p>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Query Shortcuts Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-850/60 border border-slate-800 backdrop-blur-md">
              <h3 className="text-sm font-mono font-bold uppercase text-indigo-400 tracking-wider mb-4 flex items-center space-x-2">
                <Code className="w-4 h-4 text-indigo-500" />
                <span>SQL Cheat Sheet & Loaders</span>
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleShortcutClick(DEMO_CREATE, "CREATE student table")}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-750 rounded-xl text-left text-xs font-mono border border-slate-700/60 transition flex items-center justify-between group cursor-pointer"
                >
                  <span>1. CREATE TABLE Student</span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900 group-hover:bg-indigo-600 group-hover:text-white transition">Load</span>
                </button>

                <button
                  onClick={() => handleShortcutClick(DEMO_INSERT, "INSERT rows")}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-750 rounded-xl text-left text-xs font-mono border border-slate-700/60 transition flex items-center justify-between group cursor-pointer"
                >
                  <span>2. INSERT INTO Student</span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900 group-hover:bg-indigo-600 group-hover:text-white transition">Load</span>
                </button>

                <button
                  onClick={() => handleShortcutClick(DEMO_SELECT, "SELECT matching columns")}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-750 rounded-xl text-left text-xs font-mono border border-slate-700/60 transition flex items-center justify-between group cursor-pointer"
                >
                  <span>3. SELECT * FROM Student</span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900 group-hover:bg-indigo-600 group-hover:text-white transition">Load</span>
                </button>

                <button
                  onClick={() => handleShortcutClick(DEMO_UPDATE, "UPDATE matching email")}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-750 rounded-xl text-left text-xs font-mono border border-slate-700/60 transition flex items-center justify-between group cursor-pointer"
                >
                  <span>4. UPDATE Department IT</span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900 group-hover:bg-indigo-600 group-hover:text-white transition">Load</span>
                </button>

                <button
                  onClick={() => handleShortcutClick(DEMO_DELETE, "DELETE matching ID")}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-750 rounded-xl text-left text-xs font-mono border border-slate-700/60 transition flex items-center justify-between group cursor-pointer"
                >
                  <span>5. DELETE FROM Student</span>
                  <span className="text-[10px] text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900 group-hover:bg-indigo-600 group-hover:text-white transition">Load</span>
                </button>
              </div>

              <div className="mt-5 p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-[11px] text-slate-400 font-sans leading-relaxed">
                🚀 <strong className="text-white">Active Simulation:</strong> Statements are matched incrementally to update a local virtual student cache. Click <strong className="text-white">Execute</strong> or reset to starting conditions as desired.
              </div>
            </div>
          </div>

          {/* Dynamic SQL Editor & Screen Panel */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            
            {/* Live Terminal Editor Frame */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
              
              {/* Terminal Title Header */}
              <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between border-b border-slate-850">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-mono text-slate-300 font-bold">SQL Execution Console (MySQL dialect)</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <button
                    id="sql-reset-btn"
                    onClick={handleReset}
                    className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700/80 rounded-lg text-xs font-mono text-slate-300 hover:text-white transition flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Data</span>
                  </button>

                  <button
                    id="sql-execute-btn"
                    onClick={executeSimulatedSQL}
                    className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-xs font-mono text-white font-bold hover:shadow-lg hover:shadow-indigo-500/20 active:scale-97 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Execute Query</span>
                  </button>
                </div>
              </div>

              {/* Editor + Simulation Shell */}
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[220px]">
                {/* Visual Line Numbers */}
                <div className="hidden md:block md:col-span-1 bg-slate-950 p-4 text-right text-slate-600 font-mono text-xs select-none border-r border-slate-900/60 leading-relaxed space-y-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Main Editing Text Box */}
                <textarea
                  value={sqlCode}
                  onChange={(e) => setSqlCode(e.target.value)}
                  placeholder="-- Write your SQL queries here..."
                  className="col-span-11 bg-slate-950 p-4 text-cyan-400/90 font-mono text-xs focus:outline-none resize-none leading-relaxed h-[220px] w-full"
                />
              </div>

              {/* Diagnostics & Compiling Log Console */}
              <div className="bg-slate-900/80 p-4 border-t border-slate-850 max-h-[140px] overflow-y-auto no-scrollbar font-mono text-[10px] text-slate-400 space-y-1 text-left">
                <div className="text-gray-500 uppercase font-bold tracking-wider mb-1 flex items-center space-x-1">
                  <span>Compilation Logs</span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                </div>
                {consoleLogs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-1.5 py-0.5">
                    <span className="text-indigo-400 shrink-0">➜</span>
                    <span className={log.includes("ERROR") ? "text-red-400" : log.includes("SUCCESS") ? "text-emerald-400" : log.includes("WARNING") ? "text-yellow-400" : "text-slate-300"}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Display Sample Output SQL Relation Table below */}
            <div className="rounded-2xl border border-slate-800 bg-slate-850/30 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider flex items-center space-x-2">
                  <TableProperties className="w-4 h-4 text-blue-400" />
                  <span>Interactive Query Result Relation Table</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-right">
                  Relation: {tableExists ? "Student" : "None"}
                </span>
              </div>

              {!tableExists ? (
                <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 border-dashed text-slate-500 flex flex-col items-center justify-center space-y-2">
                  <AlertTriangle className="w-7 h-7 text-yellow-500" />
                  <p className="text-xs font-mono text-yellow-400/90 font-semibold">Table Student Drop Activated</p>
                  <p className="text-[11px] max-w-sm font-sans mt-0.5">Run CREATE TABLE Student to initialize database schema rows.</p>
                </div>
              ) : queryMatchedTable && queryMatchedTable.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-xs text-left font-mono">
                    <thead className="bg-slate-900 text-slate-300 border-b border-slate-800">
                      <tr>
                        <th className="p-3 text-cyan-400 font-bold">RollNo (INT PK)</th>
                        <th className="p-3 font-bold text-slate-100">Name (VARCHAR)</th>
                        <th className="p-3 font-bold text-slate-100">Department (VARCHAR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-slate-300">
                      {queryMatchedTable.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition">
                          <td className="p-3 text-cyan-400 font-semibold">{row.RollNo}</td>
                          <td className="p-3 font-medium">{row.Name}</td>
                          <td className="p-3 text-indigo-400 font-medium">{row.Department}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800 border-dashed text-slate-500 flex flex-col items-center justify-center space-y-1">
                  <p className="text-xs font-mono text-slate-400">Empty Result Set</p>
                  <p className="text-[11px] max-w-xs font-sans mt-0.5">0 rows currently match that schema. Run an INSERT query command!</p>
                </div>
              )}
            </div>

          </div>
          
        </div>

      </div>
    </section>
  );
}
