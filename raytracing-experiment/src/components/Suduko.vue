<template>
  <div style="width:100%;display:flex;justify-content:center">
    <table id="sudukoTable" style="border: 1px solid red;">
      <tr v-for="(row,row_id) in rows">
        <td v-for="(cell, cell_id) in row">
          <input v-model.number='rows[row_id][cell_id]' :id="row_id+'_'+cell_id">
        </td>
      </tr>
    </table>

    <div>
      <button v-on:click="solve"> Solve Suduko</button>
    </div>

    KnownElements: {{knownElementCount}}
    UnknownElements: {{width*height-knownElementCount}}
    Complexity: {{complexity}}

  </div>
</template>

<script>
  export default {
    name: "Suduko",
    data: function () {
      var retData = {
        width: 9,
        height: 9,
        raw_rows: [],
        knownElementCount: 0,
        complexity: 1,
        rows: [
          [null, null, 5, 3, null, null, null, null, null],
          [8, null, null, null, null, null, null, 2, null],
          [null, 7, null, null, 1, null, 5, null, null],
          [4, null, null, null, null, 5, 3, null, null],
          [null, 1, null, null, 7, null, null, null, 6],
          [null, null, 3, 2, null, null, null, 8, null],
          [null, 6, null, 5, null, null, null, null, 9],
          [null, null, 4, null, null, null, null, 3, null],
          [null, null, null, null, null, 9, 7, null, null],
        ]
      }

      // for (var i = 0; i < 9; i++) {
      //   var newLine = []
      //   for (var j = 0; j < 9; j++) {
      //     newLine.push(null)
      //   }
      //   retData.rows.push(newLine)
      // }

      return retData
    },
    watch: {
      rows: function (rows) {
        console.log("Row changed")
      }
    },
    methods: {
      updateStats: function () {
        this.knownElementCount = 0;
        for (var i = 0; i < 9; i++) {
          for (var j = 0; j < 9; j++) {
            if (this.rows[i][j] != null) {
              if (typeof(this.rows[i][j]) === "number" ||
                this.rows[i][j].length === 1) {
                this.knownElementCount++;
              }
            }
          }
        }

        this.complexity = 1;
        for (var i = 0; i < 9; i++) {
          for (var j = 0; j < 9; j++) {
            if (this.rows[i][j] != null) {
              if (typeof(this.rows[i][j]) != "number") {
                this.complexity += this.rows[i][j].length
              }
            } else {
              this.complexity += 9
            }
          }
        }
      },

      deleteItemFromRow: function (rowNumber, colNumber, inMatrix, itemValue) {
        var somethingChanged = false;
        for (var j = 0; j < this.width; j++) {
          if (j != colNumber) {
            if (typeof(inMatrix[rowNumber][j]) != "number" && inMatrix[rowNumber][j].includes(itemValue)) {
              somethingChanged = true;
              _.remove(inMatrix[rowNumber][j], item => item == itemValue)
            }
          }
        }
        return somethingChanged
      },
      deleteItemFromColumn: function (rowNumber, colNumber, inMatrix, itemValue) {
        var somethingChanged = false;
        for (var i = 0; i < this.height; i++) {
          if (i != rowNumber) {
            if (typeof(inMatrix[i][colNumber]) != "number" && inMatrix[i][colNumber].includes(itemValue)) {
              somethingChanged = true;
              _.remove(inMatrix[i][colNumber], item => item == itemValue)
            }
          }
        }
        return somethingChanged
      },
      // Every 3*3 block
      deleteFromBlock: function (rowNumber, colNumber, inMatrix, itemValue) {
        var somethingChanged = false;

        var rowCount = 3;
        var colCount = 3;

        var startRow = Math.floor(rowNumber / rowCount) * rowCount
        var startCol = Math.floor(colNumber / colCount) * colCount

        for (var i = startRow; i < startRow + rowCount; i++) {
          for (var j = startCol; j < startCol + colCount; j++) {
            if (!(i === rowNumber && j === colNumber)) {
              if (typeof(inMatrix[i][j]) != "number" && inMatrix[i][j].includes(itemValue)) {
                somethingChanged = true;
                _.remove(inMatrix[i][j], item => item == itemValue)
              }
            }
          }
        }
        return somethingChanged
      },
      checkOnlyInRow(rowNumber, colNumber, inMatrix, itemValue) {
        for (var j = 0; j < this.width; j++) {
          if (j != colNumber) {
            if (typeof(inMatrix[rowNumber][j]) != "number" && inMatrix[rowNumber][j].includes(itemValue)) {
              return false;
            }
          }
        }
        return true
      },
      checkOnlyInColumn: function (rowNumber, colNumber, inMatrix, itemValue) {
        for (var i = 0; i < this.height; i++) {
          if (i != rowNumber) {
            if (typeof(inMatrix[i][colNumber]) != "number" && inMatrix[i][colNumber].includes(itemValue)) {
              return false;
            }
          }
        }
        return true
      },
      // Every 3*3 block
      checkOnlyInBlock: function (rowNumber, colNumber, inMatrix, itemValue) {
        var rowCount = 3;
        var colCount = 3;

        var startRow = Math.floor(rowNumber / rowCount) * rowCount
        var startCol = Math.floor(colNumber / colCount) * colCount

        for (var i = startRow; i < startRow + rowCount; i++) {
          for (var j = startCol; j < startCol + colCount; j++) {
            if (!(i === rowNumber && j === colNumber)) {
              if (typeof(inMatrix[i][j]) != "number" && inMatrix[i][j].includes(itemValue)) {
                return false;
              }
            }
          }
        }
        return true
      },

      trySolve: function (candidateMatrix) {

        var someThingChanged = false;

        do {
          // Eliminate all obvious elements
          do {
            someThingChanged = false;

            for (var i = 0; i < 9; i++) {
              for (var j = 0; j < 9; j++) {
                if (typeof(candidateMatrix[i][j]) === "number") {
                  candidateMatrix[i][j] = [candidateMatrix[i][j]]
                }

                if (candidateMatrix[i][j].length === 1) {
                  // Delete same items in the row
                  if (this.deleteItemFromRow(i, j, candidateMatrix, candidateMatrix[i][j][0])) {
                    someThingChanged = true
                  }

                  if (this.deleteItemFromColumn(i, j, candidateMatrix, candidateMatrix[i][j][0])) {
                    someThingChanged = true
                  }

                  if (this.deleteFromBlock(i, j, candidateMatrix, candidateMatrix[i][j][0])) {
                    someThingChanged = true
                  }
                }
              }
            }
          } while (someThingChanged)

          // Check if some element is the only one in the row/column/block
          for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
              if (typeof(candidateMatrix[i][j]) === "number") {
                candidateMatrix[i][j] = [candidateMatrix[i][j]]
              }

              if (candidateMatrix[i][j].length > 1) {
                for (var candidateIdx = 0; candidateIdx < candidateMatrix[i][j].length; candidateIdx++) {
                  var candidate = candidateMatrix[i][j][candidateIdx];
                  // Check if this is the only element in the row
                  if (this.checkOnlyInRow(i, j, candidateMatrix, candidate)
                    || this.checkOnlyInColumn(i, j, candidateMatrix, candidate)
                    || this.checkOnlyInBlock(i, j, candidateMatrix, candidate)) {
                    candidateMatrix[i][j] = [candidate]
                    someThingChanged = true
                  }
                }
              }
            }
          }
        } while (someThingChanged)
      },
      solve: function () {
        console.log("Solve clicked")
        this.raw_rows = _.clone(this.rows)

        console.log(this.raw_rows)

        for (var i = 0; i < 9; i++) {
          for (var j = 0; j < 9; j++) {
            if (this.rows[i][j] === null) {
              this.rows[i][j] = [1, 2, 3, 4, 5, 6, 7, 8, 9]
            }
          }
        }

        this.trySolve(this.rows)

        this.updateStats()
        this.$forceUpdate()

      }
    }
  }
</script>

<style scoped>
  input {
    width: 60px;
    height: 60px;
  }
</style>
