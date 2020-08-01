define (function() {
    return {
        openGenerator: function(path, url, zamger) {
            window.localStorage.setItem("Zamger_URL_Autotest", url);
            if(zamger == true) {
                window.open(path);
            }
        }
    }
});