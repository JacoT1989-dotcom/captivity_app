// Script file
import { PrismaClient, Prisma } from "@prisma/client";
import * as argon2 from "argon2";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

function mapWordPressRoleToPrisma(wpRole) {
  const roleMapping = {
    administrator: "ADMIN",
    editor: "EDITOR",
    shop_manager: "SHOPMANAGER",
    customer: "CUSTOMER",
    subscriber: "SUBSCRIBER",
    contributor: "USER",
    distributor: "DISTRIBUTOR",
    promotional: "PROMO",
  };

  return roleMapping[wpRole.toLowerCase()] || "USER";
}

function generateId() {
  const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

async function hashPassword(password) {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
      saltLength: 16,
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

function getValidDate(dateString) {
  const parsedDate = new Date(dateString);
  return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
}

async function main() {
  try {
    // Read the user-data.json file
    const jsonPath = path.join(process.cwd(), "scripts", "user-data.json");
    const jsonData = await fs.readFile(jsonPath, "utf8");
    const users = JSON.parse(jsonData);

    console.log(`Found ${users.length} users in user-data.json`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      const role = mapWordPressRoleToPrisma(user.roles?.[0] || "customer");

      const streetAddress =
        user.street_address_1 || user.address?.billing_address_1 || "";
      const addressLine2 =
        user.street_address_2 || user.address?.billing_address_2 || null;

      const securePassword = await hashPassword(user.password);

      const phoneNumber = user.user_registration_phone_number
        ? user.user_registration_phone_number.replace(/\D/g, "")
        : "";

      const createdAt = getValidDate(user.user_registered);
      const currentDate = new Date();

      const userData = {
        id: generateId(),
        wpId: String(user.id),
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        displayName: user.display_name,
        email: user.email,
        passwordHash: securePassword,
        vatNumber: user.user_registration_vat_number || null,
        phoneNumber,
        streetAddress,
        addressLine2,
        suburb: user.suburb || null,
        townCity: user.city || user.address?.billing_city || "",
        postcode: user.postcode || user.address?.billing_postcode || "",
        country: user.province || user.address?.billing_country || "",
        position: user.position || null,
        natureOfBusiness:
          user.user_registration_Type_of_industry || "Not specified",
        currentSupplier: user.current_suppliers || "Not specified",
        otherSupplier: user.other_suppliers || null,
        resellingTo: user.reselling_to || null,
        salesRep: user.salesrep || "Not assigned",
        website: user.website || null,
        companyName: user.user_registration_company_name || "Not specified",
        ckNumber: user.user_registration_ck_number || null,
        avatarUrl: null,
        bio: null,
        agreeTerms: true,
        role: role,
        createdAt,
        updatedAt: currentDate,
      };

      try {
        await prisma.user.upsert({
          where: {
            username: user.username,
          },
          update: {
            ...userData,
            id: undefined, // Don't update the ID if user exists
          },
          create: userData,
        });

        successCount++;
        if (successCount % 100 === 0) {
          console.log(`Processed ${successCount} users successfully...`);
        }
      } catch (error) {
        console.error(`Error processing user ${user.username}:`, error.message);
        errorCount++;
        continue;
      }
    }

    console.log("\nSeed completed:");
    console.log(`Successfully processed: ${successCount} users`);
    console.log(`Errors encountered: ${errorCount} users`);
  } catch (error) {
    console.error("Error seeding users:", error);
    throw error;
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
