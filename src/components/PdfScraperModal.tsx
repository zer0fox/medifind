import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  RefreshCw, 
  Sparkles, 
  Database,
  ArrowRight,
  ClipboardPaste
} from 'lucide-react';
import { AppLanguage, Hospital } from '../types';

interface PdfScraperModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
  onHospitalsUpdated: (newHospitals: Hospital[]) => void;
}

const SAMPLE_GREEK_SCHEDULE_TEXT = `
ΥΠΟΥΡΓΕΙΟ ΥΓΕΙΑΣ - 1η ΥΓΕΙΟΝΟΜΙΚΗ ΠΕΡΙΦΕΡΕΙΑ ΑΤΤΙΚΗΣ
ΠΡΟΓΡΑΜΜΑ ΓΕΝΙΚΩΝ ΕΦΗΜΕΡΙΩΝ ΝΟΣΟΚΟΜΕΙΩΝ ΑΘΗΝΩΝ - ΠΕΙΡΑΙΑ
Ημερομηνία Εφημερίας: Σήμερα (14:30 μ.μ. έως 06:00 π.μ. επομένης)

ΟΜΑΔΑ Α (Κεντρική Εφημερία):
1. ΓΝΑ «Ο ΕΥΑΓΓΕΛΙΣΜΟΣ» (Κολωνάκι, Υψηλάντου 45) - Τηλ: 213 2041000
   Κλινικές: Παθολογικό, Χειρουργικό, Καρδιολογικό, Ορθοπαιδικό, Νευρολογικό, Πνευμονολογικό, ΩΡΛ, Οφθαλμολογικό, Ουρολογικό, Γναθοχειρουργικό. 
   Τραύμα: Πλήρης κάλυψη γενικού τραύματος.

2. ΓΝΑ «Γ. ΓΕΝΝΗΜΑΤΑΣ» (Λεωφ. Μεσογείων 154) - Τηλ: 213 2032000
   Κλινικές: Παθολογική, Χειρουργική, Καρδιολογική, Ορθοπαιδική, Οφθαλμολογική, ΩΡΛ.

3. ΓΝ ΣΙΣΜΑΝΟΓΛΕΙΟ (Σισμανογλείου 37, Μαρούσι) - Τηλ: 213 2058000
   Κλινικές: Παθολογικό, Πνευμονολογικό, Χειρουργικό, Ουρολογικό.

4. ΓΝ ΠΑΙΔΩΝ «Η ΑΓΙΑ ΣΟΦΙΑ» (Θηβών & Παπαδιαμαντοπούλου, Γουδή) - Τηλ: 213 2013000
   Παιδιατρική εφημερία: 14:30 - 08:00 επομένης. Κάλυψη όλων των παιδιατρικών επειγόντων περιστατικών.

5. ΓΝ ΜΑΙΕΥΤΗΡΙΟ «ΕΛΕΝΑ ΒΕΝΙΖΕΛΟΥ» (Πλατεία Έλενας Βενιζέλου 2) - Τηλ: 213 2051000
   24ωρη εφημερία: Μαιευτικό, Γυναικολογικό, Νεογνολογικό.

6. ΟΦΘΑΛΜΙΑΤΡΕΙΟ ΑΘΗΝΩΝ (Πανεπιστημίου 26) - Τηλ: 213 2052000
   Οφθαλμολογικά επείγοντα: 14:30 - 06:00.
`;

