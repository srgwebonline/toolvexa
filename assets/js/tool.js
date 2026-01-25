// Dark Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const sidebarThemeToggle = document.getElementById('sidebarThemeToggle');
const themeStatus = document.getElementById('themeStatus');
const body = document.body;

// Check for saved theme preference or prefer-color-scheme
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');

// Set initial theme
if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
  body.classList.add('dark-theme');
  updateThemeStatus(true);
} else {
  updateThemeStatus(false);
}

// Main theme toggle function
function toggleTheme() {
  const isDark = body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeStatus(isDark);
  
  // Add animation to the toggle button
  themeToggle.style.transform = 'rotate(360deg)';
  setTimeout(() => {
    themeToggle.style.transform = '';
  }, 300);
}

// Update theme status text and icon
function updateThemeStatus(isDark) {
  if (themeStatus) {
    themeStatus.textContent = isDark ? 'ON' : 'OFF';
  }
}

// Event listeners for theme toggles
themeToggle.addEventListener('click', toggleTheme);

if (sidebarThemeToggle) {
  sidebarThemeToggle.addEventListener('click', function(e) {
    e.preventDefault();
    toggleTheme();
  });
}

// Mobile Sidebar Functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Open sidebar
mobileMenuBtn.addEventListener('click', () => {
  sidebar.classList.add('active');
  sidebarOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
});

// Close sidebar
function closeSidebar() {
  sidebar.classList.remove('active');
  sidebarOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// Close sidebar when clicking on a link (for mobile)
document.querySelectorAll('.sidebar-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    if (!this.id.includes('Theme')) { // Don't close for theme toggle
      closeSidebar();
    }
  });
});

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if(targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if(targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // Close sidebar on mobile after clicking
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    }
  });
});

// Percentage Calculator JavaScript
// DOM Elements
const calculatorTabs = document.getElementById('calculatorTabs');
const tabButtons = document.querySelectorAll('.tab-btn');
const forms = {
  'percentage-of': document.getElementById('percentage-of-form'),
  'percentage-what': document.getElementById('percentage-what-form'),
  'percentage-change': document.getElementById('percentage-change-form'),
  'percentage-difference': document.getElementById('percentage-difference-form')
};

const resultValue = document.getElementById('resultValue');
const resultExplanation = document.getElementById('resultExplanation');
const additionalResult = document.getElementById('additionalResult');
const additionalValue = document.getElementById('additionalValue');
const additionalExplanation = document.getElementById('additionalExplanation');
const formulaContent = document.getElementById('formulaContent');
const calculateBtn = document.getElementById('calculateBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');

// Input Elements
const inputs = {
  // Percentage of inputs
  'percentage-of-percent': document.getElementById('percentage-of-percent'),
  'percentage-of-number': document.getElementById('percentage-of-number'),
  
  // Percentage what inputs
  'percentage-what-part': document.getElementById('percentage-what-part'),
  'percentage-what-whole': document.getElementById('percentage-what-whole'),
  
  // Percentage change inputs
  'change-original': document.getElementById('change-original'),
  'change-new': document.getElementById('change-new'),
  
  // Percentage difference inputs
  'difference-first': document.getElementById('difference-first'),
  'difference-second': document.getElementById('difference-second')
};

// Current active tab
let activeTab = 'percentage-of';

// Initialize
updateFormula();

// Tab Switching
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tab = button.getAttribute('data-tab');
    
    // Update active tab button
    tabButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Hide all forms
    Object.values(forms).forEach(form => form.classList.add('hidden'));
    
    // Show selected form
    forms[tab].classList.remove('hidden');
    
    // Update active tab
    activeTab = tab;
    
    // Update formula display
    updateFormula();
    
    // Clear results
    clearResults();
  });
});

// Calculate Button
calculateBtn.addEventListener('click', calculate);

// Clear Button
clearBtn.addEventListener('click', clearAll);

// Copy Button
copyBtn.addEventListener('click', copyResult);

// Enter key support
Object.values(inputs).forEach(input => {
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      calculate();
    }
  });
});

// FAQ functionality
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    item.classList.toggle('active');
  });
});

