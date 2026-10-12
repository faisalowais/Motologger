import { Vehicle, ComponentItem } from '../types';

/**
 * Dynamically recalculates component wear percentages, remaining km,
 * and overall rig telemetry according to the current odometer input.
 */
export function recalculateVehicleTelemetry(vehicle: Vehicle, newOdometer: number): Vehicle {
  const updatedComponents: ComponentItem[] = vehicle.components.map((comp) => {
    // Distance traveled since component was last serviced / changed
    const usedKm = Math.max(0, newOdometer - comp.lastChangedOdo);
    const remainingKm = Math.max(0, comp.intervalKm - usedKm);
    const percentage = Math.min(100, Math.max(0, Math.round((usedKm / comp.intervalKm) * 100)));

    let status: 'healthy' | 'due_soon' | 'action_req' = 'healthy';
    let statusLabel = 'Good';

    if (percentage >= 90 || remainingKm <= 400) {
      status = 'action_req';
      statusLabel = 'Action Req.';
    } else if (percentage >= 65 || remainingKm <= 1500) {
      status = 'due_soon';
      statusLabel = 'Due Soon';
    } else {
      status = 'healthy';
      if (comp.id === 'drive-chain') statusLabel = 'Lubed';
      else if (comp.id === 'battery-voltage') statusLabel = '12.8V Good';
      else statusLabel = 'Nominal';
    }

    const nextDueOdo = comp.lastChangedOdo + comp.intervalKm;

    return {
      ...comp,
      usedKm,
      remainingKm,
      percentage,
      status,
      statusLabel,
      nextDueOdo,
    };
  });

  const healthyCount = updatedComponents.filter((c) => c.status === 'healthy').length;
  const dueSoonCount = updatedComponents.filter((c) => c.status === 'due_soon').length;
  const actionReqCount = updatedComponents.filter((c) => c.status === 'action_req').length;
  const healthPercent = updatedComponents.length
    ? Math.round((healthyCount / updatedComponents.length) * 100)
    : 90;

  // Next scheduled check milestone
  const remainingDistances = updatedComponents.map((c) => c.remainingKm).filter((k) => k > 0);
  const lowestRemaining = remainingDistances.length ? Math.min(...remainingDistances) : 1000;
  const nextMilestoneKm = newOdometer + lowestRemaining;
  const weeklyRate = vehicle.weeklyDeltaKm || 48;
  const nextDueDays = Math.max(1, Math.round((lowestRemaining / weeklyRate) * 7));

  return {
    ...vehicle,
    odometer: newOdometer,
    healthPercent,
    monitoredPartsCount: updatedComponents.length,
    healthyCount,
    dueSoonCount,
    actionReqCount,
    nextDueKm: lowestRemaining,
    nextDueDays,
    nextMilestoneKm,
    components: updatedComponents,
  };
}
