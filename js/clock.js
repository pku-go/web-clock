// 获取指针及表盘元素
const secondHand = document.querySelector(".secondHand");
const minuteHand = document.querySelector(".minuteHand");
const hourHand = document.querySelector(".hourHand");
const liveClock = document.querySelector(".liveCircle");
const outClock = document.getElementById("outCircle");
const inClock = document.getElementById("inCircle");
const hourText = document.querySelector("#hour");
const minuteText = document.querySelector("#minute");
const secondText = document.querySelector("#second");
const label = document.querySelector("text"); // 小时状态（AM/PM）标签

let temp_clock = null; // 临时时钟对象
let leave_second = 0; // 离开时钟的秒数
let count_leave_second = null; // 离开时钟的秒数计数器

// 获取按钮元素
const clockBtn = document.getElementById("clockBtn");
const secondBtn = document.getElementById("secondBtn");
const timerBtn = document.getElementById("timerBtn");
const alarmBtn = document.getElementById("alarmBtn");
const clockBtnBack = document.querySelector("#clockBtn .bar");
const secondBtnBack = document.querySelector("#secondBtn .bar");
const timerBtnBack = document.querySelector("#timerBtn .bar");
const alarmBtnBack = document.querySelector("#alarmBtn .bar");

// 时钟相关按钮及输入
const settingBtn = document.getElementById("settingBtn"); // 设置时间按钮
const clockInput = document.getElementById("clockInput"); // 时间输入框
const clockItems = document.getElementById("clockItems"); // 时钟相关元素容器

const btn_list = [clockBtn, secondBtn, timerBtn, alarmBtn];
const btn_hover_list = [
    clockBtnBack,
    secondBtnBack,
    timerBtnBack,
    alarmBtnBack,
];

let settingBtnTimer = document.getElementById("settingBtnTimer");
let timerInput = document.getElementById("timerInput");
let timerItems = document.getElementById("timerItems");

// 时钟对象构造函数
class Clock {
    constructor(hour, minute, second) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.secondAngle = second * 6; // 记录秒针角度
        this.minuteAngle = minute * 6 + second * 0.1; // 记录分针角度
        this.hourAngle =
            hour * 30 + minute * 0.5 + second * 0.008333333333333333; // 记录时针角度
        if (hour >= 12) {
            this.state = "PM"; // 时间状态（AM/PM）
            label.innerHTML = "PM";
        } else {
            this.state = "AM";
            label.innerHTML = "AM";
        }
    }

    // 根据时间更新指针角度
    update_angle_via_time() {
        this.secondAngle = this.second * 6;
        this.minuteAngle = this.minute * 6 + this.second * 0.1;
        this.hourAngle =
            (this.hour % 12) * 30 +
            this.minute * 0.5 +
            this.second * 0.008333333333333333;
    }

    // 根据指针角度更新时间
    update_time_via_angle() {
        this.second = parseInt(this.secondAngle / 6);
        this.minute = parseInt(this.minuteAngle / 6);
        this.hour = parseInt(this.hourAngle / 30);
        if (this.state === "PM") {
            this.hour += 12;
            this.hour %= 24;
            if (this.hour === 0) {
                this.hour = 12;
            }
        }
    }

    // 设置时间
    set_time(hour, minute, second) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        if (hour >= 12) {
            this.state = "PM";
            label.innerHTML = "PM";
        } else {
            this.state = "AM";
            label.innerHTML = "AM";
        }
        this.update_angle_via_time();
    }

    // 设置指针角度
    set_angle(hourAngle, minuteAngle, secondAngle, state) {
        this.hourAngle = hourAngle;
        this.minuteAngle = minuteAngle;
        this.secondAngle = secondAngle;
        this.state = state;
        this.update_time_via_angle();
    }
}

// 获取当前时间并创建时钟对象
function get_current_clock() {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const second = new Date().getSeconds();
    return new Clock(hour, minute, second);
}

let clock = get_current_clock(); // 创建时钟对象

// 定时器函数，每秒更新时钟
function run_clock() {
    clock.second += 1;
    if (clock.second >= 60) {
        clock.second = 0;
        clock.minute += 1;
        if (clock.minute >= 60) {
            clock.minute = 0;
            clock.hour += 1;
            if (clock.hour === 12) change_state();
            if (clock.hour >= 24) {
                clock.hour = 0;
                if (clock.state === "PM") {
                    change_state();
                }
            }
        }
    }
    clock.update_angle_via_time();
    update_time_text();
}

let clock_start = null;

// 停止动画
function stop_animation() {
    hourHand.classList.remove("playHour");
    minuteHand.classList.remove("playMinute");
    secondHand.classList.remove("playSecond");
    liveClock.classList.remove("playSecond");
}

