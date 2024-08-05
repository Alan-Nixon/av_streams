


export function register(config: any) {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/serviceWorker.js`;
  
        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            if (registration.waiting) {
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
              return;
            }
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      // New update available
                      if (config && config.onUpdate) {
                        config.onUpdate(registration);
                      }
                    } else {
                      // Content is cached for offline use
                      if (config && config.onSuccess) {
                        config.onSuccess(registration);
                      }
                    }
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.error('Error during service worker registration:', error);
          });
      });
    }
  }
  