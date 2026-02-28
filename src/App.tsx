import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut, 
  User as UserIcon, 
  PlusCircle, 
  BarChart3,
  Stethoscope,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">MedQuest</span>
            </Link>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Dashboard</Link>
                <Link to="/quiz" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Start Quiz</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Admin</Link>
                )}
                <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                  <span className="text-sm text-slate-500">{user.email}</span>
                  <button 
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-600">Dashboard</Link>
                  <Link to="/quiz" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-600">Start Quiz</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-600">Admin</Link>
                  )}
                  <button onClick={logout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-600">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-emerald-600">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const LandingPage = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="text-center max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-emerald-700 uppercase bg-emerald-50 rounded-full">
          The Gold Standard for Medical Exams
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Master Your Membership Exams with <span className="text-emerald-600">Confidence</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
          Access thousands of high-yield clinical scenarios, basic science questions, and detailed explanations curated by specialists.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
            Start Free Trial
          </Link>
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl text-lg font-semibold hover:bg-slate-50 transition-all">
            View Sample Questions
          </Link>
        </div>
      </motion.div>
    </div>

    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { icon: BookOpen, title: "Clinical Scenarios", desc: "Real-world cases designed to test your diagnostic and management skills." },
        { icon: Clock, title: "Timed Practice", desc: "Simulate exam conditions with our sophisticated timing engine." },
        { icon: BarChart3, title: "Deep Analytics", desc: "Identify your weak areas with specialty-specific performance tracking." }
      ].map((feature, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
            <feature.icon className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
          <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const LoginPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Sign in to continue your preparation</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="doctor@hospital.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
            Sign In
          </button>
        </form>
        <p className="text-center mt-8 text-slate-500 text-sm">
          Don't have an account? <Link to="/register" className="text-emerald-600 font-semibold hover:underline">Register now</Link>
        </p>
      </motion.div>
    </div>
  );
};

