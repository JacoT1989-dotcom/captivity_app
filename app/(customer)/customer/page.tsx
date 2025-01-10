import CustomerLanding from "./CustomerLanding";
import { getOrder } from "./shopping/checkout/actions";

export default async function CustomerPage() {
  let latestOrderId = null;

  try {
    const result = await getOrder();
    if (result.success && result.data) {
      latestOrderId = result.data.id;
    }
  } catch (error) {
    console.error("Error fetching latest order:", error);
  }

  return <CustomerLanding initialOrderId={latestOrderId} />;
}
