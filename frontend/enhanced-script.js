// Enhanced E-Tendering System JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeEnhancedFeatures();
    initializeFormValidation();
    initializeSearchFunctionality();
    initializeStatusUpdates();
    initializeResponsiveDesign();
});

// Enhanced Features Initialization
function initializeEnhancedFeatures() {
    // Add loading states to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.type === 'submit' || this.classList.contains('primary')) {
                showButtonLoading(this);
            }
        });
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add smooth transitions to status indicators
    const statusElements = document.querySelectorAll('.status');
    statusElements.forEach(status => {
        status.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        status.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            const form = e.target.closest('form');
            if (form) {
                e.preventDefault();
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.click();
                }
            }
        }
    });
}

// Form Validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
                if (this.hasAttribute('data-validate-on-input')) {
                    validateField(this);
                }
            });
            
            // Add visual feedback on focus
            input.addEventListener('focus', function() {
                this.parentNode.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentNode.classList.remove('focused');
            });
        });
        
        // Form submission validation
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const formData = new FormData(this);
            
            // Validate all fields
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                handleFormSubmission(this, formData);
            } else {
                showNotification('Please fix the errors before submitting.', 'error');
            }
        });
    });
}

// Field Validation Function
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError(field);
    
    // Required field validation
    if (isRequired && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Email validation
    else if (fieldType === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
    }
    
    // Date validation
    else if (fieldType === 'date' && value && !isValidDate(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid date.';
    }
    
    // Text length validation
    else if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Description must be at least 10 characters.';
    }
    
    // Show error if invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
        field.classList.add('error');
    } else {
        field.classList.remove('error');
        field.classList.add('valid');
    }
    
    return isValid;
}

// Email Validation Helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Date Validation Helper
function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

