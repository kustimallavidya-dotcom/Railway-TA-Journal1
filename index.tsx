
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Settings, Printer, Plus, Trash2, Edit2, Train, 
  User, Home, Calendar, ArrowRight, X, Mail, ChevronLeft, Save
} from 'lucide-react';
import { ToWords } from 'to-words';
import { GoogleGenAI } from "@google/genai";

const toWords = new ToWords({ localeCode: 'en-IN', converterOptions: { currency: true } });

const SplashScreen = () => (
  <div className="fixed inset-0 bg-[#1e3a8a] z-[100] flex flex-col items-center justify-center text-white p-6">
    <div className="mb-10 scale-150">
       <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="40" width="80" height="40" rx="4" fill="#3b82f6" />
          <rect x="100" y="30" width="90" height="50" rx="4" fill="#3b82f6" />
          <rect x="15" y="45" width="15" height="15" fill="#93c5fd" />
          <rect x="40" y="45" width="15" height="15" fill="#93c5fd" />
          <rect x="65" y="45" width="15" height="15" fill="#93c5fd" />
          <circle cx="30" cy="85" r="8" fill="#475569" />
          <circle cx="70" cy="85" r="8" fill="#475569" />
          <circle cx="120" cy="85" r="10" fill="#475569" />
          <circle cx="150" cy="85" r="10" fill="#475569" />
          <circle cx="180" cy="85" r="10" fill="#475569" />
          <rect x="100" y="45" width="80" height="10" fill="#fbbf24" />
          <rect x="175" y="40" width="15" height="25" rx="2" fill="#ef4444" />
       </svg>
    </div>
    <h1 className="text-4xl font-bold mb-2">Railway TA Journal</h1>
    <p className="text-blue-200 text-lg">Simplify Your Journey Claims</p>
    <div className="absolute bottom-10 text-center">
      <p className="text-xs opacity-60">Developed by</p>
      <p className="text-lg font-medium">Milind Manugade</p>
    </div>
  </div>
);

