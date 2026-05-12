// Form Validation and Event Handling

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('eventForm');
  
  // Add event listeners
  setupFormListeners();
  setupRadioListeners();
  setupCheckboxListeners();
  setupFormSubmit();
});

// ==================== FORM LISTENERS ====================

function setupFormListeners() {
  const eventDateInput = document.getElementById('eventDate');
  const guestCountInput = document.getElementById('guestCount');
  const wineRadios = document.querySelectorAll('input[name="wineOption"]');

  // Event date change
  if (eventDateInput) {
    eventDateInput.addEventListener('change', function() {
      syncDayFromDate();
      updateSummary();
    });
  }

  // Guest count change
  if (guestCountInput) {
    guestCountInput.addEventListener('input', updateSummary);
  }

  // Wine option change
  wineRadios.forEach(radio => {
    radio.addEventListener('change', updateSummary);
  });
}

// ==================== RADIO BUTTON HANDLING ====================

function setupRadioListeners() {
  const wineOptions = document.querySelectorAll('input[name="wineOption"]');
  
  wineOptions.forEach(radio => {
    radio.addEventListener('change', function() {
      updateRadioItemUI('wineOption');
    });
  });
}

function selectRadio(element, groupName) {
  const radio = element.querySelector('input[type="radio"]');
  if (radio) {
    radio.checked = true;
    radio.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function updateRadioItemUI(groupName) {
  const items = document.querySelectorAll(`#${groupName} .radio-item`);
  items.forEach(item => {
    const radio = item.querySelector('input[type="radio"]');
    if (radio && radio.checked) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });
}

// ==================== CHECKBOX HANDLING ====================

function setupCheckboxListeners() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      handleCheckboxChange(this);
    });
  });
}

function handleCheckboxChange(checkbox) {
  const item = checkbox.closest('.checkbox-item');
  
  if (checkbox.checked) {
    item.classList.add('selected');
  } else {
    item.classList.remove('selected');
  }
  
  updateSummary();
}

// ==================== DATE AND DAY SYNC ====================

function syncDayFromDate() {
  const dateInput = document.getElementById('eventDate');
  const daySelect = document.getElementById('eventDay');
  
  if (!dateInput.value || !daySelect) return;
  
  const date = new Date(dateInput.value);
  const dayIndex = date.getDay();
  
  const dayMap = {
    0: 'sun',  // Sunday
    1: 'mon',  // Monday
    2: 'tue',  // Tuesday
    3: 'wed',  // Wednesday
    4: 'thu',  // Thursday
    5: 'fri',  // Friday
    6: 'sat'   // Saturday
  };
  
  daySelect.value = dayMap[dayIndex] || '';
}

// ==================== FORM VALIDATION ====================

function validatePhone(phone) {
  // Israeli phone pattern: 05X-XXXXXXX or 05XXXXXXXX
  const phoneRegex = /^05\d{8}$|^05\d-\d{7}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

function validateEmail(email) {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateForm() {
  let isValid = true;
  
  // Validate phone
  const phoneInput = document.getElementById('phone');
  const phoneError = document.getElementById('phoneError');
  
  if (phoneInput.value && !validatePhone(phoneInput.value)) {
    phoneError.style.display = 'block';
    isValid = false;
  } else {
    phoneError.style.display = 'none';
  }
  
  // Validate email
  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('emailError');
  
  if (emailInput.value && !validateEmail(emailInput.value)) {
    emailError.style.display = 'block';
    isValid = false;
  } else {
    emailError.style.display = 'none';
  }
  
  return isValid;
}

// ==================== SUMMARY UPDATE ====================

function updateSummary() {
  const guestCount = document.getElementById('guestCount').value || 0;
  const wineOption = document.querySelector('input[name="wineOption"]:checked');
  
  // Update guest count
  document.getElementById('summary-guests').textContent = guestCount;
  
  // Update wine option
  if (wineOption && wineOption.value === 'yes') {
    const winePrice = guestCount * 30;
    document.getElementById('summary-wine').textContent = 'כן';
    document.getElementById('summary-wine-price').textContent = `₪${winePrice}`;
    document.getElementById('summary-total').textContent = `₪${winePrice}`;
  } else {
    document.getElementById('summary-wine').textContent = 'לא';
    document.getElementById('summary-wine-price').textContent = '₪0';
    document.getElementById('summary-total').textContent = '₪0';
  }
}

// ==================== FORM SUBMISSION ====================

function setupFormSubmit() {
  const form = document.getElementById('eventForm');
  
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!validateForm()) {
    alert('נא למלא את כל השדות בצורה נכונה');
    return;
  }
  
  // Collect form data
  const formData = {
    fullName: document.getElementById('fullName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    company: document.getElementById('company').value,
    eventDate: document.getElementById('eventDate').value,
    eventDay: document.getElementById('eventDay').value,
    eventTime: document.getElementById('eventTime').value,
    guestCount: document.getElementById('guestCount').value,
    eventReason: document.getElementById('eventReason').value,
    seatingStyle: document.getElementById('seatingStyle').value,
    wine: document.querySelector('input[name="wineOption"]:checked').value,
    equipment: getSelectedEquipment()
  };
  
  // Log form data (replace with actual submission)
  console.log('Form submitted:', formData);
  
  // Show thank you message
  showThankYouMessage();
  
  // Optional: Send data to server
  // submitFormToServer(formData);
}

function getSelectedEquipment() {
  const equipment = [];
  const checkboxes = document.querySelectorAll('.equipment-check:checked');
  checkboxes.forEach(checkbox => {
    equipment.push(checkbox.value);
  });
  return equipment;
}

// ==================== THANK YOU MESSAGE ====================

function showThankYouMessage() {
  const form = document.getElementById('eventForm');
  const thankYou = document.getElementById('thankYouSection');
  
  if (form) {
    form.style.display = 'none';
  }
  
  if (thankYou) {
    thankYou.style.display = 'block';
    window.scrollTo(0, 0);
  }
}

// ==================== MODAL HANDLING ====================

function openModal(title, content) {
  const backdrop = document.getElementById('modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  if (modalTitle) modalTitle.textContent = title;
  if (modalBody) modalBody.textContent = content;
  if (backdrop) backdrop.classList.add('open');
}

function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) backdrop.classList.remove('open');
}

// Close modal on backdrop click
document.addEventListener('DOMContentLoaded', function() {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', function(e) {
      if (e.target === backdrop) {
        closeModal();
      }
    });
  }
});

// ==================== UTILITY FUNCTIONS ====================

// Format currency
function formatCurrency(amount) {
  return `₪${amount}`;
}

// Get date from input
function getDateFromInput(inputId) {
  const input = document.getElementById(inputId);
  return new Date(input.value);
}

// Optional: Send form data to server
function submitFormToServer(formData) {
  fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Server response:', data);
    showThankYouMessage();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('אירעה שגיאה בשליחת הטופס');
  });
}
