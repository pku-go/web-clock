var rotateNum = 0;
function set_animation() {
    // 从类hourHand中移除类playHour
    if (rotateNum % 2 == 0) {
        document.querySelector(".hourHand").classList.remove("playHour");
        document.querySelector(".minuteHand").classList.remove("playMinute");
        document.querySelector(".secondHand").classList.remove("playSecond");
        document.querySelector(".liveCircle").classList.remove("playSecond");
        // 让秒针旋转90度
        document.querySelector(".secondHand").setAttribute("style", "rotate: 90deg");
    } else {
        document.querySelector(".hourHand").classList.add("playHour");
        document.querySelector(".minuteHand").classList.add("playMinute");
        document.querySelector(".secondHand").classList.add("playSecond");
        document.querySelector(".liveCircle").classList.add("playSecond");
    }
    rotateNum++;
}
