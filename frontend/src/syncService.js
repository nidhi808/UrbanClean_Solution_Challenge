// Super-Sync Service for UrbanClean Hackathon Demo
// This allows Citizen and Admin to sync data locally even without a database connection.

const SYNC_CHANNEL = 'urbanclean_demo_sync';
const broadcast = new BroadcastChannel(SYNC_CHANNEL);

export const broadcastReport = (reportData) => {
    console.log("Super-Sync: Broadcasting report...", reportData);
    broadcast.postMessage({ type: 'NEW_REPORT', data: reportData });
    
    // Also save to localStorage as backup
    const existing = JSON.parse(localStorage.getItem('urbanclean_temp_reports') || '[]');
    localStorage.setItem('urbanclean_temp_reports', JSON.stringify([reportData, ...existing]));
};

export const subscribeToReports = (callback) => {
    const handler = (event) => {
        if (event.data.type === 'NEW_REPORT') {
            console.log("Super-Sync: Received new report!");
            callback(event.data.data);
        }
    };
    broadcast.addEventListener('message', handler);
    return () => broadcast.removeEventListener('message', handler);
};

export const getLocalBackupReports = () => {
    return JSON.parse(localStorage.getItem('urbanclean_temp_reports') || '[]');
};
