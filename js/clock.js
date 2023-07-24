class Clock {
    constructor(hour, minute, second) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.secondAngle = second * 6;
        this.minuteAngle = minute * 6 + second * 0.1;
        this.hourAngle =
            hour * 30 + minute * 0.5 + second * 0.008333333333333333;
        if (hour > 12) {
            this.state = "PM";
        } else {
            this.state = "AM";
        }
    }
    update_angle_via_time() {
        this.secondAngle = this.second * 6;
        this.minuteAngle = this.minute * 6 + this.second * 0.1;
        this.hourAngle =
            (this.hour % 12) * 30 +
            this.minute * 0.5 +
            this.second * 0.008333333333333333;
    }
    update_time_via_angle() {
        this.second = Math.round(this.secondAngle / 6);
        // 计算分钟数
        this.minute = Math.round(this.minuteAngle / 6);
        // 计算小时数
        this.hour = Math.round(this.hourAngle / 30);
        if (this.state === "PM") {
            this.hour += 12;
        }
    }
    set_time(hour, minute, second) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.update_angle_via_time();
    }
    set_angle(hourAngle, minuteAngle, secondAngle, state) {
        this.hourAngle = hourAngle;
        this.minuteAngle = minuteAngle;
        this.secondAngle = secondAngle;
        this.state = state;
        this.update_time_via_angle();
    }
}

let clock = new Clock(0, 0, 0);
// 获取指针及表盘元素
let secondHand = document.querySelector(".secondHand");
let minuteHand = document.querySelector(".minuteHand");
let hourHand = document.querySelector(".hourHand");
let liveClock = document.querySelector(".liveCircle");
let outClock = document.getElementById("outCircle");
let inClock = document.getElementById("inCircle");

function stop_animation() {
    // 从类hourHand中移除类playHour，其余同理
    hourHand.classList.remove("playHour");
    minuteHand.classList.remove("playMinute");
    secondHand.classList.remove("playSecond");
    liveClock.classList.remove("playSecond");
}

function start_animation() {
    // 在类hourHand中加入类playHour，其余同理
    hourHand.classList.add("playHour");
    minuteHand.classList.add("playMinute");
    secondHand.classList.add("playSecond");
    liveClock.classList.add("playSecond");
}

function second_mousemove(event) {
    // 计算当前鼠标相对元素的位置与元素中心点向上的夹角（角度制）
    let angle =
        (-Math.atan2(125 - event.offsetX, 125 - event.offsetY) * 180) / Math.PI;
    angle.toFixed(2);
    secondHand.setAttribute("style", "rotate: " + angle + "deg");
    angle += 180;
    liveClock.setAttribute("style", "rotate: " + angle + "deg");
    outClock.onmouseup = mouseup;
    inClock.onmouseup = mouseup;
    liveClock.onmouseup = mouseup;
    secondHand.onmouseup = mouseup;
}

function minute_mousemove(event) {
    // 计算当前鼠标相对元素的位置与元素中心点向上的夹角（角度制）
    let angle =
        (-Math.atan2(125 - event.offsetX, 125 - event.offsetY) * 180) / Math.PI;
    angle.toFixed(2);
    minuteHand.setAttribute("style", "rotate: " + angle + "deg");
    outClock.onmouseup = mouseup;
    inClock.onmouseup = mouseup;
    liveClock.onmouseup = mouseup;
    minuteHand.onmouseup = mouseup;
}

function hour_mousemove(event) {
    // 计算当前鼠标相对元素的位置与元素中心点向上的夹角（角度制）
    let angle =
        (-Math.atan2(125 - event.offsetX, 125 - event.offsetY) * 180) / Math.PI;
    angle.toFixed(2);
    hourHand.setAttribute("style", "rotate: " + angle + "deg");
    outClock.onmouseup = mouseup;
    inClock.onmouseup = mouseup;
    liveClock.onmouseup = mouseup;
    hourHand.onmouseup = mouseup;
}

function mouseup() {
    // 移除鼠标移动事件监听
    console.log("mouseup");
    outClock.onmousemove = null;
    inClock.onmousemove = null;
    liveClock.onmousemove = null;
    start_animation();
}

function main() {
    secondHand.onmousedown = function () {
        stop_animation();
        // 控制台输出相对于元素左上角的坐标
        // 监听鼠标移动事件
        outClock.onmousemove = second_mousemove;
        inClock.onmousemove = second_mousemove;
        liveClock.onmousemove = second_mousemove;
    };
    minuteHand.onmousedown = function () {
        stop_animation();
        // 控制台输出相对于元素左上角的坐标
        // 监听鼠标移动事件
        outClock.onmousemove = minute_mousemove;
        inClock.onmousemove = minute_mousemove;
        liveClock.onmousemove = minute_mousemove;
    };
    hourHand.onmousedown = function () {
        // 控制台输出相对于元素左上角的坐标
        // 监听鼠标移动事件
        stop_animation();
        outClock.onmousemove = hour_mousemove;
        inClock.onmousemove = hour_mousemove;
        liveClock.onmousemove = hour_mousemove;
    };
    start_animation();
    setInterval(function () {
        console.log(secondHand.style.rotate);
    }, 1000);
    // 每秒更新秒数加1
    setInterval(
        () => {
            clock.second += 1;
            // 如果秒数大于等于60，秒数归零，分钟数加1
            if (clock.second >= 60) {
                clock.second = 0;
                clock.minute += 1;
                // 如果分钟数大于等于60，分钟数归零，小时数加1
                if (clock.minute >= 60) {
                    clock.minute = 0;
                    clock.hour += 1;
                    // 如果小时数大于等于24，小时数归零
                    if (clock.hour >= 24) {
                        clock.hour = 0;
                    }
                }
            }
            // 更新指针角度
            clock.update_angle_via_time();
            console.log(clock.hour, clock.minute, clock.second);
            console.log(clock.hourAngle, clock.minuteAngle, clock.secondAngle);
        },
        // 每秒更新一次
        1000
    );
}

main();
