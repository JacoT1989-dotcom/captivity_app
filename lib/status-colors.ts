function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500/10 text-yellow-500";
    case "PROCESSING":
      return "bg-blue-500/10 text-blue-500";
    case "SHIPPED":
      return "bg-purple-500/10 text-purple-500";
    case "DELIVERED":
      return "bg-green-500/10 text-green-500";
    case "CANCELLED":
      return "bg-red-500/10 text-red-500";
    case "REFUNDED":
      return "bg-orange-500/10 text-orange-500";
    default:
      return "bg-gray-500/10 text-gray-500";
  }
}
