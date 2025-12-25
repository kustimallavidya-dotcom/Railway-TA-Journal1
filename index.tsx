
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Settings, Printer, Plus, Trash2, Edit2, Train, 
  User, Home, Calendar, ArrowRight, X, Mail, ChevronLeft, Save
} from 'lucide-react';
import { ToWords } from 'to-words';

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
    <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end no-print">
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
  const PAGE_LIMIT = 15;
  const page1Entries = entries.slice(0, PAGE_LIMIT);
  const page2Entries = entries.slice(PAGE_LIMIT);
  const total = entries.reduce((s: number, e: any) => s + (parseFloat(e.amount) || 0), 0);
  const amountWords = total > 0 ? toWords.convert(total) : 'ZERO ONLY';

  const renderTableRows = (data: any[]) => (
    <>
      {data.map((e, idx) => (
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
          <td className="border border-black">{e.pvtDist || ''}</td>
          <td className="border border-black">{e.refItem || ''}</td>
        </tr>
      ))}
      {Array.from({ length: Math.max(0, PAGE_LIMIT - data.length) }).map((_, i) => (
        <tr key={`empty-${i}`} className="h-[34px] border-black">
          <td className="border border-black">&nbsp;</td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
          <td className="border border-black"></td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="print-only hidden bg-white text-black font-serif p-4" style={{ width: '297mm' }}>
      {/* PAGE 1 */}
      <div className="min-h-[210mm] relative">
        <div className="flex justify-between text-[11px] font-bold">
          <span>मध्य रेल / CENTRAL RAILWAY</span>
          <div className="text-right">
            जी. ए. ३१ एस आर सी/जी १६७७<br/>जी ६९ एफ/जी ६९ एफ/ए<br/>GA 31 SRC/G 1677 G 69 F/G 69 F/A
          </div>
        </div>

        <h1 className="text-center text-xl font-bold underline mt-4 mb-2 tracking-wide">यात्रा भत्ता जर्नल TRAVELLING ALLOWANCE JOURNAL</h1>
        <p className="text-center text-[10px] mb-4">नियम जिससे शासित है / Rule by which governed: <span className="font-bold border-b border-black px-4">NEW RULE</span></p>

        <div className="grid grid-cols-3 text-[11px] mb-2 font-medium">
          <div>शाखा/Branch: <span className="border-b border-dotted border-black px-2 font-bold uppercase">{profile.branch}</span></div>
          <div className="text-center">मंडल/जिला/Division/Distt.: <span className="border-b border-dotted border-black px-2 font-bold uppercase">{profile.division}</span></div>
          <div className="text-right">मुख्यालय/Headquarters at: <span className="border-b border-dotted border-black px-2 font-bold uppercase">{profile.headquarters}</span></div>
        </div>

        <div className="text-[11px] mb-2 leading-loose">
          द्वारा किये गये कार्यों का जर्नल, जिनके बारे में २० <span className="dotted-line px-2 font-bold">20</span> के लिये भत्ता मांगा गया है ।<br/>
          Journal of duties performed by <span className="border-b border-dotted border-black px-4 font-bold uppercase">{profile.name}</span> for which allowance for <span className="border-b border-dotted border-black px-4 font-bold uppercase">{month}/{year}</span> is claimed.<br/>
          पदनाम/Designation <span className="border-b border-dotted border-black px-4 font-bold uppercase">{profile.designation}</span> वेतन/Pay <span className="border-b border-dotted border-black px-4 font-bold uppercase">{profile.basicPay}</span> Level <span className="border-b border-dotted border-black px-4 font-bold uppercase">{profile.payLevel}</span> P.F. NO: <span className="border-b border-dotted border-black px-4 font-bold uppercase">{profile.pfNumber}</span>
        </div>

        <table className="w-full border-collapse border border-black text-[10px]">
          <thead>
            <tr className="text-center font-bold">
              <td className="border border-black w-14">माह और तारीख<br/>Month & Date</td>
              <td className="border border-black w-14">गाड़ी का क्रमांक<br/>Train No.</td>
              <td className="border border-black w-12">प्रस्थान समय<br/>Time left</td>
              <td className="border border-black w-12">आगमन समय<br/>Time arrived</td>
              <td className="border border-black" colSpan={2}>स्टेशन / Station<hr className="border-black"/>से /From | तक /To</td>
              <td className="border border-black w-10">कि. मी.<br/>Kms.</td>
              <td className="border border-black w-10">दिन/रात<br/>Day/Night</td>
              <td className="border border-black w-40">यात्रा का उद्देश्य<br/>Object of journey</td>
              <td className="border border-black w-14">दर<br/>Rate</td>
              <td className="border border-black w-20">दूरी जिसके लिये प्राईवेट / सार्वजनिक सवारी का उपयोग किया गया<br/><span className="text-[8px] font-normal">Distance for which private/public conveyance is used</span></td>
              <td className="border border-black w-20">दूरी अनुसूची के मद २० का संदर्भ<br/><span className="text-[8px] font-normal">Reference to Item 20 in Schedule of distance</span></td>
            </tr>
            <tr className="text-center border border-black bg-gray-50 h-5">
              {Array.from({ length: 12 }).map((_, i) => <td key={i} className="border border-black text-[9px]">{i + 1}</td>)}
            </tr>
          </thead>
          <tbody>
            {renderTableRows(page1Entries)}
            <tr className="font-bold h-10">
              <td colSpan={9} className="border border-black text-right pr-4 uppercase">Total (Carried Over)</td>
              <td className="border border-black text-center">{page2Entries.length > 0 ? '' : total}</td>
              <td className="border border-black"></td><td className="border border-black"></td>
            </tr>
          </tbody>
        </table>
        <div className="absolute bottom-0 w-full flex justify-between text-[8px] italic opacity-50">
          <span>C.R.P. 00-06-0006-13,00,000 Forms-04-06</span>
          <span>कृ. पु. प./P.T.O.</span>
        </div>
      </div>

      <div className="page-break my-10 no-print border-t border-dashed"></div>

      {/* PAGE 2 */}
      <div className="min-h-[210mm] relative">
        <table className="w-full border-collapse border border-black text-[10px]">
          <thead>
            <tr className="text-center border border-black bg-gray-50 h-6">
              {Array.from({ length: 12 }).map((_, i) => <td key={i} className="border border-black">{i + 1}</td>)}
            </tr>
          </thead>
          <tbody>
            {renderTableRows(page2Entries)}
            <tr className="font-bold h-10">
              <td colSpan={9} className="border border-black text-right pr-4 uppercase">Grand Total</td>
              <td className="border border-black text-center">{total}</td>
              <td className="border border-black"></td><td className="border border-black"></td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 text-[12px] font-bold">
          GRAND TOTAL (IN WORDS): <span className="border-b border-black px-4 uppercase font-black">{amountWords}</span>
        </div>

        <div className="mt-6 text-[10px] leading-relaxed space-y-2">
          <p>मैं प्रमाणित करता हूं कि उपर्युक्त <span className="border-b border-dotted border-black px-8"></span> उस अवधि के दौरान, जिसके लिये इस बिल में भत्ता मांगा गया है रेलवे के कार्य से ड्यूटी पर मुख्यालय स्टेशन से बाहर गया था । इस अधिकारी ने रेलमार्ग / समुद्रमार्ग / सड़क-वाहन / वायुमार्ग से यात्रा की और इसे मुफ्त पास या सरकारी स्थानीय निधि या भारत सरकार पर यात्रा करने की सुविधा दी गयी/नहीं दी गयी थी ।</p>
          <p>मैं प्रमाणित करता हूं कि ड्यूटी पास पर की गयी यात्रा तथा विराम के बारे में जिसके लिये इस बिल में यात्रा भत्ता /दैनिक भत्ता मांगा गया है, किसी भी स्रोत से कोई यात्रा भत्ता/दैनिक भत्ता या पारिश्रमिक नहीं लिया गया है ।</p>
          <p>I hereby certify that the above mentioned <span className="border-b border-dotted border-black px-8"></span> was absent on duty from his headquarter's station during the period charged for in this bill on railway business and that the officer performed the journey by Rail/Sea/Road/Air and was allowed/not allowed free pass or locomotion at the expenses of Government local fund or Gov. of India.</p>
          <p>I certify that no TA/DA or any other remuneration has been drawn from any other source in respect of the journeys performed duty pass and also for the halts for which TA/DA has been claimed in this bill.</p>
        </div>

        <div className="mt-16 grid grid-cols-4 gap-4 text-[11px] text-center font-bold">
          <div className="space-y-8">
            <div className="h-8"></div>
            <div className="border-t border-black pt-1">प्रति हस्ताक्षरित<br/>Countersigned</div>
          </div>
          <div className="space-y-8">
            <div className="h-8"></div>
            <div className="border-t border-black pt-1">नियंत्रक अधिकारी<br/>Controlling Officer</div>
          </div>
          <div className="space-y-8">
            <div className="h-8"></div>
            <div className="border-t border-black pt-1">कार्यालय प्रमुख<br/>Head of Office</div>
          </div>
          <div className="space-y-8">
             <div className="h-8 text-blue-800 font-handwriting text-xl">{profile.name}</div>
             <div className="border-t border-black pt-1">भत्ता मांगने वाले अधिकारी का हस्ताक्षर<br/>Signature of Officer/Claiming T.A.</div>
          </div>
        </div>

        <div className="mt-10 text-[9px] border-t border-black pt-2 space-y-1">
          <p>टिप्पणी : किसी एक रेलवे से दूसरी रेलवे पर स्थानांतरण होने पर यात्रा भत्ता बिल पर यह प्रमाणित किया जाना चाहिए कि मुफ्त पास या सरकारी खर्च पर यात्रा करने की सुविधा दी गई थी या नहीं ।</p>
          <p>Note :- On transfer from one Railway to another, certificate whether or not a free pass or Locomotion at Government expenses was allowed or not should be recorded on T.A. Bills.</p>
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
      return d.toLocaleString('default', {month:'long'}).toUpperCase() === monthYear.month && d.getFullYear().toString() === monthYear.year;
  }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if(view === 'splash') return <SplashScreen />;
  if(view === 'profile') return <ProfileSetup profile={currentProfile} onSave={saveProfile} onCancel={() => setView('home')} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-lg mx-auto border-x shadow-xl relative pb-32 no-print">
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
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-6 animate-fade-in no-print">
          <div className="bg-white w-full rounded-[32px] p-6 text-center animate-fade-up">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
               <Calendar size={32} />
            </div>
            <h3 className="text-2xl font-bold text-[#1e3a8a] mb-6">Select Month & Year</h3>
            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Month</label>
                <select className="input-field" value={monthYear.month} onChange={e=>setMonthYear({...monthYear, month:e.target.value})}>
                  {['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'].map(m=><option key={m}>{m}</option>)}
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
