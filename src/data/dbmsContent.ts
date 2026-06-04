import { QuizQuestion, DbmsContentItem } from '../types';

export const ABOUT_DBMS_CARDS = [
  {
    title: "What is DBMS?",
    desc: "A Database Management System (DBMS) is software designed to store, retrieve, define, and manage data in a database. It serves as an interface between end-users and databases, ensuring data is consistently organized and easily accessible.",
    details: "Typically, a DBMS provides tools for data definition, data updating, data retrieval, and user administration. It guarantees the security, integrity, and privacy of records while handling concurrent requests from multiple clients."
  },
  {
    title: "Characteristics of DBMS",
    desc: "Provides self-describing catalog database data, supports insulation between programs and data, supports multi-user transaction processing, and maintains multiple views of data.",
    details: "Key features include: Real-world entity representation, Relation-based tables, Separation of data and application (data independence), Less redundancy, Consistency, and query language integration (SQL)."
  },
  {
    title: "Advantages of DBMS",
    desc: "Improves data sharing, data security, data integration, and data access, while eliminating data inconsistency and minimizing overall data redundancy.",
    details: "Furthermore, it offers computerized backup and recovery, supports standard schema rules, simplifies complex application codes, and facilitates standard-compliant decision-making databases."
  },
  {
    title: "Applications of DBMS",
    desc: "Widespread applications across multiple fields: Banking (transactions), Airlines (reservations), Universities (student details), Telecommunications (billing, calls), and E-commerce (sales, carts).",
    details: "Virtually every modern industry relies on DBMS for operational storage. Human resources utilize it for payroll tracking, manufacturing for supply chain logistics, and hospitals for medical records."
  },
  {
    title: "Components of DBMS",
    desc: "DBMS consists of five major components: Hardware, Software, Data, Procedures (the rules governing design/usage), and users (DBA, Designers, End-users).",
    details: "Hardware includes servers and storage devices; Software comprises DBMS application software, Operating Systems, and network layers; Data represents the operational database and metadata stored in data dictionaries."
  },
  {
    title: "File System vs DBMS",
    desc: "Traditional file systems store raw files, leading to major redundancy, inconsistency, poor searchability, lacks transaction management, and poor security, whereas DBMS resolves these limits.",
    details: "Comparison Matrix:\n- Redundancy: High in File Systems vs Minimized in DBMS.\n- Data Sharing: Hard/Manual vs Easy/Built-in.\n- Integrity Constraints: Programmatic vs Decoupled DBMS Constraints.\n- Concurrency: Unsupported vs Supported via ACID transactions."
  }
];

