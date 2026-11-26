import caller from './caller'
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  CreateProductResponse,
  DeleteProductResponse,
  UpdateProductResponse,
} from '../types/product.types'

// GET TOP PRODUCTS
export const getTopProducts = async (): Promise<Product[]> =>
  caller('/products/top')

// GET ALL PRODUCTS
export const getProducts = async (): Promise<Product[]> => caller('/products')

// CREATE PRODUCT
export const createProduct = async (
  product: CreateProductInput
): Promise<CreateProductResponse> =>
  caller('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  })

// DELETE PRODUCT
export const deleteProduct = async (
  id: string
): Promise<DeleteProductResponse> =>
  caller(`/products/${id}`, {
    method: 'DELETE',
  })

// UPDATE PRODUCT
export const updateProduct = async (
  id: string,
  product: UpdateProductInput
): Promise<UpdateProductResponse> =>
  caller(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  })
