const atGeneratorService = (() => {
    var cfg = {
        "id": 5524,
        "name": "Tehnike programiranja (2017\/2018), Zada\u0107a 6, zadatak 1",
        "languages": [ "C++" ],
        "tools" : {
            "compile" : {
                "require" : "g++",
                "features" : [ "C++11", "optimize", "warn", "pedantic" ]
            },
            "compile[debug]" :
            {
                "require" : "g++",
                "features" : [ "C++11", "debug" ]
            },
            "execute" :
            {
                "environment" : {
                    "timeout" : 10,
                    "memory" : 1000000
                }
            },
            "debug" : {}, 
            "profile[memcheck]" : {
                "require" : "valgrind",
                "features" : [ "memcheck" ]
            },
            "profile[sgcheck]" : {
                "require" : "valgrind",
                "features" : [ "sgcheck" ]
            }
        },
        "tests": [
            {
                "parse" : {
                    "require_symbols" : [ "Skladiste" ]
                },
                "compile" : {},
                "plagiarism" : {}, 
                "options" : [ "silent", "terminate" ]
            },
            {
                "id": 6,
                "patch" : {
                    "position" : "main",
                    "code" : "try\n    {\n\n        Skladiste ETF;\n        ETF.DodajSanduk(50, \"Voce\", {1,3,5,6});\n        ETF.DodajVrecu(0.1, \"Brasno\", 25.5);\n        ETF.DodajBure(5, \"Krv\", 1300, 150);\n        ETF.DodajSpremnik(new Vreca(0.5, \"Secer\", 40), true);\n        Bure *b = new Bure(15, \"Voda\", 1000, 200);\n        ETF.DodajSpremnik(b, false);\n        delete b;\n        ETF.IzlistajSkladiste();\n\n    }\n    catch(std::range_error re)\n    {\n        std::cout << re.what();\n    }",
                    "use_markers" : true
                },
                "compile[debug]" : {},
                "execute": {
                    "expect": [
                        "Vrsta spremnika: Bure\nSadrzaj: Voda\nVlastita tezina: 15 (kg)\nSpecificna tezina tecnosti: 1000 (kg\/m^3)\nZapremina tecnosti: 200 (l)\nUkupna tezina: 215 (kg)\nVrsta spremnika: Bure\nSadrzaj: Krv\nVlastita tezina: 5 (kg)\nSpecificna tezina tecnosti: 1300 (kg\/m^3)\nZapremina tecnosti: 150 (l)\nUkupna tezina: 200 (kg)\nVrsta spremnika: Sanduk\nSadrzaj: Voce\nTezine predmeta: 1 3 5 6 (kg)\nVlastita tezina: 50 (kg)\nUkupna tezina: 65 (kg)\nVrsta spremnika: Vreca\nSadrzaj: Secer\nVlastita tezina: 0.5 (kg)\nTezina pohranjene materije: 40 (kg)\nUkupna tezina: 40.5 (kg)\nVrsta spremnika: Vreca\nSadrzaj: Brasno\nVlastita tezina: 0.1 (kg)\nTezina pohranjene materije: 25.5 (kg)\nUkupna tezina: 25.6 (kg)"
                    ]
                },
                "debug" : {}, "profile[memcheck]" : {}, "profile[sgcheck]" : {}
            },
            {
                "id": 7,
                "patch" : {
                    "position" : "main",
                    "code" : "    try\n    {\n\n        Skladiste ETF;\n        ETF.DodajSanduk(50, \"Voce\", {1,3,5,6});\n        ETF.DodajVrecu(0.1, \"Brasno\", 25.5);\n        ETF.DodajBure(5, \"Krv\", 1300, 150);\n        ETF.DodajSpremnik(new Vreca(0.5, \"Secer\", 40), true);\n        Bure *b = new Bure(15, \"Voda\", 1000, 200);\n        ETF.DodajSpremnik(b, false);\n        delete b;\n        ETF.DajNajlaksi().Ispisi();\n        std::cout << ETF.BrojPreteskih(40) << std::endl;\n        ETF.DajNajtezi().Ispisi();\n    }\n    catch(std::range_error re)\n    {\n        std::cout << re.what();\n    }",
                    "use_markers" : true
                },
                "compile[debug]" : {},
                "execute": {
                    "expect": [
                       "Vrsta spremnika: Vreca\nSadrzaj: Brasno\nVlastita tezina: 0.1 (kg)\nTezina pohranjene materije: 25.5 (kg)\nUkupna tezina: 25.6 (kg)\n4\nVrsta spremnika: Sanduk\nSadrzaj: Voce\nTezine predmeta: 1 3 5 6 (kg)\nVlastita tezina: 50 (kg)\nUkupna tezina: 65 (kg)"
                     ]
                },
                "debug" : {}, "profile[memcheck]" : {}, "profile[sgcheck]" : {}
            },
            {
                "id": 8,
                "patch" : {
                    "position" : "main",
                    "code": "   try\n    {\n\n        Skladiste ETF;\n        ETF.DodajSanduk(50, \"Voce\", {1,3,5,6});\n        ETF.DodajVrecu(0.1, \"Brasno\", 25.5);\n        ETF.DodajBure(5, \"Krv\", 1300, 150);\n        Spremnik *s = ETF.DodajSpremnik(new Vreca(0.5, \"Secer\", 40), true);\n        ETF.BrisiSpremnik(s);\n        ETF.IzlistajSkladiste();\n    }\n    catch(std::range_error re)\n    {\n        std::cout << re.what();\n    }",
                    "use_markers" : true
                },
                "compile[debug]" : {},
                "execute": {
                    "expect": [
                       "Vrsta spremnika: Bure\nSadrzaj: Krv\nVlastita tezina: 5 (kg)\nSpecificna tezina tecnosti: 1300 (kg\/m^3)\nZapremina tecnosti: 150 (l)\nUkupna tezina: 200 (kg)\nVrsta spremnika: Sanduk\nSadrzaj: Voce\nTezine predmeta: 1 3 5 6 (kg)\nVlastita tezina: 50 (kg)\nUkupna tezina: 65 (kg)\nVrsta spremnika: Vreca\nSadrzaj: Brasno\nVlastita tezina: 0.1 (kg)\nTezina pohranjene materije: 25.5 (kg)\nUkupna tezina: 25.6 (kg)"
                     ]
                },
                "debug" : {}, "profile[memcheck]" : {}, "profile[sgcheck]" : {}
            },
            {
                "id": 9,
                "patch" : {
                    "position" : "main",
                    "code": "    try\n    {\n\n        Skladiste ETF;\n        Spremnik *s = ETF.DodajSpremnik(new Vreca(0.5, \"Secer\", 40), true);\n        ETF.BrisiSpremnik(s);\n        ETF.DajNajtezi().Ispisi();\n    }\n    catch(std::range_error re)\n    {\n        std::cout << re.what();\n    }\n",
                    "use_markers" : true
                },
                "compile[debug]" : {},
                "execute": {
                    "expect": [
                       "Skladiste je prazno"
                     ]
                },
                "debug" : {}, "profile[memcheck]" : {}, "profile[sgcheck]" : {}
            },
            {
                "id": 10,
                "patch" : {
                    "position" : "main",
                    "code": "    try\n    {\n\n        Skladiste ETF;\n        Spremnik *s = ETF.DodajSpremnik(new Vreca(0.5, \"Secer\", 40), true);\n        ETF.BrisiSpremnik(s);\n        ETF.DajNajlaksi().Ispisi();\n    }\n    catch(std::range_error re)\n    {\n        std::cout << re.what();\n    }\n",
                    "use_markers" : true
                },
                "compile[debug]" : {},
                "execute": {
                    "expect": [
                       "Skladiste je prazno"
                     ]
                },
                "debug" : {}, "profile[memcheck]" : {}, "profile[sgcheck]" : {}
            },
            {
                "id": 11,
                "patch" : {
                    "position" : "main",
                    "code": "    try\n    {\n\n        Skladiste ETF;\n        ETF.UcitajIzDatoteke(\"dummy.txt\");\n        ETF.IzlistajSkladiste();\n    }\n    catch(std::logic_error le)\n    {\n        std::cout << le.what();\n    }\n",
                    "use_markers" : true
                },
                "compile[debug]" : {},
                "execute": {
                    "expect": [
                       "Trazena datoteka ne postoji"
                     ]
                },
                "debug" : {}, "profile[memcheck]" : {}, "profile[sgcheck]" : {}
            },
            {
                "id": 12,
                "patch" : {
                    "position" : "main",
                    "code": "Skladiste ETF;\nETF.DodajSanduk(50, \"Voce\", {1,3,5,6});\nETF.DodajVrecu(0.1, \"Brasno\", 25.5);\nETF.DodajBure(5, \"Krv\", 1300, 150);\nSkladiste ETF1(std::move(ETF));\nSkladiste ETF2;\nETF2 = std::move(ETF1);\nETF2.IzlistajSkladiste();",
                    "use_markers" : true
                },
                "compile[debug]" : {},
                "execute": {
                    "expect": [
                       "Vrsta spremnika: Bure\nSadrzaj: Krv\nVlastita tezina: 5 (kg)\nSpecificna tezina tecnosti: 1300 (kg\/m^3)\nZapremina tecnosti: 150 (l)\nUkupna tezina: 200 (kg)\nVrsta spremnika: Sanduk\nSadrzaj: Voce\nTezine predmeta: 1 3 5 6 (kg)\nVlastita tezina: 50 (kg)\nUkupna tezina: 65 (kg)\nVrsta spremnika: Vreca\nSadrzaj: Brasno\nVlastita tezina: 0.1 (kg)\nTezina pohranjene materije: 25.5 (kg)\nUkupna tezina: 25.6 (kg)"
                     ]
                },
                "debug" : {}, "profile[memcheck]" : {}, "profile[sgcheck]" : {}
            },
            {
                "id": 13,
                "patch" : {
                    "position" : "main",
                    "code": "Skladiste ETF;\nETF.DodajSanduk(50, \"Voce\", {1,3,5,6});\nETF.DodajVrecu(0.1, \"Brasno\", 25.5);\nETF.DodajBure(5, \"Krv\", 1300, 150);\nSkladiste ETF1(ETF);\nSkladiste ETF2;\nETF2 = ETF1;\nETF2.IzlistajSkladiste();",
                    "use_markers" : true
                },
                "compile[debug]" : {},
                "execute": {
                    "expect": [
                       "Vrsta spremnika: Bure\nSadrzaj: Krv\nVlastita tezina: 5 (kg)\nSpecificna tezina tecnosti: 1300 (kg\/m^3)\nZapremina tecnosti: 150 (l)\nUkupna tezina: 200 (kg)\nVrsta spremnika: Sanduk\nSadrzaj: Voce\nTezine predmeta: 1 3 5 6 (kg)\nVlastita tezina: 50 (kg)\nUkupna tezina: 65 (kg)\nVrsta spremnika: Vreca\nSadrzaj: Brasno\nVlastita tezina: 0.1 (kg)\nTezina pohranjene materije: 25.5 (kg)\nUkupna tezina: 25.6 (kg)"
                     ]
                },
                "debug" : {}, "profile[memcheck]" : {}, "profile[sgcheck]" : {}
            }
        ]
    };

    var emptyConfig = {
        "id": null,
        "name": "",
        "languages": [],
        "tools": {},
        "tests": []
    }
    //Not needed on this version
    const getConfigFile = (url, callback) => {
        console.log("GET URL: ", url);
        callback(cfg);
        /*var data;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(xhttp.readystate == 4 && xhttp.status == 200) {
                data = JSON.parse(xhttp.responseText);
            }
            if(xhttp.readystate == 4 && xhttp.status == 404) {
                data = emptyConfig;
            }
            if(xhttp.readystate == 4 && xhttp.status != 200 && xhttp.status != 400) {
                alert("An error occured. Error: " + xhttp.responseText);
            }
            callback(data);
        }
        xhttp.open("GET", url, true);
        xhttp.send();*/
    }

    //Not needed on this version
    const saveConfigFile = (file, url) => {
        console.log("POST URL: ", url);
        console.log("Saving .autotest file: ", file);
        /*var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(xhttp.readystate == 4 && xhttp.status == 200) {
                alert("Successfully created and saved .autotest file");
            }
            if(xhttp.readyState == 4 && xhttp.status != 200) {
                alert("An error occured. Error: " + xhttp.responseText);
            }
        }
        xhttp.open("PUT", url, true);
        xhttp.send(file);*/
        //file = Helpers.clearEmptyObjects(file);
        download(file, "testna.json", "application/json");
    }
    //Not needed on this version
    const download = (content, fileName, contentType) => {
        var a = document.createElement('a');
        var file = new Blob([JSON.stringify(content)], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    const getTemplate = () => {
        return emptyConfig;
    }

    return {
        getConfigFile: getConfigFile,
        saveConfigFile: saveConfigFile,
        getTemplate: getTemplate
    }
})();