export const LEARNING_HUB_CONTENT: DbmsContentItem[] = [
  {
    id: "intro-dbms",
    title: "1. Introduction to DBMS",
    shortDesc: "Basic definitions, database scope, metadata, and data dictionaries.",
    detailedDesc: "Database Management Systems (DBMS) act as intermediate layers between applications and raw storage. They manage data dictionaries, schemas, indexing structures, and access policies. Instead of storing data on separate isolated files, a DBMS centralizes data, creating a logical overview of information. Metadata, often called 'data about data', describes the tables, data types, indexes, and relationships in the system, kept inside the system catalog.",
    example: "/* Concept Visualized */\nUser Request ➔ DBMS Interface ➔ Disk Storage Engine\n[Schema Details (Metadata)] are matched before queries execute. This ensures structural integrity."
  },
  {
    id: "types-db",
    title: "2. Types of Databases",
    shortDesc: "Relational, NoSQL, Object-Oriented, and Graph databases.",
    detailedDesc: "Databases are categorized by their underlying storage logic:\n1. Relational DBMS (RDBMS): Uses tables with fixed rows and columns (MySQL, PostgreSQL).\n2. NoSQL: Schema-less storage: Document (MongoDB), Key-Value (Redis), Wide-Column (Cassandra).\n3. Object-Oriented: Stores business entities as objects (db4o).\n4. Graph: Stores nodes and structural relationships (Neo4j).\n5. Distributed: Shared across multiple network machines to ensure parallel performance and durability.",
    example: "/* Relational vs Document Store */\n-- SQL (Relational)\nSELECT * FROM Users WHERE id = 1;\n\n// NoSQL Document\ndb.users.findOne({ id: 1 });"
  },
  {
    id: "architecture",
    title: "3. DBMS Architecture",
    shortDesc: "Data independence, 3-Schema architecture, and client-server tiers.",
    detailedDesc: "DBMS architecture is categorized into Server Tiers and Schema Levels:\n- 1-Tier: Client, DBMS, and Database reside on the same computer.\n- 2-Tier: Client-Server network where client directly queries database on the server. \n- 3-Tier: Standard web model (Client ➔ App Server/API ➔ DB Server).\n\nAdditionally, the ANSI-SPARC Three-Schema Architecture achieves data independence:\n1. External Schema (Views for distinct users)\n2. Conceptual Schema (Logical tables and relationships)\n3. Internal Schema (Physical layout on disk storage)",
    example: "/* Data Independence */\nIf we modify physical database indexing (Internal Level), the Conceptual Level and user Web Views remain completely unaffected."
  },
  {
    id: "er-model",
    title: "4. ER Model",
    shortDesc: "Entities, attributes, relationships, cardinality, and ER diagrams.",
    detailedDesc: "The Entity-Relationship (ER) model is a conceptual tool used to plan database designs before writing code.\n- Entity: Real-world object (Student, Course, Faculty).\n- Attributes: Properties of entities. Types include Multi-valued (multiple phone numbers), Composite (first name, last name), and Derived (Age, computed from Date of Birth).\n- Relationships: Connections between entities with defined cardinality (1:1, 1:Many, Many:Many) and participation constraints (Partial or Total).",
    example: "/* Cardinality Representation */\n[Student] ──( 1 : N )── [Enrollment] ──( N : 1 )── [Course]\nA Student is enrolled in multiple learning courses."
  },
  {
    id: "normalization",
    title: "5. Normalization",
    shortDesc: "Eliminating redundancy: 1NF, 2NF, 3NF, and Boyce-Codd (BCNF).",
    detailedDesc: "Normalization is the systematic process of organizing relational database columns and tables to minimize redundancy and eliminate anomalies (Insertion, Deletion, and Update anomalies).\n- 1NF: Atomic values only. No repeating multi-valued groups.\n- 2NF: Meets 1NF, and no partial functional dependencies (all non-prime attributes must depend entirely on the Primary Key).\n- 3NF: Meets 2NF, and no transitive dependencies (non-prime attributes shouldn't depend on other non-prime attributes).\n- BCNF: Stronger 3NF; for every functional dependency X ➔ Y, X must be a super key.",
    example: "/* Transitive Violation (Normalized to 3NF) */\n-- Non-3NF Table: [RollNo (PK), Dept_Name, Dept_Head]\nHere, Dept_Head depends transitively on Dept_Name (which depends on RollNo).\n-- 3NF Separation:\nTable 1: [RollNo (PK), Dept_Name]\nTable 2: [Dept_Name (PK), Dept_Head]"
  },
  {
    id: "keys",
    title: "6. Keys in DBMS",
    shortDesc: "Super, Candidate, Primary, Alternate, and Foreign Keys.",
    detailedDesc: "Keys are attributes or sets of attributes that uniquely identify records or build structural relationships between tables:\n- Super Key: Any columns that uniquely identify rows.\n- Candidate Key: Minimal Super Key without redundant columns.\n- Primary Key: Selected Candidate Key representing rows uniquely. Never empty (not null).\n- Alternate Key: Candidate Keys not selected as the primary key.\n- Foreign Key: Column that points to the Primary Key of another table, ensuring Referential Integrity.",
    example: "/* Key Mapping Example */\nTable Student: [RollNo (Primary Key), Email (Candidate Key), Name, City, DeptCode (Foreign Key Ref Dept)]"
  },
  {
    id: "sql-commands",
    title: "7. SQL Commands",
    shortDesc: "DDL, DML, DCL, and TCL syntax breakdowns.",
    detailedDesc: "Structured Query Language (SQL) statements are divided into scopes:\n- DDL (Data Definition Language): Defines structures. Commands: CREATE, ALTER, DROP, TRUNCATE.\n- DML (Data Manipulation Language): Manipulates records. Commands: SELECT, INSERT, UPDATE, DELETE.\n- DCL (Data Control Language): Grants and revokes permissions. Commands: GRANT, REVOKE.\n- TCL (Transaction Control Language): Manages state commits. Commands: COMMIT, ROLLBACK, SAVEPOINT.",
    example: "-- Standard Transaction control example\nBEGIN TRANSACTION;\nUPDATE Accounts SET Balance = Balance - 500 WHERE UserID = 1;\nUPDATE Accounts SET Balance = Balance + 500 WHERE UserID = 2;\nCOMMIT; -- Saves changes after ensuring safety."
  },
  {
    id: "acid",
    title: "8. ACID Properties",
    shortDesc: "Detailed Atomicity, Consistency, Isolation, and Durability.",
    detailedDesc: "A transaction is a logical unit of database processing. To protect state, all transactions must adhere to ACID properties:\n- Atomicity: 'All or Nothing'. If any query fails, the entire transaction rolls back.\n- Consistency: Transition from one valid state to another, satisfying all schema constraints.\n- Isolation: Transactions execute separately. Uncommitted edits from one transaction aren't visible to others.\n- Durability: Once database commits, the records are written permanently across hardware crashes.",
    example: "/* Bank Transfer Illustration */\nIf a power loss occurs after withdrawing $100 from User A, but before adding it to User B, DBMS uses its Redo/Undo transaction logs to restore the matching original state."
  },
  {
    id: "transactions",
    title: "9. Transactions",
    shortDesc: "States of transaction executions and processing cycles.",
    detailedDesc: "A transaction progresses through several distinct states during execution:\n1. Active: Initial state during execution.\n2. Partially Committed: final statement finishes executing, before writing data to disk.\n3. Failed: Error prevents normal completion.\n4. Aborted: Transaction rolled back; database restored to prior state.\n5. Committed: Database update completes safely.",
    example: "/* State Flow Chart */\n[Active] ➔ [Partially Committed] ➔ [Committed]\n   └──➔ [Failed] ➔ [Aborted]"
  },
  {
    id: "concurrency",
    title: "10. Concurrency Control",
    shortDesc: "Shared/Exclusive locks, 2PL, and concurrency anomalies.",
    detailedDesc: "Multiple users editing the database at once can lead to anomalies: Dirty Reads (reading uncommitted data), Lost Updates, and Unrepeatable Reads. Concurrency control manages simultaneous client processes. Common techniques:\n- Lock-Based Protocols: Shared Locks (S) allow multiple users to read; Exclusive Locks (X) allow write operations.\n- Two-Phase Locking (2PL): Growing Phase (acquiring locks) and Shrinking Phase (releasing locks). Ensures serializability.",
    example: "/* Concurrency Lock Conflict Table */\nLock Requested | Shared (S) | Exclusive (X)\nShared (S)     | Allow ✓    | Deny ✗\nExclusive (X)  | Deny ✗     | Deny ✗"
  },
  {
    id: "deadlock",
    title: "11. Deadlock",
    shortDesc: "Preventing, detecting, and resolving deadlock locks.",
    detailedDesc: "A Deadlock occurs when two or more transactions are in a circular wait, each holding a lock that another needs, freezing all execution.\n- Prevention: Assign timestamps. Wait-Die scheme (older waits, younger dies) or Wound-Wait scheme (older wounds/preempts younger).\n- Avoidance: Use Banker's Algorithm to check resource allocation safety.\n- Detection & Recovery: Build a Wait-For Graph (cycles indicate deadlocks) and abort selected victim transactions to release locks.",
    example: "/* Circular Wait Graph */\nTx1 (holds Resource A) ━━─➔ Waits for Resource B ━━─➔ Tx2 (holds Resource B) ━━─➔ Waits for Resource A (Circular lock freeze)."
  },
  {
    id: "distributed-db",
    title: "12. Distributed Database",
    shortDesc: "Data fragmentation, database replication, and distribution transparency.",
    detailedDesc: "A distributed database splits logical files across different machines. Key concepts:\n- Fragmentation: Splitting a relation into horizontal fragments (sub-tables of rows) or vertical fragments (sub-tables of columns).\n- Replication: Copying fragmentation across multiple physical servers to ensure rapid local access and resilience against regional connection failures.\n- Transparency: Users can write queries queries as if all data is stored on a single disk.",
    example: "/* Horizontal vs Vertical Fragmentation */\nHorizontal: EmployeeRows(City='New York') on Disk Server A; Rows(City='London') on Server B.\nVertical: StudentCredentials(ID, Password) on DB Core A; StudentProfile(ID, Address, Contact) on Web Client DB B."
  },
  {
    id: "db-security",
    title: "13. Database Security",
    shortDesc: "Access controls, SQL injection defenses, and encryption.",
    detailedDesc: "Database security keeps relational servers safe from unauthorized access or malicious manipulation.\n- SQL Injection: Defense is parameterized queries or precompiled statements (Prepared Statements).\n- Encryption: Encrypting records in-transit (SSL/TLS) and at-rest (disk block encryption).\n- Role-Based Access Control (RBAC): Assigning permissions to roles (Admin, Student, Faculty) rather than individuals to minimize credential leaks.",
    example: "-- SQL Injection Prevention (Using placeholders instead of string joining)\nSELECT * FROM Students WHERE id = ?; -- Secure\n-- Vulnerable: \"SELECT * FROM Students WHERE id = \" + inputStr;"
  }
];

