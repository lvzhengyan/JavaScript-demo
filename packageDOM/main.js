const div = dom.create("<div>insertNode</div>");
// console.log(div);
dom.after(test, div);

const nodes = dom.empty(window.empty)
// const nodes = dom.empty(document.querySelector("#empty"))
console.log(nodes);


dom.attr(test, 'title', 'DOM封装');
const title = dom.attr(test, "title");
console.log(title);


// dom.text(test, "新内容");

// 以对象的方式设置样式
dom.style(test, {
    border: '1px solid red',
    color: 'green'
});

// 获取元素的样式值
console.log(dom.style(test, 'border'));

// 设置元素的值
dom.style(test, 'color', "yellow")

dom.class.add(test, "red");
// dom.class.remove(test, "red");
console.log(dom.class.has(test, "red"))

const fn = () => {
    console.log(1);
}
dom.on(test, 'click', fn);

dom.off(test, 'click', fn);

const testDiv = dom.find('#test')[0];
const testDiv1 = dom.find('#empty')[0];
console.log(testDiv);


console.log(dom.next(testDiv));

console.log(dom.previous(testDiv1));

dom.each(testDiv, (n) => console.log(n));