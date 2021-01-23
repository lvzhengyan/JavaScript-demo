!(function () {
	var View = function (element) {
		this.element = document.querySelector("#" + element.id);
		this.render();
	};

	View.prototype = {
		render: function () {
			var showWrapper = document.createElement("div");
			var KeyWrapper = document.createElement("div");
			showWrapper.id = "show-wrapper";
			KeyWrapper.id = "key-wrapper";

			showWrapper.innerHTML = `
                <input class="show" type="text" value="0" disabled>
            `;

			KeyWrapper.innerHTML = `
                <div class="row">
                    <button class="col function-btn" value="ac">AC</button>
                    <button class="col function-btn" value="+/-">+/-</button>
                    <button class="col function-btn" value="%">%</button>
                    <button class="col operator" value="/">÷</button>
                </div>
                <div class="row">
                    <button class="col number-btn" value="7">7</button>
                    <button class="col number-btn" value="8">8</button>
                    <button class="col number-btn" value="9">9</button>
                    <button class="col operator" value="*">×</button>
                </div>
                <div class="row">
                    <button class="col number-btn" value="4">4</button>
                    <button class="col number-btn" value="5">5</button>
                    <button class="col number-btn" value="6">6</button>
                    <button class="col operator" value="-">-</button>
                </div>
                <div class="row">
                    <button class="col number-btn" value="1">1</button>
                    <button class="col number-btn" value="2">2</button>
                    <button class="col number-btn" value="3">3</button>
                    <button class="col operator" value="+">+</button>
                </div>
                <div class="row">
                    <button class="col number-btn zero" value="0">0</button>
                    <button class="col number-btn" value=".">.</button>
                    <button class="col equal" value="=">=</button>
                </div>
            `;
			this.element.appendChild(showWrapper);
			this.element.appendChild(KeyWrapper);
		},
	};

	var Model = function () {
		this.res = "0";
		this.calculateArr = [];
		this.equalsSign = false;
		this.symbolFlag = false;
	};

	var Calculator = function (element) {
		this.view = new View(element);
		this.model = new Model();
		this.show = document.querySelector(".show");
		this.KeyWrapper = document.querySelector("#key-wrapper");
		this.operator = "";
		this.init();
	};

	Calculator.prototype = {
		init: function () {
			this.show.value = "0";
			this.bindEvent();
		},

		bindEvent: function () {
			let width = document.documentElement.clientWidth;
			let start = width <= 1024 ? "touchstart" : "mousedown";
			let end = width <= 1024 ? "touchend" : "mouseup";

			// 利用冒泡机制为所有button添加点击事件
			this.KeyWrapper.addEventListener("click", e => {
				this.clickEvent(e);
			});

			// 添加点击效果
			this.KeyWrapper.addEventListener(start, e => {
				this.checkedBtn(e);
			});
			this.KeyWrapper.addEventListener(end, e => {
				this.releaseBtn(e);
			});
		},

		/**
		 * 处理点击事件
		 * @param {Object} e
		 */
		clickEvent: function (e) {
			const value = e.target.value;
			if (this.show.value === "错误") {
				this.show.value = "0";
				this.calculateArr = [];
			}
			// 点击的是数字或小数点按钮
			if (!isNaN(value) || value === ".") {
				this.model.symbolFlag = true;

				// 判断是否是加减乘除和等号后直接输入的数字
				if (this.model.equalsSign) {
					this.show.value = "0";
					this.model.equalsSign = false;
				}

				if (this.show.value === "0") {
					if (value === ".") {
						this.show.value = "0" + value;
					} else {
						this.show.value = value;
					}
				} else if (this.show.value === "-0") {
					if (this.show.value.indexOf(".") !== -1) {
						if (value !== ".") {
							this.show.value += value;
						}
					} else {
						if (value === ".") {
							this.show.value = "-0" + value;
						} else {
							this.show.value += value;
							this.show.value = "-" + value;
						}
					}
				} else {
					if (this.show.value.replace(/[,.]/g, "").length < 9) {
						if (this.show.value.indexOf(".") !== -1) {
							if (value !== ".") {
								this.show.value += value;
								this.adjustFontSize();
							}
						} else {
							if (value === ".") {
								this.show.value += value;
							} else {
								this.show.value = this.formatToThousandths((this.show.value + value).replace(/,/g, ""));
								this.adjustFontSize(this.show.value);
							}
						}
					}
				}
			} else {
				switch (value) {
					case "+":
						this.saveSymbol(value);
						break;
					case "-":
						this.saveSymbol(value);
						break;
					case "*":
						this.saveSymbol(value);
						break;
					case "/":
						this.saveSymbol(value);
						break;
					case "+/-":
						if (this.model.equalsSign) {
							this.show.value = "0";
							this.model.equalsSign = false;
						}
						if (this.show.value[0] === "-") {
							this.show.value = this.show.value.slice(1);
						} else {
							this.show.value = "-" + this.show.value;
						}
						this.adjustFontSize();
						break;
					case "%":
						let percentValue = parseFloat(this.show.value.replace(/,/g, "")) / 100;
						this.formatResult(percentValue);
						this.adjustFontSize();
						this.model.equalsSign = true;
						break;
					case "=":
						this.model.calculateArr.push(this.show.value.replace(/,/g, ""));
						this.doCalculate(this.model.calculateArr);
						this.model.calculateArr = [];
						this.model.equalsSign = true;
						break;
					case "ac":
						this.show.value = "0";
						this.model.calculateArr = [];
						this.adjustFontSize();
						break;
				}
			}
		},

		/**
		 * 处理输入为加减乘除计算符的情况
		 * @param {String} value
		 */
		saveSymbol: function (value) {
			// 符号键按了多次，以最后那一次为准
			if (!this.model.symbolFlag) {
				// 直接输入符号键进行计算的情况
				if (this.model.calculateArr.length === 0) {
					this.model.calculateArr = this.model.calculateArr.concat(["0", value]);
				}
				this.model.calculateArr[this.model.calculateArr.length - 1] = value;
			} else {
				this.model.calculateArr.push(this.show.value.replace(/,/g, ""));
				this.model.calculateArr.push(value);
			}
			// 预计算
			if (this.model.calculateArr.length >= 3) {
				let calculation = this.model.calculateArr.slice(0, this.model.calculateArr.length - 1);
				this.doCalculate(calculation);
			} else {
				this.show.value = (this.model.calculateArr[this.model.calculateArr.length - 2] && this.formatToThousandths(this.model.calculateArr[this.model.calculateArr.length - 2])) || "0";
			}
			this.model.equalsSign = true;
			this.model.symbolFlag = false;
		},

		/**
		 *
		 * 计算表达式
		 * @param {Array} calculateArr
		 */
		doCalculate: function (calculateArr) {
			// 处理减去负数的情况
			let calculation = calculateArr.join("").replace(/--/g, "+");
			// 计算表达式
			this.model.res = eval(calculation);
			this.formatResult(this.model.res);
		},

		/**
		 * 格式化计算结果
		 * @param {Number} value
		 */
		formatResult: function (value) {
			if (value === Infinity || value === -Infinity || isNaN(value)) {
				this.show.value = "错误";
			} else {
				let maxLen = 9;
				// 消除小数点影响显示字符长度的情况
				if (value.toString().indexOf(".") !== -1) {
					++maxLen;
				}
				if (value.toString().length > maxLen) {
					let temp = value;
					let tempLen;
					temp = this.formatNumber(value.toExponential(6));
					tempLen = temp.length;
					if (temp.indexOf(".") === -1) {
						tempLen = tempLen;
					} else {
						tempLen = tempLen - 1;
					}
					if (tempLen <= maxLen) {
						value = parseFloat(temp);
						if (value.toString().length > maxLen) {
							value = parseFloat(value).toExponential(6);
						}
					} else if (tempLen === maxLen + 1) {
						value = value.toExponential(5);
					} else if (tempLen === maxLen + 2) {
						value = value.toExponential(4);
					} else {
						value = "错误";
					}
				}
				if (value.toString().indexOf("e") === -1) {
					value = this.formatToThousandths(value.toString());
				} else {
					value = this.formatNumber(value.toString());
				}
				this.show.value = value;
				this.adjustFontSize();
			}
		},

		/**
		 * 格式化科学计数法
		 * @param {String} str
		 */
		formatNumber: function (str) {
			return parseFloat(str.split("e")[0]).toString() + "e" + str.split("e")[1].replace("+", "");
		},

		/**
		 * 千分位格式化
		 * @param {String} showValue
		 */
		formatToThousandths: function (showValue) {
			let integral;
			let fractional;
			let integralFormat;
			if (showValue.indexOf(".") === -1) {
				integral = showValue;
				fractional = "";
			} else {
				integral = showValue.split(".")[0];
				fractional = "." + showValue.split(".")[1];
			}
			integralFormat = integral.replace(/\d{4,}/g, match => {
				for (let i = match.length - 3; i > 0; i -= 3) {
					match = match.slice(0, i) + "," + match.slice(i);
				}
				return match;
			});
			return integralFormat + fractional;
		},

		/**
		 * 根据显示框字符长度
		 * 调整字体大小
		 */
		adjustFontSize: function () {
			let inputLen = this.show.value.replace(/[,.]/g, "").length;
			let classShow = this.show.className.slice(0, 4);
			if (inputLen <= 6) {
				this.show.className = classShow;
			} else if (inputLen === 7) {
				this.show.className = classShow + " active7";
			} else if (inputLen === 8) {
				this.show.className = classShow + " active8";
			} else if (inputLen === 9) {
				this.show.className = classShow + " active9";
			}
		},

		checkedBtn: function (e) {
			let checkedOperatorBtn = Array.from(document.querySelectorAll("button"));
			checkedOperatorBtn = checkedOperatorBtn.forEach(node => {
				if (node.className.indexOf("checkedOperator") !== -1) {
					node.className = node.className.replace(" checkedOperator", "");
				}
			});
			if (e.target.className.match(/function-btn/)) {
				e.target.className += " checkedFunction";
			} else if (e.target.className.match(/number-btn/)) {
				e.target.className += " checkedNumber";
			} else if (e.target.className.match(/operator/)) {
				e.target.className += " checkedOperator";
			} else {
				e.target.className += " checkedEqual";
			}
		},

		releaseBtn: function (e) {
			e.target.className = e.target.className.replace(/ checkedFunction| checkedNumber| checkedEqual/, "");
		},
	};

	// 初始 calculator 对象实例
	new Calculator({
		id: "calculator",
	});
})();
