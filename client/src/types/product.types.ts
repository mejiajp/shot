export interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string | null
}

export interface CreateProductInput {
  name: string
  category: string
  price: number
  image: string | null
}

export interface UpdateProductInput {
  name: string
  category: string
  price: number
  image: string | null
}

export interface CreateProductResponse {
  message: string
  newProduct: Product
}

export interface DeleteProductResponse {
  message: string
  deletedProduct: Product
}

export interface UpdateProductResponse {
  message: string
  updatedProduct: Product
}
