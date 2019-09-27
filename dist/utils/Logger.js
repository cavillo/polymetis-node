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
    setLoggerCalback(callback) {
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
exports.default = Logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL0xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUM1QixrREFBMEI7QUFJMUIsSUFBWSxVQU9YO0FBUEQsV0FBWSxVQUFVO0lBQ3BCLHlDQUFHLENBQUE7SUFDSCw2Q0FBSyxDQUFBO0lBQ0wsMkNBQUksQ0FBQTtJQUNKLDJDQUFJLENBQUE7SUFDSiw2Q0FBSyxDQUFBO0lBQ0wseUNBQUcsQ0FBQTtBQUNMLENBQUMsRUFQVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQU9yQjtBQUVELE1BQXFCLE1BQU07SUFDekIsWUFDWSxJQUEwQixFQUMxQixXQUE0RixJQUFJO1FBRGhHLFNBQUksR0FBSixJQUFJLENBQXNCO1FBQzFCLGFBQVEsR0FBUixRQUFRLENBQXdGO0lBQ3pHLENBQUM7SUFFRyxnQkFBZ0IsQ0FDckIsUUFBeUY7UUFFekYsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVNLEtBQUssQ0FBQyxHQUFHLElBQVM7UUFDdkIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFO1lBQzVDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVNLElBQUksQ0FBQyxHQUFHLElBQVM7UUFDdEIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO1lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQ3BDO0lBQ0gsQ0FBQztJQUVNLElBQUksQ0FBQyxHQUFHLElBQVM7UUFDdEIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO1lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQ3BDO0lBQ0gsQ0FBQztJQUVNLEtBQUssQ0FBQyxHQUFHLElBQVM7UUFDdkIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFO1lBQzVDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVPLEdBQUcsQ0FBQyxJQUFnQixFQUFFLEdBQUcsSUFBUztRQUN4QyxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxTQUFTLEdBQUcsZUFBSyxDQUFDLEtBQUssQ0FBQztRQUU1QixRQUFRLElBQUksRUFBRTtZQUNaLEtBQUssVUFBVSxDQUFDLEtBQUs7Z0JBQ25CLFNBQVMsR0FBRyxPQUFPLENBQUM7Z0JBQ3BCLFNBQVMsR0FBRyxlQUFLLENBQUMsSUFBSSxDQUFDO2dCQUN2QixNQUFNO1lBQ1IsS0FBSyxVQUFVLENBQUMsSUFBSTtnQkFDbEIsU0FBUyxHQUFHLE1BQU0sQ0FBQztnQkFDbkIsU0FBUyxHQUFHLGVBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ3hCLE1BQU07WUFDUixLQUFLLFVBQVUsQ0FBQyxJQUFJO2dCQUNsQixTQUFTLEdBQUcsTUFBTSxDQUFDO2dCQUNuQixTQUFTLEdBQUcsZUFBSyxDQUFDLE1BQU0sQ0FBQztnQkFDekIsTUFBTTtZQUNSLEtBQUssVUFBVSxDQUFDLEtBQUs7Z0JBQ25CLFNBQVMsR0FBRyxPQUFPLENBQUM7Z0JBQ3BCLFNBQVMsR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDO2dCQUN0QixNQUFNO1NBQ1Q7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxNQUFNLGdCQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsTUFBTSxTQUFTLEdBQUcsQ0FBQztRQUNqSSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1FBRXhDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJO2dCQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDbkM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLDBCQUEwQixFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQy9DO1NBQ0Y7SUFDSCxDQUFDO0NBQ0Y7QUF0RUQseUJBc0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vbWVudCBmcm9tICdtb21lbnQnO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcblxuaW1wb3J0IHsgU2VydmljZUNvbmZpZ3VyYXRpb24gfSBmcm9tICcuL1NlcnZpY2VDb25mJztcblxuZXhwb3J0IGVudW0gTG9nZ2VyTW9kZSB7XG4gIEFMTCxcbiAgREVCVUcsXG4gIElORk8sXG4gIFdBUk4sXG4gIEVSUk9SLFxuICBPRkYsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvZ2dlciB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBjb25mOiBTZXJ2aWNlQ29uZmlndXJhdGlvbixcbiAgICBwcm90ZWN0ZWQgY2FsbGJhY2s6IChtb2RlOiBzdHJpbmcsIG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkgPT4gUHJvbWlzZTx2b2lkPiB8IG51bGwgPSBudWxsLFxuICApIHt9XG5cbiAgcHVibGljIHNldExvZ2dlckNhbGJhY2soXG4gICAgY2FsbGJhY2s6IChtb2RlOiBzdHJpbmcsIG1lc3NhZ2U/OiBhbnksIC4uLm9wdGlvbmFsUGFyYW1zOiBhbnlbXSkgPT4gUHJvbWlzZTx2b2lkPiB8IG51bGwsXG4gICkge1xuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgfVxuXG4gIHB1YmxpYyBkZWJ1ZyguLi5hcmdzOiBhbnkpIHtcbiAgICBpZiAodGhpcy5jb25mLmxvZ2dlck1vZGUgPD0gTG9nZ2VyTW9kZS5ERUJVRykge1xuICAgICAgdGhpcy5sb2coTG9nZ2VyTW9kZS5ERUJVRywgLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGluZm8oLi4uYXJnczogYW55KSB7XG4gICAgaWYgKHRoaXMuY29uZi5sb2dnZXJNb2RlIDw9IExvZ2dlck1vZGUuSU5GTykge1xuICAgICAgdGhpcy5sb2coTG9nZ2VyTW9kZS5JTkZPLCAuLi5hcmdzKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgd2FybiguLi5hcmdzOiBhbnkpIHtcbiAgICBpZiAodGhpcy5jb25mLmxvZ2dlck1vZGUgPD0gTG9nZ2VyTW9kZS5XQVJOKSB7XG4gICAgICB0aGlzLmxvZyhMb2dnZXJNb2RlLldBUk4sIC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBlcnJvciguLi5hcmdzOiBhbnkpIHtcbiAgICBpZiAodGhpcy5jb25mLmxvZ2dlck1vZGUgPD0gTG9nZ2VyTW9kZS5FUlJPUikge1xuICAgICAgdGhpcy5sb2coTG9nZ2VyTW9kZS5FUlJPUiwgLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsb2cobW9kZTogTG9nZ2VyTW9kZSwgLi4uYXJnczogYW55KSB7XG4gICAgbGV0IG1vZGVMYWJlbCA9ICdMT0cnO1xuICAgIGxldCBtb2RlQ2hhbGsgPSBjaGFsay53aGl0ZTtcblxuICAgIHN3aXRjaCAobW9kZSkge1xuICAgICAgY2FzZSBMb2dnZXJNb2RlLkRFQlVHOlxuICAgICAgICBtb2RlTGFiZWwgPSAnREVCVUcnO1xuICAgICAgICBtb2RlQ2hhbGsgPSBjaGFsay5ncmF5O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTG9nZ2VyTW9kZS5JTkZPOlxuICAgICAgICBtb2RlTGFiZWwgPSAnSU5GTyc7XG4gICAgICAgIG1vZGVDaGFsayA9IGNoYWxrLndoaXRlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTG9nZ2VyTW9kZS5XQVJOOlxuICAgICAgICBtb2RlTGFiZWwgPSAnV0FSTic7XG4gICAgICAgIG1vZGVDaGFsayA9IGNoYWxrLnllbGxvdztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIExvZ2dlck1vZGUuRVJST1I6XG4gICAgICAgIG1vZGVMYWJlbCA9ICdFUlJPUic7XG4gICAgICAgIG1vZGVDaGFsayA9IGNoYWxrLnJlZDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29uc3QgcHJlZml4ID0gYFske3RoaXMuY29uZi5lbnZpcm9ubWVudH06OiR7dGhpcy5jb25mLnNlcnZpY2V9XSBbJHttb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3M6U1NTJyl9XSBbJHttb2RlTGFiZWx9XWA7XG4gICAgY29uc29sZS5sb2cobW9kZUNoYWxrKHByZWZpeCksIC4uLmFyZ3MpO1xuXG4gICAgaWYgKHRoaXMuY2FsbGJhY2spIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2sobW9kZUxhYmVsLCAuLi5hcmdzKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMuZXJyb3IoJ0Vycm9yIGluIExvZ2dlciBjYWxsYmFjaycsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==