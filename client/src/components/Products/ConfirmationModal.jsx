import React from 'react'

import Modal from '../Modal'

import UpdateIcon from '../../assets/svg/edit-01-stroke-rounded'
import DeleteIcon from '../../assets/svg/delete-02-stroke-rounded'
import AddIcon from '../../assets/svg/add-01-stroke-rounded'

const ConfirmationModal = ({
  isVisible,
  onClose,
  onConfirm,
  actionType,
  productName,
  isSubmitting,
}) => {
  const actionConfig = {
    delete: {
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete ${
        productName ? `"${productName}"` : 'this product'
      }?`,
      buttonText: 'Delete',
      buttonStyles:
        'border-red-500 bg-red-500 text-customWhite hover:bg-red-600 hover:border-red-600',
      icon: <DeleteIcon />,
    },

    update: {
      title: 'Confirm Update',
      message: `Are you sure you want to update ${
        productName ? `"${productName}"` : 'this product'
      }?`,
      buttonText: 'Update',
      buttonStyles:
        'border-yellow-500 bg-yellow-500 text-customWhite hover:bg-yellow-600 hover:border-yellow-600',
      icon: <UpdateIcon />,
    },

    add: {
      title: 'Confirm New Product',
      message: `Are you sure you want to add ${
        productName ? `"${productName}"` : 'this product'
      }?`,
      buttonText: 'Add',
      buttonStyles:
        'border-blue-500 bg-blue-500 text-customWhite hover:bg-blue-600 hover:border-blue-600',
      icon: <AddIcon />,
    },
  }

  const config = actionConfig[actionType]

  if (!config) return null

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <div>
        <div className="flex">
          <div className="mr-2">{config.icon}</div>

          <h3 className="text-lg font-bold mb-4">{config.title}</h3>
        </div>

        <p>{config.message}</p>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="mr-3 border border-gray-300 text-sm px-4 py-2 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`text-sm px-4 py-2 rounded transition-colors disabled:opacity-50 ${config.buttonStyles}`}
          >
            {isSubmitting ? 'Processing...' : config.buttonText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationModal
