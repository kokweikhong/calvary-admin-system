import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  InventoryProduct,
  InventoryProductSummary,
} from "@/interfaces/inventory";
import { useMutation, useQuery, useQueryClient } from "react-query";

const useInventoryProducts = () => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const inProductsURL = "/api/v1/inventory/products";

  const useGetInventoryProducts = () => {
    return useQuery(
      "inventory-products",
      async () => {
        const { data } = await axiosPrivate.get(inProductsURL);
        return data as InventoryProduct[];
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to get inventory products, ${error}`);
        },
      }
    );
  };

  const useGetInventoryProduct = (id: string) => {
    return useQuery(
      ["inventory-product", id],
      async () => {
        const { data } = await axiosPrivate.get(`${inProductsURL}/${id}`);
        return data as InventoryProduct;
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to get inventory product, ${error}`);
        },
      }
    );
  };

  const useCreateInventoryProduct = () => {
    return useMutation(
      async (data: InventoryProduct) => {
        const response = await axiosPrivate.post(inProductsURL, data);
        return response.data;
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to create inventory product, ${error}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries("inventory-products");
        },
      }
    );
  };

  const useUpdateInventoryProduct = (id: string) => {
    return useMutation(
      async (data: InventoryProduct) => {
        const response = await axiosPrivate.put(`${inProductsURL}/${id}`, data);
        return response.data;
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to update inventory product, ${error}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries("inventory-products");
        },
      }
    );
  };

  const useDeleteInventoryProduct = () => {
    return useMutation(
      async (id: string) => {
        const response = await axiosPrivate.delete(`${inProductsURL}/${id}`);
        return response.data;
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to delete inventory product, ${error}`);
        },
        onSuccess: () => {
          queryClient.invalidateQueries("inventory-products");
        },
      }
    );
  };

  const useGetInventoryProductSummary = () => {
    return useQuery(
      "inventory-product-summary",
      async () => {
        const { data } = await axiosPrivate.get(`${inProductsURL}/summary`);
        return data as InventoryProductSummary[];
      },
      {
        onError: (error) => {
          console.log(error);
          throw new Error(`failed to get inventory product summary, ${error}`);
        },
      }
    );
  };

  return {
    useGetInventoryProducts,
    useGetInventoryProduct,
    useCreateInventoryProduct,
    useUpdateInventoryProduct,
    useDeleteInventoryProduct,
    useGetInventoryProductSummary,
  };
};

export default useInventoryProducts;
