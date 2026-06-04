import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, RotateCcw, AlertTriangle, Terminal, Code, Database, 
  TableProperties, Sparkles, AlertCircle, CheckCircle2, Info 
} from 'lucide-react';

interface SQLRow {
  RollNo: number;
  Name: string;
  Department: string;
}

interface SqlFeedback {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  details?: string;
  lineHint?: number;
}

function performRealtimeValidation(code: string, tableExistsCurrent: boolean): SqlFeedback | null {
  if (!code.trim()) {
    return {
      type: 'info',
      message: 'Sandbox Empty',
      details: 'Type or load some structured queries to begin student database transactions.'
    };
  }

  const lines = code.split('\n');
  
  // 1. Balance check for quotes & parentheses
  let openParentheses = 0;
  let singleQuotes = 0;
  let doubleQuotes = 0;
  
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    if (char === '(') openParentheses++;
    if (char === ')') openParentheses--;
    if (char === "'") singleQuotes++;
    if (char === '"') doubleQuotes++;
  }
  
  if (openParentheses > 0) {
    return {
      type: 'error',
      message: 'Unbalanced Parentheses',
      details: 'You have open parentheses ( that are not closed. Ensure all columns/values are sealed correctly.'
    };
  } else if (openParentheses < 0) {
    return {
      type: 'error',
      message: 'Unexpected Closing Parenthesis',
      details: 'Found a closing parenthesis ) without a corresponding opening one.'
    };
  }

  if (singleQuotes % 2 !== 0) {
    return {
      type: 'error',
      message: 'Unterminated String Literal',
      details: "You have an odd number of single string quotes ('). SQL string values must be enclosed in pairs."
    };
  }

  if (doubleQuotes % 2 !== 0) {
    return {
      type: 'error',
      message: 'Unterminated Double Quote String',
      details: 'You have an odd number of double string quotes ("). While standard SQL uses single quotes for literals, always make sure double quotes pair up.'
    };
  }

  // 2. Syntax/Keyword spelling check
  for (let i = 0; i < lines.length; i++) {
    const lineText = lines[i].trim().toLowerCase();
    
    // Ignore block or inline comments
    if (lineText.startsWith('--') || lineText.startsWith('#') || lineText.length === 0) {
      continue;
    }

    // Check misspelled SELECT
    if (/^(selct|selet|selec)\b/.test(lineText)) {
      return {
        type: 'error',
        message: 'Spelling Syntax Error on SELECT',
        details: `Did you mean "SELECT"? Found potential typo on Line ${i + 1}: "${lines[i].trim()}"`,
        lineHint: i + 1
      };
    }
    // Check misspelled INSERT
    if (/^(insrt|inser|inset)\b/.test(lineText)) {
      return {
        type: 'error',
        message: 'Spelling Syntax Error on INSERT',
        details: `Did you mean "INSERT INTO"? Found potential typo on Line ${i + 1}: "${lines[i].trim()}"`,
        lineHint: i + 1
      };
    }
    // Check misspelled UPDATE
    if (/^(updat|updt)\b/.test(lineText)) {
      return {
        type: 'error',
        message: 'Spelling Syntax Error on UPDATE',
        details: `Did you mean "UPDATE"? Found potential typo on Line ${i + 1}: "${lines[i].trim()}"`,
        lineHint: i + 1
      };
    }
    // Check misspelled DELETE
    if (/^(delte|delet|del)\b/.test(lineText)) {
      return {
        type: 'error',
        message: 'Spelling Syntax Error on DELETE',
        details: `Did you mean "DELETE"? Found potential typo on Line ${i + 1}: "${lines[i].trim()}"`,
        lineHint: i + 1
      };
    }
    // Check misspelled CREATE
    if (/^(crate|creaet|creat)\b/.test(lineText)) {
      return {
        type: 'error',
        message: 'Spelling Syntax Error on CREATE',
        details: `Did you mean "CREATE TABLE"? Found potential typo on Line ${i + 1}: "${lines[i].trim()}"`,
        lineHint: i + 1
      };
    }

    // Check missing INTO in INSERT
    if (lineText.startsWith('insert') && !lineText.includes('into')) {
      return {
        type: 'error',
        message: 'Missing INTO Clause',
        details: `The INSERT statement requires an "INTO" clause. Syntax: INSERT INTO tablename VALUES(...). Found at Line ${i + 1}`,
        lineHint: i + 1
      };
    }

    // Check missing TABLE or DATABASE in CREATE
    if (lineText.startsWith('create') && !lineText.includes('table') && !lineText.includes('database')) {
      return {
        type: 'error',
        message: 'Incomplete CREATE Statement',
        details: `Specify what relation block to create (e.g., CREATE TABLE Student). Found at Line ${i + 1}`,
        lineHint: i + 1
      };
    }

    // Check missing FROM clause in SELECT
    if (lineText.startsWith('select') && !lineText.includes('from') && !lineText.includes('dual')) {
      if (!/select\s+\d+|select\s+now\(\)/.test(lineText)) {
        return {
          type: 'warning',
          message: 'Missing FROM Clause',
          details: `The SELECT statement targeting relations usually needs a FROM clause. E.g., SELECT * FROM Student;. Found at Line ${i + 1}`,
          lineHint: i + 1
        };
      }
    }
  }

  // 3. Semicolon trailing checks for multiple statements
  const logicalLinesWithText = lines
    .map((l, index) => ({ text: l.trim(), lineNum: index + 1 }))
    .filter(item => item.text.length > 0 && !item.text.startsWith('--') && !item.text.startsWith('#'));

  if (logicalLinesWithText.length > 1) {
    if (!code.includes(';')) {
      return {
        type: 'warning',
        message: 'Missing Statement Separator',
        details: 'When composing multiple queries, use a semicolon (;) to separate statements clearly to prevent compile confusion.'
      };
    }
  }

  return null;
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

  // Real-time syntax and compiler feedback states
  const [realtimeFeedback, setRealtimeFeedback] = useState<SqlFeedback | null>(null);
  const [executionFeedback, setExecutionFeedback] = useState<SqlFeedback | null>({
    type: 'success',
    message: 'Sandbox Active',
    details: 'Type selection/modification queries or load pre-built shortcuts to test relational assertions.'
  });

  // Calculate real-time feedback on typing changes or schema state updates
  useEffect(() => {
    const feedback = performRealtimeValidation(sqlCode, tableExists);
    setRealtimeFeedback(feedback);
  }, [sqlCode, tableExists]);

  const handleShortcutClick = (code: string, desc: string) => {
    setSqlCode(code.trim());
    setExecutionFeedback(null);
    setConsoleLogs(prev => [...prev, `Loaded shortcut: ${desc}`]);
  };

  const handleReset = () => {
    setSqlCode(DEFAULT_SQL_CODE);
    setTableExists(true);
    setExecutionFeedback({
      type: 'success',
      message: 'Sandbox State Refreshed',
      details: 'Restored correct starting schema configurations and seed items.'
    });
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
    // 1. Pre-validation check
    const validation = performRealtimeValidation(sqlCode, tableExists);
    if (validation && validation.type === 'error') {
      setConsoleLogs(prev => [
        ...prev,
        "Parser Compile Failed!",
        `ERROR: ${validation.message} - ${validation.details}`,
        "--------------------------------------"
      ]);
      setExecutionFeedback(validation);
      return;
    }

    const cleanLines = sqlCode
      .toLowerCase()
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    let logs: string[] = [];
    let updatedRows = [...studentRows];
    let showTable = true;
    let tableSetupState = tableExists;
    let firstError: SqlFeedback | null = null;

    logs.push(`Parser: Compiling SQL query statements...`);

    // Let's iterate over statement structures
    for (const statement of cleanLines) {
      if (statement.includes('create table student')) {
        tableSetupState = true;
        logs.push(`SUCCESS: Table 'Student' created successfully. (Cols: RollNo INT, Name VARCHAR, Department VARCHAR)`);
      } else if (statement.includes('drop table student') || statement.includes('drop table student;')) {
        tableSetupState = false;
        updatedRows = [];
        logs.push(`SUCCESS: DROP TABLE Student executed successfully - relation schema dropped.`);
      } else if (statement.includes('insert into student')) {
        if (!tableSetupState) {
          logs.push(`ERROR: Table 'Student' does not exist! Execute CREATE TABLE first.`);
          showTable = false;
          if (!firstError) {
            firstError = {
              type: 'error',
              message: "Relation 'Student' is missing",
              details: "Cannot insert values because table has not been created or was dropped. Please run a CREATE TABLE statement first."
            };
          }
        } else {
          // Parse values
          try {
            if (statement.includes('1') && statement.includes('shloke')) {
              if (!updatedRows.some(r => r.RollNo === 1)) {
                updatedRows.push({ RollNo: 1, Name: 'Shloke', Department: 'Computer & IoT' });
                logs.push(`SUCCESS: INSERT INTO Student VALUES(1, 'Shloke', 'Computer & IoT') - 1 row affected.`);
              } else {
                logs.push(`WARNING: PRIMARY KEY Violation. RollNo '1' already exists.`);
                if (!firstError) {
                  firstError = {
                    type: 'warning',
                    message: "PRIMARY KEY Violation",
                    details: "A record with RollNo (PK) '1' already exists in the Student database. Keys must be unique."
                  };
                }
              }
            } else if (statement.includes('2') && statement.includes('aditya')) {
              if (!updatedRows.some(r => r.RollNo === 2)) {
                updatedRows.push({ RollNo: 2, Name: 'Aditya', Department: 'Computer & IoT' });
                logs.push(`SUCCESS: INSERT INTO Student VALUES(2, 'Aditya', 'Computer & IoT') - 1 row affected.`);
              } else {
                logs.push(`WARNING: PRIMARY KEY Violation. RollNo '2' already exists.`);
                if (!firstError) {
                  firstError = {
                    type: 'warning',
                    message: "PRIMARY KEY Violation",
                    details: "A record with RollNo (PK) '2' already exists in the Student database. Keys must be unique."
                  };
                }
              }
            } else if (statement.includes('3') && statement.includes('neha')) {
              if (!updatedRows.some(r => r.RollNo === 3)) {
                updatedRows.push({ RollNo: 3, Name: 'Neha', Department: 'Information Technology' });
                logs.push(`SUCCESS: INSERT INTO Student VALUES(3, 'Neha', 'Information Technology') - 1 row affected.`);
              } else {
                logs.push(`WARNING: PRIMARY KEY Violation. RollNo '3' already exists.`);
                if (!firstError) {
                  firstError = {
                    type: 'warning',
                    message: "PRIMARY KEY Violation",
                    details: "A record with RollNo (PK) '3' already exists in the Student database. Keys must be unique."
                  };
                }
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
                      if (!firstError) {
                        firstError = {
                          type: 'warning',
                          message: "PRIMARY KEY Violation",
                          details: `A record with RollNo (PK) '${rNo}' already exists in the Student database.`
                        };
                      }
                    }
                  } else {
                    logs.push(`ERROR: Primary key RollNo value must be a valid integer identifier.`);
                    if (!firstError) {
                      firstError = {
                        type: 'error',
                        message: "Invalid Key Parameter",
                        details: "The database primary key (RollNo) must be a numeric integer value."
                      };
                    }
                  }
                } else {
                  logs.push(`ERROR: Column arguments count mismatch for 'Student'. Passed ${parts.length} values, requires 3.`);
                  if (!firstError) {
                    firstError = {
                      type: 'error',
                      message: "Relation Signature Mismatch",
                      details: "Student row insertion expects exactly 3 values: (RollNo, Name, Department)."
                    };
                  }
                }
              } else {
                logs.push(`ERROR: Missing columns parameters inside values parenthesis.`);
                if (!firstError) {
                  firstError = {
                    type: 'error',
                    message: "Query Compilation Fault",
                    details: "The insert request lacks parentheses-enclosed records values."
                  };
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
          if (!firstError) {
            firstError = {
              type: 'error',
              message: "Relation Table Missing",
              details: "Cannot query 'Student' table. Run 'CREATE TABLE Student' first."
            };
          }
        } else {
          logs.push(`SUCCESS: SELECT * FROM Student returned columns successfully.`);
        }
      } else if (statement.includes('update student')) {
        if (!tableSetupState) {
          logs.push(`ERROR: Relation 'Student' is missing. Action aborted.`);
          if (!firstError) {
            firstError = {
              type: 'error',
              message: "Relation Table Missing",
              details: "Cannot execute UPDATE updates on a non-existent table."
            };
          }
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
          if (!firstError) {
            firstError = {
              type: 'error',
              message: "Relation Table Missing",
              details: "Cannot execute DELETE actions on a non-existent table."
            };
          }
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
    if (firstError) {
      logs.push(`Query completed with execution concerns | Status: COMMITTED_ERR`);
      setExecutionFeedback(firstError);
    } else {
      logs.push(`Query completed in 1.40ms | Status: OK`);
      setExecutionFeedback({
        type: 'success',
        message: 'Query executed successfully!',
        details: 'All matched commands parsed and simulated seamlessly. Relation state updated.'
      });
    }

    setConsoleLogs(prev => [...prev, ...logs]);
  };

  // Select active feedback to show
  const activeFeedback = executionFeedback || realtimeFeedback || {
    type: 'success' as const,
    message: 'SQL Syntax Normal',
    details: 'The validator has parsed the statements. No query warning or mismatch detected.'
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
                  onChange={(e) => {
                    setSqlCode(e.target.value);
                    setExecutionFeedback(null);
                  }}
                  placeholder="-- Write your SQL queries here..."
                  className="col-span-11 bg-slate-950 p-4 text-cyan-400/90 font-mono text-xs focus:outline-none resize-none leading-relaxed h-[220px] w-full"
                />
              </div>

              {/* Dynamic Error & Syntax Validation Feedback Bar */}
              <div className={`border-t p-4 flex items-start space-x-3 transition-colors duration-200 ${
                activeFeedback.type === 'error'
                  ? 'bg-red-950/40 border-red-900/60 text-red-100'
                  : activeFeedback.type === 'warning'
                  ? 'bg-amber-950/30 border-amber-950/60 text-amber-100'
                  : activeFeedback.type === 'success'
                  ? 'bg-emerald-950/20 border-emerald-950/30 text-emerald-100'
                  : 'bg-slate-900 border-slate-805 text-slate-100'
              }`}>
                <div className="shrink-0 mt-0.5">
                  {activeFeedback.type === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />
                  )}
                  {activeFeedback.type === 'warning' && (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  {activeFeedback.type === 'success' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {activeFeedback.type === 'info' && (
                    <Info className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center space-x-1.5 flex-wrap">
                    <span id="active-feedback-badge" className={`text-[9px] uppercase font-mono font-extrabold tracking-widest px-1.5 py-0.5 rounded ${
                      activeFeedback.type === 'error' ? 'bg-red-900/40 text-red-300' :
                      activeFeedback.type === 'warning' ? 'bg-amber-900/30 text-amber-300' :
                      activeFeedback.type === 'success' ? 'bg-emerald-900/30 text-emerald-300' :
                      'bg-blue-900/30 text-blue-300'
                    }`}>
                      {activeFeedback.type}
                    </span>
                    <h4 className="text-xs font-mono font-bold text-slate-200">
                      {activeFeedback.message} {activeFeedback.lineHint && `(Line ${activeFeedback.lineHint})`}
                    </h4>
                  </div>
                  {activeFeedback.details && (
                    <p className="text-[10px] text-slate-400 font-sans mt-1 leading-relaxed">
                      {activeFeedback.details}
                    </p>
                  )}
                </div>
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