const ProfileSetup = ({ profile, onSave, onCancel }: { profile: any, onSave: (p: any) => void, onCancel: () => void }) => {
  const [temp, setTemp] = useState(profile || { name: '', designation: '', headquarters: '', basicPay: '', payLevel: '', pfNumber: '', branch: '', division: '', dailyRate: '500' });
  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8">Setup Profile</h2>
      <div className="space-y-6">
        <div>
          <label className="input-label">Full Name</label>
          <input className="input-field" placeholder="E.G. MILIND D. MANUGADE" value={temp.name} onChange={e=>setTemp({...temp, name: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Designation</label>
            <input className="input-field" placeholder="PMA/SS" value={temp.designation} onChange={e=>setTemp({...temp, designation: e.target.value})} />
          </div>
          <div>
            <label className="input-label">Station</label>
            <input className="input-field" placeholder="KARAD" value={temp.headquarters} onChange={e=>setTemp({...temp, headquarters: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">Pay (Rs)</label>
            <input className="input-field" placeholder="24500" value={temp.basicPay} onChange={e=>setTemp({...temp, basicPay: e.target.value})} />
          </div>
          <div>
            <label className="input-label">Level</label>
            <input className="input-field" placeholder="LEVEL - 2" value={temp.payLevel} onChange={e=>setTemp({...temp, payLevel: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="input-label">P.F. Number</label>
          <input className="input-field" placeholder="Enter P.F. Number" value={temp.pfNumber} onChange={e=>setTemp({...temp, pfNumber: e.target.value})} />
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl grid grid-cols-3 gap-2">
          <div><label className="text-[10px] font-bold text-gray-400 uppercase">Branch</label>
          <input className="w-full bg-transparent font-bold border-none p-0 outline-none" value={temp.branch} onChange={e=>setTemp({...temp, branch: e.target.value})} /></div>
          <div><label className="text-[10px] font-bold text-gray-400 uppercase">Division</label>
          <input className="w-full bg-transparent font-bold border-none p-0 outline-none" value={temp.division} onChange={e=>setTemp({...temp, division: e.target.value})} /></div>
          <div><label className="text-[10px] font-bold text-gray-400 uppercase">HQ</label>
          <input className="w-full bg-transparent font-bold border-none p-0 outline-none" value={temp.headquarters} onChange={e=>setTemp({...temp, headquarters: e.target.value})} /></div>
        </div>
        <button onClick={()=>onSave(temp)} className="w-full py-4 btn-primary text-xl mt-4 shadow-lg">Save Profile</button>
        <button onClick={onCancel} className="w-full py-2 text-gray-500 font-medium">Cancel</button>
      </div>
    </div>
  );
};

const EntryModal = ({ isOpen, onClose, onSave, userProfile, editEntry }: any) => {
  const [entry, setEntry] = useState<any>({ date: '', trainNo: '', depStation: '', depTime: '', arrStation: '', arrTime: '', distance: '', percentClaimed: '100', rate: userProfile.dailyRate, purpose: 'OFFICIAL DUTY', pvtDist: '', refItem: '' });
  
  useEffect(() => {
    if(editEntry) setEntry(editEntry);
    else setEntry((prev: any) => ({ ...prev, date: new Date().toISOString().split('T')[0], rate: userProfile.dailyRate || '500' }));
  }, [editEntry, isOpen, userProfile]);

  if(!isOpen) return null;

  const handleSave = () => {
    const amount = Math.round(parseFloat(entry.rate || 0) * (entry.percentClaimed === '100' ? 1 : entry.percentClaimed === '70' ? 0.7 : entry.percentClaimed === '30' ? 0.3 : 0));
    onSave({...entry, amount: amount.toString(), id: editEntry?.id || Date.now().toString()});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end">
      <div className="bg-white rounded-t-[32px] p-6 pb-10 h-[92vh] overflow-y-auto animate-fade-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Fill Daily TA Details</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full"><ChevronLeft /></button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-bold text-slate-400">DD-MM</label>
            <input type="date" className="input-field uppercase" value={entry.date} onChange={e=>setEntry({...entry, date:e.target.value})} /></div>
            <div><label className="text-[10px] font-bold text-slate-400">TRAIN NO</label>
            <input className="input-field" placeholder="12345" value={entry.trainNo} onChange={e=>setEntry({...entry, trainNo:e.target.value})} /></div>
          </div>
          <div className="p-4 border rounded-2xl grid grid-cols-2 gap-4 relative">
            <div><label className="text-[10px] font-bold text-slate-400">FROM</label>
            <input className="w-full text-lg font-bold p-0 border-none outline-none" placeholder="STN" value={entry.depStation} onChange={e=>setEntry({...entry, depStation:e.target.value})} />
            <input type="time" className="w-full text-sm p-0 border-none outline-none" value={entry.depTime} onChange={e=>setEntry({...entry, depTime:e.target.value})} /></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300"><ArrowRight /></div>
            <div className="text-right"><label className="text-[10px] font-bold text-slate-400">TO</label>
            <input className="w-full text-lg font-bold p-0 border-none outline-none text-right" placeholder="STN" value={entry.arrStation} onChange={e=>setEntry({...entry, arrStation:e.target.value})} />
            <input type="time" className="w-full text-sm p-0 border-none outline-none text-right" value={entry.arrTime} onChange={e=>setEntry({...entry, arrTime:e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-[10px] font-bold text-slate-400">KMS</label>
            <input className="input-field" value={entry.distance} onChange={e=>setEntry({...entry, distance:e.target.value})} /></div>
            <div><label className="text-[10px] font-bold text-slate-400">DAY/NIGHT %</label>
            <select className="input-field appearance-none bg-white" value={entry.percentClaimed} onChange={e=>setEntry({...entry, percentClaimed:e.target.value})}>
              <option value="100">100%</option><option value="70">70%</option><option value="30">30%</option><option value="Nil">Nil</option>
            </select></div>
            <div><label className="text-[10px] font-bold text-slate-400">RATE</label>
            <input className="input-field" value={entry.rate} onChange={e=>setEntry({...entry, rate:e.target.value})} /></div>
          </div>
          <div><label className="text-[10px] font-bold text-slate-400 uppercase">Purpose</label>
          <input className="input-field font-mono uppercase" value={entry.purpose} onChange={e=>setEntry({...entry, purpose:e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
             <div><label className="text-[10px] font-bold text-slate-400 uppercase">PVT DIST (COL 11)</label>
             <input className="input-field text-xs" placeholder="LEAVE BLANK IF NIL" value={entry.pvtDist} onChange={e=>setEntry({...entry, pvtDist:e.target.value})} /></div>
             <div><label className="text-[10px] font-bold text-slate-400 uppercase">REF ITEM 20 (COL 12)</label>
             <input className="input-field text-xs" placeholder="LEAVE BLANK IF NIL" value={entry.refItem} onChange={e=>setEntry({...entry, refItem:e.target.value})} /></div>
          </div>
          <button onClick={handleSave} className="w-full py-4 btn-primary text-xl flex items-center justify-center gap-2 mt-4"><Save size={24}/> Done</button>
        </div>
      </div>
    </div>
  );
};

const PrintView = ({ profile, entries, month, year }: any) => {
  const rows = [...entries];
  const PAGE_MAX = 13;
  const total = rows.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  return (
    <div className="print-only hidden text-black bg-white p-4">
      <div className="flex justify-between text-[10px] font-bold">
        <span>मध्य रेल / CENTRAL RAILWAY</span>
        <span>GA 31 SRC/G 1677</span>
      </div>
      <h1 className="text-center text-lg font-bold underline my-2">TRAVELLING ALLOWANCE JOURNAL</h1>
      <div className="grid grid-cols-3 text-[10px] gap-2 mb-2">
         <div>Branch: <span className="dotted-line w-full">{profile.branch}</span></div>
         <div>Division: <span className="dotted-line w-full">{profile.division}</span></div>
         <div>HQ: <span className="dotted-line w-full">{profile.headquarters}</span></div>
      </div>
      <div className="text-[10px] mb-2">
        Journal of duties by <span className="dotted-line font-bold px-2">{profile.name}</span> for <span className="dotted-line font-bold px-2">{month} {year}</span>
      </div>
      <table className="ta-table w-full border-collapse border border-black">
        <thead>
          <tr>
            <th>Date</th><th>Train</th><th>Dep</th><th>Arr</th><th>From</th><th>To</th><th>Kms</th><th>%</th><th>Purpose</th><th>Amt</th><th>Col11</th><th>Col12</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(e => (
            <tr key={e.id} className="text-center h-6">
              <td>{e.date.split('-').reverse().slice(0,2).join('-')}</td><td>{e.trainNo}</td><td>{e.depTime}</td><td>{e.arrTime}</td>
              <td className="uppercase">{e.depStation}</td><td className="uppercase">{e.arrStation}</td><td>{e.distance}</td><td>{e.percentClaimed}</td>
              <td className="text-left px-1 text-[8px]">{e.purpose}</td><td>{e.amount}</td><td>{e.pvtDist}</td><td>{e.refItem}</td>
            </tr>
          ))}
          {Array.from({length: Math.max(0, PAGE_MAX - rows.length)}).map((_,i) => <tr key={i} className="h-6"><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>)}
          <tr className="font-bold h-6">
            <td colSpan={9} className="text-right pr-2">Total Amount (₹):</td>
            <td>{total}</td><td></td><td></td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 text-[10px]">
        Rupees in words: <span className="font-bold border-b border-dotted border-black">{total > 0 ? toWords.convert(total) : 'NIL'}</span>
      </div>
      <div className="grid grid-cols-2 mt-10 text-[10px]">
         <div className="text-center"><div className="h-8"></div><div className="border-t border-black pt-1 font-bold">Controlling Officer</div></div>
         <div className="text-center"><div>{profile.name}</div><div className="border-t border-black pt-1 font-bold">Signature of Claimant</div></div>
      </div>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState('splash');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [modal, setModal] = useState({ open: false, edit: null });
  const [monthModal, setMonthModal] = useState(false);
  const [monthYear, setMonthYear] = useState({ month: 'December', year: '2025' });

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem('rta_p') || '[]');
    const a = localStorage.getItem('rta_a');
    const e = JSON.parse(localStorage.getItem('rta_e') || '[]');
    setProfiles(p); setActiveId(a); setEntries(e);
    setTimeout(() => {
      if(p.length > 0) setView('home');
      else setView('profile');
    }, 2000);
  }, []);

  const saveProfile = (p: any) => {
    const id = p.id || Date.now().toString();
    const newList = p.id ? profiles.map(x => x.id === id ? p : x) : [...profiles, { ...p, id }];
    setProfiles(newList); setActiveId(id);
    localStorage.setItem('rta_p', JSON.stringify(newList));
    localStorage.setItem('rta_a', id);
    setView('home');
  };

  const currentProfile = profiles.find(p => p.id === activeId) || profiles[0] || {};
  const filteredEntries = entries.filter(e => {
      const d = new Date(e.date);
      return d.toLocaleString('default', {month:'long'}) === monthYear.month && d.getFullYear().toString() === monthYear.year;
  });

  if(view === 'splash') return <SplashScreen />;
  if(view === 'profile') return <ProfileSetup profile={currentProfile} onSave={saveProfile} onCancel={() => setView('home')} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-lg mx-auto border-x shadow-xl relative pb-32">
      <header className="p-6 bg-white flex justify-between items-center no-print sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl uppercase">
             {currentProfile.name?.charAt(0) || 'M'}
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Welcome</p>
            <div className="flex items-center gap-1">
              <h1 className="font-bold text-lg text-[#1e3a8a] truncate max-w-[120px]">{currentProfile.name || 'Guest'}</h1>
              <button onClick={() => setView('profile')}><Settings size={14} className="text-slate-300" /></button>
            </div>
          </div>
        </div>
        <button onClick={() => window.print()} className="p-3 bg-blue-50 text-blue-600 rounded-2xl font-bold flex items-center gap-2 text-sm shadow-sm active:scale-95 transition-all">
          <Printer size={18}/> Submit & Print
        </button>
      </header>

      <main className="flex-grow p-6 no-print overflow-y-auto">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs mb-6">
          <Home size={16} /> <span className="uppercase tracking-widest">My Journals History</span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-10 text-center animate-fade-up">
             <div className="mb-4 opacity-10 flex justify-center"><Printer size={80} /></div>
             <p className="text-slate-400 font-bold">No TA journals yet. Create one!</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-up">
            <div className="bg-white p-4 rounded-3xl border flex justify-between items-center shadow-sm">
              <div>
                <h3 className="font-bold text-[#1e3a8a]">{monthYear.month} {monthYear.year}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{filteredEntries.length} Records found</p>
              </div>
              <button onClick={() => setMonthModal(true)} className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Calendar size={20}/></button>
            </div>
            {filteredEntries.map(e => (
              <div key={e.id} className="bg-white p-4 rounded-3xl border flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex-grow">
                   <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">{new Date(e.date).toLocaleDateString()}</p>
                   <div className="flex items-center gap-2 font-bold text-[#1e3a8a]">
                      <span className="uppercase">{e.depStation}</span>
                      <ArrowRight size={14} className="text-slate-300"/>
                      <span className="uppercase">{e.arrStation}</span>
                   </div>
                 </div>
                 <div className="flex gap-1">
                   <button onClick={()=>setModal({open:true, edit:e})} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl"><Edit2 size={18}/></button>
                   <button onClick={()=>{if(confirm('Delete?')){const n=entries.filter(x=>x.id!==e.id); setEntries(n); localStorage.setItem('rta_e', JSON.stringify(n));}}} className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl"><Trash2 size={18}/></button>
                 </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 p-6 bg-blue-50/50 rounded-[32px] border border-blue-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
             <Mail />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Feedback & Support</p>
            <p className="text-sm font-bold text-[#1e3a8a]">Send suggestions to Developer</p>
          </div>
        </div>
        <p className="text-center text-slate-300 text-[10px] mt-8 font-bold uppercase tracking-widest mb-10">Developed by Milind Manugade</p>
      </main>

      <nav className="fixed bottom-0 w-full max-w-lg bg-white border-t p-4 flex justify-between items-center no-print shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)]">
         <button className={`nav-item flex flex-col items-center gap-1 ${view === 'home' ? 'text-blue-600' : 'text-slate-400'}`} onClick={() => setView('home')}>
           <Home size={24}/> <span className="text-[10px] font-bold">History</span>
         </button>
         <div className="relative">
            <button onClick={() => setMonthModal(true)} className="plus-btn active:scale-90 transition-all shadow-xl shadow-blue-200"><Plus size={36} /></button>
            <span className="mt-10 block text-[10px] font-bold text-blue-600">New Month</span>
         </div>
         <button className={`nav-item flex flex-col items-center gap-1 ${view === 'profile' ? 'text-blue-600' : 'text-slate-400'}`} onClick={() => setView('profile')}>
           <User size={24}/> <span className="text-[10px] font-bold">Profile</span>
         </button>
      </nav>

      {monthModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white w-full rounded-[32px] p-6 text-center animate-fade-up">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
               <Calendar size={32} />
            </div>
            <h3 className="text-2xl font-bold text-[#1e3a8a] mb-6">Select Month & Year</h3>
            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Month</label>
                <select className="input-field" value={monthYear.month} onChange={e=>setMonthYear({...monthYear, month:e.target.value})}>
                  {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Year</label>
                <select className="input-field" value={monthYear.year} onChange={e=>setMonthYear({...monthYear, year:e.target.value})}>
                  {['2024','2025','2026'].map(y=><option key={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={()=>setMonthModal(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-600">Cancel</button>
              <button onClick={()=>{setMonthModal(false); setModal({open:true, edit:null});}} className="flex-1 py-4 btn-primary shadow-lg shadow-blue-200">Create</button>
            </div>
          </div>
        </div>
      )}

      <EntryModal 
        isOpen={modal.open} 
        onClose={()=>setModal({open:false, edit:null})} 
        userProfile={currentProfile}
        editEntry={modal.edit}
        onSave={(e: any)=>{
          const n = modal.edit ? entries.map(x=>x.id===e.id?e:x) : [...entries, e];
          setEntries(n); localStorage.setItem('rta_e', JSON.stringify(n));
        }}
      />
      <PrintView profile={currentProfile} entries={filteredEntries} month={monthYear.month} year={monthYear.year} />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
