const fs = require("fs");

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
//function getShiftDuration(startTime, endTime) {
    // TODO: Implement this function
    function getShiftDuration(startTime, endTime) {

        function convertToSeconds(timeStr) {
            let parts = timeStr.split(" ");
            let time = parts[0];
            let period = parts[1];

            let t = time.split(":");
            let hours = parseInt(t[0]);
            let minutes = parseInt(t[1]);
            let seconds = parseInt(t[2]);
    
            if (period === "pm" && hours !== 12) {
                hours += 12;
            }
    
            if (period === "am" && hours === 12) {
                hours = 0;
            }
    
            return hours * 3600 + minutes * 60 + seconds;
        }
    
        let startSeconds = convertToSeconds(startTime);
        let endSeconds = convertToSeconds(endTime);
    
        let duration = endSeconds - startSeconds;
    
        let h = Math.floor(duration / 3600);
        let m = Math.floor((duration % 3600) / 60);
        let s = duration % 60;
    
        if (m < 10) {
            m = "0" + m;
        }
        
        if (s < 10) {
            s = "0" + s;
        }
        
        return h + ":" + m + ":" + s;
    }


// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
//function getIdleTime(startTime, endTime) {
    // TODO: Implement this function
    function getIdleTime(startTime, endTime) {

        function convertToSeconds(timeStr) {
            let parts = timeStr.split(" ");
            let time = parts[0];
            let period = parts[1];
    
            let t = time.split(":");
            let hours = parseInt(t[0]);
            let minutes = parseInt(t[1]);
            let seconds = parseInt(t[2]);
    
            if (period === "pm" && hours !== 12) {
                hours += 12;
            }
    
            if (period === "am" && hours === 12) {
                hours = 0;
            }
    
            return hours * 3600 + minutes * 60 + seconds;
        }
    
        let start = convertToSeconds(startTime);
        let end = convertToSeconds(endTime);
    
        let startWork = 8 * 3600;
        let endWork = 22 * 3600;
    
        let idle = 0;
    
        if (start < startWork) {
            idle += startWork - start;
        }
    
        if (end > endWork) {
            idle += end - endWork;
        }
    
        let h = Math.floor(idle / 3600);
        let m = Math.floor((idle % 3600) / 60);
        let s = idle % 60;
    
        if (m < 10) {
            m = "0" + m;
        }
        
        if (s < 10) {
            s = "0" + s;
        }
        
        return h + ":" + m + ":" + s;
    }


// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
//function getActiveTime(shiftDuration, idleTime) {
    // TODO: Implement this function
    function getActiveTime(shiftDuration, idleTime) {

        function toSeconds(time) {
            let parts = time.split(":");
    
            let h = parseInt(parts[0]);
            let m = parseInt(parts[1]);
            let s = parseInt(parts[2]);
    
            return h * 3600 + m * 60 + s;
        }
    
        let shiftSec = toSeconds(shiftDuration);
        let idleSec = toSeconds(idleTime);
    
        let active = shiftSec - idleSec;
    
        let h = Math.floor(active / 3600);
        let m = Math.floor((active % 3600) / 60);
        let s = active % 60;
    
        if (m < 10) {
            m = "0" + m;
        }
    
        if (s < 10) {
            s = "0" + s;
        }
    
        return h + ":" + m + ":" + s;
    }
//}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
//function metQuota(date, activeTime) {
    // TODO: Implement this function
    function metQuota(date, activeTime) {

        function toSeconds(time) {
            let parts = time.split(":");

            let h = parseInt(parts[0]);
            let m = parseInt(parts[1]);
            let s = parseInt(parts[2]);

            return h * 3600 + m * 60 + s;
        }
    
        let activeSec = toSeconds(activeTime);
        let day = parseInt(date.split("-")[2]);
        let quota;

        if (day >= 10 && day <= 20) {
            quota = 6 * 3600;
        } else {
            quota = 8 * 3600; 
        }

        return activeSec >= quota;
    }

//}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
//function addShiftRecord(textFile, shiftObj) {
    // TODO: Implement this function
    function addShiftRecord(textFile, shiftObj) {

        let data = fs.readFileSync(textFile, { encoding: "utf8" });
        let lines = data.split("\n");
    
        for (let line of lines) {
            let parts = line.split(",");
    
            if (parts[0] === shiftObj.driverID && parts[2] === shiftObj.date) {
                return {};
            }
        }
    
        let shiftDuration = getShiftDuration(shiftObj.startTime, shiftObj.endTime);
        let idleTime = getIdleTime(shiftObj.startTime, shiftObj.endTime);
        let activeTime = getActiveTime(shiftDuration, idleTime);
        let quotaMet = metQuota(shiftObj.date, activeTime);
    
        let hasBonus = false;
    
        let newLine =
            shiftObj.driverID + "," +
            shiftObj.driverName + "," +
            shiftObj.date + "," +
            shiftObj.startTime + "," +
            shiftObj.endTime + "," +
            shiftDuration + "," +
            idleTime + "," +
            activeTime + "," +
            quotaMet + "," +
            hasBonus;
    
        fs.appendFileSync(textFile, "\n" + newLine);
    
        return {
            driverID: shiftObj.driverID,
            driverName: shiftObj.driverName,
            date: shiftObj.date,
            startTime: shiftObj.startTime,
            endTime: shiftObj.endTime,
            shiftDuration,
            idleTime,
            activeTime,
            quotaMet,
            hasBonus
        };
    }
//}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
//function setBonus(textFile, driverID, date, newValue) {
    // TODO: Implement this function
    function setBonus(textFile, driverID, date, newValue) {

        let data = fs.readFileSync(textFile, "utf8");
        let lines = data.split("\n");
    
        for (let i = 0; i < lines.length; i++) {
            let parts = lines[i].split(",");
    
            if (parts[0] === driverID && parts[2] === date) {
                parts[9] = newValue;
                lines[i] = parts.join(",");
            }
    
        }
    
        fs.writeFileSync(textFile, lines.join("\n"));
    }
//}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
//function countBonusPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
    function countBonusPerMonth(textFile, driverID, month) {

        let data = fs.readFileSync(textFile, "utf8");
        let lines = data.split("\n");
    
        let count = 0;
        let driverFound = false;
    
        for (let i = 1; i < lines.length; i++) {   // start from 1 to skip header
    
            let parts = lines[i].split(",");
    
            if (parts[0] === driverID) {
    
                driverFound = true;
    
                let date = parts[2];
                let lineMonth = date.split("-")[1];
    
                if (parseInt(lineMonth) === parseInt(month)) {
    
                    if (parts[9] === "true") {
                        count++;
                    }
    
                }
            }
        }
    
        if (!driverFound) {
            return -1;
        }
    
        return count;
    }
//}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    // TODO: Implement this function
}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
