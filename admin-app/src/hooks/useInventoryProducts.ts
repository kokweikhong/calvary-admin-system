import { InventoryProduct, InventoryProductSummary } from "@/interfaces/inventory"
import { useQuery, useQueryClient, useMutation } from "react-query"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"

const useInventoryProducts = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const inProductsURL = "/inventory/products"

  const getInventoryProducts = () => {
    return useQuery("inventory-products", async () => {
      const { data } = await axiosPrivate.get(inProductsURL)
      return data as InventoryProduct[]
    }, {
      onError: (error) => {
        console.log(error)
        throw new Error(`failed to get inventory products, ${error}`)
      }
    });
  }

  const getInventoryProduct = (id: string) => {
    return useQuery(["inventory-product", id], async () => {
      const { data } = await axiosPrivate.get(`${inProductsURL}/${id}`)
      return data as InventoryProduct
    }, {
      onError: (error) => {
        console.log(error)
        throw new Error(`failed to get inventory product, ${error}`)
      }
    });
  }

  const createInventoryProduct = () => {
    return useMutation(
      async (data: InventoryProduct) => {
        const response = await axiosPrivate.post(inProductsURL, data)
        return response.data
      },
      {
        onError: (error) => {
          console.log(error)
          throw new Error(`failed to create inventory product, ${error}`)
        },
        onSuccess: () => {
          queryClient.invalidateQueries("inventory-products")
        },
      }
    )
  }

  const updateInventoryProduct = (id: string) => {
    return useMutation(
      async (data: InventoryProduct) => {
        const response = await axiosPrivate.put(`${inProductsURL}/${id}`, data)
        return response.data
      },
      {
        onError: (error) => {
          console.log(error)
          throw new Error(`failed to update inventory product, ${error}`)
        },
        onSuccess: () => {
          queryClient.invalidateQueries("inventory-products")
        },
      }
    )
  }

  const deleteInventoryProduct = () => {
    return useMutation(
      async (id: string) => {
        const response = await axiosPrivate.delete(`${inProductsURL}/${id}`)
        return response.data
      },
      {
        onError: (error) => {
          console.log(error)
          throw new Error(`failed to delete inventory product, ${error}`)
        },
        onSuccess: () => {
          queryClient.invalidateQueries("inventory-products")
        },
      }
    )
  }

  const getInventoryProductSummary = () => {
    return useQuery("inventory-product-summary", async () => {
      const { data } = await axiosPrivate.get(`${inProductsURL}/summary`)
      return data as InventoryProductSummary[]
    }, {
      onError: (error) => {
        console.log(error)
        throw new Error(`failed to get inventory product summary, ${error}`)
      }
    });
  }

  return {
    getInventoryProducts,
    getInventoryProduct,
    createInventoryProduct,
    updateInventoryProduct,
    deleteInventoryProduct,
    getInventoryProductSummary
  }
}

export default useInventoryProducts
