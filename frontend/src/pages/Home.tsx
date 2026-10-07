import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Chat from './Chat';
import { API_BASE_URL } from '../config';
import { 
  User, 
  Trash2, 
  Plus, 
  TrendingUp, 
  FileText, 
  LogOut, 
  History,
  Menu,
  X
} from 'lucide-react';
import type { ResearchReport } from '../types';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [history, setHistory] = useState<ResearchReport[]>([]);
  const [activeReport, setActiveReport] = useState<ResearchReport | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [user,setUser] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchHistory(token);
    }
  }, []);

  const fetchHistory = async (customToken?: string) => {
    const token = customToken || localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHistory(response.data.data || []);
      if (response.data.username) {
        setUser(response.data.username);
      }
    } catch (err: unknown) {
      console.error("Error fetching history:", err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm("Are you sure you want to delete this research report?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${API_BASE_URL}/history/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // If the deleted report is currently opened, clear it
      if (activeReport?._id === reportId) {
        setActiveReport(null);
      }
      
      // Refresh the list
      fetchHistory(token);
    } catch (err: unknown) {
      console.error("Error deleting report:", err);
      alert(axios.isAxiosError(err) ? err.response?.data?.message || "Failed to delete report." : "Failed to delete report.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setHistory([]);
    setActiveReport(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f3f7f5] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white sticky top-0 z-50 border-b border-[#dce6e2] shadow-sm shadow-[#102b35]/[.04]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c5f36a] flex items-center justify-center shadow-sm">
              <TrendingUp className="w-4.5 h-4.5 text-[#102b35]" strokeWidth={2.5} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#102b35]">Stockly<span className="text-[#00a96b]">.</span></span>

            </div>
          </div>

          <div className="flex items-center gap-4">
          
            
            <div className="hidden items-center gap-3 md:flex">
              {/* Notification Mock */}
             

              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#eef7f1] border border-[#d4e9db] rounded-lg">
                    <User className="w-3.5 h-3.5 text-[#087a4f]" /> 
                    <span className="text-xs font-semibold text-[#102b35]">{user || "Analyst"}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#61756e] hover:text-red-700 border border-[#dce6e2] hover:border-red-200 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-1.5 text-xs font-semibold text-[#61756e] hover:text-[#102b35] transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#087a4f] hover:bg-[#066640] rounded-lg transition duration-200 shadow-sm"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#dce6e2] text-[#102b35] transition hover:bg-[#f3f7f5] md:hidden"
              aria-label={mobileMenuOpen ? 'Close dashboard menu' : 'Open dashboard menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="dashboard-mobile-menu"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav id="dashboard-mobile-menu" className="border-t border-[#e5eee9] bg-white px-5 py-3 shadow-lg shadow-[#102b35]/[.06] md:hidden" aria-label="Dashboard mobile navigation">
            <div className="mx-auto flex max-w-7xl flex-col">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-[#526a60] hover:bg-[#f5f9f6]">Stockly home</Link>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="rounded-lg bg-[#edf8f1] px-3 py-3 text-sm font-semibold text-[#087a4f]">Research desk</Link>
              {isLoggedIn ? (
                <div className="mt-2 flex items-center justify-between border-t border-[#e5eee9] px-3 pt-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-[#526a60]"><User size={15} className="text-[#087a4f]" />{user || 'Analyst'}</span>
                  <button type="button" onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-[#a84232] hover:bg-[#fff0ed]"><LogOut size={15}/>Sign out</button>
                </div>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#e5eee9] pt-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center justify-center rounded-lg border border-[#dce6e2] px-4 text-sm font-semibold text-[#24463b]">Sign in</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex min-h-11 items-center justify-center rounded-lg bg-[#087a4f] px-4 text-sm font-bold text-white">Create account</Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Welcome Banner */}
      <div className="max-w-7xl w-full mx-auto px-5 pt-6 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-[#d6e7dc] bg-[#e8f3eb] px-6 py-7 text-[#102b35] shadow-sm sm:px-8 sm:py-8">
          <div className="market-glow absolute inset-0 opacity-35" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#b8ddc8] bg-white/70 px-3 py-1.5 text-[10px] font-extrabold tracking-[.16em] text-[#087a4f]"><TrendingUp size={13}/> MARKET RESEARCH WORKSPACE</span>
              <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{isLoggedIn ? `Welcome back${user ? `, ${user}` : ''}` : "Your next company deep dive starts here"}</h1>
              <p className="mt-2 text-sm leading-6 text-[#61756e]">{isLoggedIn ? "Pick up a saved report or start a fresh company analysis." : "Analyze companies with market data, recent catalysts, and structured research."}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 md:min-w-[390px]">
              {[['01','MARKET DATA'],['02','NEWS CONTEXT'],['03','AI MEMO']].map(([n,label])=><div key={label} className="rounded-xl border border-white bg-white/80 px-3 py-3 shadow-sm"><p className="text-xs font-bold text-[#087a4f]">{n}</p><p className="mt-2 text-[9px] font-bold tracking-wider text-[#61756e] sm:text-[10px]">{label}</p></div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row gap-6 p-6">
        
        {/* Left Sidebar - History List (only visible for logged-in users) */}
        {isLoggedIn && (
          <aside className="w-full md:w-80 bg-white rounded-2xl border border-[#dce6e2] p-5 flex flex-col shadow-[0_8px_30px_rgba(16,43,53,0.06)] md:sticky md:top-24 h-fit">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#e5eee9]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#087a4f]" />
                <h2 className="font-bold text-[#102b35] text-sm">Research Logs</h2>
              </div>
              <span className="text-xs bg-[#edf8f1] text-[#087a4f] font-bold px-2 py-0.5 rounded-full border border-[#d5eddf]">
                {history.length}
              </span>
            </div>

            <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[300px] md:max-h-[500px] pr-1">
              {history.length > 0 ? (
                history.map((report) => (
                  <div
                    key={report._id}
                    onClick={() => setActiveReport(report)}
                    className={`w-full text-left p-3 rounded-xl border transition duration-150 flex items-center justify-between gap-3 cursor-pointer group ${
                      activeReport?._id === report._id
                        ? 'border-[#d5eddf] bg-[#edf8f1] text-[#102b35]'
                        : 'border-transparent hover:bg-[#f5f9f6] text-[#71847d]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <FileText className="w-4 h-4 mt-0.5 shrink-0 text-[#66927a]" />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs text-[#102b35] truncate">
                          {report.companyName}
                        </div>
                        <div className="text-[10px] text-[#6B7280] mt-0.5 font-medium">
                          {report.ticker} • {report.decision} • {report.listingStatus === 'UNLISTED' ? 'UNLISTED' : report.listingStatus === 'LISTED' || (!report.listingStatus && report.ticker !== 'UNKNOWN') ? 'LISTED' : 'UNVERIFIED'} • {report.confidenceScore}/10
                        </div>
                      </div>
                    </div>
                    {/* Delete button, visible on hover */}
                    <button
                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation(); // Prevent opening the report
                        handleDeleteReport(report._id || '');
                      }}
                      className="text-[#82958e] hover:text-[#bc4935] p-1 rounded hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                      title="Delete log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#6B7280] text-xs">No research history yet.</p>
                  <p className="text-[10px] text-[#6B7280] mt-1">Submit your first search query!</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#e5eee9]">
              <button
                onClick={() => setActiveReport(null)}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-[#087a4f] hover:bg-[#edf8f1] border border-[#cfe4d6] rounded-xl transition duration-150 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Analysis</span>
              </button>
            </div>
          </aside>
        )}

        {/* Right Main Panel - Search and Reports */}
        <main className="flex-1 min-w-0">
          <Chat 
            activeReport={activeReport} 
            onSearchInitiated={() => setActiveReport(null)}
            onNewResearchCompleted={() => fetchHistory()} 
          />
        </main>

      </div>
    </div>
  );
}
