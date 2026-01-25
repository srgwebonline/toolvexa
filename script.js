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

// Meta Tag Generator JavaScript
// DOM Elements
const pageTitleInput = document.getElementById('pageTitle');
const metaDescriptionInput = document.getElementById('metaDescription');
const pageKeywordsInput = document.getElementById('pageKeywords');
const pageUrlInput = document.getElementById('pageUrl');
const pageImageInput = document.getElementById('pageImage');
const authorNameInput = document.getElementById('authorName');

const titleCount = document.getElementById('titleCount');
const descriptionCount = document.getElementById('descriptionCount');
const keywordsCount = document.getElementById('keywordsCount');

const toggleSeoTags = document.getElementById('toggleSeoTags');
const toggleOgTags = document.getElementById('toggleOgTags');
const toggleTwitterTags = document.getElementById('toggleTwitterTags');
const toggleViewport = document.getElementById('toggleViewport');

const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const copyBtn = document.getElementById('copyBtn');
const copyCodeBtn = document.getElementById('copyCodeBtn');

const resultsSection = document.getElementById('resultsSection');
const generatedCode = document.getElementById('generatedCode');

const previewUrl = document.getElementById('previewUrl');
const previewTitle = document.getElementById('previewTitle');
const previewDescription = document.getElementById('previewDescription');
const previewImage = document.getElementById('previewImage');
const previewDomain = document.getElementById('previewDomain');
const previewOgTitle = document.getElementById('previewOgTitle');
const previewOgDescription = document.getElementById('previewOgDescription');

// Update character counts
function updateCharacterCounts() {
  titleCount.textContent = pageTitleInput.value.length;
  descriptionCount.textContent = metaDescriptionInput.value.length;
  
  const keywords = pageKeywordsInput.value.split(',').filter(kw => kw.trim() !== '');
  keywordsCount.textContent = keywords.length;
  
  // Update color based on recommended lengths
  if (pageTitleInput.value.length >= 50 && pageTitleInput.value.length <= 60) {
    titleCount.style.color = 'var(--secondary)';
  } else {
    titleCount.style.color = 'var(--primary)';
  }
  
  if (metaDescriptionInput.value.length >= 120 && metaDescriptionInput.value.length <= 155) {
    descriptionCount.style.color = 'var(--secondary)';
  } else {
    descriptionCount.style.color = 'var(--primary)';
  }
}

// Generate meta tags code
function generateMetaTags() {
  const title = pageTitleInput.value.trim() || 'My Website';
  const description = metaDescriptionInput.value.trim() || 'Description of my website';
  const keywords = pageKeywordsInput.value.trim() || 'website, web, internet';
  const url = pageUrlInput.value.trim() || 'https://www.example.com/';
  const image = pageImageInput.value.trim() || 'https://www.example.com/image.jpg';
  const author = authorNameInput.value.trim() || 'Website Author';
  
  let code = '';
  
  // Add charset
  code += '<!-- Character Encoding -->\n';
  code += '<meta charset="UTF-8">\n\n';
  
  // Add viewport if enabled
  if (toggleViewport.checked) {
    code += '<!-- Responsive Viewport -->\n';
    code += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\n';
  }
  
  // Add basic SEO tags if enabled
  if (toggleSeoTags.checked) {
    code += '<!-- Basic SEO Meta Tags -->\n';
    code += `<title>${escapeHtml(title)}</title>\n`;
    code += `<meta name="description" content="${escapeHtml(description)}">\n`;
    code += `<meta name="keywords" content="${escapeHtml(keywords)}">\n`;
    code += `<meta name="author" content="${escapeHtml(author)}">\n`;
    code += '<meta name="robots" content="index, follow">\n\n';
  }
  
  // Add Open Graph tags if enabled
  if (toggleOgTags.checked) {
    code += '<!-- Open Graph Meta Tags (Facebook, LinkedIn, Pinterest) -->\n';
    code += `<meta property="og:title" content="${escapeHtml(title)}">\n`;
    code += `<meta property="og:description" content="${escapeHtml(description)}">\n`;
    code += `<meta property="og:image" content="${escapeHtml(image)}">\n`;
    code += `<meta property="og:url" content="${escapeHtml(url)}">\n`;
    code += '<meta property="og:type" content="website">\n';
    code += '<meta property="og:locale" content="en_US">\n';
    code += '<meta property="og:site_name" content="My Website">\n\n';
  }
  
  // Add Twitter Card tags if enabled
  if (toggleTwitterTags.checked) {
    code += '<!-- Twitter Card Meta Tags -->\n';
    code += '<meta name="twitter:card" content="summary_large_image">\n';
    code += `<meta name="twitter:title" content="${escapeHtml(title)}">\n`;
    code += `<meta name="twitter:description" content="${escapeHtml(description)}">\n`;
    code += `<meta name="twitter:image" content="${escapeHtml(image)}">\n`;
    code += '<meta name="twitter:site" content="@username">\n';
    code += '<meta name="twitter:creator" content="@username">\n';
  }
  
  // Add canonical URL
  code += '\n<!-- Canonical URL -->\n';
  code += `<link rel="canonical" href="${escapeHtml(url)}">`;
  
  return code;
}

