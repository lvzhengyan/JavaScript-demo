// /*
//     闭包的方式实现用函数封装DOM
// */
// // const api = jQuery('#test');

// // obj.fn(p1) === obj.fn.call(obj, p1);
// // api.addClass('red')
// //     .addClass('blue') // 链式操作

// // jQuery('#test').addClass('red').addClass('blue');
// jQuery('#test')
//     .find('.child')
//     .addClass('red')
//     .addClass('yellow')
//     .back()
//     .addClass('blue')

// const x = jQuery('#test').find('.child')

// // 函数有两个参数，但是可以只使用一个
// // x.each((div, i) => {
// //     console.log(div, i);
// // })
// x.each((div) => {
//     console.log(div);
// })

// // 一般 jQuery 构造的 api 对象命名都加一个 $, 比如 $div
// jQuery('#test').parent().print()

$('<div>1</div>').appendTo(document.body)

$('#test')
    .find('.child')
    .addClass('red')
    .addClass('yellow')
    .back()
    .addClass('blue')