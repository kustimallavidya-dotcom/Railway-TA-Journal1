import React from 'react';
import { UserProfile, JournalEntry } from '../types.ts';
import { ToWords } from 'to-words';

interface PrintLayoutProps {
  profile: UserProfile;
  entries: JournalEntry[];
  month: string;
  year: string;
  isLivePreview?: boolean;
}

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
  }
});

const TableHeader = () => (
  <thead>
    <tr className="bg-gray-100 text-center">
      <th rowSpan={2} className="w-12">माह और तारीख<br/>Month & Date<br/>1</th>
      <th rowSpan={2} className="w-12">गाड़ी का क्रमांक<br/>Train No.<br/>2</th>
      <th colSpan={2}>समय / Time</th>
      <th colSpan={2}>स्टेशन / Station</th>
      <th rowSpan={2} className="w-10">कि. मी.<br/>Kms.<br/>7</th>
      <th rowSpan={2} className="w-10">दिन/रात<br/>Rate (%)<br/>8</th>
      <th rowSpan={2} className="w-32">यात्रा का उद्देश्य<br/>Object of journey<br/>9</th>
      <th rowSpan={2} className="w-16">दर<br/>Amount (Rs)<br/>10</th>
      <th rowSpan={2} className="w-10">दूरी (अन्य)<br/>Dist (Pvt)<br/>11</th>
      <th rowSpan={2} className="w-12">टिप्पणी<br/>Remarks<br/>12</th>
    </tr>
    <tr className="bg-gray-100 text-center">
      <th className="w-12">प्रस्थान<br/>Dep<br/>3</th>
      <th className="w-12">आगमन<br/>Arr<br/>4</th>
      <th className="w-20">से<br/>From<br/>5</th>
      <th className="w-20">तक<br/>To<br/>6</th>
    </tr>
  </thead>
);

const TableRow: React.FC<{ entry: JournalEntry }> = ({ entry }) => (
  <tr className="text-center h-8">
      <td>{entry.date.split('-').reverse().slice(0, 2).join('-')}</td>
      <td>{entry.trainNo}</td>
      <td>{entry.depTime}</td>
      <td>{entry.arrTime}</td>
      <td className="uppercase">{entry.depStation}</td>
      <td className="uppercase">{entry.arrStation}</td>
      <td>{entry.distance}</td>
      <td>{entry.percentClaimed}%</td>
      <td className="text-left text-[9px] px-1">{entry.purpose}</td>
      <td>{entry.amount}</td>
      <td>{entry.otherDistance || '-'}</td>
      <td>{entry.remarks || '-'}</td>
  </tr>
);

const EmptyRow: React.FC = () => (
  <tr className="h-8">
      <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
      <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
      <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
  </tr>
);

const EmptySpaceOverlay = ({ rowCount }: { rowCount: number }) => {
    if (rowCount <= 0) return null;
    const height = rowCount * 33; 
    return (
        <div className="absolute left-0 right-0 w-full pointer-events-none" style={{ height: `${height}px`, bottom: '2.1rem' }}>
             <div className="w-full border-t border-black absolute top-0"></div>
             <svg className="w-full h-full absolute top-0 left-0" preserveAspectRatio="none">
                 <line x1="0" y1="100%" x2="100%" y2="0" stroke="black" strokeWidth="0.5" />
             </svg>
        </div>
    );
};

