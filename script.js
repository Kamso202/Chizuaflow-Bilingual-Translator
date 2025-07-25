// Translation Application JavaScript
// This application provides bilingual translation between English and Spanish
// using Google Translate API through a CORS proxy service

class BilingualTranslator {
    constructor() {
        this.currentSourceLang = 'en';
        this.currentTargetLang = 'es';
        this.apiEndpoint = 'https://api.mymemory.translated.net/get';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateLanguageDisplay();
        this.setupCharacterCounter();
    }

    setupEventListeners() {
        // Real-time character counting
        const sourceText = document.getElementById('source-text');
        sourceText.addEventListener('input', () => {
            this.updateCharacterCount();
        });

        // Enter key for translation
        sourceText.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.translateText();
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-dropdown')) {
                document.querySelectorAll('.dropdown-options').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
                document.querySelectorAll('.dropdown-selected').forEach(selected => {
                    selected.classList.remove('active');
                });
            }
        });
    }

    setupCharacterCounter() {
        this.updateCharacterCount();
    }

    updateCharacterCount() {
        const sourceText = document.getElementById('source-text');
        const charCounter = document.getElementById('char-counter');
        const count = sourceText.value.length;
        charCounter.textContent = count;
        
        // Color coding for character limit
        if (count > 4500) {
            charCounter.style.color = '#ff4444';
        } else if (count > 4000) {
            charCounter.style.color = '#ff8800';
        } else {
            charCounter.style.color = '#666';
        }
    }

    selectLanguagePair(source, target) {
        // Update current language pair
        this.currentSourceLang = source;
        this.currentTargetLang = target;

        // Update display
        this.updateLanguageDisplay();
        
        // Clear previous translation and restore placeholder
        document.getElementById('target-text').innerHTML = `
            <div class="placeholder-content">
                <i class="fas fa-magic"></i>
                <p>Your beautiful translation will appear here...</p>
            </div>
        `;
    }

    updateLanguageDisplay() {
        const sourceDisplay = document.getElementById('source-lang');
        const targetDisplay = document.getElementById('target-lang');
        
        const languageNames = {
            'en': 'English',
            'es': 'Spanish'
        };

        sourceDisplay.textContent = languageNames[this.currentSourceLang];
        targetDisplay.textContent = languageNames[this.currentTargetLang];
    }

    async translateText() {
        const sourceText = document.getElementById('source-text').value.trim();
        
        if (!sourceText) {
            this.showNotification('Please enter text to translate', 'warning');
            return;
        }

        if (sourceText.length > 5000) {
            this.showNotification('Text is too long. Maximum 5000 characters allowed.', 'error');
            return;
        }

        try {
            this.showLoading(true);
            const translation = await this.performTranslation(sourceText);
            this.displayTranslation(translation);
            this.showNotification('Translation completed successfully!', 'success');
        } catch (error) {
            console.error('Translation error:', error);
            this.showNotification('Translation failed. Please try again.', 'error');
            this.displayTranslation('Translation service is currently unavailable. Please try again later.');
        } finally {
            this.showLoading(false);
        }
    }

    async performTranslation(text) {
        // Using MyMemory Translation API as a free alternative to Google Translate
        // In production, you would use Google Translate API with proper authentication
        
        const encodedText = encodeURIComponent(text);
        const url = `${this.apiEndpoint}?q=${encodedText}&langpair=${this.currentSourceLang}|${this.currentTargetLang}`;

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.responseStatus === 200) {
            return data.responseData.translatedText;
        } else {
            throw new Error('Translation service error');
        }
    }

    displayTranslation(translation) {
        const targetTextElement = document.getElementById('target-text');
        
        // Remove placeholder content and add actual translation
        targetTextElement.innerHTML = `<div class="translation-text">${translation}</div>`;
        
        // Add fade-in animation with enhanced effects
        const translationText = targetTextElement.querySelector('.translation-text');
        translationText.style.opacity = '0';
        translationText.style.transform = 'translateY(20px) scale(0.95)';
        
        setTimeout(() => {
            translationText.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            translationText.style.opacity = '1';
            translationText.style.transform = 'translateY(0) scale(1)';
        }, 150);

        // Add subtle celebration effect
        this.addCelebrationEffect();
    }

    addCelebrationEffect() {
        const magicCircle = document.querySelector('.magic-circle');
        if (magicCircle) {
            magicCircle.style.transform = 'scale(1.2)';
            magicCircle.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
            
            setTimeout(() => {
                magicCircle.style.transition = 'all 0.4s ease';
                magicCircle.style.transform = 'scale(1)';
                magicCircle.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
            }, 300);
        }
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById('loading');
        const translateBtn = document.getElementById('translate-btn');
        
        if (show) {
            loadingOverlay.style.display = 'flex';
            translateBtn.disabled = true;
            translateBtn.innerHTML = '<i class="fas fa-sparkles fa-spin"></i><span>Translating...</span>';
            translateBtn.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        } else {
            loadingOverlay.style.display = 'none';
            translateBtn.disabled = false;
            translateBtn.innerHTML = '<i class="fas fa-magic"></i><span>Translate</span><div class="btn-shine"></div>';
            translateBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1001',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336',
            info: '#2196F3'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Style the close button
        const closeBtn = notification.querySelector('button');
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0',
            marginLeft: '10px'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Dropdown Functions
function toggleDropdown(type) {
    const dropdown = document.getElementById(`${type}-options`);
    const selected = document.querySelector(`#${type}-dropdown .dropdown-selected`);
    
    // Close other dropdowns
    document.querySelectorAll('.dropdown-options').forEach(d => {
        if (d !== dropdown) {
            d.classList.remove('active');
        }
    });
    document.querySelectorAll('.dropdown-selected').forEach(s => {
        if (s !== selected) {
            s.classList.remove('active');
        }
    });
    
    // Toggle current dropdown
    dropdown.classList.toggle('active');
    selected.classList.toggle('active');
}

function selectLanguage(type, langCode, flag, name) {
    const selected = document.querySelector(`#${type}-dropdown .dropdown-selected`);
    const dropdown = document.getElementById(`${type}-options`);
    
    // Update selected display
    selected.querySelector('.flag').textContent = flag;
    selected.querySelector('.language-name').textContent = name;
    
    // Update active state in dropdown
    dropdown.querySelectorAll('.dropdown-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === langCode) {
            option.classList.add('active');
        }
    });
    
    // Close dropdown
    dropdown.classList.remove('active');
    selected.classList.remove('active');
    
    // Update translator
    if (type === 'source') {
        translator.selectLanguagePair(langCode, translator.currentTargetLang);
    } else {
        translator.selectLanguagePair(translator.currentSourceLang, langCode);
    }
}

