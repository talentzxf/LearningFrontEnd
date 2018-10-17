function PriorityQueue() {
  this._nodes = [];

  this.enqueue = function (priority, key) {
    this._nodes.push({key: key, priority: priority});
    this.sort();
  };
  this.dequeue = function () {
    return this._nodes.shift().key;
  };
  this.sort = function () {
    this._nodes.sort(function (a, b) {
      return a.priority - b.priority;
    });
  };
  this.isEmpty = function () {
    return !this._nodes.length;
  };
}

class PathFinder {
  constructor(matrix) {
    this.matrix = matrix

    this.height = matrix.length
    this.width = matrix[0].length

    this.all_bricks = []

    this.distCache = []

    for (var row = 0; row < this.height; row++) {
      for (var col = 0; col < this.width; col++) {

        if (this.matrix[row][col]) { // There's a brick in the node, can't pass
          this.all_bricks.push([row, col])
        }
      }
    }
  }

  addIfValid(targetSet, node) {
    if (node[0] < 0 || node[0] >= this.height || node[1] < 0 || node[1] >= this.width) {
      return
    }

    if (this.matrix[node[0]][node[1]]) { // There's a brick in the node, can't pass
      return
    }

    targetSet.push(node)
  }

  neighbors(node) {
    // 8 connected neighbours
    var neighborCandidates = []

    this.addIfValid(neighborCandidates, [node[0] - 1, node[1] - 1])
    this.addIfValid(neighborCandidates, [node[0] - 1, node[1]])
    this.addIfValid(neighborCandidates, [node[0] - 1, node[1] + 1])

    this.addIfValid(neighborCandidates, [node[0], node[1] - 1])
    this.addIfValid(neighborCandidates, [node[0], node[1] + 1])

    this.addIfValid(neighborCandidates, [node[0] + 1, node[1] - 1])
    this.addIfValid(neighborCandidates, [node[0] + 1, node[1]])
    this.addIfValid(neighborCandidates, [node[0] + 1, node[1] + 1])

    return neighborCandidates
  }

  distFunc(p1, p2) {
    return Math.max(Math.abs(p1[0] - p2[0]), Math.abs(p1[1] - p2[1]))
  }

  findShortestPath(start, end) {

    var nodes = new PriorityQueue(),
      distances = {},
      previous = {},
      path = new Set(),
      smallest, alt,
      resultDistance = Number.POSITIVE_INFINITY

    for (var row = 0; row < this.height; row++) {
      for (var col = 0; col < this.width; col++) {
        if (row === start[0] && col === start[1]) {
          distances[[row, col]] = 0;
          nodes.enqueue(0, [row, col]);
        }
        else {
          distances[[row, col]] = Number.POSITIVE_INFINITY;
          nodes.enqueue(Number.POSITIVE_INFINITY, [row, col]);
        }

        previous[[row, col]] = null;
      }
    }

    while (!nodes.isEmpty()) {
      smallest = nodes.dequeue();

      var manhatenDist = this.distFunc(smallest, end)
      if (manhatenDist <= 1) {
        resultDistance = distances[smallest] + manhatenDist;
        path = new Set();

        while (previous[smallest]) {
          path.add(smallest[0] + "_" + smallest[1]);
          smallest = previous[smallest];
        }

        break;
      }

      if (!smallest || distances[smallest] === Infinity) {
        continue;
      }

      var neighbors = this.neighbors(smallest)
      for (var neighborIdx in neighbors) {
        var neighbor = neighbors[neighborIdx]
        alt = distances[smallest] + 1;

        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = smallest;

          nodes.enqueue(alt, neighbor);
        }
      }
    }

    return {path: path, minDist: resultDistance}
  }

  getEdgeName(s, e) {
    return s[0] + "_" + s[1] + "->" + e[0] + "_" + e[1]
  }

  getFromCache(s, e) {
    var nodeName = this.getEdgeName(s, e)
    if (!this.distCache[nodeName]) {
      var dist = this.findShortestPath(s, e).minDist
      this.distCache[nodeName] = dist
    }
    return this.distCache[nodeName]
  }

  findShortestPathWithHammer(start, end, k) {
    var minDist = {}
    minDist[this.getEdgeName(start, start)] = 0

    // Find first layer bricks
    var curLayer = []
    for (var brickIdx in this.all_bricks) {
      var brick = this.all_bricks[brickIdx]
      var brickDist = this.getFromCache(start, brick)
      if (brickDist < Number.POSITIVE_INFINITY) {
        minDist[this.getEdgeName(start, brick)] = brickDist
        curLayer.push(brick)
      }
    }

    // At most layer traverse (k-2) times
    for (var i = 0; i < k - 2; i++) {
      var nextLayer = []
      for (var brick in curLayer) {
        for (var nextBrickIdx in this.all_bricks) {
          var nextBrick = this.all_bricks[nextBrickIdx]
          if (this.getFromCache(brick, nextBrick) < Number.POSITIVE_INFINITY) {
            if (!minDist[this.getEdgeName(start, nextBrick)]) {
              minDist[this.getEdgeName(start, nextBrick)] = Number.POSITIVE_INFINITY
            }

            minDist[this.getEdgeName(start, nextBrick)] =
              Math.min(
                minDist[this.getEdgeName(start, nextBrick)],
                this.getFromCache(start, brick) + this.getFromCache(brick, otherBrick)
              )

            nextLayer.push(nextBrick)
          }
        }
      }

      curLayer = nextLayer
    }

    // From the last layer to destination
    var resultMinDist = this.getFromCache(start, end)
    for (var brickIdx in curLayer) {
      var brick = curLayer[brickIdx]
      resultMinDist = Math.min(resultMinDist, minDist[this.getEdgeName(start, brick)] + this.getFromCache(brick, end))
    }

    return resultMinDist
  }
}


export {PathFinder}