const RegisterPage = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
          <p className="text-slate-500 mt-2">Join thousands of doctors today</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="doctor@hospital.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
            Get Started
          </button>
        </form>
        <p className="text-center mt-8 text-slate-500 text-sm">
          Already have an account? <Link to="/login" className="text-emerald-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/analytics', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setStats(data);
      setLoading(false);
    });
  }, [token]);

  const handleSubscribe = async () => {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      window.location.reload();
    }
  };

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  const scorePercentage = stats.total_attempts > 0 
    ? Math.round((stats.correct_attempts / stats.total_attempts) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome, Doctor</h1>
          <p className="text-slate-500">Track your progress and continue your studies.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/quiz')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Start New Quiz
          </button>
        </div>
      </div>

      {user?.subscription_status === 'inactive' && (
        <div className="mb-10 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="bg-amber-100 p-3 rounded-xl mr-4">
              <Settings className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900">Free Trial Active</h3>
              <p className="text-amber-700">Upgrade to Pro for unlimited access to all 5,000+ questions.</p>
            </div>
          </div>
          <button 
            onClick={handleSubscribe}
            className="px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all"
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Questions</p>
          <p className="text-3xl font-bold text-slate-900">{stats.total_questions}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Questions Answered</p>
          <p className="text-3xl font-bold text-slate-900">{stats.total_attempts}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Overall Accuracy</p>
          <p className="text-3xl font-bold text-emerald-600">{scorePercentage}%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Correct Answers</p>
          <p className="text-3xl font-bold text-slate-900">{stats.correct_attempts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
            Specialty Breakdown
          </h3>
          <div className="space-y-6">
            {stats.specialtyStats.length > 0 ? stats.specialtyStats.map((s: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-slate-700">{s.specialty}</span>
                  <span className="text-slate-500">{Math.round((s.correct / s.count) * 100)}% ({s.correct}/{s.count})</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.correct / s.count) * 100}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-center py-10 italic">No data yet. Start a quiz to see your breakdown.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <p className="text-sm text-slate-500 italic">Your recent quiz history will appear here.</p>
            {/* Placeholder for history */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-600 uppercase">Completed</span>
                <span className="text-xs text-slate-400">2 hours ago</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">Internal Medicine Quiz</p>
              <p className="text-xs text-slate-500">Score: 8/10 • 12 mins</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizPage = () => {
  const { token } = useAuth();
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [quizFinished, setQuizFinished] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/questions?limit=10', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setQuestions(data);
      setLoading(false);
    });
  }, [token]);

  const handleAnswer = async (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    const isCorrect = index === questions[currentIndex].correct_answer;
    if (isCorrect) setScore(s => s + 1);

    await fetch('/api/attempts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        question_id: questions[currentIndex].id,
        selected_answer: index,
        is_correct: isCorrect
      })
    });
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) return <div className="p-20 text-center">Preparing your quiz...</div>;
  if (questions.length === 0) return <div className="p-20 text-center">No questions found.</div>;

  if (quizFinished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Quiz Complete!</h2>
          <p className="text-xl text-slate-600 mb-10">You scored {score} out of {questions.length}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
            >
              Try Another Quiz
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
            {q.specialty}
          </span>
        </div>
        <div className="text-sm font-medium text-slate-500">
          Score: {score}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-relaxed mb-10">
          {q.scenario}
        </h2>

        <div className="space-y-4">
          {q.options.map((option: string, i: number) => {
            let stateClass = "border-slate-200 hover:border-emerald-500 hover:bg-emerald-50";
            if (isAnswered) {
              if (i === q.correct_answer) stateClass = "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500 ring-offset-2";
              else if (i === selectedAnswer) stateClass = "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500 ring-offset-2";
              else stateClass = "border-slate-100 opacity-50 grayscale";
            }

            return (
              <button
                key={i}
                disabled={isAnswered}
                onClick={() => handleAnswer(i)}
                className={cn(
                  "w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group",
                  stateClass
                )}
              >
                <span className="font-medium">{option}</span>
                {isAnswered && i === q.correct_answer && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {isAnswered && i === selectedAnswer && i !== q.correct_answer && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
              <h3 className="text-lg font-bold text-emerald-900 mb-3">Explanation</h3>
              <p className="text-emerald-800 leading-relaxed">{q.explanation}</p>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={nextQuestion}
                className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center"
              >
                {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminDashboard = () => {
  const { token } = useAuth();
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [showAdd, setShowAdd] = React.useState(false);
  const [newQ, setNewQ] = React.useState({
    scenario: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: '',
    specialty: 'Internal Medicine',
    format: 'clinical scenario'
  });

  const fetchQuestions = () => {
    fetch('/api/admin/questions', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setQuestions(data));
  };

  useEffect(() => {
    fetchQuestions();
  }, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newQ)
    });
    if (res.ok) {
      setShowAdd(false);
      setNewQ({
        scenario: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: '',
        specialty: 'Internal Medicine',
        format: 'clinical scenario'
      });
      fetchQuestions();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/questions/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchQuestions();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Question
        </button>
      </div>

      {showAdd && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl mb-10"
        >
          <form onSubmit={handleAdd} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Scenario</label>
              <textarea 
                required
                value={newQ.scenario}
                onChange={e => setNewQ({...newQ, scenario: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 h-32"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newQ.options.map((opt, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Option {i + 1}</label>
                  <input 
                    required
                    value={opt}
                    onChange={e => {
                      const opts = [...newQ.options];
                      opts[i] = e.target.value;
                      setNewQ({...newQ, options: opts});
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Correct Answer (0-3)</label>
                <input 
                  type="number" min="0" max="3"
                  value={newQ.correct_answer}
                  onChange={e => setNewQ({...newQ, correct_answer: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Specialty</label>
                <select 
                  value={newQ.specialty}
                  onChange={e => setNewQ({...newQ, specialty: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Internal Medicine</option>
                  <option>Surgery</option>
                  <option>Pediatrics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Format</label>
                <select 
                  value={newQ.format}
                  onChange={e => setNewQ({...newQ, format: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>clinical scenario</option>
                  <option>basic sciences</option>
                  <option>general practice</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Explanation</label>
              <textarea 
                required
                value={newQ.explanation}
                onChange={e => setNewQ({...newQ, explanation: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 h-24"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button type="button" onClick={() => setShowAdd(false)} className="px-6 py-3 text-slate-600 font-bold">Cancel</button>
              <button type="submit" className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700">Save Question</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-slate-700">Scenario</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-700">Specialty</th>
              <th className="px-6 py-4 text-sm font-bold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {questions.map(q => (
              <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-900 line-clamp-2">{q.scenario}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold">{q.specialty}</span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleDelete(q.id)}
                    className="text-red-500 hover:text-red-700 font-bold text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main App ---

const PrivateRoute: React.FC<{ children: React.ReactNode, adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="p-20 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/quiz" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </main>
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Stethoscope className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-bold text-white">MedQuest</span>
          </div>
          <p className="text-sm">© 2026 MedQuest Education. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6 text-xs uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
