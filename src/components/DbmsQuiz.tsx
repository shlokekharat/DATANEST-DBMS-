import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Award, Trophy, ArrowRight, RotateCcw, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { DBMS_QUIZ_QUESTIONS } from '../data/dbmsContent';

export default function DbmsQuiz() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [answersLog, setAnswersLog] = useState<{ questionId: number; selectedAnswer: number; isCorrect: boolean }[]>([]);

  const handleOptionSelect = (optionIdx: number) => {
    if (isSubmitted) return; // Prevent changing after clicking submit
    setSelectedOpt(optionIdx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isSubmitted) return;
    
    const currentQuestion = DBMS_QUIZ_QUESTIONS[currentIdx];
    const isCorrect = selectedOpt === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setAnswersLog(prev => [...prev, {
      questionId: currentQuestion.id,
      selectedAnswer: selectedOpt,
      isCorrect
    }]);

    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < DBMS_QUIZ_QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setAnswersLog([]);
  };

  const currentQ = DBMS_QUIZ_QUESTIONS[currentIdx];

  // Determine Grade based on score
  const getGradeExplanation = (scoreValue: number) => {
    const percentage = (scoreValue / DBMS_QUIZ_QUESTIONS.length) * 100;
    if (percentage >= 90) return { title: "S-Tier Database Admin", desc: "Superb! You demonstrated near-perfect mastery in schemas, ACID commits, and constraints.", color: "text-emerald-500" };
    if (percentage >= 70) return { title: "A-Tier Relational Analyst", desc: "Well done! You have a solid grasp of DBMS structures and normalization rules.", color: "text-blue-500" };
    if (percentage >= 50) return { title: "B-Tier Practitioner", desc: "Good try! Revise key-mapping and transactional isolation scopes to reach expert levels.", color: "text-yellow-500" };
    return { title: "Junior DB Intern", desc: "Keep studying! Consult the DBMS Learning Hub modules above for thorough revisions.", color: "text-red-500" };
  };

  const gradeInfo = getGradeExplanation(score);

  return (
    <section id="quiz" className="py-24 relative bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-950">
      <div className="container mx-auto px-6">
        
        {/* Title and Badge */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-sm font-mono tracking-wider uppercase text-emerald-600 dark:text-emerald-400 font-bold">
            Knowledge Check
          </h2>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white mt-1">
            DBMS Interactive Quiz
          </h1>
          <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-650 dark:text-gray-300 mt-4 text-base font-sans">
            Ready to test your academic foundation? Solve 10 multiple-choice questions on primary keys, ACID formulas, SQL statements, and normalizations.
          </p>
        </div>

        {/* Dynamic Quiz Card */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!quizFinished ? (
              <motion.div
                key={currentIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-150 dark:border-slate-800 shadow-md bg-white/70 dark:bg-slate-900/40 relative flex flex-col min-h-[480px]"
              >
                {/* Progress bar state */}
                <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full mb-6 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / DBMS_QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>

                {/* Score Tracker Header */}
                <div className="flex justify-between items-center mb-6 text-xs font-mono">
                  <span className="font-bold text-gray-400">
                    QUESTION {currentIdx + 1} OF {DBMS_QUIZ_QUESTIONS.length}
                  </span>
                  <span className="font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/60">
                    SCORE: {score} Pts
                  </span>
                </div>

                {/* Question Body */}
                <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white leading-relaxed mb-6">
                  {currentQ.question}
                </h3>

                {/* Options list */}
                <div className="space-y-3.5 mb-6">
                  {currentQ.options.map((opt, oIdx) => {
                    // Decide background coloring states
                    let bgStyle = "bg-gray-50/70 hover:bg-gray-100/80 dark:bg-slate-950/40 dark:hover:bg-slate-900/45 border-gray-200 dark:border-slate-800";
                    let prefixIcon = <span className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-slate-820 flex items-center justify-center font-mono font-bold text-[11px] text-gray-500 dark:text-slate-400 shrink-0">{String.fromCharCode(65 + oIdx)}</span>;

                    if (selectedOpt === oIdx) {
                      bgStyle = "bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300 ring-2 ring-indigo-400/20";
                    }

                    if (isSubmitted) {
                      if (oIdx === currentQ.correctAnswer) {
                        bgStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-400/20";
                        prefixIcon = <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
                      } else if (selectedOpt === oIdx) {
                        bgStyle = "bg-red-50 border-red-500 text-red-900 dark:bg-red-950/50 dark:border-red-800 dark:text-red-300 ring-2 ring-red-400/20";
                        prefixIcon = <XCircle className="w-5 h-5 text-red-500 shrink-0" />;
                      } else {
                        bgStyle = "bg-gray-50/50 dark:bg-slate-950/20 border-gray-150 dark:border-slate-850 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        id={`quiz-option-${oIdx}`}
                        disabled={isSubmitted}
                        onClick={() => handleOptionSelect(oIdx)}
                        className={`w-full p-4 rounded-2xl border text-left text-sm font-sans flex items-center space-x-3.5 transition-all duration-200 ${bgStyle} ${!isSubmitted ? 'cursor-pointer' : ''}`}
                      >
                        {prefixIcon}
                        <span className="font-semibold">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Question Explanation Card */}
                {isSubmitted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 text-xs text-gray-700 dark:text-indigo-200 font-sans leading-relaxed mb-6"
                  >
                    <div className="font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400 mb-1.5 flex items-center space-x-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Academic Concept Solution:</span>
                    </div>
                    {currentQ.explanation}
                  </motion.div>
                )}

                {/* Bottom Action Controls */}
                <div className="mt-auto flex justify-end">
                  {!isSubmitted ? (
                    <button
                      id="quiz-submit-btn"
                      disabled={selectedOpt === null}
                      onClick={handleSubmitAnswer}
                      className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-xl hover:shadow-emerald-500/10 active:scale-97 disabled:opacity-40 select-none transition flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Check Answer</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      id="quiz-next-btn"
                      onClick={handleNextQuestion}
                      className="px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl text-sm hover:bg-slate-800 dark:hover:bg-gray-100 active:scale-97 select-none transition flex items-center space-x-2 cursor-pointer"
                    >
                      <span>{currentIdx + 1 === DBMS_QUIZ_QUESTIONS.length ? "Finish Quiz" : "Next Question"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </motion.div>
            ) : (
              /* Scoring Report Display Cards */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-3xl border border-gray-150 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-900/50 text-center flex flex-col items-center"
              >
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-5 border border-emerald-100 dark:border-emerald-900/60 shadow-lg">
                  <Trophy className="w-10 h-10 animate-bounce" />
                </div>

                <h2 className="text-2xl font-display font-black text-gray-900 dark:text-white">
                  Exam Result Declared!
                </h2>
                
                {/* Numeric circular representation */}
                <div className="my-6 relative flex items-center justify-center">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="48" className="stroke-slate-100 dark:stroke-slate-800 stroke-8" fill="transparent" />
                    <circle 
                      cx="56" 
                      cy="56" 
                      r="48" 
                      className="stroke-emerald-500 stroke-8 transition-all duration-1000" 
                      fill="transparent" 
                      strokeDasharray={2 * Math.PI * 48}
                      strokeDashoffset={2 * Math.PI * 48 * (1 - score / DBMS_QUIZ_QUESTIONS.length)}
                    />
                  </svg>
                  <div className="absolute flex flex-col">
                    <span className="text-2xl font-display font-black text-emerald-500">{score * 10}</span>
                    <span className="text-[10px] uppercase font-mono text-gray-400 -mt-1 font-bold">out of 100</span>
                  </div>
                </div>

                {/* Academic Evaluation Rating */}
                <div className="p-4.5 rounded-2xl bg-gray-50 dark:bg-slate-950/40 border border-gray-100 dark:border-slate-850/60 max-w-md mb-6 whitespace-pre-line">
                  <span className={`text-sm font-mono font-extrabold ${gradeInfo.color} uppercase block tracking-wider mb-1`}>
                    🛡️ {gradeInfo.title}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
                    {gradeInfo.desc}
                  </p>
                </div>

                {/* Quick Score Metrics list row */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8 text-center text-xs">
                  <div className="p-3 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/30 dark:border-emerald-900/20 rounded-xl">
                    <p className="font-mono text-gray-400">CORRECT ANSWERS</p>
                    <p className="text-base font-black text-emerald-500">{score} / 10</p>
                  </div>
                  <div className="p-3 bg-red-50/20 dark:bg-red-950/10 border border-red-100/30 dark:border-red-900/20 rounded-xl">
                    <p className="font-mono text-gray-400">INCORRECT</p>
                    <p className="text-base font-black text-red-500">{DBMS_QUIZ_QUESTIONS.length - score} / 10</p>
                  </div>
                </div>

                {/* Restart Quiz Button */}
                <button
                  id="quiz-restart-btn"
                  onClick={handleRestartQuiz}
                  className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-xl hover:shadow-blue-500/10 transition flex items-center space-x-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restart Practicing</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
