var fs = require("fs");
if (process.argv.length == 4) {
} else {
    console.log("Usage: node %s logFile outputFile", process.argv[1]);
    process.exit(1);
}
fs.readFile(process.argv[2], 'ascii', function (err, data) {
    if (err) {
        throw err;
    } else {
        var buffer = "";
        var dataLen = data.length, validStrLen = 0;
        var i;
        var out = "";
        var startTime, endTime;

        startTime = new Date().valueOf();
        console.log("File Size: " + dataLen + "Bytes");
        //Reading text file
        for (i = 0; i < dataLen; i += validStrLen + 1) {
            buffer = data.substr(i, 5120);
            validStrLen = buffer.lastIndexOf("\n");
            buffer = logExecute(buffer.substr(0, validStrLen));
            out += buffer;
            //subStr = buffer.substr(0, validStrLen);
            //out += subStr;
        }
        fs.writeFile(process.argv[3], out, 'ascii', function (err) {
            if (err) {
                throw err;
            }
        });
        endTime = new Date().valueOf();
        console.log("Total time : " + (endTime - startTime) + "ms");
    }
});

function logExecute(input) {
    //No need to initialize more than one time.
    var regGlobal = /[INFO |ERROR|WARN ] \[(.+)\] \[(.*)\] (.+)\"/g;
    var output = "";

    var headStr, tempStr, tailStr;
    var cols, colName = ["name", "mid", "ip", "Cmd", "DeviceID", "Version", "ua"];
    var i;
    var reg$2, matchArray;

    while ((regGlobal.exec(input)) != null) {
        headStr = RegExp.$1;
        tempStr = RegExp.$2;
        tailStr = RegExp.$3;
        cols = [];
        if (tempStr != "") {
            for (i = 0; i < colName.length; i++) {
                reg$2 = new RegExp(colName[i] + "=([^;]+);");
                matchArray = tempStr.match(reg$2);
                cols.push(matchArray != null ? matchArray[1] : "");
            }
            tempStr = cols[0];
            for (i = 1; i < cols.length; i++) {
                tempStr += '\t' + cols[i];
            }
        } else {
            for (i = 1; i < colName.length; i++) {
                tempStr += '\t';
            }
        }
        output += headStr + "\t" + tempStr + "\t" + tailStr + "\n";
    }
    return output;
}


/*
 var readStream = fs.createReadStream("./miao/mailbox.log", {
 'flags': 'r',
 'encoding': null,
 'mode': 438,
 'bufferSize': 8 * 1024
 });
 */