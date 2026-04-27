import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { MapPin, AlertTriangle, CheckCircle, Clock, XCircle, Activity, Image as ImageIcon } from 'lucide-react';

const ReportsScreen = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'issues'), (snapshot) => {
      const fetchedReports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      fetchedReports.sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      });
      setReports(fetchedReports);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching reports:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const reportRef = doc(db, 'issues', id);
      await updateDoc(reportRef, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error updating status");
    }
  };

  const filteredReports = filter === 'All' ? reports : reports.filter(r => {
    const status = r.status?.toLowerCase() || 'pending';
    const filterStatus = filter.toLowerCase();
    if (filterStatus === 'pending' || filterStatus === 'unsolved') {
        return status === 'pending' || status === 'unsolved';
    }
    return status === filterStatus;
  });

  const getHotspots = () => {
    const locationCounts = {};
    reports.forEach(r => {
      if (!r.location) return;
      const area = r.location.split(',')[0];
      if (!locationCounts[area]) {
         locationCounts[area] = { count: 0, types: new Set(), fullLocation: r.location };
      }
      locationCounts[area].count += 1;
      locationCounts[area].types.add(r.type);
    });

    return Object.entries(locationCounts)
      .filter(([loc, data]) => data.count >= 2)
      .map(([loc, data]) => ({ location: loc, count: data.count, types: Array.from(data.types).join(', '), fullLocation: data.fullLocation }));
  };

  const hotspots = getHotspots();

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'solved': return 'bg-brand-green/20 text-brand-green border-brand-green/30';
      case 'ongoing': return 'bg-brand-blue/20 text-brand-blue border-brand-blue/30';
      case 'reject': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'solved': return <CheckCircle size={14} />;
      case 'ongoing': return <Activity size={14} />;
      case 'reject': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar relative z-10 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Issue Management</h1>
            <p className="text-sm text-gray-400 mt-1">Review and track citizen reports in real-time.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-400">Filter:</span>
            <div className="flex gap-2 p-1 bg-dark-800 rounded-xl border border-white/5 overflow-x-auto">
              {['All', 'Pending', 'Ongoing', 'Solved', 'Reject', 'Unsolved'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    (filter === status || (filter === 'Pending' && status === 'Unsolved') || (filter === 'Unsolved' && status === 'Pending'))
                      ? 'bg-white/10 text-white shadow-md border border-white/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hotspots.length > 0 && (
          <div className="glass-panel border-red-500/30 bg-gradient-to-r from-red-500/10 to-dark-900 p-5 animate-pulse">
            <h3 className="text-red-400 font-bold flex items-center gap-2 mb-3">
              <AlertTriangle size={18} />
              AI Hotspot Detection Alert
            </h3>
            <div className="flex flex-col gap-2">
              {hotspots.map((hotspot, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-gray-300 bg-black/40 p-3 rounded-lg border border-red-500/20">
                  <span className="bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-md">{hotspot.count} Reports</span>
                  <span>Repeated issues (<strong className="text-white">{hotspot.types}</strong>) near <strong className="text-white">{hotspot.location}</strong>.</span>
                  <span className="text-brand-blue ml-auto cursor-pointer hover:underline text-xs">View on Map</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20 text-brand-green">
            <Activity className="animate-pulse" size={32} />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-20 glass-panel">
            <CheckCircle className="mx-auto text-gray-500 mb-3" size={32} />
            <h3 className="text-lg font-medium text-white">No reports found</h3>
            <p className="text-gray-400">No issues matching '{filter}'.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              const area = report.location?.split(',')[0];
              const isHotspot = hotspots.some(h => h.location === area);
              
              return (
                <div key={report.id} className={`glass-panel overflow-hidden flex flex-col transition-all hover:border-white/20 hover:shadow-xl ${isHotspot ? 'border-red-500/30' : ''}`}>
                  <div className="relative h-48 bg-dark-800">
                    {report.image_url ? (
                      <img src={report.image_url} alt="Issue" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-600"><ImageIcon size={32} /></div>
                    )}
                    
                    {isHotspot && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold shadow-lg animate-bounce z-20">
                        <AlertTriangle size={12} /> REPEATED
                      </div>
                    )}

                    <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-lg ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      {report.status?.toUpperCase() || 'PENDING'}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white uppercase tracking-wide">{report.type}</h3>
                      {report.ai_analysis?.severity && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          report.ai_analysis.severity === 'high' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                          report.ai_analysis.severity === 'medium' ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' :
                          'text-green-400 border-green-500/30 bg-green-500/10'
                        }`}>{report.ai_analysis.severity}</span>
                      )}
                    </div>
                    
                    <div className="flex items-start gap-2 text-sm text-gray-400 mb-4">
                      <MapPin size={16} className="text-brand-blue shrink-0 mt-0.5" />
                      <p className="line-clamp-2 leading-relaxed">{report.location || 'Unknown'}</p>
                    </div>
                    
                    <div className="bg-dark-800 rounded-lg p-3 border border-white/5 mb-4">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Citizen Notes</p>
                      <p className="text-sm text-gray-300 italic line-clamp-3">"{report.description || 'N/A'}"</p>
                    </div>

                    {report.ai_analysis && (
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg p-2 text-center">
                          <span className="block text-[10px] text-brand-blue font-bold">Area</span>
                          <span className="text-sm text-white">{report.ai_analysis.area} m²</span>
                        </div>
                        <div className="bg-brand-green/10 border border-brand-green/20 rounded-lg p-2 text-center">
                          <span className="block text-[10px] text-brand-green font-bold">Material</span>
                          <span className="text-sm text-white">{report.ai_analysis.materialReq} kg</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">
                        {report.timestamp?.seconds ? new Date(report.timestamp.seconds * 1000).toLocaleDateString() : 'Recent'}
                      </span>
                      
                      <select 
                        className="bg-dark-900 border border-white/10 text-xs text-white rounded-md px-2 py-1.5 outline-none hover:border-brand-blue transition-colors cursor-pointer"
                        value={report.status || 'pending'}
                        onChange={(e) => handleStatusChange(report.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="solved">Solved</option>
                        <option value="reject">Reject</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsScreen;