// 开始动画
function start_animation() {
    hourHand.classList.add("playHour");
    minuteHand.classList.add("playMinute");
    secondHand.classList.add("playSecond");
    liveClock.classList.add("playSecond");
}

function stop_animation_reverse() {
    // 从类hourHand中移除类playHourReverse，其余同理
    hourHand.classList.remove("playHourReverse");
    minuteHand.classList.remove("playMinuteReverse");
    secondHand.classList.remove("playSecondReverse");
    liveClock.classList.remove("playSecondReverse");
}

function start_animation_reverse() {
    // 在类hourHand中加入类playHourReverse，其余同理
    hourHand.classList.add("playHourReverse");
    minuteHand.classList.add("playMinuteReverse");
    secondHand.classList.add("playSecondReverse");
    liveClock.classList.add("playSecondReverse");
}

// 处理鼠标拖动秒针的事件
function second_mousemove(event) {
    let angle =
        (-Math.atan2(125 - event.offsetX, 125 - event.offsetY) * 180) / Math.PI;
    angle.toFixed(2);
    secondHand.setAttribute("style", "rotate: " + angle + "deg");
    clock.secondAngle = angle;
    if (angle < 0) clock.secondAngle += 360;
    clock.update_time_via_angle();
    update_time_text();
    set_new_angle();
    angle += 180;
    liveClock.setAttribute("style", "rotate: " + angle + "deg");
    outClock.onmouseup = mouseup;
    inClock.onmouseup = mouseup;
    liveClock.onmouseup = mouseup;
    secondHand.onmouseup = mouseup;
    minuteHand.onmouseup = mouseup;
    hourHand.onmouseup = mouseup;
    label.onmouseup = mouseup;
    document.onmouseup = mouseup;
}

// 处理鼠标拖动分针的事件
function minute_mousemove(event) {
    const angle =
        (-Math.atan2(125 - event.offsetX, 125 - event.offsetY) * 180) / Math.PI;
    angle.toFixed(2);
    minuteHand.setAttribute("style", "rotate: " + angle + "deg");
    clock.minuteAngle = angle;
    if (angle < 0) clock.minuteAngle += 360;
    clock.update_time_via_angle();
    update_time_text();
    set_new_angle();
    outClock.onmouseup = mouseup;
    inClock.onmouseup = mouseup;
    liveClock.onmouseup = mouseup;
    secondHand.onmouseup = mouseup;
    minuteHand.onmouseup = mouseup;
    hourHand.onmouseup = mouseup;
    label.onmouseup = mouseup;
    document.onmouseup = mouseup;
}

// 处理鼠标拖动时针的事件
function hour_mousemove(event) {
    const angle =
        (-Math.atan2(125 - event.offsetX, 125 - event.offsetY) * 180) / Math.PI;
    angle.toFixed(2);
    hourHand.setAttribute("style", "rotate: " + angle + "deg");
    clock.hourAngle = angle;
    if (angle < 0) clock.hourAngle += 360;
    clock.update_time_via_angle();
    update_time_text();
    set_new_angle();
    outClock.onmouseup = mouseup;
    inClock.onmouseup = mouseup;
    liveClock.onmouseup = mouseup;
    secondHand.onmouseup = mouseup;
    minuteHand.onmouseup = mouseup;
    hourHand.onmouseup = mouseup;
    label.onmouseup = mouseup;
    document.onmouseup = mouseup;
}

// 根据当前角度设置指针角度
function set_new_angle() {
    secondHand.setAttribute("style", "rotate: " + clock.secondAngle + "deg");
    minuteHand.setAttribute("style", "rotate: " + clock.minuteAngle + "deg");
    hourHand.setAttribute("style", "rotate: " + clock.hourAngle + "deg");
    const liveAngle = (Number(clock.secondAngle) + 180) % 360;
    liveClock.setAttribute("style", "rotate: " + liveAngle + "deg");
}

// 更新时间文本显示
function update_time_text() {
    hourText.innerHTML = clock.hour < 10 ? "0" + clock.hour : clock.hour;
    minuteText.innerHTML =
        clock.minute < 10 ? "0" + clock.minute : clock.minute;
    secondText.innerHTML =
        clock.second < 10 ? "0" + clock.second : clock.second;
}

// 处理鼠标松开事件
function mouseup(event) {
    outClock.onmousemove = null;
    inClock.onmousemove = null;
    liveClock.onmousemove = null;
    label.onmousemove = null;
    secondHand.onmousemove = null;
    minuteHand.onmousemove = null;
    hourHand.onmousemove = null;

    clock.update_angle_via_time();
    set_new_angle();
    event.stopPropagation();
    outClock.onmouseup = null;
    inClock.onmouseup = null;
    liveClock.onmouseup = null;
    label.onmouseup = null;
    document.onmouseup = null;
}

