import React from 'react';
import { Bell, Trash2, CheckCircle2, Filter } from 'lucide-react';
import { useNotificationContext } from '@/context/notification-provider';
import { format } from 'date-fns';

const NotificationsPage = () => {
  const { notifications, markAllAsRead, clearAll } = useNotificationContext();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Activity Notifications</h1>
          <p className="text-slate-500 text-sm">Stay updated with your latest interactions.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <CheckCircle2 size={18} /> Mark all read
          </button>
          <button 
            onClick={clearAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
          >
            <Trash2 size={18} /> Clear
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {notifications.length > 0 ? (
          <div className="divide-y dark:divide-slate-800">
            {notifications.map((notif: any) => (
              <div 
                key={notif._id} 
                className={`p-6 flex items-start gap-4 transition-all ${!notif.isRead ? 'bg-blue-50/20' : ''}`}
              >
                <div className={`p-3 rounded-2xl ${!notif.isRead ? 'bg-[#FF6B35]/10 text-[#FF6B35]' : 'bg-slate-100 text-slate-400'}`}>
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold dark:text-white">{notif.title}</h4>
                    <span className="text-[11px] text-slate-400 font-medium bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                      {format(new Date(notif.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Bell size={40} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-bold dark:text-white">No notifications yet</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              When you get mentioned or receive messages, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;