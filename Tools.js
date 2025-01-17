(function() {
/**
 * JavaScript的工具库,方便使用
 * author   a_boy
 * created  2018-4-7 18:06
 * update   2018-8-19 17:14:00 
 */
	var Tools = {
		/**
		 * 日期时间换成Unix时间戳
		 * data  	时间戳    必填
		 * @param {[type]} data [description]
		 */
		DateToTimestamp: function(data) {
			return Date.parse(data) / 1000;
		},
		/**
		 * Unix时间戳转成时间
		 * @param {[type]} format     格式: 	 			必填
		 * 如: YY/MM/DD hh:mm:ss   
		 *     YY年MM月DD日 hh时mm分ss秒
		 *     Y-M-D h:m:s
		 * @param {[type]} timestamp '时间戳: 1525147931'	可填(默认当前时间)
		 */
		TimestampToDate: function(format, timestamp) {
			var date = timestamp ? new Date(parseInt(timestamp) * 1000) : new Date(+new Date());
			var	year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate(),
				hour = date.getHours(),
				minute = date.getMinutes(),
	            second = date.getSeconds();

			var str = format.replace(/[YyMmDdHhSs]+/g, function(w) {
				if(w == 'yy' || w == 'YY' || w == 'y' || w == 'Y') {
					return year.toString().substring(2);

				} else if(w == 'yyyy' || w == 'YYYY') {
					return year;

				} else if(w == 'MM') {
					return month >= 10 ? month : '0' + month; 

				} else if(w == 'M') {
					return month;

				} else if(w == 'DD' || w == 'dd') {
					return day >= 10 ? day : '0' + day;

				} else if(w == 'D' || w == 'd') {
					return day;

				} else if(w == 'HH' || w == 'hh') {
					return hour >= 10 ? hour : '0' + hour;

				} else if(w == 'H' || w == 'h') {
					return hour;

				} else if(w == 'mm') {
					return minute >= 10 ? minute : '0' + minute;

				} else if(w == 'm') {
					return minute;

				} else if(w == 'ss' || w == 's') {
					return second >= 10 ? second : '0' + second;
				}
			});
			return str;
		},

		/**
		 * 精确到两位小数
		 * @param {[type]} money 数值         必填
		 * @param {[type]} num   精确多少位   可填(默认两位)
		 */
		ToCurrency: function(money, num = 2) {
			return parseFloat(money).toFixed(num);
		},

		/**
		 * 获取url地址参数
		 * clearLocalStorage param    获取某一个参数    可填(默认返回所有参数)
		 * @return {[type]} [description]
		 */
		getUrlParmas: function(param) {
			var url = window.location.href;
			if(url.indexOf('?') > 0) {
				var arrParams = url.split('?')[1].split('&'),
					json = {};
				for(var i = 0, len = arrParams.length; i < len; i++) {
					var arr = arrParams[i].split('=');
					json[arr[0]] = arr[1];
				}
				if(param) {
					return json[param];
				} else {
					return json;
				}
			} else {
				return null;
			}
			
		},
		/**
		 * 设置cookies
		 * @param {[type]} name    cookie名称    必填
		 * @param {[type]} value   cookie值		 必填
		 * @param {[type]} expires 缓存多少秒	 可填(默认session 关闭浏览器会自动的清除)
		 * @param {[type]} options 对象          可填(默认设置根目录)
		 */
		setCookies: function(name, value, expires, options = {}) {
			var cookieText = name + '=' + value;
			options.path = options.path || '/';
			if(expires) {
				var timestamp = (new Date().getTime()) / 1000 + expires;
				var dateObj = new Date(timestamp * 1000);
				cookieText += '; expires=' + dateObj.toGMTString();
			}

			if(options.path) {
				cookieText += '; path=' + options.path;
			}
			if(options.domain) {
				cookieText += '; domain=' + options.domain;
			}
			document.cookie = cookieText;
		},
		/**
		 * 获取cookie的值
		 * @param  {[type]} name cookie值
		 * @return {[type]}      [description]
		 */
		getCookie: function(name) {
			var value = document.cookie,
				cookieName = name + '=';
				cookieStart = value.indexOf(cookieName),
				cookieValue = null;
			if(cookieStart > -1) {
				var cookieEnd = value.indexOf(';', cookieStart);
				cookieEnd = cookieEnd > -1 ? cookieEnd : value.length;
				cookieValue = value.substring(cookieStart + cookieName.length, cookieEnd)
			}
			return cookieValue;
		},
		/**
		 * 清除cookies
		 * 
		 * @return {[type]} [description]
		 */
		clearCookies: function(name,options = {}) {
			this.setCookies(name, '', -1, options);
		},
		/**
		 * 获取本地缓存
		 * @param {[type]} key   	键         必填
		 * @return {[type]} [description]
		 */
		getLocalStorage: function(key) {
			var json = JSON.parse(localStorage.getItem(key));
			if(json) {
				if(json.expires) {
					var timestamp = parseInt(+new Date() / 1000);
					if(timestamp > json.expires) {
						this.clearLocalStorage(key)
						return null;
					}
				}
				return json[key];
			} else {
				return null;
			}
		},
		/**
		 * 设置本地缓存(可设置过期时间)
		 * @param {[type]} key   	键           必填
		 * @param {[type]} value 	值		     必填
		 * @param {[type]} expires  保存多少秒   可填(秒)
		 */
		setLocalStorage: function(key, value, expires) {
			var json = {}
			json[key] = value;
			if(expires) {
				var timestamp = parseInt(+new Date() / 1000) + expires;
				json['expires'] = timestamp;  
			}

			localStorage.setItem(key, JSON.stringify(json));
		},
		/**
		 * 清除本地缓存
		 * @param {[type]} key 	键		可填(默认清除所有)
		 * @return {[type]} [description]
		 */
		clearLocalStorage: function(key) {
			if(key) {
				localStorage.removeItem(key);
			} else {
				localStorage.clear();
			}
		},
		/**
		 * 秒倒计时     
		 * @param  {[type]} time 时间戳的差(秒)    必填
		 * @return {[type]}      [description]
			示例代码: 
			var time = 24 * 60 * 60 + 4;
		    setInterval(function() {
		    	time--;
		    	console.log(Tools.secondCountDown(time));
		    }, 1000);

		 */
		secondCountDown(time) {
			var d = parseInt(time / 86400), // 24 * 60 * 60
				h = parseInt(time / 3600 % 24),
				m = parseInt(time / 60 % 60),
				s = parseInt(time % 60),
				str = d + '天' + h + '时' + m + '分' + s + '秒';
			return str;
		},
		/**
		 * 毫秒倒计时(为了性能,所以每100毫秒执行一次)
		 * @param  {[type]} time 时间戳的差    必填
		 * @return {[type]}      [description]
		 * 示例代码:
		    var millisecondCountDown = document.getElementById('millisecondCountDown');
		    //秒数乘余100
		    var time = 10 * 100;  
			setInterval(function() {
				//每100毫秒减去10
				time -= 10;  

				if(time <= 0) {
					time = 10 * 100;
				}

				millisecondCountDown.innerHTML = Tools.millisecondCountDown(time)
			//每100毫秒执行一次
			}, 100)              
		 */
		millisecondCountDown(time) {
			var s = Math.ceil(time / 100);     // 计算秒数
			var mh = parseInt(time / 10 % 10); // 计算毫秒数
			return s + '秒' + mh + '毫秒';
		},
		/**
		 * 手机号码验证
		 * @param  {[type]} phoneNumber 手机号码字符串   必填
		 * @return true | false             
		 */
		phoneNumberFormat: function(phoneNumber) {
			var re = /^1[34578][0-9]{9}$/
			// var re = /^1(3|4|5|7|8)[0-9]{9}$/;
			return re.test(phoneNumber);
		},
		/**
		 * 邮箱验证
		 * @param  {[type]} email 邮箱字符串     必填
		 * @return true | false      
		 */
		emailFormat: function(email) {
			var re = /^[A-z0-9_.-]+\w+@\w+\.[A-z]{2,5}$/;
			// var re = /^[a-zA-Z0-9-_.]\w+(-|\.)?\w+@\w+\.\w{2,5}$/;
			return re.test(email);
		},
		/**
		 * 深度拷贝
		 * @param  {[type]} object 需要拷贝的对象或者数组   必填
		 * @return {[type]}        对象 
		 * 
		 */
		deepCopy: function(object) {
			var newObj = object.constructor == Array ? [] : {};
			if(typeof object != 'object') {
				return;
			} else if(window.JSON) {
				newObj = JSON.parse(JSON.stringify(object));
			} else {
				for(var i in object) {
					newObj[i] = typeof object[i] == 'object' ? this.deepCopy(object[i]) : object[i];
				}
			}
			return newObj;
		},
		/**
		 * 隐藏字符串
		 * @param  {[type]} targetStr 字符串
		 * @param  {[type]} start     开始隐藏的位置,不包括start
		 * @param  {[type]} howmany   隐藏多少个字符串
		 * @param  {String} symbol    隐藏字符的符号                   可填
		 * @return {[type]}           [description]
		 */
		hideSomething: function(targetStr, start, howmany, symbol = '*') {
			let str = '',
				end = start + howmany;
			for(let i = 0; i < howmany; i++) {
				str += symbol;
			}
			return targetStr.substring(0, start) + str + targetStr.substring(end);
		},
		/**
		 * 数组深度排序
		 * @param  {[type]} arr         数组列表
		 * @param  {[type]} sortName    一维数组排序字段
		 * @param  {String} twoSortName 二维数组排序字段
		 * @return {[type]}             [description]
		 */
		listSort: function(arr, sortName, twoSortName = 'sort') {
			let tem = null,
				len = arr.length;
			for(let i = 0; i < len; i++) {
				if(arr[i][twoSortName] && arr[i][twoSortName].length) {
					listSort(arr[i][twoSortName]);
				}
				for(let j = 0; j < len - 1; j++) {
					if(arr[j][sortName] < arr[j + 1][sortName]) {
						tem = arr[j];
						arr[j] = arr[j + 1];
						arr[j + 1] = tem;
					}
				}
			}
			return arr;
		},
		/**
		 * 判断是否为pc端
		 * @return {Boolean} [description]
		 */
		isPc: function() {
			var userAgentInfo = navigator.userAgent,
				agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'],
				flag = true;
			for(var i = 0, len = agents.length; i < len; i++) {
				if(userAgentInfo.indexOf(agents[i]) > -1) {
					flag = false;
					break;
				}
			}
			return flag;
		},
		/**
		 * 函数节流
		 * @return {[type]} [description]

		  var fn = Tools.throttle(function(res) {
				console.log(this)
			}, 1000)

			window.onresize = function() {
				fn.call({name: 'wzh'}, 1);
			}

		 */
		throttle: function(fn, interval) {
			var _self = fn,
				timer,
				firstTime = true,
				_interval = interval || 500;


				return function() {
					var agr = arguments,
						me = this;
					if(firstTime) {
						_self.apply(me, agr);
						firstTime = false;
					}
					if(timer) {
						return false;
					}
					timer = setTimeout(function() {
						clearTimeout(timer)
						timer = null;
						_self.apply(me, agr);
					}, _interval)
				}
		},
		/**
		* 函数防抖

		  var fn = Tools.debounce(function(res) {
				console.log(this, res)
			}, 1000)

			window.onresize = function() {
				fn.call({name: 'wzh'}, 1);
			}
		*/
		debounce: function(fn, wait) {
			var timer = null;
		  return function () {
	      var context = this
	      var args = arguments
	      if (timer) {
	          clearTimeout(timer);
	          timer = null;
	      }
	      timer = setTimeout(function () {
	          fn.apply(context, args)
	      }, wait)
		  }
		},
		/**
		 * 货币化数字
		 * @param {*} num        数字或者字符串数字
		 * @param {*} decimal    保留多少位小数字 默认两位   
		 */
		monetizationNumber: function(num, decimal = 2) {
			if(!num) return num;

			var strArr = Number(num).toFixed(decimal).split('.'),
					str = strArr[0].split('').reverse().join(''),
					arr;
					
			arr = str.match(/(\d{3})|(\d+)/g);
			return arr.join(',').split('').reverse().join('') + ((strArr.length > 1 && decimal > 0) ? '.' + strArr[1] : '' );
		}


	};
	window.Tools = Tools;
})();