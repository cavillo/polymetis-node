"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const chalk_1 = __importDefault(require("chalk"));
var LoggerMode;
(function (LoggerMode) {
    LoggerMode[LoggerMode["ALL"] = 0] = "ALL";
    LoggerMode[LoggerMode["DEBUG"] = 1] = "DEBUG";
    LoggerMode[LoggerMode["INFO"] = 2] = "INFO";
    LoggerMode[LoggerMode["WARN"] = 3] = "WARN";
    LoggerMode[LoggerMode["ERROR"] = 4] = "ERROR";
    LoggerMode[LoggerMode["OFF"] = 5] = "OFF";
})(LoggerMode = exports.LoggerMode || (exports.LoggerMode = {}));
class Logger {
    constructor(conf, callback = null) {
        this.conf = conf;
        this.callback = callback;
    }
    setLoggerCallback(callback) {
        this.callback = callback;
    }
    debug(...args) {
        if (this.conf.loggerMode <= LoggerMode.DEBUG) {
            this.log(LoggerMode.DEBUG, ...args);
        }
    }
    info(...args) {
        if (this.conf.loggerMode <= LoggerMode.INFO) {
            this.log(LoggerMode.INFO, ...args);
        }
    }
    warn(...args) {
        if (this.conf.loggerMode <= LoggerMode.WARN) {
            this.log(LoggerMode.WARN, ...args);
        }
    }
    error(...args) {
        if (this.conf.loggerMode <= LoggerMode.ERROR) {
            this.log(LoggerMode.ERROR, ...args);
        }
    }
    log(mode, ...args) {
        let modeLabel = 'LOG';
        let modeChalk = chalk_1.default.white;
        switch (mode) {
            case LoggerMode.DEBUG:
                modeLabel = 'DEBUG';
                modeChalk = chalk_1.default.gray;
                break;
            case LoggerMode.INFO:
                modeLabel = 'INFO';
                modeChalk = chalk_1.default.white;
                break;
            case LoggerMode.WARN:
                modeLabel = 'WARN';
                modeChalk = chalk_1.default.yellow;
                break;
            case LoggerMode.ERROR:
                modeLabel = 'ERROR';
                modeChalk = chalk_1.default.red;
                break;
        }
        const prefix = `[${this.conf.environment}::${this.conf.service}] [${moment_1.default().format('YYYY-MM-DD HH:mm:ss:SSS')}] [${modeLabel}]`;
        console.log(modeChalk(prefix), ...args);
        if (this.callback) {
            try {
                this.callback(modeLabel, ...args);
            }
            catch (error) {
                this.error('Error in Logger callback', error);
            }
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvbG9nZ2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLGtEQUEwQjtBQUkxQixJQUFZLFVBT1g7QUFQRCxXQUFZLFVBQVU7SUFDcEIseUNBQUcsQ0FBQTtJQUNILDZDQUFLLENBQUE7SUFDTCwyQ0FBSSxDQUFBO0lBQ0osMkNBQUksQ0FBQTtJQUNKLDZDQUFLLENBQUE7SUFDTCx5Q0FBRyxDQUFBO0FBQ0wsQ0FBQyxFQVBXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBT3JCO0FBRUQsTUFBYSxNQUFNO0lBQ2pCLFlBQ1ksSUFBMEIsRUFDMUIsV0FBNEYsSUFBSTtRQURoRyxTQUFJLEdBQUosSUFBSSxDQUFzQjtRQUMxQixhQUFRLEdBQVIsUUFBUSxDQUF3RjtJQUN6RyxDQUFDO0lBRUcsaUJBQWlCLENBQ3RCLFFBQXlGO1FBRXpGLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFFTSxLQUFLLENBQUMsR0FBRyxJQUFTO1FBQ3ZCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRTtZQUM1QyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFTSxJQUFJLENBQUMsR0FBRyxJQUFTO1FBQ3RCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtZQUMzQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7SUFFTSxJQUFJLENBQUMsR0FBRyxJQUFTO1FBQ3RCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLElBQUksRUFBRTtZQUMzQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7SUFFTSxLQUFLLENBQUMsR0FBRyxJQUFTO1FBQ3ZCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRTtZQUM1QyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFTyxHQUFHLENBQUMsSUFBZ0IsRUFBRSxHQUFHLElBQVM7UUFDeEMsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksU0FBUyxHQUFHLGVBQUssQ0FBQyxLQUFLLENBQUM7UUFFNUIsUUFBUSxJQUFJLEVBQUU7WUFDWixLQUFLLFVBQVUsQ0FBQyxLQUFLO2dCQUNuQixTQUFTLEdBQUcsT0FBTyxDQUFDO2dCQUNwQixTQUFTLEdBQUcsZUFBSyxDQUFDLElBQUksQ0FBQztnQkFDdkIsTUFBTTtZQUNSLEtBQUssVUFBVSxDQUFDLElBQUk7Z0JBQ2xCLFNBQVMsR0FBRyxNQUFNLENBQUM7Z0JBQ25CLFNBQVMsR0FBRyxlQUFLLENBQUMsS0FBSyxDQUFDO2dCQUN4QixNQUFNO1lBQ1IsS0FBSyxVQUFVLENBQUMsSUFBSTtnQkFDbEIsU0FBUyxHQUFHLE1BQU0sQ0FBQztnQkFDbkIsU0FBUyxHQUFHLGVBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQ3pCLE1BQU07WUFDUixLQUFLLFVBQVUsQ0FBQyxLQUFLO2dCQUNuQixTQUFTLEdBQUcsT0FBTyxDQUFDO2dCQUNwQixTQUFTLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQztnQkFDdEIsTUFBTTtTQUNUO1FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sTUFBTSxnQkFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sU0FBUyxHQUFHLENBQUM7UUFDakksT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUV4QyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsSUFBSTtnQkFDRixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO2FBQ25DO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUMvQztTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBdEVELHdCQXNFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5cbmltcG9ydCB7IFNlcnZpY2VDb25maWd1cmF0aW9uIH0gZnJvbSAnLi4vY29uZmlnJztcblxuZXhwb3J0IGVudW0gTG9nZ2VyTW9kZSB7XG4gIEFMTCxcbiAgREVCVUcsXG4gIElORk8sXG4gIFdBUk4sXG4gIEVSUk9SLFxuICBPRkYsXG59XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgY29uZjogU2VydmljZUNvbmZpZ3VyYXRpb24sXG4gICAgcHJvdGVjdGVkIGNhbGxiYWNrOiAobW9kZTogc3RyaW5nLCBtZXNzYWdlPzogYW55LCAuLi5vcHRpb25hbFBhcmFtczogYW55W10pID0+IFByb21pc2U8dm9pZD4gfCBudWxsID0gbnVsbCxcbiAgKSB7fVxuXG4gIHB1YmxpYyBzZXRMb2dnZXJDYWxsYmFjayhcbiAgICBjYWxsYmFjazogKG1vZGU6IHN0cmluZywgbWVzc2FnZT86IGFueSwgLi4ub3B0aW9uYWxQYXJhbXM6IGFueVtdKSA9PiBQcm9taXNlPHZvaWQ+IHwgbnVsbCxcbiAgKSB7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICB9XG5cbiAgcHVibGljIGRlYnVnKC4uLmFyZ3M6IGFueSkge1xuICAgIGlmICh0aGlzLmNvbmYubG9nZ2VyTW9kZSA8PSBMb2dnZXJNb2RlLkRFQlVHKSB7XG4gICAgICB0aGlzLmxvZyhMb2dnZXJNb2RlLkRFQlVHLCAuLi5hcmdzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5mbyguLi5hcmdzOiBhbnkpIHtcbiAgICBpZiAodGhpcy5jb25mLmxvZ2dlck1vZGUgPD0gTG9nZ2VyTW9kZS5JTkZPKSB7XG4gICAgICB0aGlzLmxvZyhMb2dnZXJNb2RlLklORk8sIC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB3YXJuKC4uLmFyZ3M6IGFueSkge1xuICAgIGlmICh0aGlzLmNvbmYubG9nZ2VyTW9kZSA8PSBMb2dnZXJNb2RlLldBUk4pIHtcbiAgICAgIHRoaXMubG9nKExvZ2dlck1vZGUuV0FSTiwgLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGVycm9yKC4uLmFyZ3M6IGFueSkge1xuICAgIGlmICh0aGlzLmNvbmYubG9nZ2VyTW9kZSA8PSBMb2dnZXJNb2RlLkVSUk9SKSB7XG4gICAgICB0aGlzLmxvZyhMb2dnZXJNb2RlLkVSUk9SLCAuLi5hcmdzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGxvZyhtb2RlOiBMb2dnZXJNb2RlLCAuLi5hcmdzOiBhbnkpIHtcbiAgICBsZXQgbW9kZUxhYmVsID0gJ0xPRyc7XG4gICAgbGV0IG1vZGVDaGFsayA9IGNoYWxrLndoaXRlO1xuXG4gICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICBjYXNlIExvZ2dlck1vZGUuREVCVUc6XG4gICAgICAgIG1vZGVMYWJlbCA9ICdERUJVRyc7XG4gICAgICAgIG1vZGVDaGFsayA9IGNoYWxrLmdyYXk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMb2dnZXJNb2RlLklORk86XG4gICAgICAgIG1vZGVMYWJlbCA9ICdJTkZPJztcbiAgICAgICAgbW9kZUNoYWxrID0gY2hhbGsud2hpdGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMb2dnZXJNb2RlLldBUk46XG4gICAgICAgIG1vZGVMYWJlbCA9ICdXQVJOJztcbiAgICAgICAgbW9kZUNoYWxrID0gY2hhbGsueWVsbG93O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTG9nZ2VyTW9kZS5FUlJPUjpcbiAgICAgICAgbW9kZUxhYmVsID0gJ0VSUk9SJztcbiAgICAgICAgbW9kZUNoYWxrID0gY2hhbGsucmVkO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjb25zdCBwcmVmaXggPSBgWyR7dGhpcy5jb25mLmVudmlyb25tZW50fTo6JHt0aGlzLmNvbmYuc2VydmljZX1dIFske21vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzczpTU1MnKX1dIFske21vZGVMYWJlbH1dYDtcbiAgICBjb25zb2xlLmxvZyhtb2RlQ2hhbGsocHJlZml4KSwgLi4uYXJncyk7XG5cbiAgICBpZiAodGhpcy5jYWxsYmFjaykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5jYWxsYmFjayhtb2RlTGFiZWwsIC4uLmFyZ3MpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5lcnJvcignRXJyb3IgaW4gTG9nZ2VyIGNhbGxiYWNrJywgZXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19