const Helpers = (() => {
    //Empty test JSON for adding new test into _testSpecifications
    // needs update
    const emptyTest = {
        id: "",
        name : "",
        options : [],
        execute : {}
    };
   
    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max-min)) + min;
    }

    const generateIndexSuffix = () =>{
        return new Date().valueOf() + "-" + getRandomInt(1000,11000);
    }

    const splitStringArray = (objectID) => {
        var rawData = document.getElementById(objectID).value;
        if(rawData == "") return [];
        var splitData = rawData.split(",");
        for(let i=0; i< splitData.length; i++) {
            splitData[i] = splitData[i].substr(1, splitData[i].length-2);
        }
        return splitData;
    }

    const concatStringArray = (data) => {
        if(!data) return;
        let value = "";
        for(let i=0; i< data.length; i++) {
            value += '\"' + data[i] + '\",';
        }
        return value.substr(0, value.length-1);
    }

    const escapeNewLine = (value) => {
        //Replaces all new lines in textarea string to '\n '
        return value ? value.replace(/(?:\r|\n|\r\n)/g, '\\n ') : "";
    }

    const getBooleanValue = (data) => {
        return data == "true" ? true : false;
    }

    const openGenerator = (path, url, zamger) => {
        window.localStorage.setItem("Zamger_URL_Autotest", url);
        if(zamger == true) {
            window.open(path);
        }
    }

    const addPatchHTML = () => {
        return '<div class="row">'+
	'	        <div class="col-sm-2">'+
	'		<label class="col-form-label-sm" for="code_variant" id="code_label">Code</label>'+
	'	</div>'+
	'	<div class="col-sm-10">'+
	'		<textarea placeholder="Patch Code" rows="4" class="form-control form-control-sm" id="code_variant"></textarea>'+
	'	</div>'+
	'</div>'+
	'<div class="row">'+
	'	<div class="col-sm-2">'+
	'		<label class="col-form-label-sm" for="dropdown_select" id="dropdown_select_label">Select position</label>'+
	'	</div>'+
	'	<div class="col-sm-3">'+
    '		<select class="form-control form-control-sm" id="dropdown_select">'+
    '       <option value="" selected disabled hidden>Select Position</option>'+
    '       <option value="main" id="main">Main</option>'+
    '       <option value="above_main" id="above_main">Above main</option>'+
    '       <option value="above_main_class" id="above_main_class">Above main class</option>'+
    '       <option value="top_of_file" id="top_of_file">Top of file</option>'+
    '		</select>'+
	'	</div>'+
	'</div>'+
	'<div class="row">'+
	'	<label class="col-sm-2 col-form-label-sm">Additional options</label>'+
	'	<div class="col-sm-10">'+
	'		<div class="form-check form-check-inline">'+
	'			<input class="form-check-input" type="checkbox" id="use_markers">'+
	'			<label class="form-check-label" for="use_markers" id="use_markers_label">Use Markers</label>'+
	'		</div>               '+
	'		<div class="form-check form-check-inline">'+
	'				<input class="form-check-input" type="checkbox" id="try_catch">'+
	'				<label class="form-check-label" for="try_catch" id="try_catch_label">Try Catch</label>'+
    '		</div>'+
    '       <div class="form-check form-check-inline">'+
	'				<i class="material-icons float-right" id="delete_icon">delete_forever</i>'+
	'		</div>'+
	'	</div>'+
	'</div>';
    }

    const addToolSpecificationHTML = () => {
        return '<div class="form-row" style="padding-top: 10px;">' +
        '    <div class="col-sm-4" style="display:flex;">' +
        '            <i class="material-icons float-left" id="delete_icon" style="padding-right: 5px;">remove_circle_outline</i>' +
        '            <label class="col-form-label-sm" for="toolName">Name</label>' +
        '        <div class="col-sm-10">' +
        '            <input type="text" id="toolName" class="form-control form-control-sm" placeholder="Tool Name"/>' +
        '        </div>' +
        '    </div>' +
        '    <div class="col-sm-8" style="display:flex;">' +
        '            <label class="col-form-label-sm" for="toolOptions">Options</label> ' +
        '        <div class="col-sm-10">' +
        '            <input type="text" id="toolOptions" class="form-control form-control-sm" placeholder="Tool Options"/>' +
        '        </div>' +
        '    </div>' +
        '    </div>';
    }

    const clearEmptyObjects = (data) => {
        for(key in data) {
            value = data[key];
            if(!(Object.keys(value).length === 0 && value.constructor === Object))
                clearEmptyObjects(value);
            if((Object.keys(value).length === 0 && value.constructor === Object) || 
               (value.constructor === String && value == "") ||
               (value.constructor === Array && value == []) )
                delete data[key];            
        }
        return data;
    }

    const isEmptyObject = (data) => {
        return data.constructor === Object && Object.keys(data).length === 0;
    }
    return {
        emptyTest: emptyTest,
        splitStringArray: splitStringArray,
        concatStringArray: concatStringArray,
        escapeNewLine: escapeNewLine,
        getBooleanValue: getBooleanValue,
        getRandomInt: getRandomInt,
        generateIndexSuffix: generateIndexSuffix,
        openGenerator: openGenerator,
        addToolSpecificationHTML: addToolSpecificationHTML,
        addPatchHTML: addPatchHTML,
        clearEmptyObjects: clearEmptyObjects,
        isEmptyObject: isEmptyObject
    }
})();