export function formatNum(num) {
  num = parseFloat((num + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
  var l = num.split(".")[0].split("").reverse(),
    r = num.split(".")[1],
    t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  var res = t.split("").reverse().join("") + "." + r;
  res = res.replace("-,", "-");
  return res;
}
export function formatNums(num) {
  num = parseFloat((num + "").replace(/[^\d\.-]/g, "")) + "";
  var l = num.split(".")[0].split("").reverse(),
    // r = num.split(".")[1],
    t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  var res = t.split("").reverse().join("");
  res = res.replace("-,", "-");
  return res;
}
export function numFliter(num, tip, fixed) {
  if (num == undefined) {
    return '0'
  }
  let value = fixed ? (Number(value)).toFixed(2) : Number(value)
  let n = value.toString().split('.')
  let z = /\d{1,3}(?=(\d{3})+$)/g
  let b = Number(value) > 0 && tip ? '+' : ''
  if (value.toString().indexOf('.') >= 0) {
    return `${b}${n[0].replace(z, '$&,')}.${n[1]}`
  } else {
    return `${b}${value.toString().replace(z, '$&,')}`
  }
}