// 切换时间状态（AM/PM）
function change_state() {
    if (clock.state === "AM") {
        clock.state = "PM";
        label.innerHTML = "PM";
        if (clock.hour < 12) clock.hour += 12;
        clock.hour %= 24;
    } else {
        clock.state = "AM";
        label.innerHTML = "AM";
        if (clock.hour >= 12) clock.hour -= 12;
    }
    update_time_text();
}

// 开始时钟
function start() {
    if (clock_start === "pause" || clock_start === null) {
        clock_start = setInterval(run_clock, 1000);
    }
    setTimeout(start_animation, 300);
}

// 暂停时钟
function pause() {
    clock.update_angle_via_time();
    set_new_angle();
    clearInterval(clock_start);
    clock_start = "pause";
    stop_animation();
}

// 记住当前时间
function memory_clock_time() {
    if (temp_clock === null || temp_clock === undefined)
        temp_clock = new Clock(clock.hour, clock.minute, clock.second);
    if (count_leave_second === null) {
        count_leave_second = setInterval(() => {
            leave_second++;
        }, 1000);
    }
}

// 切换回记住的时间
function back_to_memory_time() {
    if (temp_clock === null) {
        clock = get_current_clock();
    } else if (temp_clock === undefined) {
        // do nothing
    } else {
        clock = temp_clock;
        clearInterval(count_leave_second);
        count_leave_second = null;
        let hour = parseInt(leave_second / 3600);
        let minute = parseInt((leave_second % 3600) / 60);
        let second = parseInt((leave_second % 3600) % 60);
        clock.second += second;
        if (clock.second >= 60) {
            clock.minute += parseInt(clock.second / 60);
            clock.second %= 60;
        }
        clock.minute += minute;
        if (clock.minute >= 60) {
            clock.hour += parseInt(clock.minute / 60);
            clock.minute %= 60;
        }
        clock.hour += hour;
        if (clock.hour >= 24) {
            clock.hour %= 24;
        }
        leave_second = 0;
        temp_clock = undefined;
    }
    pause();
    clock.update_angle_via_time();
    set_new_angle();
    update_time_text();
    start();
}

// 切换选中按钮
function choseBtn(btn) {
    let i = 0;
    for (i = 0; i < btn_list.length; i++) {
        if (btn_list[i].id === btn.id) {
            btn_hover_list[i].style.opacity = 1;
            btn.style.boxShadow = "0 0 20px #0271cc";
        } else {
            btn_hover_list[i].style.opacity = 0;
            btn_list[i].style.boxShadow = "";
        }
    }
    switch (btn.id) {
        case "clockBtn":
            back_to_memory_time();
            show_clock_items();
            clear_timer_items();
            break;
        case "secondBtn":
            // to do
            clear_clock_items();
            clear_timer_items();
            memory_clock_time();

            break;
        case "timerBtn":
            clear_clock_items();
            show_timer_items();
            memory_clock_time();
            break;
        case "alarmBtn":
            clear_clock_items();
            clear_timer_items();
            break;
    }
}

// 处理允许拖放时针事件
function allowDrop() {
    secondHand.onmousedown = function () {
        minuteHand.setAttribute(
            "style",
            "rotate: " + clock.minuteAngle + "deg"
        );
        hourHand.setAttribute("style", "rotate: " + clock.hourAngle + "deg");
        outClock.onmousemove = second_mousemove;
        inClock.onmousemove = second_mousemove;
        liveClock.onmousemove = second_mousemove;
        label.onmousemove = second_mousemove;
    };
    minuteHand.onmousedown = function () {
        hourHand.setAttribute("style", "rotate: " + clock.hourAngle + "deg");
        secondHand.setAttribute(
            "style",
            "rotate: " + clock.secondAngle + "deg"
        );
        liveClock.setAttribute(
            "style",
            "rotate: " + (clock.secondAngle + 180) + "deg"
        );
        outClock.onmousemove = minute_mousemove;
        inClock.onmousemove = minute_mousemove;
        liveClock.onmousemove = minute_mousemove;
        label.onmousemove = minute_mousemove;
    };
    hourHand.onmousedown = function () {
        secondHand.setAttribute(
            "style",
            "rotate: " + clock.secondAngle + "deg"
        );
        minuteHand.setAttribute(
            "style",
            "rotate: " + clock.minuteAngle + "deg"
        );
        liveClock.setAttribute(
            "style",
            "rotate: " + (clock.secondAngle + 180) + "deg"
        );
        outClock.onmousemove = hour_mousemove;
        inClock.onmousemove = hour_mousemove;
        liveClock.onmousemove = hour_mousemove;
        label.onmousemove = hour_mousemove;
    };
    label.onclick = change_state;
}