export const PdfScraperModal: React.FC<PdfScraperModalProps> = ({
  isOpen,
  onClose,
  lang,
  onHospitalsUpdated
}) => {
  const isEl = lang === 'el';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    count: number;
    source: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setError(isEl ? 'Παρακαλούμε επιλέξτε αρχείο μορφής PDF.' : 'Please select a valid PDF file.');
        return;
      }
      setPdfFile(file);
      setError(null);
    }
  };

  const handleLoadSample = () => {
    setActiveTab('text');
    setTextContent(SAMPLE_GREEK_SCHEDULE_TEXT);
    setError(null);
  };

  const handleScrapeAndNormalize = async () => {
    setError(null);
    setIsProcessing(true);
    setSuccessResult(null);

    try {
      let bodyPayload: any = {};

      if (activeTab === 'upload' && pdfFile) {
        // Read file as Base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(pdfFile);
        });

        bodyPayload = {
          pdfBase64: base64,
          sourceName: pdfFile.name
        };
      } else if (textContent.trim()) {
        bodyPayload = {
          textContent: textContent.trim(),
          sourceName: 'Επίσημο Κείμενο Εφημεριών'
        };
      } else {
        throw new Error(
          isEl 
            ? 'Παρακαλούμε ανεβάστε ένα PDF αρχείο ή εισάγετε το κείμενο του προγράμματος.' 
            : 'Please upload a PDF file or enter schedule text.'
        );
      }

      const response = await fetch('/api/scrape-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to normalize schedule');
      }

      // Fetch refreshed database
      const hospRes = await fetch('/api/hospitals');
      const hospData = await hospRes.json();
      if (hospData.hospitals) {
        onHospitalsUpdated(hospData.hospitals);
      }

      setSuccessResult({
        count: data.normalizedCount || data.normalizedHospitals?.length || 0,
        source: data.source || 'Official Document'
      });
    } catch (err: any) {
      console.error('Scraping error:', err);
      setError(err.message || (isEl ? 'Σφάλμα κατά την ανάλυση του εγγράφου.' : 'Error parsing the document.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetDatabase = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/hospitals/reset', { method: 'POST' });
      const data = await res.json();
      if (data.hospitals) {
        onHospitalsUpdated(data.hospitals);
      }
      setSuccessResult({
        count: data.hospitals.length,
        source: isEl ? 'Επαναφορά Επίσημης Βάσης' : 'Standard Official Roster'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {isEl 
                ? 'Εξαγωγή & Κανονικοποίηση Επίσημου PDF' 
                : 'Scrape & Normalize Official Schedule PDF'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEl 
                ? 'Αυτόματη μετατροπή ανακοινώσεων Υπουργείου Υγείας / ΥΠΕ σε δομημένη βάση' 
                : 'Transform Ministry of Health & YPE duty schedules into a searchable database'}
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'upload'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isEl ? 'Αρχείο PDF' : 'Upload PDF'}
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'text'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isEl ? 'Επικόλληση Κειμένου / Πίνακα' : 'Paste Text / Table'}
          </button>
        </div>

        {/* Tab 1: Upload PDF */}
        {activeTab === 'upload' && (
          <div className="space-y-3 mb-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-indigo-50/40 transition group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 mx-auto mb-2 transition" />
              {pdfFile ? (
                <div>
                  <p className="text-sm font-bold text-indigo-700">{pdfFile.name}</p>
                  <p className="text-xs text-slate-500">
                    {(pdfFile.size / 1024).toFixed(1)} KB &bull; {isEl ? 'Κάντε κλικ για αλλαγή' : 'Click to change'}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700">
                    {isEl ? 'Σύρετε ή επιλέξτε το PDF εφημεριών' : 'Drag & drop or browse the official PDF'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {isEl ? 'Επίσημα δελτία 1ης, 2ης ΥΠΕ, ΕΚΑΒ ή Υπουργείου Υγείας' : 'Official releases from 1st/2nd YPE or Health Ministry'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{isEl ? 'Δεν έχετε αρχείο PDF τώρα;' : 'Don’t have a PDF right now?'}</span>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>{isEl ? 'Φόρτωση Δείγματος ΥΠΕ' : 'Load Sample Schedule'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Paste Text */}
        {activeTab === 'text' && (
          <div className="space-y-3 mb-4">
            <textarea
              rows={6}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder={
                isEl 
                  ? 'Επικολλήστε εδώ το κείμενο ή τον πίνακα εφημεριών από την επίσημη ανακοίνωση...' 
                  : 'Paste the official duty roster announcement text or table here...'
              }
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-mono text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>{isEl ? 'Εισαγωγή Δείγματος 1ης ΥΠΕ' : 'Insert 1st YPE Sample'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div>
              <div className="font-bold">{isEl ? 'Σφάλμα' : 'Error'}</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Success message */}
        {successResult && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <div className="font-bold">
                {isEl ? 'Επιτυχής Κανονικοποίηση!' : 'Successfully Normalized!'}
              </div>
              <div className="text-emerald-700">
                {isEl 
                  ? `Ενημερώθηκαν επιτυχώς ${successResult.count} νοσοκομεία στην αναζήτηση και στον χάρτη.` 
                  : `Updated ${successResult.count} hospitals in the searchable map database.`}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={handleResetDatabase}
            disabled={isProcessing}
            className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isEl ? 'Επαναφορά Αρχικών' : 'Reset to Default'}</span>
          </button>

          <button
            id="start-scrape-btn"
            type="button"
            onClick={handleScrapeAndNormalize}
            disabled={isProcessing || (activeTab === 'upload' && !pdfFile && !textContent)}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{isEl ? 'Κανονικοποίηση με AI...' : 'Normalizing with AI...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>{isEl ? 'Ανάλυση & Εισαγωγή' : 'Scrape & Normalize'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
