import React from 'react';
import Modal from './Modal';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirmer',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger',
  isLoading = false
}) {
  const variantClasses = {
    danger: {
      icon: 'text-red-500',
      confirmBtn: 'btn-danger',
    },
    warning: {
      icon: 'text-yellow-500',
      confirmBtn: 'btn-warning',
    },
    info: {
      icon: 'text-primary-500',
      confirmBtn: 'btn-primary',
    },
  };

  const classes = variantClasses[variant] || variantClasses.info;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${classes.icon}`}>
          <ExclamationTriangleIcon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-secondary-600">{message}</p>
        </div>
      </div>
      
      <div className="modal-footer">
        <button
          onClick={onClose}
          className="btn btn-secondary"
          disabled={isLoading}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`btn ${classes.confirmBtn}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Traitement...
            </>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
