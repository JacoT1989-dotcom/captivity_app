"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { OrderStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { FormValues, OrderActionResult } from "./_lib/types";

export async function createOrder(
  formData: FormValues
): Promise<OrderActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to place an order",
      };
    }

    // 1. Verify cart and calculate total
    const existingCart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            variation: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!existingCart?.cartItems?.length) {
      return {
        success: false,
        message: "Cart is empty",
        error: "Cannot create order with empty cart",
      };
    }

    // 2. Verify stock availability before proceeding
    for (const item of existingCart.cartItems) {
      const variation = await prisma.variation.findUnique({
        where: { id: item.variationId },
      });

      if (!variation || variation.quantity < item.quantity) {
        return {
          success: false,
          message: "Insufficient stock",
          error: `Insufficient stock for product variation ${item.variationId}`,
        };
      }
    }

    const totalAmount = existingCart.cartItems.reduce(
      (total, item) =>
        total + item.variation.product.sellingPrice * item.quantity,
      0
    );

    // 3. Create order with a simplified transaction
    const order = await prisma.$transaction(
      async tx => {
        // Create order
        const newOrder = await tx.order.create({
          data: {
            userId: user.id,
            status: OrderStatus.PENDING,
            totalAmount,
            captivityBranch: formData.captivityBranch,
            methodOfCollection: formData.methodOfCollection,
            salesRep: formData.salesRep || "",
            referenceNumber: formData.referenceNumber || "",
            firstName: formData.firstName,
            lastName: formData.lastName,
            companyName: formData.companyName,
            countryRegion: formData.countryRegion,
            streetAddress: formData.streetAddress,
            apartmentSuite: formData.apartmentSuite || "",
            townCity: formData.townCity,
            province: formData.province,
            postcode: formData.postcode,
            phone: formData.phone,
            email: formData.email,
            orderNotes: formData.orderNotes || "",
            agreeTerms: formData.agreeTerms,
            receiveEmailReviews: formData.receiveEmailReviews,
          },
        });

        // Create order items
        const orderItems = await Promise.all(
          existingCart.cartItems.map(item =>
            tx.orderItem.create({
              data: {
                orderId: newOrder.id,
                variationId: item.variationId,
                quantity: item.quantity,
                price: item.variation.product.sellingPrice,
              },
            })
          )
        );

        // Update variation quantities
        await Promise.all(
          existingCart.cartItems.map(item =>
            tx.variation.update({
              where: { id: item.variationId },
              data: {
                quantity: {
                  decrement: item.quantity,
                },
              },
            })
          )
        );

        // Delete cart items
        await tx.cartItem.deleteMany({
          where: { cartId: existingCart.id },
        });

        return newOrder;
      },
      {
        maxWait: 10000, // 10 seconds maximum wait time
        timeout: 20000, // 20 seconds timeout
        isolationLevel: "Serializable", // Highest isolation level
      }
    );

    // 4. Fetch complete order details after transaction
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            variation: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    // 5. Revalidate paths
    revalidatePath("/customer/orders");
    revalidatePath("/customer/shopping/cart");

    return {
      success: true,
      message: "Order created successfully",
      data: completeOrder,
    };
  } catch (error) {
    console.error("Error creating order:", error);

    // Properly type check for Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2028") {
        return {
          success: false,
          message: "Transaction error",
          error: "Failed to process order. Please try again.",
        };
      }
    }

    // Handle generic errors
    return {
      success: false,
      message: "Failed to create order",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getOrder(orderId?: string): Promise<OrderActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to view order",
      };
    }

    const order = await prisma.order.findFirst({
      where: {
        userId: user.id,
        ...(orderId ? { id: orderId } : {}), // Only include id in where clause if provided
      },
      orderBy: {
        createdAt: "desc", // Get the most recent order
      },
      include: {
        orderItems: {
          include: {
            variation: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        message: "Order not found",
        error: "No orders found",
      };
    }

    return {
      success: true,
      message: "Order retrieved successfully",
      data: order,
    };
  } catch (error) {
    console.error("Error retrieving order:", error);
    return {
      success: false,
      message: "Failed to retrieve order",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// export async function getUserOrders(): Promise<OrderActionResult> {
//   try {
//     const { user } = await validateRequest();
//     if (!user) {
//       return {
//         success: false,
//         message: "Authentication required",
//         error: "Please login to view orders",
//       };
//     }

//     const orders = await prisma.order.findMany({
//       where: {
//         userId: user.id,
//       },
//       include: {
//         orderItems: {
//           include: {
//             variation: {
//               include: {
//                 product: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return {
//       success: true,
//       message: "Orders retrieved successfully",
//       data: orders,
//     };
//   } catch (error) {
//     console.error("Error retrieving orders:", error);
//     return {
//       success: false,
//       message: "Failed to retrieve orders",
//       error:
//         error instanceof Error ? error.message : "An unexpected error occurred",
//     };
//   }
// }

export async function getUserDetails() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to view details",
      };
    }

    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        salesRep: true,
        companyName: true,
        country: true,
        streetAddress: true,
        addressLine2: true,
        townCity: true,
        suburb: true,
        postcode: true,
        agreeTerms: false,
      },
    });

    if (!userDetails) {
      return {
        success: false,
        message: "User details not found",
        error: "No user details found",
      };
    }

    return {
      success: true,
      message: "User details retrieved successfully",
      data: userDetails,
    };
  } catch (error) {
    console.error("Error retrieving user details:", error);
    return {
      success: false,
      message: "Failed to retrieve user details",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
