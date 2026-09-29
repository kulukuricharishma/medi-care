import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Pill,
  Archive,
  ShoppingBag,
  AlertTriangle,
  Store,
  User,
  Sparkles,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { StoreHome } from './StoreHome';
import { StoreMedicines } from './StoreMedicines';
import { StoreInventory } from './StoreInventory';
import { StoreLowStock } from './StoreLowStock';
import { StoreOrders } from './StoreOrders';
import { StoreDetails } from './StoreDetails';

interface StoreDashboardProps {
  onNavigateHome: () => void;
  activeSubTab?: string;
}

export const StoreDashboard: React.FC<StoreDashboardProps> = ({
  onNavigateHome,
  activeSubTab = 'dashboard',
}) => {
  const { currentStoreProfile, logout, setIsAIAssistantOpen, medicines, orders } = useApp();
  const [activeTab, setActiveTab] = useState(activeSubTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const storeMedicines = medicines.filter(m => m.storeId === currentStoreProfile?.storeId);
  const lowStockCount = storeMedicines.filter(m => m.stock < 10).length;
  const storeOrders = orders.filter(o => o.storeId === currentStoreProfile?.storeId);
  const pendingOrdersCount = storeOrders.filter(o => o.status === 'Pending').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'inventory', label: 'Inventory', icon: Archive },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'low-stock', label: 'Low Stock', icon: AlertTriangle, badge: lowStockCount, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'store-details', label: 'Store Details', icon: Store },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, isAction: true },
  ];

  const handleNavClick = (id: string, isAction?: boolean) => {
    if (isAction && id === 'ai-assistant') {
      setIsAIAssistantOpen(true);
      setMobileSidebarOpen(false);
      return;
    }
    setActiveTab(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs text-slate-900 truncate">{currentStoreProfile?.name}</h4>
            <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Pharmacy Portal
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.isAction)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.id === 'ai-assistant' ? 'text-amber-500' : 'text-slate-400'}`} />
                <span className="flex-1 text-left">{item.label}</span>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-amber-700' : item.badgeColor || 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.id === 'ai-assistant' && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => {
              logout();
              onNavigateHome();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className="relative w-64 bg-white flex flex-col h-full shadow-2xl z-10">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">Pharmacy Navigation</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.isAction)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs"
          >
            <Menu className="w-4 h-4" />
            <span className="capitalize">{activeTab.replace('-', ' ')}</span>
          </button>
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-1 rounded-md">
            Medical Store Portal
          </span>
        </div>

        {activeTab === 'dashboard' && <StoreHome onTabChange={tab => setActiveTab(tab)} />}
        {activeTab === 'medicines' && <StoreMedicines />}
        {activeTab === 'inventory' && <StoreInventory />}
        {activeTab === 'orders' && <StoreOrders />}
        {activeTab === 'low-stock' && <StoreLowStock />}
        {(activeTab === 'store-details' || activeTab === 'profile') && <StoreDetails />}
      </main>
    </div>
  );
};
