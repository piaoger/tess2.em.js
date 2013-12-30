
    var float32Len = Module.HEAPF32.BYTES_PER_ELEMENT;

    var Tess2Proxy = function(Module){
        return {
            newTess : Module.cwrap('newTess', 'number', ['number']),
            deleteTess : Module.cwrap('deleteTess', null, ['number']),
            addContour : Module.cwrap('addContour', null, ['number', 'number', 'number', 'number', 'number']),
            tesselate : Module.cwrap('tesselate', 'number', ['number', 'number', 'number', 'number', 'number', 'number']),
            vertexCount : Module.cwrap('getVertexCount', 'number', ['number']),
            vertices : Module.cwrap('getVertices', 'number', ['number']),
            vertexIndices : Module.cwrap('getVertexIndices', 'number', ['number']),
            elementCount : Module.cwrap('getElementCount', 'number', ['number']),
            elements : Module.cwrap('getElements', 'number', ['number'])
        };
    }(Module);

    var libtess2 = {

        newTess: function(mem) {
          return Tess2Proxy.newTess(mem || 1024 * 1024) || null;
        },

        deleteTess: function(tess) {
            Tess2Proxy.deleteTess(tess);
        },

        addContour: function(tess, vertexSize, vertices ) {

            var pointer = Module._malloc(vertices.length << 2);
            Module.HEAPF32.set(vertices, pointer >> 2);

            var stride = vertexSize * float32Len;
            var count = vertices.length / vertexSize;
            Tess2Proxy.addContour(tess, vertexSize, pointer, stride, count);

        },
        tesselate: function(tess, windingRule, elementType, polySize, vertexSize, normal) {
          // Normal is optional, set it to 0 so that normals will calculated automatically.
          var polyNormal;
          if(!normal || normal.length === 0) {
              polyNormal = 0;
          } else {
              var pointer = Module._malloc(polySize);
              Module.HEAPF32.set(polyNormal, pointer >> 2);
          }

            return Tess2Proxy.tesselate(tess, windingRule, elementType, polySize, vertexSize, polyNormal);
        },

        vertexCount: function(tess) {
          return Tess2Proxy.vertexCount(tess);
        },

       vertices: function(tess, vertexSize) {
          var pointer =Tess2Proxy.vertices(tess) >> 2; // Type Array Mode = 2
          return new Float32Array(Module.HEAPF32.subarray(pointer, pointer + (Tess2Proxy.vertexCount(tess) * vertexSize)));
        },

        vertexIndices: function(tess) {
          var pointer = Tess2Proxy.vertexIndices(tess) >> 2;
          return new Int32Array(Module.HEAP32.subarray(pointer, pointer + Tess2Proxy.vertexCount(tess)));
        },

        elementCount: function(tess) {
          return Tess2Proxy.elementCount(tess);
        },

        elements: function(tess, elementOffset) {
          var pointer = Tess2Proxy.elements(tess) >> 2 ; // Type Array Mode = 2
          return new Int32Array(Module.HEAP32.subarray(pointer, pointer + (Tess2Proxy.elementCount(tess) * elementOffset)));
        }
    };

    var Tess2 = {

        // Winding rules
        WINDING_ODD : 0,
        WINDING_NONZERO : 1,
        WINDING_POSITIVE : 2,
        WINDING_NEGATIVE : 3,
        WINDING_ABS_GEQ_TWO : 4,

        // Element Types
        POLYGONS : 0,
        CONNECTED_POLYGONS : 1,
        BOUNDARY_CONTOURS : 2,


        tesselate : function tesselate(options) {
            var contours    = options.contours,
                windingRule = options.windingRule,
                elementType = options.elementType,
                vertexSize  = options.vertexSize,
                polySize    = options.polySize,
                normal      = options.normal;

            var tesselator,
                elementOffset,
                contourCount,
                contourIndex,
                contour;

            var vertexCount,
                vertices,
                vertexIndices,
                elementCount,
                elements,

            elementOffset = polySize;
            if(elementType === this.CONNECTED_POLYGONS) {
                elementOffset *= 2;
            }

            tesselator = libtess2.newTess();
            contourCount = contours.length;
            for (contourIndex = 0; contourIndex < contourCount; contourIndex++) {
                 contour = contours[contourIndex];
                 libtess2.addContour(tesselator, vertexSize, contour);
            }

            libtess2.tesselate(tesselator, windingRule, elementType, polySize, vertexSize, normal);

            vertexCount = libtess2.vertexCount(tesselator);
            vertices = libtess2.vertices(tesselator, vertexSize);
            vertexIndices = libtess2.vertexIndices(tesselator);
            elementCount = libtess2.elementCount(tesselator);
            elements = libtess2.elements(tesselator, elementOffset);

            libtess2.deleteTess(tesselator);

            return {
                vertices: vertices,
                vertexIndices: vertexIndices,
                vertexCount: vertexCount,
                elements: elements,
                elementCount: elementCount
            };
        }
    }

    return Tess2;

   })((typeof window !== 'undefined') ? window : null, (typeof document !== 'undefined') ? document : null);
  }
};

// export common.js module to allow one js file for browser and node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = emjs_factory;
}

