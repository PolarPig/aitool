//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
	switch(arguments.length) {
		case 1:
			return parseInt(Math.random() * minNum + 1, 10);
			break;
		case 2:
			return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
			break;
		default:
			return 0;
			break;
	}
}

function randomdatas() {
	let dflag = randomNum(1, 4)
	if(dflag == 2) {
		datas = datas1
	}
	if(dflag == 3) {
		datas = datas2
	}
	if(dflag == 4) {
		datas = datas3
	}
	console.log(dflag)
	return datas
}

/***************************************
 * 生成从minNum到maxNum的随机数。
 * 如果指定decimalNum个数，则生成指定小数位数的随机数
 * 如果不指定任何参数，则生成0-1之间的随机数。
 *
 * @minNum：[数据类型是Integer]生成的随机数的最小值（minNum和maxNum可以调换位置）
 * @maxNum：[数据类型是Integer]生成的随机数的最大值
 * @decimalNum：[数据类型是Integer]如果生成的是带有小数的随机数，则指定随机数的小数点后的位数
 *
 ****************************************/
function randomNum(maxNum, minNum, decimalNum) {
	var max = 0,
		min = 0;
	minNum <= maxNum ? (min = minNum, max = maxNum) : (min = maxNum, max = minNum);
	switch(arguments.length) {
		case 1:
			return Math.floor(Math.random() * (max + 1));
			break;
		case 2:
			return Math.floor(Math.random() * (max - min + 1) + min);
			break;
		case 3:
			return(Math.random() * (max - min) + min).toFixed(decimalNum);
			break;
		default:
			return Math.random();
			break;
	}
}