// Show Field Error
function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    errorElement.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        ${message}
    `;
    
    field.parentNode.appendChild(errorElement);
}

// Clear Field Error
function clearFieldError(field) {
    field.style.borderColor = '';
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Search Functionality
function initializeSearchFunctionality() {
    const searchInputs = document.querySelectorAll('input[placeholder*="Search"], input[id="q"]');
    
    searchInputs.forEach(searchInput => {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value, this);
            }, 300);
        });
        
        // Add search icon
        if (!searchInput.style.backgroundImage) {
            searchInput.style.backgroundImage = 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3e%3cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\'/%3e%3c/svg%3e")';
            searchInput.style.backgroundRepeat = 'no-repeat';
            searchInput.style.backgroundPosition = 'right 12px center';
            searchInput.style.backgroundSize = '20px';
            searchInput.style.paddingRight = '40px';
        }
    });
}

// Perform Search
function performSearch(query, searchInput) {
    const grid = document.querySelector('#list, .grid');
    if (!grid) return;
    
    const items = grid.querySelectorAll('.card, [data-tender]');
    
    if (!query.trim()) {
        // Show all items if no query
        items.forEach(item => {
            item.style.display = '';
            item.style.opacity = '1';
        });
        return;
    }
    
    // Filter items based on query
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const matches = text.includes(query.toLowerCase());
        
        if (matches) {
            item.style.display = '';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        } else {
            item.style.opacity = '0.3';
            item.style.transform = 'scale(0.95)';
        }
    });
    
    // Show search results count
    const visibleItems = Array.from(items).filter(item => item.style.opacity !== '0.3');
    showSearchResults(query, visibleItems.length, items.length);
}

// Show Search Results
function showSearchResults(query, visibleCount, totalCount) {
    let resultsDiv = document.querySelector('.search-results');
    
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';
        resultsDiv.style.cssText = `
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            margin: 1rem 0;
            font-size: 0.875rem;
            color: #6b7280;
        `;
        
        const grid = document.querySelector('#list, .grid');
        if (grid && grid.parentNode) {
            grid.parentNode.insertBefore(resultsDiv, grid);
        }
    }
    
    if (query.trim()) {
        resultsDiv.innerHTML = `
            <strong>Search Results:</strong> Showing ${visibleCount} of ${totalCount} items for "${query}"
        `;
        resultsDiv.style.display = 'block';
    } else {
        resultsDiv.style.display = 'none';
    }
}

// Status Updates
function initializeStatusUpdates() {
    // Auto-refresh status indicators
    const statusElements = document.querySelectorAll('.status');
    
    statusElements.forEach(status => {
        // Add click handler for status updates
        status.addEventListener('click', function() {
            if (this.classList.contains('clickable')) {
                showStatusUpdateModal(this);
            }
        });
        
        // Add visual indicator for clickable status
        if (this.classList.contains('OPEN') || this.classList.contains('CLOSED')) {
            this.classList.add('clickable');
            this.style.cursor = 'pointer';
            this.title = 'Click to update status';
        }
    });
}

// Show Status Update Modal
function showStatusUpdateModal(statusElement) {
    const currentStatus = statusElement.textContent.trim();
    const availableStatuses = ['OPEN', 'CLOSED', 'AWARDED'];
    
    const modal = document.createElement('div');
    modal.className = 'status-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
            max-width: 400px;
            width: 90%;
        ">
            <h3 style="margin-bottom: 1rem; color: #1f2937;">Update Status</h3>
            <p style="margin-bottom: 1.5rem; color: #6b7280;">
                Current status: <strong>${currentStatus}</strong>
            </p>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${availableStatuses.map(status => `
                    <button class="status-option" data-status="${status}" style="
                        padding: 0.5rem 1rem;
                        border: 2px solid #e5e7eb;
                        border-radius: 0.5rem;
                        background: ${status === currentStatus ? '#3b82f6' : 'white'};
                        color: ${status === currentStatus ? 'white' : '#1f2937'};
                        cursor: pointer;
                        transition: all 0.2s;
                    ">
                        ${status}
                    </button>
                `).join('')}
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button id="cancel-status" style="
                    flex: 1;
                    padding: 0.75rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.5rem;
                    background: white;
                    cursor: pointer;
                ">Cancel</button>
                <button id="save-status" style="
                    flex: 1;
                    padding: 0.75rem;
                    border: 2px solid #3b82f6;
                    border-radius: 0.5rem;
                    background: #3b82f6;
                    color: white;
                    cursor: pointer;
                    display: none;
                ">Save</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    let selectedStatus = null;
    
    // Handle status selection
    modal.querySelectorAll('.status-option').forEach(option => {
        option.addEventListener('click', function() {
            modal.querySelectorAll('.status-option').forEach(opt => {
                opt.style.background = 'white';
                opt.style.color = '#1f2937';
            });
            this.style.background = '#3b82f6';
            this.style.color = 'white';
            selectedStatus = this.dataset.status;
            modal.querySelector('#save-status').style.display = 'block';
        });
    });
    
    // Handle save
    modal.querySelector('#save-status').addEventListener('click', function() {
        if (selectedStatus) {
            updateTenderStatus(statusElement, selectedStatus);
            modal.remove();
        }
    });
    
    // Handle cancel
    modal.querySelector('#cancel-status').addEventListener('click', function() {
        modal.remove();
    });
    
    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Update Tender Status
function updateTenderStatus(statusElement, newStatus) {
    // Show loading state
    statusElement.innerHTML = '<span class="loading"></span>';
    
    // Simulate API call
    setTimeout(() => {
        statusElement.textContent = newStatus;
        statusElement.className = `status ${newStatus}`;
        
        showNotification(`Status updated to ${newStatus}`, 'success');
    }, 1000);
}

// Responsive Design Enhancements
function initializeResponsiveDesign() {
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            adjustLayoutForScreenSize();
        }, 250);
    });
    
    // Initial layout adjustment
    adjustLayoutForScreenSize();
}

// Adjust Layout for Screen Size
function adjustLayoutForScreenSize() {
    const width = window.innerWidth;
    const grid = document.querySelector('.grid');
    
    if (grid && width < 768) {
        // Mobile layout adjustments
        grid.style.gridTemplateColumns = '1fr';
        grid.style.gap = '1rem';
    } else if (grid && width >= 768) {
        // Desktop layout
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        grid.style.gap = '1.5rem';
    }
    
    // Adjust card padding based on screen size
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (width < 480) {
            card.style.padding = '1rem';
        } else {
            card.style.padding = '2rem';
        }
    });
}

// Button Loading State
function showButtonLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Processing...';
    button.disabled = true;
    
    // Restore button after 2 seconds
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease-out;
        max-width: 400px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.innerHTML = `
        <span style="font-weight: bold; font-size: 1.2rem;">${icons[type] || icons.info}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', function() {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Handle Form Submission
function handleFormSubmission(form, formData) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<span class="loading"></span> Saving...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Form submitted successfully!', 'success');
        
        // Reset form
        form.reset();
        
        // Clear validation states
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.classList.remove('error', 'valid');
            clearFieldError(input);
        });
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
    }, 2000);
}

// Export functions for external use
window.E_TenderingSystem = {
    showNotification,
    validateField,
    performSearch,
    updateTenderStatus
};
