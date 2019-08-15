htmlConsole = (function () {
    var defaultLog = console.log;
    var defaultDir = console.dir;
    var defaultErr = console.error;
    var defaultWarn = console.warn;

    var used = false;

    function create(consoleArea) {
        if (used) throw new Error("htmlConsole.create can only be called once.");
        used = true;

        var _els = createElements(consoleArea);
        _consoleLines = _els._consoleLines;
        _consoleInput = _els._consoleInput;

        function appendLine(args, color) {
            var line = document.createElement("div");
            for (var i = 0; i < args.length; i++) {
                var text = typeof args[i] !== "object" ? args[i] : JSON.stringify(args[i]);
                line.append(text + " ");
            }
            appendLineElement(line, color);
        };

        function appendLineElement(lineElement, color) {
            lineElement.style.color = color;
            _consoleLines.appendChild(lineElement);
            _consoleLines.scrollTop = _consoleLines.scrollHeight;
        };

        assignConsoleWritingMethods(appendLine, appendLineElement);
        handleInputs(_consoleInput);
    }

    function createElements(consoleArea) {
        var _console = document.createElement("div");
        var _consoleLines = document.createElement("div");
        var _consoleInput = document.createElement("input");

        _console.style.fontSize = "15px";
        _console.style.backgroundColor = "black";
        _console.style.color = "lightgreen";
        _console.style.fontFamily = "Lucida Console, Courier New";
        _console.style.display = "block";

        _consoleLines.style.padding = "1em";
        _consoleLines.style.height = "7em";
        _consoleLines.style.maxHeight = "7em";
        _consoleLines.style.overflowY = "scroll";
        _consoleLines.style.display = "block";

        _consoleInput.style.padding = "0.1em 2em";
        _consoleInput.style.display = "block";
        _consoleInput.style.width = "100%";
        _consoleInput.style.color = "white";
        _consoleInput.style.backgroundColor = "#ffffff33";

        _console.appendChild(_consoleLines);
        _console.appendChild(_consoleInput);
        consoleArea.append(_console);

        return {
            _consoleLines: _consoleLines,
            _consoleInput: _consoleInput
        };
    }

    function handleInputs(inputField) {
        var sentInputs = [];
        var currentInputIndex = -1;

        inputField.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                var line = inputField.value;
                if(line === "") return;
                inputField.value = "";
                currentInputIndex = -1;
                if (sentInputs.length === 0 || line !== sentInputs[0])
                    sentInputs.unshift(line);
                console.log(">> " + line);
                var result = eval(line);
                console.log("<< " + result);
            }
            else if (event.key === "ArrowUp") {
                if (sentInputs.length === 0) return;
                if (sentInputs.length <= currentInputIndex+1) return;
                currentInputIndex++
                inputField.value = sentInputs[currentInputIndex];
            }
            else if (event.key === "ArrowDown") {
                if (currentInputIndex > 0) {
                    currentInputIndex--;
                    inputField.value = sentInputs[currentInputIndex];
                }
                else if (currentInputIndex === 0) {
                    currentInputIndex--;
                    inputField.value = "";
                }
            }
        });
    }

    function assignConsoleWritingMethods(appendLine, appendLineElement) {
        console.log = function () {
            defaultLog.apply(this, arguments);
            appendLine(arguments, "white");
        };
        console.dir = function () {
            defaultDir.apply(this, arguments);
            appendLine(arguments, "aqua");
        };
        console.error = function () {
            defaultErr.apply(this, arguments);
            appendLine(arguments, "pink");
        };
        console.warn = function () {
            defaultWarn.apply(this, arguments);
            appendLine(arguments, "yellow");
        };
        window.onerror = function (errorMsg, url, lineNumber) {
            var line = "[ERROR] '" + errorMsg + "' in <a style='color:pink;' href='" + url + "'>" +
                url.substring(url.lastIndexOf("/")) + "</a> : line " + lineNumber;
            var div = this.document.createElement("div");
            div.innerHTML = line;
            appendLineElement(div, "pink");
        };
    }

    return {
        create: create
    };
}());