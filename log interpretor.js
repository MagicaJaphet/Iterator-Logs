const $logs = document.createElement("div");
$logs.id = "logs";
document.body.appendChild($logs);
// Gets the file name to add the logs to the HTML
var fileName = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
fileName = fileName.substring(0, fileName.lastIndexOf('.')).toUpperCase();

if ($logs != null) {
    document.body.classList.add(fileName);

    let charLongNames = new Map();
    // Set styles
    fetch("Text Logs/Character Names.txt")
    .then((res) => res.text())
    .then((chars) => {
        if (chars.length > 0) {
            var styles = "";
            chars.split('\n').forEach((element) => {
                var charName = element.split(" {")[0].trim();
                var charNickname = element.split(" {")[1].split("}")[0];
                var charColor = element.split("] ")[1];
                charLongNames.set(charName, element.split(" [")[1].split("]")[0]);
                document.head.title = charLongNames.get(charName);
                
                styles += "." + charName + "{";
                styles += "background-color: " + charColor + ";";
                styles += "}";

                styles += "#" + charName + "{";
                styles += "color: " + charColor + ";";
                styles += "}";

                styles += "#" + charName + "::before {";
                styles += "content: \"" + charNickname + ": \";";
                styles += "}";
            });
            var styleSheet = document.createElement("style")
            styleSheet.textContent = styles
            document.head.appendChild(styleSheet)
        }
    });

    fetch("Text Logs/Canon Log Timeline.txt")
    .then((res) => res.text())
    .then((text) => {
        // Process text from logs here
        if (text.length > 0) {
            // Splits each log by the beginning of [
            text.split('{').forEach((log) => {
                if (log.length > 0 && log.includes('}')) {
                var conditional = log.split('}');

                // Checks if the HTML filepath contains name
                var characters = conditional[0].split(', ');
                
                if (characters.length > 0 && characters.includes(fileName) && conditional.length > 1) {
                     var div = document.createElement("div");
                     div.classList.add("singlelog");
                    var chatlog = conditional[1].split('\n');
                    if (conditional.length > 1 && conditional[1].split('\n')[0].includes("#")) {
                        var pearlColors = conditional[1].split('\n')[0].split(" ");
                        console.log(pearlColors);
                        var pearlDiv = document.createElement("div");
                        pearlDiv.classList.add("pearl");
                        pearlDiv.style.backgroundColor = pearlColors[1];
                        var pearlHighlight = document.createElement("div");
                        pearlHighlight.classList.add("highlight");
                        pearlHighlight.style.backgroundColor = pearlColors[2];

                        pearlDiv.appendChild(pearlHighlight);
                        div.appendChild(pearlDiv);
                    }
                    var index = 1;
                    var shouldSkip = false;
                    // Process chat logs
                    chatlog.forEach((line) => {
                        if (shouldSkip) {
                            index++;
                            if (line.includes("^") && line.split('^')[1].split(', ').includes("/" + fileName)) {
                                shouldSkip = false;
                            }
                        }
                        else if (line.includes("^") && line.split('^')[1].split(', ').includes("" + fileName)) {
                            index++;
                            shouldSkip = true;
                        }
                        else if (!shouldSkip && !line.includes('^')) {
                            // Processes chatlog titles
                            if (chatlog.indexOf(line) == index) {

                            // Replaces shortnames with full names
                                if (chatlog[index + 1].includes("%")) {
                                    chatlog[index + 1].split("%").forEach((replacement) => {
                                        if (charLongNames.has(replacement)) {
                                            chatlog[index + 1] = chatlog[index + 1].replace("%" + replacement + "%", charLongNames.get(replacement));
                                        }
                                    });
                                }

                                var title = document.createElement("p");
                                title.innerHTML = chatlog[index].concat("<br>", chatlog[index + 1]);
                                title.classList.add("title");

                                div.appendChild(title);
                            }
                            // Processes chatlog lines
                            else if (chatlog.indexOf(line) > index + 1) {

                                // Replaces shortnames with full names
                                if (line.includes("%")) {
                                    line.split("%").forEach((replacement) => {
                                        if (charLongNames.has(replacement)) {
                                            line.replace("%" + replacement + "%", charLongNames.get(replacement));
                                        }
                                    });
                                }

                                if (line && line !== "") {
                                    var p = document.createElement("p");
                                    if (line.includes(">")) {
                                        p.classList.add("textbreak");
                                        line = line.split(">")[1];
                                    }
                                    p.textContent = line;
                                    p.classList.add("line");
            
                                    if (line.includes('(') && line.includes(')')) {
                                        var name = line.split('(')[1].split(')')[0];
                                        var text = line.split(')')[1].trimStart();
                                        p.id = name;
                                        p.textContent = text;
                                    }
            
                                    div.appendChild(p);
                                }
                            }
                        }
                        else {
                            index++;
                        }
                    });
                    $logs.appendChild(div);
                }
            }
        });
        }
        
    })
    .catch((e) => console.error(e));
}