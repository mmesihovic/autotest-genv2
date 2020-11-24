const AutotestGenerator = (() => {

//Variables required for operations
//config is .autotest content
var config;
var currentTest;
var _testSpecifications = [];

const getNextTestID = () => {
    var _nextID = _testSpecifications.length && _testSpecifications[0].id ? Number(_testSpecifications[0].id) : 0;
    for(let i=0; i<_testSpecifications.length; i++) {
        if(_testSpecifications[i] && _testSpecifications[i].id) {
            if(Number(_testSpecifications[i].id) >= _nextID )
                _nextID = Number(_testSpecifications[i].id);
        }
    }
    return (_nextID+1).toString();
}
//Outdated
const mapValues = (data) =>{
    config = data;
    currentTest = config.tests.length > 0 ? config.tests[0] : null;
    importConfigValues();
}
//Outdated
const setGeneratorSetup = () => {
    let _config  = window.localStorage.getItem(".autotest-content");
    try {
        _config = JSON.parse(_config);
        mapValues(_config)
    } catch(e) {
        console.log("Error: ", e);
        mapValues(atGeneratorService.getTemplate());
    }
    finally { 
        window.localStorage.removeItem(".autotest-content");    
    }
}
// Tested - Working
//Function which patches all values on to the forms, creates atList and loads first test if it exists
const importConfigValues = () => {
    patchConfigValues(config);
    for(let i=0;i < config.tests.length; i++) {
        addTest(config.tests[i], i+1);
    }
    if(config.tests.length > 0) {
        patchTestValues(config.tests[0], 0, false);
    }
}
//RECHECK
//Function which exports JSON object via DummyService
const exportConfigValues = () => {
    var newConfig = getConfigValues();
    let newState = getTestValues();
    console.log("New State: ", newState);
    for(let i=0; i<_testSpecifications.length; i++) {
        if( _testSpecifications[i] == currentTest ) {
            _testSpecifications[i] = newState;
            break;
        }
    }
    newConfig.tests = _testSpecifications;
    console.log("New Tests: ", _testSpecifications);
    window.localStorage.setItem('.autotest-content', JSON.stringify(newConfig));
}
//RECHECK
//Getting general config parameters from form - atConfig
const getConfigValues = () => {
    return {
        id: Number(document.getElementById('id').value) ? Number(document.getElementById('id').value) : 0,
        name: document.getElementById('name').value ? document.getElementById('name').value : "",
        languages: exportLanguages(),
        tools: exportToolsFromAdvancedFeatures(),
        tests: []
    };
}
// Tested - Working
const exportLanguages = () => {
    var container = document.getElementById('languages-list');
    languages = []
    for(row of container.children) {
        if(row.children[0].checked)
            languages.push(row.children[0].id);
    }
    return languages;
}
// Tested - Working
const exportToolsFromAdvancedFeatures = () => {
    var _tools = {};
    var outputContainer = document.getElementById('tools_specification_list');
    for(child of outputContainer.children) {
        objectID = child.id;
        var tempArray = objectID.split("_");
        var variant_number = tempArray[tempArray.length-1];
        var key = document.getElementById("toolName_"+variant_number).value;
        var value = {};
        try { value = JSON.parse(document.getElementById("toolOptions_"+variant_number).value) }
        catch(e) { /*Nobody cares;*/ }
            _tools[key] = value;
    }
    return _tools;
}
// Tested - Working
//Patching general config parameters on from
const patchConfigValues = (data) => {
    console.log(data);
    console.log(document.getElementById('id'));
    document.getElementById("id").value = data.id; 
    document.getElementById("name").value = data.name;
    //Adding languages
    createLanguageList();
    for(language of data.languages) {
        document.getElementById(language.toUpperCase()).checked = true;
    }
    //Adding tools
    var _tools = Object.entries(data.tools);
    for( [key, value] of _tools) {
        addToolSpecification('header', key, value);
    }    
}

//Getting expected and alternative output values
const getExpectedOutputValues = () => {
    var outputContainer = document.getElementById('expected_output_variants');
    let values = [];
    for(let i=3; i < outputContainer.children.length; i+=2) {
        let child = outputContainer.children[i];
        if(child.children[0].value != "")
            values.push(child.children[0].value);
    }
    return values;
}

const getAdditionalOptionValues = () => {
    var options = [];
    document.getElementById('nodetail').checked ? options.push('nodetail') : {};
    document.getElementById('silent').checked ? options.push('silent') : {};
    document.getElementById('terminate').checked ? options.push('terminate') : {};
    document.getElementById('reuse').checked ? options.push('reuse') : {};
    return options;
}

const extractPatchObjects = () => {
    var outputContainer = document.getElementById('patch-contents');
    var patches = []   
    for(patchContainer of outputContainer.children) {
        var tempArray = patchContainer.id.split("_");
        var variant_number = tempArray[tempArray.length-1];
        var positionSelect = document.getElementById('dropdown_select_'+variant_number);
        var newPatch = {};
        var code = document.getElementById('code_variant_' + variant_number).value;
        var selectedIndex = positionSelect.selectedIndex;
        var position;
        if(selectedIndex > 0) 
            position = positionSelect.options[positionSelect.selectedIndex].value;
        var use_markers = document.getElementById('use_markers_' + variant_number).checked;
        var try_catch = document.getElementById('try_catch_' + variant_number).checked;
        if(!!position) newPatch.position = position;
        if(code != "") newPatch.code = code;
        if(use_markers == true) newPatch.use_markers = true;
        if(try_catch == true) newPatch.try_catch = true;
        patches.push(newPatch);
    }
    return patches;
}

const getParseTools = () => {
    var parseToolsObject = {
        require_symbols: Helpers.splitStringArray('require_symbols'),
        ban_symbols: Helpers.splitStringArray('ban_symbols'),
        require_substrings: Helpers.splitStringArray('require_substrings'),
        ban_substrings: Helpers.splitStringArray('ban_substrings'),
        require_types: Helpers.splitStringArray('require_types'),
        ban_types: Helpers.splitStringArray('ban_types')
    }
    var rename_symbols = getRenameSymbols();
    var replace_substrings = getReplaceSubstrings();
    parseToolsObject["rename_symbols"] = rename_symbols;
    parseToolsObject["replace_substrings"] = replace_substrings;
    var finalObject = {};
    var _parseToolsObject = Object.entries(parseToolsObject);
    for([key,value] of _parseToolsObject) {
        if( (value.constructor === Array && value.length == 0) ||
            (value.constructor === Object && Object.keys(value).length === 0) )
            continue;
        finalObject[key] = value;
    }
    return finalObject;
}

const getRenameSymbols = () => {
    var result = {};
    try {
        result = JSON.parse(document.getElementById('rename_symbols').value)
    } catch(e) {
    //Nobody cares;
    } 
    return result;
}

const getReplaceSubstrings = () => {
    var result = {};
    try {
        result = JSON.parse(document.getElementById('replace_substrings').value)
    } catch(e) {
    //Nobody cares;
    }
    return result;
}


// Tested - Working 
//Getting values from test details (atPreview)
const getTestValues = () => {
    var matching_select = document.getElementById('matching_select');
    var test = {
        id: Number(document.getElementById('at_id').value),
        name: document.getElementById('at_name').value
    };
    var options = getAdditionalOptionValues();
    if(options.length != 0) test.options = options;
    var parse = getParseTools();
    if(!Helpers.isEmptyObject(parse)) test.parse = parse;
    var patches = extractPatchObjects();
    if(!(patches.length == 0)) test.patch = patches;    
    var executeObject = {};
    var stdinVal = document.getElementById('stdin').value;
    if(stdinVal != "")
        executeObject.environment = { stdin: stdinVal };
    var expect = getExpectedOutputValues();
    if(expect.length != 0 ) executeObject.expect = expect;
    var matchingSelectValue = matching_select.options[matching_select.selectedIndex].value
    if(matchingSelectValue != "") executeObject.matching = matchingSelectValue;
    document.getElementById('expect_crash').checked ? executeObject.expect_crash = true : {};
    var expectExceptionValue = document.getElementById('expect_exception').value;
    if(expectExceptionValue != "") executeObject.expect_exception = expectExceptionValue;
    document.getElementById('merge_stderr').checked ? executeObject.merge_stderr = true : {};
    //test["execute"] = executeObject;
    //Extract test specific tools
    var tools = Object.entries(getTestSpecificTools());
    console.log("Test specific tools: ", tools);
    for([key,value] of tools) {
        if(key=="execute") {
            var mergedEnvironment;
            if(!!value.environment) {
                console.log(value.environment.constructor);
                console.log(value.environment);
                if(!!executeObject.environment) mergedEnvironment = {...value.environment, ...executeObject.environment};
                else mergedEnvironment = value.environment;
                delete value.environment;
            }
            if(!!mergedEnvironment) executeObject.environment = mergedEnvironment;
            value = {...value, ...executeObject};
        }
        test[key] = value;
    }
    if(!test.execute) test.execute = executeObject;
    console.log("Test: ", test);
    return test;
}

const reorderKeys = (test, tools) => {
    console.log("REORDERING KEYS: ");
    console.log("Reordering tools keys: ", Object.entries(tools));
    var _test = {};
    if(!!test.id) _test["id"] = test.id;
    if(!!test.name) _test["name"] = test.name;
    if(!!test.options) _test["options"] = test.options;
    if(!!test.parse) _test["parse"] = test.parse;
    if(!!test.patch) _test["patch"] = test.patch;
    var insertedKeys = [];
    console.log("First check before compile: ", Object.keys(_test));
    // ENTRIES
    var _tools = Object.entries(tools);
    for([key, value] of _tools) {
        if(key.substring(0,7) == "compile") {
            _test[key] = value;
            insertedKeys.push(key);
        }
    }
    console.log("Second check after compile: ", Object.keys(_test));
    if(!!test.execute) _test["execute"] = test.execute;
    // ENTRIES
    for([key,value] of _tools) {
        if(key.substring(0,5) == 'debug') {
            insertedKeys.push(key);
            _test[key] = value;
        }
        if(key.substring(0,7) == 'profile') {
            insertedKeys.push(key);
            _test[key] = value;
        }            
    }
    console.log("Third check after execute, debug and profile: ", Object.keys(_test));
    // ENTRIES 
    for([key,value] of _tools) {
        if(!insertedKeys.includes(key))
            _test[key] = value;
    }
    console.log("Last check: ", Object.keys(_test));
    return _test;
}

const getTestSpecificTools = () => {
    var _tools = {};
    var outputContainer = document.getElementById('test_tools_specification_list');
    for(child of outputContainer.children) {
        objectID = child.id;
        var tempArray = objectID.split("_");
        var variant_number = tempArray[tempArray.length-1];
        var key = document.getElementById("test_toolName_"+variant_number).value;
        var value = {};
        try { 
            var tempValue = document.getElementById("test_toolOptions_"+variant_number).value;
            if(tempValue != "") value = JSON.parse(tempValue); 
        }
        catch(e) { /*Nobody cares;*/ }
        _tools[key] = value;
    }
    return _tools;
}
// Tested - Working
//Remove all alternative output values added dynamically
const removeAdditionalExpectedValues = () => {
    var outputContainer = document.getElementById('expected_output_variants');
    while(outputContainer.children.length != 4)
        outputContainer.removeChild(outputContainer.children[outputContainer.children.length-1]);
    document.getElementById('variant_1').value = "";
}
// RECHECK -
//Patch expected output correctly, creating alternative variants if needed
const patchExpectedOutputValues = (data) => {
    //Specific check for new format
    if(!(data && data.execute && data.execute.expect)) return;
    data = data.execute.expect;
    if(data.length == 0) return;
    document.getElementById('variant_1').value = data[0];
    if(data.length > 1) {
        for(let i=1; i<data.length;i++) {
            addOutputVariant();
            var objectID = 'variant_' + (i+1).toString();
            document.getElementById(objectID).value = data[i];
        }
    }
}
//Outdated - NOT DONE
//Patching values for specific test entry on form (atPreview)
const patchTestValues = (data, index, newTest) => {
    removeAdditionalExpectedValues();
    removePatches();
    removeTestSpecificTools();
    removeParseTools();
    removeAdvancedFeatures();
    //Patching non-tabbed values
    _id = data.id ? data.id : "";
    if( _id == "" && _testSpecifications.length) 
        _id = getNextTestID();
    document.getElementById('at_id').value = _id;
    document.getElementById('at_name').value = index == -1 ? "": "Test " + (index+1).toString();
    document.getElementById('stdin').value = (data && data.execute && data.execute.environment && data.execute.environment.stdin) ? data.execute.environment.stdin : "";
    patchExpectedOutputValues(data);
    //Adding patches
    addPatchForms(data.patch);
    //Patching Parse Tools
    patchParseTools(data.parse);
    //Patching Test specific tools 
    patchTestSpecificTools(data, newTest);
    //Patching Advanced Features
    patchAdvancedFeatures(data);
}
// RECHECK
const addPatchForms = (data) => {
    if(!data) return;
    var _data = []
    if(!(data instanceof Array))
        _data.push(data);
    else _data = data;
    if(_data.length == 0) return;
    for(patch of _data) {
        addNewPatch(patch);
    }
}

const removePatches = () => {
    var outputContainer = document.getElementById('patch-contents');
    while(outputContainer.children.length != 0)
        outputContainer.removeChild(outputContainer.children[outputContainer.children.length-1]);
}

const removeTestSpecificTools = () => {
    var outputContainer = document.getElementById('test_tools_specification_list');
    while(outputContainer.children.length != 0)
        outputContainer.removeChild(outputContainer.children[outputContainer.children.length-1]);
}

const removeParseTools = () => {
    document.getElementById('require_symbols').value = "";
    document.getElementById('ban_symbols').value = "";
    document.getElementById('require_substrings').value = "";
    document.getElementById('ban_substrings').value = "";
    document.getElementById('require_types').value = "";
    document.getElementById('ban_types').value = "";
    document.getElementById('rename_symbols').value = "";
    document.getElementById('replace_substrings').value = "";
}

const removeAdvancedFeatures = () => {
    document.getElementById('nodetail').checked = false;
    document.getElementById('silent').checked = false;
    document.getElementById('terminate').checked = false;
    document.getElementById('reuse').checked = false;
    document.getElementById('expect_crash').checked = false; 
    document.getElementById('expect_exception').value = "";
    document.getElementById('merge_stderr').checked = true;
}

const patchTestSpecificTools = (test, newTest) => {
    if(!test) return;
    if(newTest) {
        var taskLevelTools = Object.entries(exportToolsFromAdvancedFeatures());
        for([key,value] of taskLevelTools) {
            if(key == "parse") continue;
            addToolSpecification('test', key, {});
        }
    }
    else {
        var nonToolKeys = ["id", "name", "options", "parse", "patch"];
        var testKeys = Object.keys(test);
        for(key of testKeys) {
            if(nonToolKeys.includes(key)) continue;
            var _value = test[key];
            if(key == "execute") {
                _execute = test.execute;
                //Deleting Values we don't need in test specific tools
                if(!!_execute.environment) delete _execute["environment"]["stdin"];
                delete _execute["matching"];
                delete _execute["expect_crash"];
                delete _execute["expect_exception"];
                delete _execute["merge_stderr"];
                delete _execute["expect"];
                _value = _execute;
            }
            addToolSpecification('test', key, _value);
        }
    }
}

const patchAdvancedFeatures = (data) => {
    if(!(data && data.options)) return;
    //options
    document.getElementById('nodetail').checked = data.options.includes('nodetail');
    document.getElementById('silent').checked = data.options.includes('silent');
    document.getElementById('terminate').checked = data.options.includes('terminate');
    document.getElementById('reuse').checked = data.options.includes('reuse');
    if(!(data && data.execute)) return;
    //matching
    //expected exception
    document.getElementById('expect_crash').checked = data.execute.expect_crash ? data.execute.expect_crash : false; 
    document.getElementById('expect_exception').value = data.execute.expect_exception ? data.execute.expect_exception : "",
    //Default value is true
    document.getElementById('merge_stderr').checked = data.execute.merge_stderr ? data.execute.merge_stderr : true;
 
}

const patchParseTools = (data) => {
    if(!data) return;
    var filteredData = {
        require_symbols : data.require_symbols ? data.require_symbols : [],
        ban_symbols : data.ban_symbols ? data.ban_symbols : [],
        require_substrings : data.require_substrings ? data.require_substrings : [],
        ban_substrings : data.ban_substrings ? data.ban_substrings : [],
        require_types : data.require_types ? data.require_types : [],
        ban_types: data.ban_types ? data.ban_types : [],
        rename_symbols : data.rename_symbols ? data.rename_symbols : {},
        replace_substrings : data.replace_substrings ? data.replace_substrings : {}
    } 
    document.getElementById('require_symbols').value = Helpers.concatStringArray(filteredData.require_symbols);
    document.getElementById('ban_symbols').value = Helpers.concatStringArray(filteredData.ban_symbols);
    document.getElementById('require_substrings').value = Helpers.concatStringArray(filteredData.require_substrings);
    document.getElementById('ban_substrings').value = Helpers.concatStringArray(filteredData.ban_substrings);
    document.getElementById('require_types').value = Helpers.concatStringArray(filteredData.require_types);
    document.getElementById('ban_types').value = Helpers.concatStringArray(filteredData.ban_types);
    document.getElementById('rename_symbols').value = Helpers.concatStringArray(filteredData.rename_symbols);
    document.getElementById('replace_substrings').value = Helpers.concatStringArray(filteredData.replace_substrings);    
}

//selfnote: Could go to helpers, as it just helps out finding adequate index for test in _testSpecification based on atList
const getTestIndex = (objectID) => {
    var listContainer = document.getElementById('atList');
    for(let i=2; i < listContainer.children.length; i++) {
        if( listContainer.children[i].id == objectID)
            return i-2;
    }
}

//Switching out which test is loaded into atPreview
const editTest = (objectID) => {
    //Saving changes to current test and saving into _testSpecification array
    let newState = getTestValues();
    for(let i=0; i< _testSpecifications.length; i++) {
        if( _testSpecifications[i] == currentTest ) {
            _testSpecifications[i] = newState;
            break;
        }
    }
    var index = getTestIndex(objectID);
    //Correcting list label if test was previously unedited
    var labelNode = document.getElementById(objectID).children[0];
    var newTest = labelNode.innerHTML.includes('(Unedited)');
    if(labelNode.innerHTML.includes('(Unedited'))
        labelNode.innerHTML = "Test "+ (index+1).toString();
    //Patching target test values    
    currentTest = _testSpecifications[index];
    patchTestValues(currentTest, index, newTest);
}

//Updating numbers on atList elements, required after deleting test
const updateListLabels = (index) => {
    var listContainer = document.getElementById('atList');
    for(let i=index+2; i<listContainer.children.length;i++) {
        var child = listContainer.children[i].children[0];
        if(child.innerHTML.includes('(Unedited)')) {
            child.innerHTML = "Test " + (i-1).toString() + " (Unedited)";
        } else {
            child.innerHTML = "Test " + (i-1).toString();
        }
    }
}

//Deleting test from _testSpecification and atList
const removeTest = (objectID) => {
    var listContainer = document.getElementById('atList');
    var index = getTestIndex(objectID);
    //If currently open test is being deleted, load next test in row or first
    if(_testSpecifications[index]==currentTest) {
        if(index == _testSpecifications.length-1) {
            currentTest = _testSpecifications[0];
            var newTest = currentTest.id == "" ? true : false;
            patchTestValues(currentTest, 0, newTest);
        } else {
            currentTest = _testSpecifications[index+1];
            var newTest = currentTest.id == "" ? true : false;
            patchTestValues(currentTest, index, newTest);
        }
    }
    //Removing from _testSpecifications and atList
    _testSpecifications.splice(index,1);
    listContainer.removeChild(document.getElementById(objectID));
    updateListLabels(index);
    // If there are no tests, clear all test fields and add proper text
    if(listContainer.children.length == 2) {
        patchTestValues(Helpers.emptyTest, -1, true);
        currentTest = Helpers.emptyTest;
        document.getElementById('at_warning').style.display = "block";
    }    
}

//Adding new test to _testSpecification and atList
const addTest = (data, number) => {
    //Hiding no tests warning
    document.getElementById('at_warning').style.display = "none";
    //Adding data to _testSpecification
    if(!!data) {
        _testSpecifications.push(data);
    } else {
        //Pushing new, empty test
        _testSpecifications.push(Helpers.emptyTest);
    }
    var listContainer = document.getElementById('atList');
    //Creating DOM Elements
    var newRow = document.createElement("div");
    var label = document.createElement("label");
    var icons = document.createElement("div");
    var edit_icon = document.createElement("i");
    var delete_icon = document.createElement("i");    
    //Setting text values
    label.innerHTML = "Test " + number;
    edit_icon.innerHTML = "edit";
    delete_icon.innerHTML = "delete_forever";
    //Adding CSS class properties
    newRow.classList.add("row");
    newRow.classList.add("justify-content-between");
    label.classList.add("col-form-label-sm");
    edit_icon.classList.add("material-icons", "float-right");    
    delete_icon.classList.add("material-icons", "float-right");
    newRow.id = "at_" + Helpers.generateIndexSuffix(); 
    //Appending label and icons to row, then row to list    
    newRow.appendChild(label);
    icons.appendChild(delete_icon);
    icons.appendChild(edit_icon);
    newRow.appendChild(icons);    
    listContainer.appendChild(newRow);
    //Binding onclick events
    edit_icon.onclick = function () {
        editTest(edit_icon.parentNode.parentNode.id);
    };
    delete_icon.onclick = function () {
        removeTest(delete_icon.parentNode.parentNode.id);
    };
}

//Removing alternative output 
const removeOutputVariant = (objectID) => {
    var outputContainer = document.getElementById('expected_output_variants');
    var tempArray = objectID.split("_");
    var variant_number = tempArray[tempArray.length-1];
    outputContainer.removeChild(document.getElementById(objectID));
    var textRowID = "text_div_v_" + variant_number;
    outputContainer.removeChild(document.getElementById(textRowID));
}

//Dynamically adding alternative output 
const addOutputVariant = () => {
    var outputContainer = document.getElementById('expected_output_variants');
    var variant_number = (outputContainer.children.length/2);
    //Creating DOM Elements
    var labelRow = document.createElement("div");
    var textRow = document.createElement("div");
    var label = document.createElement("label");
    var delete_icon = document.createElement("i");
    var textarea = document.createElement("textarea");
    //Setting text values
    label.innerHTML = "Alternative output";
    delete_icon.innerHTML = "delete_forever";
    //Adding properties
    labelRow.classList.add("col-sm-2");
    labelRow.id = "label_div_v_" + variant_number;    
    label.htmlFor = "variant_" + variant_number;
    label.classList.add("col-form-label-sm");    
    delete_icon.classList.add("material-icons", "float-right");    
    textRow.classList.add("col-sm-10");
    textRow.id = "text_div_v_" + variant_number;    
    textarea.placeholder = "Expected Output (Alternative)";
    textarea.rows = 4;
    textarea.classList.add("form-control", "form-control-sm");
    textarea.id = "variant_" + variant_number;
    //Appending children
    labelRow.appendChild(label);
    labelRow.appendChild(delete_icon);
    textRow.appendChild(textarea);
    outputContainer.appendChild(labelRow);
    outputContainer.appendChild(textRow);
    //Binding onclick events
    delete_icon.onclick = function () {
        removeOutputVariant(delete_icon.parentNode.id);
    } 
}

const addNewPatch = (patch) => {
    var outputContainer = document.getElementById('patch-contents');
    var variant_number = Helpers.generateIndexSuffix();

    var dummyDiv = document.createElement('div');
    dummyDiv.id = "patch_" + variant_number;
    dummyDiv.innerHTML = Helpers.addPatchHTML();
    outputContainer.appendChild(dummyDiv);
    document.getElementById('code_label').htmlFor = "code_variant_" + variant_number;
    document.getElementById('code_label').id = "code_label_" + variant_number;
    document.getElementById('code_variant').id = "code_variant_" + variant_number;
    document.getElementById('dropdown_select_label').htmlFor = "dropdown_select_" + variant_number;
    document.getElementById('dropdown_select_label').id = "dropdown_select_label_" + variant_number;
    document.getElementById('dropdown_select').id = "dropdown_select_" + variant_number;
    document.getElementById('use_markers').id = "use_markers_" + variant_number;
    document.getElementById('use_markers_label').htmlFor = "use_markers_" + variant_number;
    document.getElementById('use_markers_label').id = "use_markers_label_" + variant_number;
    document.getElementById('try_catch').id = "try_catch_" + variant_number;
    document.getElementById('try_catch_label').htmlFor = "try_catch_" + variant_number;
    document.getElementById('try_catch_label').id = "try_catch_label_" + variant_number;
    var delete_icon = document.getElementById('delete_icon');
    delete_icon.id = "delete_icon_" + variant_number;
    delete_icon.onclick = function() {
        removePatch(delete_icon.id);
    }    
    if(!!patch) addPatchValues(patch, variant_number);
}

const addPatchValues = (patch, variant_number) => {
    document.getElementById('code_variant_' + variant_number).value = patch.code ? patch.code : "";
    document.getElementById('use_markers_' + variant_number).checked = patch.use_markers ? patch.use_markers : false;
    document.getElementById('try_catch_' + variant_number).checked = patch.try_catch ? patch.try_catch : false;
    document.getElementById('dropdown_select_'+ variant_number).selectedIndex = Config.getSelectedIndex(patch.position ? patch.position : -1);
}

const removePatch = (objectID) => {
    var outputContainer = document.getElementById('patch-contents');
    var tempArray = objectID.split("_");
    var variant_number = tempArray[tempArray.length-1];
    outputContainer.removeChild(document.getElementById('patch_'+variant_number));
}

const addToolSpecification = (placement = 'header', tool, toolOptions) => {
    var outputContainer;
    if(placement != 'header' ) outputContainer = document.getElementById('test_tools_specification_list');
    else outputContainer = document.getElementById('tools_specification_list');
    var variant_number = Helpers.generateIndexSuffix();
    var dummyDiv = document.createElement('div');
    dummyDiv.id = "tool_" + variant_number;
    dummyDiv.innerHTML = Helpers.addToolSpecificationHTML();
    outputContainer.appendChild(dummyDiv);
    document.getElementById('toolName').id = (placement == 'header' ? "" : "test_") + "toolName_" + variant_number;
    document.getElementById('toolOptions').id = (placement == 'header' ? "" : "test_") + "toolOptions_" + variant_number;
    var delete_icon = document.getElementById('delete_icon');
    delete_icon.id = (placement == 'header' ? "" : "test_") + "delete_icon_" + variant_number;
    delete_icon.onclick = function() {
        removeToolSpecification(delete_icon.id, placement);
    }
    if(!!tool) patchToolSpecificationValues(tool, toolOptions, variant_number, placement);
}

const patchToolSpecificationValues = (tool, toolOptions, variant_number, placement = 'header') => {
    document.getElementById( (placement == 'header' ? "" : "test_")  + 'toolName_' + variant_number).value = tool.toString();
    document.getElementById(  (placement == 'header' ? "" : "test_") + 'toolOptions_' + variant_number).value = JSON.stringify(toolOptions) ? JSON.stringify(toolOptions) : "{}";
}

const removeToolSpecification = (objectID, placement = 'header') => {
    var outputContainer = document.getElementById(  (placement == 'header' ? "" : "test_") + 'tools_specification_list');
    var tempArray = objectID.split("_");
    var variant_number = tempArray[tempArray.length-1];
    outputContainer.removeChild(document.getElementById('tool_'+variant_number));    
}

const createLanguageList = () => {
    //Get language list from config.js
    var languagesObject = Config.getLanguages();
    var outputContainer = document.getElementById('languages-list');
    for(var lang in languagesObject) {
        //Creating div object
        var rowObject = document.createElement("div");
        rowObject.classList.add("form-check");
        rowObject.classList.add("col-sm-8");
        rowObject.style.paddingLeft = 0;
        //Creating checkbox object and setting values
        var checkboxObject = document.createElement("input");
        checkboxObject.setAttribute("type", "checkbox");
        checkboxObject.id = lang.toString().toUpperCase();
        checkboxObject.checked = languagesObject[lang];
        //Creating label object
        var labelObject = document.createElement("label");
        labelObject.classList.add("form-check-label");
        labelObject.innerHTML = lang.toString();
        
        rowObject.appendChild(checkboxObject);
        rowObject.appendChild(labelObject);
        outputContainer.appendChild(rowObject);
    }
}

const openTab = (tabName, panel) => {
    switch(panel) {
        case 'general':
            document.getElementById('atDetails').classList.remove('fade', 'active');
            document.getElementById('headerAdvancedFeatures').classList.remove('fade', 'active');
            document.getElementById('tsButton').classList.remove('active');
            document.getElementById('hafButton').classList.remove('active');
            break;
        case 'test_specific':
            document.getElementById('parseTools').classList.remove('fade', 'active');
            document.getElementById('toolsUsed').classList.remove('fade', 'active');
            document.getElementById('patches').classList.remove('fade', 'active');
            document.getElementById('advancedFeatures').classList.remove('fade', 'active');

            document.getElementById('pButton').classList.remove('active');
            document.getElementById('ptButton').classList.remove('active');
            document.getElementById('tuButton').classList.remove('active');
            document.getElementById('afButton').classList.remove('active');
            break;
    }
    switch(tabName) {
        case 'patches':
            document.getElementById('patches').classList.add('active');
            document.getElementById('parseTools').classList.add('fade');
            document.getElementById('toolsUsed').classList.add('fade');
            document.getElementById('advancedFeatures').classList.add('fade');
            document.getElementById('pButton').classList.add('active');
            break;
        case 'parseTools':
            document.getElementById('parseTools').classList.add('active');
            document.getElementById('toolsUsed').classList.add('fade');
            document.getElementById('patches').classList.add('fade');    
            document.getElementById('advancedFeatures').classList.add('fade');
            document.getElementById('ptButton').classList.add('active');        
            break;
        case 'toolsUsed':
            document.getElementById('parseTools').classList.add('fade');
            document.getElementById('toolsUsed').classList.add('active');
            document.getElementById('patches').classList.add('fade');
            document.getElementById('advancedFeatures').classList.add('fade');
            document.getElementById('tuButton').classList.add('active');
            break;
        case 'advancedFeatures':
            document.getElementById('parseTools').classList.add('fade');
            document.getElementById('toolsUsed').classList.add('fade');
            document.getElementById('patches').classList.add('fade');
            document.getElementById('advancedFeatures').classList.add('active');
            document.getElementById('afButton').classList.add('active');
            break;
        case 'atDetails':            
            document.getElementById('atDetails').classList.add('active');
            document.getElementById('headerAdvancedFeatures').classList.add('fade');
            document.getElementById('atDetails').style.display = 'flex';
            document.getElementById('tsButton').classList.add('active');
            break;
        case 'headerAdvancedFeatures':           
            document.getElementById('atDetails').classList.add('fade');
            document.getElementById('headerAdvancedFeatures').classList.add('active');
            document.getElementById('atDetails').style.display = 'none';           
            document.getElementById('hafButton').classList.add('active');
            break;
    }
}

const dummyStart = () => {
    mapValues(atGeneratorService.getTemplate());
}

return {
    importConfigValues: importConfigValues,
    exportConfigValues: exportConfigValues,
    getConfigValues: getConfigValues,
    patchConfigValues: patchConfigValues,
    getExpectedOutputValues: getExpectedOutputValues,
    getTestValues: getTestValues,
    removeAdditionalExpectedValues: removeAdditionalExpectedValues,
    patchExpectedOutputValues: patchExpectedOutputValues,
    patchTestValues: patchTestValues,
    getTestIndex: getTestIndex,
    editTest: editTest,
    updateListLabels: updateListLabels,
    removeTest: removeTest,
    addTest: addTest,
    removeOutputVariant: removeOutputVariant,
    addOutputVariant: addOutputVariant,
    setGeneratorSetup: setGeneratorSetup,
    createLanguageList: createLanguageList,
    openTab: openTab,
    addNewPatch: addNewPatch,
    removePatch: removePatch,
    addToolSpecification: addToolSpecification,
    removeToolSpecification: removeToolSpecification,
    dummyStart: dummyStart
}

})();

window.onload = AutotestGenerator.setGeneratorSetup;
