import React, { useState, useEffect } from 'react'
import axios from 'axios'

import ProductsCard from '../components/Products/ProductsCard'
import ProductModal from '../components/Products/ProductModal'
import ConfirmationModal from '../components/Products/ConfirmationModal'

import Search from '../assets/search-01-stroke-rounded.jsx'

const EMPTY_PRODUCT = {
  image: '',
  name: '',
  price: '',
  category: '',
}

function Products() {
  const [actionType, setActionType] = useState('')
  const [pendingAction, setPendingAction] = useState(null)

  const [query, setQuery] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false)

  const [initialProduct, setInitialProduct] = useState(EMPTY_PRODUCT)
  const [pendingProduct, setPendingProduct] = useState(null)

  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get('http://localhost:3000/products')

      setProducts(response.data)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch products'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Open Add Product modal
  const handleAddProduct = () => {
    setInitialProduct({ ...EMPTY_PRODUCT })
    setActionType('add')
    setIsModalOpen(true)
  }

  // Open Update Product modal
  const handleEditProduct = (product) => {
    setInitialProduct({ ...product })
    setActionType('update')
    setIsModalOpen(true)
  }

  // Request confirmation for Add or Update
  const requestConfirmation = (action, product) => {
    setPendingAction(action)
    setPendingProduct({ ...product })
    setIsConfirmationVisible(true)
  }

  // Request confirmation for Delete
  const handleDeleteProduct = (product) => {
    setPendingAction('delete')
    setPendingProduct(product)
    setIsConfirmationVisible(true)
  }

  // Add product API request
  const addProduct = async (product) => {
    const response = await axios.post(
      'http://localhost:3000/products/create',
      product
    )

    console.log('Product added:', response.data)
  }

  // Update product API request
  const updateProduct = async (product) => {
    const response = await axios.put(
      `http://localhost:3000/products/update/${product.id}`,
      product
    )

    console.log('Product updated:', response.data)
  }

  // Delete product API request
  const deleteProduct = async (product) => {
    const response = await axios.delete(
      `http://localhost:3000/products/delete/${product.id}`
    )

    console.log('Product deleted:', response.data)
  }

  // Execute action only after confirmation
  const handleConfirmAction = async () => {
    if (!pendingAction || !pendingProduct || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      switch (pendingAction) {
        case 'add':
          await addProduct(pendingProduct)
          break

        case 'update':
          await updateProduct(pendingProduct)
          break

        case 'delete':
          await deleteProduct(pendingProduct)
          break

        default:
          return
      }

      // Close the appropriate modal after success
      setIsConfirmationVisible(false)

      if (pendingAction !== 'delete') {
        setIsModalOpen(false)
        setInitialProduct({ ...EMPTY_PRODUCT })
        setActionType('')
      }

      setPendingAction(null)
      setPendingProduct(null)

      await fetchProducts()
    } catch (error) {
      console.error('Product action failed:', error)

      setError(
        error.response?.data?.message || error.message || 'Something went wrong'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cancel confirmation without closing the product form
  const handleCancelConfirmation = () => {
    setIsConfirmationVisible(false)
    setPendingAction(null)
    setPendingProduct(null)
  }

  // Cancel product form
  const handleCancel = () => {
    setInitialProduct({ ...EMPTY_PRODUCT })
    setActionType('')
    setIsModalOpen(false)
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="h-screen flex-1 overflow-y-auto scrollbar-hide px-10">
      {/* Header */}
      <div className="py-5 flex">
        <div className="rounded-lg py-3 px-5 mr-5 w-auto bg-[#02342d89]">
          <button
            onClick={handleAddProduct}
            className="text-customWhite font-semibold"
          >
            New +
          </button>
        </div>

        <div className="flex items-center xl:w-[200px] relative overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-full px-5 py-3 bg-secondary-2 rounded-lg text-gray-700 focus:outline-none"
            placeholder="Search..."
          />

          <button
            onClick={() => console.log('Search query:', query)}
            className="absolute right-3"
          >
            <Search className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Loading and error messages */}
      {loading && <p>Loading products...</p>}

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Products */}
      {!loading && (
        <div className="w-full grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-5 mb-5">
          {filteredProducts.map((product) => (
            <ProductsCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {/* Add / Update Product Form */}
      <ProductModal
        isVisible={isModalOpen}
        onClose={handleCancel}
        initialProduct={initialProduct}
        actionType={actionType}
        onRequestConfirmation={requestConfirmation}
      />

      {/* Shared Confirmation Modal */}
      <ConfirmationModal
        isVisible={isConfirmationVisible}
        onClose={handleCancelConfirmation}
        onConfirm={handleConfirmAction}
        actionType={pendingAction}
        productName={pendingProduct?.name}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default Products
