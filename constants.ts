
import { AttackType, ImpactLevel, LogEntry, MetricStats, TimeSeriesDataPoint, ChartDataPoint } from './types';

export const MOCK_STATS: MetricStats = {
  totalRequests: 84392,
  threatsBlocked: 1245,
  criticalBreaches: 3, // Logic will trigger red pulse
  trafficVolume: Array.from({ length: 20 }, (_, i) => ({
    time: `${i}:00`,
    value: Math.floor(Math.random() * 500) + 200
  }))
};

export const MOCK_VECTOR_DATA: ChartDataPoint[] = [
  { name: 'SQL Injection', value: 45 },
  { name: 'XSS', value: 30 },
  { name: 'RCE', value: 15 },
  { name: 'DDoS', value: 10 },
];

export const MOCK_TRAFFIC_DATA: TimeSeriesDataPoint[] = Array.from({ length: 12 }, (_, i) => ({
  time: `${10 + i}:00`,
  traffic: Math.floor(Math.random() * 2000) + 1000,
  threats: Math.floor(Math.random() * 200) + 20,
}));

const METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

export const generateMockLogs = (count: number): LogEntry[] => {
  const now = Date.now();
  // Span logs over the last 12 hours to create a nice timeline
  const timeSpan = 12 * 60 * 60 * 1000; 

  return Array.from({ length: count }, (_, i) => {
    const isAttack = Math.random() > 0.7;
    const isBreach = isAttack && Math.random() > 0.85;
    
    let attackType = AttackType.None;
    let impact = ImpactLevel.Safe;

    if (isAttack) {
      const types = [AttackType.SQLi, AttackType.XSS, AttackType.RCE, AttackType.DDoS];
      attackType = types[Math.floor(Math.random() * types.length)];
      impact = isBreach ? ImpactLevel.Breach : ImpactLevel.Attempt;
    }

    return {
      id: `log-${i}-${Date.now()}`,
      // Distribute logs randomly over the timeSpan
      timestamp: new Date(now - Math.floor(Math.random() * timeSpan)).toISOString(),
      sourceIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      method: METHODS[Math.floor(Math.random() * METHODS.length)] as any,
      url: isAttack ? `/api/v1/user?id=1' OR '1'='1` : `/api/v1/products/${Math.floor(Math.random() * 100)}`,
      statusCode: isBreach ? 200 : (isAttack ? 403 : 200),
      attackType,
      impact,
      details: {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer *****',
        },
        payload: isAttack ? '{"query": "SELECT * FROM users"}' : undefined
      }
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
