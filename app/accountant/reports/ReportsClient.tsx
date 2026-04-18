'use client';

import { useState } from 'react';
import { FileText, Download, Calendar, Filter, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type DateFilter = 'all_time' | 'today' | 'this_week' | 'this_month' | 'this_year' | 'specific_date' | 'custom_range';

const LOGO_URL = "https://mevertpazkjitrocmqac.supabase.co/storage/v1/object/public/assets/heroimage.png";

interface ReportsClientProps {
  income: any[];
  expenses: any[];
  workerData: any[];
  eventData: any[];
}

export default function ReportsClient({ income, expenses, workerData, eventData }: ReportsClientProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all_time');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [specificDate, setSpecificDate] = useState('');

  const reportTypes = [
    { id: 'financial', title: 'Expense and Income', desc: 'Detailed financial statement with source breakdown.' },
    { id: 'controllers', title: 'Controllers Report', desc: 'Operational overview of event controllers.' },
    { id: 'members', title: 'Members Report', desc: 'Detailed work history and payroll for members.' },
    { id: 'pending', title: 'Pending Transactions', desc: 'Outstanding balances and upcoming payments.' },
  ];

  const getFilteredData = (data: any[], dateField: string = 'date') => {
    const now = new Date();
    let from: Date | null = null;
    let to: Date | null = null;

    if (dateFilter === 'today') {
      from = new Date();
      from.setHours(0,0,0,0);
      to = new Date();
      to.setHours(23,59,59,999);
    } else if (dateFilter === 'this_week') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      from = new Date(now.setDate(diff));
      from.setHours(0,0,0,0);
    } else if (dateFilter === 'this_month') {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (dateFilter === 'this_year') {
      from = new Date(now.getFullYear(), 0, 1);
    } else if (dateFilter === 'specific_date' && specificDate) {
      from = new Date(specificDate);
      from.setHours(0,0,0,0);
      to = new Date(specificDate);
      to.setHours(23,59,59,999);
    } else if (dateFilter === 'custom_range' && startDate && endDate) {
      from = new Date(startDate);
      from.setHours(0,0,0,0);
      to = new Date(endDate);
      to.setHours(23,59,59,999);
    }

    return data.filter(item => {
      const fieldVal = item[dateField] || (item.events && item.events[dateField]);
      if (!fieldVal) return true;
      const d = new Date(fieldVal);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  };

  const generatePDF = async (type: string) => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 15;

    // Header Branding: Logo Image (Hero Image / Typography)
    try {
      const imgWidth = 50; 
      const imgHeight = 25;
      const xPos = (pageWidth - imgWidth) / 2;
      doc.addImage(LOGO_URL, 'PNG', xPos, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 5;
    } catch (e) {
      doc.setFontSize(22);
      doc.setTextColor(220, 38, 38);
      doc.text('LOTUS EVENTS', pageWidth / 2, currentY + 10, { align: 'center' });
      currentY += 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    const reportTitle = reportTypes.find(r => r.id === type)?.title || 'Report';
    doc.text(reportTitle.toUpperCase(), pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;
    
    doc.setFontSize(9);
    const dateRangeStr = dateFilter === 'all_time' ? 'Full Archive' : `${dateFilter.replace('_', ' ').toUpperCase()} (${startDate || specificDate || 'Present'}${endDate ? ' to ' + endDate : ''})`;
    doc.text(`Generated: ${new Date().toLocaleString()} | Period: ${dateRangeStr}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 5;
    
    doc.setDrawColor(200);
    doc.line(20, currentY, pageWidth - 20, currentY);
    currentY += 10;

    if (type === 'financial') {
      const fIncome = getFilteredData(income);
      const fExpenses = getFilteredData(expenses);
      
      const totalInc = fIncome.reduce((s, i) => s + (i.total_income || 0), 0);
      const totalExp = fExpenses.reduce((s, i) => s + (i.amount || 0), 0);

      // Financial Summary Box
      doc.setFillColor(245, 245, 245);
      doc.rect(20, currentY, pageWidth - 40, 25, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(`FINANCIAL SUMMARY (${dateFilter.toUpperCase()})`, 25, currentY + 7);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Total Income: Rs. ${totalInc.toLocaleString()}`, 25, currentY + 15);
      doc.text(`Total Expense: Rs. ${totalExp.toLocaleString()}`, 85, currentY + 15);
      doc.setFont('helvetica', 'bold');
      doc.text(`Net Profit: Rs. ${(totalInc - totalExp).toLocaleString()}`, 145, currentY + 15);
      currentY += 35;

      const incRows = fIncome.map(i => [new Date(i.date).toLocaleDateString(), i.event_name || 'Direct Deposit', `Rs. ${i.total_income}`, 'Income from Client/Event']);
      const expRows = fExpenses.map(e => [new Date(e.date).toLocaleDateString(), e.description, `Rs. ${e.amount}`, e.category || 'General Expense']);

      doc.setFontSize(12);
      doc.text('Detailed Income Breakdown', 20, currentY);
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Date', 'Source / Event', 'Amount', 'Description']],
        body: incRows,
        headStyles: { fillColor: [5, 150, 105] },
        margin: { left: 20, right: 20 },
      });

      const lastTable = (doc as any).lastAutoTable;
      currentY = (lastTable?.finalY || currentY + 20) + 15;
      doc.text('Detailed Expense History', 20, currentY);
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Date', 'Purpose / Item', 'Amount', 'Category']],
        body: expRows,
        headStyles: { fillColor: [220, 38, 38] },
        margin: { left: 20, right: 20 },
      });
    } 
    else if (type === 'controllers') {
      const fEvents = getFilteredData(eventData);
      const rows = fEvents.map(e => {
        // Aggregate worker data for this specific event
        const eventWorkers = workerData.filter(w => w.event_id === e.id);
        const totalWage = eventWorkers.reduce((sum, w) => sum + (Number(w.wage_amount) || 0), 0);
        const totalTa = eventWorkers.reduce((sum, w) => sum + (Number(w.work_units) || 0), 0);
        const totalPaid = eventWorkers.reduce((sum, w) => sum + (Number(w.paid_amount) || 0), 0);
        const totalPending = eventWorkers.reduce((sum, w) => sum + (Number(w.pending_amount) || 0), 0);

        const ctrlNames = e.event_controllers
          ?.map((ec: any) => ec.controllers?.users?.name)
          .filter(Boolean)
          .join(', ') || 'Unassigned';

        return [
          new Date(e.date).toLocaleDateString(),
          e.event_name,
          ctrlNames,
          e.location || 'N/A',
          `Rs. ${totalWage + totalTa}`,
          `Rs. ${totalPaid}`,
          `Rs. ${totalTa}`,
          `Rs. ${totalPending}`
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [['Date', 'Event Name', 'Controller', 'Venue', 'Total', 'Paid', 'TA', 'Pending']],
        body: rows,
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 8 }, // Smaller font to fit more columns
        margin: { left: 15, right: 15 },
      });
    }
    else if (type === 'members') {
      const fWorkers = getFilteredData(workerData, 'date');
      const rows = fWorkers.map(w => {
        const wage = Number(w.wage_amount) || 0;
        const ta = Number(w.work_units) || 0;
        return [
          w.workers?.users?.name || 'N/A',
          w.events?.event_name || 'Direct / Office',
          new Date(w.events?.date || w.created_at).toLocaleDateString(),
          `Rs. ${wage + ta}`,
          `Rs. ${w.paid_amount || 0}`,
          `Rs. ${ta}`,
          `Rs. ${w.pending_amount || 0}`
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [['Member Name', 'Event / Job', 'Date', 'Total', 'Paid', 'TA', 'Pending']],
        body: rows,
        headStyles: { fillColor: [5, 150, 105] },
        styles: { fontSize: 8 },
        margin: { left: 15, right: 15 },
      });
    }
    else if (type === 'pending') {
      const fWorkers = workerData.filter(w => (Number(w.pending_amount) || 0) > 0);
      const rows = fWorkers.map(w => {
        const wage = Number(w.wage_amount) || 0;
        const ta = Number(w.work_units) || 0;
        const eventDate = w.events?.date ? new Date(w.events.date).toLocaleDateString() : 'N/A';
        return [
          w.workers?.users?.name || 'N/A',
          w.events?.event_name || 'External',
          eventDate,
          `Rs. ${wage + ta}`,
          `Rs. ${ta}`,
          `Rs. ${w.pending_amount || 0}`,
          w.workers?.users?.phone || 'N/A'
        ];
      });

      autoTable(doc, {
        startY: currentY,
        head: [['Payee', 'Reference', 'Date', 'Total Value', 'TA', 'Owed Balance', 'Contact']],
        body: rows,
        headStyles: { fillColor: [220, 38, 38] },
        styles: { fontSize: 8 },
        margin: { left: 15, right: 15 },
      });
    }

    doc.save(`Lotus_Report_${type}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="p-6 md:p-12 text-white font-sans max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-4">
            <span className="p-3 bg-purple-500/10 rounded-2xl ring-1 ring-purple-500/20">
              <FileText className="text-purple-400 w-8 h-8" />
            </span>
            Generate Reports
          </h1>
          <p className="text-gray-400 mt-3 text-sm">Export financial and operational data with custom filters.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection & Filters */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl h-fit space-y-8 backdrop-blur-md">
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <Filter size={14} /> Selection Period
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {(['all_time', 'today', 'this_week', 'this_month', 'this_year', 'specific_date', 'custom_range'] as DateFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setDateFilter(f)}
                  className={`w-full text-left px-5 py-3 rounded-2xl text-sm font-medium transition-all border ${
                    dateFilter === f 
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_20px_-10px_rgba(168,85,247,0.4)]' 
                      : 'bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/5 select-none'
                  }`}
                >
                  {f === 'all_time' ? 'All Time Historical Data' : 
                   f === 'today' ? 'Daily Report (Today)' :
                   f === 'this_week' ? 'Weekly Overview' :
                   f === 'this_month' ? 'Monthly Summary' :
                   f === 'this_year' ? 'Annual Performance' :
                   f === 'specific_date' ? 'Choose Specific Day' : 'Custom Date Range'}
                </button>
              ))}
            </div>
          </section>

          {/* Conditional Date Inputs */}
          {dateFilter === 'specific_date' && (
            <section className="animate-in fade-in slide-in-from-top-2 duration-300">
               <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest pl-1">Select Date</label>
               <input 
                 type="date" 
                 value={specificDate}
                 onChange={(e) => setSpecificDate(e.target.value)}
                 className="w-full bg-black/40 border border-white/10 rounded-2xl text-sm text-white p-4 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all" 
               />
            </section>
          )}

          {dateFilter === 'custom_range' && (
            <section className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div>
                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest pl-1">Start Date</label>
                 <input 
                   type="date" 
                   value={startDate}
                   onChange={(e) => setStartDate(e.target.value)}
                   className="w-full bg-black/40 border border-white/10 rounded-2xl text-sm text-white p-4 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all" 
                 />
              </div>
              <div>
                 <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest pl-1">End Date</label>
                 <input 
                   type="date" 
                   value={endDate}
                   onChange={(e) => setEndDate(e.target.value)}
                   className="w-full bg-black/40 border border-white/10 rounded-2xl text-sm text-white p-4 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all" 
                 />
              </div>
            </section>
          )}
        </div>

        {/* Report Types List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 pl-2">Available System Reports</h2>
          <div className="grid grid-cols-1 gap-4">
            {reportTypes.map((report) => (
              <div 
                key={report.id} 
                className="group bg-white/[0.03] border border-white/10 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.06] transition-all duration-500 hover:border-white/20"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{report.title}</h3>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-500 transition-all group-hover:translate-x-1" />
                  </div>
                  <p className="text-sm text-gray-500 max-w-md leading-relaxed">{report.desc}</p>
                </div>
                
                <button 
                  onClick={() => generatePDF(report.id)}
                  className="flex items-center justify-center gap-3 bg-white text-black font-black py-4 px-8 rounded-2xl hover:bg-purple-500 hover:text-white transition-all transform hover:scale-[1.02] shadow-xl text-xs uppercase tracking-widest active:scale-95"
                >
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-purple-500/5 border border-purple-500/10 rounded-3xl flex items-start gap-4">
            <div className="p-2 bg-purple-500/20 rounded-xl">
               <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div className="space-y-1">
               <p className="text-sm font-semibold text-purple-300">Automatic Filtering Active</p>
               <p className="text-xs text-gray-500 leading-relaxed">Generated reports will automatically include only transactions and records that fall within your selected selection period above.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
