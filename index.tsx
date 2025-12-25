
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Settings, Printer, Plus, Trash2, Edit2, 
  User, Home, Calendar, ArrowRight, Mail, ChevronLeft, Save, Sparkles
} from 'lucide-react';
import { ToWords } from 'to-words';
import { GoogleGenAI, Type } from "@google/genai";

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
    <div className="p-6 bg-white min-h-screen no-print">
      <h2 className="text-3xl font-bold text-[#1e3a8a] mb-8">Setup Profile</h2>
      <div className="space-y-6">
        <div><label className="input-label">Full Name</label><input className="input-field uppercase" placeholder="E.G. MILIND D. MANUGADE" value={temp.name} onChange={e=>setTemp({...temp, name: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="input-label">Designation</label><input className="input-field uppercase" placeholder="PMA/SS" value={temp.designation} onChange={e=>setTemp({...temp, designation: e.target.value})} /></div>
          <div><label className="input-label">Station</label><input className="input-field uppercase" placeholder="KARAD" value={temp.headquarters} onChange={e=>setTemp({...temp, headquarters: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="input-label">Pay (Rs)</label><input className="input-field" placeholder="24500" value={temp.basicPay} onChange={e=>setTemp({...temp, basicPay: e.target.value})} /></div>
          <div><label className="input-label">Level</label><input className="input-field uppercase" placeholder="LEVEL - 2" value={temp.payLevel} onChange={e=>setTemp({...temp, payLevel: e.target.value})} /></div>
        </div>
        <div><label className="input-label">P.F. Number</label><input className="input-field uppercase" placeholder="Enter P.F. Number" value={temp.pfNumber} onChange={e=>setTemp({...temp, pfNumber: e.target.value})} /></div>
        <div className="p-4 bg-slate-50 rounded-2xl grid grid-cols-3 gap-2">
          <div><label className="text-[10px] font-bold text-gray-400 uppercase">Branch</label><input className="w-full bg-transparent font-bold border-none p-0 outline-none uppercase" value={temp.branch} onChange={e=>setTemp({...temp, branch: e.target.value})} /></div>
          <div><label className="text-[10px] font-bold text-gray-400 uppercase">Division</label><input className="w-full bg-transparent font-bold border-none p-0 outline-none uppercase" value={temp.division} onChange={e=>setTemp({...temp, division: e.target.value})} /></div>
          <div><label className="text-[10px] font-bold text-gray-400 uppercase">HQ</label><input className="w-full bg-transparent font-bold border-none p-0 outline-none uppercase" value={temp.headquarters} onChange={e=>setTemp({...temp, headquarters: e.target.value})} /></div>
        </div>
        <button onClick={()=>onSave(temp)} className="w-full py-4 btn-primary text-xl mt-4 shadow-lg">Save Profile</button>
        <button onClick={onCancel} className="w-full py-2 text-gray-500 font-medium">Cancel</button>
      </div>
    </div>
  );
};

const EntryModal = ({ isOpen, onClose, onSave, userProfile, editEntry }: any) => {
  const [entry, setEntry] = useState<any>({ date: '', trainNo: '', depStation: '', depTime: '', arrStation: '', arrTime: '', distance: '', percentClaimed: '100', rate: userProfile.dailyRate, purpose: 'OFFICIAL DUTY', pvtDist: '', refItem: '' });
  const [aiInput, setAiInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(editEntry) setEntry(editEntry);
    else setEntry((prev: any) => ({ ...prev, date: new Date().toISOString().split('T')[0], rate: userProfile.dailyRate || '500' }));
  }, [editEntry, isOpen, userProfile]);

  const handleAiParse = async () => {
    if (!aiInput || !process.env.API_KEY) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Extract railway TA data from: "${aiInput}". Return JSON: {trainNo, depStation, depTime, arrStation, arrTime, purpose, distance}. Use 24h format for time.`,
        config: { responseMimeType: "application/json" }
      });
      const parsed = JSON.parse(response.text.trim());
      setEntry({ ...entry, ...parsed });
      setAiInput('');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  if(!isOpen) return null;

  const handleSave = () => {
    const amount = Math.round(parseFloat(entry.rate || 0) * (entry.percentClaimed === '100' ? 1 : entry.percentClaimed === '70' ? 0.7 : entry.percentClaimed === '30' ? 0.3 : 0));
    onSave({...entry, amount: amount.toString(), id: editEntry?.id || Date.now().toString()});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end no-print">
      <div className="bg-white rounded-t-[32px] p-6 pb-10 h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Fill Daily TA Details</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full"><ChevronLeft /></button>
        </div>
        
        {!editEntry && (
          <div className="mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <label className="text-[10px] font-bold text-blue-600 uppercase mb-2 block">Magic AI Entry</label>
            <div className="flex gap-2">
              <input className="flex-grow bg-white p-3 rounded-xl text-sm outline-none border border-blue-100" placeholder="e.g. 12123 Karad to CSMT 06:00 to 12:00" value={aiInput} onChange={e=>setAiInput(e.target.value)} />
              <button onClick={handleAiParse} className="p-3 bg-blue-600 text-white rounded-xl active:scale-95">{loading ? '...' : <Sparkles size={20}/>}</button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-[10px] font-bold text-slate-400">DATE</label><input type="date" className="input-field" value={entry.date} onChange={e=>setEntry({...entry, date:e.target.value})} /></div>
            <div><label className="text-[10px] font-bold text-slate-400">TRAIN NO</label><input className="input-field" value={entry.trainNo} onChange={e=>setEntry({...entry, trainNo:e.target.value})} /></div>
          </div>
          <div className="p-4 border rounded-2xl grid grid-cols-2 gap-4 relative">
            <div><label className="text-[10px] font-bold text-slate-400">FROM</label><input className="w-full text-lg font-bold p-0 border-none outline-none uppercase" value={entry.depStation} onChange={e=>setEntry({...entry, depStation:e.target.value})} /><input type="time" className="w-full text-sm p-0 border-none outline-none" value={entry.depTime} onChange={e=>setEntry({...entry, depTime:e.target.value})} /></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300"><ArrowRight /></div>
            <div className="text-right"><label className="text-[10px] font-bold text-slate-400">TO</label><input className="w-full text-lg font-bold p-0 border-none outline-none text-right uppercase" value={entry.arrStation} onChange={e=>setEntry({...entry, arrStation:e.target.value})} /><input type="time" className="w-full text-sm p-0 border-none outline-none text-right" value={entry.arrTime} onChange={e=>setEntry({...entry, arrTime:e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-[10px] font-bold text-slate-400">KMS</label><input className="input-field" value={entry.distance} onChange={e=>setEntry({...entry, distance:e.target.value})} /></div>
            <div><label className="text-[10px] font-bold text-slate-400">DAY/NIGHT %</label><select className="input-field bg-white" value={entry.percentClaimed} onChange={e=>setEntry({...entry, percentClaimed:e.target.value})}><option value="100">100%</option><option value="70">70%</option><option value="30">30%</option><option value="Nil">Nil</option></select></div>
            <div><label className="text-[10px] font-bold text-slate-400">RATE</label><input className="input-field" value={entry.rate} onChange={e=>setEntry({...entry, rate:e.target.value})} /></div>
          </div>
          <div><label className="text-[10px] font-bold text-slate-400">PURPOSE</label><input className="input-field uppercase" value={entry.purpose} onChange={e=>setEntry({...entry, purpose:e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
             <div><label className="text-[10px] font-bold text-slate-400">PVT DIST (COL 11)</label><input className="input-field text-xs uppercase" value={entry.pvtDist} onChange={e=>setEntry({...entry, pvtDist:e.target.value})} /></div>
             <div><label className="text-[10px] font-bold text-slate-400">REF ITEM (COL 12)</label><input className="input-field text-xs uppercase" value={entry.refItem} onChange={e=>setEntry({...entry, refItem:e.target.value})} /></div>
          </div>
          <button onClick={handleSave} className="w-full py-4 btn-primary text-xl flex items-center justify-center gap-2 mt-4"><Save size={24}/> Done</button>
        </div>
      </div>
    </div>
  );
};

const PrintView = ({ profile, entries, month, year }: any) => {
  const PAGE_LIMIT = 15;
  const page1Entries = entries.slice(0, PAGE_LIMIT);
  const page2Entries = entries.slice(PAGE_LIMIT);
  const total = entries.reduce((s: number, e: any) => s + (parseFloat(e.amount) || 0), 0);
  const amountWords = total > 0 ? toWords.convert(total) : 'ZERO ONLY';

  const renderTableRows = (data: any[]) => (
    <>
      {data.map((e) => (
        <tr key={e.id} className="text-center h-[34px] border-black">
          <td className="border border-black">{e.date.split('-').reverse().slice(0, 2).join('-')}</td>
          <td className="border border-black">{e.trainNo}</td>
          <td className="border border-black">{e.depTime}</td>
          <td className="border border-black">{e.arrTime}</td>
          <td className="border border-black uppercase text-[9px]">{e.depStation}</td>
          <td className="border border-black uppercase text-[9px]">{e.arrStation}</td>
          <td className="border border-black">{e.distance}</td>
          <td className="border border-black">{e.percentClaimed}%</td>
          <td className="border border-black text-left px-1 text-[8px] uppercase">{e.purpose}</td>
          <td className="border border-black">{e.amount}</td>
          <td className="border border-black uppercase">{e.pvtDist || ''}</td>
          <td className="border border-black uppercase">{e.refItem || ''}</td>
        </tr>
      ))}
      {Array.from({ length: Math.max(0, PAGE_LIMIT - data.length) }).map((_, i) => (
        <tr key={`empty-${i}`} className="h-[34px] border-black"><td className="border border-black">&nbsp;</td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td><td className="border border-black"></td></tr>
      ))}
    </>
  );

  return (
    <div className="print-only hidden bg-white text-black font-serif p-4" style={{ width: '297mm' }}>
      <div className="min-h-[210mm] relative">
        <div className="flex justify-between text-[11px] font-bold"><span>मध्य रेल / CENTRAL RAILWAY</span><div className="text-right">जी. ए. ३१ एस आर सी/जी १६७७<br/>जी ६९ एफ/जी ६९ एफ/ए<br/>GA 31 SRC/G 1677 G 69 F/G 69 F/A</div></div>
        <h1 className="text-center text-xl font-bold underline mt-4 mb-2">यात्रा भत्ता जर्नल TRAVELLING ALLOWANCE JOURNAL</h1>
        <p className="text-center text-[10px] mb-4">Rule by which governed: <span className="font-bold border-b border-black px-4 uppercase">NEW RULE</span></p>
        <div className="grid grid-cols-3 text-[11px] mb-2 font-medium">
          <div>शाखा/Branch: <span className="border-b border-dotted border-black px-2 font-bold uppercase">{profile.branch}</span></div>
          <div className="text-center">Division: <span className="border-b border-dotted border-black px-2 font-bold uppercase">{profile.division}</span></div>
          <div className="text-right">Headquarters: <span className="border-b border-dotted border-black px-2 font-bold uppercase">{profile.headquarters}</span></div>
        </div>
        <div className="text-[11px] mb-2 leading-loose">
          Journal of duties performed by <span className="border-b border-dotted border-black px-4 font-bold uppercase">{profile.name}</span> for allowance <span className="border-b border-dotted border-black px-4 font-bold uppercase">{month}/{year}</span> is claimed.<br/>
          Designation <span className="border-b border-dotted border-black px-4 font-bold uppercase">{profile.designation}</span> Pay <span className="border-b border-dotted border-black px-4 font-bold uppercase">{profile.basicPay}</span> Level <span className="border-b border-dotted border-black px-4 font-bold uppercase">{profile.payLevel}</span> P.F. NO: <span className="border-b border-dotted border-black px-4 font-bold uppercase">{profile.pfNumber}</span>
        </div>
        <table className="w-full border-collapse border border-black text-[10px]">
          <thead>
            <tr className="text-center font-bold">
              <td className="border border-black w-14">Month/Date<br/>1</td><td className="border border-black w-14">Train No.<br/>2</td><td className="border border-black w-12">Time left<br/>3</td><td className="border border-black w-12">Time arr.<br/>4</td><td className="border border-black" colSpan={2}>Station (From/To)<br/>5/6</td><td className="border border-black w-10">Kms.<br/>7</td><td className="border border-black w-10">Day/Night<br/>8</td><td className="border border-black w-40">Object of journey<br/>9</td><td className="border border-black w-14">Amt<br/>10</td><td className="border border-black w-20">Col 11</td><td className="border border-black w-20">Col 12</td>
            </tr>
          </thead>
          <tbody>{renderTableRows(page1Entries)}</tbody>
        </table>
        <div className="flex justify-between text-[8px] italic opacity-50 mt-2"><span>Forms-04-06</span><span>कृ. पु. प./P.T.O.</span></div>
      </div>
      {page2Entries.length > 0 && <div className="page-break my-10 no-print border-t border-dashed"></div>}
      <div className="min-h-[210mm] relative mt-10">
        {page2Entries.length > 0 && <table className="w-full border-collapse border border-black text-[10px]"><tbody>{renderTableRows(page2Entries)}</tbody></table>}
        <div className="mt-4 text-[12px] font-bold">GRAND TOTAL (WORDS): <span className="border-b border-black px-4 uppercase">{amountWords}</span></div>
        <div className="mt-6 text-[10px] leading-relaxed space-y-2 opacity-80">
          <p>I hereby certify that the above mentioned was absent on duty from his headquarter's station during the period charged in this bill on railway business.</p>
          <p>I certify that no TA/DA or any other remuneration has been drawn from any other source in respect of the journeys performed.</p>
        </div>
        <div className="mt-16 grid grid-cols-4 gap-4 text-[11px] text-center font-bold">
          <div className="border-t border-black pt-1">प्रति हस्ताक्षरित<br/>Countersigned</div>
          <div className="border-t border-black pt-1">नियंत्रक अधिकारी<br/>Controlling Officer</div>
          <div className="border-t border-black pt-1">कार्यालय प्रमुख<br/>Head of Office</div>
          <div><div className="h-6 text-blue-800 text-lg uppercase">{profile.name}</div><div className="border-t border-black pt-1">Signature of Claimant</div></div>
        </div>
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
  const [monthYear, setMonthYear] = useState({ month: 'DECEMBER', year: '2025' });

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem('rta_p') || '[]');
    const a = localStorage.getItem('rta_a');
    const e = JSON.parse(localStorage.getItem('rta_e') || '[]');
    setProfiles(p); setActiveId(a); setEntries(e);
    setTimeout(() => setView(p.length > 0 ? 'home' : 'profile'), 2000);
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
    return d.toLocaleString('default', {month:'long'}).toUpperCase() === monthYear.month && d.getFullYear().toString() === monthYear.year;
  }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if(view === 'splash') return <SplashScreen />;
  if(view === 'profile') return <ProfileSetup profile={currentProfile} onSave={saveProfile} onCancel={() => setView('home')} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-lg mx-auto border-x shadow-xl relative pb-32 no-print">
      <header className="p-6 bg-white flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl uppercase">{currentProfile.name?.charAt(0) || 'M'}</div>
          <div><p className="text-[10px] text-slate-400 font-bold uppercase">Welcome</p><h1 className="font-bold text-lg text-[#1e3a8a] truncate max-w-[120px]">{currentProfile.name || 'Guest'}</h1></div>
        </div>
        <button onClick={() => window.print()} className="p-3 bg-blue-50 text-blue-600 rounded-2xl font-bold flex items-center gap-2 text-sm active:scale-95"><Printer size={18}/> Print TA</button>
      </header>

      <main className="flex-grow p-6 overflow-y-auto">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs mb-6 uppercase tracking-widest"><Home size={16} /> Journals History</div>
        {filteredEntries.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-10 text-center animate-fade-up"><div className="mb-4 opacity-10 flex justify-center"><Printer size={80} /></div><p className="text-slate-400 font-bold">No TA journals found.</p></div>
        ) : (
          <div className="space-y-4 animate-fade-up">
            <div className="bg-white p-4 rounded-3xl border flex justify-between items-center shadow-sm">
              <div><h3 className="font-bold text-[#1e3a8a] uppercase">{monthYear.month} {monthYear.year}</h3><p className="text-[10px] text-slate-400 font-bold">{filteredEntries.length} Records</p></div>
              <button onClick={() => setMonthModal(true)} className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Calendar size={20}/></button>
            </div>
            {filteredEntries.map(e => (
              <div key={e.id} className="bg-white p-4 rounded-3xl border flex justify-between items-center shadow-sm">
                 <div className="flex-grow">
                   <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">{new Date(e.date).toLocaleDateString()}</p>
                   <div className="flex items-center gap-2 font-bold text-[#1e3a8a] uppercase"><span>{e.depStation}</span><ArrowRight size={14} className="text-slate-300"/><span>{e.arrStation}</span></div>
                 </div>
                 <div className="flex gap-1">
                   <button onClick={()=>setModal({open:true, edit:e})} className="p-2 text-slate-400"><Edit2 size={18}/></button>
                   <button onClick={()=>{if(confirm('Delete?')){const n=entries.filter(x=>x.id!==e.id); setEntries(n); localStorage.setItem('rta_e', JSON.stringify(n));}}} className="p-2 text-rose-400"><Trash2 size={18}/></button>
                 </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-center text-slate-300 text-[10px] mt-12 font-bold uppercase tracking-widest mb-10">Developed by Milind Manugade</p>
      </main>

      <nav className="fixed bottom-0 w-full max-w-lg bg-white border-t p-4 flex justify-between items-center shadow-lg">
         <button className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-blue-600' : 'text-slate-400'}`} onClick={() => setView('home')}><Home size={24}/><span className="text-[10px] font-bold">History</span></button>
         <div className="relative"><button onClick={() => setMonthModal(true)} className="plus-btn active:scale-90 transition-all"><Plus size={36} /></button><span className="mt-10 block text-[10px] font-bold text-blue-600">New Month</span></div>
         <button className={`flex flex-col items-center gap-1 ${view === 'profile' ? 'text-blue-600' : 'text-slate-400'}`} onClick={() => setView('profile')}><User size={24}/><span className="text-[10px] font-bold">Profile</span></button>
      </nav>

      {monthModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-6 animate-fade-in no-print">
          <div className="bg-white w-full rounded-[32px] p-6 text-center animate-fade-up">
            <h3 className="text-2xl font-bold text-[#1e3a8a] mb-6">Select Month/Year</h3>
            <div className="space-y-4 text-left">
              <select className="input-field w-full" value={monthYear.month} onChange={e=>setMonthYear({...monthYear, month:e.target.value})}>{['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'].map(m=><option key={m}>{m}</option>)}</select>
              <select className="input-field w-full" value={monthYear.year} onChange={e=>setMonthYear({...monthYear, year:e.target.value})}>{['2024','2025','2026'].map(y=><option key={y}>{y}</option>)}</select>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={()=>setMonthModal(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancel</button>
              <button onClick={()=>{setMonthModal(false); setModal({open:true, edit:null});}} className="flex-1 py-4 btn-primary shadow-lg">Create</button>
            </div>
          </div>
        </div>
      )}

      <EntryModal isOpen={modal.open} onClose={()=>setModal({open:false, edit:null})} userProfile={currentProfile} editEntry={modal.edit} onSave={(e: any)=>{const n = modal.edit ? entries.map(x=>x.id===e.id?e:x) : [...entries, e]; setEntries(n); localStorage.setItem('rta_e', JSON.stringify(n));}} />
      <PrintView profile={currentProfile} entries={filteredEntries} month={monthYear.month} year={monthYear.year} />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
