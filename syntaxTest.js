let a = [[1, 2, 3], [2, 3, 5], [2, 4, 5]]
console.log(a[0].toString())
console.log("[ " + a.map(x => x.join(", ")).join(" ]\n[ ") + " ]")