export const DBMS_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is a Database Management System (DBMS)?",
    options: [
      "Operating system designed to boot up network servers",
      "Software system used to store, manage, and retrieve database records",
      "Programming language designed exclusively for visual design",
      "Physical storage controller built into SSD devices"
    ],
    correctAnswer: 1,
    explanation: "A DBMS is software used to manage databases. It facilitates inserting, editing, deleting, organizing, and querying collections of data."
  },
  {
    id: 2,
    question: "Which of the following SQL command categories defines and modifies table structures?",
    options: [
      "DML (Data Manipulation Language)",
      "DCL (Data Control Language)",
      "DDL (Data Definition Language)",
      "TCL (Transaction Control Language)"
    ],
    correctAnswer: 2,
    explanation: "DDL commands like CREATE, ALTER, and DROP define, restructure, or remove tables and indexes. DML handles row manipulation."
  },
  {
    id: 3,
    question: "A Primary Key in a relation represents which of the following constraints?",
    options: [
      "Unique value and NOT NULL (never empty)",
      "Optionally empty with duplicate keys permitted",
      "A foreign key pointing exclusively to secondary files",
      "An index reserved only for Boolean variables"
    ],
    correctAnswer: 0,
    explanation: "A Primary Key uniquely identifies each row in a table. It cannot contain duplicate values and must never contain NULL values."
  },
  {
    id: 4,
    question: "What transaction property does 'Atomicity' in ACID specify?",
    options: [
      "Changes must be distributed horizontally on servers",
      "Transactions occur at atomic nanosecond Speeds",
      "All operations in a transaction succeed, or all fail completely ('All or Nothing')",
      "Concurrently running queries do not interfere with each other"
    ],
    correctAnswer: 2,
    explanation: "Atomicity ensures that if any part of a transaction fails, the entire transaction is aborted and rolled back, leaving the database state unaltered."
  },
  {
    id: 5,
    question: "In database normalization, BCNF is categorized as which of the following?",
    options: [
      "100% independent of Primary Keys",
      "A stronger, stricter form of 3rd Normal Form (3NF)",
      "A rule that allows duplicate multi-valued cells",
      "A method exclusively for file-system backups"
    ],
    correctAnswer: 1,
    explanation: "Boyce-Codd Normal Form (BCNF) is a stricter version of 3NF. It requires that for any functional dependency A ➔ B, A must be a super key."
  },
  {
    id: 6,
    question: "Which SQL clause is used to retrieve data that matches a specified pattern using wildcards?",
    options: [
      "WHERE value IN (...)",
      "WHERE name LIKE '%pattern%'",
      "GROUP BY",
      "ORDER BY"
    ],
    correctAnswer: 1,
    explanation: "The LIKE keyword, combined with wildcards like % (any string) and _ (single character), is used to perform pattern-matching searches in SQL."
  },
  {
    id: 7,
    question: "What is referential integrity?",
    options: [
      "Checking database block checksums upon startup",
      "Ensuring that a foreign key value always references an existing primary key value in the target table",
      "Encrypting student records to prevent credential theft",
      "Restricting administrative dashboards to role-based access"
    ],
    correctAnswer: 1,
    explanation: "Referential integrity maintains consistency between matched tables. It prevents orphan rows by ensuring foreign keys point to valid primary keys."
  },
  {
    id: 8,
    question: "In SQL, which commands are standard TC (Transaction Control) statements?",
    options: [
      "GRANT and REVOKE",
      "CREATE and DELETE",
      "COMMIT and ROLLBACK",
      "INSERT and UPDATE"
    ],
    correctAnswer: 2,
    explanation: "COMMIT saves the database modifications made in the active transaction, while ROLLBACK undoes them, returning the state to the last safe checkpoint."
  },
  {
    id: 9,
    question: "What is a 'Deadlock' state in DBMS concurrency?",
    options: [
      "When a power supply failure ruins magnetic disk storage",
      "An index update crashing the database thread",
      "A mutual circular lock where two transactions wait indefinitely for locks held by each other",
      "When a physical connection disconnects during a CSV export"
    ],
    correctAnswer: 2,
    explanation: "A deadlock occurs when Transaction T1 holds lock L1 and waits for L2 (held by T2), while T2 waits for L1. Neither T1 nor T2 can proceed."
  },
  {
    id: 10,
    question: "Which schema layer in Three-Schema Architecture controls physical disk storage formatting?",
    options: [
      "External Schema (User Views)",
      "Internal Schema (Physical representation)",
      "Conceptual Schema (Logical tables)",
      "TCL Control Schema"
    ],
    correctAnswer: 1,
    explanation: "The Internal Schema describes how data is stored on disk (block layout, index definitions, and file systems), allowing physical data independence."
  }
];
