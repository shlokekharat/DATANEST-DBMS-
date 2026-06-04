import { motion } from 'motion/react';
import { Clock, Key, ShieldAlert, BadgePlus, RefreshCw, Database } from 'lucide-react';
import { ActivityLog } from '../types';

interface ActivityLogsViewProps {
  logs: ActivityLog[];
  onTriggerBackup: () => void;
  onClearLogs: () => void;
}

export default function ActivityLogsView({ logs, onTriggerBackup, onClearLogs }: ActivityLogsViewProps) {
  
  // Maps icon and color depending on type
  const getLogIcon = (type: string) => {
    switch (type) {
      case 'add':
        return <BadgePlus className="w-4 h-4 text-emerald-500" />;
      case 'update':
        return <RefreshCw className="w-4 h-4 text-indigo-500 border-indigo-200" />;
      case 'delete':
        return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case 'backup':
      default:
        return <Database className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <section id="activity-log" className="py-24 relative bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-950/60">
      <div className="container mx-auto px-6">
        
        {/* Module Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-sm font-mono tracking-wider uppercase text-blue-600 dark:text-blue-400 font-bold">
            Write-Ahead Logs (WAL)
          </h2>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white mt-1">
            System Activity Log
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-650 dark:text-gray-300 mt-4 text-base font-sans">
            Auditing records modifications. Relational commits are cached instantly to protect structural consistency against hardware faults.
          </p>
        </div>

        {/* Outer Shell Split: Left Timeline logs, Right Specified "Recent Updates Panel" */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Active Dynamic Timeline Logs */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-850/60 mb-5 text-xs font-mono font-bold">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span>Real-Time Audit Streams</span>
                </span>
                
                <div className="flex items-center space-x-2">
                  <button
                    id="log-clear-btn"
                    onClick={onClearLogs}
                    className="p-1 px-2 bg-gray-50 hover:bg-gray-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-gray-150 dark:border-slate-800 text-[10px] text-gray-500 text-right rounded-lg cursor-pointer"
                  >
                    Clear History
                  </button>
                </div>
              </div>

              {/* Vertical timeline feed list */}
              <div className="space-y-6 relative pl-4 text-left border-l border-gray-150 dark:border-slate-800/80">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <div key={log.id} className="relative group">
                      
                      {/* Timeline dot */}
                      <span className="absolute -left-6.5 top-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-center p-0.5 shadow-md">
                        {getLogIcon(log.type)}
                      </span>

                      {/* Log details content */}
                      <div>
                        <span className="text-[10px] font-mono text-gray-400 font-semibold">{log.timestamp}</span>
                        <p className="text-sm font-sans font-bold text-gray-850 dark:text-slate-200 mt-0.5 select-all">{log.message}</p>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400 font-mono text-xs flex flex-col items-center justify-center space-y-1">
                    <span>Audit trace is currently clean.</span>
                    <span className="text-[10px] font-sans max-w-xs text-gray-400">Perform addition, updates on student database records to record transactions.</span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Panel: Requested literal Recent Updates Panel */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="glass-panel p-6 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-sm bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between">
              
              {/* Cover glowing effect */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full filter blur-xl pointer-events-none" />

              <div>
                <h3 className="text-sm font-mono font-bold uppercase text-indigo-400 tracking-wider mb-5 flex items-center space-x-2">
                  <Database className="w-4 h-4 text-indigo-500 animate-pulse" />
                  <span>Recent Updates (Static Log File)</span>
                </h3>

                {/* Literal updates specification block */}
                <div className="space-y-3 font-mono text-xs">
                  
                  {/* Notification 1 */}
                  <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-center space-x-3 hover:border-slate-700 duration-200">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <h5 className="font-bold text-slate-200">New Student Added</h5>
                      <span className="text-[10px] text-slate-500">Log Type: Transaction Commit</span>
                    </div>
                  </div>

                  {/* Notification 2 */}
                  <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-center space-x-3 hover:border-slate-700 duration-200">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <div>
                      <h5 className="font-bold text-slate-200">Computer & IoT Department Updated</h5>
                      <span className="text-[10px] text-slate-500">Target Segment: engineering_cluster_1</span>
                    </div>
                  </div>

                  {/* Notification 3 */}
                  <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-center space-x-3 hover:border-slate-700 duration-200">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    <div>
                      <h5 className="font-bold text-slate-200">Record Updated Successfully</h5>
                      <span className="text-[10px] text-slate-500">Integrity: Verified constraints check</span>
                    </div>
                  </div>

                  {/* Notification 4 */}
                  <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-center space-x-3 hover:border-slate-700 duration-200">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <h5 className="font-bold text-slate-200">Database Backup Completed</h5>
                      <span className="text-[10px] text-slate-500">Snapshot File: schema_wal_2026.bak</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Force snapshot button */}
              <button
                onClick={onTriggerBackup}
                className="mt-6 w-full p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 active:scale-97 duration-150 rounded-xl text-xs font-semibold text-center text-white cursor-pointer"
              >
                Perform Snapshot Checkpoint
              </button>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
