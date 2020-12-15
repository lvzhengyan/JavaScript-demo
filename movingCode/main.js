let html = document.querySelector("#html");
let style = document.querySelector("#style");
let string = `
/* 你好，我是一段会动的代码
 * 我来给大家动一下
 * 首先准备一个 div
 */
#div1 {
    border: 1px solid red;
    width: 300px;
    height: 300px;
}
/*
 * 接下来我把 div 变成一个八卦图
 * 注意看好了
 * 首先，把 div 变成一个圆
 */
#div1 {
    border-radius: 50%;
    box-shadow: 0 0 3px rgba(0,0,0,0.5);
    border: none;
}
/*
 * 八卦是由阴阳形成的
 * 一黑一白
 */
#div1 {
    background: rgb(0,0,0);
    background: linear-gradient(90deg, rgba(255,255,255,1) 50%, rgba(0,0,0,1) 50%);
}
/* 加入中间两个阴阳小圆 */
#div1::before {
    width: 150px;
    height: 150px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,1) 25%, rgba(0,0,0,1) 25%);
}
#div1::after {
    width: 150px;
    height: 150px;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,0,0,1) 25%, rgba(255,255,255,1) 25%);
}
`;
let string2 = ''
let n = 0;

let step = () => {
    setTimeout(() => {
        if (string[n] === "\n") {
            string2 += "<br>"
        } else if (string[n] === " ") {
            string2 += "&nbsp";
        } else {
            string2 += string[n];
        }

        html.innerHTML = string2;
        style.innerHTML = string.substring(0, n);
        window.scrollTo(0, 9999);
        html.scrollTo(0, 9999);
        if (n < string.length - 1) {
            n++;
            step();
        }
    }, 20);
};

step();