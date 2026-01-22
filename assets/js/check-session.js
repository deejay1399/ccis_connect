// SESSION CHECK - Universal function for all pages
// Expects window.sessionData to be set by PHP

window.checkUserSession = function() {
    if (!window.sessionData) {
        console.log('❌ No session data available');
        return { isValid: false, user: null };
    }
    
    return window.sessionData;
};

console.log('✅ Session check function initialized');
