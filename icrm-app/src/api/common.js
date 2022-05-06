export function formatNum (num) {
	num = parseFloat((num + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
	var l = num.split(".")[0].split("").reverse(),
		r = num.split(".")[1],
		t = "";
	for (var i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	var res = t.split("").reverse().join("") + "." + r;
	res = res.replace("-,","-");
	return res;
}
