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

        if (day >= 10 && day <= 30) {
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
        let lastIndex = -1;

        for (let i = 0; i < lines.length; i++) {
            let parts = lines[i].split(",");
            if (parts[0] === shiftObj.driverID) {
                lastIndex = i; 
                if (parts[2] === shiftObj.date) {
                    return {}; 
                }
            }
        }
        let shiftDuration = getShiftDuration(shiftObj.startTime, shiftObj.endTime);
        let idleTime = getIdleTime(shiftObj.startTime, shiftObj.endTime);
        let activeTime = getActiveTime(shiftDuration, idleTime);
        let quotaMet = metQuota(shiftObj.date, activeTime);
        let hasBonus = false;
    
        let newLine = `${shiftObj.driverID},${shiftObj.driverName},${shiftObj.date},${shiftObj.startTime},${shiftObj.endTime},${shiftDuration},${idleTime},${activeTime},${quotaMet},${hasBonus}`;
        if (lastIndex !== -1) {
            
            lines.splice(lastIndex + 1, 0, newLine);
        } else {

            lines.push(newLine);
        }
    
        fs.writeFileSync(textFile, lines.filter(line => line.trim() !== "").join("\n"));

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
    
        for (let i = 1; i < lines.length; i++) {   
    
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
//function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
    function getTotalActiveHoursPerMonth(textFile, driverID, month) {

        let data = fs.readFileSync(textFile, "utf8");
        let lines = data.split("\n");

        let totalSeconds = 0;
    
        for (let i = 1; i < lines.length; i++) {
    
            let parts = lines[i].split(",");
    
            if (parts[0] === driverID) {
    
                let date = parts[2];
                let lineMonth = date.split("-")[1];
    
                if (parseInt(lineMonth) === parseInt(month)) {
    
                    let time = parts[7].split(":");
    
                    let h = parseInt(time[0]);
                    let m = parseInt(time[1]);
                    let s = parseInt(time[2]);

                    totalSeconds += h * 3600 + m * 60 + s;
                }
            }
        }
    
        let h = Math.floor(totalSeconds / 3600);
        let m = Math.floor((totalSeconds % 3600) / 60);
        let s = totalSeconds % 60;
    
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
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
//function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    // TODO: Implement this function
    function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
        const rateData = fs.readFileSync(rateFile, "utf8").split("\n");
        let dayOff = "";
        for (let line of rateData) {
            let parts = line.split(",");
            if (parts[0] === driverID) {
                dayOff = parts[1].trim();
                break;
            }
        }
        const shiftData = fs.readFileSync(textFile, "utf8").split("\n");
        let totalRequiredSeconds = 0;
        
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        for (let i = 1; i < shiftData.length; i++) {
            let parts = shiftData[i].split(",");
            if (parts[0] === driverID) {
                let dateStr = parts[2]; 
                let dateParts = dateStr.split("-");
                let lineYear = parseInt(dateParts[0]);
                let lineMonth = parseInt(dateParts[1]);
                let lineDay = parseInt(dateParts[2]);
    
                if (lineMonth === parseInt(month)) {
                    
                    let dateObj = new Date(lineYear, lineMonth - 1, lineDay);
                    let dayName = daysOfWeek[dateObj.getDay()];
    
                    if (dayName !== dayOff) {
                       
                        if (lineMonth === 4 && lineDay >= 10 && lineDay <= 30) {
                            totalRequiredSeconds += 6 * 3600;
                        } else {
                            totalRequiredSeconds += (8 * 3600) + (24 * 60);
                        }
                    }
                }
            }
        }
    
        totalRequiredSeconds -= (bonusCount * 2 * 3600);
        if (totalRequiredSeconds < 0) totalRequiredSeconds = 0;
    
        let h = Math.floor(totalRequiredSeconds / 3600);
        let m = Math.floor((totalRequiredSeconds % 3600) / 60);
        let s = totalRequiredSeconds % 60;
    
        return h + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
    }
//}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
//function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    // TODO: Implement this function
    function getNetPay(driverID, actualHours, requiredHours, rateFile) {
        function toSeconds(time) {
            let parts = time.split(":");
            return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
        }
    
        let actualSec = toSeconds(actualHours);
        let requiredSec = toSeconds(requiredHours);
        
        const rateData = fs.readFileSync(rateFile, "utf8").split("\n");
        let basePay = 0, tier = 0;
    
        for (let line of rateData) {
            let parts = line.split(",");
            if (parts[0] === driverID) {
                basePay = parseInt(parts[2]);
                tier = parseInt(parts[3]);
                break;
            }
        }
    
        if (actualSec >= requiredSec) return basePay;
        let missingSec = requiredSec - actualSec;
        let allowedHours = 0;
        if (tier === 1) allowedHours = 50;
        else if (tier === 2) allowedHours = 20;
        else if (tier === 3) allowedHours = 10;
        else if (tier === 4) allowedHours = 3;
    
        let billableMissingSec = missingSec - (allowedHours * 3600);
        if (billableMissingSec <= 0) return basePay;
        let fullMissingHours = Math.floor(billableMissingSec / 3600);
        let deductionRate = Math.floor(basePay / 185);
        
        return basePay - (fullMissingHours * deductionRate);
    }
//}

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
