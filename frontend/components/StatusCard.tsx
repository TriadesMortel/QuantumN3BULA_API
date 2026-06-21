/**
 * Status Card component for dashboard
 */

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: string;
  status?: 'healthy' | 'degraded' | 'error';
}

export default function StatusCard({ title, value, icon, status }: StatusCardProps) {
  const statusColors = {
    healthy: 'border-green-500/50 bg-green-500/10',
    degraded: 'border-yellow-500/50 bg-yellow-500/10',
    error: 'border-red-500/50 bg-red-500/10',
  };

  return (
    <div
      className={`rounded-xl border p-4 ${
        status ? statusColors[status] : 'border-nebula-700 bg-nebula-900/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm text-nebula-400">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}
