
export enum AttackType {
  SQLi = 'SQLi',
  XSS = 'XSS',
  RCE = 'RCE',
  DDoS = 'DDoS',
  None = 'None',
}

export enum ImpactLevel {
  Safe = 'SAFE',
  Attempt = 'FAILED ATTEMPT',
  Breach = 'SUCCESSFUL BREACH',
}

export interface LogEntry {
  id: string;
  timestamp: string;
  sourceIp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  statusCode: number;
  attackType: AttackType;
  impact: ImpactLevel;
  details?: {
    headers: Record<string, string>;
    payload?: string;
    userAgent: string;
  };
}

export interface MetricStats {
  totalRequests: number;
  threatsBlocked: number;
  criticalBreaches: number;
  trafficVolume: { time: string; value: number }[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface TimeSeriesDataPoint {
  time: string;
  traffic: number;
  threats: number;
}
