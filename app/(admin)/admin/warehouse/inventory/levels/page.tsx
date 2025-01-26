import { Card } from "@/components/ui/card";
import StockLevelTable from "./stockTable";

export default function StockLevelsPage() {
  return (
    <div className="p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Stock Level Monitor</h2>
        <StockLevelTable />
      </Card>
    </div>
  );
}
