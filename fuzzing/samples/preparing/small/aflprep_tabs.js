(function() {
  var cubes, list, math, num, number, opposite, race, square;
  number = 42;
  opposite = true;
  if (opposite) {
    number = -42;
  }
  square = function(x) {
    return x * x;
  };
  list = [1, 2, 3, 4, 5];
  math = {
    root: Math.sqrt,
    square: square,
    cube: function(x) {
      return x * square(x);
    }
  };
  race = function(winner, ...runners) {
    return print(winner, runners);
  };
  if (true) {
    alert("I knew it!");
  }
  cubes = (function() {
    var i, len, results;
    results = [];
    for (i = 0, len = list.length; i < len; i++) {
      num = list[i];
      results.push(math.cube(num));
    }
    return results;
  })();
}).call(this);
