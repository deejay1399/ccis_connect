// SESSION CHECK - Universal function for all pages
// Expects window.sessionData to be set by PHP

window.checkUserSession = function() {
    if (!window.sessionData) {
        return { isValid: false, user: null };
    }
    
    return window.sessionData;
};

