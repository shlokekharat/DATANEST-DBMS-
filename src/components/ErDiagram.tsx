import { useState } from 'react';
import { motion } from 'motion/react';
import { Network, Circle, ShieldCheck, Key, ArrowRight, HelpCircle, TableProperties } from 'lucide-react';

interface EntityDetail {
  name: string;
  type: string;
  desc: string;
  attributes: { name: string; type: string; isPK?: boolean; isFK?: boolean; isDerived?: boolean; description: string }[];
  relationships: string;
}

const ENTITY_SCHEMAS: Record<string, EntityDetail> = {
  Student: {
    name: "Student",
    type: "Core Entity",
    desc: "Represents university scholars whose registrations, personal demographics, and academic statuses are managed globally.",
    attributes: [
      { name: "RollNo", type: "INT", isPK: true, description: "Unique Student Roll Number (Primary Key)" },
      { name: "Name", type: "VARCHAR(50)", description: "Full legal name of the student" },
      { name: "Email", type: "VARCHAR(100)", description: "Academic email address used for institutional communications" },
      { name: "Mobile", type: "VARCHAR(15)", description: "Contact number tracking" },
      { name: "Department", type: "VARCHAR(30)", description: "Enrolled engineering department context" },
      { name: "City", type: "VARCHAR(30)", description: "Current placement residence context" },
      { name: "Status", type: "VARCHAR(10)", isDerived: true, description: "Status metric derived from active class schedules" }
    ],
    relationships: "Enrolls in multiple courses through the Enrollment transactional connector. Belongs to a single Department."
  },
  Faculty: {
    name: "Faculty",
    type: "Core Entity",
    desc: "Represents authorized lecturers and professors responsible for teaching academic courses, advising students, and grading catalogs.",
    attributes: [
      { name: "Faculty_ID", type: "INT", isPK: true, description: "Unique institutional Identification Key" },
      { name: "Name", type: "VARCHAR(50)", description: "Faculty name" },
      { name: "Department", type: "VARCHAR(30)", description: "Assigned primary instruction department" },
      { name: "Mobile", type: "VARCHAR(15)", description: "Mobile contact" },
      { name: "Specialization", type: "VARCHAR(50)", description: "Core academic research focus (AI, IoT, Database Eng)" }
    ],
    relationships: "Instructs Courses (1:N cardinality) and coordinates Course Syllabi structures."
  },
  Course: {
    name: "Course",
    type: "Core Entity",
    desc: "Represents organized academic courses of instruction with defined credits, sylabbi, and faculty associations.",
    attributes: [
      { name: "Course_Code", type: "VARCHAR(10)", isPK: true, description: "Alphanumeric short index code (e.g. CS101, IT304)" },
      { name: "Title", type: "VARCHAR(60)", description: "Full narrative course subject title" },
      { name: "Credits", type: "INT", description: "Course credit score sizing weight (e.g., 3 or 4 credits)" },
      { name: "Department", type: "VARCHAR(30)", description: "Host department controlling course syllabi" },
      { name: "Faculty_ID", type: "INT", isFK: true, description: "Foreign Key linking directly to Faculty ID responsible for lectures" }
    ],
    relationships: "Assigned to Faculty (N:1). Associated with scholars via the Enrollment connection (1:N)."
  },
  Enrollment: {
    name: "Enrollment",
    type: "Weak Associative Entity",
    desc: "Connects Students to their selected Courses in a robust Many-to-Many setup, managing enrollment dates, fees, and grades.",
    attributes: [
      { name: "Enrollment_ID", type: "INT", isPK: true, description: "Auto-incrementing Transaction log Key" },
      { name: "RollNo", type: "INT", isFK: true, description: "Foreign key pointing to the enrolled Student" },
      { name: "Course_Code", type: "VARCHAR(10)", isFK: true, description: "Foreign key referencing the target Course" },
      { name: "Enroll_Date", type: "DATE", description: "Date stamp tracing when the enrollment took place" },
      { name: "Grade", type: "VARCHAR(2)", description: "Assigned performance grade result (e.g. A+, B, O)" }
    ],
    relationships: "Sits as the intermediate associative relation table bridging Students (N:1) and Courses (N:1)."
  }
};

