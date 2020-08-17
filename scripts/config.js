const Config = (() => {
   
    //List of supported languages with true/false value if they're included by default
    const getLanguages = () => {
        return {
            "C"          : false,
            "C++"        : false,
            "QBasic"     : false,
            "Java"       : false,
            "Python"     : false,
            "PHP"        : false,
            "HTML"       : false,
            "JavaScript" : false,
            "Matlab"     : false,
        }
    }

    const getDefaultTools = () => {
        return {
            "compile" : {},
            "execute" : {},
            "debug"   : {},
            "profile" : {}
        }
    }

    //Retarded but I'm lazy
    const getSelectedIndex = (position) => {
        var positions = ["main", "above_main", "above_main_class", "top_of_file"];
        return positions.indexOf(position);
    }
    

    return {
        getLanguages: getLanguages,
        getDefaultTools: getDefaultTools,
        getSelectedIndex: getSelectedIndex 
    }
})();