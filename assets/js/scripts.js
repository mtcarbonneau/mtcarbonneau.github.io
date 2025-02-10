document.addEventListener('DOMContentLoaded', function() {
    console.log('Welcome to My GitHub Pages Website');
    
    // Get current page URL
    const siteURL = window.location.href;
    
    // Check if we're on GitHub Pages
    if (siteURL.includes('.github.io')) {
        console.log('Viewing on GitHub Pages at: ' + siteURL);
    }
});