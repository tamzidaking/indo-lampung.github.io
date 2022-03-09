(function () {
    'use strict';

    
    document.addEventListener('DOMContentLoaded', function (event) {
       
        if (!navigator.onLine) {
            updateNetworkStatus();
        }

        window.addEventListener('online', updateNetworkStatus, false);
        window.addEventListener('offline', updateNetworkStatus, false);
    });

    
    function updateNetworkStatus() {
        if (navigator.onLine) {
            console.log('online..');
        } else {
            console.log('offline..');
        }
    }
})();