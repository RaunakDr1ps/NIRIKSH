export function formatNumber(value: number, decimals: number = 2): string {
  return Number(value).toFixed(decimals);
}

export function formatRPM(value: number): string {
  return `${formatNumber(value / 1000, 1)}k`;
}

export function formatPressure(value: number): string {
  if (value >= 1e6) return `${formatNumber(value / 1e6, 2)} MPa`;
  if (value >= 1e3) return `${formatNumber(value / 1e3, 1)} kPa`;
  return `${formatNumber(value, 0)} Pa`;
}

export function formatTemperature(value: number): string {
  return `${formatNumber(value, 1)} K`;
}

export function formatFuelFlow(value: number): string {
  return `${formatNumber(value, 3)} kg/s`;
}

export function formatThrust(value: number): string {
  if (value >= 1e3) return `${formatNumber(value / 1e3, 1)} kN`;
  return `${formatNumber(value, 0)} N`;
}

export function formatTSFC(value: number): string {
  return `${formatNumber(value, 2)} g/kN·s`;
}

export function formatPercentage(value: number): string {
  return `${formatNumber(value * 100, 1)}%`;
}

export function getHealthStatus(value: number): { label: string; color: string; dotClass: string } {
  if (value >= 0.8) return { label: 'Healthy', color: '#00ff88', dotClass: 'status-dot-green' };
  if (value >= 0.6) return { label: 'Attention', color: '#ffb300', dotClass: 'status-dot-yellow' };
  if (value >= 0.4) return { label: 'Warning', color: '#ff6a00', dotClass: 'status-dot-orange' };
  return { label: 'Critical', color: '#ff0040', dotClass: 'status-dot-red' };
}

export function getHealthBarColor(value: number): string {
  if (value >= 0.8) return '#00ff88';
  if (value >= 0.6) return '#ffb300';
  if (value >= 0.4) return '#ff6a00';
  return '#ff0040';
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
