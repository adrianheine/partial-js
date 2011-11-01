PATH=$PATH:~/bin expresso -I lib --cov test/* -q
# Expresso somehow disables strict mode, so we use the following as well
NODE_PATH=./lib node -e 'var tsts = require("./test/tests"),
assert=require("assert");
for (var i in tsts) {
  if (tsts.hasOwnProperty(i)) {
    tsts[i](function () {}, assert);
  }
}
'
