// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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
  }
  
  // Update theme status text and icon
  function updateThemeStatus(isDark) {
    if (themeStatus) {
      themeStatus.textContent = isDark ? 'ON' : 'OFF';
    }
  }
  
  // Event listeners for theme toggles
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
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
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  
  // Close sidebar
  function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
  
  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }
  
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }
  
  // Close sidebar when clicking on a link (for mobile)
  document.querySelectorAll('.sidebar-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (!this.id.includes('Theme')) {
        closeSidebar();
      }
    });
  });
  
  // Simple smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if(targetElement) {
        e.preventDefault();
        const offsetTop = targetElement.offsetTop - 80;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Navbar scroll effect - lightweight
  let lastScroll = 0;
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar.style.padding = '12px 0';
      navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.padding = '18px 0';
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
    }
    
    lastScroll = currentScroll;
  });
  
  // Handle responsive behavior on window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 1024) {
      closeSidebar();
    }
  });
  
  // Simple search functionality
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  
  if (searchButton && searchInput) {
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
    
    // Simple search function
    function performSearch() {
      const searchTerm = searchInput.value.trim().toLowerCase();
      if (searchTerm) {
        // Find first matching tool and scroll to it
        const allTools = document.querySelectorAll('.tool-card');
        for (const tool of allTools) {
          const toolName = tool.querySelector('.tool-name').textContent.toLowerCase();
          const toolDesc = tool.querySelector('.tool-description').textContent.toLowerCase();
          
          if (toolName.includes(searchTerm) || toolDesc.includes(searchTerm)) {
            const section = tool.closest('.tools-section');
            if (section) {
              window.scrollTo({
                top: section.offsetTop - 100,
                behavior: 'smooth'
              });
              
              // Highlight the found tool
              tool.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.3)';
              setTimeout(() => {
                tool.style.boxShadow = '';
              }, 2000);
              break;
            }
          }
        }
      }
    }
  }
  
  // Track tool clicks for analytics (AdSense compliant)
  document.querySelectorAll('.btn-tool').forEach(button => {
    button.addEventListener('click', function(e) {
      // You can add Google Analytics tracking here
      // Example: gtag('event', 'tool_click', { 'tool_name': toolName });
    });
  });
  
  // Lazy load images (if any)
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
});

// Performance optimizations
window.addEventListener('load', function() {
  // Remove loading animations after page load
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});

// Service Worker registration (optional for PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').catch(function(error) {
      console.log('ServiceWorker registration failed:', error);
    });
  });
}
