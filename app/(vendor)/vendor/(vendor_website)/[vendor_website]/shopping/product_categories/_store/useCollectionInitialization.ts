import { useEffect } from "react";
import { useVendorCollectionsStore } from "../_store/useVendorCollectionsStore";

interface UseCollectionInitializationProps {
  user: any;
  vendorWebsite: string;
}

export const useCollectionInitialization = ({
  user,
  vendorWebsite,
}: UseCollectionInitializationProps) => {
  const { fetchCollections, isLoading, isFetched, error } =
    useVendorCollectionsStore();

  useEffect(() => {
    let isSubscribed = true;

    const initializeCollection = async () => {
      if (!user || !vendorWebsite || isFetched || isLoading) {
        return;
      }

      try {
        if (user.role === "VENDOR" || user.role === "VENDORCUSTOMER") {
          await fetchCollections(
            user.role === "VENDORCUSTOMER" ? vendorWebsite : undefined
          );
        }
      } catch (error) {
        if (isSubscribed) {
          console.error("Error initializing collection:", error);
        }
      }
    };

    initializeCollection();

    return () => {
      isSubscribed = false;
    };
  }, [user, vendorWebsite, fetchCollections, isLoading, isFetched]);

  return { isLoading, error };
};
