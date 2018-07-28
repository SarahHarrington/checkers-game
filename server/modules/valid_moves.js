const validMoves = [
  {
    f: [],
    r: [],
    fj: [],
    rj: []
  },
  { //1
    f: [5],
    r: [],
    fj: [10],
    rj: []
  },
  { //2
    f: [5, 6],
    r: [],
    fj: [9, 11],
    rj: []
  },
  { //3
    f: [6, 7],
    r: [],
    fj: [10, 12],
    rj: []
  },
  { //4
    f: [7, 8],
    r: [],
    fj: [11],
    rj: []
  },
  { //5
    f: [9, 10],
    r: [1, 2],
    fj: [14],
    rj: []
  },
  { //6
    f: [10, 11],
    r: [2, 3],
    fj: [13, 15],
    rj: []
  },
  { //7
    f: [11, 12],
    r: [3, 4],
    fj: [14, 16],
    rj: []
  },
  { //8
    f: [12],
    r: [4],
    fj: [15],
    rj: []
  },
  { //9
    f: [13],
    r: [5],
    fj: [18],
    rj: [2]
  },
  { //10
    f: [13, 14],
    r: [5, 6],
    fj: [17, 19],
    rj: [1, 3]
  },
  { //11
    f: [14, 15],
    r: [6, 7],
    fj: [18, 20],
    rj: [2, 4]
  },
  { //12
    f: [15, 16],
    r: [7, 8],
    fj: [19],
    rj: [3]
  },

  { //13
    f: [17, 18],
    r: [9, 10],
    fj: [22],
    rj: [6]
  },
  { //14
    f: [18, 19],
    r: [10, 11],
    fj: [21, 23],
    rj: [5, 7]
  },
  { //15
    f: [19, 20],
    r: [11, 12],
    fj: [22, 24],
    rj: [6, 8]
  },
  { //16
    f: [20],
    r: [12],
    fj: [23],
    rj: [7]
  },
  { //17
    f: [21],
    r: [13],
    fj: [26],
    rj: [10]
  },
  { //18
    f: [21, 22],
    r: [13, 14],
    fj: [25, 27],
    rj: [9, 11]
  },
  { //19
    f: [22, 23],
    r: [14, 15],
    fj: [26,28],
    rj: [10,12]
  },
  { //20
    f: [23, 24],
    r: [15, 16],
    fj: [27],
    rj: [11]
  },
  { //21
    f: [25, 26],
    r: [17, 18],
    fj: [30],
    rj: [14]
  },
  { //22
    f: [26, 27],
    r: [18, 19],
    fj: [29, 31],
    rj: [13, 15]
  },
  { //23
    f: [27, 28],
    r: [19, 20],
    fj: [30, 32],
    rj: [14, 16]
  },
  { //24
    f: [28],
    r: [20],
    fj: [31],
    rj: [15]
  },
  { //25
    f: [29],
    r: [21],
    fj: [],
    rj: [18]
  },
  { //26
    f: [29, 30],
    r: [21, 22],
    fj: [],
    rj: [17, 19]
  },
  { //27
    f: [30, 31],
    r: [22, 23],
    fj: [],
    rj: [18, 20]
  },
  { //28
    f: [31, 32],
    r: [23, 24],
    fj: [],
    rj: [19]
  },
  { //29
    f: [],
    r: [25, 26],
    fj: [],
    rj: [22]
  },
  { //30
    f: [],
    r: [26, 27],
    fj: [],
    rj: [21, 23]
  },
  { //31
    f: [],
    r: [27, 28],
    fj: [],
    rj: [22, 24]
  },
  { //32
    f: [],
    r: [28],
    fj: [],
    rj: [23]
  },
]

module.exports = validMoves;