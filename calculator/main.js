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
                    <button class="col ac" value="ac">AC</button>
                    <button class="col sign" value="+/-">+/-</button>
                    <button class="col percent" value="%">%</button>
                    <button class="col operator" value="/">÷</button>
                </div>
                <div class="row">
                    <button class="col" value="7">7</button>
                    <button class="col" value="8">8</button>
                    <button class="col" value="9">9</button>
                    <button class="col operator" value="*">×</button>
                </div>
                <div class="row">
                    <button class="col" value="4">4</button>
                    <button class="col" value="5">5</button>
                    <button class="col" value="6">6</button>
                    <button class="col operator" value="-">-</button>
                </div>
                <div class="row">
                    <button class="col" value="1">1</button>
                    <button class="col" value="2">2</button>
                    <button class="col" value="3">3</button>
                    <button class="col operator" value="+">+</button>
                </div>
                <div class="row">
                    <button class="col zero" value="0">0</button>
                    <button class="col" value=".">.</button>
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
		this.btn = document.querySelectorAll("button");
		this.KeyWrapper = document.querySelector("#key-wrapper");
		this.init();
	};

	Calculator.prototype = {
		init: function () {
			this.show.value = "0";
			this.bindEvent();
		},

		bindEvent: function () {
			// 利用冒泡机制为所有button添加点击事件
			this.KeyWrapper.addEventListener("click", e => {
				this.clickEvent(e);
			});
		},

		/**
		 * 处理点击事件
		 * @param {Object} e
		 */
		clickEvent: function (e) {
			const value = e.target.value;
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
								this.show.value = this.formatShow((this.show.value + value).replace(/,/g, ""));
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
				// 直接输入符号键的情况
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
				this.show.value = this.model.calculateArr[this.model.calculateArr.length - 2] || "0";
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
			if (value === Infinity || value === -Infinity) {
				this.show.value = "错误";
			} else {
				// 处理结果加上小数点总位数 10 位的情况
				let maxLen = 9;
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
						value = this.toNonExponential(parseFloat(temp));
						if (value.length > maxLen) {
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
					value = this.formatShow(value.toString());
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
		formatShow: function (showValue) {
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

		/**
		 * 科学计数法转数字
		 * @param {Number} num
		 */
		toNonExponential: function (num) {
			var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
			return num.toFixed(Math.max(0, (m[1] || "").length - m[2]));
		},
	};

	new Calculator({
		id: "calculator",
	});
})();