export const PrintLayout: React.FC<PrintLayoutProps> = ({ profile, entries, month, year, isLivePreview }) => {
  const PAGE_1_ROWS = 13;
  const page1Entries = entries.slice(0, PAGE_1_ROWS);
  const page2Entries = entries.slice(PAGE_1_ROWS);
  const p1EmptyRows = Math.max(0, PAGE_1_ROWS - entries.length);
  const MIN_ROWS_P2 = 15;
  const p2EmptyRows = Math.max(0, MIN_ROWS_P2 - page2Entries.length);
  const totalAmount = entries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const amountInWords = totalAmount > 0 ? toWords.convert(totalAmount) : 'Zero Only';

  const containerClass = isLivePreview 
    ? "paper-preview block" 
    : "print-only text-black font-serif leading-tight";

  return (
    <div className={containerClass}>
      
      {/* ================= PAGE 1 ================= */}
      <div className="w-full relative bg-white">
        <div className="border-b border-black pb-2 mb-2">
            <div className="flex justify-between items-start text-[10px] font-bold">
                <div>मध्य रेल / CENTRAL RAILWAY</div>
                <div>GA 31 SRC/G 1677</div>
            </div>

            <div className="text-center mt-1">
                <h1 className="text-lg font-bold uppercase underline">TRAVELLING ALLOWANCE JOURNAL</h1>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
                <div className="flex"><span className="whitespace-nowrap">Branch:</span><span className="dotted-line flex-grow ml-1">{profile.branch}</span></div>
                <div className="flex"><span className="whitespace-nowrap">Division:</span><span className="dotted-line flex-grow ml-1">{profile.division}</span></div>
                <div className="flex"><span className="whitespace-nowrap">HQ:</span><span className="dotted-line flex-grow ml-1">{profile.headquarters}</span></div>
            </div>

            <div className="mt-1 text-[10px] flex items-end">
                <span>Journal of duties by</span>
                <span className="dotted-line px-2 font-bold mx-1 min-w-[120px]">{profile.name}</span>
                <span>for</span>
                <span className="dotted-line px-2 font-bold mx-1">{month} {year}</span>
            </div>

            <div className="grid grid-cols-4 gap-1 mt-1 text-[10px]">
                <div className="flex col-span-2"><span>Designation:</span><span className="dotted-line flex-grow ml-1">{profile.designation}</span></div>
                <div className="flex"><span>Pay:</span><span className="dotted-line flex-grow ml-1">{profile.basicPay}</span></div>
                <div className="flex"><span>P.F.:</span><span className="dotted-line flex-grow ml-1">{profile.pfNumber}</span></div>
            </div>
        </div>

        <div className="relative">
            <table className="ta-table">
                <TableHeader />
                <tbody>
                    {page1Entries.map(e => <TableRow key={e.id} entry={e} />)}
                    {Array.from({ length: p1EmptyRows }).map((_, i) => <EmptyRow key={i} />)}
                </tbody>
            </table>
            {p1EmptyRows > 0 && <EmptySpaceOverlay rowCount={p1EmptyRows} />}
        </div>
        <div className="text-right text-[8px] italic mt-1">(P.T.O)</div>
      </div>

      <div className="page-break my-8 border-t-2 border-dashed border-gray-200 no-print"></div>

      {/* ================= PAGE 2 ================= */}
      <div className="w-full relative bg-white pb-4">
        <div className="relative mb-2">
            <table className="ta-table">
                <TableHeader />
                <tbody>
                    {page2Entries.map(e => <TableRow key={e.id} entry={e} />)}
                    <tr className="font-bold bg-gray-50 h-8">
                        <td colSpan={9} className="text-right pr-2">Total Amount (₹):</td>
                        <td className="text-center">{totalAmount}</td>
                        <td></td><td></td>
                    </tr>
                    {Array.from({ length: p2EmptyRows }).map((_, i) => <EmptyRow key={i} />)}
                </tbody>
            </table>
             {p2EmptyRows > 0 && <EmptySpaceOverlay rowCount={p2EmptyRows} />}
        </div>

        <div className="mt-2 px-2 text-[10px]">
             <div className="flex items-end mb-2 font-bold font-handwriting text-sm border-b border-black pb-1">
                <span className="font-serif text-[10px] mr-2">Rupees in words:</span>
                {amountInWords}
             </div>

             <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center">
                    <p className="font-bold">Transportation Inspector</p>
                    <p className="uppercase text-[8px]">Central Railway {profile.headquarters}</p>
                    <div className="h-8"></div>
                    <div className="border-t border-black pt-1">Controlling Officer</div>
                </div>

                <div className="text-center">
                    <div className="font-handwriting text-lg h-6">{profile.name}</div>
                    <div className="border-t border-black pt-1 font-bold">
                        Signature of Claimant
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};