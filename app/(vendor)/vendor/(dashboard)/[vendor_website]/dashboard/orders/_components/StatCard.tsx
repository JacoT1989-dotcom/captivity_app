// app/(vendor)/orders/_components/StatCard.tsx
interface StatCardProps {
  title: string;
  value: string | number;
}

export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border transition-colors">
      <div className="p-4">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-xl sm:text-2xl font-semibold text-card-foreground mt-1">
          {value}
        </div>
      </div>
    </div>
  );
}
