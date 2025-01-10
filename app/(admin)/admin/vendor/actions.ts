// "use server";

// import { validateRequest } from "@/auth";
// import prisma from "@/lib/prisma";
// import {
//   VendorAnalyticsResponse,
//   TopVendorsResponse,
//   SingleVendorAnalyticsResponse,
//   FetchTopVendorsParams,
//   VendorFilters,
// } from "./types";

// // Fetch all registered vendors with their order metrics
// export async function fetchVendorAnalytics(
//   filters?: VendorFilters
// ): Promise<VendorAnalyticsResponse> {
//   try {
//     const { user } = await validateRequest();
//     if (!user || !["ADMIN", "SUPERADMIN"].includes(user.role)) {
//       throw new Error("Authentication required to access vendor analytics.");
//     }

//     // Build the where clause based on filters
//     const where = {
//       AND: [
//         { storeSlug: { not: null } },
//         { role: { in: ["VENDOR", "APPROVEDVENDORCUSTOMER"] } },
//         ...(filters?.searchTerm
//           ? [
//               {
//                 OR: [
//                   {
//                     storeName: {
//                       contains: filters.searchTerm,
//                       mode: "insensitive",
//                     },
//                   },
//                   {
//                     companyName: {
//                       contains: filters.searchTerm,
//                       mode: "insensitive",
//                     },
//                   },
//                 ],
//               },
//             ]
//           : []),
//       ],
//     };

//     const vendors = await prisma.user.findMany({
//       where,
//       select: {
//         id: true,
//         storeName: true,
//         storeSlug: true,
//         companyName: true,
//         vendorRating: true,
//         storeLogoUrl: true,
//         vendorOrders: {
//           select: {
//             totalAmount: true,
//           },
//         },
//       },
//     });

//     const vendorsWithMetrics = vendors
//       .map(vendor => ({
//         id: vendor.id,
//         storeName: vendor.storeName,
//         storeSlug: vendor.storeSlug!,
//         companyName: vendor.companyName,
//         totalOrders: vendor.vendorOrders.length,
//         totalRevenue: vendor.vendorOrders.reduce(
//           (sum, order) => sum + order.totalAmount,
//           0
//         ),
//         vendorRating: vendor.vendorRating,
//         storeLogoUrl: vendor.storeLogoUrl,
//         averageOrderValue:
//           vendor.vendorOrders.length > 0
//             ? vendor.vendorOrders.reduce(
//                 (sum, order) => sum + order.totalAmount,
//                 0
//               ) / vendor.vendorOrders.length
//             : 0,
//       }))
//       .filter(vendor => {
//         if (filters?.minOrders && vendor.totalOrders < filters.minOrders)
//           return false;
//         if (filters?.maxOrders && vendor.totalOrders > filters.maxOrders)
//           return false;
//         if (filters?.minRevenue && vendor.totalRevenue < filters.minRevenue)
//           return false;
//         if (filters?.maxRevenue && vendor.totalRevenue > filters.maxRevenue)
//           return false;
//         if (
//           filters?.minRating &&
//           vendor.vendorRating &&
//           vendor.vendorRating < filters.minRating
//         )
//           return false;
//         return true;
//       })
//       .sort((a, b) => b.totalOrders - a.totalOrders);

//     return {
//       success: true,
//       vendors: vendorsWithMetrics,
//       totalVendors: vendorsWithMetrics.length,
//     };
//   } catch (error) {
//     console.error("Error fetching vendor analytics:", error);
//     return {
//       success: false,
//       error:
//         error instanceof Error ? error.message : "An unexpected error occurred",
//     };
//   }
// }

// // Fetch top performing vendors
// export async function fetchTopVendors(
//   params: FetchTopVendorsParams = {}
// ): Promise<TopVendorsResponse> {
//   try {
//     const { limit = 10, sortBy = "totalOrders", order = "desc" } = params;
//     const { user } = await validateRequest();

//     if (!user || !["ADMIN", "SUPERADMIN"].includes(user.role)) {
//       throw new Error("Authentication required to access vendor analytics.");
//     }

//     const vendors = await prisma.user.findMany({
//       where: {
//         AND: [
//           { storeSlug: { not: null } },
//           { role: { in: ["VENDOR", "APPROVEDVENDORCUSTOMER"] } },
//         ],
//       },
//       select: {
//         id: true,
//         storeName: true,
//         storeSlug: true,
//         companyName: true,
//         vendorRating: true,
//         storeLogoUrl: true,
//         vendorOrders: {
//           select: {
//             totalAmount: true,
//           },
//         },
//       },
//       take: limit,
//     });

//     const topVendors = vendors
//       .map(vendor => ({
//         id: vendor.id,
//         storeName: vendor.storeName,
//         storeSlug: vendor.storeSlug!,
//         companyName: vendor.companyName,
//         totalOrders: vendor.vendorOrders.length,
//         totalRevenue: vendor.vendorOrders.reduce(
//           (sum, order) => sum + order.totalAmount,
//           0
//         ),
//         vendorRating: vendor.vendorRating,
//         storeLogoUrl: vendor.storeLogoUrl,
//         averageOrderValue:
//           vendor.vendorOrders.length > 0
//             ? vendor.vendorOrders.reduce(
//                 (sum, order) => sum + order.totalAmount,
//                 0
//               ) / vendor.vendorOrders.length
//             : 0,
//       }))
//       .sort((a, b) => {
//         const multiplier = order === "desc" ? -1 : 1;
//         switch (sortBy) {
//           case "totalRevenue":
//             return multiplier * (a.totalRevenue - b.totalRevenue);
//           case "vendorRating":
//             return multiplier * ((a.vendorRating || 0) - (b.vendorRating || 0));
//           default: // totalOrders
//             return multiplier * (a.totalOrders - b.totalOrders);
//         }
//       });

//     return {
//       success: true,
//       vendors: topVendors,
//       totalVendors: topVendors.length,
//     };
//   } catch (error) {
//     console.error("Error fetching top vendors:", error);
//     return {
//       success: false,
//       error:
//         error instanceof Error ? error.message : "An unexpected error occurred",
//     };
//   }
// }

// // Get individual vendor analytics
// export async function getVendorAnalytics(
//   vendorId: string
// ): Promise<SingleVendorAnalyticsResponse> {
//   try {
//     const { user } = await validateRequest();
//     if (!user || !["ADMIN", "SUPERADMIN", "VENDOR"].includes(user.role)) {
//       throw new Error("Authentication required to access vendor analytics.");
//     }

//     if (user.role === "VENDOR" && user.id !== vendorId) {
//       throw new Error("You can only access your own analytics.");
//     }

//     const vendorOrders = await prisma.vendorOrder.findMany({
//       where: {
//         userId: vendorId,
//       },
//     });

//     const totalOrders = vendorOrders.length;
//     const totalRevenue = vendorOrders.reduce(
//       (sum, order) => sum + order.totalAmount,
//       0
//     );
//     const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

//     const ordersByStatus = vendorOrders.reduce(
//       (acc, order) => {
//         acc[order.status] = (acc[order.status] || 0) + 1;
//         return acc;
//       },
//       {} as Record<string, number>
//     );

//     return {
//       success: true,
//       analytics: {
//         totalOrders,
//         totalRevenue,
//         averageOrderValue,
//         ordersByStatus,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching vendor analytics:", error);
//     return {
//       success: false,
//       error:
//         error instanceof Error ? error.message : "An unexpected error occurred",
//     };
//   }
// }
