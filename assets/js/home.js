// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Performance optimization flags
  let isScrolling = false;
  let scrollTimer = null;
  let lastScrollY = window.scrollY;
  
  // Theme Management
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');
  
  // Set initial theme
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    body.classList.add('dark-theme');
  }
  
  // Theme toggle function
  function toggleTheme() {
    const isDark = body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Add subtle animation
    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => {
      themeToggle.style.transform = 'scale(1)';
    }, 150);
  }
  
  themeToggle.addEventListener('click', toggleTheme);
  
  // Mobile Menu Management
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  
  function openSidebar() {
    sidebar.setAttribute('aria-hidden', 'false');
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeSidebar() {
    sidebar.setAttribute('aria-hidden', 'true');
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  mobileMenuBtn.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);
  
  // Close sidebar when clicking on a link
  document.querySelectorAll('.sidebar-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    });
  });
  
  // Optimized Smooth Scrolling
  function smoothScrollTo(targetId) {
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;
    
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = targetPosition - navbarHeight - 20;
    
    // Use native smooth scroll if available and not reduced motion
    if ('scrollBehavior' in document.documentElement.style && 
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback for browsers without smooth scroll support
      window.scrollTo(0, offsetPosition);
    }
  }
  
  // Add smooth scrolling to all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      e.preventDefault();
      smoothScrollTo(targetId);
      
      // Update URL without page reload
      history.pushState(null, null, targetId);
    });
  });
  
  // Optimized Navbar Scroll Effect
  function handleScroll() {
    if (isScrolling) return;
    
    isScrolling = true;
    
    requestAnimationFrame(() => {
      const navbar = document.querySelector('.navbar');
      const currentScrollY = window.scrollY;
      
      // Add/remove scrolled class based on scroll position
      if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      // Update last scroll position
      lastScrollY = currentScrollY;
      isScrolling = false;
    });
  }
  
  // Throttle scroll events
  window.addEventListener('scroll', () => {
    if (scrollTimer) return;
    
    scrollTimer = setTimeout(() => {
      handleScroll();
      scrollTimer = null;
    }, 100);
  });
  
  // Lazy loading for tool cards (if many)
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe tool cards for lazy loading
  document.querySelectorAll('.tool-card, .category-card').forEach((el) => {
    observer.observe(el);
  });
  
  // Search functionality (simplified)
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  
  if (searchInput && searchButton) {
    function performSearch() {
      const searchTerm = searchInput.value.trim().toLowerCase();
      if (!searchTerm) return;
      
      // Simple search implementation
      const allTools = Array.from(document.querySelectorAll('.tool-card'));
      const results = allTools.filter(tool => {
        const toolName = tool.querySelector('.tool-name').textContent.toLowerCase();
        const toolDesc = tool.querySelector('.tool-description').textContent.toLowerCase();
        return toolName.includes(searchTerm) || toolDesc.includes(searchTerm);
      });
      
      // Highlight results
      allTools.forEach(tool => tool.classList.remove('search-highlight'));
      results.forEach(tool => tool.classList.add('search-highlight'));
      
      // Scroll to first result if found
      if (results.length > 0) {
        smoothScrollTo(`#${results[0].closest('.tools-section').id}`);
      }
    }
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }
  
  // Handle window resize
  function handleResize() {
    if (window.innerWidth >= 1024) {
      closeSidebar();
    }
  }
  
  window.addEventListener('resize', handleResize);
  
  // Initialize scroll position
  handleScroll();
  
  // Analytics tracking (AdSense compliant)
  document.querySelectorAll('.btn-tool').forEach(button => {
    button.addEventListener('click', function(e) {
      const toolName = this.closest('.tool-card').querySelector('.tool-name').textContent;
      
      // Send to analytics (example)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'tool_click', {
          'event_category': 'Tool Usage',
          'event_label': toolName
        });
      }
      
      // Console log for debugging
      console.log(`Tool clicked: ${toolName}`);
    });
  });
  
  // Add scrolled class to navbar on scroll
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Initialize
  console.log('Toolsedito loaded successfully');
});

// Service Worker Registration (for performance)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('ServiceWorker registration failed:', err);
    });
  });
}