export default function ErDiagram() {
  const [selectedEntity, setSelectedEntity] = useState<string>("Student");

  return (
    <section id="er-diagram" className="py-24 bg-gray-50/50 dark:bg-slate-950/20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] bg-[size:16px_16px] opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-mono tracking-wider uppercase text-blue-600 dark:text-blue-400 font-bold">
            Schema Mapping Model
          </h2>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white mt-1">
            Student Management ER Diagram
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-base font-sans">
            Explore relationships mapping university components. Click any colored Entity box to examine primary keys, composite columns, and cardinality formulas in the dashboard sidebar.
          </p>
        </div>

        {/* ER Content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive SVG Diagram Node Canvas */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm overflow-hidden bg-white/65 dark:bg-slate-900/60 flex flex-col justify-between">
              
              {/* Header tags and status */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
                <span className="text-[11px] font-mono text-gray-500 flex items-center space-x-1.5 font-bold uppercase">
                  <Network className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Interactive Vector Schema Canvas</span>
                </span>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900">
                  Total Entities: 4
                </span>
              </div>

              {/* Responsive SVG Vector viewport representation */}
              <div className="relative w-full overflow-x-auto no-scrollbar py-2">
                <div className="min-w-[580px] h-[360px] relative mx-auto select-none">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    {/* Define SVG marker arrow caps */}
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" className="fill-slate-400 dark:fill-slate-600" />
                      </marker>
                    </defs>

                    {/* Connective links lines between blocks with cardinality numbers */}
                    
                    {/* Faculty (1) -- Teaches -- Course (N) */}
                    <line x1="100" y1="90" x2="290" y2="90" className="stroke-slate-350 dark:stroke-slate-700 stroke-2 stroke-dashed" />
                    
                    {/* Student (1) -- Enrolls in -- Enrollment (N) */}
                    <line x1="100" y1="270" x2="290" y2="270" className="stroke-slate-350 dark:stroke-slate-700 stroke-2" />
                    
                    {/* Enrollment (N) -- Course (1) */}
                    <line x1="390" y1="270" x2="390" y2="120" className="stroke-slate-350 dark:stroke-slate-700 stroke-2" />
                  </svg>

                  {/* HTML Overlay nodes positioned absolutely for absolute responsive alignment and rich hover states info */}
                  
                  {/* Category 1: FACULTY Node */}
                  <div 
                    onClick={() => setSelectedEntity("Faculty")}
                    className={`absolute left-4 top-10 w-24 p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer shadow-sm ${
                      selectedEntity === "Faculty" 
                        ? "bg-purple-100 border-purple-400 text-purple-900 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300 scale-105 ring-2 ring-purple-400/20" 
                        : "bg-white border-gray-200 text-gray-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 hover:border-purple-300"
                    }`}
                  >
                    <p className="text-[10px] font-mono font-bold text-purple-500 uppercase">Faculty</p>
                    <p className="text-xs font-bold font-display mt-0.5">Faculty_ID</p>
                  </div>

                  {/* Relationship Diamond: Teaches */}
                  <div className="absolute left-[154px] top-[74px] w-18 h-8 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center rotate-45 shadow-sm transform">
                    <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 -rotate-45 block">TEACHES</span>
                  </div>
                  <div className="absolute left-[134px] top-[60px] text-[10px] font-mono font-bold text-slate-400">1</div>
                  <div className="absolute left-[200px] top-[60px] text-[10px] font-mono font-bold text-slate-400">N</div>

                  {/* Category 2: COURSE Node */}
                  <div 
                    onClick={() => setSelectedEntity("Course")}
                    className={`absolute left-72 top-10 w-24 p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer shadow-sm ${
                      selectedEntity === "Course" 
                        ? "bg-indigo-100 border-indigo-400 text-indigo-900 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-300 scale-105 ring-2 ring-indigo-400/20" 
                        : "bg-white border-gray-200 text-gray-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 hover:border-indigo-300"
                    }`}
                  >
                    <p className="text-[10px] font-mono font-bold text-indigo-500 uppercase">Course</p>
                    <p className="text-xs font-bold font-display mt-0.5">Course_Code</p>
                  </div>

                  {/* Category 3: STUDENT Node */}
                  <div 
                    onClick={() => setSelectedEntity("Student")}
                    className={`absolute left-4 top-54 w-24 p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer shadow-sm ${
                      selectedEntity === "Student" 
                        ? "bg-blue-100 border-blue-400 text-blue-900 dark:bg-blue-950 dark:border-blue-850 dark:text-blue-300 scale-105 ring-2 ring-blue-400/20" 
                        : "bg-white border-gray-200 text-gray-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 hover:border-blue-300"
                    }`}
                  >
                    <p className="text-[10px] font-mono font-bold text-blue-500 uppercase">Student</p>
                    <p className="text-xs font-bold font-display mt-0.5">RollNo</p>
                  </div>

                  {/* Relationship Diamond: Enrolls */}
                  <div className="absolute left-[154px] top-[254px] w-18 h-8 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center rotate-45 shadow-sm transform">
                    <span className="text-[8px] font-mono font-bold text-slate-500 dark:text-slate-400 -rotate-45 block">ENROLLS</span>
                  </div>
                  <div className="absolute left-[134px] top-[240px] text-[10px] font-mono font-bold text-slate-400">1</div>
                  <div className="absolute left-[200px] top-[240px] text-[10px] font-mono font-bold text-slate-400">N</div>

                  {/* Category 4: ENROLLMENT weak associative Node */}
                  <div 
                    onClick={() => setSelectedEntity("Enrollment")}
                    className={`absolute left-72 top-54 w-24 p-3 rounded-xl border text-center border-dashed transition-all duration-300 cursor-pointer shadow-sm ${
                      selectedEntity === "Enrollment" 
                        ? "bg-emerald-100 border-emerald-400 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300 scale-105 ring-2 ring-emerald-400/20" 
                        : "bg-white border-emerald-350 text-gray-850 dark:bg-slate-905 dark:border-emerald-900 dark:text-emerald-300 hover:border-emerald-500"
                    }`}
                  >
                    <p className="text-[9px] font-mono font-bold text-emerald-500 uppercase">Enrollment</p>
                    <p className="text-xs font-bold font-display mt-0.5">Enroll_ID</p>
                  </div>

                  {/* Relationship connector enrollment course: Of_Course */}
                  <div className="absolute left-[304px] top-[164px] w-18 h-8 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center rotate-45 shadow-sm transform">
                    <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 -rotate-45 block">FOR</span>
                  </div>
                  <div className="absolute left-[334px] top-[190px] text-[10px] font-mono font-bold text-slate-400">N</div>
                  <div className="absolute left-[334px] top-[138px] text-[11px] font-mono font-bold text-slate-400">1</div>

                  {/* Floating oval attributes visually linked to Student for aesthetic completeness */}
                  <div className="absolute left-[14px] top-[170px] px-2 py-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-[9px] font-mono rounded-full text-slate-450">RollNo</div>
                  <div className="absolute left-[110px] top-[210px] px-2 py-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-[9px] font-mono rounded-full text-slate-450">Name</div>
                  <div className="absolute left-[118px] top-[164px] px-2 py-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-[9px] font-mono rounded-full text-slate-450">Department</div>
                </div>
              </div>

              {/* Help Hint */}
              <div className="p-3 bg-gray-50 dark:bg-slate-950/60 rounded-xl border border-gray-100 dark:border-slate-850 text-[10px] text-gray-500 dark:text-slate-400 font-sans flex items-start space-x-2">
                <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <p>
                  The dashed box represents an <strong className="text-gray-900 dark:text-white font-semibold">Associative Weak Entity</strong>, which acts as a bridge to resolve a Many-to-Many dependency mapping (Student enrollment courses) into tidy binary One-to-Many relationships.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive attribute inspector panel */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-5 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm flex flex-col h-full bg-white/65 dark:bg-slate-900/60 justify-between">
              <div>
                {/* Selected Heading */}
                <div className="pb-4 border-b border-gray-100 dark:border-slate-800 mb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-indigo-500">
                      {ENTITY_SCHEMAS[selectedEntity].type}
                    </span>
                    <h3 className="text-xl font-display font-extrabold text-blue-900 dark:text-white mt-0.5">
                      {selectedEntity} Entity Structure
                    </h3>
                  </div>
                  <div className="px-3 py-1 bg-blue-50 dark:bg-slate-820 rounded-xl text-blue-600 dark:text-blue-400 font-bold font-mono text-xs">
                    RDBMS Block
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-350 font-sans leading-relaxed mb-5">
                  {ENTITY_SCHEMAS[selectedEntity].desc}
                </p>

                {/* Attributes breakdown label list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1.5">
                    <TableProperties className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Table Field Attribute Declarations</span>
                  </h4>

                  <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1 no-scrollbar">
                    {ENTITY_SCHEMAS[selectedEntity].attributes.map((attr, index) => (
                      <div 
                        key={index} 
                        className="p-2.5 bg-gray-50/70 dark:bg-slate-950/40 rounded-xl border border-gray-100/50 dark:border-slate-800/40 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-1.5 min-w-0">
                          {attr.isPK && <Key className="w-3.5 h-3.5 text-yellow-500 shrink-0" />}
                          {attr.isFK && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                          <span className="font-mono text-xs font-bold text-gray-800 dark:text-white truncate">
                            {attr.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="text-[10px] font-mono text-gray-400 font-bold bg-gray-200/50 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {attr.type}
                          </span>
                          {attr.isPK && (
                            <span className="text-[8px] font-mono bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900 px-1 py-0.5 rounded font-bold">
                              PK
                            </span>
                          )}
                          {attr.isFK && (
                            <span className="text-[8px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 px-1 py-0.5 rounded font-bold">
                              FK
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Relationship label summary */}
              <div className="mt-5 p-3.5 bg-slate-900 dark:bg-slate-950 rounded-xl text-xs text-indigo-300 font-sans border border-slate-800">
                <span className="font-mono font-extrabold text-white text-[10px] uppercase tracking-wider block mb-1">
                  🌐 Cardinality and Relationships Mapping
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {ENTITY_SCHEMAS[selectedEntity].relationships}
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