// Escape HTML special characters
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Update previews
function updatePreviews() {
  const title = pageTitleInput.value.trim() || 'My Website';
  const description = metaDescriptionInput.value.trim() || 'Description of my website';
  const url = pageUrlInput.value.trim() || 'https://www.example.com/';
  const image = pageImageInput.value.trim() || 'https://www.example.com/image.jpg';
  
  // Extract domain from URL
  const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  
  // Update search preview
  previewUrl.textContent = domain;
  previewTitle.textContent = title;
  previewDescription.textContent = description;
  
  // Update social preview
  previewDomain.textContent = domain;
  previewOgTitle.textContent = title;
  previewOgDescription.textContent = description;
  
  // Update image preview
  if (image) {
    previewImage.innerHTML = '';
    const img = document.createElement('div');
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.backgroundImage = `url('${image}')`;
    img.style.backgroundSize = 'cover';
    img.style.backgroundPosition = 'center';
    previewImage.appendChild(img);
  }
}

// Generate and display results WITHOUT AUTO-SCROLL
function generateAndDisplay(shouldScroll = false) {
  const title = pageTitleInput.value.trim();
  const description = metaDescriptionInput.value.trim();
  
  // Validate inputs
  if (!title) {
    alert('Please enter a page title.');
    pageTitleInput.focus();
    return;
  }
  
  if (!description) {
    alert('Please enter a meta description.');
    metaDescriptionInput.focus();
    return;
  }
  
  // Generate code
  const code = generateMetaTags();
  
  // Display code with syntax highlighting
  generatedCode.innerHTML = '';
  const lines = code.split('\n');
  
  lines.forEach(line => {
    const div = document.createElement('div');
    div.className = line.trim().startsWith('<!--') ? 'meta-tag-line comment' : 'meta-tag-line';
    
    // Add syntax highlighting
    let highlightedLine = line
      .replace(/&lt;meta/g, '<span style="color: #569cd6;">&lt;meta</span>')
      .replace(/&lt;title/g, '<span style="color: #569cd6;">&lt;title</span>')
      .replace(/&lt;link/g, '<span style="color: #569cd6;">&lt;link</span>')
      .replace(/&lt;\/title&gt;/g, '<span style="color: #569cd6;">&lt;/title&gt;</span>')
      .replace(/&lt;\/meta&gt;/g, '<span style="color: #569cd6;">&lt;/meta&gt;</span>')
      .replace(/&lt;\/link&gt;/g, '<span style="color: #569cd6;">&lt;/link&gt;</span>')
      .replace(/&gt;/g, '<span style="color: #569cd6;">&gt;</span>')
      .replace(/(name|property|content|charset|rel|href)=/g, '<span style="color: #9cdcfe;">$1</span>=')
      .replace(/"([^"]*)"/g, '<span style="color: #ce9178;">"$1"</span>')
      .replace(/&lt;!--/g, '<span style="color: #6a9955;">&lt;!--</span>')
      .replace(/--&gt;/g, '<span style="color: #6a9955;">--&gt;</span>');
    
    div.innerHTML = highlightedLine;
    generatedCode.appendChild(div);
  });
  
  // Update previews
  updatePreviews();
  
  // Show results section
  resultsSection.style.display = 'block';
  
  // Only scroll to results if explicitly requested (user clicked generate)
  if (shouldScroll) {
    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

// Reset form
function resetForm() {
  pageTitleInput.value = 'My Awesome Website - Best Products & Services';
  metaDescriptionInput.value = 'Discover the best products and services on our awesome website. We offer quality solutions for your needs with excellent customer support.';
  pageKeywordsInput.value = 'website, products, services, solutions, quality';
  pageUrlInput.value = 'https://www.example.com/page';
  pageImageInput.value = 'https://www.example.com/image.jpg';
  authorNameInput.value = 'John Doe';
  
  toggleSeoTags.checked = true;
  toggleOgTags.checked = true;
  toggleTwitterTags.checked = true;
  toggleViewport.checked = true;
  
  updateCharacterCounts();
  
  // Hide results
  resultsSection.style.display = 'none';
  
  // Generate without scroll
  generateAndDisplay(false);
}

// Copy code to clipboard
function copyToClipboard() {
  const code = generateMetaTags();
  
  navigator.clipboard.writeText(code).then(() => {
    // Show success feedback
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    copyBtn.style.background = 'linear-gradient(135deg, var(--secondary), #0da67e)';
    
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy to clipboard. Please try again.');
  });
}

// Copy code from code container
function copyCodeToClipboard() {
  const code = generateMetaTags();
  
  navigator.clipboard.writeText(code).then(() => {
    // Show success feedback
    const originalText = copyCodeBtn.innerHTML;
    copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    copyCodeBtn.style.background = 'linear-gradient(135deg, var(--secondary), #0da67e)';
    
    setTimeout(() => {
      copyCodeBtn.innerHTML = originalText;
      copyCodeBtn.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy to clipboard. Please try again.');
  });
}

// Event Listeners
pageTitleInput.addEventListener('input', updateCharacterCounts);
metaDescriptionInput.addEventListener('input', updateCharacterCounts);
pageKeywordsInput.addEventListener('input', updateCharacterCounts);

// Initialize character counts
updateCharacterCounts();

// Action buttons
generateBtn.addEventListener('click', function() {
  generateAndDisplay(true); // Pass true to scroll to results
});

resetBtn.addEventListener('click', resetForm);
copyBtn.addEventListener('click', copyToClipboard);
copyCodeBtn.addEventListener('click', copyCodeToClipboard);

// Enter key support - scroll when user presses enter
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
    generateAndDisplay(true);
  }
});

// FAQ functionality
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    item.classList.toggle('active');
  });
});

// Auto-generate on page load WITHOUT auto-scroll
generateAndDisplay(false);
