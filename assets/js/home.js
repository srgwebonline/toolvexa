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

// Add scroll animation for elements
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in-up');
    }
  });
}, observerOptions);

// Observe all tool cards for animation
document.querySelectorAll('.tool-card, .category-card, .why-choose-card').forEach((el) => {
  observer.observe(el);
});

// Add hover effect to CTA button
const ctaBtn = document.querySelector('.cta-btn');
if (ctaBtn) {
  ctaBtn.addEventListener('mouseenter', () => {
    ctaBtn.classList.add('animate__animated', 'animate__tada');
    setTimeout(() => {
      ctaBtn.classList.remove('animate__animated', 'animate__tada');
    }, 1000);
  });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.padding = '12px 0';
    navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.padding = '18px 0';
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
  }
});

// Handle responsive behavior on window resize
window.addEventListener('resize', function() {
  if (window.innerWidth >= 1024) {
    closeSidebar();
  }
});

// Add active state to sidebar links based on scroll position
window.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.sidebar-links a');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 150)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Update theme status in sidebar when theme changes
const themeObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.attributeName === 'class') {
      const isDark = body.classList.contains('dark-theme');
      updateThemeStatus(isDark);
    }
  });
});

themeObserver.observe(body, { attributes: true });

// ENHANCED: Search functionality with better UX
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

// Create search results dropdown
const searchResults = document.createElement('div');
searchResults.className = 'search-results';
searchResults.style.cssText = `
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  display: none;
  border: 1px solid var(--border-color);
`;

// Insert search results after search container
document.querySelector('.search-container').appendChild(searchResults);

// Get all tools for search
const allTools = Array.from(document.querySelectorAll('.tool-card')).map(card => {
  return {
    name: card.querySelector('.tool-name').textContent,
    description: card.querySelector('.tool-description').textContent,
    category: card.closest('.tools-section').querySelector('h3').textContent,
    element: card,
    link: card.querySelector('.btn-tool').getAttribute('href')
  };
});

// Enhanced search function
function performSearch(searchTerm = '') {
  searchTerm = searchTerm || searchInput.value.trim().toLowerCase();
  
  if (searchTerm) {
    // Filter tools
    const results = allTools.filter(tool => {
      return tool.name.toLowerCase().includes(searchTerm) ||
             tool.description.toLowerCase().includes(searchTerm) ||
             tool.category.toLowerCase().includes(searchTerm);
    });
    
    // Display results
    if (results.length > 0) {
      searchResults.innerHTML = '';
      results.forEach(tool => {
        const resultItem = document.createElement('a');
        resultItem.href = tool.link;
        resultItem.className = 'search-result-item';
        resultItem.style.cssText = `
          display: block;
          padding: 15px 20px;
          text-decoration: none;
          color: var(--text-color);
          border-bottom: 1px solid var(--border-color);
          transition: all 0.2s ease;
          cursor: pointer;
        `;
        
        resultItem.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="display: block; margin-bottom: 5px; color: var(--primary);">${tool.name}</strong>
              <small style="color: var(--gray);">${tool.description.substring(0, 70)}...</small>
            </div>
            <span style="background: var(--light-gray); padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; color: var(--secondary);">
              ${tool.category}
            </span>
          </div>
        `;
        
        resultItem.addEventListener('click', function(e) {
          e.preventDefault();
          // Scroll to the tool
          const section = tool.element.closest('.tools-section');
          if (section) {
            window.scrollTo({
              top: section.offsetTop - 100,
              behavior: 'smooth'
            });
            
            // Highlight the found tool
            tool.element.style.animation = 'none';
            tool.element.offsetHeight; // Trigger reflow
            tool.element.style.animation = 'pulse 1.5s ease-in-out';
            
            // Close search results
            searchResults.style.display = 'none';
            searchInput.blur();
          }
        });
        
        searchResults.appendChild(resultItem);
      });
      
      // Add "View all results" link
      const viewAll = document.createElement('div');
      viewAll.style.cssText = `
        padding: 15px 20px;
        text-align: center;
        background: var(--light-gray);
        border-radius: 0 0 12px 12px;
      `;
      viewAll.innerHTML = `
        <a href="#tools" style="color: var(--primary); text-decoration: none; font-weight: 600; display: block;">
          View all ${results.length} matching tools
        </a>
      `;
      
      viewAll.querySelector('a').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('#tools').scrollIntoView({ behavior: 'smooth' });
        searchResults.style.display = 'none';
      });
      
      searchResults.appendChild(viewAll);
      searchResults.style.display = 'block';
    } else {
      // No results
      searchResults.innerHTML = `
        <div style="padding: 30px 20px; text-align: center; color: var(--gray);">
          <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 15px; opacity: 0.5;"></i>
          <p style="margin-bottom: 10px;">No tools found for "${searchTerm}"</p>
          <p style="font-size: 0.9rem;">Try searching for: PDF, image, SEO, calculator, AI, etc.</p>
        </div>
      `;
      searchResults.style.display = 'block';
    }
  } else {
    // If search is empty, hide results
    searchResults.style.display = 'none';
  }
}

// Event listeners for search
searchButton.addEventListener('click', () => performSearch());
searchInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    performSearch();
  }
});

// Real-time search as user types
let searchTimeout;
searchInput.addEventListener('input', function() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (this.value.trim().length > 0) {
      performSearch(this.value.trim());
    } else {
      searchResults.style.display = 'none';
    }
  }, 300);
});

// Close search results when clicking outside
document.addEventListener('click', function(e) {
  if (!e.target.closest('.search-container')) {
    searchResults.style.display = 'none';
  }
});

// Add pulse animation for search highlight
if (!document.querySelector('#pulse-animation')) {
  const style = document.createElement('style');
  style.id = 'pulse-animation';
  style.textContent = `
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
      100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
    }
  `;
  document.head.appendChild(style);
}

// Track tool usage for analytics (AdSense compliant)
document.querySelectorAll('.btn-tool').forEach(button => {
  button.addEventListener('click', function(e) {
    const toolName = this.closest('.tool-card').querySelector('.tool-name').textContent;
    console.log(`Tool clicked: ${toolName}`);
    // You can add Google Analytics tracking here
    // gtag('event', 'tool_click', { 'tool_name': toolName });
  });
});
