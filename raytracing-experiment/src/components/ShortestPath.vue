<template>
  <div style="width:100%">
    <div>
      Shortest Path:
      Start: {{start}}
      End: {{end}}
      MinDistance: {{distance}}
    </div>

    <div>
      <table id="sudukoTable" style="border: 1px solid red;">
        <tr v-for="(row,row_id) in matrix">
          <td v-for="(column, column_id) in matrix[row_id]">
            <template v-if="row_id==start[0] && column_id == start[1]">
              <span style="color:green; font-weight:bold">Start</span>
            </template>
            <template v-else-if="row_id==end[0] && column_id == end[1]">
              <span style="color:red; font-weight:bold">End</span>
            </template>
            <template v-else>
              <template v-if="path != null && path.has(row_id+'_'+column_id)">
                <span style="color:red"> {{ matrix[row_id][column_id] == true? '1':'0' }} </span>
              </template>
              <template v-else>
                <span> {{ matrix[row_id][column_id] == true? '1':'0' }} </span>
              </template>
            </template>
          </td>
        </tr>
      </table>
    </div>

  </div>
</template>
<script>
  import {PathFinder} from "./lib/PathFinder"

  export default {
    name: "ShortestPath",
    data: function () {
      var width = 5
      var height = 5

      var retValue = {
        matrix: [],
        start: [0, 0],  // row, column
        end: [height - 1, width - 1],
        path: new Set(),
        distance: Number.POSITIVE_INFINITY
      }

      for (var i = 0; i < height; i++) {
        retValue.matrix[i] = []
        for (var j = 0; j < width; j++) {
          retValue.matrix[i][j] = Boolean(Math.random() < 0.0);
        }
      }

      retValue.matrix[0][1] = true
      retValue.matrix[1][1] = true
      retValue.matrix[1][0] = true

      // Mark start and end points passable
      retValue.matrix[0][0] = false
      retValue.matrix[height - 1][width - 1] = false

      return retValue
    },
    mounted: function () {
      console.log(this.matrix)
      var pathFinder = new PathFinder(this.matrix);
      console.log(pathFinder);
      var pathResult = pathFinder.findShortestPath(this.start, this.end);
      this.path = pathResult.path
      this.distance = pathResult.minDist
      console.log(this.path);

      console.log(pathFinder.findShortestPathWithHammer(this.start, this.end, 2))
    }
  }
</script>