// Functions
function calculate() {
  let result = 0;
  let additional = 0;
  let explanation = '';
  let additionalExp = '';
  let formula = '';
  
  switch (activeTab) {
    case 'percentage-of':
      const percent = parseFloat(inputs['percentage-of-percent'].value);
      const number = parseFloat(inputs['percentage-of-number'].value);
      
      if (isNaN(percent) || isNaN(number)) {
        showError('Please enter valid numbers in both fields');
        return;
      }
      
      result = (percent / 100) * number;
      explanation = `${percent}% of ${formatNumber(number)} is ${formatNumber(result)}`;
      additional = number - result;
      additionalExp = `${formatNumber(number)} minus ${formatNumber(result)} = ${formatNumber(additional)}`;
      formula = `Formula: (${percent} ÷ 100) × ${formatNumber(number)} = ${formatNumber(result)}`;
      break;
      
    case 'percentage-what':
      const part = parseFloat(inputs['percentage-what-part'].value);
      const whole = parseFloat(inputs['percentage-what-whole'].value);
      
      if (isNaN(part) || isNaN(whole) || whole === 0) {
        showError('Please enter valid numbers in both fields (whole cannot be zero)');
        return;
      }
      
      result = (part / whole) * 100;
      explanation = `${formatNumber(part)} is ${formatNumber(result)}% of ${formatNumber(whole)}`;
      additional = whole - part;
      additionalExp = `Remaining: ${formatNumber(whole)} - ${formatNumber(part)} = ${formatNumber(additional)}`;
      formula = `Formula: (${formatNumber(part)} ÷ ${formatNumber(whole)}) × 100 = ${formatNumber(result)}%`;
      break;
      
    case 'percentage-change':
      const original = parseFloat(inputs['change-original'].value);
      const newVal = parseFloat(inputs['change-new'].value);
      
      if (isNaN(original) || isNaN(newVal) || original === 0) {
        showError('Please enter valid numbers in both fields (original cannot be zero)');
        return;
      }
      
      result = ((newVal - original) / original) * 100;
      const changeType = result >= 0 ? 'increase' : 'decrease';
      const absoluteChange = Math.abs(newVal - original);
      explanation = `From ${formatNumber(original)} to ${formatNumber(newVal)} is a ${formatNumber(Math.abs(result))}% ${changeType}`;
      additional = absoluteChange;
      additionalExp = `Absolute change: ${formatNumber(Math.abs(newVal - original))}`;
      formula = `Formula: [(${formatNumber(newVal)} - ${formatNumber(original)}) ÷ ${formatNumber(original)}] × 100 = ${formatNumber(result)}%`;
      break;
      
    case 'percentage-difference':
      const first = parseFloat(inputs['difference-first'].value);
      const second = parseFloat(inputs['difference-second'].value);
      
      if (isNaN(first) || isNaN(second)) {
        showError('Please enter valid numbers in both fields');
        return;
      }
      
      const average = (first + second) / 2;
      result = (Math.abs(first - second) / average) * 100;
      explanation = `The percentage difference between ${formatNumber(first)} and ${formatNumber(second)} is ${formatNumber(result)}%`;
      additional = Math.abs(first - second);
      additionalExp = `Absolute difference: ${formatNumber(Math.abs(first - second))}`;
      formula = `Formula: (|${formatNumber(first)} - ${formatNumber(second)}| ÷ [(${formatNumber(first)} + ${formatNumber(second)}) ÷ 2]) × 100 = ${formatNumber(result)}%`;
      break;
  }
  
  // Update UI
  resultValue.textContent = formatNumber(result) + (activeTab === 'percentage-what' || activeTab === 'percentage-change' || activeTab === 'percentage-difference' ? '%' : '');
  resultExplanation.textContent = explanation;
  
  // Show additional result if applicable
  if (additional !== 0 || activeTab === 'percentage-of') {
    additionalResult.classList.remove('hidden');
    additionalValue.textContent = formatNumber(additional);
    additionalExplanation.textContent = additionalExp;
  } else {
    additionalResult.classList.add('hidden');
  }
  
  // Update formula
  formulaContent.textContent = formula;
  
  // Add success animation
  resultValue.style.color = '#10b981';
  setTimeout(() => {
    resultValue.style.color = '';
  }, 1000);
}

function clearAll() {
  // Clear all inputs
  Object.values(inputs).forEach(input => {
    input.value = '';
  });
  
  // Clear results
  clearResults();
  
  // Reset to first tab
  tabButtons.forEach((btn, index) => {
    if (index === 0) {
      btn.classList.add('active');
      activeTab = btn.getAttribute('data-tab');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Show first form
  Object.values(forms).forEach((form, index) => {
    if (index === 0) {
      form.classList.remove('hidden');
    } else {
      form.classList.add('hidden');
    }
  });
  
  // Update formula
  updateFormula();
}

function clearResults() {
  resultValue.textContent = '0';
  resultExplanation.textContent = 'Enter values above to calculate';
  additionalResult.classList.add('hidden');
  formulaContent.textContent = 'Enter values to see the formula';
}

function copyResult() {
  const textToCopy = `${resultValue.textContent} - ${resultExplanation.textContent}`;
  
  // Use Clipboard API if available
  if (navigator.clipboard) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        showCopySuccess();
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        fallbackCopy(textToCopy);
      });
  } else {
    fallbackCopy(textToCopy);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showCopySuccess();
  } catch (err) {
    console.error('Fallback copy failed: ', err);
  }
  document.body.removeChild(textArea);
}

function showCopySuccess() {
  const originalText = copyBtn.innerHTML;
  copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
  copyBtn.style.background = 'linear-gradient(135deg, #10b981, #0da67e)';
  
  setTimeout(() => {
    copyBtn.innerHTML = originalText;
    copyBtn.style.background = '';
  }, 2000);
}

function showError(message) {
  resultValue.textContent = 'Error';
  resultExplanation.textContent = message;
  resultValue.style.color = '#ef4444';
  
  setTimeout(() => {
    resultValue.style.color = '';
  }, 3000);
}

function updateFormula() {
  let formula = '';
  
  switch (activeTab) {
    case 'percentage-of':
      formula = 'Formula: (Percentage ÷ 100) × Number = Result';
      break;
    case 'percentage-what':
      formula = 'Formula: (Part ÷ Whole) × 100 = Percentage';
      break;
    case 'percentage-change':
      formula = 'Formula: [(New Value - Original Value) ÷ Original Value] × 100 = Percentage Change';
      break;
    case 'percentage-difference':
      formula = 'Formula: (|Value1 - Value2| ÷ [(Value1 + Value2) ÷ 2]) × 100 = Percentage Difference';
      break;
  }
  
  formulaContent.textContent = formula;
}

function formatNumber(num) {
  // Format number for display (add commas, limit decimals)
  if (num === 0) return '0';
  if (Math.abs(num) < 0.0001) return num.toExponential(4);
  if (Math.abs(num) < 1) return num.toFixed(6).replace(/\.?0+$/, '');
  if (Math.abs(num) < 10000) return num.toLocaleString('en-US', { maximumFractionDigits: 4 });
  
  // For large numbers, use compact notation
  if (Math.abs(num) >= 1000000) {
    return num.toExponential(4);
  }
  
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

// Global functions for onclick handlers
window.calculate = calculate;
window.clearAll = clearAll;
window.copyResult = copyResult;
