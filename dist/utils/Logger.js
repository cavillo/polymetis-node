"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    constructor(conf) {
        this.prefix = `[${conf.service}]:`;
    }
    log(...args) {
        // print white
        console.log(this.prefix, ...args);
    }
    ok(...args) {
        // print green
        console.log(chalk_1.default.green(this.prefix), ...args);
    }
    error(...args) {
        // print red
        console.log(chalk_1.default.red(this.prefix), ...args);
    }
    warn(...args) {
        // print yellow
        console.log(chalk_1.default.yellow(this.prefix), ...args);
    }
    muted(...args) {
        // print gray
        console.log(chalk_1.default.gray(this.prefix), ...args);
    }
    clean(...args) {
        // print gray
        console.log(...args);
    }
    newLine() {
        console.log();
    }
}
exports.default = Logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL0xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGtEQUEwQjtBQUUxQixNQUFxQixNQUFNO0lBR3pCLFlBQVksSUFBMEI7UUFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQztJQUNyQyxDQUFDO0lBRU0sR0FBRyxDQUFDLEdBQUcsSUFBUztRQUNyQixjQUFjO1FBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVNLEVBQUUsQ0FBQyxHQUFHLElBQVM7UUFDcEIsY0FBYztRQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU0sS0FBSyxDQUFDLEdBQUcsSUFBUztRQUN2QixZQUFZO1FBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSxJQUFJLENBQUMsR0FBRyxJQUFTO1FBQ3RCLGVBQWU7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVNLEtBQUssQ0FBQyxHQUFHLElBQVM7UUFDdkIsYUFBYTtRQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sS0FBSyxDQUFDLEdBQUcsSUFBUztRQUN2QixhQUFhO1FBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFTSxPQUFPO1FBQ1osT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLENBQUM7Q0FDRjtBQXhDRCx5QkF3Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTZXJ2aWNlQ29uZmlndXJhdGlvbiB9IGZyb20gJy4vU2VydmljZUNvbmYnO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIHtcbiAgcHJvdGVjdGVkIHByZWZpeDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmY6IFNlcnZpY2VDb25maWd1cmF0aW9uKSB7XG4gICAgdGhpcy5wcmVmaXggPSBgWyR7Y29uZi5zZXJ2aWNlfV06YDtcbiAgfVxuXG4gIHB1YmxpYyBsb2coLi4uYXJnczogYW55KSB7XG4gICAgLy8gcHJpbnQgd2hpdGVcbiAgICBjb25zb2xlLmxvZyh0aGlzLnByZWZpeCwgLi4uYXJncyk7XG4gIH1cblxuICBwdWJsaWMgb2soLi4uYXJnczogYW55KSB7XG4gICAgLy8gcHJpbnQgZ3JlZW5cbiAgICBjb25zb2xlLmxvZyhjaGFsay5ncmVlbih0aGlzLnByZWZpeCksIC4uLmFyZ3MpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKC4uLmFyZ3M6IGFueSkge1xuICAgIC8vIHByaW50IHJlZFxuICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZCh0aGlzLnByZWZpeCksIC4uLmFyZ3MpO1xuICB9XG5cbiAgcHVibGljIHdhcm4oLi4uYXJnczogYW55KSB7XG4gICAgLy8gcHJpbnQgeWVsbG93XG4gICAgY29uc29sZS5sb2coY2hhbGsueWVsbG93KHRoaXMucHJlZml4KSwgLi4uYXJncyk7XG4gIH1cblxuICBwdWJsaWMgbXV0ZWQoLi4uYXJnczogYW55KSB7XG4gICAgLy8gcHJpbnQgZ3JheVxuICAgIGNvbnNvbGUubG9nKGNoYWxrLmdyYXkodGhpcy5wcmVmaXgpLCAuLi5hcmdzKTtcbiAgfVxuXG4gIHB1YmxpYyBjbGVhbiguLi5hcmdzOiBhbnkpIHtcbiAgICAvLyBwcmludCBncmF5XG4gICAgY29uc29sZS5sb2coLi4uYXJncyk7XG4gIH1cblxuICBwdWJsaWMgbmV3TGluZSgpIHtcbiAgICBjb25zb2xlLmxvZygpO1xuICB9XG59XG4iXX0=