// Interprets table of contents on the left
const $childBody = document.createElement("div");
$childBody.classList.add("childbody");
document.body.appendChild($childBody);

const $table = document.createElement("div");
$table.id = "tableofcontents";
$childBody.appendChild($table);

const $logs = document.createElement("div");
$logs.id = "logs";
$childBody.appendChild($logs);
// Gets the file name to add the logs to the HTML
var fileName = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
fileName = fileName.substring(0, fileName.lastIndexOf('.')).toUpperCase();

if ($logs != null) {
    document.body.classList.add(fileName);

    let charLongNames = new Map();
    let charShortNames = new Map();
    // Set styles
    fetch("../Text Logs/Character Names.txt")
    .then((res) => res.text())
    .then((chars) => {
        if (chars.length > 0) {
            var styles = "";
            chars.split('\n').forEach((element) => {
                var charName = element.split(" {")[0].trim();
                var charNickname = element.split(" {")[1].split("}")[0];
                var charColor = element.split("] ")[1];
                charShortNames.set(charName, charNickname);
                charLongNames.set(charName, element.split(" [")[1].split("]")[0]);
                document.head.title = charLongNames.get(charName);

                var darkColor = "color-mix(in srgb, #000 90%, " + charColor + " 10%)";
                var lighterColor = "color-mix(in srgb, #000 60%, " + charColor + " 40%)";
                
                styles += "body." + charName + " {";
                styles += "background-color: " + darkColor + ";";
                styles += "background-image: linear-gradient(" + lighterColor + " 5px, transparent 1px), linear-gradient(to right, " + lighterColor + " 5px, transparent 1px);";
                styles += "}";
                styles += ".logborder ." + charName + "{";
                styles += "box-shadow: 0px 0px 5px " + charColor + ";";
                styles += "}";
                styles += ".coloredimg#" + charName + " {";
                styles += "background-color: " + lighterColor + ";";
                styles += "}";

                styles += "#" + charName + "{";
                styles += "color: " + charColor + ";";
                styles += "}";
            });
            var styleSheet = document.createElement("style");
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        // Process character links here
        fetch("../Text Logs/Local Groups.txt")
        .then((res) => res.text())
        .then((rawText) => {
            if (rawText.includes("{")) {
                var localGroups = document.createElement("div");
                localGroups.classList.add("localgrouplist");

                var homeButton = document.createElement("div");
                homeButton.classList.add("title");
                homeButton.textContent = "RETURN TO THE SHELTER";
                homeButton.classList.add("link");
                localGroups.appendChild(homeButton);
                homeButton.onclick = function() {
                    window.location.href = "../index.html";
                };

                var group = document.createElement("div");
                group.classList.add("localgroup");

                $table.appendChild(localGroups);
                $table.appendChild(group);
                
                var localGroupList = document.createElement("div");
                localGroupList.classList.add("icons");
                localGroups.appendChild(localGroupList);

                rawText.split("{").forEach((iterators) => {
                    var localName = iterators.split("}")[0];
                    if (iterators.length > 1 && iterators.split("}").length > 1) {
                        var names = iterators.split("}")[1];
                        // If iterator is in group, add group name
                        if (names.includes(fileName)) {
                            var groupTitle = document.createElement("div");
                            groupTitle.textContent = localName;
                            groupTitle.classList.add("title");
                            group.appendChild(groupTitle);

                            var groupList = document.createElement("div");
                            groupList.classList.add("icons");
                            group.appendChild(groupList);
                            
                            var iterators = names;
                            if (iterators.includes(", ")) {
                                iterators = iterators.split(", ");
                            }
                            iterators.forEach((iterator) => {
                                iterator = iterator.trim();
                                var groupDiv = document.createElement("div");
                                groupDiv.classList.add("tooltip");
                                groupList.appendChild(groupDiv); 

                                var grouptoolTip = document.createElement("div");
                                if (charLongNames.has(iterator)) {
                                    grouptoolTip.textContent = charLongNames.get(iterator);
                                }
                                else {
                                    grouptoolTip.textContent = iterator;
                                }
                                grouptoolTip.classList.add("tooltiptext");
                                groupDiv.appendChild(grouptoolTip);

                                var groupIcon = document.createElement("img");
                                fetch("../Images/" + iterator + "ICON.png")
                                .then((res) => {
                                    if (res.ok) {
                                        return res.url;
                                    }
                                    throw new Error("Iterator icon not found!");
                                })
                                .then((url) => {
                                    groupIcon.src = url;
                                    
                                    if (iterator === fileName) {
                                        groupIcon.classList.add("disabled");
                                    }
                                    else {
                                        groupIcon.onclick = function() {
                                            window.location.href = "../" + localName + "/" + iterator + ".html";
                                        };
                                    }
                                });
                                groupDiv.appendChild(groupIcon);
                            });
                        }

                        var groupDiv = document.createElement("div");
                        groupDiv.classList.add("tooltip");
                        localGroupList.appendChild(groupDiv);

                        var grouptoolTip = document.createElement("div");
                        grouptoolTip.textContent = localName;
                        grouptoolTip.classList.add("tooltiptext");
                        groupDiv.appendChild(grouptoolTip);

                        var groupIcon = document.createElement("img");
                        fetch("../Images/" + localName + ".png")
                        .then((res) => {
                            if (res.ok) {
                                return res.url;
                            }
                            throw new Error("Local group icon not found!");
                        })
                        .then((url) => {
                            groupIcon.src = url;
                            if (names.includes(fileName)) {
                                groupIcon.classList.add("disabled");
                            }
                            groupIcon.onclick = function() {
                                window.location.href = "../" + localName + ".html";
                            };
                        });
                        groupDiv.appendChild(groupIcon);
                        
                        localGroupList.appendChild(groupDiv);
                    }
                });
            }

            // Process character bio here
            fetch("../Text Logs/Character Bios.txt")
            .then((res) => res.text())
            .then((text) => {

                var characterInfo = document.createElement("div");
                characterInfo.classList.add("information");
                $table.appendChild(characterInfo);

                if (text.includes("{")) {
                    text.split("{").forEach((bios) => {
                        if (bios.split("}")[0] == fileName) {
                            // Process sidebar if bios contain this file

                            var characterBio = document.createElement("div");
                            characterBio.classList.add("bio");
                            characterInfo.appendChild(characterBio);

                            var characterImage = document.createElement("img");
                            fetch("../Images/" + fileName +".png")
                            .then((res) => {
                                if (res.ok) {
                                    return res.url;
                                }
                                throw new Error("Couldn't find image")
                            })
                            .then((imageUrl) => characterImage.src = imageUrl);
                            characterImage.classList.add("characterimage");
                            characterBio.appendChild(characterImage);

                            var characterTitle = document.createElement("div");
                            characterTitle.classList.add("title");
                            characterTitle.id = fileName;
                            if (charLongNames.has(fileName)) {
                                characterTitle.textContent = charLongNames.get(fileName);
                            }
                            characterBio.appendChild(characterTitle);

                            var lines = bios.split("}")[1];
                            var container = document.createElement("div");
                            container.classList.add("logborder");
                            container.id = fileName;
                            characterBio.appendChild(container);


                            var innerContainer = document.createElement("div");
                            innerContainer.classList.add("singlelog");
                            innerContainer.id = fileName;
                            container.appendChild(innerContainer);

                            var charIcon = document.createElement("img");
                            fetch("../Images/" + fileName + "ICON.png")
                            .then((res) => {
                                if (res.ok) {
                                    return res.url;
                                }
                                throw new Error("Couldn't find image")
                            })
                            .then((imageUrl) => charIcon.src = imageUrl);
                            charIcon.classList.add("iteratoricon");
                            innerContainer.appendChild(charIcon);

                            if (lines.length > 0) {
                                lines.split("\n").forEach((line) => {
                                    if (line.includes("|")) {
                                        var infotext = document.createElement("span");
                                        infotext.classList.add("infoline");
                                        innerContainer.appendChild(infotext);

                                        var infokey = document.createElement("div");
                                        infokey.classList.add("key");
                                        infokey.textContent = line.split("|")[0];
                                        infotext.appendChild(infokey);

                                        var lineText = line.split("|")[1];
                                        if (lineText.includes("%")) {
                                            lineText.split("%").forEach((replacement) => {
                                                if (charLongNames.has(replacement)) {
                                                    lineText = lineText.replace("%" + replacement + "%", charLongNames.get(replacement));
                                                }
                                            });
                                        }

                                        var infoValue = document.createElement("div");
                                        infoValue.classList.add("value");
                                        infoValue.textContent = lineText;
                                        infotext.appendChild(infoValue);
                                    }
                                });
                            }
                        }
                    });
                }
                

                // Add log jump to
                fetch("../Text Logs/Canon Log Timeline.txt")
                .then((res2) => res2.text())
                .then((text2) => {

                    var logentries = document.createElement("div");
                    logentries.classList.add("logentries");
                    characterInfo.appendChild(logentries);

                    var logContainer = document.createElement("div");
                        logContainer.classList.add("logborder");
                        logContainer.classList.add("logcontainer");
                        logContainer.id = fileName;
                        logentries.appendChild(logContainer);

                    var logInnerContainer = document.createElement("div");
                    logInnerContainer.classList.add("singlelog");
                    logInnerContainer.id = fileName;
                    logContainer.appendChild(logInnerContainer);

                    var logcollection = [];
                    var firstandlastlogs = [];

                        if (text2.includes("{")) {
                            var splitLogs = text2.split("{");
                            if (splitLogs.length > 1) {
                                splitLogs.forEach((nom) => {
                                    if (nom.includes("}")) {
                                        var itor = nom.split("}")[0];
                                        var potentialLognames = nom.split("}")[1].split("\n");
                                        var logName = potentialLognames[1].trim();
                                        if (logName.includes("^" + fileName + "^")) {
                                            for (let index = 0; index < potentialLognames.length; index++) {
                                                if(potentialLognames[index].includes("^") && potentialLognames[index].includes("/"+fileName) && index + 1 < potentialLognames.length) {
                                                    logName = potentialLognames[index + 1];
                                                }
                                            }
                                        }
                                        else if (logName.includes("^") && 2 < potentialLognames.length) {
                                            logName = potentialLognames[2];
                                        }
                                        if (itor.includes(fileName)) {
                                            logcollection.push(logName);
                                            var logiconname = "";
                                            if (logName.toLowerCase().includes("initial")) {
                                                logiconname = "INIT";
                                            }
                                            else if (logName.toLowerCase().includes("triple affirmative")) {
                                                logiconname = "ASCEND";
                                            }
                                            else if (logName.toLowerCase().includes("broadcast")) {
                                                logiconname = "BROADCAST";
                                            }
                                            else if (logName.toLowerCase().includes("group")) {
                                                logiconname = "GROUP";
                                            }
                                            else if (logName.toLowerCase().includes("log")) {
                                                logiconname = "LOG";
                                            }

                                            var logiconhost = document.createElement("div");
                                            logiconhost.classList.add("small");
                                            logInnerContainer.appendChild(logiconhost);
                                            
                                            var logentry = document.createElement("img");
                                            fetch("../Images/" + logiconname + ".png")
                                            .then((ress) => {
                                                if (ress.ok) {
                                                    return ress.url;
                                                }
                                                throw new Error("Couldn't find log image!");
                                            })
                                            .then((url) => logentry.src = url);
                                            logentry.classList.add("coloredimg");
                                            if (logiconname == "ASCEND") {
                                                logentry.style.backgroundColor = "#875d2f";
                                            }
                                            logentry.id = fileName;
                                            logiconhost.appendChild(logentry);

                                            var pearlColor = potentialLognames[0];
                                            if (pearlColor.includes("#")) {
                                                var pearlColors = pearlColor.split(" ");
                                                var pearlDiv = document.createElement("div");
                                                pearlDiv.classList.add("pearl");
                                                pearlDiv.style.backgroundColor = pearlColors[1];

                                                var highlight = document.createElement("div");
                                                highlight.classList.add("highlight");
                                                highlight.style.backgroundColor = pearlColors[2];
                                                pearlDiv.appendChild(highlight);
                                                logiconhost.appendChild(pearlDiv);
                                            }

                                            var logtext = document.createElement("div");
                                            logtext.textContent = logName;
                                            logtext.classList.add("entry");
                                            logtext.classList.add("link");
                                            logtext.onclick = function() {
                                                if (logName.includes(" ")) {
                                                    window.location.href = "#" + logName.split(" ")[0];
                                                }
                                                else {
                                                    window.location.href = "#" + logName;
                                                }
                                                if ($table.classList.includes("opened")) {
                                                    $table.classList.remove("opened");
                                                }
                                            };
                                            logInnerContainer.appendChild(logtext);
                                        }

                                        if ((splitLogs.indexOf(nom) == 1 || splitLogs.indexOf(nom) == splitLogs.length - 1)) {
                                            firstandlastlogs.push(logName);
                                        }
                                    }
                                });
                            }
                        }

                        var loginformation = document.createElement("div");
                        loginformation.classList.add("loginfo");
                        loginformation.classList.add("logborder");
                        loginformation.id = fileName;
                        logentries.appendChild(loginformation);

                        var logentryinternal = document.createElement("div");
                        logentryinternal.classList.add("singlelog");
                        logentryinternal.id = fileName;
                        loginformation.appendChild(logentryinternal);

                        var infotext = document.createElement("div");
                        infotext.classList.add("smalltitle");
                        infotext.id = fileName;
                        infotext.textContent = "Total Logs";
                        logentryinternal.appendChild(infotext);

                        var totallogs = document.createElement("div");
                        totallogs.textContent = logcollection.length;
                        totallogs.style.fontSize = "25px";
                        logentryinternal.appendChild(totallogs);

                        var logline = document.createElement("div");
                        logline.classList.add("timeline");
                        logentryinternal.appendChild(logline);

                        if (firstandlastlogs.length == 2) {
                            var markerline = document.createElement("div");
                            markerline.classList.add("markerline");

                            var markerdot = document.createElement("div");
                            markerdot.classList.add("markerdot");
                            markerdot.classList.add("tooltip");
                            var timetext = document.createElement("div");
                            timetext.classList.add("tooltiptext");
                            markerdot.appendChild(timetext);
                            timetext.textContent = firstandlastlogs[0];

                            var firstMarker = document.createElement("div");
                                firstMarker.classList.add("marker");
                                firstMarker.style.top = -(firstMarker.style.height / 2).toString() + "px";
                                if (!logcollection.includes(firstandlastlogs[0])) {
                                    markerline.style.borderColor = "#FFF";
                                    markerdot.style.borderColor = "#FFF";
                                }
                                logline.appendChild(firstMarker);
                                firstMarker.appendChild(markerline);
                                firstMarker.appendChild(markerdot);

                                markerline = document.createElement("div");
                                markerline.classList.add("markerline");

                                markerdot = document.createElement("div");
                                markerdot.classList.add("markerdot");
                                markerdot.classList.add("tooltip");
                                timetext = document.createElement("div");
                                timetext.classList.add("tooltiptext");
                                markerdot.appendChild(timetext);
                                timetext.textContent = firstandlastlogs[1];
                                
                        
                                var bottom = 2;
                                var top = -1;
                                if (logcollection.length > 0) {
                                    var firstDecimal = parseFloat(firstandlastlogs[0].split(" ")[0].trim());
                                    var lastDecimal = parseFloat(firstandlastlogs[1].split(" ")[0].trim());
                                    logcollection.forEach((log) => {
                                        var logDecimal = parseFloat(log.split(" ")[0]);
                                        var container = document.createElement("div");
                                        container.classList.add("marker");
                                        console.log(log);
                                        if (log.includes("TRIPLE AFFIRMATIVE BROADCAST")) {
                                            container.style.color = "#875d2f";
                                        }
                                        else {
                                            container.id = fileName;
                                        }
                                        var lerp = (logDecimal - firstDecimal) / (lastDecimal - firstDecimal);
                                        var lerpValue = 0 + lerp * (300);
                                        container.style.top = lerpValue.toString() + "px";
                                        if (logcollection.indexOf(log) == 0) {
                                            top += lerpValue;
                                        }
                                        if (logcollection.indexOf(log) == logcollection.length - 1) {
                                            bottom += lerpValue;
                                        }
                                        logline.appendChild(container);

                                        var line = document.createElement("div");
                                        line.classList.add("markerline");
                                        container.appendChild(line);

                                        var dot = document.createElement("div");
                                        dot.classList.add("markerdot");
                                        dot.classList.add("tooltip");
                                        var tooltip = document.createElement("div");
                                        tooltip.classList.add("tooltiptext");
                                        tooltip.textContent = log;
                                        dot.appendChild(tooltip);

                                        container.appendChild(dot);
                                    });
                                }
                                console.log(top);
                                console.log(bottom);

                                var lastMarker = document.createElement("div");
                                lastMarker.classList.add("marker");
                                lastMarker.style.top = "300px";
                                if (!logcollection.includes(firstandlastlogs[1])) {
                                    markerline.style.borderColor = "#FFF";
                                    markerdot.style.borderColor = "#FFF";
                                }
                                logline.appendChild(lastMarker);
                                lastMarker.appendChild(markerline);
                                lastMarker.appendChild(markerdot);
                                var occupyLine = document.createElement("div");
                                occupyLine.classList.add("smalltimeline");
                                occupyLine.id = fileName;
                                occupyLine.style.top = (top).toString() + "px";
                                occupyLine.style.height = (bottom - top).toString() + "px";
                                console.log(occupyLine.style.height);
                                logline.appendChild(occupyLine);
                        }

                        var dots = logline.getElementsByClassName("markerdot");
                        for (let index = 0; index < dots.length; index++) {
                            const element = dots[index];
                            if (index % 2 == 0) {
                                element.classList.add("right");
                            }
                            else {
                                element.classList.add("left");
                            }
                        }
                })
                .catch((e) => console.error(e));

                var hideDiv = document.createElement("div");
                hideDiv.classList.add("hide");
                $table.appendChild(hideDiv);

                var hideButton = document.createElement("div");
                hideButton.textContent = "▼";
                hideButton.classList.add("hidebutton");
                hideDiv.appendChild(hideButton);
                hideDiv.addEventListener("click", (onClick) => {
                    if ($table.classList.length > 0 && $table.classList.contains("opened")) {
                        $table.classList.remove("opened");
                    }
                    else {
                        $table.classList.add("opened");
                    }
                });
                $table.classList.add("opened");
                
                // Append credits after information
                var credits = document.createElement("div");
                credits.classList.add("credits");
                credits.textContent = "© 2025, Made by MagicaJaphet";
                $table.appendChild(credits);

            })
            .catch((e) => console.error(e));
        })
        .catch((e) => console.error(e));

    });

    // Interprets logs on the right side of the screen
    fetch("../Text Logs/Canon Log Timeline.txt")
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
                                if (chatlog[index].includes(" ")) {
                                    title.id = chatlog[index].split(" ")[0];
                                }
                                else {
                                    title.id = chatlog[index];
                                }
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
                                        if (charShortNames.has(name)) {
                                            text = charShortNames.get(name)+ ": " + text;
                                        }
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
                    var parentLog = document.createElement("div");
                    parentLog.classList.add("logborder");
                    parentLog.id = fileName;

                    div.classList.add(fileName);
                    parentLog.appendChild(div);
                    $logs.appendChild(parentLog);
                }
            }
        });
        }
        
    })
    .catch((e) => console.error(e));
}