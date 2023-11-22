import {
  InventoryProduct,
  InventoryProductSummary,
} from "@/interfaces/inventory";
import { RankingInfo } from "@tanstack/match-sorter-utils";
import { FilterFn } from "@tanstack/react-table";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const inProductsURL = "http://localhost:8080/api/v1/inventory/products";

export const useGetInventoryProducts = () => {
  return useQuery("inventory-products", async () => {
    const { data } = await axios.get(inProductsURL);
    return data as InventoryProduct[];
  });
};

export const useGetInventoryProduct = (id: string) => {
  return useQuery(
    ["inventory-product", id],
    async () => {
      const { data } = await axios.get(`${inProductsURL}/${id}`);
      return data as InventoryProduct;
    },
    {
      enabled: !!id,
    }
  );
};

export const useCreateInventoryProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: InventoryProduct) => {
      const response = await axios.post(inProductsURL, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("inventory-products");
      },
    }
  );
};

export const useUpdateInventoryProduct = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: InventoryProduct) => {
      const response = await axios.put(`${inProductsURL}/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("inventory-products");
      },
    }
  );
};

export const useDeleteInventoryProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      const response = await axios.delete(`${inProductsURL}/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("inventory-products");
      },
    }
  );
};

export const useGetInventoryProductSummary = () => {
  return useQuery("inventory-product-summary", async () => {
    const { data } = await axios.get(`${inProductsURL}/summary`);
    return data as InventoryProductSummary[];
  });
};
