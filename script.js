// ==================== Configuration ====================
const CONFIG = {
    linksFile: 'links.json',
    animationDelay: 100, // ms between each link animation
};

// ==================== Icon Mapping ====================
// Maps icon names to emoji or symbols
const ICON_MAP = {
    portfolio: '💼',
    resume: '📄',
    linkedin: '💼',
    blog: '✍️',
    github: '👨‍💻',
    email: '✉️',
    twitter: '🐦',
    website: '🌐',
    youtube: '📺',
    medium: '📝',
    dribbble: '🎨',
    behance: '🎨',
    instagram: '📸',
    facebook: '👥',
    discord: '💬',
    slack: '💬',
    telegram: '✈️',
    whatsapp: '💬',
    phone: '📞',
    calendar: '📅',
    research: '🔬',
    publication: '📚',
    project: '🚀',
    default: '🔗'
};

// ==================== Main Application ====================
class LinkTreeApp {
    constructor() {
        this.linksContainer = document.getElementById('linksContainer');
        this.init();
    }

    async init() {
        try {
            // Load data from JSON
            const data = await this.loadJSON(CONFIG.linksFile);
            
            // Update profile information
            this.updateProfile(data.profile);
            
            // Render links
            this.renderLinks(data.links);
            
        } catch (error) {
            this.handleError(error);
        }
    }

    async loadJSON(filename) {
        try {
            const response = await fetch(filename);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading JSON:', error);
            throw error;
        }
    }

    updateProfile(profile) {
        if (!profile) return;

        // Update profile image
        if (profile.image) {
            const profileImage = document.getElementById('profileImage');
            if (profileImage) {
                profileImage.src = profile.image;
                profileImage.alt = profile.name || 'Profile Picture';
            }
        }

        // Update name
        if (profile.name) {
            const profileName = document.getElementById('profileName');
            if (profileName) profileName.textContent = profile.name;
            
            // Update page title
            document.title = `${profile.name} | ${profile.title || 'Links'}`;
        }

        // Update title
        if (profile.title) {
            const profileTitle = document.getElementById('profileTitle');
            if (profileTitle) profileTitle.textContent = profile.title;
        }

        // Update bio
        if (profile.bio) {
            const profileBio = document.getElementById('profileBio');
            if (profileBio) profileBio.textContent = profile.bio;
        }
    }

    renderLinks(links) {
        if (!links || links.length === 0) {
            this.linksContainer.innerHTML = '<p class="loading">No links available</p>';
            return;
        }

        // Clear loading message
        this.linksContainer.innerHTML = '';

        // Filter out inactive links
        const activeLinks = links.filter(link => link.active !== false);

        // Create link cards
        activeLinks.forEach((link, index) => {
            const linkCard = this.createLinkCard(link, index);
            this.linksContainer.appendChild(linkCard);
        });
    }

    createLinkCard(link, index) {
        // Create anchor element
        const card = document.createElement('a');
        card.className = 'link-card';
        card.href = link.url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.setAttribute('aria-label', link.title);

        // Add analytics tracking if available
        if (link.analytics) {
            card.addEventListener('click', () => this.trackClick(link));
        }

        // Create icon
        const icon = document.createElement('div');
        icon.className = 'link-icon';
        icon.innerHTML = this.getIcon(link.icon);
        card.appendChild(icon);

        // Create content wrapper
        const content = document.createElement('div');
        content.className = 'link-content';

        // Add title
        const title = document.createElement('div');
        title.className = 'link-title';
        title.textContent = link.title;
        content.appendChild(title);

        // Add description if available
        if (link.description) {
            const description = document.createElement('div');
            description.className = 'link-description';
            description.textContent = link.description;
            content.appendChild(description);
        }

        card.appendChild(content);

        // Add arrow icon
        const arrow = document.createElement('div');
        arrow.className = 'link-arrow';
        arrow.innerHTML = '→';
        card.appendChild(arrow);

        return card;
    }

    getIcon(iconName) {
        if (!iconName) return ICON_MAP.default;
        
        // Check if it's a custom icon (starts with emoji or special character)
        if (iconName.length <= 3 && /[\u{1F300}-\u{1F9FF}]/u.test(iconName)) {
            return iconName;
        }
        
        // Otherwise, look it up in the icon map
        const normalizedName = iconName.toLowerCase().trim();
        return ICON_MAP[normalizedName] || ICON_MAP.default;
    }

    trackClick(link) {
        // Simple analytics tracking - can be extended with Google Analytics, etc.
        console.log('Link clicked:', link.title, link.url);
        
        // Example: Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'Link',
                event_label: link.title,
                value: link.url
            });
        }
    }

    handleError(error) {
        console.error('Application error:', error);
        this.linksContainer.innerHTML = `
            <div class="loading" style="color: #E53E3E;">
                <p>⚠️ Error loading links</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">
                    Please make sure <code>links.json</code> exists and is valid JSON.
                </p>
            </div>
        `;
    }
}

// ==================== Initialize App ====================
// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new LinkTreeApp());
} else {
    new LinkTreeApp();
}

// ==================== Utility Functions ====================
// Add smooth scroll behavior for any future anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Clear any focus
        document.activeElement.blur();
    }
});

// Log app version
console.log('🔗 LinkTree App v1.0.0 | Built for data-driven professionals');

