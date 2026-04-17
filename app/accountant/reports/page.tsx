import { FileText, Download, Calendar } from 'lucide-react';

export default function AccountantReportsPage() {
  const reportTypes = [
    { id: '1', title: 'Daily Expense & Income', desc: 'Summary of all transactions for the current day.' },
    { id: '2', title: 'Daily Members Report', desc: 'List of members who worked today and their pay.' },
    { id: '3', title: 'Pending Transactions', desc: 'Pending salaries, vendor payments, and deposits.' },
  ];

  return (
    <div className="p-6 md:p-12 text-white font-sans max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <FileText className="text-purple-400" />
            Generate Reports
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Export financial and operational data in PDF format.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold mb-4">Available Reports</h2>
          {reportTypes.map((report) => (
            <div key={report.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors">
              <div>
                <h3 className="font-bold text-white mb-1">{report.title}</h3>
                <p className="text-sm text-gray-400">{report.desc}</p>
              </div>
              <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-2 px-4 rounded-xl hover:opacity-90 transition-opacity">
                <Download size={16} />
                <span>PDF</span>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl h-fit">
          <h2 className="text-lg font-bold mb-4">Custom Range</h2>
          <div className="space-y-4">
             <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Start Date</label>
                <div className="flex bg-black/40 border border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
                   <div className="p-3 text-gray-500 flex items-center justify-center bg-white/5">
                      <Calendar size={16} />
                   </div>
                   <input type="date" className="bg-transparent border-none text-sm text-white p-3 w-full focus:outline-none" />
                </div>
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">End Date</label>
                <div className="flex bg-black/40 border border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
                   <div className="p-3 text-gray-500 flex items-center justify-center bg-white/5">
                      <Calendar size={16} />
                   </div>
                   <input type="date" className="bg-transparent border-none text-sm text-white p-3 w-full focus:outline-none" />
                </div>
             </div>
             <button className="w-full mt-2 flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-bold py-3 px-4 rounded-xl hover:bg-white/20 transition-colors">
               <span>Generate Custom Report</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
