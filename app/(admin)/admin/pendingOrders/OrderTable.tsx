import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPendingOrders } from "./action";
import ClientPendingOrders from "./ClientPendingOrders";

const ITEMS_PER_PAGE = 10;

async function OrderTable() {
  // Get initial data
  const initialData = await getPendingOrders(1, ITEMS_PER_PAGE);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pending Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientPendingOrders initialData={initialData} />
      </CardContent>
    </Card>
  );
}

export default OrderTable;
