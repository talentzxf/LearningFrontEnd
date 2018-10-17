<template>
  <div style="width:100%;display:flex;justify-content:center">
    Shortest Path:
    Start: {{start}}
    End: {{end}}

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
</template>
<script>
  import {PathFinder} from "./lib/PathFinder"

  export default {
    name: "ShortestPath",
    data: function () {
      var width = 20
      var height = 20

      var retValue = {
        matrix: [],
        start: [0, 0],  // row, column
        end: [height - 1, width - 1],
        path: new Set()
      }

      for (var i = 0; i < height; i++) {
        retValue.matrix[i] = []
        for (var j = 0; j < width; j++) {
          retValue.matrix[i][j] = Boolean(Math.random() < 0.3);
        }
      }

      // Mark start and end points passable
      retValue.matrix[0][0] = false
      retValue.matrix[height-1][width-1] = false

      return retValue
    },
    mounted: function () {
      console.log(this.matrix)
      var pathFinder = new PathFinder(this.matrix, this.start, this.end)
      this.path = pathFinder.findShortestPath()
      console.log(this.path)
    }
  }
</script>
