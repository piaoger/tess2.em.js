     var Tess2 = require("./lib/libtess2.js").instantiate();

      var contours = [
          [0,0,  0,100,  100,100,  100,0]
      ];

      var options = {
              contours : contours,
              windingRule : Tess2.WINDING_ODD,
              elementType : Tess2.ELEMENT_POLYGONS,
              vertexSize  : 2,
              polySize : 3,
              normal : null
      };

      function render(x, y, vertices, elements) {
         console.log("rendering");

        console.log( " x, y = " + x + " : " + y);


        for (var i = 0, n = elements.length  ; i < n; i += 3) {
          var j1 = elements[i] << 1;
          var j2 = elements[i + 1] << 1;
          var j3 = elements[i + 2] << 1;

          console.log("vertices[" + j1 + "][" + (j1 + 1) + "] = " + vertices[j1] + " : " + vertices[j1 + 1]);
          console.log("vertices[" + j2 + "][" + (j2 + 1) + "] = " + vertices[j2] + " : " + vertices[j2 + 1]);
          console.log("vertices[" + j3 + "][" + (j3 + 1) + "] = " + vertices[j3] + " : " + vertices[j3 + 1]);
     //     console.log("vertices[" + j1 + "][" + (j1 + 1) + "] = " + vertices[j1] + " : " + vertices[j1 + 1]);
        }

      }


      function tesselate(x, y,options) {

        var result = Tess2.tesselate(options);
        console.log(result);
        render(x, y, result.vertices, result.elements);

      }

      tesselate(10, 20, options);