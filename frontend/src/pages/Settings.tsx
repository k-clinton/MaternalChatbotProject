

export default function Settings() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-maternal-900">Settings</h1>
        <p className="text-maternal-600 mt-2">Manage your profile and preferences.</p>
      </header>
      
      <div className="bg-white rounded-2xl shadow-sm border border-maternal-100 max-w-2xl overflow-hidden divide-y divide-maternal-100">
         <div className="p-8 pb-6">
           <h3 className="text-lg font-semibold text-maternal-900 mb-4">Notifications</h3>
           <div className="space-y-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="font-medium text-maternal-800">Email Alerts</p>
                 <p className="text-sm text-maternal-500">Receive weekly pregnancy updates via email</p>
               </div>
               <div className="w-11 h-6 bg-maternal-600 rounded-full relative cursor-pointer">
                 <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
               </div>
             </div>
             <div className="flex items-center justify-between">
               <div>
                 <p className="font-medium text-maternal-800">SMS Reminders</p>
                 <p className="text-sm text-maternal-500">Get text reminders for upcoming appointments</p>
               </div>
               <div className="w-11 h-6 bg-maternal-200 rounded-full relative cursor-pointer">
                 <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
               </div>
             </div>
           </div>
         </div>
         
         <div className="p-8 pt-6">
           <h3 className="text-lg font-semibold text-maternal-900 mb-4">Account</h3>
           <div className="space-y-4">
             <button className="text-maternal-600 font-medium hover:text-maternal-800 transition-colors">
               Change Password
             </button>
             <br />
             <button className="text-red-600 font-medium hover:text-red-800 transition-colors">
               Sign Out
             </button>
           </div>
         </div>
      </div>
    </div>
  );
}
