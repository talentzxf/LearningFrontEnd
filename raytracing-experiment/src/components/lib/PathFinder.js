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
  constructor(matrix, start, end) {
    this.matrix = matrix
    this.start = start
    this.end = end
    this.height = matrix.length
    this.width = matrix[0].length
  }

  addIfValid(targetSet, node){
    if(node[0] < 0 || node[0] >= this.height || node[1] < 0 || node[1] >= this.width){
      return
    }

    if(this.matrix[node[0]][node[1]]){ // There's a brick in the node, can't pass
      return
    }

    targetSet.push(node)
  }

  neighbors(node) {
    // 8 connected neighbours
    var neighborCandidates = []

    this.addIfValid(neighborCandidates, [node[0] - 1, node[1]-1])
    this.addIfValid(neighborCandidates, [node[0] - 1, node[1]])
    this.addIfValid(neighborCandidates, [node[0] - 1, node[1]+1])

    this.addIfValid(neighborCandidates, [node[0], node[1] - 1])
    this.addIfValid(neighborCandidates, [node[0], node[1] + 1])

    this.addIfValid(neighborCandidates, [node[0] + 1, node[1] - 1])
    this.addIfValid(neighborCandidates, [node[0] + 1, node[1]])
    this.addIfValid(neighborCandidates, [node[0] + 1, node[1] + 1])

    return neighborCandidates
  }


  findShortestPath() {

    var nodes = new PriorityQueue(),
      distances = {},
      previous = {},
      path = new Set(),
      smallest, alt;

    for (var row = 0; row < this.height; row++) {
      for (var col = 0; col < this.width; col++) {
        if (row === this.start[0] && col === this.start[1]) {
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

      if (smallest[0] === this.end[0] && smallest[1] === this.end[1]) {
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

    return path;
  }
}


export {PathFinder}