// Utility Functions
function swapLanguages() {
    const sourceDropdown = document.getElementById('source-dropdown');
    const targetDropdown = document.getElementById('target-dropdown');
    
    const sourceFlag = sourceDropdown.querySelector('.dropdown-selected .flag').textContent;
    const sourceName = sourceDropdown.querySelector('.dropdown-selected .language-name').textContent;
    const targetFlag = targetDropdown.querySelector('.dropdown-selected .flag').textContent;
    const targetName = targetDropdown.querySelector('.dropdown-selected .language-name').textContent;
    
    // Swap the dropdowns
    sourceDropdown.querySelector('.dropdown-selected .flag').textContent = targetFlag;
    sourceDropdown.querySelector('.dropdown-selected .language-name').textContent = targetName;
    targetDropdown.querySelector('.dropdown-selected .flag').textContent = sourceFlag;
    targetDropdown.querySelector('.dropdown-selected .language-name').textContent = sourceName;
    
    // Update active states
    const sourceLang = sourceName === 'English' ? 'en' : 'es';
    const targetLang = targetName === 'English' ? 'en' : 'es';
    
    // Update dropdown options active states
    document.querySelectorAll('#source-options .dropdown-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === targetLang) {
            option.classList.add('active');
        }
    });
    
    document.querySelectorAll('#target-options .dropdown-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === sourceLang) {
            option.classList.add('active');
        }
    });
    
    // Update translator
    translator.selectLanguagePair(targetLang, sourceLang);
    
    // Swap text content if both fields have content
    const sourceText = document.getElementById('source-text');
    const targetTextElement = document.getElementById('target-text');
    const translationText = targetTextElement.querySelector('.translation-text');
    
    if (sourceText.value.trim() && translationText) {
        const tempText = sourceText.value;
        sourceText.value = translationText.textContent;
        targetTextElement.innerHTML = `<div class="translation-text">${tempText}</div>`;
        translator.updateCharacterCount();
    }
}

function clearText() {
    const sourceText = document.getElementById('source-text');
    const targetText = document.getElementById('target-text');
    
    sourceText.value = '';
    targetText.innerHTML = `
        <div class="placeholder-content">
            <i class="fas fa-magic"></i>
            <p>Your beautiful translation will appear here...</p>
        </div>
    `;
    translator.updateCharacterCount();
    sourceText.focus();
    
    // Add subtle clear animation
    sourceText.style.transform = 'scale(0.98)';
    setTimeout(() => {
        sourceText.style.transition = 'transform 0.2s ease';
        sourceText.style.transform = 'scale(1)';
    }, 100);
}

async function copyTranslation() {
    const targetTextElement = document.getElementById('target-text');
    const translationText = targetTextElement.querySelector('.translation-text');
    
    if (!translationText) {
        translator.showNotification('No translation to copy', 'warning');
        return;
    }
    
    const targetText = translationText.textContent;

    try {
        await navigator.clipboard.writeText(targetText);
        translator.showNotification('Translation copied to clipboard!', 'success');
        
        // Visual feedback
        const copyBtn = document.querySelector('.copy-btn');
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.color = '#4CAF50';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
            copyBtn.style.color = '';
        }, 1500);
    } catch (error) {
        console.error('Failed to copy:', error);
        translator.showNotification('Failed to copy translation', 'error');
    }
}

// Global translation function for button onclick
function translateText() {
    translator.translateText();
}

// Navigation functionality
function scrollToTranslator() {
    document.getElementById('translator').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    const navMenu = document.getElementById('nav-menu');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

// Active navigation highlighting
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.id;
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// Form submission
function initContactForm() {
    const form = document.querySelector('.form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success message
            translator.showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            
            // Reset form
            form.reset();
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.translator = new BilingualTranslator();
    
    // Initialize navigation features
    initSmoothScrolling();
    initActiveNav();
    initContactForm();
    
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    console.log('🌍 LinguaFlow website loaded successfully!');
    console.log('💡 Features: Full responsive website with smooth navigation');
    console.log('🔄 API: MyMemory Translation Service integrated');
    console.log('📱 Mobile: Hamburger menu and touch-optimized design');
    console.log('🎨 Design: Vibrant colors and modern UI/UX');
});

// Service Worker registration for offline capability (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // This would be implemented if you create a service worker file
        // navigator.serviceWorker.register('/sw.js');
    });
}