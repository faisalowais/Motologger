import React, { useState, useEffect } from 'react';
import { Vehicle, ServiceRecord, ComponentItem } from './types';
import { INITIAL_VEHICLES } from './data';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { GarageScreen } from './screens/GarageScreen';
import { HealthScreen } from './screens/HealthScreen';
import { ComponentDetailScreen } from './screens/ComponentDetailScreen';
import { LogServiceScreen } from './screens/LogServiceScreen';
import { RecordsScreen } from './screens/RecordsScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { MoreScreen } from './screens/MoreScreen';
import { AttachmentModal } from './components/AttachmentModal';
import { AddVehicleModal } from './components/AddVehicleModal';
import { LoadingScreen } from './components/LoadingScreen';
import { UploadBikePhotoModal } from './components/UploadBikePhotoModal';

export default function App() {
  // Loading screen state
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted state or fallback
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem('motoledger_vehicles_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_VEHICLES;
  });

  const [activeTab, setActiveTab] = useState<TabType>('garage');
  const [activeStack, setActiveStack] = useState<'component-detail' | 'log-service' | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('xpulse-200-4v');
  const [selectedComponentId, setSelectedComponentId] = useState<string>('engine-oil');

  // Modals
  const [attachmentPreview, setAttachmentPreview] = useState<{ url: string; name: string } | null>(null);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isUploadPhotoOpen, setIsUploadPhotoOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('motoledger_vehicles_v1', JSON.stringify(vehicles));
    } catch {
      // ignore
    }
  }, [vehicles]);

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const currentComponent =
    currentVehicle.components.find((c) => c.id === selectedComponentId) ||
    currentVehicle.components[0];

  // Photo update handler
  const handleSaveVehiclePhoto = (photoUrl?: string) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === selectedVehicleId) {
          return {
            ...v,
            photoUrl,
          };
        }
        return v;
      })
    );
  };

  // Navigation handlers
  const handleSelectComponent = (compOptId: string) => {
    setSelectedComponentId(compOptId);
    setActiveStack('component-detail');
  };

  const handleOpenLogService = (compOptId?: string) => {
    if (compOptId) setSelectedComponentId(compOptId);
    setActiveStack('log-service');
  };

  const handleBackFromStack = () => {
    setActiveStack(null);
  };

  // Commit maintenance record
  const handleSaveRecord = (record: ServiceRecord, resetComponentId?: string) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id !== record.vehicleId) return v;

        const updatedOdo = Math.max(v.odometer, record.odometer);
        const updatedTotalSpend = v.totalSpend + record.partsCost + record.labourCost;
        const updatedServiceCount = v.serviceCount + 1;

        // Reset component wear if it was replaced or maintained
        const updatedComponents = v.components.map((comp) => {
          if (
            comp.id === resetComponentId ||
            comp.name.toLowerCase() === record.targetComponent.toLowerCase()
          ) {
            return {
              ...comp,
              percentage: record.action === 'Replaced' ? 5 : Math.max(10, comp.percentage - 40),
              status: 'healthy' as const,
              statusLabel: 'Fresh',
              usedKm: 0,
              remainingKm: comp.intervalKm,
              lastChangedDate: record.date,
              lastChangedOdo: record.odometer,
            };
          }
          return comp;
        });

        // Recalculate health counts
        const healthyCount = updatedComponents.filter((c) => c.status === 'healthy').length;
        const dueSoonCount = updatedComponents.filter((c) => c.status === 'due_soon').length;
        const actionReqCount = updatedComponents.filter((c) => c.status === 'action_req').length;
        const healthPercent = Math.round((healthyCount / updatedComponents.length) * 100);

        return {
          ...v,
          odometer: updatedOdo,
          lastServiceDate: record.date,
          lastServiceOdo: record.odometer,
          totalSpend: updatedTotalSpend,
          serviceCount: updatedServiceCount,
          healthyCount,
          dueSoonCount,
          actionReqCount,
          healthPercent,
          components: updatedComponents,
          serviceHistory: [record, ...v.serviceHistory],
        };
      })
    );

    // After slight delay, return to component detail or health
    setTimeout(() => {
      setActiveStack(null);
    }, 900);
  };

  // Add new vehicle
  const handleAddVehicle = (newV: Vehicle) => {
    setVehicles((prev) => [...prev, newV]);
    setSelectedVehicleId(newV.id);
  };

  // Reset to initial
  const handleResetData = () => {
    setVehicles(INITIAL_VEHICLES);
    setSelectedVehicleId('xpulse-200-4v');
    localStorage.removeItem('motoledger_vehicles_v1');
    setActiveStack(null);
    setActiveTab('garage');
  };

  // Export ledger
  const handleExportLedger = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(vehicles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `motoledger-fleet-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Get screen title
  const getHeaderTitle = () => {
    if (activeStack === 'component-detail') return 'Component Detail';
    if (activeStack === 'log-service') return 'Log Service';
    switch (activeTab) {
      case 'garage':
        return 'Garage';
      case 'health':
        return 'Health';
      case 'records':
        return 'Records';
      case 'insights':
        return 'Insights';
      case 'more':
        return 'Settings';
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e4e2e0] flex flex-col font-sans selection:bg-[#767777] selection:text-[#040505]">
      {/* Top Fixed Header */}
      <Header
        title={getHeaderTitle()}
        showBack={Boolean(activeStack)}
        onBack={handleBackFromStack}
        onProfileClick={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto pt-14 flex flex-col relative min-h-screen">
        {/* STACK SCREEN 1: Component Detail */}
        {activeStack === 'component-detail' && currentComponent && (
          <ComponentDetailScreen
            vehicle={currentVehicle}
            component={currentComponent}
            onBack={handleBackFromStack}
            onLogMaintenance={handleOpenLogService}
            onViewAttachment={(url, name) => setAttachmentPreview({ url, name })}
          />
        )}

        {/* STACK SCREEN 2: Log Service */}
        {activeStack === 'log-service' && (
          <LogServiceScreen
            vehicle={currentVehicle}
            preselectedComponentId={selectedComponentId}
            onBack={handleBackFromStack}
            onSaveRecord={handleSaveRecord}
          />
        )}

        {/* PRIMARY TAB SCREENS (when not in a stack view) */}
        {!activeStack && (
          <>
            {activeTab === 'garage' && (
              <GarageScreen
                vehicles={vehicles}
                currentVehicle={currentVehicle}
                onSelectVehicle={setSelectedVehicleId}
                onNavigateToHealth={() => setActiveTab('health')}
                onNavigateToRecords={() => setActiveTab('records')}
                onNavigateToLogService={() => handleOpenLogService()}
                onNavigateToComponent={handleSelectComponent}
                onAddVehicle={() => setIsAddVehicleOpen(true)}
                onUploadPhoto={() => setIsUploadPhotoOpen(true)}
              />
            )}

            {activeTab === 'health' && (
              <HealthScreen
                vehicles={vehicles}
                currentVehicle={currentVehicle}
                onSelectVehicle={setSelectedVehicleId}
                onSelectComponent={handleSelectComponent}
                onLogMaintenance={handleOpenLogService}
              />
            )}

            {activeTab === 'records' && (
              <RecordsScreen
                vehicle={currentVehicle}
                onLogMaintenance={() => handleOpenLogService()}
                onViewAttachment={(url, name) => setAttachmentPreview({ url, name })}
              />
            )}

            {activeTab === 'insights' && (
              <InsightsScreen vehicle={currentVehicle} allVehicles={vehicles} />
            )}

            {activeTab === 'more' && (
              <MoreScreen
                vehicle={currentVehicle}
                onAddVehicle={() => setIsAddVehicleOpen(true)}
                onResetData={handleResetData}
                onExportLedger={handleExportLedger}
                onShowLoadingScreen={() => setIsLoading(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation (visible on primary tabs, hidden when in stack view) */}
      {!activeStack && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setActiveStack(null);
          }}
        />
      )}

      {/* Loading Screen Overlay with Motorcycle Silhouette & 3 Animated Yellow Dots */}
      {isLoading && (
        <LoadingScreen
          durationMs={1800}
          message="CONNECTING RIG TELEMETRY"
          onComplete={() => setIsLoading(false)}
        />
      )}

      {/* Upload Motorcycle Photo Modal */}
      <UploadBikePhotoModal
        isOpen={isUploadPhotoOpen}
        bikeName={currentVehicle.name}
        currentPhotoUrl={currentVehicle.photoUrl}
        onClose={() => setIsUploadPhotoOpen(false)}
        onSavePhoto={handleSaveVehiclePhoto}
      />

      {/* Attachment / Receipt Full View Modal */}
      <AttachmentModal
        url={attachmentPreview?.url || null}
        name={attachmentPreview?.name || ''}
        onClose={() => setAttachmentPreview(null)}
      />

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onAdd={handleAddVehicle}
      />

      {/* Driver / Profile Drawer Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 bg-[#0e0e0e]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#1f201f] border border-[#2a2a29] rounded-2xl w-full max-w-sm p-4 flex flex-col gap-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#2a2a29]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#c6c6c6] flex items-center justify-center text-[#131313] font-bold">
                  <span className="material-symbols-outlined text-[22px]">person</span>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#e4e2e0]">Faisal Owais</h4>
                  <span className="text-[11px] text-[#8e9192]">Rider &amp; Workshop Master</span>
                </div>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="text-[#8e9192] hover:text-[#e4e2e0] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="text-[12px] text-[#8e9192] space-y-1.5 py-1">
              <div className="flex justify-between">
                <span>Account Email:</span>
                <span className="text-[#e4e2e0] font-mono">faisal.owais01@gmail.com</span>
              </div>
              <div className="flex justify-between">
                <span>Active Garage:</span>
                <span className="text-[#ffbb13] font-semibold">{vehicles.length} Motorcycles</span>
              </div>
              <div className="flex justify-between">
                <span>Total Fleet Kilometers:</span>
                <span className="text-[#e4e2e0] font-mono">
                  {vehicles.reduce((sum, v) => sum + v.odometer, 0).toLocaleString('en-IN')} km
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsProfileOpen(false)}
              className="w-full py-2.5 bg-[#2a2a29] hover:bg-[#353534] text-[#e4e2e0] text-[12px] font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
