import React, { useState, useEffect } from 'react';
import { JournalEntry, STATION_HINTS, PURPOSE_HINTS, UserProfile } from '../types.ts';
import { X, Sparkles } from 'lucide-react';
import { parseNaturalLanguageEntry } from '../services/geminiService.ts';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
  entryToEdit?: JournalEntry | null;
  userProfile: UserProfile;
}

export const EntryModal: React.FC<EntryModalProps> = ({ isOpen, onClose, onSave, entryToEdit, userProfile }) => {
  const [formData, setFormData] = useState<Partial<JournalEntry>>({
    date: new Date().toISOString().split('T')[0],
    percentClaimed: '100',
    purpose: 'Official Duty',
    amount: ''
  });
  const [naturalInput, setNaturalInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (entryToEdit) {
      setFormData(entryToEdit);
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        percentClaimed: '100',
        purpose: 'Official Duty',
        amount: ''
      });
      calculateAmount('100', userProfile.dailyRate);
    }
  }, [entryToEdit, isOpen, userProfile]);

  const calculateAmount = (percent: string, rateStr: string) => {
    const rate = parseFloat(rateStr);
    if (isNaN(rate)) return;
    
    let factor = 0;
    if (percent === '100') factor = 1;
    if (percent === '70') factor = 0.7;
    if (percent === '30') factor = 0.3;
    if (percent === 'Nil') factor = 0;

    const amt = Math.round(rate * factor);
    setFormData(prev => ({ ...prev, percentClaimed: percent as any, amount: amt.toString() }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'percentClaimed') {
        calculateAmount(value, userProfile.dailyRate);
    }
  };

  const handleAiParse = async () => {
    if (!naturalInput) return;
    setIsAiLoading(true);
    const parsed = await parseNaturalLanguageEntry(naturalInput);
    if (parsed && Object.keys(parsed).length > 0) {
      setFormData(prev => ({ ...prev, ...parsed }));
    }
    setIsAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: entryToEdit?.id || Date.now().toString(),
      ...formData as JournalEntry
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 print-hidden">
      <div className="bg-white w-full max-w-lg rounded-t-xl sm:rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {entryToEdit ? 'Edit Entry' : 'New Daily Entry'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {!entryToEdit && (
            <div className="mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
              <label className="block text-xs font-semibold text-blue-700 mb-1">
                 Quick Add (Magic AI)
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Today went to Karad by 71423 at 6am"
                  className="flex-grow p-2 text-sm border rounded"
                  value={naturalInput}
                  onChange={(e) => setNaturalInput(e.target.value)}
                />
                <button 
                  onClick={handleAiParse}
                  disabled={isAiLoading}
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center w-12"
                >
                  {isAiLoading ? '...' : <Sparkles className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500">Date</label>
                <input required type="date" name="date" value={formData.date || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1 bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Train No.</label>
                <input required type="text" name="trainNo" value={formData.trainNo || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1 uppercase" placeholder="12123" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500">Depart Stn</label>
                <input required list="stations" name="depStation" value={formData.depStation || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1 uppercase" />
                <datalist id="stations">
                    {STATION_HINTS.map(s => <option key={s} value={s} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Dep Time</label>
                <input required type="time" name="depTime" value={formData.depTime || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500">Arrival Stn</label>
                <input required list="stations" name="arrStation" value={formData.arrStation || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">Arr Time</label>
                <input required type="time" name="arrTime" value={formData.arrTime || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
               <div>
                <label className="block text-xs font-medium text-gray-500">Dist (Km)</label>
                <input type="number" name="distance" value={formData.distance || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500">% Claim</label>
                <select name="percentClaimed" value={formData.percentClaimed || '100'} onChange={handleChange} className="w-full p-2 border rounded mt-1 bg-white">
                  <option value="100">100%</option>
                  <option value="70">70%</option>
                  <option value="30">30%</option>
                  <option value="Nil">Nil</option>
                </select>
              </div>
               <div>
                <label className="block text-xs font-medium text-gray-500">Amount (₹)</label>
                <input type="number" name="amount" value={formData.amount || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1 font-bold" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500">Purpose</label>
              <input list="purposes" name="purpose" value={formData.purpose || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
              <datalist id="purposes">
                  {PURPOSE_HINTS.map(p => <option key={p} value={p} />)}
              </datalist>
            </div>

            <div className="pt-4 flex gap-3">
              <button type="button" onClick={onClose} className="w-full py-3 bg-gray-100 rounded-lg font-medium text-gray-700">Cancel</button>
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium">Save Entry</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};