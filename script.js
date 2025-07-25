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
        // Language selection
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectLanguagePair(e.currentTarget);
            });
        });

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

    selectLanguagePair(selectedOption) {
        // Remove active class from all options
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.remove('active');
        });

        // Add active class to selected option
        selectedOption.classList.add('active');

        // Update current language pair
        this.currentSourceLang = selectedOption.dataset.source;
        this.currentTargetLang = selectedOption.dataset.target;

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

// Utility Functions
function swapLanguages() {
    const languageOptions = document.querySelectorAll('.language-option');
    const activeOption = document.querySelector('.language-option.active');
    
    // Find the other option
    const otherOption = Array.from(languageOptions).find(option => option !== activeOption);
    
    if (otherOption) {
        translator.selectLanguagePair(otherOption);
        
        // Swap text content if both fields have content
        const sourceText = document.getElementById('source-text');
        const targetText = document.getElementById('target-text');
        
        if (sourceText.value.trim() && targetText.textContent !== 'Translation will appear here...') {
            const tempText = sourceText.value;
            sourceText.value = targetText.textContent;
            targetText.textContent = tempText;
            translator.updateCharacterCount();
        }
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.translator = new BilingualTranslator();
    
    // Add some helpful keyboard shortcuts info
    console.log('🌍 Bilingual Translator loaded successfully!');
    console.log('💡 Tip: Use Ctrl+Enter to translate quickly');
    console.log('🔄 API: Using MyMemory Translation Service');
    console.log('📱 Responsive: Mobile-friendly design included');
});

// Service Worker registration for offline capability (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // This would be implemented if you create a service worker file
        // navigator.serviceWorker.register('/sw.js');
    });
}