// 处理禁止拖放时针事件
function disallowDrop() {
    secondHand.onmousedown = null;
    minuteHand.onmousedown = null;
    hourHand.onmousedown = null;
    label.onclick = null;
}

// 通过输入设置时间
function set_time_via_input() {
    let hour, minute, second;
    if (settingBtn.innerText === "设置时间") {
        settingBtn.innerText = "确认";
        clockInput.setAttribute("style", "display: block;");
        settingBtn.setAttribute("style", "margin-top: 5px;");
        pause();
        allowDrop();
    } else {
        hour = clockInput.value.split(":")[0];
        minute = clockInput.value.split(":")[1];
        second = clockInput.value.split(":")[2];
        settingBtn.innerText = "设置时间";
        clockInput.setAttribute("style", "display: none;");
        settingBtn.setAttribute("style", "margin-top: 35px;");
        // 检查输入合法性
        if (
            hour === undefined ||
            minute === undefined ||
            second === undefined
        ) {
            start();
            disallowDrop();
            return;
        }

        hour = parseInt(hour);
        minute = parseInt(minute);
        second = parseInt(second);
        clock.set_time(hour, minute, second);
        set_new_angle();
        update_time_text();
        disallowDrop();
        clockInput.value = "--:--:--";
        start();
    }
}

// 清除时钟相关元素
function clear_clock_items() {
    clockItems.setAttribute("style", "display: none;");
}

// 显示时钟相关元素
function show_clock_items() {
    clockItems.setAttribute("style", "display: block;");
}

var timer_start = null;
let targetTime = 0;
let countdownInterval = 0;

function start_timer() {
    if (timer_start === null) {
        let targetHour = timerInput.value.split(":")[0];
        let targetMinute = timerInput.value.split(":")[1];
        let targetSecond = timerInput.value.split(":")[2];

        if(targetHour == undefined || targetMinute == undefined || targetSecond == undefined) {
            alert("未设置时间！");
            return;
        }

        targetHour = parseInt(targetHour);
        targetMinute = parseInt(targetMinute);
        targetSecond = parseInt(targetSecond);
        targetTime = targetHour * 3600 + targetMinute * 60 + targetSecond;

        if (targetTime === 0) {
            alert("设定时间必须大于0");
            return;
        }

        pause();
        clock.set_time(targetHour, targetMinute, targetSecond);
        set_new_angle();
        update_time_text();

        timer_start = "pause";
    }

    if (timer_start === "pause") {
        timer_start = "start";
        start_animation_reverse();
        countdownInterval = setInterval(function () {
            if (targetTime > 1) {
                targetTime--;
                let remainingHour = Math.floor(targetTime / 3600);
                let remainingMinute = Math.floor((targetTime % 3600) / 60);
                let remainingSecond = targetTime % 60;
                clock.set_time(remainingHour, remainingMinute, remainingSecond);
                update_time_text();
            } else {
                clearInterval(countdownInterval);
                clock.set_time(0, 0, 0);
                clock.update_angle_via_time();
                set_new_angle();
                update_time_text();
                stop_animation_reverse();
                timerInput.value = "--:--:--";
                timer_start = null;
                var timerAudio = document.getElementById("timerAudio");
                timerAudio.play();

                setTimeout(function () {
                    timerAudio.pause();
                }, 5000);
                timerAudio.currentTime = 0;
                return;
            }
        }, 1000);
        return;
    }

    if (timer_start === "start") {
        clearInterval(countdownInterval);
        stop_animation_reverse();
        timer_start = "pause";
        clock.update_angle_via_time();
        set_new_angle();
        return;
    }

}

function reset_timer() {
    clearInterval(countdownInterval);
    stop_animation_reverse();
    clock.set_time(0, 0, 0);
    clock.update_angle_via_time();
    set_new_angle();
    update_time_text();
    timer_start = null;
}

function clear_timer_items() {
    timerItems.setAttribute("style", "display: none;");
}

function show_timer_items() {
    timerItems.setAttribute("style", "display: block;");
}

// 主函数
function main() {
    choseBtn(clockBtn); // 默认选中时钟按钮
    settingBtn.onclick = set_time_via_input; // 设置时间按钮点击事件
    // 初始化指针角度
    clock.update_angle_via_time();
    set_new_angle();
    update_time_text();

    start(); // 启动时钟
}

main();
