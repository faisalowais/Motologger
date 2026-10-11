export interface ComponentItem {
  id: string;
  name: string;
  category: 'Engine' | 'Chassis' | 'Electrical' | 'Consumables';
  spec: string;
  intervalKm: number;
  intervalMonths?: number;
  usedKm: number;
  remainingKm: number;
  percentage: number; // wear percentage (e.g. 73%)
  status: 'healthy' | 'due_soon' | 'action_req';
  statusLabel?: string;
  icon: string;
  lastChangedDate: string;
  lastChangedOdo: number;
  nextDueDate: string;
  nextDueOdo: number;
  specDetail: string;
  capacity: string;
  critical?: boolean;
}

export interface AttachmentItem {
  id: string;
  name: string;
  type: string;
  size?: string;
  url: string;
  label?: string;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: string;
  odometer: number;
  title: string;
  action: 'Replaced' | 'Inspected' | 'Cleaned' | 'Lubricated' | 'Topped Up';
  targetComponent: string;
  description: string;
  partsCost: number;
  labourCost: number;
  isDiy: boolean;
  oilBrand?: string;
  oilViscosity?: string;
  fluidQty?: number;
  filterReplaced?: boolean;
  strainerCleaned?: boolean;
  attachments?: AttachmentItem[];
}

export interface Vehicle {
  id: string;
  name: string;
  shortName: string;
  vin: string;
  year: number;
  displacement: string;
  category: string;
  odometer: number;
  weeklyDeltaKm: number;
  lastServiceDate: string;
  lastServiceOdo: number;
  totalSpend: number;
  serviceCount: number;
  nextDueKm: number;
  nextDueDays: number;
  nextMilestoneKm: number;
  healthPercent: number;
  monitoredPartsCount: number;
  healthyCount: number;
  dueSoonCount: number;
  actionReqCount: number;
  photoUrl?: string;
  components: ComponentItem[];
  serviceHistory: ServiceRecord[];
}
