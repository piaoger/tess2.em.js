
// Note:
// For maximum-speed code, see "Optimizing Code" on the Emscripten wiki:
//    https://github.com/kripken/emscripten/wiki/Optimizing-Code
// Note: Some Emscripten settings may limit the speed of the generated code.

// emscripten assigns 16MB of memory to the compiled program by default, increasing memory during runtime is expensive performance-wise.
// https://groups.google.com/forum/#!topic/emscripten-discuss/o3DFB0bDoCk

// More settings of emscripten:
//  https://github.com/kripken/emscripten/blob/master/src/settings.js


// Note: For maximum-speed code, see "Optimizing Code" on the Emscripten wiki, https://github.com/kripken/emscripten/wiki/Optimizing-Code
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var emjs_factory = {
  instantiate: function (requested_total_memory) {
   return (function (window, document) {
    var Module = {TOTAL_MEMORY: (requested_total_memory || 32*1024*1024)};
    var emjs_raw = Module;

  // Add Emscripten script here

// Note: For maximum-speed code, see "Optimizing Code" on the Emscripten wiki, https://github.com/kripken/emscripten/wiki/Optimizing-Code
// Note: Some Emscripten settings may limit the speed of the generated code.
// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');
// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  Module['printErr'] = function printErr(x) {
    process['stderr'].write(x + '\n');
  };
  var nodeFS = require('fs');
  var nodePath = require('path');
  Module['read'] = function read(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };
  Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };
  Module['load'] = function load(f) {
    globalEval(read(f));
  };
  Module['arguments'] = process['argv'].slice(2);
  module['exports'] = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm
  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available (jsc?)' };
  }
  Module['readBinary'] = function readBinary(f) {
    return read(f, 'binary');
  };
  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  this['Module'] = Module;
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };
  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }
  if (typeof console !== 'undefined') {
    Module['print'] = function print(x) {
      console.log(x);
    };
    Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }
  if (ENVIRONMENT_IS_WEB) {
    this['Module'] = Module;
  } else {
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}
function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***
// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];
// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];
// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// === Auto-generated preamble library stuff ===
//========================================
// Runtime code shared with compiler
//========================================
var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      return '(((' +target + ')+' + (quantum-1) + ')&' + -quantum + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?{ ?[^}]* ?}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (type == 'i64' || type == 'double' || vararg) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else if (field[0] === '<') {
        // vector type
        size = alignSize = Types.types[field].flatSize; // fully aligned
      } else if (field[0] === 'i') {
        // illegal integer field, that could not be legalized because it is an internal structure field
        // it is ok to have such fields, if we just use them as markers of field size and nothing more complex
        size = alignSize = parseInt(field.substr(1))/8;
        assert(size % 1 === 0, 'cannot handle non-byte-size field ' + field);
      } else {
        assert(false, 'invalid type for calculateStructAlignment');
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    if (type.name_[0] === '[') {
      // arrays have 2 elements, so we get the proper difference. then we scale here. that way we avoid
      // allocating a potentially huge array for [999999 x i8] etc.
      type.flatSize = parseInt(type.name_.substr(1))*type.flatSize/2;
    }
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2*(1 + i);
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  getAsmConst: function (code, numArgs) {
    // code is a constant string on the heap, so we can cache these
    if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
    var func = Runtime.asmConstCache[code];
    if (func) return func;
    var args = [];
    for (var i = 0; i < numArgs; i++) {
      args.push(String.fromCharCode(36) + i); // $0, $1 etc
    }
    return Runtime.asmConstCache[code] = eval('(function(' + args.join(',') + '){ ' + Pointer_stringify(code) + ' })'); // new Function does not allow upvars in node
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function dynCall_wrapper() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;
      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }
      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }
      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function processJSString(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+7)&-8); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = (((STATICTOP)+7)&-8); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = (((DYNAMICTOP)+7)&-8); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+((low>>>0)))+((+((high>>>0)))*4294967296.0)) : ((+((low>>>0)))+((+((high|0)))*4294967296.0))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}
//========================================
// Runtime essentials
//========================================
var __THREW__ = 0; // Used in checking for thrown exceptions.
var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;
var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}
var globalScope = this;
// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;
// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}
// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      value = intArrayFromString(value);
      type = 'array';
    }
    if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}
// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;
// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;
// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;
var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;
// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === 'string' ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }
  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }
  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }
  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];
    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later
    setValue(ret+i, curr, type);
    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
Module['allocate'] = allocate;
function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;
  var ret = '';
  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;
// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;
  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;
// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0
}
Module['stringToUTF16'] = stringToUTF16;
// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;
  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;
// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0
}
Module['stringToUTF32'] = stringToUTF32;
function demangle(func) {
  try {
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
    }
    var i = 3;
    // params, etc.
    var basicTypes = {
      'v': 'void',
      'b': 'bool',
      'c': 'char',
      's': 'short',
      'i': 'int',
      'l': 'long',
      'f': 'float',
      'd': 'double',
      'w': 'wchar_t',
      'a': 'signed char',
      'h': 'unsigned char',
      't': 'unsigned short',
      'j': 'unsigned int',
      'm': 'unsigned long',
      'x': 'long long',
      'y': 'unsigned long long',
      'z': '...'
    };
    function dump(x) {
      //return;
      if (x) Module.print(x);
      Module.print(func);
      var pre = '';
      for (var a = 0; a < i; a++) pre += ' ';
      Module.print (pre + '^');
    }
    var subs = [];
    function parseNested() {
      i++;
      if (func[i] === 'K') i++; // ignore const
      var parts = [];
      while (func[i] !== 'E') {
        if (func[i] === 'S') { // substitution
          i++;
          var next = func.indexOf('_', i);
          var num = func.substring(i, next) || 0;
          parts.push(subs[num] || '?');
          i = next+1;
          continue;
        }
        if (func[i] === 'C') { // constructor
          parts.push(parts[parts.length-1]);
          i += 2;
          continue;
        }
        var size = parseInt(func.substr(i));
        var pre = size.toString().length;
        if (!size || !pre) { i--; break; } // counter i++ below us
        var curr = func.substr(i + pre, size);
        parts.push(curr);
        subs.push(curr);
        i += pre + size;
      }
      i++; // skip E
      return parts;
    }
    var first = true;
    function parse(rawList, limit, allowVoid) { // main parser
      limit = limit || Infinity;
      var ret = '', list = [];
      function flushList() {
        return '(' + list.join(', ') + ')';
      }
      var name;
      if (func[i] === 'N') {
        // namespaced N-E
        name = parseNested().join('::');
        limit--;
        if (limit === 0) return rawList ? [name] : name;
      } else {
        // not namespaced
        if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
        var size = parseInt(func.substr(i));
        if (size) {
          var pre = size.toString().length;
          name = func.substr(i + pre, size);
          i += pre + size;
        }
      }
      first = false;
      if (func[i] === 'I') {
        i++;
        var iList = parse(true);
        var iRet = parse(true, 1, true);
        ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
      } else {
        ret = name;
      }
      paramLoop: while (i < func.length && limit-- > 0) {
        //dump('paramLoop');
        var c = func[i++];
        if (c in basicTypes) {
          list.push(basicTypes[c]);
        } else {
          switch (c) {
            case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
            case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
            case 'L': { // literal
              i++; // skip basic type
              var end = func.indexOf('E', i);
              var size = end - i;
              list.push(func.substr(i, size));
              i += size + 2; // size + 'EE'
              break;
            }
            case 'A': { // array
              var size = parseInt(func.substr(i));
              i += size.toString().length;
              if (func[i] !== '_') throw '?';
              i++; // skip _
              list.push(parse(true, 1, true)[0] + ' [' + size + ']');
              break;
            }
            case 'E': break paramLoop;
            default: ret += '?' + c; break paramLoop;
          }
        }
      }
      if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
      return rawList ? list : ret + flushList();
    }
    return parse();
  } catch(e) {
    return func;
  }
}
function demangleAll(text) {
  return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
}
function stackTrace() {
  var stack = new Error().stack;
  return stack ? demangleAll(stack) : '(no stack trace available)'; // Stack trace is not available at least on IE10 and Safari 6.
}
// Memory management
var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return (x+4095)&-4096;
}
var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk
function enlargeMemory() {
  abort('Cannot enlarge memory arrays in asm.js. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', or (2) set Module.TOTAL_MEMORY before the program runs.');
}
var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;
// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'Cannot fallback to non-typed array case: Code is too specialized');
var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);
// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');
Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;
function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited
var runtimeInitialized = false;
function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}
function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;
function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;
function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;
function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;
// Tools
// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;
function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;
// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;
function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;
function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i)
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;
function unSign(value, bits, ignore, sig) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore, sig) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}
if (!Math['imul']) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];
var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_min = Math.min;
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module['removeRunDependency'] = removeRunDependency;
Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data
var memoryInitializer = null;
// === Body ===
STATIC_BASE = 8;
STATICTOP = STATIC_BASE + 2768;
/* global initializers */ __ATINIT__.push({ func: function() { runPostSets() } });
/* memory initializer */ allocate([4,0,0,0,4,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,69,100,103,101,83,105,103,110,40,32,100,115,116,85,112,44,32,116,101,115,115,45,62,101,118,101,110,116,44,32,111,114,103,85,112,32,41,32,60,61,32,48,0,0,0,0,0,0,101,45,62,76,102,97,99,101,32,61,61,32,102,0,0,0,33,32,86,101,114,116,69,113,40,32,100,115,116,76,111,44,32,100,115,116,85,112,32,41,0,0,0,0,0,0,0,0,101,45,62,79,110,101,120,116,45,62,83,121,109,45,62,76,110,101,120,116,32,61,61,32,101,0,0,0,0,0,0,0,114,101,103,80,114,101,118,45,62,119,105,110,100,105,110,103,78,117,109,98,101,114,32,45,32,101,45,62,119,105,110,100,105,110,103,32,61,61,32,114,101,103,45,62,119,105,110,100,105,110,103,78,117,109,98,101,114,0,0,0,0,0,0,0,99,104,105,108,100,32,60,61,32,112,113,45,62,109,97,120,0,0,0,0,0,0,0,0,101,45,62,76,110,101,120,116,45,62,79,110,101,120,116,45,62,83,121,109,32,61,61,32,101,0,0,0,0,0,0,0,86,101,114,116,76,101,113,40,32,101,45,62,79,114,103,44,32,101,45,62,68,115,116,32,41,0,0,0,0,0,0,0,99,117,114,114,32,60,32,112,113,45,62,109,97,120,32,38,38,32,112,113,45,62,107,101,121,115,91,99,117,114,114,93,32,33,61,32,78,85,76,76,0,0,0,0,0,0,0,0,101,45,62,83,121,109,45,62,83,121,109,32,61,61,32,101,0,0,0,0,0,0,0,0,114,101,103,45,62,101,85,112,45,62,119,105,110,100,105,110,103,32,61,61,32,48,0,0,99,117,114,114,32,33,61,32,73,78,86,95,72,65,78,68,76,69,0,0,0,0,0,0,101,45,62,83,121,109,32,33,61,32,101,0,0,0,0,0,117,112,45,62,76,110,101,120,116,32,33,61,32,117,112,32,38,38,32,117,112,45,62,76,110,101,120,116,45,62,76,110,101,120,116,32,33,61,32,117,112,0,0,0,0,0,0,0,102,97,99,101,86,101,114,116,115,32,60,61,32,112,111,108,121,83,105,122,101,0,0,0,114,101,103,45,62,119,105,110,100,105,110,103,78,117,109,98,101,114,32,61,61,32,48,0,76,69,81,40,32,42,42,40,105,43,49,41,44,32,42,42,105,32,41,0,0,0,0,0,46,46,47,108,105,98,116,101,115,115,50,47,83,111,117,114,99,101,47,109,101,115,104,46,99,0,0,0,0,0,0,0,102,45,62,112,114,101,118,32,61,61,32,102,80,114,101,118,0,0,0,0,0,0,0,0,82,101,103,105,111,110,115,0,43,43,102,105,120,101,100,69,100,103,101,115,32,61,61,32,49,0,0,0,0,0,0,0,112,113,32,33,61,32,78,85,76,76,0,0,0,0,0,0,77,101,115,104,32,69,100,103,101,115,0,0,0,0,0,0,101,45,62,76,110,101,120,116,32,33,61,32,101,0,0,0,108,111,45,62,76,110,101,120,116,32,33,61,32,117,112,0,77,101,115,104,32,70,97,99,101,115,0,0,0,0,0,0,114,101,103,45,62,102,105,120,85,112,112,101,114,69,100,103,101,0,0,0,0,0,0,0,104,67,117,114,114,32,62,61,32,49,32,38,38,32,104,67,117,114,114,32,60,61,32,112,113,45,62,109,97,120,32,38,38,32,104,91,104,67,117,114,114,93,46,107,101,121,32,33,61,32,78,85,76,76,0,0,102,114,101,101,32,33,61,32,73,78,86,95,72,65,78,68,76,69,0,0,0,0,0,0,84,114,97,110,115,76,101,113,40,32,117,44,32,118,32,41,32,38,38,32,84,114,97,110,115,76,101,113,40,32,118,44,32,119,32,41,0,0,0,0,84,79,76,69,82,65,78,67,69,95,78,79,78,90,69,82,79,0,0,0,0,0,0,0,118,78,101,119,32,33,61,32,78,85,76,76,0,0,0,0,70,65,76,83,69,0,0,0,102,78,101,119,32,33,61,32,78,85,76,76,0,0,0,0,33,32,86,101,114,116,69,113,40,32,101,85,112,45,62,68,115,116,44,32,101,76,111,45,62,68,115,116,32,41,0,0,101,45,62,83,121,109,45,62,110,101,120,116,32,61,61,32,101,80,114,101,118,45,62,83,121,109,32,38,38,32,101,45,62,83,121,109,32,61,61,32,38,109,101,115,104,45,62,101,72,101,97,100,83,121,109,32,38,38,32,101,45,62,83,121,109,45,62,83,121,109,32,61,61,32,101,32,38,38,32,101,45,62,79,114,103,32,61,61,32,78,85,76,76,32,38,38,32,101,45,62,68,115,116,32,61,61,32,78,85,76,76,32,38,38,32,101,45,62,76,102,97,99,101,32,61,61,32,78,85,76,76,32,38,38,32,101,45,62,82,102,97,99,101,32,61,61,32,78,85,76,76,0,105,115,101,99,116,46,115,32,60,61,32,77,65,88,40,32,111,114,103,76,111,45,62,115,44,32,111,114,103,85,112,45,62,115,32,41,0,0,0,0,101,45,62,68,115,116,32,33,61,32,78,85,76,76,0,0,77,73,78,40,32,100,115,116,76,111,45,62,115,44,32,100,115,116,85,112,45,62,115,32,41,32,60,61,32,105,115,101,99,116,46,115,0,0,0,0,101,45,62,79,114,103,32,33,61,32,78,85,76,76,0,0,46,46,47,108,105,98,116,101,115,115,50,47,83,111,117,114,99,101,47,116,101,115,115,46,99,0,0,0,0,0,0,0,101,45,62,83,121,109,45,62,110,101,120,116,32,61,61,32,101,80,114,101,118,45,62,83,121,109,0,0,0,0,0,0,105,115,101,99,116,46,116,32,60,61,32,77,65,88,40,32,111,114,103,76,111,45,62,116,44,32,100,115,116,76,111,45,62,116,32,41,0,0,0,0,77,101,115,104,32,86,101,114,116,105,99,101,115,0,0,0,77,73,78,40,32,111,114,103,85,112,45,62,116,44,32,100,115,116,85,112,45,62,116,32,41,32,60,61,32,105,115,101,99,116,46,116,0,0,0,0,118,45,62,112,114,101,118,32,61,61,32,118,80,114,101,118,32,38,38,32,118,45,62,97,110,69,100,103,101,32,61,61,32,78,85,76,76,0,0,0,46,46,47,108,105,98,116,101,115,115,50,47,83,111,117,114,99,101,47,115,119,101,101,112,46,99,0,0,0,0,0,0,101,45,62,79,114,103,32,61,61,32,118,0,0,0,0,0,33,32,114,101,103,85,112,45,62,102,105,120,85,112,112,101,114,69,100,103,101,32,38,38,32,33,32,114,101,103,76,111,45,62,102,105,120,85,112,112,101,114,69,100,103,101,0,0,46,46,47,108,105,98,116,101,115,115,50,47,83,111,117,114,99,101,47,112,114,105,111,114,105,116,121,113,46,99,0,0,46,46,47,108,105,98,116,101,115,115,50,47,83,111,117,114,99,101,47,103,101,111,109,46,99,0,0,0,0,0,0,0,111,114,103,85,112,32,33,61,32,116,101,115,115,45,62,101,118,101,110,116,32,38,38,32,111,114,103,76,111,32,33,61,32,116,101,115,115,45,62,101,118,101,110,116,0,0,0,0,118,45,62,112,114,101,118,32,61,61,32,118,80,114,101,118,0,0,0,0,0,0,0,0,69,100,103,101,83,105,103,110,40,32,100,115,116,76,111,44,32,116,101,115,115,45,62,101,118,101,110,116,44,32,111,114,103,76,111,32,41,32,62,61,32,48,0,0,0,0,0,0,102,45,62,112,114,101,118,32,61,61,32,102,80,114,101,118,32,38,38,32,102,45,62,97,110,69,100,103,101,32,61,61,32,78,85,76,76,0,0,0,86,101,114,116,76,101,113,40,32,117,44,32,118,32,41,32,38,38,32,86,101,114,116,76,101,113,40,32,118,44,32,119,32,41,0,0,0,0,0,0,68,105,99,116,0,0,0,0,116,101,115,116,114,97,110,115,83,105,103,110,0,0,0,0,116,101,115,116,114,97,110,115,69,118,97,108,0,0,0,0,116,101,115,115,77,101,115,104,84,101,115,115,101,108,108,97,116,101,77,111,110,111,82,101,103,105,111,110,0,0,0,0,116,101,115,115,77,101,115,104,67,104,101,99,107,77,101,115,104,0,0,0,0,0,0,0,116,101,115,101,100,103,101,83,105,103,110,0,0,0,0,0,116,101,115,101,100,103,101,69,118,97,108,0,0,0,0,0,112,113,73,110,115,101,114,116,0,0,0,0,0,0,0,0,112,113,73,110,105,116,0,0,112,113,72,101,97,112,73,110,115,101,114,116,0,0,0,0,112,113,72,101,97,112,68,101,108,101,116,101,0,0,0,0,112,113,68,101,108,101,116,101,80,114,105,111,114,105,116,121,81,0,0,0,0,0,0,0,112,113,68,101,108,101,116,101,0,0,0,0,0,0,0,0,82,101,109,111,118,101,68,101,103,101,110,101,114,97,116,101,70,97,99,101,115,0,0,0,79,117,116,112,117,116,80,111,108,121,109,101,115,104,0,0,77,97,107,101,86,101,114,116,101,120,0,0,0,0,0,0,77,97,107,101,70,97,99,101,0,0,0,0,0,0,0,0,73,115,87,105,110,100,105,110,103,73,110,115,105,100,101,0,70,108,111,97,116,68,111,119,110,0,0,0,0,0,0,0,70,105,120,85,112,112,101,114,69,100,103,101,0,0,0,0,68,111,110,101,69,100,103,101,68,105,99,116,0,0,0,0,68,101,108,101,116,101,82,101,103,105,111,110,0,0,0,0,67,111,110,110,101,99,116,76,101,102,116,68,101,103,101,110,101,114,97,116,101,0,0,0,67,104,101,99,107,70,111,114,76,101,102,116,83,112,108,105,99,101,0,0,0,0,0,0,67,104,101,99,107,70,111,114,73,110,116,101,114,115,101,99,116,0,0,0,0,0,0,0,65,100,100,82,105,103,104,116,69,100,103,101,115,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE)
var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
assert(tempDoublePtr % 8 == 0);
function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
}
function copyTempDouble(ptr) {
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];
  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];
  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];
  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];
  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];
  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];
  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];
}
  function ___assert_fail(condition, filename, line, func) {
      ABORT = true;
      throw 'Assertion failed: ' + Pointer_stringify(condition) + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function'] + ' at ' + stackTrace();
    }
  Module["_memset"] = _memset;var _llvm_memset_p0i8_i64=_memset;
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value
      return value;
    }
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  var MEMFS={ops_table:null,CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 0777, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 0777 | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            if (canOwn && offset === 0) {
              node.contents = buffer; // this could be a subarray of Emscripten HEAP, or allocated from some other source.
              node.contentMode = (buffer.buffer === HEAP8.buffer) ? MEMFS.CONTENT_OWNING : MEMFS.CONTENT_FIXED;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  var IDBFS={dbs:{},indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },reconcile:function (src, dst, callback) {
        var total = 0;
        var create = {};
        for (var key in src.files) {
          if (!src.files.hasOwnProperty(key)) continue;
          var e = src.files[key];
          var e2 = dst.files[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create[key] = e;
            total++;
          }
        }
        var remove = {};
        for (var key in dst.files) {
          if (!dst.files.hasOwnProperty(key)) continue;
          var e = dst.files[key];
          var e2 = src.files[key];
          if (!e2) {
            remove[key] = e;
            total++;
          }
        }
        if (!total) {
          // early out
          return callback(null);
        }
        var completed = 0;
        function done(err) {
          if (err) return callback(err);
          if (++completed >= total) {
            return callback(null);
          }
        };
        // create a single transaction to handle and IDB reads / writes we'll need to do
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        transaction.onerror = function transaction_onerror() { callback(this.error); };
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
        for (var path in create) {
          if (!create.hasOwnProperty(path)) continue;
          var entry = create[path];
          if (dst.type === 'local') {
            // save file to local
            try {
              if (FS.isDir(entry.mode)) {
                FS.mkdir(path, entry.mode);
              } else if (FS.isFile(entry.mode)) {
                var stream = FS.open(path, 'w+', 0666);
                FS.write(stream, entry.contents, 0, entry.contents.length, 0, true /* canOwn */);
                FS.close(stream);
              }
              done(null);
            } catch (e) {
              return done(e);
            }
          } else {
            // save file to IDB
            var req = store.put(entry, path);
            req.onsuccess = function req_onsuccess() { done(null); };
            req.onerror = function req_onerror() { done(this.error); };
          }
        }
        for (var path in remove) {
          if (!remove.hasOwnProperty(path)) continue;
          var entry = remove[path];
          if (dst.type === 'local') {
            // delete file from local
            try {
              if (FS.isDir(entry.mode)) {
                // TODO recursive delete?
                FS.rmdir(path);
              } else if (FS.isFile(entry.mode)) {
                FS.unlink(path);
              }
              done(null);
            } catch (e) {
              return done(e);
            }
          } else {
            // delete file from IDB
            var req = store.delete(path);
            req.onsuccess = function req_onsuccess() { done(null); };
            req.onerror = function req_onerror() { done(this.error); };
          }
        }
      },getLocalSet:function (mount, callback) {
        var files = {};
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
        var check = FS.readdir(mount.mountpoint)
          .filter(isRealDir)
          .map(toAbsolute(mount.mountpoint));
        while (check.length) {
          var path = check.pop();
          var stat, node;
          try {
            var lookup = FS.lookupPath(path);
            node = lookup.node;
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path)
              .filter(isRealDir)
              .map(toAbsolute(path)));
            files[path] = { mode: stat.mode, timestamp: stat.mtime };
          } else if (FS.isFile(stat.mode)) {
            files[path] = { contents: node.contents, mode: stat.mode, timestamp: stat.mtime };
          } else {
            return callback(new Error('node type not supported'));
          }
        }
        return callback(null, { type: 'local', files: files });
      },getDB:function (name, callback) {
        // look it up in the cache
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        req.onupgradeneeded = function req_onupgradeneeded() {
          db = req.result;
          db.createObjectStore(IDBFS.DB_STORE_NAME);
        };
        req.onsuccess = function req_onsuccess() {
          db = req.result;
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function req_onerror() {
          callback(this.error);
        };
      },getRemoteSet:function (mount, callback) {
        var files = {};
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function transaction_onerror() { callback(this.error); };
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          store.openCursor().onsuccess = function store_openCursor_onsuccess(event) {
            var cursor = event.target.result;
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, files: files });
            }
            files[cursor.key] = cursor.value;
            cursor.continue();
          };
        });
      }};
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          return flags;
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.position = position;
          return position;
        }}};
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,mounts:[],devices:[null],streams:[null],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || { recurse_count: 0 };
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
        // start at the root
        var current = FS.root;
        var current_path = '/';
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            current = current.mount.root;
          }
          // follow symlinks
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
            this.parent = null;
            this.mount = null;
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            FS.hashAddNode(this);
          };
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
          FS.FSNode.prototype = {};
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); },
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); },
            },
          });
        }
        return new FS.FSNode(parent, name, mode, rdev);
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 2097155;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 2097155) !== 0 ||  // opening for write
              (flags & 512)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 1;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        if (stream.__proto__) {
          // reuse the object
          stream.__proto__ = FS.FSStream.prototype;
        } else {
          var newStream = new FS.FSStream();
          for (var p in stream) {
            newStream[p] = stream[p];
          }
          stream = newStream;
        }
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
        var completed = 0;
        var total = FS.mounts.length;
        function done(err) {
          if (err) {
            return callback(err);
          }
          if (++completed >= total) {
            callback(null);
          }
        };
        // sync all mounts
        for (var i = 0; i < FS.mounts.length; i++) {
          var mount = FS.mounts[i];
          if (!mount.type.syncfs) {
            done(null);
            continue;
          }
          mount.type.syncfs(mount, populate, done);
        }
      },mount:function (type, opts, mountpoint) {
        var lookup;
        if (mountpoint) {
          lookup = FS.lookupPath(mountpoint, { follow: false });
          mountpoint = lookup.path;  // use the absolute path
        }
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          root: null
        };
        // create a root node for the fs
        var root = type.mount(mount);
        root.mount = mount;
        mount.root = root;
        // assign the mount info to the mountpoint's node
        if (lookup) {
          lookup.node.mount = mount;
          lookup.node.mounted = true;
          // compatibility update FS.root if we mount to /
          if (mountpoint === '/') {
            FS.root = mount.root;
          }
        }
        // add to our cached list of mounts
        FS.mounts.push(mount);
        return root;
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 0666;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 0777;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 0666;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path, { follow: false });
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 0666 : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.errnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0);
        } else {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=stdin.fd;
        assert(stdin.fd === 1, 'invalid handle for stdin (' + stdin.fd + ')');
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=stdout.fd;
        assert(stdout.fd === 2, 'invalid handle for stdout (' + stdout.fd + ')');
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=stderr.fd;
        assert(stderr.fd === 3, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
          this.stack = stackTrace();
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.root = FS.createNode(null, '/', 16384 | 0777, 0);
        FS.mount(MEMFS, {}, '/');
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
        FS.ensureErrnoError();
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
              if (!hasByteServing) chunkSize = datalength;
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};
  var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 16384 | 0777, 0);
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              var url = 'ws://' + addr + ':' + port;
              // the node ws library API is slightly different than the browser's
              var opts = ENVIRONMENT_IS_NODE ? {headers: {'websocket-protocol': ['binary']}} : ['binary'];
              // If node we use the ws library.
              var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
          var handleOpen = function () {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
          function handleMessage(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          };
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', function() {
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (64 | 1);
          }
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _fputc(c, stream) {
      // int fputc(int c, FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fputc.html
      var chr = unSign(c & 0xFF);
      HEAP8[((_fputc.ret)|0)]=chr
      var ret = _write(stream, _fputc.ret, 1);
      if (ret == -1) {
        var streamObj = FS.getStream(stream);
        if (streamObj) streamObj.error = true;
        return -1;
      } else {
        return chr;
      }
    }function _putchar(c) {
      // int putchar(int c);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/putchar.html
      return _fputc(c, HEAP32[((_stdout)>>2)]);
    }
  Module["_saveSetjmp"] = _saveSetjmp;
  Module["_testSetjmp"] = _testSetjmp;function _longjmp(env, value) {
      asm['setThrew'](env, value || 1);
      throw 'longjmp';
    }
  Module["_memcpy"] = _memcpy;var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;
  var _setjmp=undefined;
  var _llvm_memset_p0i8_i32=_memset;
  function _abort() {
      Module['abort']();
    }
  function ___errno_location() {
      return ___errno_state;
    }
  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }
  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 79:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }
  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret
      }
      return ret;
    }
  Module["_strlen"] = _strlen;
  var Browser={mainLoop:{scheduler:null,shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
        // Canvas event setup
        var canvas = Module['canvas'];
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'];
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas;
        }
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        var ctx;
        try {
          if (useWebGL) {
            var contextAttributes = {
              antialias: false,
              alpha: false
            };
            if (webGLContextAttributes) {
              for (var attribute in webGLContextAttributes) {
                contextAttributes[attribute] = webGLContextAttributes[attribute];
              }
            }
            ['experimental-webgl', 'webgl'].some(function(webglId) {
              return ctx = canvas.getContext(webglId, contextAttributes);
            });
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas - ' + e);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
        var canvas = Module['canvas'];
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement']) === canvas) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'];
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else if (Browser.resizeCanvas){
            Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
        }
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
        }
        canvas.requestFullScreen = canvas['requestFullScreen'] ||
                                   canvas['mozRequestFullScreen'] ||
                                   (canvas['webkitRequestFullScreen'] ? function() { canvas['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvas.requestFullScreen();
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          setTimeout(func, 1000/60);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           window['setTimeout'];
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x, y;
          if (event.type == 'touchstart' ||
              event.type == 'touchend' ||
              event.type == 'touchmove') {
            var t = event.touches.item(0);
            if (t) {
              x = t.pageX - (window.scrollX + rect.left);
              y = t.pageY - (window.scrollY + rect.top);
            } else {
              return;
            }
          } else {
            x = event.pageX - (window.scrollX + rect.left);
            y = event.pageY - (window.scrollY + rect.top);
          }
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        canvas.width = width;
        canvas.height = height;
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        var canvas = Module['canvas'];
        this.windowedWidth = canvas.width;
        this.windowedHeight = canvas.height;
        canvas.width = screen.width;
        canvas.height = screen.height;
        // check if SDL is available
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        var canvas = Module['canvas'];
        canvas.width = this.windowedWidth;
        canvas.height = this.windowedHeight;
        // check if SDL is available
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      }};
_fputc.ret = allocate([0], "i8", ALLOC_STATIC);
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);
staticSealed = true; // seal the static portion of memory
STACK_MAX = STACK_BASE + 5242880;
DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);
assert(DYNAMIC_BASE < TOTAL_MEMORY); // Stack must fit in TOTAL_MEMORY; allocations from here on may enlarge TOTAL_MEMORY
var Math_min = Math.min;
function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_viii(index,a1,a2,a3) {
  try {
    Module["dynCall_viii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm = (function(global, env, buffer) {
  'use asm';
  var HEAP8 = new global.Int8Array(buffer);
  var HEAP16 = new global.Int16Array(buffer);
  var HEAP32 = new global.Int32Array(buffer);
  var HEAPU8 = new global.Uint8Array(buffer);
  var HEAPU16 = new global.Uint16Array(buffer);
  var HEAPU32 = new global.Uint32Array(buffer);
  var HEAPF32 = new global.Float32Array(buffer);
  var HEAPF64 = new global.Float64Array(buffer);
  var STACKTOP=env.STACKTOP|0;
  var STACK_MAX=env.STACK_MAX|0;
  var tempDoublePtr=env.tempDoublePtr|0;
  var ABORT=env.ABORT|0;
  var NaN=+env.NaN;
  var Infinity=+env.Infinity;
  var __THREW__ = 0;
  var threwValue = 0;
  var setjmpId = 0;
  var undef = 0;
  var tempInt = 0, tempBigInt = 0, tempBigIntP = 0, tempBigIntS = 0, tempBigIntR = 0.0, tempBigIntI = 0, tempBigIntD = 0, tempValue = 0, tempDouble = 0.0;
  var tempRet0 = 0;
  var tempRet1 = 0;
  var tempRet2 = 0;
  var tempRet3 = 0;
  var tempRet4 = 0;
  var tempRet5 = 0;
  var tempRet6 = 0;
  var tempRet7 = 0;
  var tempRet8 = 0;
  var tempRet9 = 0;
  var Math_floor=global.Math.floor;
  var Math_abs=global.Math.abs;
  var Math_sqrt=global.Math.sqrt;
  var Math_pow=global.Math.pow;
  var Math_cos=global.Math.cos;
  var Math_sin=global.Math.sin;
  var Math_tan=global.Math.tan;
  var Math_acos=global.Math.acos;
  var Math_asin=global.Math.asin;
  var Math_atan=global.Math.atan;
  var Math_atan2=global.Math.atan2;
  var Math_exp=global.Math.exp;
  var Math_log=global.Math.log;
  var Math_ceil=global.Math.ceil;
  var Math_imul=global.Math.imul;
  var abort=env.abort;
  var assert=env.assert;
  var asmPrintInt=env.asmPrintInt;
  var asmPrintFloat=env.asmPrintFloat;
  var Math_min=env.min;
  var invoke_ii=env.invoke_ii;
  var invoke_viiiii=env.invoke_viiiii;
  var invoke_vi=env.invoke_vi;
  var invoke_vii=env.invoke_vii;
  var invoke_iiii=env.invoke_iiii;
  var invoke_viii=env.invoke_viii;
  var invoke_v=env.invoke_v;
  var invoke_iii=env.invoke_iii;
  var _fputc=env._fputc;
  var _pwrite=env._pwrite;
  var _putchar=env._putchar;
  var _sbrk=env._sbrk;
  var ___assert_fail=env.___assert_fail;
  var ___setErrNo=env.___setErrNo;
  var ___errno_location=env.___errno_location;
  var _abort=env._abort;
  var _send=env._send;
  var _write=env._write;
  var _time=env._time;
  var _sysconf=env._sysconf;
  var _longjmp=env._longjmp;
  var _fflush=env._fflush;
  var tempFloat = 0.0;
// EMSCRIPTEN_START_FUNCS
function stackAlloc(size) {
  size = size|0;
  var ret = 0;
  ret = STACKTOP;
  STACKTOP = (STACKTOP + size)|0;
STACKTOP = (STACKTOP + 7)&-8;
  return ret|0;
}
function stackSave() {
  return STACKTOP|0;
}
function stackRestore(top) {
  top = top|0;
  STACKTOP = top;
}
function setThrew(threw, value) {
  threw = threw|0;
  value = value|0;
  if ((__THREW__|0) == 0) {
    __THREW__ = threw;
    threwValue = value;
  }
}
function copyTempFloat(ptr) {
  ptr = ptr|0;
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1|0] = HEAP8[ptr+1|0];
  HEAP8[tempDoublePtr+2|0] = HEAP8[ptr+2|0];
  HEAP8[tempDoublePtr+3|0] = HEAP8[ptr+3|0];
}
function copyTempDouble(ptr) {
  ptr = ptr|0;
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1|0] = HEAP8[ptr+1|0];
  HEAP8[tempDoublePtr+2|0] = HEAP8[ptr+2|0];
  HEAP8[tempDoublePtr+3|0] = HEAP8[ptr+3|0];
  HEAP8[tempDoublePtr+4|0] = HEAP8[ptr+4|0];
  HEAP8[tempDoublePtr+5|0] = HEAP8[ptr+5|0];
  HEAP8[tempDoublePtr+6|0] = HEAP8[ptr+6|0];
  HEAP8[tempDoublePtr+7|0] = HEAP8[ptr+7|0];
}
function setTempRet0(value) {
  value = value|0;
  tempRet0 = value;
}
function setTempRet1(value) {
  value = value|0;
  tempRet1 = value;
}
function setTempRet2(value) {
  value = value|0;
  tempRet2 = value;
}
function setTempRet3(value) {
  value = value|0;
  tempRet3 = value;
}
function setTempRet4(value) {
  value = value|0;
  tempRet4 = value;
}
function setTempRet5(value) {
  value = value|0;
  tempRet5 = value;
}
function setTempRet6(value) {
  value = value|0;
  tempRet6 = value;
}
function setTempRet7(value) {
  value = value|0;
  tempRet7 = value;
}
function setTempRet8(value) {
  value = value|0;
  tempRet8 = value;
}
function setTempRet9(value) {
  value = value|0;
  tempRet9 = value;
}
function runPostSets() {
}
function _createBucketAlloc($alloc,$name,$itemSize,$bucketSize){
 $alloc=($alloc)|0;
 $name=($name)|0;
 $itemSize=($itemSize)|0;
 $bucketSize=($bucketSize)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$_itemSize=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0;
 var $20=0,$22=0,$23=0,$24=0,$_0=0,label=0;
 $1=(($alloc)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($alloc+12)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=((FUNCTION_TABLE_iii[($2)&7]($4,24))|0);
 $6=$5;
 $7=(($5+20)|0);
 $8=$7;
 HEAP32[(($8)>>2)]=$alloc;
 $9=(($5+16)|0);
 $10=$9;
 HEAP32[(($10)>>2)]=$name;
 $11=(($5+8)|0);
 $12=$11;
 $13=($itemSize>>>0)<((4)>>>0);
 $_itemSize=($13?4:$itemSize);
 HEAP32[(($12)>>2)]=$_itemSize;
 $14=(($5+12)|0);
 $15=$14;
 HEAP32[(($15)>>2)]=$bucketSize;
 $16=$5;
 HEAP32[(($16)>>2)]=0;
 $17=(($5+4)|0);
 $18=$17;
 HEAP32[(($18)>>2)]=0;
 $19=((_CreateBucket($6))|0);
 $20=($19|0)==0;
 if (!($20)) {
  $_0=$6;
  return (($_0)|0);
 }
 $22=(($alloc+8)|0);
 $23=((HEAP32[(($22)>>2)])|0);
 $24=((HEAP32[(($3)>>2)])|0);
 FUNCTION_TABLE_vii[($23)&7]($24,$5);
 $_0=0;
 return (($_0)|0);
}
function _CreateBucket($ba){
 $ba=($ba)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$16=0,$17=0,$18=0,$19=0,$20=0,$21=0;
 var $22=0,$23=0,$24=0,$25=0,$_sum=0,$26=0,$freelist_0=0,$it_0=0,$28=0,$29=0,$30=0,$31=0,$32=0,$_0=0,label=0;
 $1=(($ba+8)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($ba+12)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(Math_imul($4,$2)|0);
 $6=((($5)+(4))|0);
 $7=(($ba+20)|0);
 $8=((HEAP32[(($7)>>2)])|0);
 $9=(($8)|0);
 $10=((HEAP32[(($9)>>2)])|0);
 $11=(($8+12)|0);
 $12=((HEAP32[(($11)>>2)])|0);
 $13=((FUNCTION_TABLE_iii[($10)&7]($12,$6))|0);
 $14=($13|0)==0;
 if ($14) {
  $_0=0;
  return (($_0)|0);
 }
 $16=$13;
 $17=$13;
 HEAP32[(($17)>>2)]=0;
 $18=(($ba+4)|0);
 $19=((HEAP32[(($18)>>2)])|0);
 HEAP32[(($17)>>2)]=$19;
 HEAP32[(($18)>>2)]=$16;
 $20=(($ba)|0);
 $21=((HEAP32[(($20)>>2)])|0);
 $22=(($13+4)|0);
 $23=((HEAP32[(($1)>>2)])|0);
 $24=((HEAP32[(($3)>>2)])|0);
 $25=(Math_imul($24,$23)|0);
 $_sum=((($25)+(4))|0);
 $26=(($13+$_sum)|0);
 $it_0=$26;$freelist_0=$21;
 while(1) {
  $28=((HEAP32[(($1)>>2)])|0);
  $29=(((-$28))|0);
  $30=(($it_0+$29)|0);
  $31=$30;
  HEAP32[(($31)>>2)]=$freelist_0;
  $32=($30|0)==($22|0);
  if ($32) {
   break;
  } else {
   $it_0=$30;$freelist_0=$30;
  }
 }
 HEAP32[(($20)>>2)]=$30;
 $_0=1;
 return (($_0)|0);
}
function _bucketAlloc($ba){
 $ba=($ba)|0;
 var $1=0,$2=0,$3=0,$5=0,$6=0,$8=0,$9=0,$11=0,$12=0,$_0=0,label=0;
 $1=(($ba)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=($2|0)==0;
 if ($3) {
  label = 15;
 } else {
  $5=((_NextFreeItem($ba))|0);
  $6=($5|0)==0;
  if ($6) {
   label = 15;
  }
 }
 do {
  if ((label|0) == 15) {
   $8=((_CreateBucket($ba))|0);
   $9=($8|0)==0;
   if ($9) {
    $_0=0;
   } else {
    break;
   }
   return (($_0)|0);
  }
 } while(0);
 $11=((HEAP32[(($1)>>2)])|0);
 $12=((_NextFreeItem($ba))|0);
 HEAP32[(($1)>>2)]=$12;
 $_0=$11;
 return (($_0)|0);
}
function _NextFreeItem($ba){
 $ba=($ba)|0;
 var $1=0,$2=0,$3=0,$4=0,label=0;
 $1=(($ba)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=$2;
 $4=((HEAP32[(($3)>>2)])|0);
 return (($4)|0);
}
function _bucketFree($ba,$ptr){
 $ba=($ba)|0;
 $ptr=($ptr)|0;
 var $1=0,$2=0,$3=0,label=0;
 $1=(($ba)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=$ptr;
 HEAP32[(($3)>>2)]=$2;
 HEAP32[(($1)>>2)]=$ptr;
 return;
}
function _deleteBucketAlloc($ba){
 $ba=($ba)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$bucket_010=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0;
 var label=0;
 $1=(($ba+20)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($ba+4)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=($4|0)==0;
 if (!($5)) {
  $6=(($2+8)|0);
  $7=(($2+12)|0);
  $bucket_010=$4;
  while(1) {
   $9=(($bucket_010)|0);
   $10=((HEAP32[(($9)>>2)])|0);
   $11=((HEAP32[(($6)>>2)])|0);
   $12=((HEAP32[(($7)>>2)])|0);
   $13=$bucket_010;
   FUNCTION_TABLE_vii[($11)&7]($12,$13);
   $14=($10|0)==0;
   if ($14) {
    break;
   } else {
    $bucket_010=$10;
   }
  }
 }
 $15=(($ba)|0);
 HEAP32[(($15)>>2)]=0;
 HEAP32[(($3)>>2)]=0;
 $16=(($2+8)|0);
 $17=((HEAP32[(($16)>>2)])|0);
 $18=(($2+12)|0);
 $19=((HEAP32[(($18)>>2)])|0);
 $20=$ba;
 FUNCTION_TABLE_vii[($17)&7]($19,$20);
 return;
}
function _dictNewDict($alloc,$frame,$leq){
 $alloc=($alloc)|0;
 $frame=($frame)|0;
 $leq=($leq)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0,$21=0;
 var $23=0,$26=0,$27=0,$28=0,$29=0,$_0=0,label=0;
 $1=(($alloc)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($alloc+12)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=((FUNCTION_TABLE_iii[($2)&7]($4,24))|0);
 $6=$5;
 $7=($5|0)==0;
 if ($7) {
  $_0=0;
  return (($_0)|0);
 }
 $9=$5;
 $10=$5;
 HEAP32[(($10)>>2)]=0;
 $11=(($5+4)|0);
 $12=$11;
 HEAP32[(($12)>>2)]=$9;
 $13=(($5+8)|0);
 $14=$13;
 HEAP32[(($14)>>2)]=$9;
 $15=(($5+12)|0);
 $16=$15;
 HEAP32[(($16)>>2)]=$frame;
 $17=(($5+20)|0);
 $18=$17;
 HEAP32[(($18)>>2)]=$leq;
 $19=(($alloc+28)|0);
 $20=((HEAP32[(($19)>>2)])|0);
 $21=($20|0)<16;
 do {
  if ($21) {
   HEAP32[(($19)>>2)]=16;
  } else {
   $23=($20|0)>4096;
   if (!($23)) {
    break;
   }
   HEAP32[(($19)>>2)]=4096;
  }
 } while(0);
 $26=((HEAP32[(($19)>>2)])|0);
 $27=((_createBucketAlloc($alloc,1816,12,$26))|0);
 $28=(($5+16)|0);
 $29=$28;
 HEAP32[(($29)>>2)]=$27;
 $_0=$6;
 return (($_0)|0);
}
function _dictDeleteDict($alloc,$dict){
 $alloc=($alloc)|0;
 $dict=($dict)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,label=0;
 $1=(($dict+16)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 _deleteBucketAlloc($2);
 $3=(($alloc+8)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($alloc+12)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=$dict;
 FUNCTION_TABLE_vii[($4)&7]($6,$7);
 return;
}
function _dictInsertBefore($dict,$node,$key){
 $dict=($dict)|0;
 $node=($node)|0;
 $key=($key)|0;
 var $1=0,$2=0,$_019=0,$4=0,$5=0,$6=0,$7=0,$8=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$20=0,$21=0,$22=0;
 var $23=0,$24=0,$25=0,$26=0,$27=0,$28=0,$_0=0,label=0;
 $1=(($dict+20)|0);
 $2=(($dict+12)|0);
 $_019=$node;
 while(1) {
  $4=(($_019+8)|0);
  $5=((HEAP32[(($4)>>2)])|0);
  $6=(($5)|0);
  $7=((HEAP32[(($6)>>2)])|0);
  $8=($7|0)==0;
  if ($8) {
   break;
  }
  $10=((HEAP32[(($1)>>2)])|0);
  $11=((HEAP32[(($2)>>2)])|0);
  $12=((FUNCTION_TABLE_iiii[($10)&7]($11,$7,$key))|0);
  $13=($12|0)==0;
  if ($13) {
   $_019=$5;
  } else {
   break;
  }
 }
 $14=(($dict+16)|0);
 $15=((HEAP32[(($14)>>2)])|0);
 $16=((_bucketAlloc($15))|0);
 $17=$16;
 $18=($16|0)==0;
 if ($18) {
  $_0=0;
  return (($_0)|0);
 }
 $20=$16;
 HEAP32[(($20)>>2)]=$key;
 $21=(($5+4)|0);
 $22=((HEAP32[(($21)>>2)])|0);
 $23=(($16+4)|0);
 $24=$23;
 HEAP32[(($24)>>2)]=$22;
 $25=((HEAP32[(($21)>>2)])|0);
 $26=(($25+8)|0);
 HEAP32[(($26)>>2)]=$17;
 $27=(($16+8)|0);
 $28=$27;
 HEAP32[(($28)>>2)]=$5;
 HEAP32[(($21)>>2)]=$17;
 $_0=$17;
 return (($_0)|0);
}
function _dictDelete($dict,$node){
 $dict=($dict)|0;
 $node=($node)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,label=0;
 $1=(($node+8)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($node+4)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($4+8)|0);
 HEAP32[(($5)>>2)]=$2;
 $6=((HEAP32[(($3)>>2)])|0);
 $7=((HEAP32[(($1)>>2)])|0);
 $8=(($7+4)|0);
 HEAP32[(($8)>>2)]=$6;
 $9=(($dict+16)|0);
 $10=((HEAP32[(($9)>>2)])|0);
 $11=$node;
 _bucketFree($10,$11);
 return;
}
function _dictSearch($dict,$key){
 $dict=($dict)|0;
 $key=($key)|0;
 var $1=0,$2=0,$3=0,$node_0=0,$5=0,$6=0,$7=0,$8=0,$9=0,$11=0,$12=0,$13=0,$14=0,label=0;
 $1=(($dict)|0);
 $2=(($dict+20)|0);
 $3=(($dict+12)|0);
 $node_0=$1;
 while(1) {
  $5=(($node_0+4)|0);
  $6=((HEAP32[(($5)>>2)])|0);
  $7=(($6)|0);
  $8=((HEAP32[(($7)>>2)])|0);
  $9=($8|0)==0;
  if ($9) {
   label = 49;
   break;
  }
  $11=((HEAP32[(($2)>>2)])|0);
  $12=((HEAP32[(($3)>>2)])|0);
  $13=((FUNCTION_TABLE_iiii[($11)&7]($12,$key,$8))|0);
  $14=($13|0)==0;
  if ($14) {
   $node_0=$6;
  } else {
   label = 50;
   break;
  }
 }
 if ((label|0) == 50) {
  return (($6)|0);
 }
 else if ((label|0) == 49) {
  return (($6)|0);
 }
  return 0;
}
function _tesvertLeq($u,$v){
 $u=($u)|0;
 $v=($v)|0;
 var $1=0,$2=.0,$3=0,$4=.0,$5=0,$7=0,$9=0,$10=.0,$11=0,$12=.0,$13=0,$phitmp=0,$15=0,label=0;
 $1=(($u+24)|0);
 $2=(+(HEAPF32[(($1)>>2)]));
 $3=(($v+24)|0);
 $4=(+(HEAPF32[(($3)>>2)]));
 $5=$2<$4;
 if ($5) {
  $15=1;
  return (($15)|0);
 }
 $7=$2==$4;
 if (!($7)) {
  $15=0;
  return (($15)|0);
 }
 $9=(($u+28)|0);
 $10=(+(HEAPF32[(($9)>>2)]));
 $11=(($v+28)|0);
 $12=(+(HEAPF32[(($11)>>2)]));
 $13=$10<=$12;
 $phitmp=($13&1);
 $15=$phitmp;
 return (($15)|0);
}
function _tesedgeEval($u,$v,$w){
 $u=($u)|0;
 $v=($v)|0;
 $w=($w)|0;
 var $1=0,$2=.0,$3=0,$4=.0,$5=0,$7=0,$9=0,$10=.0,$11=0,$12=.0,$13=0,$15=.0,$16=0,$17=.0,$18=0,$20=0,$22=0,$23=.0,$24=0,$25=.0;
 var $26=0,$29=.0,$30=.0,$31=.0,$32=.0,$33=.0,$34=.0,$35=0,$37=0,$38=0,$39=.0,$41=0,$42=.0,$43=.0,$44=0,$45=.0,$46=.0,$47=.0,$48=.0,$49=.0;
 var $51=0,$52=.0,$53=.0,$54=0,$55=.0,$56=.0,$57=.0,$58=.0,$59=.0,$_0=.0,label=0;
 $1=(($u+24)|0);
 $2=(+(HEAPF32[(($1)>>2)]));
 $3=(($v+24)|0);
 $4=(+(HEAPF32[(($3)>>2)]));
 $5=$2<$4;
 do {
  if (!($5)) {
   $7=$2==$4;
   if (!($7)) {
    ___assert_fail(((1776)|0),((1584)|0),((58)|0),((1928)|0));
    return 0.0;
   }
   $9=(($u+28)|0);
   $10=(+(HEAPF32[(($9)>>2)]));
   $11=(($v+28)|0);
   $12=(+(HEAPF32[(($11)>>2)]));
   $13=$10>$12;
   if (!($13)) {
    break;
   }
   ___assert_fail(((1776)|0),((1584)|0),((58)|0),((1928)|0));
   return 0.0;
  }
 } while(0);
 $15=(+(HEAPF32[(($3)>>2)]));
 $16=(($w+24)|0);
 $17=(+(HEAPF32[(($16)>>2)]));
 $18=$15<$17;
 do {
  if (!($18)) {
   $20=$15==$17;
   if (!($20)) {
    ___assert_fail(((1776)|0),((1584)|0),((58)|0),((1928)|0));
    return 0.0;
   }
   $22=(($v+28)|0);
   $23=(+(HEAPF32[(($22)>>2)]));
   $24=(($w+28)|0);
   $25=(+(HEAPF32[(($24)>>2)]));
   $26=$23>$25;
   if (!($26)) {
    break;
   }
   ___assert_fail(((1776)|0),((1584)|0),((58)|0),((1928)|0));
   return 0.0;
  }
 } while(0);
 $29=(+(HEAPF32[(($3)>>2)]));
 $30=(+(HEAPF32[(($1)>>2)]));
 $31=($29)-($30);
 $32=(+(HEAPF32[(($16)>>2)]));
 $33=($32)-($29);
 $34=($31)+($33);
 $35=$34>(0.0);
 if (!($35)) {
  $_0=0.0;
  return (+($_0));
 }
 $37=$31<$33;
 $38=(($v+28)|0);
 $39=(+(HEAPF32[(($38)>>2)]));
 if ($37) {
  $41=(($u+28)|0);
  $42=(+(HEAPF32[(($41)>>2)]));
  $43=($39)-($42);
  $44=(($w+28)|0);
  $45=(+(HEAPF32[(($44)>>2)]));
  $46=($42)-($45);
  $47=($31)/($34);
  $48=($46)*($47);
  $49=($43)+($48);
  $_0=$49;
  return (+($_0));
 } else {
  $51=(($w+28)|0);
  $52=(+(HEAPF32[(($51)>>2)]));
  $53=($39)-($52);
  $54=(($u+28)|0);
  $55=(+(HEAPF32[(($54)>>2)]));
  $56=($52)-($55);
  $57=($33)/($34);
  $58=($56)*($57);
  $59=($53)+($58);
  $_0=$59;
  return (+($_0));
 }
  return .0;
}
function _tesedgeSign($u,$v,$w){
 $u=($u)|0;
 $v=($v)|0;
 $w=($w)|0;
 var $1=0,$2=.0,$3=0,$4=.0,$5=0,$7=0,$9=0,$10=.0,$11=0,$12=.0,$13=0,$15=.0,$16=0,$17=.0,$18=0,$20=0,$22=0,$23=.0,$24=0,$25=.0;
 var $26=0,$29=.0,$30=.0,$31=.0,$32=.0,$33=.0,$34=.0,$35=0,$37=0,$38=.0,$39=0,$40=.0,$41=.0,$42=.0,$43=0,$44=.0,$45=.0,$46=.0,$47=.0,$_0=.0;
 var label=0;
 $1=(($u+24)|0);
 $2=(+(HEAPF32[(($1)>>2)]));
 $3=(($v+24)|0);
 $4=(+(HEAPF32[(($3)>>2)]));
 $5=$2<$4;
 do {
  if ($5) {
   label = 80;
  } else {
   $7=$2==$4;
   if (!($7)) {
    break;
   }
   $9=(($u+28)|0);
   $10=(+(HEAPF32[(($9)>>2)]));
   $11=(($v+28)|0);
   $12=(+(HEAPF32[(($11)>>2)]));
   $13=$10>$12;
   if (!($13)) {
    label = 80;
   }
  }
 } while(0);
 do {
  if ((label|0) == 80) {
   $15=(+(HEAPF32[(($3)>>2)]));
   $16=(($w+24)|0);
   $17=(+(HEAPF32[(($16)>>2)]));
   $18=$15<$17;
   if (!($18)) {
    $20=$15==$17;
    if (!($20)) {
     break;
    }
    $22=(($v+28)|0);
    $23=(+(HEAPF32[(($22)>>2)]));
    $24=(($w+28)|0);
    $25=(+(HEAPF32[(($24)>>2)]));
    $26=$23>$25;
    if ($26) {
     break;
    }
   }
   $29=(+(HEAPF32[(($3)>>2)]));
   $30=(+(HEAPF32[(($1)>>2)]));
   $31=($29)-($30);
   $32=(+(HEAPF32[(($16)>>2)]));
   $33=($32)-($29);
   $34=($31)+($33);
   $35=$34>(0.0);
   if (!($35)) {
    $_0=0.0;
    return (+($_0));
   }
   $37=(($v+28)|0);
   $38=(+(HEAPF32[(($37)>>2)]));
   $39=(($w+28)|0);
   $40=(+(HEAPF32[(($39)>>2)]));
   $41=($38)-($40);
   $42=($31)*($41);
   $43=(($u+28)|0);
   $44=(+(HEAPF32[(($43)>>2)]));
   $45=($38)-($44);
   $46=($33)*($45);
   $47=($42)+($46);
   $_0=$47;
   return (+($_0));
  }
 } while(0);
 ___assert_fail(((1776)|0),((1584)|0),((82)|0),((1912)|0));
 return 0.0;
}
function _testransEval($u,$v,$w){
 $u=($u)|0;
 $v=($v)|0;
 $w=($w)|0;
 var $1=0,$2=.0,$3=0,$4=.0,$5=0,$7=0,$9=0,$10=.0,$11=0,$12=.0,$13=0,$15=.0,$16=0,$17=.0,$18=0,$20=0,$22=0,$23=.0,$24=0,$25=.0;
 var $26=0,$29=.0,$30=.0,$31=.0,$32=.0,$33=.0,$34=.0,$35=0,$37=0,$38=0,$39=.0,$41=0,$42=.0,$43=.0,$44=0,$45=.0,$46=.0,$47=.0,$48=.0,$49=.0;
 var $51=0,$52=.0,$53=.0,$54=0,$55=.0,$56=.0,$57=.0,$58=.0,$59=.0,$_0=.0,label=0;
 $1=(($u+28)|0);
 $2=(+(HEAPF32[(($1)>>2)]));
 $3=(($v+28)|0);
 $4=(+(HEAPF32[(($3)>>2)]));
 $5=$2<$4;
 do {
  if (!($5)) {
   $7=$2==$4;
   if (!($7)) {
    ___assert_fail(((856)|0),((1584)|0),((113)|0),((1840)|0));
    return 0.0;
   }
   $9=(($u+24)|0);
   $10=(+(HEAPF32[(($9)>>2)]));
   $11=(($v+24)|0);
   $12=(+(HEAPF32[(($11)>>2)]));
   $13=$10>$12;
   if (!($13)) {
    break;
   }
   ___assert_fail(((856)|0),((1584)|0),((113)|0),((1840)|0));
   return 0.0;
  }
 } while(0);
 $15=(+(HEAPF32[(($3)>>2)]));
 $16=(($w+28)|0);
 $17=(+(HEAPF32[(($16)>>2)]));
 $18=$15<$17;
 do {
  if (!($18)) {
   $20=$15==$17;
   if (!($20)) {
    ___assert_fail(((856)|0),((1584)|0),((113)|0),((1840)|0));
    return 0.0;
   }
   $22=(($v+24)|0);
   $23=(+(HEAPF32[(($22)>>2)]));
   $24=(($w+24)|0);
   $25=(+(HEAPF32[(($24)>>2)]));
   $26=$23>$25;
   if (!($26)) {
    break;
   }
   ___assert_fail(((856)|0),((1584)|0),((113)|0),((1840)|0));
   return 0.0;
  }
 } while(0);
 $29=(+(HEAPF32[(($3)>>2)]));
 $30=(+(HEAPF32[(($1)>>2)]));
 $31=($29)-($30);
 $32=(+(HEAPF32[(($16)>>2)]));
 $33=($32)-($29);
 $34=($31)+($33);
 $35=$34>(0.0);
 if (!($35)) {
  $_0=0.0;
  return (+($_0));
 }
 $37=$31<$33;
 $38=(($v+24)|0);
 $39=(+(HEAPF32[(($38)>>2)]));
 if ($37) {
  $41=(($u+24)|0);
  $42=(+(HEAPF32[(($41)>>2)]));
  $43=($39)-($42);
  $44=(($w+24)|0);
  $45=(+(HEAPF32[(($44)>>2)]));
  $46=($42)-($45);
  $47=($31)/($34);
  $48=($46)*($47);
  $49=($43)+($48);
  $_0=$49;
  return (+($_0));
 } else {
  $51=(($w+24)|0);
  $52=(+(HEAPF32[(($51)>>2)]));
  $53=($39)-($52);
  $54=(($u+24)|0);
  $55=(+(HEAPF32[(($54)>>2)]));
  $56=($52)-($55);
  $57=($33)/($34);
  $58=($56)*($57);
  $59=($53)+($58);
  $_0=$59;
  return (+($_0));
 }
  return .0;
}
function _testransSign($u,$v,$w){
 $u=($u)|0;
 $v=($v)|0;
 $w=($w)|0;
 var $1=0,$2=.0,$3=0,$4=.0,$5=0,$7=0,$9=0,$10=.0,$11=0,$12=.0,$13=0,$15=.0,$16=0,$17=.0,$18=0,$20=0,$22=0,$23=.0,$24=0,$25=.0;
 var $26=0,$29=.0,$30=.0,$31=.0,$32=.0,$33=.0,$34=.0,$35=0,$37=0,$38=.0,$39=0,$40=.0,$41=.0,$42=.0,$43=0,$44=.0,$45=.0,$46=.0,$47=.0,$_0=.0;
 var label=0;
 $1=(($u+28)|0);
 $2=(+(HEAPF32[(($1)>>2)]));
 $3=(($v+28)|0);
 $4=(+(HEAPF32[(($3)>>2)]));
 $5=$2<$4;
 do {
  if ($5) {
   label = 111;
  } else {
   $7=$2==$4;
   if (!($7)) {
    break;
   }
   $9=(($u+24)|0);
   $10=(+(HEAPF32[(($9)>>2)]));
   $11=(($v+24)|0);
   $12=(+(HEAPF32[(($11)>>2)]));
   $13=$10>$12;
   if (!($13)) {
    label = 111;
   }
  }
 } while(0);
 do {
  if ((label|0) == 111) {
   $15=(+(HEAPF32[(($3)>>2)]));
   $16=(($w+28)|0);
   $17=(+(HEAPF32[(($16)>>2)]));
   $18=$15<$17;
   if (!($18)) {
    $20=$15==$17;
    if (!($20)) {
     break;
    }
    $22=(($v+24)|0);
    $23=(+(HEAPF32[(($22)>>2)]));
    $24=(($w+24)|0);
    $25=(+(HEAPF32[(($24)>>2)]));
    $26=$23>$25;
    if ($26) {
     break;
    }
   }
   $29=(+(HEAPF32[(($3)>>2)]));
   $30=(+(HEAPF32[(($1)>>2)]));
   $31=($29)-($30);
   $32=(+(HEAPF32[(($16)>>2)]));
   $33=($32)-($29);
   $34=($31)+($33);
   $35=$34>(0.0);
   if (!($35)) {
    $_0=0.0;
    return (+($_0));
   }
   $37=(($v+24)|0);
   $38=(+(HEAPF32[(($37)>>2)]));
   $39=(($w+24)|0);
   $40=(+(HEAPF32[(($39)>>2)]));
   $41=($38)-($40);
   $42=($31)*($41);
   $43=(($u+24)|0);
   $44=(+(HEAPF32[(($43)>>2)]));
   $45=($38)-($44);
   $46=($33)*($45);
   $47=($42)+($46);
   $_0=$47;
   return (+($_0));
  }
 } while(0);
 ___assert_fail(((856)|0),((1584)|0),((137)|0),((1824)|0));
 return 0.0;
}
function _tesvertCCW($u,$v,$w){
 $u=($u)|0;
 $v=($v)|0;
 $w=($w)|0;
 var $1=0,$2=.0,$3=0,$4=.0,$5=0,$6=.0,$7=.0,$8=.0,$9=0,$10=.0,$11=0,$12=.0,$13=.0,$14=.0,$15=.0,$16=0,$17=.0,$18=.0,$19=.0,$20=.0;
 var $21=0,$22=0,label=0;
 $1=(($u+24)|0);
 $2=(+(HEAPF32[(($1)>>2)]));
 $3=(($v+28)|0);
 $4=(+(HEAPF32[(($3)>>2)]));
 $5=(($w+28)|0);
 $6=(+(HEAPF32[(($5)>>2)]));
 $7=($4)-($6);
 $8=($2)*($7);
 $9=(($v+24)|0);
 $10=(+(HEAPF32[(($9)>>2)]));
 $11=(($u+28)|0);
 $12=(+(HEAPF32[(($11)>>2)]));
 $13=($6)-($12);
 $14=($10)*($13);
 $15=($8)+($14);
 $16=(($w+24)|0);
 $17=(+(HEAPF32[(($16)>>2)]));
 $18=($12)-($4);
 $19=($17)*($18);
 $20=($19)+($15);
 $21=$20>=(0.0);
 $22=($21&1);
 return (($22)|0);
}
function _tesedgeIntersect($o1,$d1,$o2,$d2,$v){
 $o1=($o1)|0;
 $d1=($d1)|0;
 $o2=($o2)|0;
 $d2=($d2)|0;
 $v=($v)|0;
 var $1=0,$2=.0,$3=0,$4=.0,$5=0,$7=0,$9=0,$10=.0,$11=0,$12=.0,$13=0,$_0200=0,$_0=0,$16=0,$17=.0,$18=0,$19=.0,$20=0,$22=0,$24=0;
 var $25=.0,$26=0,$27=.0,$28=0,$_0208=0,$_0204=0,$31=0,$32=.0,$33=0,$34=.0,$35=0,$37=0,$39=0,$40=.0,$41=0,$42=.0,$43=0,$_1209=0,$_1205=0,$_1201=0;
 var $_1=0,$46=0,$47=.0,$48=0,$49=.0,$50=0,$52=0,$54=0,$55=.0,$56=0,$57=.0,$58=0,$60=.0,$61=.0,$62=.0,$63=.0,$64=0,$66=.0,$67=0,$68=.0;
 var $69=0,$71=0,$73=0,$74=.0,$75=0,$76=.0,$77=0,$79=.0,$80=.0,$81=.0,$82=0,$84=.0,$85=.0,$z2_0=.0,$z1_0=.0,$87=0,$88=.0,$89=0,$90=.0,$91=0;
 var $93=0,$94=.0,$95=.0,$97=.0,$98=.0,$100=.0,$101=.0,$102=.0,$103=.0,$104=.0,$106=.0,$107=.0,$108=.0,$109=.0,$110=.0,$111=.0,$112=.0,$114=.0,$115=0,$117=.0;
 var $118=.0,$119=.0,$120=.0,$121=0,$123=.0,$z2_1=.0,$z1_1=.0,$125=0,$126=.0,$127=0,$128=.0,$129=0,$131=0,$132=.0,$133=.0,$135=.0,$136=.0,$138=.0,$139=.0,$140=.0;
 var $141=.0,$142=.0,$144=.0,$145=.0,$146=.0,$147=.0,$148=.0,$149=.0,$150=.0,$152=.0,$153=0,$155=0,$156=.0,$157=0,$158=.0,$159=0,$161=0,$163=0,$164=.0,$165=.0;
 var $166=0,$_2202=0,$_2=0,$169=0,$170=.0,$171=0,$172=.0,$173=0,$175=0,$177=.0,$178=0,$179=.0,$180=0,$_2210=0,$_2206=0,$183=0,$184=.0,$185=0,$186=.0,$187=0;
 var $189=0,$191=0,$192=.0,$193=0,$194=.0,$195=0,$_3211=0,$_3207=0,$_3203=0,$_3=0,$198=0,$199=.0,$200=0,$201=.0,$202=0,$204=0,$206=0,$207=.0,$208=0,$209=.0;
 var $210=0,$212=.0,$213=.0,$214=.0,$215=.0,$216=0,$218=.0,$219=0,$220=.0,$221=0,$223=0,$225=0,$226=.0,$227=0,$228=.0,$229=0,$231=.0,$232=.0,$233=.0,$234=0;
 var $236=.0,$237=.0,$z2_2=.0,$z1_2=.0,$239=0,$240=.0,$241=0,$242=.0,$243=0,$245=0,$246=.0,$247=.0,$249=.0,$250=.0,$252=.0,$253=.0,$254=.0,$255=.0,$256=.0,$258=.0;
 var $259=.0,$260=.0,$261=.0,$262=.0,$263=.0,$264=.0,$266=.0,$267=0,$269=.0,$270=.0,$271=.0,$272=.0,$273=0,$275=.0,$z2_3=.0,$z1_3=.0,$277=0,$278=.0,$279=0,$280=.0;
 var $281=0,$283=0,$284=.0,$285=.0,$287=.0,$288=.0,$290=.0,$291=.0,$292=.0,$293=.0,$294=.0,$296=.0,$297=.0,$298=.0,$299=.0,$300=.0,$301=.0,$302=.0,$304=.0,$305=0;
 var label=0;
 $1=(($o1+24)|0);
 $2=(+(HEAPF32[(($1)>>2)]));
 $3=(($d1+24)|0);
 $4=(+(HEAPF32[(($3)>>2)]));
 $5=$2<$4;
 do {
  if ($5) {
   $_0=$o1;$_0200=$d1;
  } else {
   $7=$2==$4;
   if ($7) {
    $9=(($o1+28)|0);
    $10=(+(HEAPF32[(($9)>>2)]));
    $11=(($d1+28)|0);
    $12=(+(HEAPF32[(($11)>>2)]));
    $13=$10>$12;
    if (!($13)) {
     $_0=$o1;$_0200=$d1;
     break;
    }
   }
   $_0=$d1;$_0200=$o1;
  }
 } while(0);
 $16=(($o2+24)|0);
 $17=(+(HEAPF32[(($16)>>2)]));
 $18=(($d2+24)|0);
 $19=(+(HEAPF32[(($18)>>2)]));
 $20=$17<$19;
 do {
  if ($20) {
   $_0204=$o2;$_0208=$d2;
  } else {
   $22=$17==$19;
   if ($22) {
    $24=(($o2+28)|0);
    $25=(+(HEAPF32[(($24)>>2)]));
    $26=(($d2+28)|0);
    $27=(+(HEAPF32[(($26)>>2)]));
    $28=$25>$27;
    if (!($28)) {
     $_0204=$o2;$_0208=$d2;
     break;
    }
   }
   $_0204=$d2;$_0208=$o2;
  }
 } while(0);
 $31=(($_0+24)|0);
 $32=(+(HEAPF32[(($31)>>2)]));
 $33=(($_0204+24)|0);
 $34=(+(HEAPF32[(($33)>>2)]));
 $35=$32<$34;
 do {
  if ($35) {
   $_1=$_0;$_1201=$_0200;$_1205=$_0204;$_1209=$_0208;
  } else {
   $37=$32==$34;
   if ($37) {
    $39=(($_0+28)|0);
    $40=(+(HEAPF32[(($39)>>2)]));
    $41=(($_0204+28)|0);
    $42=(+(HEAPF32[(($41)>>2)]));
    $43=$40>$42;
    if (!($43)) {
     $_1=$_0;$_1201=$_0200;$_1205=$_0204;$_1209=$_0208;
     break;
    }
   }
   $_1=$_0204;$_1201=$_0208;$_1205=$_0;$_1209=$_0200;
  }
 } while(0);
 $46=(($_1205+24)|0);
 $47=(+(HEAPF32[(($46)>>2)]));
 $48=(($_1201+24)|0);
 $49=(+(HEAPF32[(($48)>>2)]));
 $50=$47<$49;
 do {
  if ($50) {
   label = 137;
  } else {
   $52=$47==$49;
   if ($52) {
    $54=(($_1205+28)|0);
    $55=(+(HEAPF32[(($54)>>2)]));
    $56=(($_1201+28)|0);
    $57=(+(HEAPF32[(($56)>>2)]));
    $58=$55>$57;
    if (!($58)) {
     label = 137;
     break;
    }
   }
   $60=(+(HEAPF32[(($46)>>2)]));
   $61=(+(HEAPF32[(($48)>>2)]));
   $62=($60)+($61);
   $63=($62)*((0.5));
   $64=(($v+24)|0);
   HEAPF32[(($64)>>2)]=$63;
  }
 } while(0);
 L166: do {
  if ((label|0) == 137) {
   $66=(+(HEAPF32[(($48)>>2)]));
   $67=(($_1209+24)|0);
   $68=(+(HEAPF32[(($67)>>2)]));
   $69=$66<$68;
   do {
    if (!($69)) {
     $71=$66==$68;
     if ($71) {
      $73=(($_1201+28)|0);
      $74=(+(HEAPF32[(($73)>>2)]));
      $75=(($_1209+28)|0);
      $76=(+(HEAPF32[(($75)>>2)]));
      $77=$74>$76;
      if (!($77)) {
       break;
      }
     }
     $117=(+(_tesedgeSign($_1,$_1205,$_1201)));
     $118=(+(_tesedgeSign($_1,$_1209,$_1201)));
     $119=((-.0))-($118);
     $120=($117)-($118);
     $121=$120<(0.0);
     if ($121) {
      $123=((-.0))-($117);
      $z1_1=$123;$z2_1=$118;
     } else {
      $z1_1=$117;$z2_1=$119;
     }
     $125=$z1_1<(0.0);
     $126=($125?(0.0):$z1_1);
     $127=$z2_1<(0.0);
     $128=($127?(0.0):$z2_1);
     $129=$126>$128;
     do {
      if ($129) {
       $144=(+(HEAPF32[(($67)>>2)]));
       $145=(+(HEAPF32[(($46)>>2)]));
       $146=($145)-($144);
       $147=($128)+($126);
       $148=($128)/($147);
       $149=($146)*($148);
       $150=($144)+($149);
       $152=$150;
      } else {
       $131=$128==(0.0);
       $132=(+(HEAPF32[(($46)>>2)]));
       $133=(+(HEAPF32[(($67)>>2)]));
       if ($131) {
        $135=($132)+($133);
        $136=($135)*((0.5));
        $152=$136;
        break;
       } else {
        $138=($133)-($132);
        $139=($128)+($126);
        $140=($126)/($139);
        $141=($138)*($140);
        $142=($132)+($141);
        $152=$142;
        break;
       }
      }
     } while(0);
     $153=(($v+24)|0);
     HEAPF32[(($153)>>2)]=$152;
     break L166;
    }
   } while(0);
   $79=(+(_tesedgeEval($_1,$_1205,$_1201)));
   $80=(+(_tesedgeEval($_1205,$_1201,$_1209)));
   $81=($79)+($80);
   $82=$81<(0.0);
   if ($82) {
    $84=((-.0))-($79);
    $85=((-.0))-($80);
    $z1_0=$84;$z2_0=$85;
   } else {
    $z1_0=$79;$z2_0=$80;
   }
   $87=$z1_0<(0.0);
   $88=($87?(0.0):$z1_0);
   $89=$z2_0<(0.0);
   $90=($89?(0.0):$z2_0);
   $91=$88>$90;
   do {
    if ($91) {
     $106=(+(HEAPF32[(($48)>>2)]));
     $107=(+(HEAPF32[(($46)>>2)]));
     $108=($107)-($106);
     $109=($90)+($88);
     $110=($90)/($109);
     $111=($108)*($110);
     $112=($106)+($111);
     $114=$112;
    } else {
     $93=$90==(0.0);
     $94=(+(HEAPF32[(($46)>>2)]));
     $95=(+(HEAPF32[(($48)>>2)]));
     if ($93) {
      $97=($94)+($95);
      $98=($97)*((0.5));
      $114=$98;
      break;
     } else {
      $100=($95)-($94);
      $101=($90)+($88);
      $102=($88)/($101);
      $103=($100)*($102);
      $104=($94)+($103);
      $114=$104;
      break;
     }
    }
   } while(0);
   $115=(($v+24)|0);
   HEAPF32[(($115)>>2)]=$114;
  }
 } while(0);
 $155=(($_1+28)|0);
 $156=(+(HEAPF32[(($155)>>2)]));
 $157=(($_1201+28)|0);
 $158=(+(HEAPF32[(($157)>>2)]));
 $159=$156<$158;
 do {
  if ($159) {
   $_2=$_1;$_2202=$_1201;
  } else {
   $161=$156==$158;
   if ($161) {
    $163=(($_1+24)|0);
    $164=(+(HEAPF32[(($163)>>2)]));
    $165=(+(HEAPF32[(($48)>>2)]));
    $166=$164>$165;
    if (!($166)) {
     $_2=$_1;$_2202=$_1201;
     break;
    }
   }
   $_2=$_1201;$_2202=$_1;
  }
 } while(0);
 $169=(($_1205+28)|0);
 $170=(+(HEAPF32[(($169)>>2)]));
 $171=(($_1209+28)|0);
 $172=(+(HEAPF32[(($171)>>2)]));
 $173=$170<$172;
 do {
  if ($173) {
   $_2206=$_1205;$_2210=$_1209;
  } else {
   $175=$170==$172;
   if ($175) {
    $177=(+(HEAPF32[(($46)>>2)]));
    $178=(($_1209+24)|0);
    $179=(+(HEAPF32[(($178)>>2)]));
    $180=$177>$179;
    if (!($180)) {
     $_2206=$_1205;$_2210=$_1209;
     break;
    }
   }
   $_2206=$_1209;$_2210=$_1205;
  }
 } while(0);
 $183=(($_2+28)|0);
 $184=(+(HEAPF32[(($183)>>2)]));
 $185=(($_2206+28)|0);
 $186=(+(HEAPF32[(($185)>>2)]));
 $187=$184<$186;
 do {
  if ($187) {
   $_3=$_2;$_3203=$_2202;$_3207=$_2206;$_3211=$_2210;
  } else {
   $189=$184==$186;
   if ($189) {
    $191=(($_2+24)|0);
    $192=(+(HEAPF32[(($191)>>2)]));
    $193=(($_2206+24)|0);
    $194=(+(HEAPF32[(($193)>>2)]));
    $195=$192>$194;
    if (!($195)) {
     $_3=$_2;$_3203=$_2202;$_3207=$_2206;$_3211=$_2210;
     break;
    }
   }
   $_3=$_2206;$_3203=$_2210;$_3207=$_2;$_3211=$_2202;
  }
 } while(0);
 $198=(($_3207+28)|0);
 $199=(+(HEAPF32[(($198)>>2)]));
 $200=(($_3203+28)|0);
 $201=(+(HEAPF32[(($200)>>2)]));
 $202=$199<$201;
 do {
  if (!($202)) {
   $204=$199==$201;
   if ($204) {
    $206=(($_3207+24)|0);
    $207=(+(HEAPF32[(($206)>>2)]));
    $208=(($_3203+24)|0);
    $209=(+(HEAPF32[(($208)>>2)]));
    $210=$207>$209;
    if (!($210)) {
     break;
    }
   }
   $212=(+(HEAPF32[(($198)>>2)]));
   $213=(+(HEAPF32[(($200)>>2)]));
   $214=($212)+($213);
   $215=($214)*((0.5));
   $216=(($v+28)|0);
   HEAPF32[(($216)>>2)]=$215;
   return;
  }
 } while(0);
 $218=(+(HEAPF32[(($200)>>2)]));
 $219=(($_3211+28)|0);
 $220=(+(HEAPF32[(($219)>>2)]));
 $221=$218<$220;
 do {
  if (!($221)) {
   $223=$218==$220;
   if ($223) {
    $225=(($_3203+24)|0);
    $226=(+(HEAPF32[(($225)>>2)]));
    $227=(($_3211+24)|0);
    $228=(+(HEAPF32[(($227)>>2)]));
    $229=$226>$228;
    if (!($229)) {
     break;
    }
   }
   $269=(+(_testransSign($_3,$_3207,$_3203)));
   $270=(+(_testransSign($_3,$_3211,$_3203)));
   $271=((-.0))-($270);
   $272=($269)-($270);
   $273=$272<(0.0);
   if ($273) {
    $275=((-.0))-($269);
    $z1_3=$275;$z2_3=$270;
   } else {
    $z1_3=$269;$z2_3=$271;
   }
   $277=$z1_3<(0.0);
   $278=($277?(0.0):$z1_3);
   $279=$z2_3<(0.0);
   $280=($279?(0.0):$z2_3);
   $281=$278>$280;
   do {
    if ($281) {
     $296=(+(HEAPF32[(($219)>>2)]));
     $297=(+(HEAPF32[(($198)>>2)]));
     $298=($297)-($296);
     $299=($280)+($278);
     $300=($280)/($299);
     $301=($298)*($300);
     $302=($296)+($301);
     $304=$302;
    } else {
     $283=$280==(0.0);
     $284=(+(HEAPF32[(($198)>>2)]));
     $285=(+(HEAPF32[(($219)>>2)]));
     if ($283) {
      $287=($284)+($285);
      $288=($287)*((0.5));
      $304=$288;
      break;
     } else {
      $290=($285)-($284);
      $291=($280)+($278);
      $292=($278)/($291);
      $293=($290)*($292);
      $294=($284)+($293);
      $304=$294;
      break;
     }
    }
   } while(0);
   $305=(($v+28)|0);
   HEAPF32[(($305)>>2)]=$304;
   return;
  }
 } while(0);
 $231=(+(_testransEval($_3,$_3207,$_3203)));
 $232=(+(_testransEval($_3207,$_3203,$_3211)));
 $233=($231)+($232);
 $234=$233<(0.0);
 if ($234) {
  $236=((-.0))-($231);
  $237=((-.0))-($232);
  $z1_2=$236;$z2_2=$237;
 } else {
  $z1_2=$231;$z2_2=$232;
 }
 $239=$z1_2<(0.0);
 $240=($239?(0.0):$z1_2);
 $241=$z2_2<(0.0);
 $242=($241?(0.0):$z2_2);
 $243=$240>$242;
 do {
  if ($243) {
   $258=(+(HEAPF32[(($200)>>2)]));
   $259=(+(HEAPF32[(($198)>>2)]));
   $260=($259)-($258);
   $261=($242)+($240);
   $262=($242)/($261);
   $263=($260)*($262);
   $264=($258)+($263);
   $266=$264;
  } else {
   $245=$242==(0.0);
   $246=(+(HEAPF32[(($198)>>2)]));
   $247=(+(HEAPF32[(($200)>>2)]));
   if ($245) {
    $249=($246)+($247);
    $250=($249)*((0.5));
    $266=$250;
    break;
   } else {
    $252=($247)-($246);
    $253=($242)+($240);
    $254=($240)/($253);
    $255=($252)*($254);
    $256=($246)+($255);
    $266=$256;
    break;
   }
  }
 } while(0);
 $267=(($v+28)|0);
 HEAPF32[(($267)>>2)]=$266;
 return;
}
function _tessMeshMakeEdge($mesh){
 $mesh=($mesh)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$or_cond=0,$14=0,$or_cond25=0,$17=0,$20=0,$23=0,$25=0;
 var $26=0,$27=0,$29=0,$30=0,$31=0,$32=0,$_0=0,label=0;
 $1=(($mesh+136)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=((_bucketAlloc($2))|0);
 $4=$3;
 $5=((HEAP32[(($1)>>2)])|0);
 $6=((_bucketAlloc($5))|0);
 $7=$6;
 $8=(($mesh+140)|0);
 $9=((HEAP32[(($8)>>2)])|0);
 $10=((_bucketAlloc($9))|0);
 $11=$10;
 $12=($3|0)==0;
 $13=($6|0)==0;
 $or_cond=$12|$13;
 $14=($10|0)==0;
 $or_cond25=$or_cond|$14;
 if (!($or_cond25)) {
  $25=(($mesh+68)|0);
  $26=((_MakeEdge($mesh,$25))|0);
  $27=($26|0)==0;
  if ($27) {
   $_0=0;
   return (($_0)|0);
  }
  $29=(($mesh)|0);
  _MakeVertex($4,$26,$29);
  $30=(($26+4)|0);
  $31=((HEAP32[(($30)>>2)])|0);
  _MakeVertex($7,$31,$29);
  $32=(($mesh+44)|0);
  _MakeFace($11,$26,$32);
  $_0=$26;
  return (($_0)|0);
 }
 if (!($12)) {
  $17=((HEAP32[(($1)>>2)])|0);
  _bucketFree($17,$3);
 }
 if (!($13)) {
  $20=((HEAP32[(($1)>>2)])|0);
  _bucketFree($20,$6);
 }
 if ($14) {
  $_0=0;
  return (($_0)|0);
 }
 $23=((HEAP32[(($8)>>2)])|0);
 _bucketFree($23,$10);
 $_0=0;
 return (($_0)|0);
}
function _MakeEdge($mesh,$eNext){
 $mesh=($mesh)|0;
 $eNext=($eNext)|0;
 var $1=0,$2=0,$3=0,$4=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$_eNext=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0;
 var $21=0,$22=0,$23=0,$24=0,$25=0,$26=0,$27=0,$28=0,$29=0,$30=0,$31=0,$32=0,$33=0,$34=0,$35=0,$36=0,$_0=0,label=0;
 $1=(($mesh+132)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=((_bucketAlloc($2))|0);
 $4=($3|0)==0;
 if ($4) {
  $_0=0;
  return (($_0)|0);
 }
 $6=$3;
 $7=(($3+32)|0);
 $8=$7;
 $9=(($eNext+4)|0);
 $10=((HEAP32[(($9)>>2)])|0);
 $11=($10>>>0)<($eNext>>>0);
 $_eNext=($11?$10:$eNext);
 $12=(($_eNext+4)|0);
 $13=((HEAP32[(($12)>>2)])|0);
 $14=(($13)|0);
 $15=((HEAP32[(($14)>>2)])|0);
 $16=$7;
 HEAP32[(($16)>>2)]=$15;
 $17=(($15+4)|0);
 $18=((HEAP32[(($17)>>2)])|0);
 $19=(($18)|0);
 HEAP32[(($19)>>2)]=$6;
 $20=$3;
 HEAP32[(($20)>>2)]=$_eNext;
 $21=((HEAP32[(($12)>>2)])|0);
 $22=(($21)|0);
 HEAP32[(($22)>>2)]=$8;
 $23=(($3+4)|0);
 $24=$23;
 HEAP32[(($24)>>2)]=$8;
 $25=(($3+8)|0);
 $26=$25;
 HEAP32[(($26)>>2)]=$6;
 $27=(($3+12)|0);
 $28=$27;
 HEAP32[(($28)>>2)]=$8;
 $29=(($3+16)|0);
 $30=(($3+36)|0);
 $31=$30;
 _memset((((($29)|0))|0), ((((0)|0))|0), ((((16)|0))|0));
 HEAP32[(($31)>>2)]=$6;
 $32=(($3+40)|0);
 $33=$32;
 HEAP32[(($33)>>2)]=$8;
 $34=(($3+44)|0);
 $35=$34;
 HEAP32[(($35)>>2)]=$6;
 $36=(($3+48)|0);
 _memset((((($36)|0))|0), ((((0)|0))|0), ((((16)|0))|0));
 $_0=$6;
 return (($_0)|0);
}
function _MakeVertex($newVertex,$eOrig,$vNext){
 $newVertex=($newVertex)|0;
 $eOrig=($eOrig)|0;
 $vNext=($vNext)|0;
 var $1=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$e_0=0,$11=0,$12=0,$13=0,$14=0,label=0;
 $1=($newVertex|0)==0;
 if ($1) {
  ___assert_fail(((920)|0),((584)|0),((125)|0),((2080)|0));
 }
 $4=(($vNext+4)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 $6=(($newVertex+4)|0);
 HEAP32[(($6)>>2)]=$5;
 $7=(($5)|0);
 HEAP32[(($7)>>2)]=$newVertex;
 $8=(($newVertex)|0);
 HEAP32[(($8)>>2)]=$vNext;
 HEAP32[(($4)>>2)]=$newVertex;
 $9=(($newVertex+8)|0);
 HEAP32[(($9)>>2)]=$eOrig;
 $e_0=$eOrig;
 while(1) {
  $11=(($e_0+16)|0);
  HEAP32[(($11)>>2)]=$newVertex;
  $12=(($e_0+8)|0);
  $13=((HEAP32[(($12)>>2)])|0);
  $14=($13|0)==($eOrig|0);
  if ($14) {
   break;
  } else {
   $e_0=$13;
  }
 }
 return;
}
function _MakeFace($newFace,$eOrig,$fNext){
 $newFace=($newFace)|0;
 $eOrig=($eOrig)|0;
 $fNext=($fNext)|0;
 var $1=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$e_0=0,$16=0,$17=0,$18=0,$19=0,label=0;
 $1=($newFace|0)==0;
 if ($1) {
  ___assert_fail(((944)|0),((584)|0),((157)|0),((2096)|0));
 }
 $4=(($fNext+4)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 $6=(($newFace+4)|0);
 HEAP32[(($6)>>2)]=$5;
 $7=(($5)|0);
 HEAP32[(($7)>>2)]=$newFace;
 $8=(($newFace)|0);
 HEAP32[(($8)>>2)]=$fNext;
 HEAP32[(($4)>>2)]=$newFace;
 $9=(($newFace+8)|0);
 HEAP32[(($9)>>2)]=$eOrig;
 $10=(($newFace+12)|0);
 HEAP32[(($10)>>2)]=0;
 $11=(($newFace+20)|0);
 HEAP8[($11)]=0;
 $12=(($fNext+21)|0);
 $13=((HEAP8[($12)])|0);
 $14=(($newFace+21)|0);
 HEAP8[($14)]=$13;
 $e_0=$eOrig;
 while(1) {
  $16=(($e_0+20)|0);
  HEAP32[(($16)>>2)]=$newFace;
  $17=(($e_0+12)|0);
  $18=((HEAP32[(($17)>>2)])|0);
  $19=($18|0)==($eOrig|0);
  if ($19) {
   break;
  } else {
   $e_0=$18;
  }
 }
 return;
}
function _tessMeshSplice($mesh,$eOrg,$eDst){
 $mesh=($mesh)|0;
 $eOrg=($eOrg)|0;
 $eDst=($eDst)|0;
 var $1=0,$3=0,$4=0,$5=0,$6=0,$7=0,$joiningVertices_0=0,$10=0,$11=0,$12=0,$13=0,$14=0,$joiningLoops_0=0,$17=0,$19=0,$20=0,$21=0,$22=0,$24=0,$25=0;
 var $26=0,$27=0,$29=0,$31=0,$32=0,$33=0,$34=0,$36=0,$37=0,$38=0,$39=0,$_0=0,label=0;
 $1=($eOrg|0)==($eDst|0);
 if ($1) {
  $_0=1;
  return (($_0)|0);
 }
 $3=(($eDst+16)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($eOrg+16)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=($4|0)==($6|0);
 if ($7) {
  $joiningVertices_0=0;
 } else {
  _KillVertex($mesh,$4,$6);
  $joiningVertices_0=1;
 }
 $10=(($eDst+20)|0);
 $11=((HEAP32[(($10)>>2)])|0);
 $12=(($eOrg+20)|0);
 $13=((HEAP32[(($12)>>2)])|0);
 $14=($11|0)==($13|0);
 if ($14) {
  $joiningLoops_0=0;
 } else {
  _KillFace($mesh,$11,$13);
  $joiningLoops_0=1;
 }
 _Splice($eDst,$eOrg);
 $17=($joiningVertices_0|0)==0;
 do {
  if ($17) {
   $19=(($mesh+136)|0);
   $20=((HEAP32[(($19)>>2)])|0);
   $21=((_bucketAlloc($20))|0);
   $22=($21|0)==0;
   if ($22) {
    $_0=0;
    return (($_0)|0);
   } else {
    $24=$21;
    $25=((HEAP32[(($5)>>2)])|0);
    _MakeVertex($24,$eDst,$25);
    $26=((HEAP32[(($5)>>2)])|0);
    $27=(($26+8)|0);
    HEAP32[(($27)>>2)]=$eOrg;
    break;
   }
  }
 } while(0);
 $29=($joiningLoops_0|0)==0;
 if (!($29)) {
  $_0=1;
  return (($_0)|0);
 }
 $31=(($mesh+140)|0);
 $32=((HEAP32[(($31)>>2)])|0);
 $33=((_bucketAlloc($32))|0);
 $34=($33|0)==0;
 if ($34) {
  $_0=0;
  return (($_0)|0);
 }
 $36=$33;
 $37=((HEAP32[(($12)>>2)])|0);
 _MakeFace($36,$eDst,$37);
 $38=((HEAP32[(($12)>>2)])|0);
 $39=(($38+8)|0);
 HEAP32[(($39)>>2)]=$eOrg;
 $_0=1;
 return (($_0)|0);
}
function _KillVertex($mesh,$vDel,$newOrg){
 $mesh=($mesh)|0;
 $vDel=($vDel)|0;
 $newOrg=($newOrg)|0;
 var $1=0,$2=0,$e_0=0,$4=0,$5=0,$6=0,$7=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,label=0;
 $1=(($vDel+8)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $e_0=$2;
 while(1) {
  $4=(($e_0+16)|0);
  HEAP32[(($4)>>2)]=$newOrg;
  $5=(($e_0+8)|0);
  $6=((HEAP32[(($5)>>2)])|0);
  $7=($6|0)==($2|0);
  if ($7) {
   break;
  } else {
   $e_0=$6;
  }
 }
 $9=(($vDel+4)|0);
 $10=((HEAP32[(($9)>>2)])|0);
 $11=(($vDel)|0);
 $12=((HEAP32[(($11)>>2)])|0);
 $13=(($12+4)|0);
 HEAP32[(($13)>>2)]=$10;
 $14=(($10)|0);
 HEAP32[(($14)>>2)]=$12;
 $15=(($mesh+136)|0);
 $16=((HEAP32[(($15)>>2)])|0);
 $17=$vDel;
 _bucketFree($16,$17);
 return;
}
function _KillFace($mesh,$fDel,$newLface){
 $mesh=($mesh)|0;
 $fDel=($fDel)|0;
 $newLface=($newLface)|0;
 var $1=0,$2=0,$e_0=0,$4=0,$5=0,$6=0,$7=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,label=0;
 $1=(($fDel+8)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $e_0=$2;
 while(1) {
  $4=(($e_0+20)|0);
  HEAP32[(($4)>>2)]=$newLface;
  $5=(($e_0+12)|0);
  $6=((HEAP32[(($5)>>2)])|0);
  $7=($6|0)==($2|0);
  if ($7) {
   break;
  } else {
   $e_0=$6;
  }
 }
 $9=(($fDel+4)|0);
 $10=((HEAP32[(($9)>>2)])|0);
 $11=(($fDel)|0);
 $12=((HEAP32[(($11)>>2)])|0);
 $13=(($12+4)|0);
 HEAP32[(($13)>>2)]=$10;
 $14=(($10)|0);
 HEAP32[(($14)>>2)]=$12;
 $15=(($mesh+140)|0);
 $16=((HEAP32[(($15)>>2)])|0);
 $17=$fDel;
 _bucketFree($16,$17);
 return;
}
function _Splice($a,$b){
 $a=($a)|0;
 $b=($b)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,label=0;
 $1=(($a+8)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($b+8)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($2+4)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=(($6+12)|0);
 HEAP32[(($7)>>2)]=$b;
 $8=(($4+4)|0);
 $9=((HEAP32[(($8)>>2)])|0);
 $10=(($9+12)|0);
 HEAP32[(($10)>>2)]=$a;
 HEAP32[(($1)>>2)]=$4;
 HEAP32[(($3)>>2)]=$2;
 return;
}
function _tessMeshDelete($mesh,$eDel){
 $mesh=($mesh)|0;
 $eDel=($eDel)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$joiningLoops_0=0,$10=0,$11=0,$12=0,$14=0,$15=0,$17=0,$18=0,$19=0,$20=0,$21=0,$22=0,$23=0;
 var $24=0,$25=0,$26=0,$27=0,$28=0,$29=0,$30=0,$32=0,$33=0,$34=0,$35=0,$37=0,$38=0,$40=0,$41=0,$42=0,$44=0,$45=0,$46=0,$48=0;
 var $49=0,$50=0,$51=0,$52=0,$53=0,$54=0,$55=0,$56=0,$57=0,$58=0,$59=0,$60=0,$_0=0,label=0;
 $1=(($eDel+4)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($eDel+20)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($2+20)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=($4|0)==($6|0);
 if ($7) {
  $joiningLoops_0=0;
 } else {
  _KillFace($mesh,$4,$6);
  $joiningLoops_0=1;
 }
 $10=(($eDel+8)|0);
 $11=((HEAP32[(($10)>>2)])|0);
 $12=($11|0)==($eDel|0);
 do {
  if ($12) {
   $14=(($eDel+16)|0);
   $15=((HEAP32[(($14)>>2)])|0);
   _KillVertex($mesh,$15,0);
  } else {
   $17=((HEAP32[(($1)>>2)])|0);
   $18=(($17+12)|0);
   $19=((HEAP32[(($18)>>2)])|0);
   $20=(($17+20)|0);
   $21=((HEAP32[(($20)>>2)])|0);
   $22=(($21+8)|0);
   HEAP32[(($22)>>2)]=$19;
   $23=((HEAP32[(($10)>>2)])|0);
   $24=(($eDel+16)|0);
   $25=((HEAP32[(($24)>>2)])|0);
   $26=(($25+8)|0);
   HEAP32[(($26)>>2)]=$23;
   $27=((HEAP32[(($1)>>2)])|0);
   $28=(($27+12)|0);
   $29=((HEAP32[(($28)>>2)])|0);
   _Splice($eDel,$29);
   $30=($joiningLoops_0|0)==0;
   if (!($30)) {
    break;
   }
   $32=(($mesh+140)|0);
   $33=((HEAP32[(($32)>>2)])|0);
   $34=((_bucketAlloc($33))|0);
   $35=($34|0)==0;
   if ($35) {
    $_0=0;
    return (($_0)|0);
   } else {
    $37=$34;
    $38=((HEAP32[(($3)>>2)])|0);
    _MakeFace($37,$eDel,$38);
    break;
   }
  }
 } while(0);
 $40=(($2+8)|0);
 $41=((HEAP32[(($40)>>2)])|0);
 $42=($41|0)==($2|0);
 if ($42) {
  $44=(($2+16)|0);
  $45=((HEAP32[(($44)>>2)])|0);
  _KillVertex($mesh,$45,0);
  $46=((HEAP32[(($5)>>2)])|0);
  _KillFace($mesh,$46,0);
 } else {
  $48=(($2+4)|0);
  $49=((HEAP32[(($48)>>2)])|0);
  $50=(($49+12)|0);
  $51=((HEAP32[(($50)>>2)])|0);
  $52=((HEAP32[(($3)>>2)])|0);
  $53=(($52+8)|0);
  HEAP32[(($53)>>2)]=$51;
  $54=((HEAP32[(($40)>>2)])|0);
  $55=(($2+16)|0);
  $56=((HEAP32[(($55)>>2)])|0);
  $57=(($56+8)|0);
  HEAP32[(($57)>>2)]=$54;
  $58=((HEAP32[(($48)>>2)])|0);
  $59=(($58+12)|0);
  $60=((HEAP32[(($59)>>2)])|0);
  _Splice($2,$60);
 }
 _KillEdge($mesh,$eDel);
 $_0=1;
 return (($_0)|0);
}
function _KillEdge($mesh,$eDel){
 $mesh=($mesh)|0;
 $eDel=($eDel)|0;
 var $1=0,$2=0,$3=0,$_eDel=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,label=0;
 $1=(($eDel+4)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=($2>>>0)<($eDel>>>0);
 $_eDel=($3?$2:$eDel);
 $4=(($_eDel)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 $6=(($_eDel+4)|0);
 $7=((HEAP32[(($6)>>2)])|0);
 $8=(($7)|0);
 $9=((HEAP32[(($8)>>2)])|0);
 $10=(($5+4)|0);
 $11=((HEAP32[(($10)>>2)])|0);
 $12=(($11)|0);
 HEAP32[(($12)>>2)]=$9;
 $13=(($9+4)|0);
 $14=((HEAP32[(($13)>>2)])|0);
 $15=(($14)|0);
 HEAP32[(($15)>>2)]=$5;
 $16=(($mesh+132)|0);
 $17=((HEAP32[(($16)>>2)])|0);
 $18=$_eDel;
 _bucketFree($17,$18);
 return;
}
function _tessMeshAddEdgeVertex($mesh,$eOrg){
 $mesh=($mesh)|0;
 $eOrg=($eOrg)|0;
 var $1=0,$2=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$18=0,$19=0,$20=0,$21=0,$22=0;
 var $23=0,$_0=0,label=0;
 $1=((_MakeEdge($mesh,$eOrg))|0);
 $2=($1|0)==0;
 if ($2) {
  $_0=0;
  return (($_0)|0);
 }
 $4=(($1+4)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 $6=(($eOrg+12)|0);
 $7=((HEAP32[(($6)>>2)])|0);
 _Splice($1,$7);
 $8=(($eOrg+4)|0);
 $9=((HEAP32[(($8)>>2)])|0);
 $10=(($9+16)|0);
 $11=((HEAP32[(($10)>>2)])|0);
 $12=(($1+16)|0);
 HEAP32[(($12)>>2)]=$11;
 $13=(($mesh+136)|0);
 $14=((HEAP32[(($13)>>2)])|0);
 $15=((_bucketAlloc($14))|0);
 $16=($15|0)==0;
 if ($16) {
  $_0=0;
  return (($_0)|0);
 }
 $18=$15;
 $19=((HEAP32[(($12)>>2)])|0);
 _MakeVertex($18,$5,$19);
 $20=(($eOrg+20)|0);
 $21=((HEAP32[(($20)>>2)])|0);
 $22=(($5+20)|0);
 HEAP32[(($22)>>2)]=$21;
 $23=(($1+20)|0);
 HEAP32[(($23)>>2)]=$21;
 $_0=$1;
 return (($_0)|0);
}
function _tessMeshSplitEdge($mesh,$eOrg){
 $mesh=($mesh)|0;
 $eOrg=($eOrg)|0;
 var $1=0,$2=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0,$21=0;
 var $22=0,$23=0,$24=0,$25=0,$26=0,$27=0,$28=0,$29=0,$30=0,$31=0,$32=0,$33=0,$34=0,$_0=0,label=0;
 $1=((_tessMeshAddEdgeVertex($mesh,$eOrg))|0);
 $2=($1|0)==0;
 if ($2) {
  $_0=0;
  return (($_0)|0);
 }
 $4=(($1+4)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 $6=(($eOrg+4)|0);
 $7=((HEAP32[(($6)>>2)])|0);
 $8=(($7+4)|0);
 $9=((HEAP32[(($8)>>2)])|0);
 $10=(($9+12)|0);
 $11=((HEAP32[(($10)>>2)])|0);
 _Splice($7,$11);
 $12=((HEAP32[(($6)>>2)])|0);
 _Splice($12,$5);
 $13=(($5+16)|0);
 $14=((HEAP32[(($13)>>2)])|0);
 $15=((HEAP32[(($6)>>2)])|0);
 $16=(($15+16)|0);
 HEAP32[(($16)>>2)]=$14;
 $17=(($5+4)|0);
 $18=((HEAP32[(($17)>>2)])|0);
 $19=(($18+16)|0);
 $20=((HEAP32[(($19)>>2)])|0);
 $21=(($20+8)|0);
 HEAP32[(($21)>>2)]=$18;
 $22=((HEAP32[(($6)>>2)])|0);
 $23=(($22+20)|0);
 $24=((HEAP32[(($23)>>2)])|0);
 $25=((HEAP32[(($17)>>2)])|0);
 $26=(($25+20)|0);
 HEAP32[(($26)>>2)]=$24;
 $27=(($eOrg+28)|0);
 $28=((HEAP32[(($27)>>2)])|0);
 $29=(($5+28)|0);
 HEAP32[(($29)>>2)]=$28;
 $30=((HEAP32[(($6)>>2)])|0);
 $31=(($30+28)|0);
 $32=((HEAP32[(($31)>>2)])|0);
 $33=((HEAP32[(($17)>>2)])|0);
 $34=(($33+28)|0);
 HEAP32[(($34)>>2)]=$32;
 $_0=$5;
 return (($_0)|0);
}
function _tessMeshConnect($mesh,$eOrg,$eDst){
 $mesh=($mesh)|0;
 $eOrg=($eOrg)|0;
 $eDst=($eDst)|0;
 var $1=0,$2=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$joiningLoops_0=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0,$21=0,$22=0;
 var $23=0,$24=0,$25=0,$26=0,$27=0,$29=0,$30=0,$31=0,$32=0,$34=0,$35=0,$_0=0,label=0;
 $1=((_MakeEdge($mesh,$eOrg))|0);
 $2=($1|0)==0;
 if ($2) {
  $_0=0;
  return (($_0)|0);
 }
 $4=(($1+4)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 $6=(($eDst+20)|0);
 $7=((HEAP32[(($6)>>2)])|0);
 $8=(($eOrg+20)|0);
 $9=((HEAP32[(($8)>>2)])|0);
 $10=($7|0)==($9|0);
 if ($10) {
  $joiningLoops_0=0;
 } else {
  _KillFace($mesh,$7,$9);
  $joiningLoops_0=1;
 }
 $13=(($eOrg+12)|0);
 $14=((HEAP32[(($13)>>2)])|0);
 _Splice($1,$14);
 _Splice($5,$eDst);
 $15=(($eOrg+4)|0);
 $16=((HEAP32[(($15)>>2)])|0);
 $17=(($16+16)|0);
 $18=((HEAP32[(($17)>>2)])|0);
 $19=(($1+16)|0);
 HEAP32[(($19)>>2)]=$18;
 $20=(($eDst+16)|0);
 $21=((HEAP32[(($20)>>2)])|0);
 $22=(($5+16)|0);
 HEAP32[(($22)>>2)]=$21;
 $23=((HEAP32[(($8)>>2)])|0);
 $24=(($5+20)|0);
 HEAP32[(($24)>>2)]=$23;
 $25=(($1+20)|0);
 HEAP32[(($25)>>2)]=$23;
 $26=((HEAP32[(($8)>>2)])|0);
 $27=(($26+8)|0);
 HEAP32[(($27)>>2)]=$5;
 if ($joiningLoops_0) {
  $_0=$1;
  return (($_0)|0);
 }
 $29=(($mesh+140)|0);
 $30=((HEAP32[(($29)>>2)])|0);
 $31=((_bucketAlloc($30))|0);
 $32=($31|0)==0;
 if ($32) {
  $_0=0;
  return (($_0)|0);
 }
 $34=$31;
 $35=((HEAP32[(($8)>>2)])|0);
 _MakeFace($34,$1,$35);
 $_0=$1;
 return (($_0)|0);
}
function _tessMeshNewMesh($alloc){
 $alloc=($alloc)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$9=0,$10=0,$11=0,$13=0,$16=0,$17=0,$18=0,$20=0,$23=0,$24=0,$25=0,$27=0,$30=0;
 var $31=0,$32=0,$33=0,$34=0,$35=0,$36=0,$37=0,$38=0,$39=0,$40=0,$41=0,$42=0,$43=0,$44=0,$45=0,$46=0,$47=0,$48=0,$49=0,$50=0;
 var $51=0,$52=0,$53=0,$54=0,$55=0,$56=0,$57=0,$58=0,$59=0,$60=0,$61=0,$62=0,$63=0,$64=0,$65=0,$66=0,$67=0,$68=0,$69=0,$70=0;
 var $_0=0,label=0;
 $1=(($alloc)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($alloc+12)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=((FUNCTION_TABLE_iii[($2)&7]($4,144))|0);
 $6=$5;
 $7=($5|0)==0;
 if ($7) {
  $_0=0;
  return (($_0)|0);
 }
 $9=(($alloc+16)|0);
 $10=((HEAP32[(($9)>>2)])|0);
 $11=($10|0)<16;
 do {
  if ($11) {
   HEAP32[(($9)>>2)]=16;
  } else {
   $13=($10|0)>4096;
   if (!($13)) {
    break;
   }
   HEAP32[(($9)>>2)]=4096;
  }
 } while(0);
 $16=(($alloc+20)|0);
 $17=((HEAP32[(($16)>>2)])|0);
 $18=($17|0)<16;
 do {
  if ($18) {
   HEAP32[(($16)>>2)]=16;
  } else {
   $20=($17|0)>4096;
   if (!($20)) {
    break;
   }
   HEAP32[(($16)>>2)]=4096;
  }
 } while(0);
 $23=(($alloc+24)|0);
 $24=((HEAP32[(($23)>>2)])|0);
 $25=($24|0)<16;
 do {
  if ($25) {
   HEAP32[(($23)>>2)]=16;
  } else {
   $27=($24|0)>4096;
   if (!($27)) {
    break;
   }
   HEAP32[(($23)>>2)]=4096;
  }
 } while(0);
 $30=((HEAP32[(($9)>>2)])|0);
 $31=((_createBucketAlloc($alloc,688,64,$30))|0);
 $32=(($5+132)|0);
 $33=$32;
 HEAP32[(($33)>>2)]=$31;
 $34=((HEAP32[(($16)>>2)])|0);
 $35=((_createBucketAlloc($alloc,1360,44,$34))|0);
 $36=(($5+136)|0);
 $37=$36;
 HEAP32[(($37)>>2)]=$35;
 $38=((HEAP32[(($23)>>2)])|0);
 $39=((_createBucketAlloc($alloc,736,24,$38))|0);
 $40=(($5+140)|0);
 $41=$40;
 HEAP32[(($41)>>2)]=$39;
 $42=$5;
 $43=(($5+44)|0);
 $44=$43;
 $45=(($5+68)|0);
 $46=$45;
 $47=(($5+100)|0);
 $48=$47;
 $49=(($5+4)|0);
 $50=$49;
 HEAP32[(($50)>>2)]=$42;
 $51=$5;
 HEAP32[(($51)>>2)]=$42;
 $52=(($5+8)|0);
 $53=$52;
 HEAP32[(($53)>>2)]=0;
 $54=(($5+48)|0);
 $55=$54;
 HEAP32[(($55)>>2)]=$44;
 $56=$43;
 HEAP32[(($56)>>2)]=$44;
 $57=(($5+52)|0);
 $58=$57;
 HEAP32[(($58)>>2)]=0;
 $59=(($5+56)|0);
 $60=$59;
 HEAP32[(($60)>>2)]=0;
 $61=(($5+64)|0);
 HEAP8[($61)]=0;
 $62=(($5+65)|0);
 HEAP8[($62)]=0;
 $63=$45;
 HEAP32[(($63)>>2)]=$46;
 $64=(($5+72)|0);
 $65=$64;
 HEAP32[(($65)>>2)]=$48;
 $66=(($5+76)|0);
 $67=$47;
 _memset((((($66)|0))|0), ((((0)|0))|0), ((((24)|0))|0));
 HEAP32[(($67)>>2)]=$48;
 $68=(($5+104)|0);
 $69=$68;
 HEAP32[(($69)>>2)]=$46;
 $70=(($5+108)|0);
 _memset((((($70)|0))|0), ((((0)|0))|0), ((((24)|0))|0));
 $_0=$6;
 return (($_0)|0);
}
function _tessMeshMergeConvexFaces($mesh,$maxVertsPerFace){
 $mesh=($mesh)|0;
 $maxVertsPerFace=($maxVertsPerFace)|0;
 var $1=0,$f_0_in26=0,$f_027=0,$2=0,$f_028=0,$3=0,$4=0,$5=0,$f_0_in=0,$f_0=0,$6=0,$8=0,$9=0,$10=0,$11=0,$eCur_0=0,$12=0,$13=0,$14=0,$15=0;
 var $16=0,$18=0,$19=0,$20=0,$22=0,$23=0,$24=0,$26=0,$27=0,$28=0,$29=0,$30=0,$32=0,$33=0,$34=0,$35=0,$36=0,$37=0,$38=0,$39=0;
 var $40=0,$41=0,$42=0,$43=0,$44=0,$45=0,$46=0,$47=0,$49=0,$50=0,$51=0,$52=0,$53=0,$54=0,$55=0,$56=0,$57=0,$58=0,$59=0,$60=0;
 var $61=0,$62=0,$63=0,$65=0,$66=0,$67=0,$69=0,$71=0,$72=0,$73=0,$74=0,$75=0,$_0=0,label=0;
 $1=(($mesh+44)|0);
 $f_0_in26=(($1)|0);
 $f_027=((HEAP32[(($f_0_in26)>>2)])|0);
 $2=($f_027|0)==($1|0);
 if ($2) {
  $_0=1;
  return (($_0)|0);
 } else {
  $f_028=$f_027;
 }
 L385: while(1) {
  $3=(($f_028+21)|0);
  $4=((HEAP8[($3)])|0);
  $5=(($4<<24)>>24)==0;
  if (!($5)) {
   $8=(($f_028+8)|0);
   $9=((HEAP32[(($8)>>2)])|0);
   $10=(($9+16)|0);
   $11=((HEAP32[(($10)>>2)])|0);
   $eCur_0=$9;
   L389: while(1) {
    $12=(($eCur_0+12)|0);
    $13=((HEAP32[(($12)>>2)])|0);
    $14=(($eCur_0+4)|0);
    $15=((HEAP32[(($14)>>2)])|0);
    $16=($15|0)==0;
    do {
     if (!($16)) {
      $18=(($15+20)|0);
      $19=((HEAP32[(($18)>>2)])|0);
      $20=($19|0)==0;
      if ($20) {
       break;
      }
      $22=(($19+21)|0);
      $23=((HEAP8[($22)])|0);
      $24=(($23<<24)>>24)==0;
      if ($24) {
       break;
      }
      $26=((_CountFaceVerts($f_028))|0);
      $27=((_CountFaceVerts($19))|0);
      $28=((($26)-(2))|0);
      $29=((($28)+($27))|0);
      $30=($29|0)>($maxVertsPerFace|0);
      if ($30) {
       break;
      }
      $32=(($eCur_0+8)|0);
      $33=((HEAP32[(($32)>>2)])|0);
      $34=(($33+4)|0);
      $35=((HEAP32[(($34)>>2)])|0);
      $36=(($35+16)|0);
      $37=((HEAP32[(($36)>>2)])|0);
      $38=(($eCur_0+16)|0);
      $39=((HEAP32[(($38)>>2)])|0);
      $40=(($15+12)|0);
      $41=((HEAP32[(($40)>>2)])|0);
      $42=(($41+12)|0);
      $43=((HEAP32[(($42)>>2)])|0);
      $44=(($43+16)|0);
      $45=((HEAP32[(($44)>>2)])|0);
      $46=((_tesvertCCW($37,$39,$45))|0);
      $47=($46|0)==0;
      if ($47) {
       break;
      }
      $49=(($15+8)|0);
      $50=((HEAP32[(($49)>>2)])|0);
      $51=(($50+4)|0);
      $52=((HEAP32[(($51)>>2)])|0);
      $53=(($52+16)|0);
      $54=((HEAP32[(($53)>>2)])|0);
      $55=(($15+16)|0);
      $56=((HEAP32[(($55)>>2)])|0);
      $57=((HEAP32[(($12)>>2)])|0);
      $58=(($57+12)|0);
      $59=((HEAP32[(($58)>>2)])|0);
      $60=(($59+16)|0);
      $61=((HEAP32[(($60)>>2)])|0);
      $62=((_tesvertCCW($54,$56,$61))|0);
      $63=($62|0)==0;
      if ($63) {
       break;
      }
      $65=((HEAP32[(($40)>>2)])|0);
      $66=((_tessMeshDelete($mesh,$15))|0);
      $67=($66|0)==0;
      if ($67) {
       $_0=0;
       label = 319;
       break L385;
      } else {
       $eCur_0=$65;
       continue L389;
      }
     }
    } while(0);
    $69=($eCur_0|0)==0;
    if ($69) {
     $eCur_0=$13;
     continue;
    }
    $71=(($eCur_0+12)|0);
    $72=((HEAP32[(($71)>>2)])|0);
    $73=(($72+16)|0);
    $74=((HEAP32[(($73)>>2)])|0);
    $75=($74|0)==($11|0);
    if ($75) {
     break;
    } else {
     $eCur_0=$13;
    }
   }
  }
  $f_0_in=(($f_028)|0);
  $f_0=((HEAP32[(($f_0_in)>>2)])|0);
  $6=($f_0|0)==($1|0);
  if ($6) {
   $_0=1;
   label = 318;
   break;
  } else {
   $f_028=$f_0;
  }
 }
 if ((label|0) == 318) {
  return (($_0)|0);
 }
 else if ((label|0) == 319) {
  return (($_0)|0);
 }
  return 0;
}
function _CountFaceVerts($f){
 $f=($f)|0;
 var $1=0,$2=0,$eCur_0=0,$n_0=0,$4=0,$5=0,$6=0,$7=0,label=0;
 $1=(($f+8)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $n_0=0;$eCur_0=$2;
 while(1) {
  $4=((($n_0)+(1))|0);
  $5=(($eCur_0+12)|0);
  $6=((HEAP32[(($5)>>2)])|0);
  $7=($6|0)==($2|0);
  if ($7) {
   break;
  } else {
   $n_0=$4;$eCur_0=$6;
  }
 }
 return (($4)|0);
}
function _tessMeshDeleteMesh($alloc,$mesh){
 $alloc=($alloc)|0;
 $mesh=($mesh)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,label=0;
 $1=(($mesh+132)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 _deleteBucketAlloc($2);
 $3=(($mesh+136)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 _deleteBucketAlloc($4);
 $5=(($mesh+140)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 _deleteBucketAlloc($6);
 $7=(($alloc+8)|0);
 $8=((HEAP32[(($7)>>2)])|0);
 $9=(($alloc+12)|0);
 $10=((HEAP32[(($9)>>2)])|0);
 $11=$mesh;
 FUNCTION_TABLE_vii[($8)&7]($10,$11);
 return;
}
function _tessMeshCheckMesh($mesh){
 $mesh=($mesh)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$20=0,$21=0,$e_0=0;
 var $23=0,$24=0,$25=0,$28=0,$29=0,$30=0,$33=0,$34=0,$35=0,$36=0,$37=0,$38=0,$39=0,$42=0,$43=0,$44=0,$45=0,$46=0,$47=0,$48=0;
 var $51=0,$52=0,$53=0,$56=0,$57=0,$_lcssa110=0,$_lcssa103=0,$59=0,$60=0,$61=0,$62=0,$63=0,$64=0,$65=0,$66=0,$67=0,$69=0,$70=0,$71=0,$72=0;
 var $73=0,$74=0,$75=0,$76=0,$79=0,$80=0,$e_1=0,$82=0,$83=0,$84=0,$87=0,$88=0,$89=0,$92=0,$93=0,$94=0,$95=0,$96=0,$97=0,$98=0;
 var $101=0,$102=0,$103=0,$104=0,$105=0,$106=0,$107=0,$110=0,$111=0,$112=0,$115=0,$116=0,$_lcssa94=0,$_lcssa87=0,$118=0,$119=0,$120=0,$ePrev_0=0,$122=0,$123=0;
 var $124=0,$125=0,$126=0,$127=0,$128=0,$129=0,$130=0,$131=0,$135=0,$138=0,$139=0,$140=0,$143=0,$144=0,$145=0,$148=0,$149=0,$150=0,$153=0,$154=0;
 var $155=0,$156=0,$157=0,$158=0,$159=0,$162=0,$163=0,$164=0,$165=0,$166=0,$167=0,$168=0,$172=0,$173=0,$175=0,$176=0,$177=0,$179=0,$180=0,$181=0;
 var $183=0,$184=0,$185=0,$187=0,$188=0,$189=0,$191=0,$192=0,$193=0,label=0;
 $1=(($mesh+44)|0);
 $2=(($mesh)|0);
 $3=(($mesh+68)|0);
 $4=(($1)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 $6=($5|0)==($1|0);
 $7=(($5+4)|0);
 $8=((HEAP32[(($7)>>2)])|0);
 $9=($8|0)==($1|0);
 L410: do {
  if ($6) {
   $_lcssa103=$5;$_lcssa110=$9;
  } else {
   $17=$5;$16=$9;
   L411: while(1) {
    if (!($16)) {
     label = 327;
     break;
    }
    $20=(($17+8)|0);
    $21=((HEAP32[(($20)>>2)])|0);
    $e_0=$21;
    while(1) {
     $23=(($e_0+4)|0);
     $24=((HEAP32[(($23)>>2)])|0);
     $25=($24|0)==($e_0|0);
     if ($25) {
      label = 330;
      break L411;
     }
     $28=(($24+4)|0);
     $29=((HEAP32[(($28)>>2)])|0);
     $30=($29|0)==($e_0|0);
     if (!($30)) {
      label = 332;
      break L411;
     }
     $33=(($e_0+12)|0);
     $34=((HEAP32[(($33)>>2)])|0);
     $35=(($34+8)|0);
     $36=((HEAP32[(($35)>>2)])|0);
     $37=(($36+4)|0);
     $38=((HEAP32[(($37)>>2)])|0);
     $39=($38|0)==($e_0|0);
     if (!($39)) {
      label = 334;
      break L411;
     }
     $42=(($e_0+8)|0);
     $43=((HEAP32[(($42)>>2)])|0);
     $44=(($43+4)|0);
     $45=((HEAP32[(($44)>>2)])|0);
     $46=(($45+12)|0);
     $47=((HEAP32[(($46)>>2)])|0);
     $48=($47|0)==($e_0|0);
     if (!($48)) {
      label = 336;
      break L411;
     }
     $51=(($e_0+20)|0);
     $52=((HEAP32[(($51)>>2)])|0);
     $53=($52|0)==($17|0);
     if (!($53)) {
      label = 338;
      break L411;
     }
     $56=((HEAP32[(($20)>>2)])|0);
     $57=($34|0)==($56|0);
     if ($57) {
      break;
     } else {
      $e_0=$34;
     }
    }
    $10=(($17)|0);
    $11=((HEAP32[(($10)>>2)])|0);
    $12=($11|0)==($1|0);
    $13=(($11+4)|0);
    $14=((HEAP32[(($13)>>2)])|0);
    $15=($14|0)==($17|0);
    if ($12) {
     $_lcssa103=$11;$_lcssa110=$15;
     break L410;
    } else {
     $17=$11;$16=$15;
    }
   }
   if ((label|0) == 334) {
    ___assert_fail(((264)|0),((584)|0),((803)|0),((1888)|0));
   }
   else if ((label|0) == 327) {
    ___assert_fail(((616)|0),((584)|0),((798)|0),((1888)|0));
   }
   else if ((label|0) == 330) {
    ___assert_fail(((448)|0),((584)|0),((801)|0),((1888)|0));
   }
   else if ((label|0) == 332) {
    ___assert_fail(((376)|0),((584)|0),((802)|0),((1888)|0));
   }
   else if ((label|0) == 338) {
    ___assert_fail(((96)|0),((584)|0),((805)|0),((1888)|0));
   }
   else if ((label|0) == 336) {
    ___assert_fail(((144)|0),((584)|0),((804)|0),((1888)|0));
   }
  }
 } while(0);
 if (!($_lcssa110)) {
  ___assert_fail(((1736)|0),((584)|0),((809)|0),((1888)|0));
 }
 $59=(($_lcssa103+8)|0);
 $60=((HEAP32[(($59)>>2)])|0);
 $61=($60|0)==0;
 if (!($61)) {
  ___assert_fail(((1736)|0),((584)|0),((809)|0),((1888)|0));
 }
 $62=(($mesh)|0);
 $63=((HEAP32[(($62)>>2)])|0);
 $64=($63|0)==($2|0);
 $65=(($63+4)|0);
 $66=((HEAP32[(($65)>>2)])|0);
 $67=($66|0)==($2|0);
 L436: do {
  if ($64) {
   $_lcssa87=$63;$_lcssa94=$67;
  } else {
   $76=$63;$75=$67;
   L437: while(1) {
    if (!($75)) {
     label = 346;
     break;
    }
    $79=(($76+8)|0);
    $80=((HEAP32[(($79)>>2)])|0);
    $e_1=$80;
    while(1) {
     $82=(($e_1+4)|0);
     $83=((HEAP32[(($82)>>2)])|0);
     $84=($83|0)==($e_1|0);
     if ($84) {
      label = 349;
      break L437;
     }
     $87=(($83+4)|0);
     $88=((HEAP32[(($87)>>2)])|0);
     $89=($88|0)==($e_1|0);
     if (!($89)) {
      label = 351;
      break L437;
     }
     $92=(($e_1+12)|0);
     $93=((HEAP32[(($92)>>2)])|0);
     $94=(($93+8)|0);
     $95=((HEAP32[(($94)>>2)])|0);
     $96=(($95+4)|0);
     $97=((HEAP32[(($96)>>2)])|0);
     $98=($97|0)==($e_1|0);
     if (!($98)) {
      label = 353;
      break L437;
     }
     $101=(($e_1+8)|0);
     $102=((HEAP32[(($101)>>2)])|0);
     $103=(($102+4)|0);
     $104=((HEAP32[(($103)>>2)])|0);
     $105=(($104+12)|0);
     $106=((HEAP32[(($105)>>2)])|0);
     $107=($106|0)==($e_1|0);
     if (!($107)) {
      label = 355;
      break L437;
     }
     $110=(($e_1+16)|0);
     $111=((HEAP32[(($110)>>2)])|0);
     $112=($111|0)==($76|0);
     if (!($112)) {
      label = 357;
      break L437;
     }
     $115=((HEAP32[(($79)>>2)])|0);
     $116=($102|0)==($115|0);
     if ($116) {
      break;
     } else {
      $e_1=$102;
     }
    }
    $69=(($76)|0);
    $70=((HEAP32[(($69)>>2)])|0);
    $71=($70|0)==($2|0);
    $72=(($70+4)|0);
    $73=((HEAP32[(($72)>>2)])|0);
    $74=($73|0)==($76|0);
    if ($71) {
     $_lcssa87=$70;$_lcssa94=$74;
     break L436;
    } else {
     $76=$70;$75=$74;
    }
   }
   if ((label|0) == 349) {
    ___assert_fail(((448)|0),((584)|0),((816)|0),((1888)|0));
   }
   else if ((label|0) == 351) {
    ___assert_fail(((376)|0),((584)|0),((817)|0),((1888)|0));
   }
   else if ((label|0) == 353) {
    ___assert_fail(((264)|0),((584)|0),((818)|0),((1888)|0));
   }
   else if ((label|0) == 346) {
    ___assert_fail(((1664)|0),((584)|0),((813)|0),((1888)|0));
   }
   else if ((label|0) == 355) {
    ___assert_fail(((144)|0),((584)|0),((819)|0),((1888)|0));
   }
   else if ((label|0) == 357) {
    ___assert_fail(((1488)|0),((584)|0),((820)|0),((1888)|0));
   }
  }
 } while(0);
 if (!($_lcssa94)) {
  ___assert_fail(((1416)|0),((584)|0),((824)|0),((1888)|0));
 }
 $118=(($_lcssa87+8)|0);
 $119=((HEAP32[(($118)>>2)])|0);
 $120=($119|0)==0;
 if ($120) {
  $ePrev_0=$3;
 } else {
  ___assert_fail(((1416)|0),((584)|0),((824)|0),((1888)|0));
 }
 while(1) {
  $122=(($ePrev_0)|0);
  $123=((HEAP32[(($122)>>2)])|0);
  $124=($123|0)==($3|0);
  $125=(($123+4)|0);
  $126=((HEAP32[(($125)>>2)])|0);
  $127=(($126)|0);
  $128=((HEAP32[(($127)>>2)])|0);
  $129=(($ePrev_0+4)|0);
  $130=((HEAP32[(($129)>>2)])|0);
  $131=($128|0)==($130|0);
  if ($124) {
   label = 377;
   break;
  }
  if (!($131)) {
   label = 364;
   break;
  }
  $135=($126|0)==($123|0);
  if ($135) {
   label = 366;
   break;
  }
  $138=(($126+4)|0);
  $139=((HEAP32[(($138)>>2)])|0);
  $140=($139|0)==($123|0);
  if (!($140)) {
   label = 368;
   break;
  }
  $143=(($123+16)|0);
  $144=((HEAP32[(($143)>>2)])|0);
  $145=($144|0)==0;
  if ($145) {
   label = 370;
   break;
  }
  $148=(($126+16)|0);
  $149=((HEAP32[(($148)>>2)])|0);
  $150=($149|0)==0;
  if ($150) {
   label = 372;
   break;
  }
  $153=(($123+12)|0);
  $154=((HEAP32[(($153)>>2)])|0);
  $155=(($154+8)|0);
  $156=((HEAP32[(($155)>>2)])|0);
  $157=(($156+4)|0);
  $158=((HEAP32[(($157)>>2)])|0);
  $159=($158|0)==($123|0);
  if (!($159)) {
   label = 374;
   break;
  }
  $162=(($123+8)|0);
  $163=((HEAP32[(($162)>>2)])|0);
  $164=(($163+4)|0);
  $165=((HEAP32[(($164)>>2)])|0);
  $166=(($165+12)|0);
  $167=((HEAP32[(($166)>>2)])|0);
  $168=($167|0)==($123|0);
  if ($168) {
   $ePrev_0=$123;
  } else {
   label = 376;
   break;
  }
 }
 if ((label|0) == 374) {
  ___assert_fail(((264)|0),((584)|0),((833)|0),((1888)|0));
 }
 else if ((label|0) == 376) {
  ___assert_fail(((144)|0),((584)|0),((834)|0),((1888)|0));
 }
 else if ((label|0) == 377) {
  if (!($131)) {
   ___assert_fail(((992)|0),((584)|0),((840)|0),((1888)|0));
  }
  $172=(($mesh+100)|0);
  $173=($126|0)==($172|0);
  if (!($173)) {
   ___assert_fail(((992)|0),((584)|0),((840)|0),((1888)|0));
  }
  $175=(($126+4)|0);
  $176=((HEAP32[(($175)>>2)])|0);
  $177=($176|0)==($123|0);
  if (!($177)) {
   ___assert_fail(((992)|0),((584)|0),((840)|0),((1888)|0));
  }
  $179=(($123+16)|0);
  $180=((HEAP32[(($179)>>2)])|0);
  $181=($180|0)==0;
  if (!($181)) {
   ___assert_fail(((992)|0),((584)|0),((840)|0),((1888)|0));
  }
  $183=(($126+16)|0);
  $184=((HEAP32[(($183)>>2)])|0);
  $185=($184|0)==0;
  if (!($185)) {
   ___assert_fail(((992)|0),((584)|0),((840)|0),((1888)|0));
  }
  $187=(($123+20)|0);
  $188=((HEAP32[(($187)>>2)])|0);
  $189=($188|0)==0;
  if (!($189)) {
   ___assert_fail(((992)|0),((584)|0),((840)|0),((1888)|0));
  }
  $191=(($126+20)|0);
  $192=((HEAP32[(($191)>>2)])|0);
  $193=($192|0)==0;
  if ($193) {
   return;
  } else {
   ___assert_fail(((992)|0),((584)|0),((840)|0),((1888)|0));
  }
 }
 else if ((label|0) == 364) {
  ___assert_fail(((1288)|0),((584)|0),((828)|0),((1888)|0));
 }
 else if ((label|0) == 366) {
  ___assert_fail(((448)|0),((584)|0),((829)|0),((1888)|0));
 }
 else if ((label|0) == 368) {
  ___assert_fail(((376)|0),((584)|0),((830)|0),((1888)|0));
 }
 else if ((label|0) == 370) {
  ___assert_fail(((1240)|0),((584)|0),((831)|0),((1888)|0));
 }
 else if ((label|0) == 372) {
  ___assert_fail(((1184)|0),((584)|0),((832)|0),((1888)|0));
 }
}
function _pqHeapNewPriorityQ($alloc,$size,$leq){
 $alloc=($alloc)|0;
 $size=($size)|0;
 $leq=($leq)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0,$22=0;
 var $23=0,$24=0,$26=0,$27=0,$28=0,$29=0,$30=0,$31=0,$32=0,$33=0,$35=0,$36=0,$37=0,$38=0,$39=0,$40=0,$41=0,$43=0,$44=0,$45=0;
 var $46=0,$47=0,$48=0,$49=0,$50=0,$51=0,$52=0,$_0=0,label=0;
 $1=(($alloc)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($alloc+12)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=((FUNCTION_TABLE_iii[($2)&7]($4,28))|0);
 $6=$5;
 $7=($5|0)==0;
 if ($7) {
  $_0=0;
  return (($_0)|0);
 }
 $9=(($5+8)|0);
 $10=$9;
 HEAP32[(($10)>>2)]=0;
 $11=(($5+12)|0);
 $12=$11;
 HEAP32[(($12)>>2)]=$size;
 $13=((HEAP32[(($1)>>2)])|0);
 $14=((HEAP32[(($3)>>2)])|0);
 $15=((($size)+(1))|0);
 $16=$15<<2;
 $17=((FUNCTION_TABLE_iii[($13)&7]($14,$16))|0);
 $18=$17;
 $19=$5;
 HEAP32[(($19)>>2)]=$18;
 $20=($17|0)==0;
 if ($20) {
  $22=(($alloc+8)|0);
  $23=((HEAP32[(($22)>>2)])|0);
  $24=((HEAP32[(($3)>>2)])|0);
  FUNCTION_TABLE_vii[($23)&7]($24,$5);
  $_0=0;
  return (($_0)|0);
 }
 $26=((HEAP32[(($1)>>2)])|0);
 $27=((HEAP32[(($3)>>2)])|0);
 $28=$15<<3;
 $29=((FUNCTION_TABLE_iii[($26)&7]($27,$28))|0);
 $30=$29;
 $31=(($5+4)|0);
 $32=$31;
 HEAP32[(($32)>>2)]=$30;
 $33=($29|0)==0;
 if ($33) {
  $35=(($alloc+8)|0);
  $36=((HEAP32[(($35)>>2)])|0);
  $37=((HEAP32[(($3)>>2)])|0);
  $38=((HEAP32[(($19)>>2)])|0);
  $39=$38;
  FUNCTION_TABLE_vii[($36)&7]($37,$39);
  $40=((HEAP32[(($35)>>2)])|0);
  $41=((HEAP32[(($3)>>2)])|0);
  FUNCTION_TABLE_vii[($40)&7]($41,$5);
  $_0=0;
  return (($_0)|0);
 } else {
  $43=(($5+20)|0);
  $44=$43;
  HEAP32[(($44)>>2)]=0;
  $45=(($5+16)|0);
  $46=$45;
  HEAP32[(($46)>>2)]=0;
  $47=(($5+24)|0);
  $48=$47;
  HEAP32[(($48)>>2)]=$leq;
  $49=((HEAP32[(($19)>>2)])|0);
  $50=(($49+4)|0);
  HEAP32[(($50)>>2)]=1;
  $51=((HEAP32[(($32)>>2)])|0);
  $52=(($51+8)|0);
  HEAP32[(($52)>>2)]=0;
  $_0=$6;
  return (($_0)|0);
 }
  return 0;
}
function _pqHeapDeletePriorityQ($alloc,$pq){
 $alloc=($alloc)|0;
 $pq=($pq)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,label=0;
 $1=(($alloc+8)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($alloc+12)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($pq+4)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=$6;
 FUNCTION_TABLE_vii[($2)&7]($4,$7);
 $8=((HEAP32[(($1)>>2)])|0);
 $9=((HEAP32[(($3)>>2)])|0);
 $10=(($pq)|0);
 $11=((HEAP32[(($10)>>2)])|0);
 $12=$11;
 FUNCTION_TABLE_vii[($8)&7]($9,$12);
 $13=((HEAP32[(($1)>>2)])|0);
 $14=((HEAP32[(($3)>>2)])|0);
 $15=$pq;
 FUNCTION_TABLE_vii[($13)&7]($14,$15);
 return;
}
function _pqHeapInit($pq){
 $pq=($pq)|0;
 var $1=0,$2=0,$3=0,$i_04=0,$4=0,$5=0,$6=0,label=0;
 $1=(($pq+8)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=($2|0)>0;
 if ($3) {
  $i_04=$2;
  while(1) {
   _FloatDown($pq,$i_04);
   $4=((($i_04)-(1))|0);
   $5=($4|0)>0;
   if ($5) {
    $i_04=$4;
   } else {
    break;
   }
  }
 }
 $6=(($pq+20)|0);
 HEAP32[(($6)>>2)]=1;
 return;
}
function _FloatDown($pq,$curr){
 $pq=($pq)|0;
 $curr=($curr)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$_0=0,$11=0,$12=0,$13=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0,$21=0;
 var $22=.0,$23=0,$24=0,$25=0,$26=0,$27=0,$28=0,$29=.0,$30=0,$32=0,$34=0,$35=0,$36=.0,$37=0,$38=0,$39=.0,$40=0,$child_0=0,$43=0,$44=0;
 var $47=0,$48=0,$49=0,$50=0,$52=0,$53=0,$54=0,$55=.0,$56=0,$57=0,$58=0,$59=0,$60=.0,$61=0,$63=0,$65=0,$66=0,$67=.0,$68=0,$69=0;
 var $70=.0,$71=0,$73=0,$74=0,$76=0,$77=0,label=0;
 $1=(($pq)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($pq+4)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($2+($curr<<2))|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=(($pq+8)|0);
 $8=(($pq+12)|0);
 $9=(($4+($6<<3))|0);
 $_0=$curr;
 while(1) {
  $11=$_0<<1;
  $12=((HEAP32[(($7)>>2)])|0);
  $13=($11|0)<($12|0);
  do {
   if ($13) {
    $15=$11|1;
    $16=(($2+($15<<2))|0);
    $17=((HEAP32[(($16)>>2)])|0);
    $18=(($4+($17<<3))|0);
    $19=((HEAP32[(($18)>>2)])|0);
    $20=(($19+24)|0);
    $21=$20;
    $22=(+(HEAPF32[(($21)>>2)]));
    $23=(($2+($11<<2))|0);
    $24=((HEAP32[(($23)>>2)])|0);
    $25=(($4+($24<<3))|0);
    $26=((HEAP32[(($25)>>2)])|0);
    $27=(($26+24)|0);
    $28=$27;
    $29=(+(HEAPF32[(($28)>>2)]));
    $30=$22<$29;
    if (!($30)) {
     $32=$22==$29;
     if (!($32)) {
      $child_0=$11;
      break;
     }
     $34=(($19+28)|0);
     $35=$34;
     $36=(+(HEAPF32[(($35)>>2)]));
     $37=(($26+28)|0);
     $38=$37;
     $39=(+(HEAPF32[(($38)>>2)]));
     $40=$36>$39;
     if ($40) {
      $child_0=$11;
      break;
     }
    }
    $child_0=$15;
   } else {
    $child_0=$11;
   }
  } while(0);
  $43=((HEAP32[(($8)>>2)])|0);
  $44=($child_0|0)>($43|0);
  if ($44) {
   label = 419;
   break;
  }
  $47=(($2+($child_0<<2))|0);
  $48=((HEAP32[(($47)>>2)])|0);
  $49=((HEAP32[(($7)>>2)])|0);
  $50=($child_0|0)>($49|0);
  if ($50) {
   label = 428;
   break;
  }
  $52=((HEAP32[(($9)>>2)])|0);
  $53=(($52+24)|0);
  $54=$53;
  $55=(+(HEAPF32[(($54)>>2)]));
  $56=(($4+($48<<3))|0);
  $57=((HEAP32[(($56)>>2)])|0);
  $58=(($57+24)|0);
  $59=$58;
  $60=(+(HEAPF32[(($59)>>2)]));
  $61=$55<$60;
  if ($61) {
   label = 427;
   break;
  }
  $63=$55==$60;
  if ($63) {
   $65=(($52+28)|0);
   $66=$65;
   $67=(+(HEAPF32[(($66)>>2)]));
   $68=(($57+28)|0);
   $69=$68;
   $70=(+(HEAPF32[(($69)>>2)]));
   $71=$67>$70;
   if (!($71)) {
    label = 426;
    break;
   }
  }
  $76=(($2+($_0<<2))|0);
  HEAP32[(($76)>>2)]=$48;
  $77=(($4+($48<<3)+4)|0);
  HEAP32[(($77)>>2)]=$_0;
  $_0=$child_0;
 }
 if ((label|0) == 426) {
  $73=(($2+($_0<<2))|0);
  HEAP32[(($73)>>2)]=$6;
  $74=(($4+($6<<3)+4)|0);
  HEAP32[(($74)>>2)]=$_0;
  return;
 }
 else if ((label|0) == 427) {
  $73=(($2+($_0<<2))|0);
  HEAP32[(($73)>>2)]=$6;
  $74=(($4+($6<<3)+4)|0);
  HEAP32[(($74)>>2)]=$_0;
  return;
 }
 else if ((label|0) == 419) {
  ___assert_fail(((240)|0),((1552)|0),((141)|0),((2128)|0));
 }
 else if ((label|0) == 428) {
  $73=(($2+($_0<<2))|0);
  HEAP32[(($73)>>2)]=$6;
  $74=(($4+($6<<3)+4)|0);
  HEAP32[(($74)>>2)]=$_0;
  return;
 }
}
function _pqHeapInsert($alloc,$pq,$keyNew){
 $alloc=($alloc)|0;
 $pq=($pq)|0;
 $keyNew=($keyNew)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$9=0,$10=0,$11=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0,$21=0,$22=0;
 var $23=0,$24=0,$25=0,$26=0,$27=0,$30=0,$31=0,$32=0,$33=0,$34=0,$35=0,$36=0,$37=0,$38=0,$39=0,$42=0,$43=0,$44=0,$46=0,$47=0;
 var $48=0,$49=0,$free_0=0,$51=0,$52=0,$53=0,$54=0,$55=0,$56=0,$57=0,$58=0,$59=0,$60=0,$61=0,$64=0,$_0=0,label=0;
 $1=(($pq+8)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=((($2)+(1))|0);
 HEAP32[(($1)>>2)]=$3;
 $4=$3<<1;
 $5=(($pq+12)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=($4|0)>($6|0);
 do {
  if ($7) {
   $9=(($alloc+4)|0);
   $10=((HEAP32[(($9)>>2)])|0);
   $11=($10|0)==0;
   if ($11) {
    $_0=268435455;
    return (($_0)|0);
   }
   $13=(($pq)|0);
   $14=((HEAP32[(($13)>>2)])|0);
   $15=(($pq+4)|0);
   $16=((HEAP32[(($15)>>2)])|0);
   $17=$6<<1;
   HEAP32[(($5)>>2)]=$17;
   $18=((HEAP32[(($9)>>2)])|0);
   $19=(($alloc+12)|0);
   $20=((HEAP32[(($19)>>2)])|0);
   $21=((HEAP32[(($13)>>2)])|0);
   $22=$21;
   $23=$6<<3;
   $24=$23|4;
   $25=((FUNCTION_TABLE_iiii[($18)&7]($20,$22,$24))|0);
   $26=$25;
   HEAP32[(($13)>>2)]=$26;
   $27=($25|0)==0;
   if ($27) {
    HEAP32[(($13)>>2)]=$14;
    $_0=268435455;
    return (($_0)|0);
   }
   $30=((HEAP32[(($9)>>2)])|0);
   $31=((HEAP32[(($19)>>2)])|0);
   $32=((HEAP32[(($15)>>2)])|0);
   $33=$32;
   $34=((HEAP32[(($5)>>2)])|0);
   $35=$34<<3;
   $36=((($35)+(8))|0);
   $37=((FUNCTION_TABLE_iiii[($30)&7]($31,$33,$36))|0);
   $38=$37;
   HEAP32[(($15)>>2)]=$38;
   $39=($37|0)==0;
   if (!($39)) {
    break;
   }
   HEAP32[(($15)>>2)]=$16;
   $_0=268435455;
   return (($_0)|0);
  }
 } while(0);
 $42=(($pq+16)|0);
 $43=((HEAP32[(($42)>>2)])|0);
 $44=($43|0)==0;
 if ($44) {
  $free_0=$3;
 } else {
  $46=(($pq+4)|0);
  $47=((HEAP32[(($46)>>2)])|0);
  $48=(($47+($43<<3)+4)|0);
  $49=((HEAP32[(($48)>>2)])|0);
  HEAP32[(($42)>>2)]=$49;
  $free_0=$43;
 }
 $51=(($pq)|0);
 $52=((HEAP32[(($51)>>2)])|0);
 $53=(($52+($3<<2))|0);
 HEAP32[(($53)>>2)]=$free_0;
 $54=(($pq+4)|0);
 $55=((HEAP32[(($54)>>2)])|0);
 $56=(($55+($free_0<<3)+4)|0);
 HEAP32[(($56)>>2)]=$3;
 $57=((HEAP32[(($54)>>2)])|0);
 $58=(($57+($free_0<<3))|0);
 HEAP32[(($58)>>2)]=$keyNew;
 $59=(($pq+20)|0);
 $60=((HEAP32[(($59)>>2)])|0);
 $61=($60|0)==0;
 if (!($61)) {
  _FloatUp($pq,$3);
 }
 $64=($free_0|0)==268435455;
 if ($64) {
  ___assert_fail(((832)|0),((1552)|0),((240)|0),((1968)|0));
  return ((0)|0);
 } else {
  $_0=$free_0;
  return (($_0)|0);
 }
  return 0;
}
function _FloatUp($pq,$curr){
 $pq=($pq)|0;
 $curr=($curr)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$_pn=0,$_028=0,$_in=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=.0,$17=0,$18=0;
 var $19=0,$20=.0,$21=0,$23=0,$25=0,$26=0,$27=.0,$28=0,$29=0,$30=.0,$31=0,$_0_lcssa=0,$32=0,$33=0,$35=0,$36=0,$37=0,$38=0,label=0;
 $1=(($pq)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($pq+4)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($2+($curr<<2))|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=$curr>>1;
 $8=($7|0)==0;
 L563: do {
  if ($8) {
   $_0_lcssa=$curr;
  } else {
   $9=(($4+($6<<3))|0);
   $_028=$curr;$_pn=$7;
   while(1) {
    $_in=(($2+($_pn<<2))|0);
    $11=((HEAP32[(($_in)>>2)])|0);
    $12=(($4+($11<<3))|0);
    $13=((HEAP32[(($12)>>2)])|0);
    $14=(($13+24)|0);
    $15=$14;
    $16=(+(HEAPF32[(($15)>>2)]));
    $17=((HEAP32[(($9)>>2)])|0);
    $18=(($17+24)|0);
    $19=$18;
    $20=(+(HEAPF32[(($19)>>2)]));
    $21=$16<$20;
    if ($21) {
     $_0_lcssa=$_028;
     break L563;
    }
    $23=$16==$20;
    if ($23) {
     $25=(($13+28)|0);
     $26=$25;
     $27=(+(HEAPF32[(($26)>>2)]));
     $28=(($17+28)|0);
     $29=$28;
     $30=(+(HEAPF32[(($29)>>2)]));
     $31=$27>$30;
     if (!($31)) {
      $_0_lcssa=$_028;
      break L563;
     }
    }
    $35=(($2+($_028<<2))|0);
    HEAP32[(($35)>>2)]=$11;
    $36=(($4+($11<<3)+4)|0);
    HEAP32[(($36)>>2)]=$_028;
    $37=$_pn>>1;
    $38=($37|0)==0;
    if ($38) {
     $_0_lcssa=$_pn;
     break;
    } else {
     $_028=$_pn;$_pn=$37;
    }
   }
  }
 } while(0);
 $32=(($2+($_0_lcssa<<2))|0);
 HEAP32[(($32)>>2)]=$6;
 $33=(($4+($6<<3)+4)|0);
 HEAP32[(($33)>>2)]=$_0_lcssa;
 return;
}
function _pqHeapExtractMin($pq){
 $pq=($pq)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0,$21=0;
 var label=0;
 $1=(($pq)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($pq+4)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($2+4)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=(($4+($6<<3))|0);
 $8=((HEAP32[(($7)>>2)])|0);
 $9=(($pq+8)|0);
 $10=((HEAP32[(($9)>>2)])|0);
 $11=($10|0)>0;
 if (!($11)) {
  return (($8)|0);
 }
 $13=(($2+($10<<2))|0);
 $14=((HEAP32[(($13)>>2)])|0);
 HEAP32[(($5)>>2)]=$14;
 $15=(($4+($14<<3)+4)|0);
 HEAP32[(($15)>>2)]=1;
 HEAP32[(($7)>>2)]=0;
 $16=(($pq+16)|0);
 $17=((HEAP32[(($16)>>2)])|0);
 $18=(($4+($6<<3)+4)|0);
 HEAP32[(($18)>>2)]=$17;
 HEAP32[(($16)>>2)]=$6;
 $19=((HEAP32[(($9)>>2)])|0);
 $20=((($19)-(1))|0);
 HEAP32[(($9)>>2)]=$20;
 $21=($20|0)>0;
 if (!($21)) {
  return (($8)|0);
 }
 _FloatDown($pq,1);
 return (($8)|0);
}
function _pqHeapDelete($pq,$hCurr){
 $pq=($pq)|0;
 $hCurr=($hCurr)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$7=0,$8=0,$9=0,$11=0,$12=0,$13=0,$16=0,$17=0,$18=0,$19=0,$20=0,$21=0,$22=0,$23=0,$24=0;
 var $25=0,$26=0,$28=0,$30=0,$31=0,$32=0,$33=0,$34=0,$35=0,$36=0,$37=.0,$38=0,$39=0,$40=0,$41=0,$42=0,$43=.0,$44=0,$46=0,$48=0;
 var $49=0,$50=.0,$51=0,$52=0,$53=.0,$54=0,$58=0,$59=0,label=0;
 $1=(($pq)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($pq+4)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=($hCurr|0)>0;
 if (!($5)) {
  ___assert_fail(((776)|0),((1552)|0),((274)|0),((1984)|0));
 }
 $7=(($pq+12)|0);
 $8=((HEAP32[(($7)>>2)])|0);
 $9=($8|0)<($hCurr|0);
 if ($9) {
  ___assert_fail(((776)|0),((1552)|0),((274)|0),((1984)|0));
 }
 $11=(($4+($hCurr<<3))|0);
 $12=((HEAP32[(($11)>>2)])|0);
 $13=($12|0)==0;
 if ($13) {
  ___assert_fail(((776)|0),((1552)|0),((274)|0),((1984)|0));
 }
 $16=(($4+($hCurr<<3)+4)|0);
 $17=((HEAP32[(($16)>>2)])|0);
 $18=(($pq+8)|0);
 $19=((HEAP32[(($18)>>2)])|0);
 $20=(($2+($19<<2))|0);
 $21=((HEAP32[(($20)>>2)])|0);
 $22=(($2+($17<<2))|0);
 HEAP32[(($22)>>2)]=$21;
 $23=(($4+($21<<3)+4)|0);
 HEAP32[(($23)>>2)]=$17;
 $24=((HEAP32[(($18)>>2)])|0);
 $25=((($24)-(1))|0);
 HEAP32[(($18)>>2)]=$25;
 $26=($17|0)>($25|0);
 if ($26) {
  HEAP32[(($11)>>2)]=0;
  $58=(($pq+16)|0);
  $59=((HEAP32[(($58)>>2)])|0);
  HEAP32[(($16)>>2)]=$59;
  HEAP32[(($58)>>2)]=$hCurr;
  return;
 }
 $28=($17|0)<2;
 do {
  if (!($28)) {
   $30=$17>>1;
   $31=(($2+($30<<2))|0);
   $32=((HEAP32[(($31)>>2)])|0);
   $33=(($4+($32<<3))|0);
   $34=((HEAP32[(($33)>>2)])|0);
   $35=(($34+24)|0);
   $36=$35;
   $37=(+(HEAPF32[(($36)>>2)]));
   $38=((HEAP32[(($22)>>2)])|0);
   $39=(($4+($38<<3))|0);
   $40=((HEAP32[(($39)>>2)])|0);
   $41=(($40+24)|0);
   $42=$41;
   $43=(+(HEAPF32[(($42)>>2)]));
   $44=$37<$43;
   if ($44) {
    break;
   }
   $46=$37==$43;
   if ($46) {
    $48=(($34+28)|0);
    $49=$48;
    $50=(+(HEAPF32[(($49)>>2)]));
    $51=(($40+28)|0);
    $52=$51;
    $53=(+(HEAPF32[(($52)>>2)]));
    $54=$50>$53;
    if (!($54)) {
     break;
    }
   }
   _FloatUp($pq,$17);
   HEAP32[(($11)>>2)]=0;
   $58=(($pq+16)|0);
   $59=((HEAP32[(($58)>>2)])|0);
   HEAP32[(($16)>>2)]=$59;
   HEAP32[(($58)>>2)]=$hCurr;
   return;
  }
 } while(0);
 _FloatDown($pq,$17);
 HEAP32[(($11)>>2)]=0;
 $58=(($pq+16)|0);
 $59=((HEAP32[(($58)>>2)])|0);
 HEAP32[(($16)>>2)]=$59;
 HEAP32[(($58)>>2)]=$hCurr;
 return;
}
function _pqNewPriorityQ($alloc,$size,$leq){
 $alloc=($alloc)|0;
 $size=($size)|0;
 $leq=($leq)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$9=0,$10=0,$11=0,$13=0,$14=0,$15=0,$17=0,$18=0,$19=0,$20=0,$21=0,$22=0,$23=0;
 var $24=0,$26=0,$27=0,$28=0,$29=0,$31=0,$32=0,$33=0,$34=0,$35=0,$36=0,$37=0,$38=0,$_0=0,label=0;
 $1=(($alloc)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($alloc+12)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=((FUNCTION_TABLE_iii[($2)&7]($4,28))|0);
 $6=$5;
 $7=($5|0)==0;
 if ($7) {
  $_0=0;
  return (($_0)|0);
 }
 $9=((_pqHeapNewPriorityQ($alloc,$size,$leq))|0);
 $10=$5;
 HEAP32[(($10)>>2)]=$9;
 $11=($9|0)==0;
 if ($11) {
  $13=(($alloc+8)|0);
  $14=((HEAP32[(($13)>>2)])|0);
  $15=((HEAP32[(($3)>>2)])|0);
  FUNCTION_TABLE_vii[($14)&7]($15,$5);
  $_0=0;
  return (($_0)|0);
 }
 $17=((HEAP32[(($1)>>2)])|0);
 $18=((HEAP32[(($3)>>2)])|0);
 $19=$size<<2;
 $20=((FUNCTION_TABLE_iii[($17)&7]($18,$19))|0);
 $21=$20;
 $22=(($5+4)|0);
 $23=$22;
 HEAP32[(($23)>>2)]=$21;
 $24=($20|0)==0;
 if ($24) {
  $26=((HEAP32[(($10)>>2)])|0);
  _pqHeapDeletePriorityQ($alloc,$26);
  $27=(($alloc+8)|0);
  $28=((HEAP32[(($27)>>2)])|0);
  $29=((HEAP32[(($3)>>2)])|0);
  FUNCTION_TABLE_vii[($28)&7]($29,$5);
  $_0=0;
  return (($_0)|0);
 } else {
  $31=(($5+12)|0);
  $32=$31;
  HEAP32[(($32)>>2)]=0;
  $33=(($5+16)|0);
  $34=$33;
  HEAP32[(($34)>>2)]=$size;
  $35=(($5+20)|0);
  $36=$35;
  HEAP32[(($36)>>2)]=0;
  $37=(($5+24)|0);
  $38=$37;
  HEAP32[(($38)>>2)]=$leq;
  $_0=$6;
  return (($_0)|0);
 }
  return 0;
}
function _pqDeletePriorityQ($alloc,$pq){
 $alloc=($alloc)|0;
 $pq=($pq)|0;
 var $1=0,$4=0,$5=0,$6=0,$9=0,$10=0,$11=0,$13=0,$14=0,$15=0,$16=0,$17=0,$19=0,$20=0,$21=0,$23=0,$24=0,$25=0,$26=0,$27=0;
 var $29=0,$30=0,$31=0,$32=0,$33=0,label=0;
 $1=($pq|0)==0;
 if ($1) {
  ___assert_fail(((672)|0),((1552)|0),((327)|0),((2000)|0));
 }
 $4=(($pq)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 $6=($5|0)==0;
 if (!($6)) {
  _pqHeapDeletePriorityQ($alloc,$5);
 }
 $9=(($pq+8)|0);
 $10=((HEAP32[(($9)>>2)])|0);
 $11=($10|0)==0;
 if (!($11)) {
  $13=(($alloc+8)|0);
  $14=((HEAP32[(($13)>>2)])|0);
  $15=(($alloc+12)|0);
  $16=((HEAP32[(($15)>>2)])|0);
  $17=$10;
  FUNCTION_TABLE_vii[($14)&7]($16,$17);
 }
 $19=(($pq+4)|0);
 $20=((HEAP32[(($19)>>2)])|0);
 $21=($20|0)==0;
 if (!($21)) {
  $23=(($alloc+8)|0);
  $24=((HEAP32[(($23)>>2)])|0);
  $25=(($alloc+12)|0);
  $26=((HEAP32[(($25)>>2)])|0);
  $27=$20;
  FUNCTION_TABLE_vii[($24)&7]($26,$27);
 }
 $29=(($alloc+8)|0);
 $30=((HEAP32[(($29)>>2)])|0);
 $31=(($alloc+12)|0);
 $32=((HEAP32[(($31)>>2)])|0);
 $33=$pq;
 FUNCTION_TABLE_vii[($30)&7]($32,$33);
 return;
}
function _pqInit($alloc,$pq){
 $alloc=($alloc)|0;
 $pq=($pq)|0;
 var $Stack=0,$1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$15=0,$_sum=0,$16=0,$17=0,$18=0,$19=0;
 var $piv_0163=0,$i_0162=0,$21=0,$22=0,$23=0,$24=0,$25=0,$26=0,$27=0,$28=0,$29=0,$31=0,$seed_0160=0,$top_0159=0,$32=0,$33=0,$34=0,$35=0,$36=0,$37=0;
 var $p_0_ph154=0,$seed_1_ph153=0,$top_1_ph152=0,$r_0_ph151=0,$38=0,$39=0,$p_0134=0,$seed_1133=0,$top_1132=0,$41=0,$42=0,$43=0,$44=0,$45=0,$46=0,$47=0,$48=0,$49=0,$50=0,$51=0;
 var $i_1_ph=0,$j_0_ph=0,$52=0,$53=0,$54=0,$55=0,$56=0,$57=.0,$58=0,$59=0,$60=0,$61=.0,$62=0,$63=.0,$64=0,$65=.0,$66=0,$67=0,$i_1121=0,$68=0;
 var $70=0,$71=0,$72=.0,$73=0,$74=0,$75=.0,$phitmp109=0,$76=0,$77=0,$78=0,$79=0,$80=0,$81=.0,$82=0,$83=0,$84=0,$85=.0,$86=0,$_lcssa120=0,$i_1_lcssa=0;
 var $87=0,$88=0,$89=0,$90=0,$91=.0,$92=0,$93=0,$94=0,$95=0,$96=.0,$97=0,$98=.0,$99=0,$100=.0,$101=0,$102=0,$j_1117=0,$103=0,$105=0,$106=0;
 var $107=.0,$108=0,$109=0,$110=.0,$phitmp110=0,$111=0,$112=0,$113=0,$114=0,$115=.0,$116=0,$117=0,$118=0,$119=0,$120=.0,$121=0,$_lcssa=0,$j_1_lcssa=0,$122=0,$123=0;
 var $124=0,$126=0,$127=0,$128=0,$129=0,$130=0,$131=0,$132=0,$133=0,$134=0,$135=0,$136=0,$138=0,$139=0,$140=0,$141=0,$r_0_ph147=0,$p_0_lcssa=0,$seed_1_lcssa=0,$top_1_lcssa=0;
 var $i_2143=0,$142=0,$i_2144=0,$143=0,$144=0,$j_2139=0,$145=0,$146=0,$147=0,$148=.0,$149=0,$150=0,$151=0,$152=0,$153=0,$154=.0,$155=0,$157=0,$159=0,$160=0;
 var $161=.0,$162=0,$163=0,$164=.0,$phitmp=0,$165=0,$166=0,$j_2_lcssa=0,$i_2=0,$167=0,$168=0,$169=0,$170=0,$171=0,$172=0,$173=0,$174=0,$_sum108=0,$175=0,$176=0;
 var $i_3116=0,$177=0,$178=0,$179=0,$180=0,$181=0,$182=.0,$183=0,$184=0,$185=0,$186=0,$187=.0,$188=0,$190=0,$192=0,$193=0,$194=.0,$195=0,$196=0,$197=.0;
 var $198=0,$199=0,$_0=0,label=0;
 var sp=0;sp=STACKTOP;STACKTOP=(STACKTOP+400)|0;
 $Stack=((sp)|0);
 $1=(($Stack)|0);
 $2=(($alloc)|0);
 $3=((HEAP32[(($2)>>2)])|0);
 $4=(($alloc+12)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 $6=(($pq+12)|0);
 $7=((HEAP32[(($6)>>2)])|0);
 $8=$7<<2;
 $9=((($8)+(4))|0);
 $10=((FUNCTION_TABLE_iii[($3)&7]($5,$9))|0);
 $11=$10;
 $12=(($pq+8)|0);
 HEAP32[(($12)>>2)]=$11;
 $13=($10|0)==0;
 if ($13) {
  $_0=0;
  STACKTOP=sp;return (($_0)|0);
 }
 $15=((HEAP32[(($6)>>2)])|0);
 $_sum=((($15)-(1))|0);
 $16=(($11+($_sum<<2))|0);
 $17=($11>>>0)>($16>>>0);
 if (!($17)) {
  $18=(($pq+4)|0);
  $19=((HEAP32[(($18)>>2)])|0);
  $i_0162=$11;$piv_0163=$19;
  while(1) {
   HEAP32[(($i_0162)>>2)]=$piv_0163;
   $21=(($piv_0163+4)|0);
   $22=(($i_0162+4)|0);
   $23=($22>>>0)>($16>>>0);
   if ($23) {
    break;
   } else {
    $i_0162=$22;$piv_0163=$21;
   }
  }
 }
 $24=(($Stack)|0);
 HEAP32[(($24)>>2)]=$11;
 $25=(($Stack+4)|0);
 HEAP32[(($25)>>2)]=$16;
 $26=(($Stack)|0);
 $27=(($Stack+8)|0);
 $top_0159=$27;$seed_0160=2016473283;$31=$26;
 while(1) {
  $32=(($31)|0);
  $33=((HEAP32[(($32)>>2)])|0);
  $34=((($top_0159)-(8)+4)|0);
  $35=((HEAP32[(($34)>>2)])|0);
  $36=(($33+40)|0);
  $37=($35>>>0)>($36>>>0);
  L639: do {
   if ($37) {
    $r_0_ph151=$35;$top_1_ph152=$31;$seed_1_ph153=$seed_0160;$p_0_ph154=$33;
    while(1) {
     $38=$r_0_ph151;
     $39=(($r_0_ph151+4)|0);
     $top_1132=$top_1_ph152;$seed_1133=$seed_1_ph153;$p_0134=$p_0_ph154;
     while(1) {
      $41=(Math_imul($seed_1133,1539415821)|0);
      $42=((($41)+(1))|0);
      $43=$p_0134;
      $44=((($38)-($43))|0);
      $45=$44>>2;
      $46=((($45)+(1))|0);
      $47=(((($42>>>0))%(($46>>>0)))&-1);
      $48=(($p_0134+($47<<2))|0);
      $49=((HEAP32[(($48)>>2)])|0);
      $50=((HEAP32[(($p_0134)>>2)])|0);
      HEAP32[(($48)>>2)]=$50;
      HEAP32[(($p_0134)>>2)]=$49;
      $51=((($p_0134)-(4))|0);
      $j_0_ph=$39;$i_1_ph=$51;
      while(1) {
       $52=(($i_1_ph+4)|0);
       $53=((HEAP32[(($52)>>2)])|0);
       $54=((HEAP32[(($53)>>2)])|0);
       $55=(($54+24)|0);
       $56=$55;
       $57=(+(HEAPF32[(($56)>>2)]));
       $58=((HEAP32[(($49)>>2)])|0);
       $59=(($58+24)|0);
       $60=$59;
       $61=(+(HEAPF32[(($60)>>2)]));
       $62=$57<$61;
       L646: do {
        if ($62) {
         $i_1_lcssa=$i_1_ph;$_lcssa120=$52;
        } else {
         $i_1121=$i_1_ph;$67=$52;$66=$54;$65=$57;$64=$58;$63=$61;
         while(1) {
          $68=$65==$63;
          if ($68) {
           $70=(($66+28)|0);
           $71=$70;
           $72=(+(HEAPF32[(($71)>>2)]));
           $73=(($64+28)|0);
           $74=$73;
           $75=(+(HEAPF32[(($74)>>2)]));
           $phitmp109=$72>$75;
           if (!($phitmp109)) {
            $i_1_lcssa=$i_1121;$_lcssa120=$67;
            break L646;
           }
          }
          $76=(($67+4)|0);
          $77=((HEAP32[(($76)>>2)])|0);
          $78=((HEAP32[(($77)>>2)])|0);
          $79=(($78+24)|0);
          $80=$79;
          $81=(+(HEAPF32[(($80)>>2)]));
          $82=((HEAP32[(($49)>>2)])|0);
          $83=(($82+24)|0);
          $84=$83;
          $85=(+(HEAPF32[(($84)>>2)]));
          $86=$81<$85;
          if ($86) {
           $i_1_lcssa=$67;$_lcssa120=$76;
           break;
          } else {
           $i_1121=$67;$67=$76;$66=$78;$65=$81;$64=$82;$63=$85;
          }
         }
        }
       } while(0);
       $87=((($j_0_ph)-(4))|0);
       $88=((HEAP32[(($49)>>2)])|0);
       $89=(($88+24)|0);
       $90=$89;
       $91=(+(HEAPF32[(($90)>>2)]));
       $92=((HEAP32[(($87)>>2)])|0);
       $93=((HEAP32[(($92)>>2)])|0);
       $94=(($93+24)|0);
       $95=$94;
       $96=(+(HEAPF32[(($95)>>2)]));
       $97=$91<$96;
       L653: do {
        if ($97) {
         $j_1_lcssa=$j_0_ph;$_lcssa=$87;
        } else {
         $j_1117=$j_0_ph;$102=$87;$101=$88;$100=$91;$99=$93;$98=$96;
         while(1) {
          $103=$100==$98;
          if ($103) {
           $105=(($101+28)|0);
           $106=$105;
           $107=(+(HEAPF32[(($106)>>2)]));
           $108=(($99+28)|0);
           $109=$108;
           $110=(+(HEAPF32[(($109)>>2)]));
           $phitmp110=$107>$110;
           if (!($phitmp110)) {
            $j_1_lcssa=$j_1117;$_lcssa=$102;
            break L653;
           }
          }
          $111=((($102)-(4))|0);
          $112=((HEAP32[(($49)>>2)])|0);
          $113=(($112+24)|0);
          $114=$113;
          $115=(+(HEAPF32[(($114)>>2)]));
          $116=((HEAP32[(($111)>>2)])|0);
          $117=((HEAP32[(($116)>>2)])|0);
          $118=(($117+24)|0);
          $119=$118;
          $120=(+(HEAPF32[(($119)>>2)]));
          $121=$115<$120;
          if ($121) {
           $j_1_lcssa=$102;$_lcssa=$111;
           break;
          } else {
           $j_1117=$102;$102=$111;$101=$112;$100=$115;$99=$117;$98=$120;
          }
         }
        }
       } while(0);
       $122=((HEAP32[(($_lcssa120)>>2)])|0);
       $123=((HEAP32[(($_lcssa)>>2)])|0);
       HEAP32[(($_lcssa120)>>2)]=$123;
       HEAP32[(($_lcssa)>>2)]=$122;
       $124=($_lcssa120>>>0)<($_lcssa>>>0);
       if ($124) {
        $j_0_ph=$_lcssa;$i_1_ph=$_lcssa120;
       } else {
        break;
       }
      }
      $126=((HEAP32[(($_lcssa120)>>2)])|0);
      HEAP32[(($_lcssa120)>>2)]=$122;
      HEAP32[(($_lcssa)>>2)]=$126;
      $127=$_lcssa120;
      $128=((($127)-($43))|0);
      $129=$_lcssa;
      $130=((($38)-($129))|0);
      $131=($128|0)<($130|0);
      $132=(($top_1132)|0);
      if ($131) {
       break;
      }
      HEAP32[(($132)>>2)]=$p_0134;
      $138=(($top_1132+4)|0);
      HEAP32[(($138)>>2)]=$i_1_lcssa;
      $139=(($top_1132+8)|0);
      $140=(($j_1_lcssa+40)|0);
      $141=($r_0_ph151>>>0)>($140>>>0);
      if ($141) {
       $top_1132=$139;$seed_1133=$42;$p_0134=$j_1_lcssa;
      } else {
       $top_1_lcssa=$139;$seed_1_lcssa=$42;$p_0_lcssa=$j_1_lcssa;$r_0_ph147=$r_0_ph151;
       break L639;
      }
     }
     HEAP32[(($132)>>2)]=$j_1_lcssa;
     $133=(($top_1132+4)|0);
     HEAP32[(($133)>>2)]=$r_0_ph151;
     $134=(($top_1132+8)|0);
     $135=(($p_0134+40)|0);
     $136=($i_1_lcssa>>>0)>($135>>>0);
     if ($136) {
      $r_0_ph151=$i_1_lcssa;$top_1_ph152=$134;$seed_1_ph153=$42;$p_0_ph154=$p_0134;
     } else {
      $top_1_lcssa=$134;$seed_1_lcssa=$42;$p_0_lcssa=$p_0134;$r_0_ph147=$i_1_lcssa;
      break;
     }
    }
   } else {
    $top_1_lcssa=$31;$seed_1_lcssa=$seed_0160;$p_0_lcssa=$33;$r_0_ph147=$35;
   }
  } while(0);
  $i_2143=(($p_0_lcssa+4)|0);
  $142=($i_2143>>>0)>($r_0_ph147>>>0);
  if (!($142)) {
   $i_2144=$i_2143;
   while(1) {
    $143=((HEAP32[(($i_2144)>>2)])|0);
    $144=($i_2144>>>0)>($p_0_lcssa>>>0);
    L667: do {
     if ($144) {
      $j_2139=$i_2144;
      while(1) {
       $145=((HEAP32[(($143)>>2)])|0);
       $146=(($145+24)|0);
       $147=$146;
       $148=(+(HEAPF32[(($147)>>2)]));
       $149=((($j_2139)-(4))|0);
       $150=((HEAP32[(($149)>>2)])|0);
       $151=((HEAP32[(($150)>>2)])|0);
       $152=(($151+24)|0);
       $153=$152;
       $154=(+(HEAPF32[(($153)>>2)]));
       $155=$148<$154;
       if ($155) {
        $j_2_lcssa=$j_2139;
        break L667;
       }
       $157=$148==$154;
       if ($157) {
        $159=(($145+28)|0);
        $160=$159;
        $161=(+(HEAPF32[(($160)>>2)]));
        $162=(($151+28)|0);
        $163=$162;
        $164=(+(HEAPF32[(($163)>>2)]));
        $phitmp=$161>$164;
        if (!($phitmp)) {
         $j_2_lcssa=$j_2139;
         break L667;
        }
       }
       $165=((HEAP32[(($149)>>2)])|0);
       HEAP32[(($j_2139)>>2)]=$165;
       $166=($149>>>0)>($p_0_lcssa>>>0);
       if ($166) {
        $j_2139=$149;
       } else {
        $j_2_lcssa=$149;
        break;
       }
      }
     } else {
      $j_2_lcssa=$i_2144;
     }
    } while(0);
    HEAP32[(($j_2_lcssa)>>2)]=$143;
    $i_2=(($i_2144+4)|0);
    $167=($i_2>>>0)>($r_0_ph147>>>0);
    if ($167) {
     break;
    } else {
     $i_2144=$i_2;
    }
   }
  }
  $28=((($top_1_lcssa)-(8))|0);
  $29=($28>>>0)<($1>>>0);
  if ($29) {
   break;
  } else {
   $top_0159=$top_1_lcssa;$seed_0160=$seed_1_lcssa;$31=$28;
  }
 }
 $168=((HEAP32[(($6)>>2)])|0);
 $169=(($pq+16)|0);
 HEAP32[(($169)>>2)]=$168;
 $170=(($pq+20)|0);
 HEAP32[(($170)>>2)]=1;
 $171=(($pq)|0);
 $172=((HEAP32[(($171)>>2)])|0);
 _pqHeapInit($172);
 $173=((HEAP32[(($12)>>2)])|0);
 $174=((HEAP32[(($6)>>2)])|0);
 $_sum108=((($174)-(1))|0);
 $175=(($173+($_sum108<<2))|0);
 $176=($_sum108|0)>0;
 if ($176) {
  $i_3116=$173;
 } else {
  $_0=1;
  STACKTOP=sp;return (($_0)|0);
 }
 while(1) {
  $177=(($i_3116+4)|0);
  $178=((HEAP32[(($177)>>2)])|0);
  $179=((HEAP32[(($178)>>2)])|0);
  $180=(($179+24)|0);
  $181=$180;
  $182=(+(HEAPF32[(($181)>>2)]));
  $183=((HEAP32[(($i_3116)>>2)])|0);
  $184=((HEAP32[(($183)>>2)])|0);
  $185=(($184+24)|0);
  $186=$185;
  $187=(+(HEAPF32[(($186)>>2)]));
  $188=$182<$187;
  if (!($188)) {
   $190=$182==$187;
   if (!($190)) {
    label = 533;
    break;
   }
   $192=(($179+28)|0);
   $193=$192;
   $194=(+(HEAPF32[(($193)>>2)]));
   $195=(($184+28)|0);
   $196=$195;
   $197=(+(HEAPF32[(($196)>>2)]));
   $198=$194>$197;
   if ($198) {
    label = 534;
    break;
   }
  }
  $199=($177>>>0)<($175>>>0);
  if ($199) {
   $i_3116=$177;
  } else {
   $_0=1;
   label = 537;
   break;
  }
 }
 if ((label|0) == 533) {
  ___assert_fail(((560)|0),((1552)|0),((413)|0),((1960)|0));
  return ((0)|0);
 }
 else if ((label|0) == 534) {
  ___assert_fail(((560)|0),((1552)|0),((413)|0),((1960)|0));
  return ((0)|0);
 }
 else if ((label|0) == 537) {
  STACKTOP=sp;return (($_0)|0);
 }
  return 0;
}
function _pqInsert($alloc,$pq,$keyNew){
 $alloc=($alloc)|0;
 $pq=($pq)|0;
 $keyNew=($keyNew)|0;
 var $1=0,$2=0,$3=0,$5=0,$6=0,$7=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$16=0,$17=0,$18=0,$20=0,$21=0,$22=0,$23=0,$24=0;
 var $25=0,$26=0,$27=0,$28=0,$29=0,$30=0,$31=0,$34=0,$37=0,$38=0,$39=0,$40=0,$_0=0,label=0;
 $1=(($pq+20)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=($2|0)==0;
 if (!($3)) {
  $5=(($pq)|0);
  $6=((HEAP32[(($5)>>2)])|0);
  $7=((_pqHeapInsert($alloc,$6,$keyNew))|0);
  $_0=$7;
  return (($_0)|0);
 }
 $9=(($pq+12)|0);
 $10=((HEAP32[(($9)>>2)])|0);
 $11=((($10)+(1))|0);
 HEAP32[(($9)>>2)]=$11;
 $12=(($pq+16)|0);
 $13=((HEAP32[(($12)>>2)])|0);
 $14=($11|0)<($13|0);
 do {
  if (!($14)) {
   $16=(($alloc+4)|0);
   $17=((HEAP32[(($16)>>2)])|0);
   $18=($17|0)==0;
   if ($18) {
    $_0=268435455;
    return (($_0)|0);
   }
   $20=(($pq+4)|0);
   $21=((HEAP32[(($20)>>2)])|0);
   $22=$13<<1;
   HEAP32[(($12)>>2)]=$22;
   $23=((HEAP32[(($16)>>2)])|0);
   $24=(($alloc+12)|0);
   $25=((HEAP32[(($24)>>2)])|0);
   $26=((HEAP32[(($20)>>2)])|0);
   $27=$26;
   $28=$13<<3;
   $29=((FUNCTION_TABLE_iiii[($23)&7]($25,$27,$28))|0);
   $30=$29;
   HEAP32[(($20)>>2)]=$30;
   $31=($29|0)==0;
   if (!($31)) {
    break;
   }
   HEAP32[(($20)>>2)]=$21;
   $_0=268435455;
   return (($_0)|0);
  }
 } while(0);
 $34=($10|0)==268435455;
 if ($34) {
  ___assert_fail(((424)|0),((1552)|0),((448)|0),((1944)|0));
  return ((0)|0);
 }
 $37=(($pq+4)|0);
 $38=((HEAP32[(($37)>>2)])|0);
 $39=(($38+($10<<2))|0);
 HEAP32[(($39)>>2)]=$keyNew;
 $40=$10^-1;
 $_0=$40;
 return (($_0)|0);
}
function _pqExtractMin($pq){
 $pq=($pq)|0;
 var $1=0,$2=0,$3=0,$5=0,$6=0,$7=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$21=0,$22=0,$23=0;
 var $24=0,$25=0,$26=0,$27=0,$28=0,$29=0,$30=0,$31=.0,$32=0,$33=0,$34=.0,$35=0,$37=0,$39=0,$40=0,$41=.0,$42=0,$43=0,$44=.0,$45=0;
 var $47=0,$48=0,$49=0,$50=0,$51=0,$53=0,$54=0,$55=0,$56=0,$57=0,$58=0,$_0=0,label=0;
 $1=(($pq+12)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=($2|0)==0;
 if ($3) {
  $5=(($pq)|0);
  $6=((HEAP32[(($5)>>2)])|0);
  $7=((_pqHeapExtractMin($6))|0);
  $_0=$7;
  return (($_0)|0);
 }
 $9=((($2)-(1))|0);
 $10=(($pq+8)|0);
 $11=((HEAP32[(($10)>>2)])|0);
 $12=(($11+($9<<2))|0);
 $13=((HEAP32[(($12)>>2)])|0);
 $14=((HEAP32[(($13)>>2)])|0);
 $15=(($pq)|0);
 $16=((HEAP32[(($15)>>2)])|0);
 $17=(($16+8)|0);
 $18=((HEAP32[(($17)>>2)])|0);
 $19=($18|0)==0;
 do {
  if (!($19)) {
   $21=(($16)|0);
   $22=((HEAP32[(($21)>>2)])|0);
   $23=(($22+4)|0);
   $24=((HEAP32[(($23)>>2)])|0);
   $25=(($16+4)|0);
   $26=((HEAP32[(($25)>>2)])|0);
   $27=(($26+($24<<3))|0);
   $28=((HEAP32[(($27)>>2)])|0);
   $29=(($28+24)|0);
   $30=$29;
   $31=(+(HEAPF32[(($30)>>2)]));
   $32=(($14+24)|0);
   $33=$32;
   $34=(+(HEAPF32[(($33)>>2)]));
   $35=$31<$34;
   if (!($35)) {
    $37=$31==$34;
    if (!($37)) {
     break;
    }
    $39=(($28+28)|0);
    $40=$39;
    $41=(+(HEAPF32[(($40)>>2)]));
    $42=(($14+28)|0);
    $43=$42;
    $44=(+(HEAPF32[(($43)>>2)]));
    $45=$41>$44;
    if ($45) {
     break;
    }
   }
   $47=((HEAP32[(($15)>>2)])|0);
   $48=((_pqHeapExtractMin($47))|0);
   $_0=$48;
   return (($_0)|0);
  }
 } while(0);
 while(1) {
  $49=((HEAP32[(($1)>>2)])|0);
  $50=((($49)-(1))|0);
  HEAP32[(($1)>>2)]=$50;
  $51=($50|0)>0;
  if (!($51)) {
   $_0=$14;
   label = 563;
   break;
  }
  $53=((($49)-(2))|0);
  $54=((HEAP32[(($10)>>2)])|0);
  $55=(($54+($53<<2))|0);
  $56=((HEAP32[(($55)>>2)])|0);
  $57=((HEAP32[(($56)>>2)])|0);
  $58=($57|0)==0;
  if (!($58)) {
   $_0=$14;
   label = 564;
   break;
  }
 }
 if ((label|0) == 563) {
  return (($_0)|0);
 }
 else if ((label|0) == 564) {
  return (($_0)|0);
 }
  return 0;
}
function _pqMinimum($pq){
 $pq=($pq)|0;
 var $1=0,$2=0,$3=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$16=0,$17=0,$18=0,$19=0,$20=0,$21=0,$22=0;
 var $23=0,$24=0,$25=0,$26=0,$28=0,$29=0,$30=0,$31=0,$32=0,$33=0,$34=0,$35=0,$36=0,$37=0,$38=.0,$39=0,$40=0,$41=.0,$42=0,$44=0;
 var $46=0,$47=0,$48=.0,$49=0,$50=0,$51=.0,$52=0,$_0=0,label=0;
 $1=(($pq+12)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=($2|0)==0;
 if ($3) {
  $5=(($pq)|0);
  $6=((HEAP32[(($5)>>2)])|0);
  $7=(($6)|0);
  $8=((HEAP32[(($7)>>2)])|0);
  $9=(($8+4)|0);
  $10=((HEAP32[(($9)>>2)])|0);
  $11=(($6+4)|0);
  $12=((HEAP32[(($11)>>2)])|0);
  $13=(($12+($10<<3))|0);
  $14=((HEAP32[(($13)>>2)])|0);
  $_0=$14;
  return (($_0)|0);
 }
 $16=((($2)-(1))|0);
 $17=(($pq+8)|0);
 $18=((HEAP32[(($17)>>2)])|0);
 $19=(($18+($16<<2))|0);
 $20=((HEAP32[(($19)>>2)])|0);
 $21=((HEAP32[(($20)>>2)])|0);
 $22=(($pq)|0);
 $23=((HEAP32[(($22)>>2)])|0);
 $24=(($23+8)|0);
 $25=((HEAP32[(($24)>>2)])|0);
 $26=($25|0)==0;
 do {
  if (!($26)) {
   $28=(($23)|0);
   $29=((HEAP32[(($28)>>2)])|0);
   $30=(($29+4)|0);
   $31=((HEAP32[(($30)>>2)])|0);
   $32=(($23+4)|0);
   $33=((HEAP32[(($32)>>2)])|0);
   $34=(($33+($31<<3))|0);
   $35=((HEAP32[(($34)>>2)])|0);
   $36=(($35+24)|0);
   $37=$36;
   $38=(+(HEAPF32[(($37)>>2)]));
   $39=(($21+24)|0);
   $40=$39;
   $41=(+(HEAPF32[(($40)>>2)]));
   $42=$38<$41;
   if ($42) {
    $_0=$35;
    return (($_0)|0);
   }
   $44=$38==$41;
   if (!($44)) {
    break;
   }
   $46=(($35+28)|0);
   $47=$46;
   $48=(+(HEAPF32[(($47)>>2)]));
   $49=(($21+28)|0);
   $50=$49;
   $51=(+(HEAPF32[(($50)>>2)]));
   $52=$48>$51;
   if ($52) {
    break;
   } else {
    $_0=$35;
   }
   return (($_0)|0);
  }
 } while(0);
 $_0=$21;
 return (($_0)|0);
}
function _pqDelete($pq,$curr){
 $pq=($pq)|0;
 $curr=($curr)|0;
 var $1=0,$3=0,$4=0,$6=0,$7=0,$8=0,$9=0,$11=0,$12=0,$13=0,$14=0,$15=0,$18=0,$19=0,$20=0,$21=0,$23=0,$24=0,$25=0,$26=0;
 var $27=0,$28=0,$29=0,$31=0,label=0;
 $1=($curr|0)>-1;
 if ($1) {
  $3=(($pq)|0);
  $4=((HEAP32[(($3)>>2)])|0);
  _pqHeapDelete($4,$curr);
  return;
 }
 $6=$curr^-1;
 $7=(($pq+16)|0);
 $8=((HEAP32[(($7)>>2)])|0);
 $9=($8|0)>($6|0);
 if (!($9)) {
  ___assert_fail(((328)|0),((1552)|0),((508)|0),((2024)|0));
 }
 $11=(($pq+4)|0);
 $12=((HEAP32[(($11)>>2)])|0);
 $13=(($12+($6<<2))|0);
 $14=((HEAP32[(($13)>>2)])|0);
 $15=($14|0)==0;
 if ($15) {
  ___assert_fail(((328)|0),((1552)|0),((508)|0),((2024)|0));
 }
 HEAP32[(($13)>>2)]=0;
 $18=(($pq+12)|0);
 $19=((HEAP32[(($18)>>2)])|0);
 $20=($19|0)>0;
 if (!($20)) {
  return;
 }
 $21=(($pq+8)|0);
 $23=$19;
 while(1) {
  $24=((($23)-(1))|0);
  $25=((HEAP32[(($21)>>2)])|0);
  $26=(($25+($24<<2))|0);
  $27=((HEAP32[(($26)>>2)])|0);
  $28=((HEAP32[(($27)>>2)])|0);
  $29=($28|0)==0;
  if (!($29)) {
   label = 592;
   break;
  }
  HEAP32[(($18)>>2)]=$24;
  $31=($24|0)>0;
  if ($31) {
   $23=$24;
  } else {
   label = 593;
   break;
  }
 }
 if ((label|0) == 593) {
  return;
 }
 else if ((label|0) == 592) {
  return;
 }
}
function _tessComputeInterior($tess){
 $tess=($tess)|0;
 var $1=0,$2=0,$4=0,$5=0,$6=0,$7=0,$_in=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$19=0,$20=0,$21=0;
 var $22=.0,$23=.0,$24=0,$26=0,$27=0,$28=.0,$29=.0,$30=0,$32=0,$33=0,$34=0,$35=0,$36=0,$37=0,$38=0,$39=0,$40=0,$41=0,$42=0,$43=0;
 var $44=0,$45=0,$46=0,$47=0,$48=0,$49=0,$50=0,$51=0,$52=0,$53=0,$54=0,$55=0,$56=0,$57=0,$58=0,$60=0,$_0=0,label=0;
 _RemoveDegenerateEdges($tess);
 $1=((_InitPriorityQ($tess))|0);
 $2=($1|0)==0;
 if ($2) {
  $_0=0;
  return (($_0)|0);
 }
 _InitEdgeDict($tess);
 $4=(($tess+68)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 $6=((_pqExtractMin($5))|0);
 $7=($6|0)==0;
 if (!($7)) {
  $_in=$6;
  while(1) {
   $8=$_in;
   $9=((HEAP32[(($4)>>2)])|0);
   $10=((_pqMinimum($9))|0);
   $11=($10|0)==0;
   L765: do {
    if (!($11)) {
     $12=(($_in+24)|0);
     $13=$12;
     $14=(($_in+28)|0);
     $15=$14;
     $16=(($_in+8)|0);
     $17=$16;
     $19=$10;
     while(1) {
      $20=(($19+24)|0);
      $21=$20;
      $22=(+(HEAPF32[(($21)>>2)]));
      $23=(+(HEAPF32[(($13)>>2)]));
      $24=$22==$23;
      if (!($24)) {
       break L765;
      }
      $26=(($19+28)|0);
      $27=$26;
      $28=(+(HEAPF32[(($27)>>2)]));
      $29=(+(HEAPF32[(($15)>>2)]));
      $30=$28==$29;
      if (!($30)) {
       break L765;
      }
      $32=((HEAP32[(($4)>>2)])|0);
      $33=((_pqExtractMin($32))|0);
      $34=((HEAP32[(($17)>>2)])|0);
      $35=(($33+8)|0);
      $36=$35;
      $37=((HEAP32[(($36)>>2)])|0);
      _SpliceMergeVertices($tess,$34,$37);
      $38=((HEAP32[(($4)>>2)])|0);
      $39=((_pqMinimum($38))|0);
      $40=($39|0)==0;
      if ($40) {
       break;
      } else {
       $19=$39;
      }
     }
    }
   } while(0);
   _SweepEvent($tess,$8);
   $41=((HEAP32[(($4)>>2)])|0);
   $42=((_pqExtractMin($41))|0);
   $43=($42|0)==0;
   if ($43) {
    break;
   } else {
    $_in=$42;
   }
  }
 }
 $44=(($tess+64)|0);
 $45=((HEAP32[(($44)>>2)])|0);
 $46=(($45+4)|0);
 $47=((HEAP32[(($46)>>2)])|0);
 $48=(($47)|0);
 $49=((HEAP32[(($48)>>2)])|0);
 $50=$49;
 $51=((HEAP32[(($50)>>2)])|0);
 $52=(($51+16)|0);
 $53=((HEAP32[(($52)>>2)])|0);
 $54=(($tess+72)|0);
 HEAP32[(($54)>>2)]=$53;
 _DoneEdgeDict($tess);
 _DonePriorityQ($tess);
 $55=(($tess)|0);
 $56=((HEAP32[(($55)>>2)])|0);
 $57=((_RemoveDegenerateFaces($tess,$56))|0);
 $58=($57|0)==0;
 if ($58) {
  $_0=0;
  return (($_0)|0);
 }
 $60=((HEAP32[(($55)>>2)])|0);
 _tessMeshCheckMesh($60);
 $_0=1;
 return (($_0)|0);
}
function _RemoveDegenerateEdges($tess){
 $tess=($tess)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$e_037=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=.0,$15=0,$16=0,$17=0,$18=0,$19=0;
 var $20=.0,$21=0,$23=0,$24=.0,$25=0,$26=.0,$27=0,$29=0,$30=0,$31=0,$33=0,$34=0,$35=0,$37=0,$39=0,$eLnext_0=0,$e_1=0,$41=0,$42=0,$43=0;
 var $45=0,$47=0,$49=0,$50=0,$51=0,$53=0,$54=0,$eNext_0=0,$56=0,$57=0,$58=0,$60=0,$eNext_1=0,$62=0,$64=0,$65=0,$66=0,$68=0,$69=0,$eNext_2=0;
 var $71=0,$72=0,$73=0,$e_0_be=0,$74=0,$76=0,label=0;
 $1=(($tess)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+68)|0);
 $4=(($3)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 $6=($5|0)==($3|0);
 if ($6) {
  return;
 } else {
  $e_037=$5;
 }
 L780: while(1) {
  $7=(($e_037)|0);
  $8=((HEAP32[(($7)>>2)])|0);
  $9=(($e_037+12)|0);
  $10=((HEAP32[(($9)>>2)])|0);
  $11=(($e_037+16)|0);
  $12=((HEAP32[(($11)>>2)])|0);
  $13=(($12+24)|0);
  $14=(+(HEAPF32[(($13)>>2)]));
  $15=(($e_037+4)|0);
  $16=((HEAP32[(($15)>>2)])|0);
  $17=(($16+16)|0);
  $18=((HEAP32[(($17)>>2)])|0);
  $19=(($18+24)|0);
  $20=(+(HEAPF32[(($19)>>2)]));
  $21=$14==$20;
  do {
   if ($21) {
    $23=(($12+28)|0);
    $24=(+(HEAPF32[(($23)>>2)]));
    $25=(($18+28)|0);
    $26=(+(HEAPF32[(($25)>>2)]));
    $27=$24==$26;
    if (!($27)) {
     $e_1=$e_037;$eLnext_0=$10;
     break;
    }
    $29=(($10+12)|0);
    $30=((HEAP32[(($29)>>2)])|0);
    $31=($30|0)==($e_037|0);
    if ($31) {
     $e_1=$e_037;$eLnext_0=$10;
     break;
    }
    _SpliceMergeVertices($tess,$10,$e_037);
    $33=((HEAP32[(($1)>>2)])|0);
    $34=((_tessMeshDelete($33,$e_037))|0);
    $35=($34|0)==0;
    if ($35) {
     label = 613;
     break L780;
    }
    $39=((HEAP32[(($29)>>2)])|0);
    $e_1=$10;$eLnext_0=$39;
   } else {
    $e_1=$e_037;$eLnext_0=$10;
   }
  } while(0);
  $41=(($eLnext_0+12)|0);
  $42=((HEAP32[(($41)>>2)])|0);
  $43=($42|0)==($e_1|0);
  if ($43) {
   $45=($eLnext_0|0)==($e_1|0);
   if ($45) {
    $eNext_1=$8;
   } else {
    $47=($eLnext_0|0)==($8|0);
    if ($47) {
     label = 619;
    } else {
     $49=(($8+4)|0);
     $50=((HEAP32[(($49)>>2)])|0);
     $51=($eLnext_0|0)==($50|0);
     if ($51) {
      label = 619;
     } else {
      $eNext_0=$8;
     }
    }
    if ((label|0) == 619) {
     label = 0;
     $53=(($8)|0);
     $54=((HEAP32[(($53)>>2)])|0);
     $eNext_0=$54;
    }
    $56=((HEAP32[(($1)>>2)])|0);
    $57=((_tessMeshDelete($56,$eLnext_0))|0);
    $58=($57|0)==0;
    if ($58) {
     label = 621;
     break;
    } else {
     $eNext_1=$eNext_0;
    }
   }
   $62=($e_1|0)==($eNext_1|0);
   if ($62) {
    label = 624;
   } else {
    $64=(($eNext_1+4)|0);
    $65=((HEAP32[(($64)>>2)])|0);
    $66=($e_1|0)==($65|0);
    if ($66) {
     label = 624;
    } else {
     $eNext_2=$eNext_1;
    }
   }
   if ((label|0) == 624) {
    label = 0;
    $68=(($eNext_1)|0);
    $69=((HEAP32[(($68)>>2)])|0);
    $eNext_2=$69;
   }
   $71=((HEAP32[(($1)>>2)])|0);
   $72=((_tessMeshDelete($71,$e_1))|0);
   $73=($72|0)==0;
   if ($73) {
    label = 627;
    break;
   } else {
    $e_0_be=$eNext_2;
   }
  } else {
   $e_0_be=$8;
  }
  $74=($e_0_be|0)==($3|0);
  if ($74) {
   label = 629;
   break;
  } else {
   $e_037=$e_0_be;
  }
 }
 if ((label|0) == 627) {
  $76=(($tess+144)|0);
  _longjmp((($76)|0),((1)|0));
 }
 else if ((label|0) == 613) {
  $37=(($tess+144)|0);
  _longjmp((($37)|0),((1)|0));
 }
 else if ((label|0) == 629) {
  return;
 }
 else if ((label|0) == 621) {
  $60=(($tess+144)|0);
  _longjmp((($60)|0),((1)|0));
 }
}
function _InitPriorityQ($tess){
 $tess=($tess)|0;
 var $1=0,$2=0,$3=0,$4=0,$v_027=0,$5=0,$v_029=0,$vertexCount_028=0,$6=0,$7=0,$v_0=0,$8=0,$vertexCount_0_lcssa=0,$9=0,$10=0,$11=0,$12=0,$_=0,$13=0,$14=0;
 var $15=0,$16=0,$18=0,$19=0,$20=0,$v_1_in=0,$v_1=0,$22=0,$24=0,$25=0,$26=0,$27=0,$28=0,$29=0,$30=0,$31=0,$_0=0,label=0;
 $1=(($tess)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2)|0);
 $4=(($2)|0);
 $v_027=((HEAP32[(($4)>>2)])|0);
 $5=($v_027|0)==($3|0);
 if ($5) {
  $vertexCount_0_lcssa=0;
 } else {
  $vertexCount_028=0;$v_029=$v_027;
  while(1) {
   $6=((($vertexCount_028)+(1))|0);
   $7=(($v_029)|0);
   $v_0=((HEAP32[(($7)>>2)])|0);
   $8=($v_0|0)==($3|0);
   if ($8) {
    $vertexCount_0_lcssa=$6;
    break;
   } else {
    $vertexCount_028=$6;$v_029=$v_0;
   }
  }
 }
 $9=(($tess+104)|0);
 $10=(($tess+140)|0);
 $11=((HEAP32[(($10)>>2)])|0);
 $12=($11|0)>8;
 $_=($12?$11:8);
 $13=((($_)+($vertexCount_0_lcssa))|0);
 $14=((_pqNewPriorityQ($9,$13,(2)))|0);
 $15=(($tess+68)|0);
 HEAP32[(($15)>>2)]=$14;
 $16=($14|0)==0;
 if ($16) {
  $_0=0;
  return (($_0)|0);
 }
 $18=((HEAP32[(($1)>>2)])|0);
 $19=(($18)|0);
 $20=(($18)|0);
 $v_1_in=$20;
 while(1) {
  $v_1=((HEAP32[(($v_1_in)>>2)])|0);
  $22=($v_1|0)==($19|0);
  if ($22) {
   label = 637;
   break;
  }
  $24=$v_1;
  $25=((_pqInsert($9,$14,$24))|0);
  $26=(($v_1+32)|0);
  HEAP32[(($26)>>2)]=$25;
  $27=($25|0)==268435455;
  $28=(($v_1)|0);
  if ($27) {
   break;
  } else {
   $v_1_in=$28;
  }
 }
 do {
  if ((label|0) == 637) {
   $29=((_pqInit($9,$14))|0);
   $30=($29|0)==0;
   if ($30) {
    break;
   } else {
    $_0=1;
   }
   return (($_0)|0);
  }
 } while(0);
 $31=((HEAP32[(($15)>>2)])|0);
 _pqDeletePriorityQ($9,$31);
 HEAP32[(($15)>>2)]=0;
 $_0=0;
 return (($_0)|0);
}
function _InitEdgeDict($tess){
 $tess=($tess)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$7=0,$9=0,$10=.0,$11=0,$12=.0,$13=.0,$14=0,$15=.0,$16=0,$17=.0,$18=.0,$19=.0,$20=.0,$21=.0,$22=.0;
 var label=0;
 $1=(($tess+104)|0);
 $2=$tess;
 $3=((_dictNewDict($1,$2,(2)))|0);
 $4=(($tess+64)|0);
 HEAP32[(($4)>>2)]=$3;
 $5=($3|0)==0;
 if ($5) {
  $7=(($tess+144)|0);
  _longjmp((($7)|0),((1)|0));
 } else {
  $9=(($tess+52)|0);
  $10=(+(HEAPF32[(($9)>>2)]));
  $11=(($tess+44)|0);
  $12=(+(HEAPF32[(($11)>>2)]));
  $13=($10)-($12);
  $14=(($tess+56)|0);
  $15=(+(HEAPF32[(($14)>>2)]));
  $16=(($tess+48)|0);
  $17=(+(HEAPF32[(($16)>>2)]));
  $18=($15)-($17);
  $19=($12)-($13);
  $20=($10)+($13);
  $21=($17)-($18);
  $22=($15)+($18);
  _AddSentinel($tess,$19,$20,$21);
  _AddSentinel($tess,$19,$20,$22);
  return;
 }
}
function _SpliceMergeVertices($tess,$e1,$e2){
 $tess=($tess)|0;
 $e1=($e1)|0;
 $e2=($e2)|0;
 var $1=0,$2=0,$3=0,$4=0,$6=0,label=0;
 $1=(($tess)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=((_tessMeshSplice($2,$e1,$e2))|0);
 $4=($3|0)==0;
 if ($4) {
  $6=(($tess+144)|0);
  _longjmp((($6)|0),((1)|0));
 } else {
  return;
 }
}
function _SweepEvent($tess,$vEvent){
 $tess=($tess)|0;
 $vEvent=($vEvent)|0;
 var $1=0,$2=0,$3=0,$e_0=0,$5=0,$6=0,$7=0,$9=0,$10=0,$11=0,$12=0,$15=0,$16=0,$18=0,$20=0,$21=0,$22=0,$23=0,$24=0,$25=0;
 var $26=0,$27=0,$28=0,$29=0,$30=0,$31=0,$32=0,label=0;
 $1=(($tess+72)|0);
 HEAP32[(($1)>>2)]=$vEvent;
 $2=(($vEvent+8)|0);
 $3=((HEAP32[(($2)>>2)])|0);
 $e_0=$3;
 while(1) {
  $5=(($e_0+24)|0);
  $6=((HEAP32[(($5)>>2)])|0);
  $7=($6|0)==0;
  if (!($7)) {
   break;
  }
  $9=(($e_0+8)|0);
  $10=((HEAP32[(($9)>>2)])|0);
  $11=((HEAP32[(($2)>>2)])|0);
  $12=($10|0)==($11|0);
  if ($12) {
   label = 652;
   break;
  } else {
   $e_0=$10;
  }
 }
 if ((label|0) == 652) {
  _ConnectLeftVertex($tess,$vEvent);
  return;
 }
 $15=((_TopLeftRegion($tess,$6))|0);
 $16=($15|0)==0;
 if ($16) {
  $18=(($tess+144)|0);
  _longjmp((($18)|0),((1)|0));
 }
 $20=(($15+4)|0);
 $21=((HEAP32[(($20)>>2)])|0);
 $22=(($21+8)|0);
 $23=((HEAP32[(($22)>>2)])|0);
 $24=(($23)|0);
 $25=((HEAP32[(($24)>>2)])|0);
 $26=$25;
 $27=$25;
 $28=((HEAP32[(($27)>>2)])|0);
 $29=((_FinishLeftRegions($tess,$26,0))|0);
 $30=(($29+8)|0);
 $31=((HEAP32[(($30)>>2)])|0);
 $32=($31|0)==($28|0);
 if ($32) {
  _ConnectRightVertex($tess,$15,$29);
  return;
 } else {
  _AddRightEdges($tess,$15,$31,$28,$28,1);
  return;
 }
}
function _DoneEdgeDict($tess){
 $tess=($tess)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$_in=0,$fixedEdges_010=0,$8=0,$9=0,$10=0,$11=0,$12=0,$14=0,$15=0,$16=0,$17=0,$20=0,$23=0;
 var $fixedEdges_1=0,$25=0,$26=0,$27=0,$28=0,$31=0,$32=0,$33=0,$34=0,$35=0,$36=0,$_lcssa=0,$37=0,label=0;
 $1=(($tess+64)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+4)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($4)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=($6|0)==0;
 if ($7) {
  $_lcssa=$2;
  $37=(($tess+104)|0);
  _dictDeleteDict($37,$_lcssa);
  return;
 } else {
  $fixedEdges_010=0;$_in=$6;
 }
 while(1) {
  $8=$_in;
  $9=(($_in+16)|0);
  $10=$9;
  $11=((HEAP32[(($10)>>2)])|0);
  $12=($11|0)==0;
  if ($12) {
   $14=(($_in+24)|0);
   $15=$14;
   $16=((HEAP32[(($15)>>2)])|0);
   $17=($16|0)==0;
   if ($17) {
    label = 665;
    break;
   }
   $20=($fixedEdges_010|0)==0;
   if (!($20)) {
    label = 667;
    break;
   }
   $23=((($fixedEdges_010)+(1))|0);
   $fixedEdges_1=$23;
  } else {
   $fixedEdges_1=$fixedEdges_010;
  }
  $25=(($_in+8)|0);
  $26=$25;
  $27=((HEAP32[(($26)>>2)])|0);
  $28=($27|0)==0;
  if (!($28)) {
   label = 670;
   break;
  }
  _DeleteRegion($tess,$8);
  $31=((HEAP32[(($1)>>2)])|0);
  $32=(($31+4)|0);
  $33=((HEAP32[(($32)>>2)])|0);
  $34=(($33)|0);
  $35=((HEAP32[(($34)>>2)])|0);
  $36=($35|0)==0;
  if ($36) {
   $_lcssa=$31;
   label = 673;
   break;
  } else {
   $fixedEdges_010=$fixedEdges_1;$_in=$35;
  }
 }
 if ((label|0) == 667) {
  ___assert_fail(((648)|0),((1456)|0),((1146)|0),((2160)|0));
 }
 else if ((label|0) == 665) {
  ___assert_fail(((752)|0),((1456)|0),((1145)|0),((2160)|0));
 }
 else if ((label|0) == 673) {
  $37=(($tess+104)|0);
  _dictDeleteDict($37,$_lcssa);
  return;
 }
 else if ((label|0) == 670) {
  ___assert_fail(((536)|0),((1456)|0),((1148)|0),((2160)|0));
 }
}
function _DonePriorityQ($tess){
 $tess=($tess)|0;
 var $1=0,$2=0,$3=0,label=0;
 $1=(($tess+104)|0);
 $2=(($tess+68)|0);
 $3=((HEAP32[(($2)>>2)])|0);
 _pqDeletePriorityQ($1,$3);
 return;
}
function _RemoveDegenerateFaces($tess,$mesh){
 $tess=($tess)|0;
 $mesh=($mesh)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$f_014=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$16=0,$17=0,$18=0,$20=0,$21=0,$22=0,$23=0;
 var $24=0,$25=0,$26=0,$27=0,$28=0,$29=0,$30=0,$31=0,$32=0,$33=0,$34=0,$35=0,$36=0,$37=0,$38=0,$39=0,$40=0,$_0=0,label=0;
 $1=(($mesh+44)|0);
 $2=(($1)|0);
 $3=((HEAP32[(($2)>>2)])|0);
 $4=($3|0)==($1|0);
 if ($4) {
  $_0=1;
  return (($_0)|0);
 }
 $5=(($tess)|0);
 $f_014=$3;
 while(1) {
  $7=(($f_014)|0);
  $8=((HEAP32[(($7)>>2)])|0);
  $9=(($f_014+8)|0);
  $10=((HEAP32[(($9)>>2)])|0);
  $11=(($10+12)|0);
  $12=((HEAP32[(($11)>>2)])|0);
  $13=($12|0)==($10|0);
  if ($13) {
   label = 679;
   break;
  }
  $16=(($12+12)|0);
  $17=((HEAP32[(($16)>>2)])|0);
  $18=($17|0)==($10|0);
  if ($18) {
   $20=(($10+28)|0);
   $21=((HEAP32[(($20)>>2)])|0);
   $22=(($10+8)|0);
   $23=((HEAP32[(($22)>>2)])|0);
   $24=(($23+28)|0);
   $25=((HEAP32[(($24)>>2)])|0);
   $26=((($25)+($21))|0);
   HEAP32[(($24)>>2)]=$26;
   $27=(($10+4)|0);
   $28=((HEAP32[(($27)>>2)])|0);
   $29=(($28+28)|0);
   $30=((HEAP32[(($29)>>2)])|0);
   $31=((HEAP32[(($22)>>2)])|0);
   $32=(($31+4)|0);
   $33=((HEAP32[(($32)>>2)])|0);
   $34=(($33+28)|0);
   $35=((HEAP32[(($34)>>2)])|0);
   $36=((($35)+($30))|0);
   HEAP32[(($34)>>2)]=$36;
   $37=((HEAP32[(($5)>>2)])|0);
   $38=((_tessMeshDelete($37,$10))|0);
   $39=($38|0)==0;
   if ($39) {
    $_0=0;
    label = 686;
    break;
   }
  }
  $40=($8|0)==($1|0);
  if ($40) {
   $_0=1;
   label = 684;
   break;
  } else {
   $f_014=$8;
  }
 }
 if ((label|0) == 679) {
  ___assert_fail(((704)|0),((1456)|0),((1255)|0),((2040)|0));
  return ((0)|0);
 }
 else if ((label|0) == 686) {
  return (($_0)|0);
 }
 else if ((label|0) == 684) {
  return (($_0)|0);
 }
  return 0;
}
function _DeleteRegion($tess,$reg){
 $tess=($tess)|0;
 $reg=($reg)|0;
 var $1=0,$2=0,$3=0,$5=0,$6=0,$7=0,$8=0,$9=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0,$21=0,label=0;
 $1=(($reg+24)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=($2|0)==0;
 do {
  if (!($3)) {
   $5=(($reg)|0);
   $6=((HEAP32[(($5)>>2)])|0);
   $7=(($6+28)|0);
   $8=((HEAP32[(($7)>>2)])|0);
   $9=($8|0)==0;
   if ($9) {
    break;
   }
   ___assert_fail(((400)|0),((1456)|0),((146)|0),((2176)|0));
  }
 } while(0);
 $12=(($reg)|0);
 $13=((HEAP32[(($12)>>2)])|0);
 $14=(($13+24)|0);
 HEAP32[(($14)>>2)]=0;
 $15=(($tess+64)|0);
 $16=((HEAP32[(($15)>>2)])|0);
 $17=(($reg+4)|0);
 $18=((HEAP32[(($17)>>2)])|0);
 _dictDelete($16,$18);
 $19=(($tess+76)|0);
 $20=((HEAP32[(($19)>>2)])|0);
 $21=$reg;
 _bucketFree($20,$21);
 return;
}
function _ConnectLeftVertex($tess,$vEvent){
 $tess=($tess)|0;
 $vEvent=($vEvent)|0;
 var $tmp=0,$1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0;
 var $20=0,$21=0,$23=0,$24=0,$25=0,$26=0,$27=0,$28=0,$29=0,$30=0,$31=0,$32=0,$33=.0,$34=0,$37=0,$38=0,$39=0,$40=0,$41=0,$42=.0;
 var $43=0,$44=0,$45=0,$46=0,$47=.0,$48=0,$50=0,$52=0,$53=.0,$54=0,$55=.0,$56=0,$59=0,$60=0,$61=0,$62=0,$63=0,$65=0,$66=0,$67=0;
 var $69=0,$70=0,$71=0,$73=0,$74=0,$75=0,$76=0,$77=0,$78=0,$79=0,$81=0,$83=0,$84=0,$85=0,$86=0,$87=0,$88=0,$89=0,$90=0,$92=0;
 var $94=0,$95=0,$eNew_0=0,$97=0,$98=0,$99=0,$101=0,$102=0,$104=0,$106=0,$109=0,label=0;
 var sp=0;sp=STACKTOP;STACKTOP=(STACKTOP+32)|0;
 $tmp=((sp)|0);
 $1=(($vEvent+8)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+4)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($tmp)|0);
 HEAP32[(($5)>>2)]=$4;
 $6=(($tess+64)|0);
 $7=((HEAP32[(($6)>>2)])|0);
 $8=$tmp;
 $9=((_dictSearch($7,$8))|0);
 $10=(($9)|0);
 $11=((HEAP32[(($10)>>2)])|0);
 $12=$11;
 $13=(($11+4)|0);
 $14=$13;
 $15=((HEAP32[(($14)>>2)])|0);
 $16=(($15+8)|0);
 $17=((HEAP32[(($16)>>2)])|0);
 $18=(($17)|0);
 $19=((HEAP32[(($18)>>2)])|0);
 $20=$19;
 $21=($19|0)==0;
 if ($21) {
  STACKTOP=sp;return;
 }
 $23=$11;
 $24=((HEAP32[(($23)>>2)])|0);
 $25=$19;
 $26=((HEAP32[(($25)>>2)])|0);
 $27=(($24+4)|0);
 $28=((HEAP32[(($27)>>2)])|0);
 $29=(($28+16)|0);
 $30=((HEAP32[(($29)>>2)])|0);
 $31=(($24+16)|0);
 $32=((HEAP32[(($31)>>2)])|0);
 $33=(+(_tesedgeSign($30,$vEvent,$32)));
 $34=$33==(0.0);
 if ($34) {
  _ConnectLeftDegenerate($tess,$12,$vEvent);
  STACKTOP=sp;return;
 }
 $37=(($26+4)|0);
 $38=((HEAP32[(($37)>>2)])|0);
 $39=(($38+16)|0);
 $40=((HEAP32[(($39)>>2)])|0);
 $41=(($40+24)|0);
 $42=(+(HEAPF32[(($41)>>2)]));
 $43=((HEAP32[(($27)>>2)])|0);
 $44=(($43+16)|0);
 $45=((HEAP32[(($44)>>2)])|0);
 $46=(($45+24)|0);
 $47=(+(HEAPF32[(($46)>>2)]));
 $48=$42<$47;
 do {
  if ($48) {
   $59=$12;
  } else {
   $50=$42==$47;
   if ($50) {
    $52=(($40+28)|0);
    $53=(+(HEAPF32[(($52)>>2)]));
    $54=(($45+28)|0);
    $55=(+(HEAPF32[(($54)>>2)]));
    $56=$53>$55;
    if (!($56)) {
     $59=$12;
     break;
    }
   }
   $59=$20;
  }
 } while(0);
 $60=(($11+12)|0);
 $61=$60;
 $62=((HEAP32[(($61)>>2)])|0);
 $63=($62|0)==0;
 do {
  if ($63) {
   $65=(($59+24)|0);
   $66=((HEAP32[(($65)>>2)])|0);
   $67=($66|0)==0;
   if (!($67)) {
    break;
   }
   $109=((HEAP32[(($1)>>2)])|0);
   _AddRightEdges($tess,$12,$109,$109,0,1);
   STACKTOP=sp;return;
  }
 } while(0);
 $69=($59|0)==($12|0);
 $70=(($tess)|0);
 $71=((HEAP32[(($70)>>2)])|0);
 do {
  if ($69) {
   $73=((HEAP32[(($1)>>2)])|0);
   $74=(($73+4)|0);
   $75=((HEAP32[(($74)>>2)])|0);
   $76=(($24+12)|0);
   $77=((HEAP32[(($76)>>2)])|0);
   $78=((_tessMeshConnect($71,$75,$77))|0);
   $79=($78|0)==0;
   if (!($79)) {
    $eNew_0=$78;
    break;
   }
   $81=(($tess+144)|0);
   _longjmp((($81)|0),((1)|0));
  } else {
   $83=((HEAP32[(($37)>>2)])|0);
   $84=(($83+8)|0);
   $85=((HEAP32[(($84)>>2)])|0);
   $86=(($85+4)|0);
   $87=((HEAP32[(($86)>>2)])|0);
   $88=((HEAP32[(($1)>>2)])|0);
   $89=((_tessMeshConnect($71,$87,$88))|0);
   $90=($89|0)==0;
   if ($90) {
    $92=(($tess+144)|0);
    _longjmp((($92)|0),((1)|0));
   } else {
    $94=(($89+4)|0);
    $95=((HEAP32[(($94)>>2)])|0);
    $eNew_0=$95;
    break;
   }
  }
 } while(0);
 $97=(($59+24)|0);
 $98=((HEAP32[(($97)>>2)])|0);
 $99=($98|0)==0;
 do {
  if ($99) {
   $106=((_AddRegionBelow($tess,$12,$eNew_0))|0);
   _ComputeWinding($tess,$106);
  } else {
   $101=((_FixUpperEdge($tess,$59,$eNew_0))|0);
   $102=($101|0)==0;
   if (!($102)) {
    break;
   }
   $104=(($tess+144)|0);
   _longjmp((($104)|0),((1)|0));
  }
 } while(0);
 _SweepEvent($tess,$vEvent);
 STACKTOP=sp;return;
}
function _TopLeftRegion($tess,$reg){
 $tess=($tess)|0;
 $reg=($reg)|0;
 var $1=0,$2=0,$3=0,$4=0,$_013=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$19=0,$20=0,$21=0;
 var $22=0,$24=0,$25=0,$26=0,$27=0,$28=0,$29=0,$30=0,$31=0,$32=0,$33=0,$34=0,$35=0,$36=0,$37=0,$38=0,$39=0,$40=0,$42=0,$43=0;
 var $45=0,$46=0,$47=0,$48=0,$49=0,$50=0,$_0=0,label=0;
 $1=(($reg)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+16)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $_013=$reg;
 while(1) {
  $6=(($_013+4)|0);
  $7=((HEAP32[(($6)>>2)])|0);
  $8=(($7+4)|0);
  $9=((HEAP32[(($8)>>2)])|0);
  $10=(($9)|0);
  $11=((HEAP32[(($10)>>2)])|0);
  $12=$11;
  $13=$11;
  $14=((HEAP32[(($13)>>2)])|0);
  $15=(($14+16)|0);
  $16=((HEAP32[(($15)>>2)])|0);
  $17=($16|0)==($4|0);
  if ($17) {
   $_013=$12;
  } else {
   break;
  }
 }
 $19=(($11+24)|0);
 $20=$19;
 $21=((HEAP32[(($20)>>2)])|0);
 $22=($21|0)==0;
 if ($22) {
  $_0=$12;
  return (($_0)|0);
 }
 $24=(($tess)|0);
 $25=((HEAP32[(($24)>>2)])|0);
 $26=(($11+4)|0);
 $27=$26;
 $28=((HEAP32[(($27)>>2)])|0);
 $29=(($28+8)|0);
 $30=((HEAP32[(($29)>>2)])|0);
 $31=(($30)|0);
 $32=((HEAP32[(($31)>>2)])|0);
 $33=$32;
 $34=((HEAP32[(($33)>>2)])|0);
 $35=(($34+4)|0);
 $36=((HEAP32[(($35)>>2)])|0);
 $37=(($14+12)|0);
 $38=((HEAP32[(($37)>>2)])|0);
 $39=((_tessMeshConnect($25,$36,$38))|0);
 $40=($39|0)==0;
 if ($40) {
  $_0=0;
  return (($_0)|0);
 }
 $42=((_FixUpperEdge($tess,$12,$39))|0);
 $43=($42|0)==0;
 if ($43) {
  $_0=0;
  return (($_0)|0);
 }
 $45=((HEAP32[(($27)>>2)])|0);
 $46=(($45+4)|0);
 $47=((HEAP32[(($46)>>2)])|0);
 $48=(($47)|0);
 $49=((HEAP32[(($48)>>2)])|0);
 $50=$49;
 $_0=$50;
 return (($_0)|0);
}
function _FinishLeftRegions($tess,$regFirst,$regLast){
 $tess=($tess)|0;
 $regFirst=($regFirst)|0;
 $regLast=($regLast)|0;
 var $1=0,$ePrev_040=0,$2=0,$3=0,$4=0,$ePrev_042=0,$regPrev_041=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0;
 var $19=0,$20=0,$22=0,$23=0,$24=0,$25=0,$28=0,$29=0,$30=0,$31=0,$32=0,$33=0,$34=0,$35=0,$36=0,$38=0,$40=0,$41=0,$43=0,$e_0=0;
 var $45=0,$46=0,$47=0,$49=0,$50=0,$51=0,$52=0,$53=0,$54=0,$55=0,$57=0,$59=0,$60=0,$61=0,$63=0,$ePrev_0=0,$65=0,$ePrev_039=0,label=0;
 $1=(($regFirst)|0);
 $ePrev_040=((HEAP32[(($1)>>2)])|0);
 $2=($regFirst|0)==($regLast|0);
 if ($2) {
  $ePrev_039=$ePrev_040;
  return (($ePrev_039)|0);
 }
 $3=(($tess)|0);
 $4=(($tess)|0);
 $regPrev_041=$regFirst;$ePrev_042=$ePrev_040;
 while(1) {
  $6=(($regPrev_041+24)|0);
  HEAP32[(($6)>>2)]=0;
  $7=(($regPrev_041+4)|0);
  $8=((HEAP32[(($7)>>2)])|0);
  $9=(($8+8)|0);
  $10=((HEAP32[(($9)>>2)])|0);
  $11=(($10)|0);
  $12=((HEAP32[(($11)>>2)])|0);
  $13=$12;
  $14=$12;
  $15=((HEAP32[(($14)>>2)])|0);
  $16=(($15+16)|0);
  $17=((HEAP32[(($16)>>2)])|0);
  $18=(($ePrev_042+16)|0);
  $19=((HEAP32[(($18)>>2)])|0);
  $20=($17|0)==($19|0);
  if ($20) {
   $e_0=$15;
  } else {
   $22=(($12+24)|0);
   $23=$22;
   $24=((HEAP32[(($23)>>2)])|0);
   $25=($24|0)==0;
   if ($25) {
    label = 732;
    break;
   }
   $28=((HEAP32[(($4)>>2)])|0);
   $29=(($ePrev_042+8)|0);
   $30=((HEAP32[(($29)>>2)])|0);
   $31=(($30+4)|0);
   $32=((HEAP32[(($31)>>2)])|0);
   $33=(($15+4)|0);
   $34=((HEAP32[(($33)>>2)])|0);
   $35=((_tessMeshConnect($28,$32,$34))|0);
   $36=($35|0)==0;
   if ($36) {
    label = 734;
    break;
   }
   $40=((_FixUpperEdge($tess,$13,$35))|0);
   $41=($40|0)==0;
   if ($41) {
    label = 736;
    break;
   } else {
    $e_0=$35;
   }
  }
  $45=(($ePrev_042+8)|0);
  $46=((HEAP32[(($45)>>2)])|0);
  $47=($46|0)==($e_0|0);
  if (!($47)) {
   $49=((HEAP32[(($3)>>2)])|0);
   $50=(($e_0+4)|0);
   $51=((HEAP32[(($50)>>2)])|0);
   $52=(($51+12)|0);
   $53=((HEAP32[(($52)>>2)])|0);
   $54=((_tessMeshSplice($49,$53,$e_0))|0);
   $55=($54|0)==0;
   if ($55) {
    label = 739;
    break;
   }
   $59=((HEAP32[(($3)>>2)])|0);
   $60=((_tessMeshSplice($59,$ePrev_042,$e_0))|0);
   $61=($60|0)==0;
   if ($61) {
    label = 741;
    break;
   }
  }
  _FinishRegion($tess,$regPrev_041);
  $ePrev_0=((HEAP32[(($14)>>2)])|0);
  $65=($13|0)==($regLast|0);
  if ($65) {
   $ePrev_039=$ePrev_0;
   label = 746;
   break;
  } else {
   $regPrev_041=$13;$ePrev_042=$ePrev_0;
  }
 }
 if ((label|0) == 732) {
  _FinishRegion($tess,$regPrev_041);
  $ePrev_039=$ePrev_042;
  return (($ePrev_039)|0);
 }
 else if ((label|0) == 736) {
  $43=(($tess+144)|0);
  _longjmp((($43)|0),((1)|0));
  return ((0)|0);
 }
 else if ((label|0) == 739) {
  $57=(($tess+144)|0);
  _longjmp((($57)|0),((1)|0));
  return ((0)|0);
 }
 else if ((label|0) == 741) {
  $63=(($tess+144)|0);
  _longjmp((($63)|0),((1)|0));
  return ((0)|0);
 }
 else if ((label|0) == 734) {
  $38=(($tess+144)|0);
  _longjmp((($38)|0),((1)|0));
  return ((0)|0);
 }
 else if ((label|0) == 746) {
  return (($ePrev_039)|0);
 }
  return 0;
}
function _ConnectRightVertex($tess,$regUp,$eBottomLeft){
 $tess=($tess)|0;
 $regUp=($regUp)|0;
 $eBottomLeft=($eBottomLeft)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0;
 var $21=0,$22=0,$24=0,$26=0,$27=0,$28=0,$29=.0,$30=0,$31=0,$32=0,$33=.0,$34=0,$36=0,$37=.0,$38=0,$39=.0,$40=0,$42=0,$43=0,$44=0;
 var $45=0,$46=0,$47=0,$48=0,$49=0,$51=0,$53=0,$54=0,$56=0,$58=0,$59=0,$60=0,$61=0,$62=0,$63=0,$64=0,$65=0,$66=0,$67=0,$eTopLeft_0=0;
 var $_0=0,$degenerate_0=0,$69=0,$70=0,$71=0,$72=.0,$73=0,$74=0,$75=.0,$76=0,$78=0,$79=.0,$80=0,$81=.0,$82=0,$84=0,$85=0,$86=0,$87=0,$88=0;
 var $89=0,$90=0,$92=0,$93=0,$95=0,$_05253=0,$97=0,$98=0,$100=0,$101=0,$102=.0,$103=0,$104=0,$105=.0,$106=0,$108=0,$110=0,$111=.0,$112=0,$113=.0;
 var $114=0,$116=0,$117=0,$118=0,$eNew_0=0,$120=0,$121=0,$122=0,$123=0,$124=0,$125=0,$126=0,$127=0,$129=0,$131=0,$132=0,$133=0,$134=0,$135=0,$136=0;
 var $137=0,label=0;
 $1=(($eBottomLeft+8)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($regUp+4)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($4+8)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=(($6)|0);
 $8=((HEAP32[(($7)>>2)])|0);
 $9=$8;
 $10=(($regUp)|0);
 $11=((HEAP32[(($10)>>2)])|0);
 $12=$8;
 $13=((HEAP32[(($12)>>2)])|0);
 $14=(($11+4)|0);
 $15=((HEAP32[(($14)>>2)])|0);
 $16=(($15+16)|0);
 $17=((HEAP32[(($16)>>2)])|0);
 $18=(($13+4)|0);
 $19=((HEAP32[(($18)>>2)])|0);
 $20=(($19+16)|0);
 $21=((HEAP32[(($20)>>2)])|0);
 $22=($17|0)==($21|0);
 if (!($22)) {
  $24=((_CheckForIntersect($tess,$regUp))|0);
 }
 $26=(($11+16)|0);
 $27=((HEAP32[(($26)>>2)])|0);
 $28=(($27+24)|0);
 $29=(+(HEAPF32[(($28)>>2)]));
 $30=(($tess+72)|0);
 $31=((HEAP32[(($30)>>2)])|0);
 $32=(($31+24)|0);
 $33=(+(HEAPF32[(($32)>>2)]));
 $34=$29==$33;
 do {
  if ($34) {
   $36=(($27+28)|0);
   $37=(+(HEAPF32[(($36)>>2)]));
   $38=(($31+28)|0);
   $39=(+(HEAPF32[(($38)>>2)]));
   $40=$37==$39;
   if (!($40)) {
    $degenerate_0=0;$_0=$regUp;$eTopLeft_0=$2;
    break;
   }
   $42=(($tess)|0);
   $43=((HEAP32[(($42)>>2)])|0);
   $44=(($2+4)|0);
   $45=((HEAP32[(($44)>>2)])|0);
   $46=(($45+12)|0);
   $47=((HEAP32[(($46)>>2)])|0);
   $48=((_tessMeshSplice($43,$47,$11))|0);
   $49=($48|0)==0;
   if ($49) {
    $51=(($tess+144)|0);
    _longjmp((($51)|0),((1)|0));
   }
   $53=((_TopLeftRegion($tess,$regUp))|0);
   $54=($53|0)==0;
   if ($54) {
    $56=(($tess+144)|0);
    _longjmp((($56)|0),((1)|0));
   } else {
    $58=(($53+4)|0);
    $59=((HEAP32[(($58)>>2)])|0);
    $60=(($59+8)|0);
    $61=((HEAP32[(($60)>>2)])|0);
    $62=(($61)|0);
    $63=((HEAP32[(($62)>>2)])|0);
    $64=$63;
    $65=$63;
    $66=((HEAP32[(($65)>>2)])|0);
    $67=((_FinishLeftRegions($tess,$64,$9))|0);
    $degenerate_0=1;$_0=$53;$eTopLeft_0=$66;
    break;
   }
  } else {
   $degenerate_0=0;$_0=$regUp;$eTopLeft_0=$2;
  }
 } while(0);
 $69=(($13+16)|0);
 $70=((HEAP32[(($69)>>2)])|0);
 $71=(($70+24)|0);
 $72=(+(HEAPF32[(($71)>>2)]));
 $73=((HEAP32[(($30)>>2)])|0);
 $74=(($73+24)|0);
 $75=(+(HEAPF32[(($74)>>2)]));
 $76=$72==$75;
 do {
  if ($76) {
   $78=(($70+28)|0);
   $79=(+(HEAPF32[(($78)>>2)]));
   $80=(($73+28)|0);
   $81=(+(HEAPF32[(($80)>>2)]));
   $82=$79==$81;
   if (!($82)) {
    label = 761;
    break;
   }
   $84=(($tess)|0);
   $85=((HEAP32[(($84)>>2)])|0);
   $86=((HEAP32[(($18)>>2)])|0);
   $87=(($86+12)|0);
   $88=((HEAP32[(($87)>>2)])|0);
   $89=((_tessMeshSplice($85,$eBottomLeft,$88))|0);
   $90=($89|0)==0;
   if ($90) {
    $92=(($tess+144)|0);
    _longjmp((($92)|0),((1)|0));
   } else {
    $93=((_FinishLeftRegions($tess,$9,0))|0);
    $_05253=$93;
    break;
   }
  } else {
   label = 761;
  }
 } while(0);
 do {
  if ((label|0) == 761) {
   $95=($degenerate_0|0)==0;
   if (!($95)) {
    $_05253=$eBottomLeft;
    break;
   }
   $100=((HEAP32[(($69)>>2)])|0);
   $101=(($100+24)|0);
   $102=(+(HEAPF32[(($101)>>2)]));
   $103=((HEAP32[(($26)>>2)])|0);
   $104=(($103+24)|0);
   $105=(+(HEAPF32[(($104)>>2)]));
   $106=$102<$105;
   do {
    if ($106) {
     label = 766;
    } else {
     $108=$102==$105;
     if (!($108)) {
      $eNew_0=$11;
      break;
     }
     $110=(($100+28)|0);
     $111=(+(HEAPF32[(($110)>>2)]));
     $112=(($103+28)|0);
     $113=(+(HEAPF32[(($112)>>2)]));
     $114=$111>$113;
     if ($114) {
      $eNew_0=$11;
     } else {
      label = 766;
     }
    }
   } while(0);
   if ((label|0) == 766) {
    $116=((HEAP32[(($18)>>2)])|0);
    $117=(($116+12)|0);
    $118=((HEAP32[(($117)>>2)])|0);
    $eNew_0=$118;
   }
   $120=(($tess)|0);
   $121=((HEAP32[(($120)>>2)])|0);
   $122=(($eBottomLeft+8)|0);
   $123=((HEAP32[(($122)>>2)])|0);
   $124=(($123+4)|0);
   $125=((HEAP32[(($124)>>2)])|0);
   $126=((_tessMeshConnect($121,$125,$eNew_0))|0);
   $127=($126|0)==0;
   if ($127) {
    $129=(($tess+144)|0);
    _longjmp((($129)|0),((1)|0));
   }
   $131=(($126+8)|0);
   $132=((HEAP32[(($131)>>2)])|0);
   _AddRightEdges($tess,$_0,$126,$132,$132,0);
   $133=(($126+4)|0);
   $134=((HEAP32[(($133)>>2)])|0);
   $135=(($134+24)|0);
   $136=((HEAP32[(($135)>>2)])|0);
   $137=(($136+24)|0);
   HEAP32[(($137)>>2)]=1;
   _WalkDirtyRegions($tess,$_0);
   return;
  }
 } while(0);
 $97=(($_05253+8)|0);
 $98=((HEAP32[(($97)>>2)])|0);
 _AddRightEdges($tess,$_0,$98,$eTopLeft_0,$eTopLeft_0,1);
 return;
}
function _AddRightEdges($tess,$regUp,$eFirst,$eLast,$eTopLeft,$cleanUp){
 $tess=($tess)|0;
 $regUp=($regUp)|0;
 $eFirst=($eFirst)|0;
 $eLast=($eLast)|0;
 $eTopLeft=($eTopLeft)|0;
 $cleanUp=($cleanUp)|0;
 var $e_0=0,$2=0,$3=0,$4=0,$5=.0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=.0,$12=0,$14=0,$16=0,$17=.0,$18=0,$19=.0,$20=0,$23=0,$24=0;
 var $25=0,$26=0,$27=0,$29=0,$31=0,$32=0,$33=0,$34=0,$35=0,$36=0,$37=0,$38=0,$39=0,$40=0,$41=0,$42=0,$ePrev_0_ph=0,$43=0,$44=0,$45=0;
 var $46=0,$47=0,$48=0,$49=0,$50=0,$51=0,$52=0,$53=0,$54=0,$55=0,$56=0,$57=0,$58=0,$59=0,$61=0,$_in=0,$firstTime_065=0,$ePrev_064=0,$regPrev_063=0,$62=0;
 var $63=0,$64=0,$65=0,$67=0,$68=0,$69=0,$70=0,$71=0,$72=0,$73=0,$75=0,$77=0,$78=0,$79=0,$80=0,$81=0,$82=0,$83=0,$85=0,$87=0;
 var $88=0,$89=0,$90=0,$91=0,$92=0,$93=0,$94=0,$95=0,$96=0,$97=0,$98=0,$100=0,$101=0,$103=0,$104=0,$105=0,$106=0,$107=0,$108=0,$109=0;
 var $110=0,$111=0,$112=0,$113=0,$114=0,$115=0,$116=0,$117=0,$118=0,$119=0,$120=0,$121=0,$122=0,$123=0,$124=0,$125=0,$126=0,$127=0,$128=0,$129=0;
 var $130=0,$131=0,$132=0,$133=0,$134=0,$136=0,$_lcssa59=0,$_lcssa=0,$regPrev_0_lcssa=0,$137=0,$138=0,$139=0,$140=0,$141=0,$142=0,$143=0,$144=0,$145=0,$146=0,$149=0;
 var label=0;
 $e_0=$eFirst;
 while(1) {
  $2=(($e_0+16)|0);
  $3=((HEAP32[(($2)>>2)])|0);
  $4=(($3+24)|0);
  $5=(+(HEAPF32[(($4)>>2)]));
  $6=(($e_0+4)|0);
  $7=((HEAP32[(($6)>>2)])|0);
  $8=(($7+16)|0);
  $9=((HEAP32[(($8)>>2)])|0);
  $10=(($9+24)|0);
  $11=(+(HEAPF32[(($10)>>2)]));
  $12=$5<$11;
  if (!($12)) {
   $14=$5==$11;
   if (!($14)) {
    label = 798;
    break;
   }
   $16=(($3+28)|0);
   $17=(+(HEAPF32[(($16)>>2)]));
   $18=(($9+28)|0);
   $19=(+(HEAPF32[(($18)>>2)]));
   $20=$17>$19;
   if ($20) {
    label = 799;
    break;
   }
  }
  $23=((HEAP32[(($6)>>2)])|0);
  $24=((_AddRegionBelow($tess,$regUp,$23))|0);
  $25=(($e_0+8)|0);
  $26=((HEAP32[(($25)>>2)])|0);
  $27=($26|0)==($eLast|0);
  if ($27) {
   label = 779;
   break;
  } else {
   $e_0=$26;
  }
 }
 if ((label|0) == 779) {
  $29=($eTopLeft|0)==0;
  if ($29) {
   $31=(($regUp+4)|0);
   $32=((HEAP32[(($31)>>2)])|0);
   $33=(($32+8)|0);
   $34=((HEAP32[(($33)>>2)])|0);
   $35=(($34)|0);
   $36=((HEAP32[(($35)>>2)])|0);
   $37=$36;
   $38=((HEAP32[(($37)>>2)])|0);
   $39=(($38+4)|0);
   $40=((HEAP32[(($39)>>2)])|0);
   $41=(($40+8)|0);
   $42=((HEAP32[(($41)>>2)])|0);
   $ePrev_0_ph=$42;
  } else {
   $ePrev_0_ph=$eTopLeft;
  }
  $43=(($regUp+4)|0);
  $44=((HEAP32[(($43)>>2)])|0);
  $45=(($44+8)|0);
  $46=((HEAP32[(($45)>>2)])|0);
  $47=(($46)|0);
  $48=((HEAP32[(($47)>>2)])|0);
  $49=$48;
  $50=((HEAP32[(($49)>>2)])|0);
  $51=(($50+4)|0);
  $52=((HEAP32[(($51)>>2)])|0);
  $53=(($52+16)|0);
  $54=((HEAP32[(($53)>>2)])|0);
  $55=(($ePrev_0_ph+16)|0);
  $56=((HEAP32[(($55)>>2)])|0);
  $57=($54|0)==($56|0);
  L1002: do {
   if ($57) {
    $58=(($tess)|0);
    $59=(($tess)|0);
    $regPrev_063=$regUp;$ePrev_064=$ePrev_0_ph;$firstTime_065=1;$_in=$48;$61=$52;
    L1004: while(1) {
     $62=$_in;
     $63=(($61+8)|0);
     $64=((HEAP32[(($63)>>2)])|0);
     $65=($64|0)==($ePrev_064|0);
     if (!($65)) {
      $67=((HEAP32[(($59)>>2)])|0);
      $68=(($61+4)|0);
      $69=((HEAP32[(($68)>>2)])|0);
      $70=(($69+12)|0);
      $71=((HEAP32[(($70)>>2)])|0);
      $72=((_tessMeshSplice($67,$71,$61))|0);
      $73=($72|0)==0;
      if ($73) {
       label = 785;
       break;
      }
      $77=((HEAP32[(($59)>>2)])|0);
      $78=(($ePrev_064+4)|0);
      $79=((HEAP32[(($78)>>2)])|0);
      $80=(($79+12)|0);
      $81=((HEAP32[(($80)>>2)])|0);
      $82=((_tessMeshSplice($77,$81,$61))|0);
      $83=($82|0)==0;
      if ($83) {
       label = 787;
       break;
      }
     }
     $87=(($regPrev_063+8)|0);
     $88=((HEAP32[(($87)>>2)])|0);
     $89=(($61+28)|0);
     $90=((HEAP32[(($89)>>2)])|0);
     $91=((($88)-($90))|0);
     $92=(($_in+8)|0);
     $93=$92;
     HEAP32[(($93)>>2)]=$91;
     $94=((_IsWindingInside($tess,$91))|0);
     $95=(($_in+12)|0);
     $96=$95;
     HEAP32[(($96)>>2)]=$94;
     $97=(($regPrev_063+20)|0);
     HEAP32[(($97)>>2)]=1;
     $98=($firstTime_065|0)==0;
     do {
      if ($98) {
       $100=((_CheckForRightSplice($tess,$regPrev_063))|0);
       $101=($100|0)==0;
       if ($101) {
        break;
       }
       $103=(($ePrev_064+28)|0);
       $104=((HEAP32[(($103)>>2)])|0);
       $105=((HEAP32[(($89)>>2)])|0);
       $106=((($105)+($104))|0);
       HEAP32[(($89)>>2)]=$106;
       $107=(($ePrev_064+4)|0);
       $108=((HEAP32[(($107)>>2)])|0);
       $109=(($108+28)|0);
       $110=((HEAP32[(($109)>>2)])|0);
       $111=(($61+4)|0);
       $112=((HEAP32[(($111)>>2)])|0);
       $113=(($112+28)|0);
       $114=((HEAP32[(($113)>>2)])|0);
       $115=((($114)+($110))|0);
       HEAP32[(($113)>>2)]=$115;
       _DeleteRegion($tess,$regPrev_063);
       $116=((HEAP32[(($58)>>2)])|0);
       $117=((_tessMeshDelete($116,$ePrev_064))|0);
       $118=($117|0)==0;
       if ($118) {
        label = 792;
        break L1004;
       }
      }
     } while(0);
     $119=(($_in+4)|0);
     $120=$119;
     $121=((HEAP32[(($120)>>2)])|0);
     $122=(($121+8)|0);
     $123=((HEAP32[(($122)>>2)])|0);
     $124=(($123)|0);
     $125=((HEAP32[(($124)>>2)])|0);
     $126=$125;
     $127=((HEAP32[(($126)>>2)])|0);
     $128=(($127+4)|0);
     $129=((HEAP32[(($128)>>2)])|0);
     $130=(($129+16)|0);
     $131=((HEAP32[(($130)>>2)])|0);
     $132=(($61+16)|0);
     $133=((HEAP32[(($132)>>2)])|0);
     $134=($131|0)==($133|0);
     if ($134) {
      $regPrev_063=$62;$ePrev_064=$61;$firstTime_065=0;$_in=$125;$61=$129;
     } else {
      $regPrev_0_lcssa=$62;$_lcssa=$125;$_lcssa59=$129;
      break L1002;
     }
    }
    if ((label|0) == 792) {
     $136=(($tess+144)|0);
     _longjmp((($136)|0),((1)|0));
    }
    else if ((label|0) == 787) {
     $85=(($tess+144)|0);
     _longjmp((($85)|0),((1)|0));
    }
    else if ((label|0) == 785) {
     $75=(($tess+144)|0);
     _longjmp((($75)|0),((1)|0));
    }
   } else {
    $regPrev_0_lcssa=$regUp;$_lcssa=$48;$_lcssa59=$52;
   }
  } while(0);
  $137=(($regPrev_0_lcssa+20)|0);
  HEAP32[(($137)>>2)]=1;
  $138=(($regPrev_0_lcssa+8)|0);
  $139=((HEAP32[(($138)>>2)])|0);
  $140=(($_lcssa59+28)|0);
  $141=((HEAP32[(($140)>>2)])|0);
  $142=((($139)-($141))|0);
  $143=(($_lcssa+8)|0);
  $144=$143;
  $145=((HEAP32[(($144)>>2)])|0);
  $146=($142|0)==($145|0);
  if (!($146)) {
   ___assert_fail(((176)|0),((1456)|0),((391)|0),((2264)|0));
  }
  $149=($cleanUp|0)==0;
  if ($149) {
   return;
  }
  _WalkDirtyRegions($tess,$regPrev_0_lcssa);
  return;
 }
 else if ((label|0) == 798) {
  ___assert_fail(((296)|0),((1456)|0),((349)|0),((2264)|0));
 }
 else if ((label|0) == 799) {
  ___assert_fail(((296)|0),((1456)|0),((349)|0),((2264)|0));
 }
}
function _AddRegionBelow($tess,$regAbove,$eNewUp){
 $tess=($tess)|0;
 $regAbove=($regAbove)|0;
 $eNewUp=($eNewUp)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$7=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$19=0,$21=0,$22=0,$23=0,$24=0;
 var $25=0,$26=0,$27=0,label=0;
 $1=(($tess+76)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=((_bucketAlloc($2))|0);
 $4=$3;
 $5=($3|0)==0;
 if ($5) {
  $7=(($tess+144)|0);
  _longjmp((($7)|0),((1)|0));
  return ((0)|0);
 }
 $9=$3;
 HEAP32[(($9)>>2)]=$eNewUp;
 $10=(($tess+64)|0);
 $11=((HEAP32[(($10)>>2)])|0);
 $12=(($regAbove+4)|0);
 $13=((HEAP32[(($12)>>2)])|0);
 $14=((_dictInsertBefore($11,$13,$3))|0);
 $15=(($3+4)|0);
 $16=$15;
 HEAP32[(($16)>>2)]=$14;
 $17=($14|0)==0;
 if ($17) {
  $19=(($tess+144)|0);
  _longjmp((($19)|0),((1)|0));
  return ((0)|0);
 } else {
  $21=(($3+24)|0);
  $22=$21;
  HEAP32[(($22)>>2)]=0;
  $23=(($3+16)|0);
  $24=$23;
  HEAP32[(($24)>>2)]=0;
  $25=(($3+20)|0);
  $26=$25;
  HEAP32[(($26)>>2)]=0;
  $27=(($eNewUp+24)|0);
  HEAP32[(($27)>>2)]=$4;
  return (($4)|0);
 }
  return 0;
}
function _IsWindingInside($tess,$n){
 $tess=($tess)|0;
 $n=($n)|0;
 var $1=0,$2=0,$4=0,$6=0,$7=0,$9=0,$10=0,$n_lobit=0,$13=0,$15=0,$phitmp=0,$_0=0,label=0;
 $1=(($tess+60)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 L1036: do {
  switch (($2|0)) {
  case 2: {
   $9=($n|0)>0;
   $10=($9&1);
   $_0=$10;
   break;
  }
  case 0: {
   $4=$n&1;
   $_0=$4;
   break;
  }
  case 1: {
   $6=($n|0)!=0;
   $7=($6&1);
   $_0=$7;
   break;
  }
  case 3: {
   $n_lobit=$n>>>31;
   $_0=$n_lobit;
   break;
  }
  case 4: {
   $13=($n|0)>1;
   if ($13) {
    $_0=1;
    break L1036;
   }
   $15=($n|0)<-1;
   $phitmp=($15&1);
   $_0=$phitmp;
   break;
  }
  default: {
   ___assert_fail(((936)|0),((1456)|0),((240)|0),((2112)|0));
   return ((0)|0);
  }
  }
 } while(0);
 return (($_0)|0);
}
function _CheckForRightSplice($tess,$regUp){
 $tess=($tess)|0;
 $regUp=($regUp)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=.0,$15=0,$16=0,$17=0,$18=.0,$19=0,$21=0;
 var $23=0,$24=.0,$25=0,$26=.0,$27=0,$29=0,$30=0,$31=0,$32=0,$33=0,$34=0,$35=.0,$36=0,$38=0,$39=0,$40=.0,$41=0,$42=0,$43=.0,$44=0;
 var $46=0,$47=.0,$48=0,$49=.0,$50=0,$52=0,$53=0,$54=0,$55=0,$56=0,$58=0,$60=0,$61=0,$62=0,$63=0,$64=0,$65=0,$67=0,$69=0,$70=0;
 var $71=0,$73=0,$75=0,$76=0,$77=0,$78=0,$79=0,$80=0,$81=0,$83=0,$84=0,$85=0,$86=0,$87=0,$88=0,$89=.0,$90=0,$92=0,$93=0,$94=0;
 var $95=0,$96=0,$97=0,$98=0,$99=0,$100=0,$101=0,$102=0,$103=0,$104=0,$106=0,$108=0,$109=0,$110=0,$111=0,$112=0,$113=0,$114=0,$116=0,$_0=0;
 var label=0;
 $1=(($regUp+4)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+8)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($4)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=(($regUp)|0);
 $8=((HEAP32[(($7)>>2)])|0);
 $9=$6;
 $10=((HEAP32[(($9)>>2)])|0);
 $11=(($8+16)|0);
 $12=((HEAP32[(($11)>>2)])|0);
 $13=(($12+24)|0);
 $14=(+(HEAPF32[(($13)>>2)]));
 $15=(($10+16)|0);
 $16=((HEAP32[(($15)>>2)])|0);
 $17=(($16+24)|0);
 $18=(+(HEAPF32[(($17)>>2)]));
 $19=$14<$18;
 do {
  if (!($19)) {
   $21=$14==$18;
   if ($21) {
    $23=(($12+28)|0);
    $24=(+(HEAPF32[(($23)>>2)]));
    $25=(($16+28)|0);
    $26=(+(HEAPF32[(($25)>>2)]));
    $27=$24>$26;
    if (!($27)) {
     break;
    }
   }
   $83=(($8+4)|0);
   $84=((HEAP32[(($83)>>2)])|0);
   $85=(($84+16)|0);
   $86=((HEAP32[(($85)>>2)])|0);
   $87=((HEAP32[(($15)>>2)])|0);
   $88=((HEAP32[(($11)>>2)])|0);
   $89=(+(_tesedgeSign($86,$87,$88)));
   $90=$89<(0.0);
   if ($90) {
    $_0=0;
    return (($_0)|0);
   }
   $92=(($regUp+20)|0);
   HEAP32[(($92)>>2)]=1;
   $93=((HEAP32[(($1)>>2)])|0);
   $94=(($93+4)|0);
   $95=((HEAP32[(($94)>>2)])|0);
   $96=(($95)|0);
   $97=((HEAP32[(($96)>>2)])|0);
   $98=(($97+20)|0);
   $99=$98;
   HEAP32[(($99)>>2)]=1;
   $100=(($tess)|0);
   $101=((HEAP32[(($100)>>2)])|0);
   $102=((HEAP32[(($83)>>2)])|0);
   $103=((_tessMeshSplitEdge($101,$102))|0);
   $104=($103|0)==0;
   if ($104) {
    $106=(($tess+144)|0);
    _longjmp((($106)|0),((1)|0));
    return ((0)|0);
   }
   $108=((HEAP32[(($100)>>2)])|0);
   $109=(($10+4)|0);
   $110=((HEAP32[(($109)>>2)])|0);
   $111=(($110+12)|0);
   $112=((HEAP32[(($111)>>2)])|0);
   $113=((_tessMeshSplice($108,$112,$8))|0);
   $114=($113|0)==0;
   if ($114) {
    $116=(($tess+144)|0);
    _longjmp((($116)|0),((1)|0));
    return ((0)|0);
   } else {
    $_0=1;
    return (($_0)|0);
   }
  }
 } while(0);
 $29=(($10+4)|0);
 $30=((HEAP32[(($29)>>2)])|0);
 $31=(($30+16)|0);
 $32=((HEAP32[(($31)>>2)])|0);
 $33=((HEAP32[(($11)>>2)])|0);
 $34=((HEAP32[(($15)>>2)])|0);
 $35=(+(_tesedgeSign($32,$33,$34)));
 $36=$35>(0.0);
 if ($36) {
  $_0=0;
  return (($_0)|0);
 }
 $38=((HEAP32[(($11)>>2)])|0);
 $39=(($38+24)|0);
 $40=(+(HEAPF32[(($39)>>2)]));
 $41=((HEAP32[(($15)>>2)])|0);
 $42=(($41+24)|0);
 $43=(+(HEAPF32[(($42)>>2)]));
 $44=$40==$43;
 do {
  if ($44) {
   $46=(($38+28)|0);
   $47=(+(HEAPF32[(($46)>>2)]));
   $48=(($41+28)|0);
   $49=(+(HEAPF32[(($48)>>2)]));
   $50=$47==$49;
   if (!($50)) {
    break;
   }
   $73=($38|0)==($41|0);
   if ($73) {
    $_0=1;
    return (($_0)|0);
   }
   $75=(($tess+68)|0);
   $76=((HEAP32[(($75)>>2)])|0);
   $77=(($38+32)|0);
   $78=((HEAP32[(($77)>>2)])|0);
   _pqDelete($76,$78);
   $79=((HEAP32[(($29)>>2)])|0);
   $80=(($79+12)|0);
   $81=((HEAP32[(($80)>>2)])|0);
   _SpliceMergeVertices($tess,$81,$8);
   $_0=1;
   return (($_0)|0);
  }
 } while(0);
 $52=(($tess)|0);
 $53=((HEAP32[(($52)>>2)])|0);
 $54=((HEAP32[(($29)>>2)])|0);
 $55=((_tessMeshSplitEdge($53,$54))|0);
 $56=($55|0)==0;
 if ($56) {
  $58=(($tess+144)|0);
  _longjmp((($58)|0),((1)|0));
  return ((0)|0);
 }
 $60=((HEAP32[(($52)>>2)])|0);
 $61=((HEAP32[(($29)>>2)])|0);
 $62=(($61+12)|0);
 $63=((HEAP32[(($62)>>2)])|0);
 $64=((_tessMeshSplice($60,$8,$63))|0);
 $65=($64|0)==0;
 if ($65) {
  $67=(($tess+144)|0);
  _longjmp((($67)|0),((1)|0));
  return ((0)|0);
 }
 $69=(($6+20)|0);
 $70=$69;
 HEAP32[(($70)>>2)]=1;
 $71=(($regUp+20)|0);
 HEAP32[(($71)>>2)]=1;
 $_0=1;
 return (($_0)|0);
}
function _WalkDirtyRegions($tess,$regUp){
 $tess=($tess)|0;
 $regUp=($regUp)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$_0=0,$regLo_0=0,$12=0,$13=0,$14=0,$16=0,$17=0,$18=0,$19=0;
 var $20=0,$21=0,$22=0,$24=0,$25=0,$26=0,$28=0,$29=0,$30=0,$31=0,$32=0,$33=0,$34=0,$36=0,$37=0,$38=0,$39=0,$40=0,$_1=0,$regLo_1=0;
 var $42=0,$43=0,$44=0,$45=0,$46=0,$47=0,$48=0,$49=0,$50=0,$51=0,$52=0,$53=0,$54=0,$55=0,$57=0,$58=0,$60=0,$61=0,$62=0,$64=0;
 var $65=0,$66=0,$68=0,$70=0,$71=0,$72=0,$73=0,$74=0,$75=0,$76=0,$77=0,$78=0,$80=0,$81=0,$82=0,$84=0,$85=0,$86=0,$88=0,$90=0;
 var $91=0,$92=0,$93=0,$94=0,$95=0,$96=0,$97=0,$98=0,$_2=0,$regLo_2=0,$eUp_0=0,$eLo_0=0,$100=0,$101=0,$102=0,$103=0,$104=0,$106=0,$107=0,$108=0;
 var $109=0,$110=0,$111=0,$112=0,$113=0,$114=0,$116=0,$117=0,$118=0,$120=0,$121=0,$122=0,$124=0,$125=0,$126=0,$or_cond=0,$128=0,$129=0,$131=0,$133=0;
 var $134=0,$135=0,$137=0,$138=0,$139=0,$140=0,$141=0,$142=0,$143=0,$144=0,$145=0,$147=0,$148=0,$149=0,$150=0,$151=0,$152=0,$153=0,$154=0,$155=0;
 var $156=0,$157=0,$158=0,$159=0,$160=0,$161=0,$163=0,$165=0,$166=0,$167=0,$168=0,$169=0,$170=0,$171=0,label=0;
 $1=(($regUp+4)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+8)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($4)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=$6;
 $8=(($tess)|0);
 $9=(($tess+72)|0);
 $10=(($tess)|0);
 $11=(($tess)|0);
 $regLo_0=$7;$_0=$regUp;
 L1080: while(1) {
  $12=(($regLo_0+20)|0);
  $13=((HEAP32[(($12)>>2)])|0);
  $14=($13|0)==0;
  if (!($14)) {
   $16=(($regLo_0+4)|0);
   $17=((HEAP32[(($16)>>2)])|0);
   $18=(($17+8)|0);
   $19=((HEAP32[(($18)>>2)])|0);
   $20=(($19)|0);
   $21=((HEAP32[(($20)>>2)])|0);
   $22=$21;
   $_0=$regLo_0;$regLo_0=$22;
   continue;
  }
  $24=(($_0+20)|0);
  $25=((HEAP32[(($24)>>2)])|0);
  $26=($25|0)==0;
  if ($26) {
   $28=(($_0+4)|0);
   $29=((HEAP32[(($28)>>2)])|0);
   $30=(($29+4)|0);
   $31=((HEAP32[(($30)>>2)])|0);
   $32=(($31)|0);
   $33=((HEAP32[(($32)>>2)])|0);
   $34=($33|0)==0;
   if ($34) {
    label = 872;
    break;
   }
   $36=$33;
   $37=(($33+20)|0);
   $38=$37;
   $39=((HEAP32[(($38)>>2)])|0);
   $40=($39|0)==0;
   if ($40) {
    label = 870;
    break;
   } else {
    $regLo_1=$_0;$_1=$36;
   }
  } else {
   $regLo_1=$regLo_0;$_1=$_0;
  }
  $42=(($_1+20)|0);
  HEAP32[(($42)>>2)]=0;
  $43=(($_1)|0);
  $44=((HEAP32[(($43)>>2)])|0);
  $45=(($regLo_1)|0);
  $46=((HEAP32[(($45)>>2)])|0);
  $47=(($44+4)|0);
  $48=((HEAP32[(($47)>>2)])|0);
  $49=(($48+16)|0);
  $50=((HEAP32[(($49)>>2)])|0);
  $51=(($46+4)|0);
  $52=((HEAP32[(($51)>>2)])|0);
  $53=(($52+16)|0);
  $54=((HEAP32[(($53)>>2)])|0);
  $55=($50|0)==($54|0);
  do {
   if ($55) {
    $eLo_0=$46;$eUp_0=$44;$regLo_2=$regLo_1;$_2=$_1;
   } else {
    $57=((_CheckForLeftSplice($tess,$_1))|0);
    $58=($57|0)==0;
    if ($58) {
     $eLo_0=$46;$eUp_0=$44;$regLo_2=$regLo_1;$_2=$_1;
     break;
    }
    $60=(($regLo_1+24)|0);
    $61=((HEAP32[(($60)>>2)])|0);
    $62=($61|0)==0;
    if (!($62)) {
     _DeleteRegion($tess,$regLo_1);
     $64=((HEAP32[(($11)>>2)])|0);
     $65=((_tessMeshDelete($64,$46))|0);
     $66=($65|0)==0;
     if ($66) {
      label = 851;
      break L1080;
     }
     $70=(($_1+4)|0);
     $71=((HEAP32[(($70)>>2)])|0);
     $72=(($71+8)|0);
     $73=((HEAP32[(($72)>>2)])|0);
     $74=(($73)|0);
     $75=((HEAP32[(($74)>>2)])|0);
     $76=$75;
     $77=$75;
     $78=((HEAP32[(($77)>>2)])|0);
     $eLo_0=$78;$eUp_0=$44;$regLo_2=$76;$_2=$_1;
     break;
    }
    $80=(($_1+24)|0);
    $81=((HEAP32[(($80)>>2)])|0);
    $82=($81|0)==0;
    if ($82) {
     $eLo_0=$46;$eUp_0=$44;$regLo_2=$regLo_1;$_2=$_1;
     break;
    }
    _DeleteRegion($tess,$_1);
    $84=((HEAP32[(($10)>>2)])|0);
    $85=((_tessMeshDelete($84,$44))|0);
    $86=($85|0)==0;
    if ($86) {
     label = 855;
     break L1080;
    }
    $90=(($regLo_1+4)|0);
    $91=((HEAP32[(($90)>>2)])|0);
    $92=(($91+4)|0);
    $93=((HEAP32[(($92)>>2)])|0);
    $94=(($93)|0);
    $95=((HEAP32[(($94)>>2)])|0);
    $96=$95;
    $97=$95;
    $98=((HEAP32[(($97)>>2)])|0);
    $eLo_0=$46;$eUp_0=$98;$regLo_2=$regLo_1;$_2=$96;
   }
  } while(0);
  $100=(($eUp_0+16)|0);
  $101=((HEAP32[(($100)>>2)])|0);
  $102=(($eLo_0+16)|0);
  $103=((HEAP32[(($102)>>2)])|0);
  $104=($101|0)==($103|0);
  L1099: do {
   if (!($104)) {
    $106=(($eUp_0+4)|0);
    $107=((HEAP32[(($106)>>2)])|0);
    $108=(($107+16)|0);
    $109=((HEAP32[(($108)>>2)])|0);
    $110=(($eLo_0+4)|0);
    $111=((HEAP32[(($110)>>2)])|0);
    $112=(($111+16)|0);
    $113=((HEAP32[(($112)>>2)])|0);
    $114=($109|0)==($113|0);
    do {
     if (!($114)) {
      $116=(($_2+24)|0);
      $117=((HEAP32[(($116)>>2)])|0);
      $118=($117|0)==0;
      if (!($118)) {
       break;
      }
      $120=(($regLo_2+24)|0);
      $121=((HEAP32[(($120)>>2)])|0);
      $122=($121|0)==0;
      if (!($122)) {
       break;
      }
      $124=((HEAP32[(($9)>>2)])|0);
      $125=($109|0)==($124|0);
      $126=($113|0)==($124|0);
      $or_cond=$125|$126;
      if (!($or_cond)) {
       break;
      }
      $128=((_CheckForIntersect($tess,$_2))|0);
      $129=($128|0)==0;
      if ($129) {
       break L1099;
      } else {
       label = 871;
       break L1080;
      }
     }
    } while(0);
    $131=((_CheckForRightSplice($tess,$_2))|0);
   }
  } while(0);
  $133=((HEAP32[(($100)>>2)])|0);
  $134=((HEAP32[(($102)>>2)])|0);
  $135=($133|0)==($134|0);
  if (!($135)) {
   $regLo_0=$regLo_2;$_0=$_2;
   continue;
  }
  $137=(($eUp_0+4)|0);
  $138=((HEAP32[(($137)>>2)])|0);
  $139=(($138+16)|0);
  $140=((HEAP32[(($139)>>2)])|0);
  $141=(($eLo_0+4)|0);
  $142=((HEAP32[(($141)>>2)])|0);
  $143=(($142+16)|0);
  $144=((HEAP32[(($143)>>2)])|0);
  $145=($140|0)==($144|0);
  if (!($145)) {
   $regLo_0=$regLo_2;$_0=$_2;
   continue;
  }
  $147=(($eUp_0+28)|0);
  $148=((HEAP32[(($147)>>2)])|0);
  $149=(($eLo_0+28)|0);
  $150=((HEAP32[(($149)>>2)])|0);
  $151=((($150)+($148))|0);
  HEAP32[(($149)>>2)]=$151;
  $152=((HEAP32[(($137)>>2)])|0);
  $153=(($152+28)|0);
  $154=((HEAP32[(($153)>>2)])|0);
  $155=((HEAP32[(($141)>>2)])|0);
  $156=(($155+28)|0);
  $157=((HEAP32[(($156)>>2)])|0);
  $158=((($157)+($154))|0);
  HEAP32[(($156)>>2)]=$158;
  _DeleteRegion($tess,$_2);
  $159=((HEAP32[(($8)>>2)])|0);
  $160=((_tessMeshDelete($159,$eUp_0))|0);
  $161=($160|0)==0;
  if ($161) {
   label = 867;
   break;
  }
  $165=(($regLo_2+4)|0);
  $166=((HEAP32[(($165)>>2)])|0);
  $167=(($166+4)|0);
  $168=((HEAP32[(($167)>>2)])|0);
  $169=(($168)|0);
  $170=((HEAP32[(($169)>>2)])|0);
  $171=$170;
  $regLo_0=$regLo_2;$_0=$171;
 }
 if ((label|0) == 867) {
  $163=(($tess+144)|0);
  _longjmp((($163)|0),((1)|0));
 }
 else if ((label|0) == 870) {
  return;
 }
 else if ((label|0) == 871) {
  return;
 }
 else if ((label|0) == 872) {
  return;
 }
 else if ((label|0) == 855) {
  $88=(($tess+144)|0);
  _longjmp((($88)|0),((1)|0));
 }
 else if ((label|0) == 851) {
  $68=(($tess+144)|0);
  _longjmp((($68)|0),((1)|0));
 }
}
function _CheckForLeftSplice($tess,$regUp){
 $tess=($tess)|0;
 $regUp=($regUp)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=.0,$17=0,$18=0,$19=0,$20=0;
 var $21=0,$22=.0,$23=0,$25=0,$26=.0,$27=0,$28=.0,$29=0,$32=0,$33=0,$34=0,$35=0,$36=.0,$37=0,$38=0,$39=0,$40=0,$41=.0,$42=0,$44=0;
 var $46=0,$47=.0,$48=0,$49=.0,$50=0,$52=0,$53=0,$54=0,$55=0,$56=0,$57=0,$58=0,$59=0,$60=.0,$61=0,$63=0,$64=0,$65=0,$66=0,$67=0;
 var $68=0,$69=0,$70=0,$71=0,$72=0,$73=0,$74=0,$76=0,$78=0,$79=0,$80=0,$81=0,$83=0,$85=0,$86=0,$87=0,$88=0,$89=0,$90=0,$92=0;
 var $93=0,$94=0,$95=0,$96=0,$97=0,$98=0,$99=0,$100=.0,$101=0,$103=0,$104=0,$105=0,$106=0,$107=0,$108=0,$109=0,$111=0,$113=0,$114=0,$115=0;
 var $116=0,$117=0,$118=0,$120=0,$122=0,$123=0,$124=0,$125=0,$126=0,$127=0,$128=0,$129=0,$_0=0,label=0;
 $1=(($regUp+4)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+8)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($4)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=(($regUp)|0);
 $8=((HEAP32[(($7)>>2)])|0);
 $9=$6;
 $10=((HEAP32[(($9)>>2)])|0);
 $11=(($8+4)|0);
 $12=((HEAP32[(($11)>>2)])|0);
 $13=(($12+16)|0);
 $14=((HEAP32[(($13)>>2)])|0);
 $15=(($14+24)|0);
 $16=(+(HEAPF32[(($15)>>2)]));
 $17=(($10+4)|0);
 $18=((HEAP32[(($17)>>2)])|0);
 $19=(($18+16)|0);
 $20=((HEAP32[(($19)>>2)])|0);
 $21=(($20+24)|0);
 $22=(+(HEAPF32[(($21)>>2)]));
 $23=$16==$22;
 do {
  if ($23) {
   $25=(($14+28)|0);
   $26=(+(HEAPF32[(($25)>>2)]));
   $27=(($20+28)|0);
   $28=(+(HEAPF32[(($27)>>2)]));
   $29=$26==$28;
   if (!($29)) {
    break;
   }
   ___assert_fail(((960)|0),((1456)|0),((530)|0),((2216)|0));
   return ((0)|0);
  }
 } while(0);
 $32=((HEAP32[(($11)>>2)])|0);
 $33=(($32+16)|0);
 $34=((HEAP32[(($33)>>2)])|0);
 $35=(($34+24)|0);
 $36=(+(HEAPF32[(($35)>>2)]));
 $37=((HEAP32[(($17)>>2)])|0);
 $38=(($37+16)|0);
 $39=((HEAP32[(($38)>>2)])|0);
 $40=(($39+24)|0);
 $41=(+(HEAPF32[(($40)>>2)]));
 $42=$36<$41;
 do {
  if (!($42)) {
   $44=$36==$41;
   if ($44) {
    $46=(($34+28)|0);
    $47=(+(HEAPF32[(($46)>>2)]));
    $48=(($39+28)|0);
    $49=(+(HEAPF32[(($48)>>2)]));
    $50=$47>$49;
    if (!($50)) {
     break;
    }
   }
   $92=((HEAP32[(($17)>>2)])|0);
   $93=(($92+16)|0);
   $94=((HEAP32[(($93)>>2)])|0);
   $95=((HEAP32[(($11)>>2)])|0);
   $96=(($95+16)|0);
   $97=((HEAP32[(($96)>>2)])|0);
   $98=(($10+16)|0);
   $99=((HEAP32[(($98)>>2)])|0);
   $100=(+(_tesedgeSign($94,$97,$99)));
   $101=$100>(0.0);
   if ($101) {
    $_0=0;
    return (($_0)|0);
   }
   $103=(($6+20)|0);
   $104=$103;
   HEAP32[(($104)>>2)]=1;
   $105=(($regUp+20)|0);
   HEAP32[(($105)>>2)]=1;
   $106=(($tess)|0);
   $107=((HEAP32[(($106)>>2)])|0);
   $108=((_tessMeshSplitEdge($107,$10))|0);
   $109=($108|0)==0;
   if ($109) {
    $111=(($tess+144)|0);
    _longjmp((($111)|0),((1)|0));
    return ((0)|0);
   }
   $113=((HEAP32[(($106)>>2)])|0);
   $114=(($8+12)|0);
   $115=((HEAP32[(($114)>>2)])|0);
   $116=((HEAP32[(($17)>>2)])|0);
   $117=((_tessMeshSplice($113,$115,$116))|0);
   $118=($117|0)==0;
   if ($118) {
    $120=(($tess+144)|0);
    _longjmp((($120)|0),((1)|0));
    return ((0)|0);
   }
   $122=(($regUp+12)|0);
   $123=((HEAP32[(($122)>>2)])|0);
   $124=(($123)&255);
   $125=(($108+4)|0);
   $126=((HEAP32[(($125)>>2)])|0);
   $127=(($126+20)|0);
   $128=((HEAP32[(($127)>>2)])|0);
   $129=(($128+21)|0);
   HEAP8[($129)]=$124;
   $_0=1;
   return (($_0)|0);
  }
 } while(0);
 $52=((HEAP32[(($11)>>2)])|0);
 $53=(($52+16)|0);
 $54=((HEAP32[(($53)>>2)])|0);
 $55=((HEAP32[(($17)>>2)])|0);
 $56=(($55+16)|0);
 $57=((HEAP32[(($56)>>2)])|0);
 $58=(($8+16)|0);
 $59=((HEAP32[(($58)>>2)])|0);
 $60=(+(_tesedgeSign($54,$57,$59)));
 $61=$60<(0.0);
 if ($61) {
  $_0=0;
  return (($_0)|0);
 }
 $63=(($regUp+20)|0);
 HEAP32[(($63)>>2)]=1;
 $64=((HEAP32[(($1)>>2)])|0);
 $65=(($64+4)|0);
 $66=((HEAP32[(($65)>>2)])|0);
 $67=(($66)|0);
 $68=((HEAP32[(($67)>>2)])|0);
 $69=(($68+20)|0);
 $70=$69;
 HEAP32[(($70)>>2)]=1;
 $71=(($tess)|0);
 $72=((HEAP32[(($71)>>2)])|0);
 $73=((_tessMeshSplitEdge($72,$8))|0);
 $74=($73|0)==0;
 if ($74) {
  $76=(($tess+144)|0);
  _longjmp((($76)|0),((1)|0));
  return ((0)|0);
 }
 $78=((HEAP32[(($71)>>2)])|0);
 $79=((HEAP32[(($17)>>2)])|0);
 $80=((_tessMeshSplice($78,$79,$73))|0);
 $81=($80|0)==0;
 if ($81) {
  $83=(($tess+144)|0);
  _longjmp((($83)|0),((1)|0));
  return ((0)|0);
 }
 $85=(($regUp+12)|0);
 $86=((HEAP32[(($85)>>2)])|0);
 $87=(($86)&255);
 $88=(($73+20)|0);
 $89=((HEAP32[(($88)>>2)])|0);
 $90=(($89+21)|0);
 HEAP8[($90)]=$87;
 $_0=1;
 return (($_0)|0);
}
function _CheckForIntersect($tess,$regUp){
 $tess=($tess)|0;
 $regUp=($regUp)|0;
 var $isect=0,$1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0;
 var $20=0,$21=0,$22=0,$23=0,$24=0,$25=.0,$26=0,$27=.0,$28=0,$30=0,$31=.0,$32=0,$33=.0,$34=0,$37=0,$38=0,$39=.0,$40=0,$43=0,$44=.0;
 var $45=0,$48=0,$49=0,$50=0,$or_cond=0,$53=0,$54=0,$55=0,$57=0,$58=0,$59=0,$60=0,$63=0,$65=0,$66=.0,$67=0,$68=.0,$69=0,$_=.0,$70=0;
 var $71=.0,$72=0,$73=.0,$74=0,$75=.0,$76=0,$78=0,$79=.0,$80=0,$81=.0,$82=0,$84=0,$85=0,$or_cond184=0,$87=.0,$88=0,$90=.0,$91=0,$93=.0,$94=.0;
 var $95=0,$_180=.0,$96=0,$97=.0,$98=0,$101=.0,$102=.0,$103=0,$_181=.0,$104=0,$107=.0,$108=.0,$109=0,$_182=.0,$110=0,$111=.0,$112=0,$115=.0,$116=.0,$117=0;
 var $_183=.0,$118=0,$121=0,$122=0,$123=.0,$124=0,$126=0,$128=0,$129=.0,$130=0,$132=0,$133=0,$134=.0,$135=0,$136=0,$137=.0,$139=.0,$140=.0,$141=0,$143=0;
 var $145=.0,$146=.0,$147=0,$150=0,$151=0,$152=.0,$153=.0,$154=0,$156=0,$158=0,$159=.0,$160=.0,$161=0,$163=.0,$164=0,$165=.0,$167=.0,$168=.0,$169=0,$171=.0;
 var $172=.0,$173=0,$175=.0,$176=.0,$177=0,$179=.0,$180=.0,$181=0,$183=0,$185=.0,$186=0,$187=0,$188=.0,$189=0,$191=.0,$192=0,$193=.0,$194=0,$196=0,$197=.0;
 var $198=0,$200=.0,$201=0,$202=0,$203=.0,$204=0,$206=.0,$207=0,$208=.0,$209=0,$211=0,$212=.0,$213=0,$215=0,$216=0,$218=0,$219=0,$220=0,$221=0,$222=0;
 var $224=0,$226=0,$227=0,$228=0,$229=0,$231=0,$233=0,$234=0,$236=0,$238=0,$239=0,$240=0,$241=0,$242=0,$243=0,$244=0,$245=0,$246=0,$247=0,$248=0;
 var $249=0,$250=0,$251=0,$253=0,$255=0,$256=0,$257=0,$258=0,$259=0,$261=0,$263=0,$264=0,$265=0,$266=0,$267=0,$268=0,$269=0,$270=0,$272=0,$274=0;
 var $275=0,$276=0,$277=0,$278=0,$279=0,$280=0,$281=0,$282=0,$283=0,$284=0,$285=0,$286=0,$287=0,$288=0,$289=0,$290=0,$291=0,$292=0,$293=0,$294=0;
 var $295=0,$297=.0,$298=0,$300=0,$301=0,$302=0,$303=0,$304=0,$305=0,$306=0,$307=0,$308=0,$309=0,$310=0,$311=0,$312=0,$314=0,$316=0,$317=0,$318=.0;
 var $319=0,$320=0,$321=0,$322=0,$323=.0,$324=0,$325=0,$327=0,$328=.0,$329=0,$331=0,$332=0,$333=0,$334=0,$335=0,$336=0,$337=0,$338=0,$340=0,$342=0;
 var $343=0,$344=.0,$345=0,$346=0,$347=0,$348=0,$349=.0,$350=0,$351=0,$353=0,$354=0,$355=0,$356=0,$357=0,$359=0,$361=0,$362=0,$363=0,$364=0,$366=0;
 var $368=0,$369=0,$370=0,$371=0,$372=0,$373=0,$375=0,$377=.0,$378=0,$379=0,$380=.0,$381=0,$382=0,$383=0,$384=0,$385=0,$386=0,$387=0,$388=0,$389=0;
 var $390=0,$391=0,$392=0,$393=0,$394=0,$396=0,$397=0,$399=0,$400=0,$401=0,$402=0,$403=0,$404=0,$405=0,$406=0,$407=0,$408=0,$_0=0,label=0;
 var sp=0;sp=STACKTOP;STACKTOP=(STACKTOP+48)|0;
 $isect=((sp)|0);
 $1=(($regUp+4)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+8)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($4)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=$6;
 $8=(($regUp)|0);
 $9=((HEAP32[(($8)>>2)])|0);
 $10=$6;
 $11=((HEAP32[(($10)>>2)])|0);
 $12=(($9+16)|0);
 $13=((HEAP32[(($12)>>2)])|0);
 $14=(($11+16)|0);
 $15=((HEAP32[(($14)>>2)])|0);
 $16=(($9+4)|0);
 $17=((HEAP32[(($16)>>2)])|0);
 $18=(($17+16)|0);
 $19=((HEAP32[(($18)>>2)])|0);
 $20=(($11+4)|0);
 $21=((HEAP32[(($20)>>2)])|0);
 $22=(($21+16)|0);
 $23=((HEAP32[(($22)>>2)])|0);
 $24=(($23+24)|0);
 $25=(+(HEAPF32[(($24)>>2)]));
 $26=(($19+24)|0);
 $27=(+(HEAPF32[(($26)>>2)]));
 $28=$25==$27;
 do {
  if ($28) {
   $30=(($23+28)|0);
   $31=(+(HEAPF32[(($30)>>2)]));
   $32=(($19+28)|0);
   $33=(+(HEAPF32[(($32)>>2)]));
   $34=$31==$33;
   if (!($34)) {
    break;
   }
   ___assert_fail(((112)|0),((1456)|0),((577)|0),((2240)|0));
   return ((0)|0);
  }
 } while(0);
 $37=(($tess+72)|0);
 $38=((HEAP32[(($37)>>2)])|0);
 $39=(+(_tesedgeSign($19,$38,$13)));
 $40=$39>(0.0);
 if ($40) {
  ___assert_fail(((48)|0),((1456)|0),((578)|0),((2240)|0));
  return ((0)|0);
 }
 $43=((HEAP32[(($37)>>2)])|0);
 $44=(+(_tesedgeSign($23,$43,$15)));
 $45=$44<(0.0);
 if ($45) {
  ___assert_fail(((1688)|0),((1456)|0),((579)|0),((2240)|0));
  return ((0)|0);
 }
 $48=((HEAP32[(($37)>>2)])|0);
 $49=($13|0)==($48|0);
 $50=($15|0)==($48|0);
 $or_cond=$49|$50;
 if ($or_cond) {
  ___assert_fail(((1616)|0),((1456)|0),((580)|0),((2240)|0));
  return ((0)|0);
 }
 $53=(($regUp+24)|0);
 $54=((HEAP32[(($53)>>2)])|0);
 $55=($54|0)==0;
 if (!($55)) {
  ___assert_fail(((1504)|0),((1456)|0),((581)|0),((2240)|0));
  return ((0)|0);
 }
 $57=(($6+24)|0);
 $58=$57;
 $59=((HEAP32[(($58)>>2)])|0);
 $60=($59|0)==0;
 if (!($60)) {
  ___assert_fail(((1504)|0),((1456)|0),((581)|0),((2240)|0));
  return ((0)|0);
 }
 $63=($13|0)==($15|0);
 if ($63) {
  $_0=0;
  STACKTOP=sp;return (($_0)|0);
 }
 $65=(($13+28)|0);
 $66=(+(HEAPF32[(($65)>>2)]));
 $67=(($19+28)|0);
 $68=(+(HEAPF32[(($67)>>2)]));
 $69=$66>$68;
 $_=($69?$68:$66);
 $70=(($15+28)|0);
 $71=(+(HEAPF32[(($70)>>2)]));
 $72=(($23+28)|0);
 $73=(+(HEAPF32[(($72)>>2)]));
 $74=$71<$73;
 $75=($74?$73:$71);
 $76=$_>$75;
 if ($76) {
  $_0=0;
  STACKTOP=sp;return (($_0)|0);
 }
 $78=(($13+24)|0);
 $79=(+(HEAPF32[(($78)>>2)]));
 $80=(($15+24)|0);
 $81=(+(HEAPF32[(($80)>>2)]));
 $82=$79<$81;
 do {
  if ($82) {
   label = 912;
  } else {
   $84=$79!=$81;
   $85=$66>$71;
   $or_cond184=$84|$85;
   if (!($or_cond184)) {
    label = 912;
    break;
   }
   $90=(+(_tesedgeSign($19,$15,$13)));
   $91=$90<(0.0);
   if ($91) {
    $_0=0;
   } else {
    break;
   }
   STACKTOP=sp;return (($_0)|0);
  }
 } while(0);
 do {
  if ((label|0) == 912) {
   $87=(+(_tesedgeSign($23,$13,$15)));
   $88=$87>(0.0);
   if ($88) {
    $_0=0;
   } else {
    break;
   }
   STACKTOP=sp;return (($_0)|0);
  }
 } while(0);
 _tesedgeIntersect($19,$13,$23,$15,$isect);
 $93=(+(HEAPF32[(($65)>>2)]));
 $94=(+(HEAPF32[(($67)>>2)]));
 $95=$93>$94;
 $_180=($95?$94:$93);
 $96=(($isect+28)|0);
 $97=(+(HEAPF32[(($96)>>2)]));
 $98=$_180>$97;
 if ($98) {
  ___assert_fail(((1376)|0),((1456)|0),((600)|0),((2240)|0));
  return ((0)|0);
 }
 $101=(+(HEAPF32[(($70)>>2)]));
 $102=(+(HEAPF32[(($72)>>2)]));
 $103=$101<$102;
 $_181=($103?$102:$101);
 $104=$97>$_181;
 if ($104) {
  ___assert_fail(((1320)|0),((1456)|0),((601)|0),((2240)|0));
  return ((0)|0);
 }
 $107=(+(HEAPF32[(($24)>>2)]));
 $108=(+(HEAPF32[(($26)>>2)]));
 $109=$107>$108;
 $_182=($109?$108:$107);
 $110=(($isect+24)|0);
 $111=(+(HEAPF32[(($110)>>2)]));
 $112=$_182>$111;
 if ($112) {
  ___assert_fail(((1200)|0),((1456)|0),((602)|0),((2240)|0));
  return ((0)|0);
 }
 $115=(+(HEAPF32[(($80)>>2)]));
 $116=(+(HEAPF32[(($78)>>2)]));
 $117=$115<$116;
 $_183=($117?$116:$115);
 $118=$111>$_183;
 if ($118) {
  ___assert_fail(((1144)|0),((1456)|0),((603)|0),((2240)|0));
  return ((0)|0);
 }
 $121=((HEAP32[(($37)>>2)])|0);
 $122=(($121+24)|0);
 $123=(+(HEAPF32[(($122)>>2)]));
 $124=$111<$123;
 do {
  if ($124) {
   label = 925;
  } else {
   $126=$111==$123;
   if (!($126)) {
    break;
   }
   $128=(($121+28)|0);
   $129=(+(HEAPF32[(($128)>>2)]));
   $130=$97>$129;
   if (!($130)) {
    label = 925;
   }
  }
 } while(0);
 if ((label|0) == 925) {
  $132=((HEAP32[(($37)>>2)])|0);
  $133=(($132+24)|0);
  $134=(+(HEAPF32[(($133)>>2)]));
  HEAPF32[(($110)>>2)]=$134;
  $135=((HEAP32[(($37)>>2)])|0);
  $136=(($135+28)|0);
  $137=(+(HEAPF32[(($136)>>2)]));
  HEAPF32[(($96)>>2)]=$137;
 }
 $139=(+(HEAPF32[(($78)>>2)]));
 $140=(+(HEAPF32[(($80)>>2)]));
 $141=$139<$140;
 do {
  if ($141) {
   $150=$13;
  } else {
   $143=$139==$140;
   if ($143) {
    $145=(+(HEAPF32[(($65)>>2)]));
    $146=(+(HEAPF32[(($70)>>2)]));
    $147=$145>$146;
    if (!($147)) {
     $150=$13;
     break;
    }
   }
   $150=$15;
  }
 } while(0);
 $151=(($150+24)|0);
 $152=(+(HEAPF32[(($151)>>2)]));
 $153=(+(HEAPF32[(($110)>>2)]));
 $154=$152<$153;
 do {
  if ($154) {
   label = 933;
  } else {
   $156=$152==$153;
   if (!($156)) {
    break;
   }
   $158=(($150+28)|0);
   $159=(+(HEAPF32[(($158)>>2)]));
   $160=(+(HEAPF32[(($96)>>2)]));
   $161=$159>$160;
   if (!($161)) {
    label = 933;
   }
  }
 } while(0);
 if ((label|0) == 933) {
  $163=(+(HEAPF32[(($151)>>2)]));
  HEAPF32[(($110)>>2)]=$163;
  $164=(($150+28)|0);
  $165=(+(HEAPF32[(($164)>>2)]));
  HEAPF32[(($96)>>2)]=$165;
 }
 $167=(+(HEAPF32[(($110)>>2)]));
 $168=(+(HEAPF32[(($78)>>2)]));
 $169=$167==$168;
 if ($169) {
  $171=(+(HEAPF32[(($96)>>2)]));
  $172=(+(HEAPF32[(($65)>>2)]));
  $173=$171==$172;
  if (!($173)) {
   label = 936;
  }
 } else {
  label = 936;
 }
 do {
  if ((label|0) == 936) {
   $175=(+(HEAPF32[(($110)>>2)]));
   $176=(+(HEAPF32[(($80)>>2)]));
   $177=$175==$176;
   if ($177) {
    $179=(+(HEAPF32[(($96)>>2)]));
    $180=(+(HEAPF32[(($70)>>2)]));
    $181=$179==$180;
    if ($181) {
     break;
    }
   }
   $185=(+(HEAPF32[(($26)>>2)]));
   $186=((HEAP32[(($37)>>2)])|0);
   $187=(($186+24)|0);
   $188=(+(HEAPF32[(($187)>>2)]));
   $189=$185==$188;
   if ($189) {
    $191=(+(HEAPF32[(($67)>>2)]));
    $192=(($186+28)|0);
    $193=(+(HEAPF32[(($192)>>2)]));
    $194=$191==$193;
    if ($194) {
     label = 942;
    } else {
     label = 941;
    }
   } else {
    label = 941;
   }
   if ((label|0) == 941) {
    $196=((HEAP32[(($37)>>2)])|0);
    $197=(+(_tesedgeSign($19,$196,$isect)));
    $198=$197<(0.0);
    if ($198) {
     label = 942;
    }
   }
   do {
    if ((label|0) == 942) {
     $200=(+(HEAPF32[(($24)>>2)]));
     $201=((HEAP32[(($37)>>2)])|0);
     $202=(($201+24)|0);
     $203=(+(HEAPF32[(($202)>>2)]));
     $204=$200==$203;
     if ($204) {
      $206=(+(HEAPF32[(($72)>>2)]));
      $207=(($201+28)|0);
      $208=(+(HEAPF32[(($207)>>2)]));
      $209=$206==$208;
      if (!($209)) {
       label = 944;
      }
     } else {
      label = 944;
     }
     if ((label|0) == 944) {
      $211=((HEAP32[(($37)>>2)])|0);
      $212=(+(_tesedgeSign($23,$211,$isect)));
      $213=$212>(0.0);
      if (!($213)) {
       break;
      }
     }
     $353=(($tess)|0);
     $354=((HEAP32[(($353)>>2)])|0);
     $355=((HEAP32[(($16)>>2)])|0);
     $356=((_tessMeshSplitEdge($354,$355))|0);
     $357=($356|0)==0;
     if ($357) {
      $359=(($tess+144)|0);
      _longjmp((($359)|0),((1)|0));
      return ((0)|0);
     }
     $361=((HEAP32[(($353)>>2)])|0);
     $362=((HEAP32[(($20)>>2)])|0);
     $363=((_tessMeshSplitEdge($361,$362))|0);
     $364=($363|0)==0;
     if ($364) {
      $366=(($tess+144)|0);
      _longjmp((($366)|0),((1)|0));
      return ((0)|0);
     }
     $368=((HEAP32[(($353)>>2)])|0);
     $369=((HEAP32[(($20)>>2)])|0);
     $370=(($369+12)|0);
     $371=((HEAP32[(($370)>>2)])|0);
     $372=((_tessMeshSplice($368,$371,$9))|0);
     $373=($372|0)==0;
     if ($373) {
      $375=(($tess+144)|0);
      _longjmp((($375)|0),((1)|0));
      return ((0)|0);
     }
     $377=(+(HEAPF32[(($110)>>2)]));
     $378=((HEAP32[(($12)>>2)])|0);
     $379=(($378+24)|0);
     HEAPF32[(($379)>>2)]=$377;
     $380=(+(HEAPF32[(($96)>>2)]));
     $381=((HEAP32[(($12)>>2)])|0);
     $382=(($381+28)|0);
     HEAPF32[(($382)>>2)]=$380;
     $383=(($tess+104)|0);
     $384=(($tess+68)|0);
     $385=((HEAP32[(($384)>>2)])|0);
     $386=((HEAP32[(($12)>>2)])|0);
     $387=$386;
     $388=((_pqInsert($383,$385,$387))|0);
     $389=((HEAP32[(($12)>>2)])|0);
     $390=(($389+32)|0);
     HEAP32[(($390)>>2)]=$388;
     $391=((HEAP32[(($12)>>2)])|0);
     $392=(($391+32)|0);
     $393=((HEAP32[(($392)>>2)])|0);
     $394=($393|0)==268435455;
     if ($394) {
      $396=((HEAP32[(($384)>>2)])|0);
      _pqDeletePriorityQ($383,$396);
      HEAP32[(($384)>>2)]=0;
      $397=(($tess+144)|0);
      _longjmp((($397)|0),((1)|0));
      return ((0)|0);
     }
     _GetIntersectData($391,$13,$19,$15,$23);
     $399=(($6+20)|0);
     $400=$399;
     HEAP32[(($400)>>2)]=1;
     $401=(($regUp+20)|0);
     HEAP32[(($401)>>2)]=1;
     $402=((HEAP32[(($1)>>2)])|0);
     $403=(($402+4)|0);
     $404=((HEAP32[(($403)>>2)])|0);
     $405=(($404)|0);
     $406=((HEAP32[(($405)>>2)])|0);
     $407=(($406+20)|0);
     $408=$407;
     HEAP32[(($408)>>2)]=1;
     $_0=0;
     STACKTOP=sp;return (($_0)|0);
    }
   } while(0);
   $215=((HEAP32[(($37)>>2)])|0);
   $216=($23|0)==($215|0);
   if ($216) {
    $218=(($tess)|0);
    $219=((HEAP32[(($218)>>2)])|0);
    $220=((HEAP32[(($16)>>2)])|0);
    $221=((_tessMeshSplitEdge($219,$220))|0);
    $222=($221|0)==0;
    if ($222) {
     $224=(($tess+144)|0);
     _longjmp((($224)|0),((1)|0));
     return ((0)|0);
    }
    $226=((HEAP32[(($218)>>2)])|0);
    $227=((HEAP32[(($20)>>2)])|0);
    $228=((_tessMeshSplice($226,$227,$9))|0);
    $229=($228|0)==0;
    if ($229) {
     $231=(($tess+144)|0);
     _longjmp((($231)|0),((1)|0));
     return ((0)|0);
    }
    $233=((_TopLeftRegion($tess,$regUp))|0);
    $234=($233|0)==0;
    if ($234) {
     $236=(($tess+144)|0);
     _longjmp((($236)|0),((1)|0));
     return ((0)|0);
    }
    $238=(($233+4)|0);
    $239=((HEAP32[(($238)>>2)])|0);
    $240=(($239+8)|0);
    $241=((HEAP32[(($240)>>2)])|0);
    $242=(($241)|0);
    $243=((HEAP32[(($242)>>2)])|0);
    $244=$243;
    $245=$243;
    $246=((HEAP32[(($245)>>2)])|0);
    $247=((_FinishLeftRegions($tess,$244,$7))|0);
    $248=(($246+4)|0);
    $249=((HEAP32[(($248)>>2)])|0);
    $250=(($249+12)|0);
    $251=((HEAP32[(($250)>>2)])|0);
    _AddRightEdges($tess,$233,$251,$246,$246,1);
    $_0=1;
    STACKTOP=sp;return (($_0)|0);
   }
   $253=($19|0)==($215|0);
   if ($253) {
    $255=(($tess)|0);
    $256=((HEAP32[(($255)>>2)])|0);
    $257=((HEAP32[(($20)>>2)])|0);
    $258=((_tessMeshSplitEdge($256,$257))|0);
    $259=($258|0)==0;
    if ($259) {
     $261=(($tess+144)|0);
     _longjmp((($261)|0),((1)|0));
     return ((0)|0);
    }
    $263=((HEAP32[(($255)>>2)])|0);
    $264=(($9+12)|0);
    $265=((HEAP32[(($264)>>2)])|0);
    $266=((HEAP32[(($20)>>2)])|0);
    $267=(($266+12)|0);
    $268=((HEAP32[(($267)>>2)])|0);
    $269=((_tessMeshSplice($263,$265,$268))|0);
    $270=($269|0)==0;
    if ($270) {
     $272=(($tess+144)|0);
     _longjmp((($272)|0),((1)|0));
     return ((0)|0);
    }
    $274=((_TopRightRegion($regUp))|0);
    $275=(($274+4)|0);
    $276=((HEAP32[(($275)>>2)])|0);
    $277=(($276+8)|0);
    $278=((HEAP32[(($277)>>2)])|0);
    $279=(($278)|0);
    $280=((HEAP32[(($279)>>2)])|0);
    $281=$280;
    $282=((HEAP32[(($281)>>2)])|0);
    $283=(($282+4)|0);
    $284=((HEAP32[(($283)>>2)])|0);
    $285=(($284+8)|0);
    $286=((HEAP32[(($285)>>2)])|0);
    $287=((HEAP32[(($20)>>2)])|0);
    $288=(($287+12)|0);
    $289=((HEAP32[(($288)>>2)])|0);
    HEAP32[(($8)>>2)]=$289;
    $290=((_FinishLeftRegions($tess,$regUp,0))|0);
    $291=(($290+8)|0);
    $292=((HEAP32[(($291)>>2)])|0);
    $293=((HEAP32[(($16)>>2)])|0);
    $294=(($293+8)|0);
    $295=((HEAP32[(($294)>>2)])|0);
    _AddRightEdges($tess,$274,$292,$295,$286,1);
    $_0=1;
    STACKTOP=sp;return (($_0)|0);
   }
   $297=(+(_tesedgeSign($19,$215,$isect)));
   $298=$297<(0.0);
   do {
    if (!($298)) {
     $300=(($regUp+20)|0);
     HEAP32[(($300)>>2)]=1;
     $301=((HEAP32[(($1)>>2)])|0);
     $302=(($301+4)|0);
     $303=((HEAP32[(($302)>>2)])|0);
     $304=(($303)|0);
     $305=((HEAP32[(($304)>>2)])|0);
     $306=(($305+20)|0);
     $307=$306;
     HEAP32[(($307)>>2)]=1;
     $308=(($tess)|0);
     $309=((HEAP32[(($308)>>2)])|0);
     $310=((HEAP32[(($16)>>2)])|0);
     $311=((_tessMeshSplitEdge($309,$310))|0);
     $312=($311|0)==0;
     if ($312) {
      $314=(($tess+144)|0);
      _longjmp((($314)|0),((1)|0));
      return ((0)|0);
     } else {
      $316=((HEAP32[(($37)>>2)])|0);
      $317=(($316+24)|0);
      $318=(+(HEAPF32[(($317)>>2)]));
      $319=((HEAP32[(($12)>>2)])|0);
      $320=(($319+24)|0);
      HEAPF32[(($320)>>2)]=$318;
      $321=((HEAP32[(($37)>>2)])|0);
      $322=(($321+28)|0);
      $323=(+(HEAPF32[(($322)>>2)]));
      $324=((HEAP32[(($12)>>2)])|0);
      $325=(($324+28)|0);
      HEAPF32[(($325)>>2)]=$323;
      break;
     }
    }
   } while(0);
   $327=((HEAP32[(($37)>>2)])|0);
   $328=(+(_tesedgeSign($23,$327,$isect)));
   $329=$328>(0.0);
   if ($329) {
    $_0=0;
    STACKTOP=sp;return (($_0)|0);
   }
   $331=(($6+20)|0);
   $332=$331;
   HEAP32[(($332)>>2)]=1;
   $333=(($regUp+20)|0);
   HEAP32[(($333)>>2)]=1;
   $334=(($tess)|0);
   $335=((HEAP32[(($334)>>2)])|0);
   $336=((HEAP32[(($20)>>2)])|0);
   $337=((_tessMeshSplitEdge($335,$336))|0);
   $338=($337|0)==0;
   if ($338) {
    $340=(($tess+144)|0);
    _longjmp((($340)|0),((1)|0));
    return ((0)|0);
   }
   $342=((HEAP32[(($37)>>2)])|0);
   $343=(($342+24)|0);
   $344=(+(HEAPF32[(($343)>>2)]));
   $345=((HEAP32[(($14)>>2)])|0);
   $346=(($345+24)|0);
   HEAPF32[(($346)>>2)]=$344;
   $347=((HEAP32[(($37)>>2)])|0);
   $348=(($347+28)|0);
   $349=(+(HEAPF32[(($348)>>2)]));
   $350=((HEAP32[(($14)>>2)])|0);
   $351=(($350+28)|0);
   HEAPF32[(($351)>>2)]=$349;
   $_0=0;
   STACKTOP=sp;return (($_0)|0);
  }
 } while(0);
 $183=((_CheckForRightSplice($tess,$regUp))|0);
 $_0=0;
 STACKTOP=sp;return (($_0)|0);
}
function _TopRightRegion($reg){
 $reg=($reg)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$_0=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0;
 var $21=0,label=0;
 $1=(($reg)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+4)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($4+16)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $_0=$reg;
 while(1) {
  $8=(($_0+4)|0);
  $9=((HEAP32[(($8)>>2)])|0);
  $10=(($9+4)|0);
  $11=((HEAP32[(($10)>>2)])|0);
  $12=(($11)|0);
  $13=((HEAP32[(($12)>>2)])|0);
  $14=$13;
  $15=$13;
  $16=((HEAP32[(($15)>>2)])|0);
  $17=(($16+4)|0);
  $18=((HEAP32[(($17)>>2)])|0);
  $19=(($18+16)|0);
  $20=((HEAP32[(($19)>>2)])|0);
  $21=($20|0)==($6|0);
  if ($21) {
   $_0=$14;
  } else {
   break;
  }
 }
 return (($14)|0);
}
function _GetIntersectData($isect,$orgUp,$dstUp,$orgLo,$dstLo){
 $isect=($isect)|0;
 $orgUp=($orgUp)|0;
 $dstUp=($dstUp)|0;
 $orgLo=($orgLo)|0;
 $dstLo=($dstLo)|0;
 var $weights=0,$1=0,$2=0,$3=0,$4=0,$5=0,$6=0,label=0;
 var sp=0;sp=STACKTOP;STACKTOP=(STACKTOP+16)|0;
 $weights=((sp)|0);
 $1=(($isect+20)|0);
 HEAPF32[(($1)>>2)]=0.0;
 $2=(($isect+16)|0);
 HEAPF32[(($2)>>2)]=0.0;
 $3=(($isect+12)|0);
 HEAPF32[(($3)>>2)]=0.0;
 $4=(($isect+40)|0);
 HEAP32[(($4)>>2)]=-1;
 $5=(($weights)|0);
 _VertexWeights($isect,$orgUp,$dstUp,$5);
 $6=(($weights+8)|0);
 _VertexWeights($isect,$orgLo,$dstLo,$6);
 STACKTOP=sp;return;
}
function _VertexWeights($isect,$org,$dst,$weights){
 $isect=($isect)|0;
 $org=($org)|0;
 $dst=($dst)|0;
 $weights=($weights)|0;
 var $1=0,$2=.0,$3=0,$4=.0,$5=.0,$6=0,$8=.0,$10=.0,$11=0,$12=.0,$13=0,$14=.0,$15=.0,$16=0,$18=.0,$20=.0,$21=.0,$22=0,$23=.0,$24=.0;
 var $25=.0,$26=0,$28=.0,$30=.0,$31=0,$32=.0,$33=.0,$34=.0,$35=0,$37=.0,$39=.0,$40=.0,$41=.0,$42=.0,$43=.0,$44=.0,$45=.0,$46=0,$47=.0,$48=0;
 var $49=.0,$50=.0,$51=0,$52=.0,$53=.0,$54=.0,$55=0,$56=.0,$57=.0,$58=.0,$59=0,$60=.0,$61=.0,$62=.0,$63=0,$64=.0,$65=.0,$66=.0,$67=0,$68=.0;
 var $69=.0,$70=.0,$71=0,$72=.0,$73=.0,$74=.0,$75=0,$76=.0,$77=.0,$78=.0,$79=0,$80=.0,$81=.0,label=0;
 $1=(($org+24)|0);
 $2=(+(HEAPF32[(($1)>>2)]));
 $3=(($isect+24)|0);
 $4=(+(HEAPF32[(($3)>>2)]));
 $5=($2)-($4);
 $6=$5<(0.0);
 if ($6) {
  $8=((-.0))-($5);
  $10=$8;
 } else {
  $10=$5;
 }
 $11=(($org+28)|0);
 $12=(+(HEAPF32[(($11)>>2)]));
 $13=(($isect+28)|0);
 $14=(+(HEAPF32[(($13)>>2)]));
 $15=($12)-($14);
 $16=$15<(0.0);
 if ($16) {
  $18=((-.0))-($15);
  $20=$18;
 } else {
  $20=$15;
 }
 $21=($10)+($20);
 $22=(($dst+24)|0);
 $23=(+(HEAPF32[(($22)>>2)]));
 $24=(+(HEAPF32[(($3)>>2)]));
 $25=($23)-($24);
 $26=$25<(0.0);
 if ($26) {
  $28=((-.0))-($25);
  $30=$28;
 } else {
  $30=$25;
 }
 $31=(($dst+28)|0);
 $32=(+(HEAPF32[(($31)>>2)]));
 $33=(+(HEAPF32[(($13)>>2)]));
 $34=($32)-($33);
 $35=$34<(0.0);
 if ($35) {
  $37=((-.0))-($34);
  $39=$37;
 } else {
  $39=$34;
 }
 $40=($30)+($39);
 $41=($40)*((0.5));
 $42=($21)+($40);
 $43=($41)/($42);
 HEAPF32[(($weights)>>2)]=$43;
 $44=($21)*((0.5));
 $45=($44)/($42);
 $46=(($weights+4)|0);
 HEAPF32[(($46)>>2)]=$45;
 $47=(+(HEAPF32[(($weights)>>2)]));
 $48=(($org+12)|0);
 $49=(+(HEAPF32[(($48)>>2)]));
 $50=($47)*($49);
 $51=(($dst+12)|0);
 $52=(+(HEAPF32[(($51)>>2)]));
 $53=($45)*($52);
 $54=($50)+($53);
 $55=(($isect+12)|0);
 $56=(+(HEAPF32[(($55)>>2)]));
 $57=($56)+($54);
 HEAPF32[(($55)>>2)]=$57;
 $58=(+(HEAPF32[(($weights)>>2)]));
 $59=(($org+16)|0);
 $60=(+(HEAPF32[(($59)>>2)]));
 $61=($58)*($60);
 $62=(+(HEAPF32[(($46)>>2)]));
 $63=(($dst+16)|0);
 $64=(+(HEAPF32[(($63)>>2)]));
 $65=($62)*($64);
 $66=($61)+($65);
 $67=(($isect+16)|0);
 $68=(+(HEAPF32[(($67)>>2)]));
 $69=($68)+($66);
 HEAPF32[(($67)>>2)]=$69;
 $70=(+(HEAPF32[(($weights)>>2)]));
 $71=(($org+20)|0);
 $72=(+(HEAPF32[(($71)>>2)]));
 $73=($70)*($72);
 $74=(+(HEAPF32[(($46)>>2)]));
 $75=(($dst+20)|0);
 $76=(+(HEAPF32[(($75)>>2)]));
 $77=($74)*($76);
 $78=($73)+($77);
 $79=(($isect+20)|0);
 $80=(+(HEAPF32[(($79)>>2)]));
 $81=($80)+($78);
 HEAPF32[(($79)>>2)]=$81;
 return;
}
function _FinishRegion($tess,$reg){
 $tess=($tess)|0;
 $reg=($reg)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,label=0;
 $1=(($reg)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+20)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($reg+12)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=(($6)&255);
 $8=(($4+21)|0);
 HEAP8[($8)]=$7;
 $9=(($4+8)|0);
 HEAP32[(($9)>>2)]=$2;
 _DeleteRegion($tess,$reg);
 return;
}
function _FixUpperEdge($tess,$reg,$newEdge){
 $tess=($tess)|0;
 $reg=($reg)|0;
 $newEdge=($newEdge)|0;
 var $1=0,$2=0,$3=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$13=0,$_0=0,label=0;
 $1=(($reg+24)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=($2|0)==0;
 if ($3) {
  ___assert_fail(((752)|0),((1456)|0),((159)|0),((2144)|0));
  return ((0)|0);
 }
 $6=(($tess)|0);
 $7=((HEAP32[(($6)>>2)])|0);
 $8=(($reg)|0);
 $9=((HEAP32[(($8)>>2)])|0);
 $10=((_tessMeshDelete($7,$9))|0);
 $11=($10|0)==0;
 if ($11) {
  $_0=0;
  return (($_0)|0);
 }
 HEAP32[(($1)>>2)]=0;
 HEAP32[(($8)>>2)]=$newEdge;
 $13=(($newEdge+24)|0);
 HEAP32[(($13)>>2)]=$reg;
 $_0=1;
 return (($_0)|0);
}
function _ConnectLeftDegenerate($tess,$regUp,$vEvent){
 $tess=($tess)|0;
 $regUp=($regUp)|0;
 $vEvent=($vEvent)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=.0,$7=0,$8=.0,$9=0,$11=0,$12=.0,$13=0,$14=.0,$15=0,$18=0,$19=0,$20=0,$21=0,$22=0,$23=.0;
 var $24=.0,$25=0,$27=0,$28=.0,$29=0,$30=.0,$31=0,$33=0,$34=0,$35=0,$36=0,$37=0,$39=0,$41=0,$42=0,$43=0,$45=0,$46=0,$47=0,$48=0;
 var $49=0,$51=0,$54=0,$55=0,$56=0,$57=0,$58=0,$60=0,label=0;
 $1=(($regUp)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+16)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($4+24)|0);
 $6=(+(HEAPF32[(($5)>>2)]));
 $7=(($vEvent+24)|0);
 $8=(+(HEAPF32[(($7)>>2)]));
 $9=$6==$8;
 do {
  if ($9) {
   $11=(($4+28)|0);
   $12=(+(HEAPF32[(($11)>>2)]));
   $13=(($vEvent+28)|0);
   $14=(+(HEAPF32[(($13)>>2)]));
   $15=$12==$14;
   if (!($15)) {
    break;
   }
   ___assert_fail(((896)|0),((1456)|0),((906)|0),((2192)|0));
  }
 } while(0);
 $18=(($2+4)|0);
 $19=((HEAP32[(($18)>>2)])|0);
 $20=(($19+16)|0);
 $21=((HEAP32[(($20)>>2)])|0);
 $22=(($21+24)|0);
 $23=(+(HEAPF32[(($22)>>2)]));
 $24=(+(HEAPF32[(($7)>>2)]));
 $25=$23==$24;
 do {
  if ($25) {
   $27=(($21+28)|0);
   $28=(+(HEAPF32[(($27)>>2)]));
   $29=(($vEvent+28)|0);
   $30=(+(HEAPF32[(($29)>>2)]));
   $31=$28==$30;
   if (!($31)) {
    break;
   }
   ___assert_fail(((896)|0),((1456)|0),((927)|0),((2192)|0));
  }
 } while(0);
 $33=(($tess)|0);
 $34=((HEAP32[(($33)>>2)])|0);
 $35=((HEAP32[(($18)>>2)])|0);
 $36=((_tessMeshSplitEdge($34,$35))|0);
 $37=($36|0)==0;
 if ($37) {
  $39=(($tess+144)|0);
  _longjmp((($39)|0),((1)|0));
 }
 $41=(($regUp+24)|0);
 $42=((HEAP32[(($41)>>2)])|0);
 $43=($42|0)==0;
 do {
  if (!($43)) {
   $45=((HEAP32[(($33)>>2)])|0);
   $46=(($2+8)|0);
   $47=((HEAP32[(($46)>>2)])|0);
   $48=((_tessMeshDelete($45,$47))|0);
   $49=($48|0)==0;
   if ($49) {
    $51=(($tess+144)|0);
    _longjmp((($51)|0),((1)|0));
   } else {
    HEAP32[(($41)>>2)]=0;
    break;
   }
  }
 } while(0);
 $54=((HEAP32[(($33)>>2)])|0);
 $55=(($vEvent+8)|0);
 $56=((HEAP32[(($55)>>2)])|0);
 $57=((_tessMeshSplice($54,$56,$2))|0);
 $58=($57|0)==0;
 if ($58) {
  $60=(($tess+144)|0);
  _longjmp((($60)|0),((1)|0));
 } else {
  _SweepEvent($tess,$vEvent);
  return;
 }
}
function _ComputeWinding($tess,$reg){
 $tess=($tess)|0;
 $reg=($reg)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,label=0;
 $1=(($reg+4)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+4)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($4)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=(($6+8)|0);
 $8=$7;
 $9=((HEAP32[(($8)>>2)])|0);
 $10=(($reg)|0);
 $11=((HEAP32[(($10)>>2)])|0);
 $12=(($11+28)|0);
 $13=((HEAP32[(($12)>>2)])|0);
 $14=((($13)+($9))|0);
 $15=(($reg+8)|0);
 HEAP32[(($15)>>2)]=$14;
 $16=((_IsWindingInside($tess,$14))|0);
 $17=(($reg+12)|0);
 HEAP32[(($17)>>2)]=$16;
 return;
}
function _EdgeLeq($tess,$reg1,$reg2){
 $tess=($tess)|0;
 $reg1=($reg1)|0;
 $reg2=($reg2)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$19=0,$20=0,$21=0,$22=.0;
 var $23=0,$24=0,$25=0,$26=.0,$27=0,$29=0,$31=0,$32=.0,$33=0,$34=.0,$35=0,$37=0,$38=0,$39=0,$40=0,$41=0,$42=.0,$43=0,$45=0,$46=0;
 var $47=0,$48=0,$49=0,$50=.0,$51=0,$53=0,$54=0,$55=.0,$56=0,$58=0,$59=0,$61=.0,$62=0,$64=.0,$65=0,$66=0,$67=0,$68=0,$69=0,$70=.0;
 var $71=0,$_0_in=0,$_0=0,label=0;
 $1=(($tess+72)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($reg1)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=(($reg2)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=(($4+4)|0);
 $8=((HEAP32[(($7)>>2)])|0);
 $9=(($8+16)|0);
 $10=((HEAP32[(($9)>>2)])|0);
 $11=($10|0)==($2|0);
 $12=(($6+4)|0);
 $13=((HEAP32[(($12)>>2)])|0);
 $14=(($13+16)|0);
 $15=((HEAP32[(($14)>>2)])|0);
 $16=($15|0)==($2|0);
 if (!($11)) {
  $58=(($4+16)|0);
  $59=((HEAP32[(($58)>>2)])|0);
  if ($16) {
   $61=(+(_tesedgeSign($10,$2,$59)));
   $62=$61>=(0.0);
   $_0_in=$62;
   $_0=($_0_in&1);
   return (($_0)|0);
  } else {
   $64=(+(_tesedgeEval($10,$2,$59)));
   $65=((HEAP32[(($12)>>2)])|0);
   $66=(($65+16)|0);
   $67=((HEAP32[(($66)>>2)])|0);
   $68=(($6+16)|0);
   $69=((HEAP32[(($68)>>2)])|0);
   $70=(+(_tesedgeEval($67,$2,$69)));
   $71=$64>=$70;
   $_0_in=$71;
   $_0=($_0_in&1);
   return (($_0)|0);
  }
 }
 if (!($16)) {
  $53=(($6+16)|0);
  $54=((HEAP32[(($53)>>2)])|0);
  $55=(+(_tesedgeSign($15,$2,$54)));
  $56=$55<=(0.0);
  $_0_in=$56;
  $_0=($_0_in&1);
  return (($_0)|0);
 }
 $19=(($4+16)|0);
 $20=((HEAP32[(($19)>>2)])|0);
 $21=(($20+24)|0);
 $22=(+(HEAPF32[(($21)>>2)]));
 $23=(($6+16)|0);
 $24=((HEAP32[(($23)>>2)])|0);
 $25=(($24+24)|0);
 $26=(+(HEAPF32[(($25)>>2)]));
 $27=$22<$26;
 do {
  if (!($27)) {
   $29=$22==$26;
   if ($29) {
    $31=(($20+28)|0);
    $32=(+(HEAPF32[(($31)>>2)]));
    $33=(($24+28)|0);
    $34=(+(HEAPF32[(($33)>>2)]));
    $35=$32>$34;
    if (!($35)) {
     break;
    }
   }
   $45=((HEAP32[(($7)>>2)])|0);
   $46=(($45+16)|0);
   $47=((HEAP32[(($46)>>2)])|0);
   $48=((HEAP32[(($23)>>2)])|0);
   $49=((HEAP32[(($19)>>2)])|0);
   $50=(+(_tesedgeSign($47,$48,$49)));
   $51=$50>=(0.0);
   $_0_in=$51;
   $_0=($_0_in&1);
   return (($_0)|0);
  }
 } while(0);
 $37=((HEAP32[(($12)>>2)])|0);
 $38=(($37+16)|0);
 $39=((HEAP32[(($38)>>2)])|0);
 $40=((HEAP32[(($19)>>2)])|0);
 $41=((HEAP32[(($23)>>2)])|0);
 $42=(+(_tesedgeSign($39,$40,$41)));
 $43=$42<=(0.0);
 $_0_in=$43;
 $_0=($_0_in&1);
 return (($_0)|0);
}
function _AddSentinel($tess,$smin,$smax,$t){
 $tess=($tess)|0;
 $smin=+($smin);
 $smax=+($smax);
 $t=+($t);
 var $1=0,$2=0,$3=0,$4=0,$6=0,$8=0,$9=0,$10=0,$11=0,$13=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0,$21=0,$22=0,$23=0,$24=0;
 var $25=0,$26=0,$27=0,$28=0,$29=0,$30=0,$31=0,$32=0,$33=0,$34=0,$35=0,$36=0,$37=0,$38=0,$39=0,$40=0,$41=0,$42=0,$43=0,$44=0;
 var $45=0,$46=0,$47=0,$48=0,$49=0,$50=0,$52=0,label=0;
 $1=(($tess+76)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=((_bucketAlloc($2))|0);
 $4=($3|0)==0;
 if ($4) {
  $6=(($tess+144)|0);
  _longjmp((($6)|0),((1)|0));
 }
 $8=(($tess)|0);
 $9=((HEAP32[(($8)>>2)])|0);
 $10=((_tessMeshMakeEdge($9))|0);
 $11=($10|0)==0;
 if ($11) {
  $13=(($tess+144)|0);
  _longjmp((($13)|0),((1)|0));
 }
 $15=(($10+16)|0);
 $16=((HEAP32[(($15)>>2)])|0);
 $17=(($16+24)|0);
 HEAPF32[(($17)>>2)]=$smax;
 $18=((HEAP32[(($15)>>2)])|0);
 $19=(($18+28)|0);
 HEAPF32[(($19)>>2)]=$t;
 $20=(($10+4)|0);
 $21=((HEAP32[(($20)>>2)])|0);
 $22=(($21+16)|0);
 $23=((HEAP32[(($22)>>2)])|0);
 $24=(($23+24)|0);
 HEAPF32[(($24)>>2)]=$smin;
 $25=((HEAP32[(($20)>>2)])|0);
 $26=(($25+16)|0);
 $27=((HEAP32[(($26)>>2)])|0);
 $28=(($27+28)|0);
 HEAPF32[(($28)>>2)]=$t;
 $29=((HEAP32[(($20)>>2)])|0);
 $30=(($29+16)|0);
 $31=((HEAP32[(($30)>>2)])|0);
 $32=(($tess+72)|0);
 HEAP32[(($32)>>2)]=$31;
 $33=$3;
 HEAP32[(($33)>>2)]=$10;
 $34=(($3+8)|0);
 $35=$34;
 HEAP32[(($35)>>2)]=0;
 $36=(($3+12)|0);
 $37=$36;
 HEAP32[(($37)>>2)]=0;
 $38=(($3+24)|0);
 $39=$38;
 HEAP32[(($39)>>2)]=0;
 $40=(($3+16)|0);
 $41=$40;
 HEAP32[(($41)>>2)]=1;
 $42=(($3+20)|0);
 $43=$42;
 HEAP32[(($43)>>2)]=0;
 $44=(($tess+64)|0);
 $45=((HEAP32[(($44)>>2)])|0);
 $46=(($45)|0);
 $47=((_dictInsertBefore($45,$46,$3))|0);
 $48=(($3+4)|0);
 $49=$48;
 HEAP32[(($49)>>2)]=$47;
 $50=($47|0)==0;
 if ($50) {
  $52=(($tess+144)|0);
  _longjmp((($52)|0),((1)|0));
 } else {
  return;
 }
}
function _tessProjectPolygon($tess){
 $tess=($tess)|0;
 var $norm=0,$1=0,$2=0,$3=0,$4=0,$5=.0,$6=0,$7=0,$8=.0,$9=0,$10=0,$11=.0,$12=0,$13=.0,$14=0,$16=.0,$17=0,$18=0,$or_cond=0,$computedNormal_0=0;
 var $21=0,$22=0,$23=0,$24=0,$25=0,$26=0,$27=0,$28=0,$29=0,$30=0,$31=0,$32=0,$33=.0,$34=0,$35=.0,$36=0,$37=.0,$38=0,$39=.0,$40=0;
 var $41=0,$v_062=0,$42=0,$43=0,$44=0,$45=0,$46=0,$v_063=0,$48=0,$49=.0,$50=.0,$51=.0,$52=0,$53=.0,$54=.0,$55=.0,$56=.0,$57=0,$58=.0,$59=.0;
 var $60=.0,$61=.0,$62=0,$63=.0,$64=.0,$65=.0,$66=.0,$67=.0,$68=.0,$69=.0,$70=.0,$71=.0,$72=.0,$73=.0,$74=0,$75=0,$v_0=0,$76=0,$77=0,$v_159=0;
 var $79=0,$80=0,$81=0,$82=0,$83=0,$84=0,$85=0,$86=0,$87=0,$v_161=0,$first_060=0,$89=0,$90=0,$91=.0,$93=0,$94=.0,$96=.0,$97=0,$100=.0,$101=.0;
 var $102=0,$105=0,$106=.0,$107=.0,$108=0,$111=.0,$112=.0,$113=0,$first_1=0,$116=0,$v_1=0,$117=0,label=0;
 var sp=0;sp=STACKTOP;STACKTOP=(STACKTOP+16)|0;
 $norm=((sp)|0);
 $1=(($tess)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2)|0);
 $4=(($tess+8)|0);
 $5=(+(HEAPF32[(($4)>>2)]));
 $6=(($norm)|0);
 HEAPF32[(($6)>>2)]=$5;
 $7=(($tess+12)|0);
 $8=(+(HEAPF32[(($7)>>2)]));
 $9=(($norm+4)|0);
 HEAPF32[(($9)>>2)]=$8;
 $10=(($tess+16)|0);
 $11=(+(HEAPF32[(($10)>>2)]));
 $12=(($norm+8)|0);
 HEAPF32[(($12)>>2)]=$11;
 $13=(+(HEAPF32[(($6)>>2)]));
 $14=$13==(0.0);
 do {
  if ($14) {
   $16=(+(HEAPF32[(($9)>>2)]));
   $17=$16==(0.0);
   $18=$11==(0.0);
   $or_cond=$17&$18;
   if (!($or_cond)) {
    $computedNormal_0=0;
    break;
   }
   _ComputeNormal($tess,$6);
   $computedNormal_0=1;
  } else {
   $computedNormal_0=0;
  }
 } while(0);
 $21=(($tess+20)|0);
 $22=(($tess+32)|0);
 $23=((_LongAxis($6))|0);
 $24=(($tess+20+($23<<2))|0);
 HEAPF32[(($24)>>2)]=0.0;
 $25=((($23)+(1))|0);
 $26=(((($25|0))%(3))&-1);
 $27=(($tess+20+($26<<2))|0);
 HEAPF32[(($27)>>2)]=1.0;
 $28=((($23)+(2))|0);
 $29=(((($28|0))%(3))&-1);
 $30=(($tess+20+($29<<2))|0);
 HEAPF32[(($30)>>2)]=0.0;
 $31=(($tess+32+($23<<2))|0);
 HEAPF32[(($31)>>2)]=0.0;
 $32=(($norm+($23<<2))|0);
 $33=(+(HEAPF32[(($32)>>2)]));
 $34=$33>(0.0);
 $35=($34?(-.0):(0.0));
 $36=(($tess+32+($26<<2))|0);
 HEAPF32[(($36)>>2)]=$35;
 $37=(+(HEAPF32[(($32)>>2)]));
 $38=$37>(0.0);
 $39=($38?(1.0):(-1.0));
 $40=(($tess+32+($29<<2))|0);
 HEAPF32[(($40)>>2)]=$39;
 $41=(($2)|0);
 $v_062=((HEAP32[(($41)>>2)])|0);
 $42=($v_062|0)==($3|0);
 if (!($42)) {
  $43=(($tess+24)|0);
  $44=(($tess+28)|0);
  $45=(($tess+36)|0);
  $46=(($tess+40)|0);
  $v_063=$v_062;
  while(1) {
   $48=(($v_063+12)|0);
   $49=(+(HEAPF32[(($48)>>2)]));
   $50=(+(HEAPF32[(($21)>>2)]));
   $51=($49)*($50);
   $52=(($v_063+16)|0);
   $53=(+(HEAPF32[(($52)>>2)]));
   $54=(+(HEAPF32[(($43)>>2)]));
   $55=($53)*($54);
   $56=($51)+($55);
   $57=(($v_063+20)|0);
   $58=(+(HEAPF32[(($57)>>2)]));
   $59=(+(HEAPF32[(($44)>>2)]));
   $60=($58)*($59);
   $61=($56)+($60);
   $62=(($v_063+24)|0);
   HEAPF32[(($62)>>2)]=$61;
   $63=(+(HEAPF32[(($48)>>2)]));
   $64=(+(HEAPF32[(($22)>>2)]));
   $65=($63)*($64);
   $66=(+(HEAPF32[(($52)>>2)]));
   $67=(+(HEAPF32[(($45)>>2)]));
   $68=($66)*($67);
   $69=($65)+($68);
   $70=(+(HEAPF32[(($57)>>2)]));
   $71=(+(HEAPF32[(($46)>>2)]));
   $72=($70)*($71);
   $73=($69)+($72);
   $74=(($v_063+28)|0);
   HEAPF32[(($74)>>2)]=$73;
   $75=(($v_063)|0);
   $v_0=((HEAP32[(($75)>>2)])|0);
   $76=($v_0|0)==($3|0);
   if ($76) {
    break;
   } else {
    $v_063=$v_0;
   }
  }
 }
 $77=($computedNormal_0|0)==0;
 if (!($77)) {
  _CheckOrientation($tess);
 }
 $v_159=((HEAP32[(($41)>>2)])|0);
 $79=($v_159|0)==($3|0);
 if ($79) {
  STACKTOP=sp;return;
 }
 $80=(($tess+44)|0);
 $81=(($tess+52)|0);
 $82=(($tess+48)|0);
 $83=(($tess+56)|0);
 $84=(($tess+52)|0);
 $85=(($tess+44)|0);
 $86=(($tess+56)|0);
 $87=(($tess+48)|0);
 $first_060=1;$v_161=$v_159;
 while(1) {
  $89=($first_060|0)==0;
  $90=(($v_161+24)|0);
  $91=(+(HEAPF32[(($90)>>2)]));
  do {
   if ($89) {
    $96=(+(HEAPF32[(($80)>>2)]));
    $97=$91<$96;
    if ($97) {
     HEAPF32[(($80)>>2)]=$91;
    }
    $100=(+(HEAPF32[(($90)>>2)]));
    $101=(+(HEAPF32[(($81)>>2)]));
    $102=$100>$101;
    if ($102) {
     HEAPF32[(($81)>>2)]=$100;
    }
    $105=(($v_161+28)|0);
    $106=(+(HEAPF32[(($105)>>2)]));
    $107=(+(HEAPF32[(($82)>>2)]));
    $108=$106<$107;
    if ($108) {
     HEAPF32[(($82)>>2)]=$106;
    }
    $111=(+(HEAPF32[(($105)>>2)]));
    $112=(+(HEAPF32[(($83)>>2)]));
    $113=$111>$112;
    if (!($113)) {
     $first_1=$first_060;
     break;
    }
    HEAPF32[(($83)>>2)]=$111;
    $first_1=$first_060;
   } else {
    HEAPF32[(($84)>>2)]=$91;
    HEAPF32[(($85)>>2)]=$91;
    $93=(($v_161+28)|0);
    $94=(+(HEAPF32[(($93)>>2)]));
    HEAPF32[(($86)>>2)]=$94;
    HEAPF32[(($87)>>2)]=$94;
    $first_1=0;
   }
  } while(0);
  $116=(($v_161)|0);
  $v_1=((HEAP32[(($116)>>2)])|0);
  $117=($v_1|0)==($3|0);
  if ($117) {
   break;
  } else {
   $first_060=$first_1;$v_161=$v_1;
  }
 }
 STACKTOP=sp;return;
}
function _ComputeNormal($tess,$norm){
 $tess=($tess)|0;
 $norm=($norm)|0;
 var $maxVal=0,$maxVal82=0,$minVal=0,$minVal80=0,$d1=0,$maxVert=0,$minVert=0,$0=0,$1=0,$2=0,$3=0,$scevgep=0,$scevgep81=0,$scevgep83=0,$scevgep8384=0,$4=0,$5=0,$6=0,$7=0,$8=0;
 var $9=0,$10=0,$v_076=0,$11=0,$v_077=0,$12=0,$13=.0,$14=0,$15=.0,$16=0,$18=0,$20=0,$21=.0,$22=0,$24=0,$26=0,$27=.0,$28=0,$29=.0,$30=0;
 var $31=0,$32=.0,$33=0,$34=.0,$35=.0,$36=0,$37=.0,$38=0,$39=.0,$40=.0,$41=0,$i_2=0,$42=0,$43=.0,$44=0,$45=.0,$46=.0,$47=0,$48=.0,$49=0;
 var $50=.0,$51=.0,$52=0,$i_3=0,$53=0,$54=.0,$55=0,$56=.0,$57=0,$59=0,$60=0,$62=0,$63=0,$64=0,$65=0,$66=0,$67=.0,$68=0,$69=.0,$70=.0;
 var $71=0,$72=0,$73=.0,$74=0,$75=.0,$76=.0,$77=0,$78=0,$79=.0,$80=0,$81=.0,$82=.0,$83=0,$v_171=0,$84=0,$85=.0,$86=.0,$87=.0,$88=0,$89=0;
 var $v_173=0,$maxLen2_072=.0,$91=0,$92=.0,$93=.0,$94=.0,$95=0,$96=.0,$97=.0,$98=.0,$99=0,$100=.0,$101=.0,$102=.0,$103=.0,$104=.0,$105=.0,$106=.0,$107=.0,$108=.0;
 var $109=.0,$110=.0,$111=.0,$112=.0,$113=.0,$114=.0,$115=.0,$116=.0,$117=0,$maxLen2_1=.0,$120=0,$v_1=0,$121=0,$122=0,$123=0,$124=0,$125=0,$126=0,$129=0,$131=0;
 var $132=.0,$133=0,$135=0,$137=0,$138=.0,$139=0,$140=.0,$141=0,$143=0,$145=0,$146=.0,$147=0,$149=0,$151=0,$v_0=0,$152=0,label=0;
 var sp=0;sp=STACKTOP;STACKTOP=(STACKTOP+16)|0;
 $maxVal=((sp)|0);
 $maxVal82=$maxVal;
 $minVal=STACKTOP;STACKTOP = (STACKTOP + 12)|0;STACKTOP = (((STACKTOP)+7)&-8);
 $minVal80=$minVal;
 $d1=STACKTOP;STACKTOP = (STACKTOP + 12)|0;STACKTOP = (((STACKTOP)+7)&-8);
 $maxVert=STACKTOP;STACKTOP = (STACKTOP + 12)|0;STACKTOP = (((STACKTOP)+7)&-8);
 $minVert=STACKTOP;STACKTOP = (STACKTOP + 12)|0;STACKTOP = (((STACKTOP)+7)&-8);
 $0=(($tess)|0);
 $1=((HEAP32[(($0)>>2)])|0);
 $2=(($1)|0);
 $3=((HEAP32[(($2)>>2)])|0);
 $scevgep=(($3+12)|0);
 $scevgep81=$scevgep;
 HEAP32[(($minVal80)>>2)]=((HEAP32[(($scevgep81)>>2)])|0);HEAP32[((($minVal80)+(4))>>2)]=((HEAP32[((($scevgep81)+(4))>>2)])|0);HEAP32[((($minVal80)+(8))>>2)]=((HEAP32[((($scevgep81)+(8))>>2)])|0);
 $scevgep83=(($3+12)|0);
 $scevgep8384=$scevgep83;
 HEAP32[(($maxVal82)>>2)]=((HEAP32[(($scevgep8384)>>2)])|0);HEAP32[((($maxVal82)+(4))>>2)]=((HEAP32[((($scevgep8384)+(4))>>2)])|0);HEAP32[((($maxVal82)+(8))>>2)]=((HEAP32[((($scevgep8384)+(8))>>2)])|0);
 $4=(($minVert)|0);
 HEAP32[(($4)>>2)]=$3;
 $5=(($maxVert)|0);
 HEAP32[(($5)>>2)]=$3;
 $6=(($minVert+4)|0);
 HEAP32[(($6)>>2)]=$3;
 $7=(($maxVert+4)|0);
 HEAP32[(($7)>>2)]=$3;
 $8=(($minVert+8)|0);
 HEAP32[(($8)>>2)]=$3;
 $9=(($maxVert+8)|0);
 HEAP32[(($9)>>2)]=$3;
 $10=(($1)|0);
 $v_076=((HEAP32[(($2)>>2)])|0);
 $11=($v_076|0)==($10|0);
 if (!($11)) {
  $v_077=$v_076;
  while(1) {
   $12=(($v_077+12)|0);
   $13=(+(HEAPF32[(($12)>>2)]));
   $14=(($minVal)|0);
   $15=(+(HEAPF32[(($14)>>2)]));
   $16=$13<$15;
   if ($16) {
    HEAPF32[(($14)>>2)]=$13;
    $18=(($minVert)|0);
    HEAP32[(($18)>>2)]=$v_077;
   }
   $20=(($maxVal)|0);
   $21=(+(HEAPF32[(($20)>>2)]));
   $22=$13>$21;
   if ($22) {
    HEAPF32[(($20)>>2)]=$13;
    $24=(($maxVert)|0);
    HEAP32[(($24)>>2)]=$v_077;
   }
   $26=(($v_077+16)|0);
   $27=(+(HEAPF32[(($26)>>2)]));
   $28=(($minVal+4)|0);
   $29=(+(HEAPF32[(($28)>>2)]));
   $30=$27<$29;
   if ($30) {
    HEAPF32[(($28)>>2)]=$27;
    $129=(($minVert+4)|0);
    HEAP32[(($129)>>2)]=$v_077;
   }
   $131=(($maxVal+4)|0);
   $132=(+(HEAPF32[(($131)>>2)]));
   $133=$27>$132;
   if ($133) {
    HEAPF32[(($131)>>2)]=$27;
    $135=(($maxVert+4)|0);
    HEAP32[(($135)>>2)]=$v_077;
   }
   $137=(($v_077+20)|0);
   $138=(+(HEAPF32[(($137)>>2)]));
   $139=(($minVal+8)|0);
   $140=(+(HEAPF32[(($139)>>2)]));
   $141=$138<$140;
   if ($141) {
    HEAPF32[(($139)>>2)]=$138;
    $143=(($minVert+8)|0);
    HEAP32[(($143)>>2)]=$v_077;
   }
   $145=(($maxVal+8)|0);
   $146=(+(HEAPF32[(($145)>>2)]));
   $147=$138>$146;
   if ($147) {
    HEAPF32[(($145)>>2)]=$138;
    $149=(($maxVert+8)|0);
    HEAP32[(($149)>>2)]=$v_077;
   }
   $151=(($v_077)|0);
   $v_0=((HEAP32[(($151)>>2)])|0);
   $152=($v_0|0)==($10|0);
   if ($152) {
    break;
   } else {
    $v_077=$v_0;
   }
  }
 }
 $31=(($maxVal+4)|0);
 $32=(+(HEAPF32[(($31)>>2)]));
 $33=(($minVal+4)|0);
 $34=(+(HEAPF32[(($33)>>2)]));
 $35=($32)-($34);
 $36=(($maxVal)|0);
 $37=(+(HEAPF32[(($36)>>2)]));
 $38=(($minVal)|0);
 $39=(+(HEAPF32[(($38)>>2)]));
 $40=($37)-($39);
 $41=$35>$40;
 $i_2=($41&1);
 $42=(($maxVal+8)|0);
 $43=(+(HEAPF32[(($42)>>2)]));
 $44=(($minVal+8)|0);
 $45=(+(HEAPF32[(($44)>>2)]));
 $46=($43)-($45);
 $47=(($maxVal+($i_2<<2))|0);
 $48=(+(HEAPF32[(($47)>>2)]));
 $49=(($minVal+($i_2<<2))|0);
 $50=(+(HEAPF32[(($49)>>2)]));
 $51=($48)-($50);
 $52=$46>$51;
 $i_3=($52?2:$i_2);
 $53=(($minVal+($i_3<<2))|0);
 $54=(+(HEAPF32[(($53)>>2)]));
 $55=(($maxVal+($i_3<<2))|0);
 $56=(+(HEAPF32[(($55)>>2)]));
 $57=$54<$56;
 if (!($57)) {
  HEAPF32[(($norm)>>2)]=0.0;
  $59=(($norm+4)|0);
  HEAPF32[(($59)>>2)]=0.0;
  $60=(($norm+8)|0);
  HEAPF32[(($60)>>2)]=1.0;
  STACKTOP=sp;return;
 }
 $62=(($minVert+($i_3<<2))|0);
 $63=((HEAP32[(($62)>>2)])|0);
 $64=(($maxVert+($i_3<<2))|0);
 $65=((HEAP32[(($64)>>2)])|0);
 $66=(($63+12)|0);
 $67=(+(HEAPF32[(($66)>>2)]));
 $68=(($65+12)|0);
 $69=(+(HEAPF32[(($68)>>2)]));
 $70=($67)-($69);
 $71=(($d1)|0);
 HEAPF32[(($71)>>2)]=$70;
 $72=(($63+16)|0);
 $73=(+(HEAPF32[(($72)>>2)]));
 $74=(($65+16)|0);
 $75=(+(HEAPF32[(($74)>>2)]));
 $76=($73)-($75);
 $77=(($d1+4)|0);
 HEAPF32[(($77)>>2)]=$76;
 $78=(($63+20)|0);
 $79=(+(HEAPF32[(($78)>>2)]));
 $80=(($65+20)|0);
 $81=(+(HEAPF32[(($80)>>2)]));
 $82=($79)-($81);
 $83=(($d1+8)|0);
 HEAPF32[(($83)>>2)]=$82;
 $v_171=((HEAP32[(($2)>>2)])|0);
 $84=($v_171|0)==($10|0);
 do {
  if (!($84)) {
   $85=(+(HEAPF32[(($77)>>2)]));
   $86=(+(HEAPF32[(($83)>>2)]));
   $87=(+(HEAPF32[(($71)>>2)]));
   $88=(($norm+4)|0);
   $89=(($norm+8)|0);
   $maxLen2_072=0.0;$v_173=$v_171;
   while(1) {
    $91=(($v_173+12)|0);
    $92=(+(HEAPF32[(($91)>>2)]));
    $93=(+(HEAPF32[(($68)>>2)]));
    $94=($92)-($93);
    $95=(($v_173+16)|0);
    $96=(+(HEAPF32[(($95)>>2)]));
    $97=(+(HEAPF32[(($74)>>2)]));
    $98=($96)-($97);
    $99=(($v_173+20)|0);
    $100=(+(HEAPF32[(($99)>>2)]));
    $101=(+(HEAPF32[(($80)>>2)]));
    $102=($100)-($101);
    $103=($85)*($102);
    $104=($98)*($86);
    $105=($103)-($104);
    $106=($94)*($86);
    $107=($102)*($87);
    $108=($106)-($107);
    $109=($98)*($87);
    $110=($94)*($85);
    $111=($109)-($110);
    $112=($105)*($105);
    $113=($108)*($108);
    $114=($112)+($113);
    $115=($111)*($111);
    $116=($115)+($114);
    $117=$116>$maxLen2_072;
    if ($117) {
     HEAPF32[(($norm)>>2)]=$105;
     HEAPF32[(($88)>>2)]=$108;
     HEAPF32[(($89)>>2)]=$111;
     $maxLen2_1=$116;
    } else {
     $maxLen2_1=$maxLen2_072;
    }
    $120=(($v_173)|0);
    $v_1=((HEAP32[(($120)>>2)])|0);
    $121=($v_1|0)==($10|0);
    if ($121) {
     break;
    } else {
     $maxLen2_072=$maxLen2_1;$v_173=$v_1;
    }
   }
   $122=$maxLen2_1>(0.0);
   if (!($122)) {
    break;
   }
   STACKTOP=sp;return;
  }
 } while(0);
 $123=(($norm+8)|0);
 HEAPF32[(($123)>>2)]=0.0;
 $124=(($norm+4)|0);
 HEAPF32[(($124)>>2)]=0.0;
 HEAPF32[(($norm)>>2)]=0.0;
 $125=((_LongAxis($71))|0);
 $126=(($norm+($125<<2))|0);
 HEAPF32[(($126)>>2)]=1.0;
 STACKTOP=sp;return;
}
function _LongAxis($v){
 $v=($v)|0;
 var $1=0,$2=.0,$3=0,$5=.0,$7=.0,$8=.0,$9=0,$11=.0,$13=.0,$14=0,$i_0=0,$15=0,$16=.0,$17=0,$19=.0,$21=.0,$22=0,$23=.0,$24=0,$26=.0;
 var $28=.0,$29=0,$i_1=0,label=0;
 $1=(($v+4)|0);
 $2=(+(HEAPF32[(($1)>>2)]));
 $3=$2<(0.0);
 if ($3) {
  $5=((-.0))-($2);
  $7=$5;
 } else {
  $7=$2;
 }
 $8=(+(HEAPF32[(($v)>>2)]));
 $9=$8<(0.0);
 if ($9) {
  $11=((-.0))-($8);
  $13=$11;
 } else {
  $13=$8;
 }
 $14=$7>$13;
 $i_0=($14&1);
 $15=(($v+8)|0);
 $16=(+(HEAPF32[(($15)>>2)]));
 $17=$16<(0.0);
 if ($17) {
  $19=((-.0))-($16);
  $21=$19;
 } else {
  $21=$16;
 }
 $22=(($v+($i_0<<2))|0);
 $23=(+(HEAPF32[(($22)>>2)]));
 $24=$23<(0.0);
 if (!($24)) {
  $28=$23;
  $29=$21>$28;
  $i_1=($29?2:$i_0);
  return (($i_1)|0);
 }
 $26=((-.0))-($23);
 $28=$26;
 $29=$21>$28;
 $i_1=($29?2:$i_0);
 return (($i_1)|0);
}
function _CheckOrientation($tess){
 $tess=($tess)|0;
 var $1=0,$2=0,$3=0,$_pn_ph=0,$area_0_ph=.0,$_pn=0,$f_0_in=0,$f_0=0,$5=0,$7=0,$8=0,$9=0,$10=0,$11=0,$12=0,$area_1=.0,$e_0=0,$14=0,$15=0,$16=0;
 var $17=.0,$18=0,$19=0,$20=0,$21=0,$22=0,$23=.0,$24=.0,$25=0,$26=.0,$27=0,$28=.0,$29=.0,$30=.0,$31=.0,$32=0,$33=0,$34=0,$36=0,$37=0;
 var $39=0,$v_023=0,$40=0,$v_024=0,$41=0,$42=.0,$43=.0,$44=0,$v_0=0,$45=0,$46=0,$47=.0,$48=.0,$49=0,$50=.0,$51=.0,$52=0,$53=.0,$54=.0,label=0;
 $1=(($tess)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+44)|0);
 $area_0_ph=0.0;$_pn_ph=$3;
 L1449: while(1) {
  $_pn=$_pn_ph;
  while(1) {
   $f_0_in=(($_pn)|0);
   $f_0=((HEAP32[(($f_0_in)>>2)])|0);
   $5=($f_0|0)==($3|0);
   if ($5) {
    break L1449;
   }
   $7=(($f_0+8)|0);
   $8=((HEAP32[(($7)>>2)])|0);
   $9=(($8+28)|0);
   $10=((HEAP32[(($9)>>2)])|0);
   $11=($10|0)<1;
   if ($11) {
    $_pn=$f_0;
   } else {
    break;
   }
  }
  $12=((HEAP32[(($7)>>2)])|0);
  $e_0=$8;$area_1=$area_0_ph;
  while(1) {
   $14=(($e_0+16)|0);
   $15=((HEAP32[(($14)>>2)])|0);
   $16=(($15+24)|0);
   $17=(+(HEAPF32[(($16)>>2)]));
   $18=(($e_0+4)|0);
   $19=((HEAP32[(($18)>>2)])|0);
   $20=(($19+16)|0);
   $21=((HEAP32[(($20)>>2)])|0);
   $22=(($21+24)|0);
   $23=(+(HEAPF32[(($22)>>2)]));
   $24=($17)-($23);
   $25=(($15+28)|0);
   $26=(+(HEAPF32[(($25)>>2)]));
   $27=(($21+28)|0);
   $28=(+(HEAPF32[(($27)>>2)]));
   $29=($26)+($28);
   $30=($24)*($29);
   $31=($area_1)+($30);
   $32=(($e_0+12)|0);
   $33=((HEAP32[(($32)>>2)])|0);
   $34=($33|0)==($12|0);
   if ($34) {
    $area_0_ph=$31;$_pn_ph=$f_0;
    continue L1449;
   } else {
    $e_0=$33;$area_1=$31;
   }
  }
 }
 $36=(($2)|0);
 $37=$area_0_ph<(0.0);
 if (!($37)) {
  return;
 }
 $39=(($2)|0);
 $v_023=((HEAP32[(($39)>>2)])|0);
 $40=($v_023|0)==($36|0);
 if (!($40)) {
  $v_024=$v_023;
  while(1) {
   $41=(($v_024+28)|0);
   $42=(+(HEAPF32[(($41)>>2)]));
   $43=((-.0))-($42);
   HEAPF32[(($41)>>2)]=$43;
   $44=(($v_024)|0);
   $v_0=((HEAP32[(($44)>>2)])|0);
   $45=($v_0|0)==($36|0);
   if ($45) {
    break;
   } else {
    $v_024=$v_0;
   }
  }
 }
 $46=(($tess+32)|0);
 $47=(+(HEAPF32[(($46)>>2)]));
 $48=((-.0))-($47);
 HEAPF32[(($46)>>2)]=$48;
 $49=(($tess+36)|0);
 $50=(+(HEAPF32[(($49)>>2)]));
 $51=((-.0))-($50);
 HEAPF32[(($49)>>2)]=$51;
 $52=(($tess+40)|0);
 $53=(+(HEAPF32[(($52)>>2)]));
 $54=((-.0))-($53);
 HEAPF32[(($52)>>2)]=$54;
 return;
}
function _tessMeshTessellateMonoRegion($mesh,$face){
 $mesh=($mesh)|0;
 $face=($face)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$7=0,$8=0,$9=0,$up_0=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=.0,$17=0,$18=0,$19=0,$20=.0,$21=0;
 var $23=0,$25=0,$26=.0,$27=0,$28=.0,$29=0,$30=0,$31=0,$32=0,$33=0,$up_1=0,$34=0,$35=0,$36=0,$37=.0,$38=0,$39=0,$40=0,$41=0,$42=0;
 var $43=.0,$44=0,$46=0,$48=0,$49=.0,$50=0,$51=.0,$52=0,$53=0,$54=0,$55=0,$56=0,$57=0,$58=0,$59=0,$60=0,$61=0,$up_2_ph106=0,$lo_0_ph105=0,$62=0;
 var $63=0,$up_293=0,$65=0,$66=0,$67=0,$68=0,$69=0,$70=.0,$71=0,$72=0,$73=.0,$74=0,$76=0,$78=0,$79=.0,$80=0,$81=.0,$82=0,$83=0,$84=0;
 var $85=0,$86=0,$87=0,$88=0,$89=0,$lo_187=0,$90=0,$91=0,$92=0,$93=0,$94=0,$95=.0,$96=0,$97=0,$98=0,$99=.0,$100=0,$102=0,$104=0,$105=.0;
 var $106=0,$107=.0,$108=0,$110=0,$111=0,$112=0,$113=0,$114=0,$115=0,$116=0,$117=0,$118=0,$119=0,$120=0,$121=.0,$122=0,$123=0,$124=0,$125=0,$127=0;
 var $128=0,$129=0,$130=0,$131=0,$lo_1_lcssa=0,$132=0,$133=0,$134=0,$135=0,$136=0,$137=0,$138=0,$up_380=0,$139=0,$140=0,$141=0,$142=0,$143=0,$144=0,$145=0;
 var $146=.0,$147=0,$148=0,$149=0,$150=0,$151=0,$152=.0,$153=0,$155=0,$157=0,$158=.0,$159=0,$160=.0,$161=0,$163=0,$164=0,$165=0,$166=0,$167=0,$168=0;
 var $169=0,$170=0,$171=0,$172=0,$173=0,$174=.0,$175=0,$176=0,$177=0,$178=0,$179=0,$180=0,$182=0,$183=0,$184=0,$185=0,$up_3_lcssa=0,$186=0,$187=0,$188=0;
 var $189=0,$190=0,$lo_0_ph101=0,$up_2_lcssa=0,$191=0,$192=0,$193=0,$194=0,$195=0,$196=0,$197=0,$198=0,$200=0,$lo_276=0,$201=0,$202=0,$204=0,$205=0,$206=0,$207=0;
 var $208=0,$209=0,$210=0,$_0=0,label=0;
 $1=(($face+8)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+12)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=($4|0)==($2|0);
 if ($5) {
  ___assert_fail(((464)|0),((1256)|0),((320)|0),((1856)|0));
  return ((0)|0);
 }
 $7=(($4+12)|0);
 $8=((HEAP32[(($7)>>2)])|0);
 $9=($8|0)==($2|0);
 if ($9) {
  ___assert_fail(((464)|0),((1256)|0),((320)|0),((1856)|0));
  return ((0)|0);
 } else {
  $up_0=$2;
 }
 while(1) {
  $11=(($up_0+4)|0);
  $12=((HEAP32[(($11)>>2)])|0);
  $13=(($12+16)|0);
  $14=((HEAP32[(($13)>>2)])|0);
  $15=(($14+24)|0);
  $16=(+(HEAPF32[(($15)>>2)]));
  $17=(($up_0+16)|0);
  $18=((HEAP32[(($17)>>2)])|0);
  $19=(($18+24)|0);
  $20=(+(HEAPF32[(($19)>>2)]));
  $21=$16<$20;
  if (!($21)) {
   $23=$16==$20;
   if (!($23)) {
    $up_1=$up_0;
    break;
   }
   $25=(($14+28)|0);
   $26=(+(HEAPF32[(($25)>>2)]));
   $27=(($18+28)|0);
   $28=(+(HEAPF32[(($27)>>2)]));
   $29=$26>$28;
   if ($29) {
    $up_1=$up_0;
    break;
   }
  }
  $30=(($up_0+8)|0);
  $31=((HEAP32[(($30)>>2)])|0);
  $32=(($31+4)|0);
  $33=((HEAP32[(($32)>>2)])|0);
  $up_0=$33;
 }
 while(1) {
  $34=(($up_1+16)|0);
  $35=((HEAP32[(($34)>>2)])|0);
  $36=(($35+24)|0);
  $37=(+(HEAPF32[(($36)>>2)]));
  $38=(($up_1+4)|0);
  $39=((HEAP32[(($38)>>2)])|0);
  $40=(($39+16)|0);
  $41=((HEAP32[(($40)>>2)])|0);
  $42=(($41+24)|0);
  $43=(+(HEAPF32[(($42)>>2)]));
  $44=$37<$43;
  if (!($44)) {
   $46=$37==$43;
   if (!($46)) {
    break;
   }
   $48=(($35+28)|0);
   $49=(+(HEAPF32[(($48)>>2)]));
   $50=(($41+28)|0);
   $51=(+(HEAPF32[(($50)>>2)]));
   $52=$49>$51;
   if ($52) {
    break;
   }
  }
  $53=(($up_1+12)|0);
  $54=((HEAP32[(($53)>>2)])|0);
  $up_1=$54;
 }
 $55=(($up_1+8)|0);
 $56=((HEAP32[(($55)>>2)])|0);
 $57=(($56+4)|0);
 $58=((HEAP32[(($57)>>2)])|0);
 $59=(($up_1+12)|0);
 $60=((HEAP32[(($59)>>2)])|0);
 $61=($60|0)==($58|0);
 L1485: do {
  if ($61) {
   $up_2_lcssa=$up_1;$lo_0_ph101=$58;
  } else {
   $lo_0_ph105=$58;$up_2_ph106=$up_1;
   L1486: while(1) {
    $62=(($lo_0_ph105+16)|0);
    $63=(($lo_0_ph105+12)|0);
    $up_293=$up_2_ph106;
    while(1) {
     $65=(($up_293+4)|0);
     $66=((HEAP32[(($65)>>2)])|0);
     $67=(($66+16)|0);
     $68=((HEAP32[(($67)>>2)])|0);
     $69=(($68+24)|0);
     $70=(+(HEAPF32[(($69)>>2)]));
     $71=((HEAP32[(($62)>>2)])|0);
     $72=(($71+24)|0);
     $73=(+(HEAPF32[(($72)>>2)]));
     $74=$70<$73;
     if ($74) {
      break;
     }
     $76=$70==$73;
     if ($76) {
      $78=(($68+28)|0);
      $79=(+(HEAPF32[(($78)>>2)]));
      $80=(($71+28)|0);
      $81=(+(HEAPF32[(($80)>>2)]));
      $82=$79>$81;
      if (!($82)) {
       break;
      }
     }
     $86=((HEAP32[(($63)>>2)])|0);
     $87=($86|0)==($up_293|0);
     L1494: do {
      if ($87) {
       $up_3_lcssa=$up_293;
      } else {
       $up_380=$up_293;
       while(1) {
        $139=(($up_380+8)|0);
        $140=((HEAP32[(($139)>>2)])|0);
        $141=(($140+4)|0);
        $142=((HEAP32[(($141)>>2)])|0);
        $143=(($142+16)|0);
        $144=((HEAP32[(($143)>>2)])|0);
        $145=(($144+24)|0);
        $146=(+(HEAPF32[(($145)>>2)]));
        $147=(($142+4)|0);
        $148=((HEAP32[(($147)>>2)])|0);
        $149=(($148+16)|0);
        $150=((HEAP32[(($149)>>2)])|0);
        $151=(($150+24)|0);
        $152=(+(HEAPF32[(($151)>>2)]));
        $153=$146<$152;
        do {
         if (!($153)) {
          $155=$146==$152;
          if ($155) {
           $157=(($144+28)|0);
           $158=(+(HEAPF32[(($157)>>2)]));
           $159=(($150+28)|0);
           $160=(+(HEAPF32[(($159)>>2)]));
           $161=$158>$160;
           if (!($161)) {
            break;
           }
          }
          $163=(($up_380+4)|0);
          $164=((HEAP32[(($163)>>2)])|0);
          $165=(($164+16)|0);
          $166=((HEAP32[(($165)>>2)])|0);
          $167=(($up_380+16)|0);
          $168=((HEAP32[(($167)>>2)])|0);
          $169=((HEAP32[(($139)>>2)])|0);
          $170=(($169+4)|0);
          $171=((HEAP32[(($170)>>2)])|0);
          $172=(($171+16)|0);
          $173=((HEAP32[(($172)>>2)])|0);
          $174=(+(_tesedgeSign($166,$168,$173)));
          $175=$174<(0.0);
          if ($175) {
           $up_3_lcssa=$up_380;
           break L1494;
          }
         }
        } while(0);
        $176=((HEAP32[(($139)>>2)])|0);
        $177=(($176+4)|0);
        $178=((HEAP32[(($177)>>2)])|0);
        $179=((_tessMeshConnect($mesh,$up_380,$178))|0);
        $180=($179|0)==0;
        if ($180) {
         $_0=0;
         label = 1165;
         break L1486;
        }
        $182=(($179+4)|0);
        $183=((HEAP32[(($182)>>2)])|0);
        $184=((HEAP32[(($63)>>2)])|0);
        $185=($184|0)==($183|0);
        if ($185) {
         $up_3_lcssa=$183;
         break;
        } else {
         $up_380=$183;
        }
       }
      }
     } while(0);
     $186=(($up_3_lcssa+12)|0);
     $187=((HEAP32[(($186)>>2)])|0);
     $188=(($187+12)|0);
     $189=((HEAP32[(($188)>>2)])|0);
     $190=($189|0)==($lo_0_ph105|0);
     if ($190) {
      $up_2_lcssa=$187;$lo_0_ph101=$lo_0_ph105;
      break L1485;
     } else {
      $up_293=$187;
     }
    }
    $83=(($lo_0_ph105+12)|0);
    $84=((HEAP32[(($83)>>2)])|0);
    $85=($84|0)==($up_293|0);
    L1506: do {
     if ($85) {
      $lo_1_lcssa=$lo_0_ph105;
     } else {
      $lo_187=$lo_0_ph105;$89=$83;$88=$84;
      while(1) {
       $90=(($88+4)|0);
       $91=((HEAP32[(($90)>>2)])|0);
       $92=(($91+16)|0);
       $93=((HEAP32[(($92)>>2)])|0);
       $94=(($93+24)|0);
       $95=(+(HEAPF32[(($94)>>2)]));
       $96=(($88+16)|0);
       $97=((HEAP32[(($96)>>2)])|0);
       $98=(($97+24)|0);
       $99=(+(HEAPF32[(($98)>>2)]));
       $100=$95<$99;
       do {
        if (!($100)) {
         $102=$95==$99;
         if ($102) {
          $104=(($93+28)|0);
          $105=(+(HEAPF32[(($104)>>2)]));
          $106=(($97+28)|0);
          $107=(+(HEAPF32[(($106)>>2)]));
          $108=$105>$107;
          if (!($108)) {
           break;
          }
         }
         $110=(($lo_187+16)|0);
         $111=((HEAP32[(($110)>>2)])|0);
         $112=(($lo_187+4)|0);
         $113=((HEAP32[(($112)>>2)])|0);
         $114=(($113+16)|0);
         $115=((HEAP32[(($114)>>2)])|0);
         $116=((HEAP32[(($89)>>2)])|0);
         $117=(($116+4)|0);
         $118=((HEAP32[(($117)>>2)])|0);
         $119=(($118+16)|0);
         $120=((HEAP32[(($119)>>2)])|0);
         $121=(+(_tesedgeSign($111,$115,$120)));
         $122=$121>(0.0);
         if ($122) {
          $lo_1_lcssa=$lo_187;
          break L1506;
         }
        }
       } while(0);
       $123=((HEAP32[(($89)>>2)])|0);
       $124=((_tessMeshConnect($mesh,$123,$lo_187))|0);
       $125=($124|0)==0;
       if ($125) {
        $_0=0;
        label = 1166;
        break L1486;
       }
       $127=(($124+4)|0);
       $128=((HEAP32[(($127)>>2)])|0);
       $129=(($128+12)|0);
       $130=((HEAP32[(($129)>>2)])|0);
       $131=($130|0)==($up_293|0);
       if ($131) {
        $lo_1_lcssa=$128;
        break;
       } else {
        $lo_187=$128;$89=$129;$88=$130;
       }
      }
     }
    } while(0);
    $132=(($lo_1_lcssa+8)|0);
    $133=((HEAP32[(($132)>>2)])|0);
    $134=(($133+4)|0);
    $135=((HEAP32[(($134)>>2)])|0);
    $136=(($up_293+12)|0);
    $137=((HEAP32[(($136)>>2)])|0);
    $138=($137|0)==($135|0);
    if ($138) {
     $up_2_lcssa=$up_293;$lo_0_ph101=$135;
     break L1485;
    } else {
     $lo_0_ph105=$135;$up_2_ph106=$up_293;
    }
   }
   if ((label|0) == 1165) {
    return (($_0)|0);
   }
   else if ((label|0) == 1166) {
    return (($_0)|0);
   }
  }
 } while(0);
 $191=(($lo_0_ph101+12)|0);
 $192=((HEAP32[(($191)>>2)])|0);
 $193=($192|0)==($up_2_lcssa|0);
 if ($193) {
  ___assert_fail(((720)|0),((1256)|0),((356)|0),((1856)|0));
  return ((0)|0);
 }
 $194=(($lo_0_ph101+12)|0);
 $195=((HEAP32[(($194)>>2)])|0);
 $196=(($195+12)|0);
 $197=((HEAP32[(($196)>>2)])|0);
 $198=($197|0)==($up_2_lcssa|0);
 if ($198) {
  $_0=1;
  return (($_0)|0);
 } else {
  $lo_276=$lo_0_ph101;$200=$195;
 }
 while(1) {
  $201=((_tessMeshConnect($mesh,$200,$lo_276))|0);
  $202=($201|0)==0;
  if ($202) {
   $_0=0;
   label = 1167;
   break;
  }
  $204=(($201+4)|0);
  $205=((HEAP32[(($204)>>2)])|0);
  $206=(($205+12)|0);
  $207=((HEAP32[(($206)>>2)])|0);
  $208=(($207+12)|0);
  $209=((HEAP32[(($208)>>2)])|0);
  $210=($209|0)==($up_2_lcssa|0);
  if ($210) {
   $_0=1;
   label = 1168;
   break;
  } else {
   $lo_276=$205;$200=$207;
  }
 }
 if ((label|0) == 1167) {
  return (($_0)|0);
 }
 else if ((label|0) == 1168) {
  return (($_0)|0);
 }
  return 0;
}
function _tessMeshTessellateInterior($mesh){
 $mesh=($mesh)|0;
 var $1=0,$2=0,$3=0,$4=0,$f_07=0,$5=0,$6=0,$7=0,$8=0,$9=0,$11=0,$12=0,$13=0,$_0=0,label=0;
 $1=(($mesh+44)|0);
 $2=(($1)|0);
 $3=((HEAP32[(($2)>>2)])|0);
 $4=($3|0)==($1|0);
 if ($4) {
  $_0=1;
  return (($_0)|0);
 } else {
  $f_07=$3;
 }
 while(1) {
  $5=(($f_07)|0);
  $6=((HEAP32[(($5)>>2)])|0);
  $7=(($f_07+21)|0);
  $8=((HEAP8[($7)])|0);
  $9=(($8<<24)>>24)==0;
  if (!($9)) {
   $11=((_tessMeshTessellateMonoRegion($mesh,$f_07))|0);
   $12=($11|0)==0;
   if ($12) {
    $_0=0;
    label = 1175;
    break;
   }
  }
  $13=($6|0)==($1|0);
  if ($13) {
   $_0=1;
   label = 1177;
   break;
  } else {
   $f_07=$6;
  }
 }
 if ((label|0) == 1177) {
  return (($_0)|0);
 }
 else if ((label|0) == 1175) {
  return (($_0)|0);
 }
  return 0;
}
function _tessMeshSetWindingNumber($mesh,$value,$keepOnlyBoundary){
 $mesh=($mesh)|0;
 $value=($value)|0;
 $keepOnlyBoundary=($keepOnlyBoundary)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$e_013=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0;
 var $22=0,$23=0,$24=0,$27=0,$29=0,$30=0,$31=0,$_0=0,label=0;
 $1=(($mesh+68)|0);
 $2=(($1)|0);
 $3=((HEAP32[(($2)>>2)])|0);
 $4=($3|0)==($1|0);
 if ($4) {
  $_0=1;
  return (($_0)|0);
 }
 $5=($keepOnlyBoundary|0)==0;
 $6=(((-$value))|0);
 $e_013=$3;
 L1547: while(1) {
  $8=(($e_013)|0);
  $9=((HEAP32[(($8)>>2)])|0);
  $10=(($e_013+4)|0);
  $11=((HEAP32[(($10)>>2)])|0);
  $12=(($11+20)|0);
  $13=((HEAP32[(($12)>>2)])|0);
  $14=(($13+21)|0);
  $15=((HEAP8[($14)])|0);
  $16=(($e_013+20)|0);
  $17=((HEAP32[(($16)>>2)])|0);
  $18=(($17+21)|0);
  $19=((HEAP8[($18)])|0);
  $20=(($15<<24)>>24)==(($19<<24)>>24);
  do {
   if ($20) {
    if ($5) {
     $27=(($e_013+28)|0);
     HEAP32[(($27)>>2)]=0;
     break;
    } else {
     $29=((_tessMeshDelete($mesh,$e_013))|0);
     $30=($29|0)==0;
     if ($30) {
      $_0=0;
      label = 1189;
      break L1547;
     } else {
      break;
     }
    }
   } else {
    $22=(($19<<24)>>24)!=0;
    $23=($22?$value:$6);
    $24=(($e_013+28)|0);
    HEAP32[(($24)>>2)]=$23;
   }
  } while(0);
  $31=($9|0)==($1|0);
  if ($31) {
   $_0=1;
   label = 1187;
   break;
  } else {
   $e_013=$9;
  }
 }
 if ((label|0) == 1189) {
  return (($_0)|0);
 }
 else if ((label|0) == 1187) {
  return (($_0)|0);
 }
  return 0;
}
function _heapAlloc($userData,$size){
 $userData=($userData)|0;
 $size=($size)|0;
 var $1=0,label=0;
 $1=((_malloc($size))|0);
 return (($1)|0);
}
function _heapRealloc($userData,$ptr,$size){
 $userData=($userData)|0;
 $ptr=($ptr)|0;
 $size=($size)|0;
 var $1=0,label=0;
 $1=((_realloc($ptr,$size))|0);
 return (($1)|0);
}
function _heapFree($userData,$ptr){
 $userData=($userData)|0;
 $ptr=($ptr)|0;
 var label=0;
 _free($ptr);
 return;
}
function _tessNewTess($alloc){
 $alloc=($alloc)|0;
 var $1=0,$defaulAlloc_alloc=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$10=0,$11=0,$12=0,$13=0,$14=0,$15=0,$16=0,$19=0,$20=0,$21=0,$22=0;
 var $25=0,$26=0,$27=0,$28=0,$31=0,$32=0,$33=0,$34=0,$37=0,$38=0,$39=0,$40=0,$43=0,$44=0,$45=0,$46=0,$47=0,$48=0,$49=0,$50=0;
 var $51=0,$53=0,$56=0,$57=0,$58=0,$59=0,$60=0,$61=0,$62=0,$63=0,$_0=0,label=0;
 $1=($alloc|0)==0;
 $defaulAlloc_alloc=($1?8:$alloc);
 $2=(($defaulAlloc_alloc)|0);
 $3=((HEAP32[(($2)>>2)])|0);
 $4=(($defaulAlloc_alloc+12)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 $6=((FUNCTION_TABLE_iii[($3)&7]($5,300))|0);
 $7=$6;
 $8=($6|0)==0;
 if ($8) {
  $_0=0;
  return (($_0)|0);
 }
 $10=(($6+104)|0);
 $11=$10;
 $12=$defaulAlloc_alloc;
 (_memcpy((($10)|0), (($12)|0), 40)|0);
 $13=(($6+120)|0);
 $14=$13;
 $15=((HEAP32[(($14)>>2)])|0);
 $16=($15|0)==0;
 if ($16) {
  HEAP32[(($14)>>2)]=512;
 }
 $19=(($6+124)|0);
 $20=$19;
 $21=((HEAP32[(($20)>>2)])|0);
 $22=($21|0)==0;
 if ($22) {
  HEAP32[(($20)>>2)]=512;
 }
 $25=(($6+128)|0);
 $26=$25;
 $27=((HEAP32[(($26)>>2)])|0);
 $28=($27|0)==0;
 if ($28) {
  HEAP32[(($26)>>2)]=256;
 }
 $31=(($6+132)|0);
 $32=$31;
 $33=((HEAP32[(($32)>>2)])|0);
 $34=($33|0)==0;
 if ($34) {
  HEAP32[(($32)>>2)]=512;
 }
 $37=(($6+136)|0);
 $38=$37;
 $39=((HEAP32[(($38)>>2)])|0);
 $40=($39|0)==0;
 if ($40) {
  HEAP32[(($38)>>2)]=256;
 }
 $43=(($6+8)|0);
 $44=$43;
 HEAPF32[(($44)>>2)]=0.0;
 $45=(($6+12)|0);
 $46=$45;
 HEAPF32[(($46)>>2)]=0.0;
 $47=(($6+16)|0);
 $48=$47;
 HEAPF32[(($48)>>2)]=0.0;
 $49=(($6+44)|0);
 _memset((((($49)|0))|0), ((((0)|0))|0), ((((20)|0))|0));
 $50=((HEAP32[(($38)>>2)])|0);
 $51=($50|0)<16;
 do {
  if ($51) {
   HEAP32[(($38)>>2)]=16;
  } else {
   $53=($50|0)>4096;
   if (!($53)) {
    break;
   }
   HEAP32[(($38)>>2)]=4096;
  }
 } while(0);
 $56=((HEAP32[(($38)>>2)])|0);
 $57=((_createBucketAlloc($11,640,28,$56))|0);
 $58=(($6+76)|0);
 $59=$58;
 HEAP32[(($59)>>2)]=$57;
 $60=$6;
 HEAP32[(($60)>>2)]=0;
 $61=(($6+4)|0);
 $62=$61;
 HEAP32[(($62)>>2)]=0;
 $63=(($6+80)|0);
 _memset((((($63)|0))|0), ((((0)|0))|0), ((((24)|0))|0));
 $_0=$7;
 return (($_0)|0);
}
function _tessDeleteTess($tess){
 $tess=($tess)|0;
 var $alloc=0,$1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$11=0,$12=0,$13=0,$15=0,$16=0,$17=0,$18=0,$19=0,$21=0,$22=0,$23=0;
 var $25=0,$26=0,$27=0,$28=0,$29=0,$31=0,$32=0,$33=0,$35=0,$36=0,$37=0,$38=0,$39=0,$41=0,$42=0,$43=0,$44=0,$45=0,label=0;
 var sp=0;sp=STACKTOP;STACKTOP=(STACKTOP+40)|0;
 $alloc=((sp)|0);
 $1=(($tess+104)|0);
 $2=$alloc;
 $3=$1;
 (_memcpy((($2)|0), (($3)|0), 40)|0);
 $4=(($tess+76)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 _deleteBucketAlloc($5);
 $6=(($tess)|0);
 $7=((HEAP32[(($6)>>2)])|0);
 $8=($7|0)==0;
 if (!($8)) {
  _tessMeshDeleteMesh($alloc,$7);
  HEAP32[(($6)>>2)]=0;
 }
 $11=(($tess+84)|0);
 $12=((HEAP32[(($11)>>2)])|0);
 $13=($12|0)==0;
 if (!($13)) {
  $15=(($alloc+8)|0);
  $16=((HEAP32[(($15)>>2)])|0);
  $17=(($alloc+12)|0);
  $18=((HEAP32[(($17)>>2)])|0);
  $19=$12;
  FUNCTION_TABLE_vii[($16)&7]($18,$19);
  HEAP32[(($11)>>2)]=0;
 }
 $21=(($tess+88)|0);
 $22=((HEAP32[(($21)>>2)])|0);
 $23=($22|0)==0;
 if (!($23)) {
  $25=(($alloc+8)|0);
  $26=((HEAP32[(($25)>>2)])|0);
  $27=(($alloc+12)|0);
  $28=((HEAP32[(($27)>>2)])|0);
  $29=$22;
  FUNCTION_TABLE_vii[($26)&7]($28,$29);
  HEAP32[(($21)>>2)]=0;
 }
 $31=(($tess+96)|0);
 $32=((HEAP32[(($31)>>2)])|0);
 $33=($32|0)==0;
 if ($33) {
  $41=(($alloc+8)|0);
  $42=((HEAP32[(($41)>>2)])|0);
  $43=(($alloc+12)|0);
  $44=((HEAP32[(($43)>>2)])|0);
  $45=$tess;
  FUNCTION_TABLE_vii[($42)&7]($44,$45);
  STACKTOP=sp;return;
 }
 $35=(($alloc+8)|0);
 $36=((HEAP32[(($35)>>2)])|0);
 $37=(($alloc+12)|0);
 $38=((HEAP32[(($37)>>2)])|0);
 $39=$32;
 FUNCTION_TABLE_vii[($36)&7]($38,$39);
 HEAP32[(($31)>>2)]=0;
 $41=(($alloc+8)|0);
 $42=((HEAP32[(($41)>>2)])|0);
 $43=(($alloc+12)|0);
 $44=((HEAP32[(($43)>>2)])|0);
 $45=$tess;
 FUNCTION_TABLE_vii[($42)&7]($44,$45);
 STACKTOP=sp;return;
}
function _OutputPolymesh($tess,$mesh,$elementType,$polySize,$vertexSize){
 $tess=($tess)|0;
 $mesh=($mesh)|0;
 $elementType=($elementType)|0;
 $polySize=($polySize)|0;
 $vertexSize=($vertexSize)|0;
 var $1=0,$3=0,$4=0,$6=0,$8=0,$9=0,$v_0129=0,$10=0,$v_0130=0,$11=0,$12=0,$v_0=0,$13=0,$14=0,$15=0,$f_0120=0,$16=0,$f_0123=0,$maxVertexCount_0122=0,$maxFaceCount_0121=0;
 var $17=0,$18=0,$19=0,$20=0,$22=0,$23=0,$edge_0=0,$maxVertexCount_1=0,$faceVerts_0=0,$25=0,$26=0,$27=0,$28=0,$29=0,$31=0,$maxVertexCount_2=0,$33=0,$34=0,$35=0,$36=0;
 var $37=0,$39=0,$42=0,$maxFaceCount_1=0,$maxVertexCount_3=0,$44=0,$f_0=0,$45=0,$maxVertexCount_0_lcssa=0,$maxFaceCount_0_lcssa=0,$46=0,$47=0,$48=0,$_maxFaceCount_0=0,$49=0,$50=0,$51=0,$52=0,$53=0,$54=0;
 var $55=0,$56=0,$57=0,$58=0,$60=0,$62=0,$63=0,$64=0,$65=0,$66=0,$67=0,$68=0,$69=0,$70=0,$72=0,$74=0,$75=0,$76=0,$77=0,$78=0;
 var $79=0,$80=0,$81=0,$v_1112=0,$82=0,$83=0,$85=0,$v_1113=0,$87=0,$88=0,$89=0,$91=0,$92=0,$93=0,$94=0,$95=.0,$96=0,$97=.0,$_sum=0,$98=0;
 var $100=0,$101=.0,$_sum95=0,$102=0,$104=0,$105=0,$106=0,$107=0,$108=0,$110=0,$v_1=0,$111=0,$f_1107=0,$112=0,$113=0,$f_1109=0,$elements_0108=0,$115=0,$116=0,$117=0;
 var $119=0,$120=0,$edge_1=0,$faceVerts_1=0,$elements_1=0,$122=0,$123=0,$124=0,$125=0,$126=0,$127=0,$128=0,$129=0,$130=0,$131=0,$132=0,$_lcssa137=0,$133=0,$134=0,$135=0;
 var $_sum145=0,$scevgep_sum=0,$scevgep136=0,$elements_2_lcssa=0,$138=0,$edge_2=0,$elements_3=0,$140=0,$141=0,$142=0,$143=0,$144=0,$145=0,$146=0,$_lcssa138142=0,$147=0,$148=0,$149=0,$_sum144=0,$scevgep140_sum=0;
 var $scevgep141=0,$elements_5=0,$150=0,$f_1=0,$151=0,label=0;
 $1=($polySize|0)>3;
 do {
  if ($1) {
   $3=((_tessMeshMergeConvexFaces($mesh,$polySize))|0);
   $4=($3|0)==0;
   if (!($4)) {
    break;
   }
   $6=(($tess+4)|0);
   HEAP32[(($6)>>2)]=1;
   return;
  }
 } while(0);
 $8=(($mesh)|0);
 $9=(($mesh)|0);
 $v_0129=((HEAP32[(($9)>>2)])|0);
 $10=($v_0129|0)==($8|0);
 if (!($10)) {
  $v_0130=$v_0129;
  while(1) {
   $11=(($v_0130+36)|0);
   HEAP32[(($11)>>2)]=-1;
   $12=(($v_0130)|0);
   $v_0=((HEAP32[(($12)>>2)])|0);
   $13=($v_0|0)==($8|0);
   if ($13) {
    break;
   } else {
    $v_0130=$v_0;
   }
  }
 }
 $14=(($mesh+44)|0);
 $15=(($14)|0);
 $f_0120=((HEAP32[(($15)>>2)])|0);
 $16=($f_0120|0)==($14|0);
 L1611: do {
  if ($16) {
   $maxFaceCount_0_lcssa=0;$maxVertexCount_0_lcssa=0;
  } else {
   $maxFaceCount_0121=0;$maxVertexCount_0122=0;$f_0123=$f_0120;
   while(1) {
    $17=(($f_0123+16)|0);
    HEAP32[(($17)>>2)]=-1;
    $18=(($f_0123+21)|0);
    $19=((HEAP8[($18)])|0);
    $20=(($19<<24)>>24)==0;
    if ($20) {
     $maxVertexCount_3=$maxVertexCount_0122;$maxFaceCount_1=$maxFaceCount_0121;
    } else {
     $22=(($f_0123+8)|0);
     $23=((HEAP32[(($22)>>2)])|0);
     $faceVerts_0=0;$maxVertexCount_1=$maxVertexCount_0122;$edge_0=$23;
     while(1) {
      $25=(($edge_0+16)|0);
      $26=((HEAP32[(($25)>>2)])|0);
      $27=(($26+36)|0);
      $28=((HEAP32[(($27)>>2)])|0);
      $29=($28|0)==-1;
      if ($29) {
       HEAP32[(($27)>>2)]=$maxVertexCount_1;
       $31=((($maxVertexCount_1)+(1))|0);
       $maxVertexCount_2=$31;
      } else {
       $maxVertexCount_2=$maxVertexCount_1;
      }
      $33=((($faceVerts_0)+(1))|0);
      $34=(($edge_0+12)|0);
      $35=((HEAP32[(($34)>>2)])|0);
      $36=((HEAP32[(($22)>>2)])|0);
      $37=($35|0)==($36|0);
      if ($37) {
       break;
      } else {
       $faceVerts_0=$33;$maxVertexCount_1=$maxVertexCount_2;$edge_0=$35;
      }
     }
     $39=($33|0)>($polySize|0);
     if ($39) {
      break;
     }
     HEAP32[(($17)>>2)]=$maxFaceCount_0121;
     $42=((($maxFaceCount_0121)+(1))|0);
     $maxVertexCount_3=$maxVertexCount_2;$maxFaceCount_1=$42;
    }
    $44=(($f_0123)|0);
    $f_0=((HEAP32[(($44)>>2)])|0);
    $45=($f_0|0)==($14|0);
    if ($45) {
     $maxFaceCount_0_lcssa=$maxFaceCount_1;$maxVertexCount_0_lcssa=$maxVertexCount_3;
     break L1611;
    } else {
     $maxFaceCount_0121=$maxFaceCount_1;$maxVertexCount_0122=$maxVertexCount_3;$f_0123=$f_0;
    }
   }
   ___assert_fail(((512)|0),((1256)|0),((613)|0),((2064)|0));
  }
 } while(0);
 $46=(($tess+100)|0);
 HEAP32[(($46)>>2)]=$maxFaceCount_0_lcssa;
 $47=($elementType|0)==1;
 $48=($47&1);
 $_maxFaceCount_0=$maxFaceCount_0_lcssa<<$48;
 $49=(($tess+104)|0);
 $50=((HEAP32[(($49)>>2)])|0);
 $51=(($tess+116)|0);
 $52=((HEAP32[(($51)>>2)])|0);
 $53=$polySize<<2;
 $54=(Math_imul($53,$_maxFaceCount_0)|0);
 $55=((FUNCTION_TABLE_iii[($50)&7]($52,$54))|0);
 $56=$55;
 $57=(($tess+96)|0);
 HEAP32[(($57)>>2)]=$56;
 $58=($55|0)==0;
 if ($58) {
  $60=(($tess+4)|0);
  HEAP32[(($60)>>2)]=1;
  return;
 }
 $62=(($tess+92)|0);
 HEAP32[(($62)>>2)]=$maxVertexCount_0_lcssa;
 $63=((HEAP32[(($49)>>2)])|0);
 $64=((HEAP32[(($51)>>2)])|0);
 $65=$vertexSize<<2;
 $66=(Math_imul($65,$maxVertexCount_0_lcssa)|0);
 $67=((FUNCTION_TABLE_iii[($63)&7]($64,$66))|0);
 $68=$67;
 $69=(($tess+84)|0);
 HEAP32[(($69)>>2)]=$68;
 $70=($67|0)==0;
 if ($70) {
  $72=(($tess+4)|0);
  HEAP32[(($72)>>2)]=1;
  return;
 }
 $74=((HEAP32[(($49)>>2)])|0);
 $75=((HEAP32[(($51)>>2)])|0);
 $76=((HEAP32[(($62)>>2)])|0);
 $77=$76<<2;
 $78=((FUNCTION_TABLE_iii[($74)&7]($75,$77))|0);
 $79=$78;
 $80=(($tess+88)|0);
 HEAP32[(($80)>>2)]=$79;
 $81=($78|0)==0;
 if ($81) {
  $85=(($tess+4)|0);
  HEAP32[(($85)>>2)]=1;
  return;
 }
 $v_1112=((HEAP32[(($9)>>2)])|0);
 $82=($v_1112|0)==($8|0);
 if (!($82)) {
  $83=($vertexSize|0)>2;
  $v_1113=$v_1112;
  while(1) {
   $87=(($v_1113+36)|0);
   $88=((HEAP32[(($87)>>2)])|0);
   $89=($88|0)==-1;
   if (!($89)) {
    $91=(Math_imul($88,$vertexSize)|0);
    $92=((HEAP32[(($69)>>2)])|0);
    $93=(($92+($91<<2))|0);
    $94=(($v_1113+12)|0);
    $95=(+(HEAPF32[(($94)>>2)]));
    HEAPF32[(($93)>>2)]=$95;
    $96=(($v_1113+16)|0);
    $97=(+(HEAPF32[(($96)>>2)]));
    $_sum=((($91)+(1))|0);
    $98=(($92+($_sum<<2))|0);
    HEAPF32[(($98)>>2)]=$97;
    if ($83) {
     $100=(($v_1113+20)|0);
     $101=(+(HEAPF32[(($100)>>2)]));
     $_sum95=((($91)+(2))|0);
     $102=(($92+($_sum95<<2))|0);
     HEAPF32[(($102)>>2)]=$101;
    }
    $104=(($v_1113+40)|0);
    $105=((HEAP32[(($104)>>2)])|0);
    $106=((HEAP32[(($87)>>2)])|0);
    $107=((HEAP32[(($80)>>2)])|0);
    $108=(($107+($106<<2))|0);
    HEAP32[(($108)>>2)]=$105;
   }
   $110=(($v_1113)|0);
   $v_1=((HEAP32[(($110)>>2)])|0);
   $111=($v_1|0)==($8|0);
   if ($111) {
    break;
   } else {
    $v_1113=$v_1;
   }
  }
 }
 $f_1107=((HEAP32[(($15)>>2)])|0);
 $112=($f_1107|0)==($14|0);
 if ($112) {
  return;
 }
 $113=((HEAP32[(($57)>>2)])|0);
 $elements_0108=$113;$f_1109=$f_1107;
 while(1) {
  $115=(($f_1109+21)|0);
  $116=((HEAP8[($115)])|0);
  $117=(($116<<24)>>24)==0;
  do {
   if ($117) {
    $elements_5=$elements_0108;
   } else {
    $119=(($f_1109+8)|0);
    $120=((HEAP32[(($119)>>2)])|0);
    $elements_1=$elements_0108;$faceVerts_1=0;$edge_1=$120;
    while(1) {
     $122=(($edge_1+16)|0);
     $123=((HEAP32[(($122)>>2)])|0);
     $124=(($123+36)|0);
     $125=((HEAP32[(($124)>>2)])|0);
     $126=(($elements_1+4)|0);
     HEAP32[(($elements_1)>>2)]=$125;
     $127=((($faceVerts_1)+(1))|0);
     $128=(($edge_1+12)|0);
     $129=((HEAP32[(($128)>>2)])|0);
     $130=((HEAP32[(($119)>>2)])|0);
     $131=($129|0)==($130|0);
     if ($131) {
      break;
     } else {
      $elements_1=$126;$faceVerts_1=$127;$edge_1=$129;
     }
    }
    $132=($127|0)<($polySize|0);
    if ($132) {
     $_lcssa137=$126;
     $133=((($polySize)-($127))|0);
     $134=$133<<2;
     _memset((((($_lcssa137)|0))|0), ((((-1)|0))|0), (((($134)|0))|0));
     $135=$faceVerts_1^-1;
     $_sum145=((($polySize)+(1))|0);
     $scevgep_sum=((($_sum145)+($135))|0);
     $scevgep136=(($elements_1+($scevgep_sum<<2))|0);
     $elements_2_lcssa=$scevgep136;
    } else {
     $elements_2_lcssa=$126;
    }
    if (!($47)) {
     $elements_5=$elements_2_lcssa;
     break;
    }
    $138=((HEAP32[(($119)>>2)])|0);
    $elements_3=$elements_2_lcssa;$edge_2=$138;
    while(1) {
     $140=((_GetNeighbourFace($edge_2))|0);
     $141=(($elements_3+4)|0);
     HEAP32[(($elements_3)>>2)]=$140;
     $142=(($edge_2+12)|0);
     $143=((HEAP32[(($142)>>2)])|0);
     $144=((HEAP32[(($119)>>2)])|0);
     $145=($143|0)==($144|0);
     if ($145) {
      break;
     } else {
      $elements_3=$141;$edge_2=$143;
     }
    }
    $146=($127|0)<($polySize|0);
    if (!($146)) {
     $elements_5=$141;
     break;
    }
    $_lcssa138142=$141;
    $147=((($polySize)-($127))|0);
    $148=$147<<2;
    _memset((((($_lcssa138142)|0))|0), ((((-1)|0))|0), (((($148)|0))|0));
    $149=$faceVerts_1^-1;
    $_sum144=((($polySize)+(1))|0);
    $scevgep140_sum=((($_sum144)+($149))|0);
    $scevgep141=(($elements_3+($scevgep140_sum<<2))|0);
    $elements_5=$scevgep141;
   }
  } while(0);
  $150=(($f_1109)|0);
  $f_1=((HEAP32[(($150)>>2)])|0);
  $151=($f_1|0)==($14|0);
  if ($151) {
   break;
  } else {
   $elements_0108=$elements_5;$f_1109=$f_1;
  }
 }
 return;
}
function _GetNeighbourFace($edge){
 $edge=($edge)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$7=0,$8=0,$9=0,$11=0,$12=0,$_0=0,label=0;
 $1=(($edge+4)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=(($2+20)|0);
 $4=((HEAP32[(($3)>>2)])|0);
 $5=($4|0)==0;
 if ($5) {
  $_0=-1;
  return (($_0)|0);
 }
 $7=(($4+21)|0);
 $8=((HEAP8[($7)])|0);
 $9=(($8<<24)>>24)==0;
 if ($9) {
  $_0=-1;
  return (($_0)|0);
 }
 $11=(($4+16)|0);
 $12=((HEAP32[(($11)>>2)])|0);
 $_0=$12;
 return (($_0)|0);
}
function _OutputContours($tess,$mesh,$vertexSize){
 $tess=($tess)|0;
 $mesh=($mesh)|0;
 $vertexSize=($vertexSize)|0;
 var $1=0,$2=0,$3=0,$4=0,$f_057=0,$5=0,$f_058=0,$6=0,$7=0,$8=0,$10=0,$11=0,$edge_0=0,$13=0,$14=0,$15=0,$16=0,$17=0,$19=0,$20=0;
 var $22=0,$f_0=0,$23=0,$24=0,$25=0,$26=0,$27=0,$28=0,$29=0,$30=0,$31=0,$32=0,$33=0,$35=0,$37=0,$38=0,$39=0,$40=0,$41=0,$42=0;
 var $43=0,$44=0,$45=0,$47=0,$49=0,$50=0,$51=0,$52=0,$53=0,$54=0,$55=0,$56=0,$58=0,$f_151=0,$60=0,$61=0,$62=0,$63=0,$f_156=0,$startVert_055=0;
 var $vertInds_054=0,$elements_053=0,$verts_052=0,$65=0,$66=0,$67=0,$69=0,$70=0,$edge_1=0,$verts_1=0,$vertInds_1=0,$vertCount_0=0,$72=0,$73=0,$74=0,$75=.0,$76=0,$77=0,$78=0,$79=.0;
 var $80=0,$82=0,$83=0,$84=.0,$85=0,$verts_2=0,$87=0,$88=0,$89=0,$90=0,$91=0,$92=0,$93=0,$94=0,$96=0,$97=0,$98=0,$verts_3=0,$elements_1=0,$vertInds_2=0;
 var $startVert_1=0,$100=0,$f_1=0,$101=0,label=0;
 $1=(($tess+92)|0);
 HEAP32[(($1)>>2)]=0;
 $2=(($tess+100)|0);
 HEAP32[(($2)>>2)]=0;
 $3=(($mesh+44)|0);
 $4=(($3)|0);
 $f_057=((HEAP32[(($4)>>2)])|0);
 $5=($f_057|0)==($3|0);
 if (!($5)) {
  $f_058=$f_057;
  while(1) {
   $6=(($f_058+21)|0);
   $7=((HEAP8[($6)])|0);
   $8=(($7<<24)>>24)==0;
   if (!($8)) {
    $10=(($f_058+8)|0);
    $11=((HEAP32[(($10)>>2)])|0);
    $edge_0=$11;
    while(1) {
     $13=((HEAP32[(($1)>>2)])|0);
     $14=((($13)+(1))|0);
     HEAP32[(($1)>>2)]=$14;
     $15=(($edge_0+12)|0);
     $16=((HEAP32[(($15)>>2)])|0);
     $17=($16|0)==($11|0);
     if ($17) {
      break;
     } else {
      $edge_0=$16;
     }
    }
    $19=((HEAP32[(($2)>>2)])|0);
    $20=((($19)+(1))|0);
    HEAP32[(($2)>>2)]=$20;
   }
   $22=(($f_058)|0);
   $f_0=((HEAP32[(($22)>>2)])|0);
   $23=($f_0|0)==($3|0);
   if ($23) {
    break;
   } else {
    $f_058=$f_0;
   }
  }
 }
 $24=(($tess+104)|0);
 $25=((HEAP32[(($24)>>2)])|0);
 $26=(($tess+116)|0);
 $27=((HEAP32[(($26)>>2)])|0);
 $28=((HEAP32[(($2)>>2)])|0);
 $29=$28<<3;
 $30=((FUNCTION_TABLE_iii[($25)&7]($27,$29))|0);
 $31=$30;
 $32=(($tess+96)|0);
 HEAP32[(($32)>>2)]=$31;
 $33=($30|0)==0;
 if ($33) {
  $35=(($tess+4)|0);
  HEAP32[(($35)>>2)]=1;
  return;
 }
 $37=((HEAP32[(($24)>>2)])|0);
 $38=((HEAP32[(($26)>>2)])|0);
 $39=((HEAP32[(($1)>>2)])|0);
 $40=$vertexSize<<2;
 $41=(Math_imul($40,$39)|0);
 $42=((FUNCTION_TABLE_iii[($37)&7]($38,$41))|0);
 $43=$42;
 $44=(($tess+84)|0);
 HEAP32[(($44)>>2)]=$43;
 $45=($42|0)==0;
 if ($45) {
  $47=(($tess+4)|0);
  HEAP32[(($47)>>2)]=1;
  return;
 }
 $49=((HEAP32[(($24)>>2)])|0);
 $50=((HEAP32[(($26)>>2)])|0);
 $51=((HEAP32[(($1)>>2)])|0);
 $52=$51<<2;
 $53=((FUNCTION_TABLE_iii[($49)&7]($50,$52))|0);
 $54=$53;
 $55=(($tess+88)|0);
 HEAP32[(($55)>>2)]=$54;
 $56=($53|0)==0;
 if ($56) {
  $58=(($tess+4)|0);
  HEAP32[(($58)>>2)]=1;
  return;
 }
 $f_151=((HEAP32[(($4)>>2)])|0);
 $60=($f_151|0)==($3|0);
 if ($60) {
  return;
 }
 $61=((HEAP32[(($32)>>2)])|0);
 $62=((HEAP32[(($44)>>2)])|0);
 $63=($vertexSize|0)>2;
 $verts_052=$62;$elements_053=$61;$vertInds_054=$54;$startVert_055=0;$f_156=$f_151;
 while(1) {
  $65=(($f_156+21)|0);
  $66=((HEAP8[($65)])|0);
  $67=(($66<<24)>>24)==0;
  if ($67) {
   $startVert_1=$startVert_055;$vertInds_2=$vertInds_054;$elements_1=$elements_053;$verts_3=$verts_052;
  } else {
   $69=(($f_156+8)|0);
   $70=((HEAP32[(($69)>>2)])|0);
   $vertCount_0=0;$vertInds_1=$vertInds_054;$verts_1=$verts_052;$edge_1=$70;
   while(1) {
    $72=(($edge_1+16)|0);
    $73=((HEAP32[(($72)>>2)])|0);
    $74=(($73+12)|0);
    $75=(+(HEAPF32[(($74)>>2)]));
    $76=(($verts_1+4)|0);
    HEAPF32[(($verts_1)>>2)]=$75;
    $77=((HEAP32[(($72)>>2)])|0);
    $78=(($77+16)|0);
    $79=(+(HEAPF32[(($78)>>2)]));
    $80=(($verts_1+8)|0);
    HEAPF32[(($76)>>2)]=$79;
    if ($63) {
     $82=((HEAP32[(($72)>>2)])|0);
     $83=(($82+20)|0);
     $84=(+(HEAPF32[(($83)>>2)]));
     $85=(($verts_1+12)|0);
     HEAPF32[(($80)>>2)]=$84;
     $verts_2=$85;
    } else {
     $verts_2=$80;
    }
    $87=((HEAP32[(($72)>>2)])|0);
    $88=(($87+40)|0);
    $89=((HEAP32[(($88)>>2)])|0);
    $90=(($vertInds_1+4)|0);
    HEAP32[(($vertInds_1)>>2)]=$89;
    $91=((($vertCount_0)+(1))|0);
    $92=(($edge_1+12)|0);
    $93=((HEAP32[(($92)>>2)])|0);
    $94=($93|0)==($70|0);
    if ($94) {
     break;
    } else {
     $vertCount_0=$91;$vertInds_1=$90;$verts_1=$verts_2;$edge_1=$93;
    }
   }
   HEAP32[(($elements_053)>>2)]=$startVert_055;
   $96=(($elements_053+4)|0);
   HEAP32[(($96)>>2)]=$91;
   $97=(($elements_053+8)|0);
   $98=((($91)+($startVert_055))|0);
   $startVert_1=$98;$vertInds_2=$90;$elements_1=$97;$verts_3=$verts_2;
  }
  $100=(($f_156)|0);
  $f_1=((HEAP32[(($100)>>2)])|0);
  $101=($f_1|0)==($3|0);
  if ($101) {
   break;
  } else {
   $verts_052=$verts_3;$elements_053=$elements_1;$vertInds_054=$vertInds_2;$startVert_055=$startVert_1;$f_156=$f_1;
  }
 }
 return;
}
function _tessAddContour($tess,$size,$vertices,$stride,$numVertices){
 $tess=($tess)|0;
 $size=($size)|0;
 $vertices=($vertices)|0;
 $stride=($stride)|0;
 $numVertices=($numVertices)|0;
 var $1=0,$2=0,$3=0,$5=0,$6=0,$7=0,$8=0,$9=0,$10=0,$12=0,$i_034=0,$e_033=0,$src_032=0,$14=0,$15=0,$16=0,$17=0,$19=0,$20=0,$22=0;
 var $24=0,$25=0,$26=0,$27=0,$28=0,$30=0,$32=0,$33=0,$35=0,$37=0,$38=0,$e_1=0,$40=.0,$41=0,$42=0,$43=0,$44=0,$45=0,$46=.0,$47=0;
 var $48=0,$50=0,$51=0,$52=.0,$53=0,$54=0,$56=0,$57=0,$58=0,$59=0,$60=0,$61=0,$62=0,$63=0,$64=0,$65=0,$66=0,$67=0,label=0;
 $1=(($tess)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=($2|0)==0;
 do {
  if ($3) {
   $5=(($tess+104)|0);
   $6=((_tessMeshNewMesh($5))|0);
   HEAP32[(($1)>>2)]=$6;
   $7=($6|0)==0;
   if (!($7)) {
    break;
   }
   $12=(($tess+4)|0);
   HEAP32[(($12)>>2)]=1;
   return;
  }
 } while(0);
 $8=($numVertices|0)>0;
 if (!($8)) {
  return;
 }
 $9=($size|0)>2;
 $10=(($tess+80)|0);
 $src_032=$vertices;$e_033=0;$i_034=0;
 while(1) {
  $14=$src_032;
  $15=(($src_032+$stride)|0);
  $16=($e_033|0)==0;
  $17=((HEAP32[(($1)>>2)])|0);
  if ($16) {
   $19=((_tessMeshMakeEdge($17))|0);
   $20=($19|0)==0;
   if ($20) {
    label = 1312;
    break;
   }
   $24=((HEAP32[(($1)>>2)])|0);
   $25=(($19+4)|0);
   $26=((HEAP32[(($25)>>2)])|0);
   $27=((_tessMeshSplice($24,$19,$26))|0);
   $28=($27|0)==0;
   if ($28) {
    label = 1314;
    break;
   } else {
    $e_1=$19;
   }
  } else {
   $32=((_tessMeshSplitEdge($17,$e_033))|0);
   $33=($32|0)==0;
   if ($33) {
    label = 1316;
    break;
   }
   $37=(($e_033+12)|0);
   $38=((HEAP32[(($37)>>2)])|0);
   $e_1=$38;
  }
  $40=(+(HEAPF32[(($14)>>2)]));
  $41=(($e_1+16)|0);
  $42=((HEAP32[(($41)>>2)])|0);
  $43=(($42+12)|0);
  HEAPF32[(($43)>>2)]=$40;
  $44=(($src_032+4)|0);
  $45=$44;
  $46=(+(HEAPF32[(($45)>>2)]));
  $47=((HEAP32[(($41)>>2)])|0);
  $48=(($47+16)|0);
  HEAPF32[(($48)>>2)]=$46;
  if ($9) {
   $50=(($src_032+8)|0);
   $51=$50;
   $52=(+(HEAPF32[(($51)>>2)]));
   $53=((HEAP32[(($41)>>2)])|0);
   $54=(($53+20)|0);
   HEAPF32[(($54)>>2)]=$52;
  } else {
   $56=((HEAP32[(($41)>>2)])|0);
   $57=(($56+20)|0);
   HEAPF32[(($57)>>2)]=0.0;
  }
  $58=((HEAP32[(($10)>>2)])|0);
  $59=((($58)+(1))|0);
  HEAP32[(($10)>>2)]=$59;
  $60=((HEAP32[(($41)>>2)])|0);
  $61=(($60+40)|0);
  HEAP32[(($61)>>2)]=$58;
  $62=(($e_1+28)|0);
  HEAP32[(($62)>>2)]=1;
  $63=(($e_1+4)|0);
  $64=((HEAP32[(($63)>>2)])|0);
  $65=(($64+28)|0);
  HEAP32[(($65)>>2)]=-1;
  $66=((($i_034)+(1))|0);
  $67=($66|0)<($numVertices|0);
  if ($67) {
   $src_032=$15;$e_033=$e_1;$i_034=$66;
  } else {
   label = 1325;
   break;
  }
 }
 if ((label|0) == 1312) {
  $22=(($tess+4)|0);
  HEAP32[(($22)>>2)]=1;
  return;
 }
 else if ((label|0) == 1325) {
  return;
 }
 else if ((label|0) == 1316) {
  $35=(($tess+4)|0);
  HEAP32[(($35)>>2)]=1;
  return;
 }
 else if ((label|0) == 1314) {
  $30=(($tess+4)|0);
  HEAP32[(($30)>>2)]=1;
  return;
 }
}
function _tessTesselate($tess,$windingRule,$elementType,$polySize,$vertexSize,$normal){
 $tess=($tess)|0;
 $windingRule=($windingRule)|0;
 $elementType=($elementType)|0;
 $polySize=($polySize)|0;
 $vertexSize=($vertexSize)|0;
 $normal=($normal)|0;
 var $1=0,$2=0,$3=0,$5=0,$6=0,$7=0,$8=0,$9=0,$11=0,$12=0,$13=0,$15=0,$16=0,$17=0,$18=0,$19=0,$21=0,$22=0,$23=0,$25=0;
 var $26=0,$27=0,$28=0,$29=0,$31=0,$32=0,$34=.0,$35=0,$36=0,$37=.0,$38=0,$39=0,$40=.0,$41=0,$43=0,$44=0,$_vertexSize=0,$45=0,$_1=0,$46=0;
 var $47=0,$48=0,$50=0,$51=0,$52=0,$54=0,$55=0,$58=0,$59=0,$61=0,$63=0,$rc_0=0,$65=0,$71=0,$72=0,$73=0,$74=0,$_=0,$_0=0,label=0;
 var setjmpLabel=0,setjmpTable=0;
 label = 1;
setjmpLabel=0;
setjmpTable=STACKTOP;STACKTOP = (STACKTOP + 168)|0;
HEAP32[((setjmpTable)>>2)]=0; while(1)switch(((label)|0)){
 case 1:
 $1=(($tess+84)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=($2|0)==0;
 if($3){label=3;break;}else{label=2;break;}
 case 2:
 $5=(($tess+112)|0);
 $6=((HEAP32[(($5)>>2)])|0);
 $7=(($tess+116)|0);
 $8=((HEAP32[(($7)>>2)])|0);
 $9=$2;
 invoke_vii((($6)|0),(($8)|0),(($9)|0)); if (((__THREW__|0) != 0) & ((threwValue|0) != 0)) { setjmpLabel = ((_testSetjmp(((HEAP32[((__THREW__)>>2)])|0), setjmpTable))|0); if ((setjmpLabel|0) > 0) { label = -1; break } else return ((0)|0) } __THREW__ = threwValue = 0;;
 HEAP32[(($1)>>2)]=0;
 label=3;break;
 case 3:
 $11=(($tess+96)|0);
 $12=((HEAP32[(($11)>>2)])|0);
 $13=($12|0)==0;
 if($13){label=5;break;}else{label=4;break;}
 case 4:
 $15=(($tess+112)|0);
 $16=((HEAP32[(($15)>>2)])|0);
 $17=(($tess+116)|0);
 $18=((HEAP32[(($17)>>2)])|0);
 $19=$12;
 invoke_vii((($16)|0),(($18)|0),(($19)|0)); if (((__THREW__|0) != 0) & ((threwValue|0) != 0)) { setjmpLabel = ((_testSetjmp(((HEAP32[((__THREW__)>>2)])|0), setjmpTable))|0); if ((setjmpLabel|0) > 0) { label = -1; break } else return ((0)|0) } __THREW__ = threwValue = 0;;
 HEAP32[(($11)>>2)]=0;
 label=5;break;
 case 5:
 $21=(($tess+88)|0);
 $22=((HEAP32[(($21)>>2)])|0);
 $23=($22|0)==0;
 if($23){label=7;break;}else{label=6;break;}
 case 6:
 $25=(($tess+112)|0);
 $26=((HEAP32[(($25)>>2)])|0);
 $27=(($tess+116)|0);
 $28=((HEAP32[(($27)>>2)])|0);
 $29=$22;
 invoke_vii((($26)|0),(($28)|0),(($29)|0)); if (((__THREW__|0) != 0) & ((threwValue|0) != 0)) { setjmpLabel = ((_testSetjmp(((HEAP32[((__THREW__)>>2)])|0), setjmpTable))|0); if ((setjmpLabel|0) > 0) { label = -1; break } else return ((0)|0) } __THREW__ = threwValue = 0;;
 HEAP32[(($21)>>2)]=0;
 label=7;break;
 case 7:
 $31=(($tess+80)|0);
 HEAP32[(($31)>>2)]=0;
 $32=($normal|0)==0;
 if($32){label=9;break;}else{label=8;break;}
 case 8:
 $34=(+(HEAPF32[(($normal)>>2)]));
 $35=(($tess+8)|0);
 HEAPF32[(($35)>>2)]=$34;
 $36=(($normal+4)|0);
 $37=(+(HEAPF32[(($36)>>2)]));
 $38=(($tess+12)|0);
 HEAPF32[(($38)>>2)]=$37;
 $39=(($normal+8)|0);
 $40=(+(HEAPF32[(($39)>>2)]));
 $41=(($tess+16)|0);
 HEAPF32[(($41)>>2)]=$40;
 label=9;break;
 case 9:
 $43=(($tess+60)|0);
 HEAP32[(($43)>>2)]=$windingRule;
 $44=($vertexSize|0)<2;
 $_vertexSize=($44?2:$vertexSize);
 $45=($_vertexSize|0)>3;
 $_1=($45?3:$_vertexSize);
 $46=(($tess+144)|0);
 $47=_saveSetjmp((($46)|0), label, setjmpTable)|0;
 label=23;break;
 case 23:
 $48=($47|0)==0;
 if($48){label=10;break;}else{$_0=0;label=22;break;}
 case 10:
 $50=(($tess)|0);
 $51=((HEAP32[(($50)>>2)])|0);
 $52=($51|0)==0;
 if($52){$_0=0;label=22;break;}else{label=11;break;}
 case 11:
 invoke_vi(2,(($tess)|0)); if (((__THREW__|0) != 0) & ((threwValue|0) != 0)) { setjmpLabel = ((_testSetjmp(((HEAP32[((__THREW__)>>2)])|0), setjmpTable))|0); if ((setjmpLabel|0) > 0) { label = -1; break } else return ((0)|0) } __THREW__ = threwValue = 0;;
 $54=((invoke_ii(2,(($tess)|0)))|0); if (((__THREW__|0) != 0) & ((threwValue|0) != 0)) { setjmpLabel = ((_testSetjmp(((HEAP32[((__THREW__)>>2)])|0), setjmpTable))|0); if ((setjmpLabel|0) > 0) { label = -1; break } else return ((0)|0) } __THREW__ = threwValue = 0;;
 $55=($54|0)==0;
 if($55){label=12;break;}else{label=13;break;}
 case 12:
 invoke_vii(2,(($46)|0),((1)|0)); if (((__THREW__|0) != 0) & ((threwValue|0) != 0)) { setjmpLabel = ((_testSetjmp(((HEAP32[((__THREW__)>>2)])|0), setjmpTable))|0); if ((setjmpLabel|0) > 0) { label = -1; break } else return ((0)|0) } __THREW__ = threwValue = 0;;
 return ((0)|0);
 case 13:
 $58=((HEAP32[(($50)>>2)])|0);
 $59=($elementType|0)==2;
 if($59){label=14;break;}else{label=15;break;}
 case 14:
 $61=((invoke_iiii(6,(($58)|0),((1)|0),((1)|0)))|0); if (((__THREW__|0) != 0) & ((threwValue|0) != 0)) { setjmpLabel = ((_testSetjmp(((HEAP32[((__THREW__)>>2)])|0), setjmpTable))|0); if ((setjmpLabel|0) > 0) { label = -1; break } else return ((0)|0) } __THREW__ = threwValue = 0;;
 $rc_0=$61;label=16;break;
 case 15:
 $63=((invoke_ii(4,(($58)|0)))|0); if (((__THREW__|0) != 0) & ((threwValue|0) != 0)) { setjmpLabel = ((_testSetjmp(((HEAP32[((__THREW__)>>2)])|0), setjmpTable))|0); if ((setjmpLabel|0) > 0) { label = -1; break } else return ((0)|0) } __THREW__ = threwValue = 0;;
 $rc_0=$63;label=16;break;
 case 16:
 $65=($rc_0|0)==0;
 if($65){label=17;break;}else{label=18;break;}
 case 17:
 invoke_vii(2,(($46)|0),((1)|0)); if (((__THREW__|0) != 0) & ((threwValue|0) != 0)) { setjmpLabel = ((_testSetjmp(((HEAP32[((__THREW__)>>2)])|0), setjmpTable))|0); if ((setjmpLabel|0) > 0) { label = -1; break } else return ((0)|0) } __THREW__ = threwValue = 0;;
 return ((0)|0);
 case 18:
 invoke_vi(4,(($58)|0)); if (((__THREW__|0) != 0) & ((threwValue|0) != 0)) { setjmpLabel = ((_testSetjmp(((HEAP32[((__THREW__)>>2)])|0), setjmpTable))|0); if ((setjmpLabel|0) > 0) { label = -1; break } else return ((0)|0) } __THREW__ = threwValue = 0;;
 if($59){label=19;break;}else{label=20;break;}
 case 19:
 invoke_viii(2,(($tess)|0),(($58)|0),(($_1)|0)); if (((__THREW__|0) != 0) & ((threwValue|0) != 0)) { setjmpLabel = ((_testSetjmp(((HEAP32[((__THREW__)>>2)])|0), setjmpTable))|0); if ((setjmpLabel|0) > 0) { label = -1; break } else return ((0)|0) } __THREW__ = threwValue = 0;;
 label=21;break;
 case 20:
 invoke_viiiii(2,(($tess)|0),(($58)|0),(($elementType)|0),(($polySize)|0),(($_1)|0)); if (((__THREW__|0) != 0) & ((threwValue|0) != 0)) { setjmpLabel = ((_testSetjmp(((HEAP32[((__THREW__)>>2)])|0), setjmpTable))|0); if ((setjmpLabel|0) > 0) { label = -1; break } else return ((0)|0) } __THREW__ = threwValue = 0;;
 label=21;break;
 case 21:
 $71=(($tess+104)|0);
 invoke_vii(6,(($71)|0),(($58)|0)); if (((__THREW__|0) != 0) & ((threwValue|0) != 0)) { setjmpLabel = ((_testSetjmp(((HEAP32[((__THREW__)>>2)])|0), setjmpTable))|0); if ((setjmpLabel|0) > 0) { label = -1; break } else return ((0)|0) } __THREW__ = threwValue = 0;;
 HEAP32[(($50)>>2)]=0;
 $72=(($tess+4)|0);
 $73=((HEAP32[(($72)>>2)])|0);
 $74=($73|0)==0;
 $_=($74&1);
 $_0=$_;label=22;break;
 case 22:
 return (($_0)|0);
 case -1: if ((setjmpLabel|0) == 9) { $47 = threwValue; label = 23 }
__THREW__ = threwValue = 0;
break;
 }
  return 0;
}
function _tessGetVertexCount($tess){
 $tess=($tess)|0;
 var $1=0,$2=0,label=0;
 $1=(($tess+92)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 return (($2)|0);
}
function _tessGetVertices($tess){
 $tess=($tess)|0;
 var $1=0,$2=0,label=0;
 $1=(($tess+84)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 return (($2)|0);
}
function _tessGetVertexIndices($tess){
 $tess=($tess)|0;
 var $1=0,$2=0,label=0;
 $1=(($tess+88)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 return (($2)|0);
}
function _tessGetElementCount($tess){
 $tess=($tess)|0;
 var $1=0,$2=0,label=0;
 $1=(($tess+100)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 return (($2)|0);
}
function _tessGetElements($tess){
 $tess=($tess)|0;
 var $1=0,$2=0,label=0;
 $1=(($tess+96)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 return (($2)|0);
}
function _newTess($size){
 $size=($size)|0;
 var $1=0,label=0;
 $1=((_tessNewTess(0))|0);
 return (($1)|0);
}
function _deleteTess($tess){
 $tess=($tess)|0;
 var label=0;
 _tessDeleteTess($tess);
 return;
}
function _addContour($tess,$size,$pointer,$stride,$count){
 $tess=($tess)|0;
 $size=($size)|0;
 $pointer=($pointer)|0;
 $stride=($stride)|0;
 $count=($count)|0;
 var label=0;
 _tessAddContour($tess,$size,$pointer,$stride,$count);
 return;
}
function _tesselate($tess,$windingRule,$elementType,$polySize,$vertexSize,$normal){
 $tess=($tess)|0;
 $windingRule=($windingRule)|0;
 $elementType=($elementType)|0;
 $polySize=($polySize)|0;
 $vertexSize=($vertexSize)|0;
 $normal=($normal)|0;
 var $1=0,label=0;
 $1=((_tessTesselate($tess,$windingRule,$elementType,$polySize,$vertexSize,$normal))|0);
 return (($1)|0);
}
function _getVertexCount($tess){
 $tess=($tess)|0;
 var $1=0,label=0;
 $1=((_tessGetVertexCount($tess))|0);
 return (($1)|0);
}
function _getVertices($tess){
 $tess=($tess)|0;
 var $1=0,label=0;
 $1=((_tessGetVertices($tess))|0);
 return (($1)|0);
}
function _getVertexIndices($tess){
 $tess=($tess)|0;
 var $1=0,label=0;
 $1=((_tessGetVertexIndices($tess))|0);
 return (($1)|0);
}
function _getElementCount($tess){
 $tess=($tess)|0;
 var $1=0,label=0;
 $1=((_tessGetElementCount($tess))|0);
 return (($1)|0);
}
function _getElements($tess){
 $tess=($tess)|0;
 var $1=0,label=0;
 $1=((_tessGetElements($tess))|0);
 return (($1)|0);
}
function _malloc($bytes){
 $bytes=($bytes)|0;
 var $1=0,$3=0,$5=0,$6=0,$8=0,$9=0,$10=0,$11=0,$12=0,$13=0,$15=0,$16=0,$17=0,$18=0,$19=0,$20=0,$_sum111=0,$21=0,$22=0,$23=0;
 var $24=0,$25=0,$27=0,$28=0,$29=0,$31=0,$32=0,$33=0,$35=0,$36=0,$37=0,$40=0,$41=0,$42=0,$43=0,$_sum113114=0,$44=0,$45=0,$46=0,$47=0;
 var $48=0,$50=0,$51=0,$53=0,$55=0,$56=0,$57=0,$58=0,$59=0,$60=0,$61=0,$62=0,$63=0,$64=0,$65=0,$66=0,$67=0,$68=0,$69=0,$70=0;
 var $71=0,$72=0,$73=0,$74=0,$75=0,$76=0,$77=0,$78=0,$79=0,$80=0,$81=0,$82=0,$83=0,$84=0,$85=0,$_sum104=0,$86=0,$87=0,$88=0,$89=0;
 var $90=0,$92=0,$93=0,$94=0,$96=0,$97=0,$98=0,$100=0,$101=0,$102=0,$105=0,$106=0,$107=0,$108=0,$109=0,$110=0,$111=0,$112=0,$_sum106107=0,$113=0;
 var $114=0,$115=0,$116=0,$117=0,$118=0,$120=0,$121=0,$122=0,$123=0,$124=0,$125=0,$126=0,$127=0,$128=0,$130=0,$_sum109_pre=0,$_pre=0,$_sum110=0,$132=0,$133=0;
 var $134=0,$135=0,$136=0,$_pre_phi=0,$F4_0=0,$139=0,$140=0,$141=0,$143=0,$145=0,$146=0,$148=0,$149=0,$150=0,$151=0,$152=0,$153=0,$154=0,$155=0,$156=0;
 var $157=0,$158=0,$159=0,$160=0,$161=0,$162=0,$163=0,$164=0,$165=0,$166=0,$167=0,$168=0,$169=0,$170=0,$171=0,$172=0,$173=0,$174=0,$175=0,$176=0;
 var $rsize_0_i=0,$v_0_i=0,$t_0_i=0,$178=0,$179=0,$180=0,$182=0,$183=0,$184=0,$185=0,$186=0,$187=0,$188=0,$189=0,$190=0,$_rsize_0_i=0,$_v_0_i=0,$192=0,$193=0,$194=0;
 var $196=0,$197=0,$198=0,$200=0,$201=0,$202=0,$203=0,$204=0,$206=0,$207=0,$208=0,$209=0,$211=0,$212=0,$213=0,$215=0,$216=0,$217=0,$220=0,$221=0;
 var $222=0,$224=0,$225=0,$226=0,$RP_0_i=0,$R_0_i=0,$227=0,$228=0,$229=0,$231=0,$232=0,$233=0,$235=0,$236=0,$R_1_i=0,$240=0,$242=0,$243=0,$244=0,$245=0;
 var $246=0,$cond_i=0,$248=0,$249=0,$250=0,$251=0,$252=0,$254=0,$255=0,$256=0,$258=0,$259=0,$260=0,$263=0,$266=0,$268=0,$269=0,$270=0,$272=0,$273=0;
 var $274=0,$275=0,$277=0,$278=0,$279=0,$281=0,$282=0,$285=0,$286=0,$287=0,$289=0,$290=0,$291=0,$293=0,$294=0,$298=0,$300=0,$301=0,$302=0,$_sum4_i=0;
 var $303=0,$304=0,$305=0,$306=0,$308=0,$309=0,$310=0,$_sum_i137=0,$311=0,$312=0,$_sum1_i=0,$313=0,$314=0,$315=0,$316=0,$318=0,$319=0,$320=0,$321=0,$322=0;
 var $323=0,$324=0,$325=0,$326=0,$328=0,$_sum2_pre_i=0,$_pre_i=0,$_sum3_i=0,$330=0,$331=0,$332=0,$333=0,$334=0,$_pre_phi_i=0,$F1_0_i=0,$337=0,$338=0,$339=0,$342=0,$343=0;
 var $344=0,$346=0,$348=0,$349=0,$350=0,$351=0,$353=0,$354=0,$355=0,$357=0,$359=0,$360=0,$361=0,$362=0,$363=0,$364=0,$365=0,$366=0,$367=0,$368=0;
 var $369=0,$370=0,$371=0,$372=0,$373=0,$374=0,$375=0,$376=0,$377=0,$378=0,$379=0,$380=0,$idx_0_i=0,$382=0,$383=0,$384=0,$386=0,$388=0,$389=0,$391=0;
 var $392=0,$rst_0_i=0,$sizebits_0_i=0,$t_0_i116=0,$rsize_0_i117=0,$v_0_i118=0,$394=0,$395=0,$396=0,$397=0,$398=0,$400=0,$rsize_1_i=0,$v_1_i=0,$402=0,$403=0,$404=0,$405=0,$406=0,$407=0;
 var $408=0,$or_cond_i=0,$rst_1_i=0,$409=0,$410=0,$t_1_i=0,$rsize_2_i=0,$v_2_i=0,$411=0,$412=0,$or_cond21_i=0,$414=0,$415=0,$416=0,$417=0,$418=0,$420=0,$421=0,$422=0,$423=0;
 var $424=0,$425=0,$426=0,$427=0,$428=0,$429=0,$430=0,$431=0,$432=0,$433=0,$434=0,$435=0,$436=0,$437=0,$438=0,$439=0,$440=0,$441=0,$442=0,$443=0;
 var $444=0,$t_2_ph_i=0,$445=0,$v_330_i=0,$rsize_329_i=0,$t_228_i=0,$446=0,$447=0,$448=0,$449=0,$450=0,$_rsize_3_i=0,$t_2_v_3_i=0,$451=0,$452=0,$453=0,$454=0,$455=0,$456=0,$v_3_lcssa_i=0;
 var $rsize_3_lcssa_i=0,$457=0,$459=0,$460=0,$461=0,$463=0,$464=0,$465=0,$467=0,$468=0,$469=0,$471=0,$472=0,$473=0,$474=0,$475=0,$477=0,$478=0,$479=0,$480=0;
 var $482=0,$483=0,$484=0,$486=0,$487=0,$488=0,$491=0,$492=0,$493=0,$495=0,$496=0,$497=0,$RP_0_i119=0,$R_0_i120=0,$498=0,$499=0,$500=0,$502=0,$503=0,$504=0;
 var $506=0,$507=0,$R_1_i122=0,$511=0,$513=0,$514=0,$515=0,$516=0,$517=0,$cond_i123=0,$519=0,$520=0,$521=0,$522=0,$523=0,$525=0,$526=0,$527=0,$529=0,$530=0;
 var $531=0,$534=0,$537=0,$539=0,$540=0,$541=0,$543=0,$544=0,$545=0,$546=0,$548=0,$549=0,$550=0,$552=0,$553=0,$556=0,$557=0,$558=0,$560=0,$561=0;
 var $562=0,$564=0,$565=0,$569=0,$571=0,$572=0,$573=0,$_sum19_i=0,$574=0,$575=0,$576=0,$577=0,$579=0,$580=0,$581=0,$_sum_i125136=0,$582=0,$583=0,$_sum1_i126=0,$584=0;
 var $585=0,$586=0,$587=0,$589=0,$590=0,$591=0,$592=0,$593=0,$594=0,$595=0,$597=0,$_sum15_pre_i=0,$_pre_i127=0,$_sum18_i=0,$599=0,$600=0,$601=0,$602=0,$603=0,$_pre_phi_i128=0;
 var $F5_0_i=0,$606=0,$_sum16_i=0,$607=0,$608=0,$_sum17_i=0,$609=0,$610=0,$612=0,$613=0,$614=0,$616=0,$618=0,$619=0,$620=0,$621=0,$622=0,$623=0,$624=0,$625=0;
 var $626=0,$627=0,$628=0,$629=0,$630=0,$631=0,$632=0,$633=0,$634=0,$635=0,$636=0,$637=0,$638=0,$639=0,$I7_0_i=0,$641=0,$_sum2_i=0,$642=0,$643=0,$_sum3_i129=0;
 var $644=0,$_sum4_i130=0,$645=0,$646=0,$647=0,$648=0,$649=0,$650=0,$651=0,$653=0,$654=0,$_sum5_i=0,$655=0,$656=0,$_sum6_i=0,$657=0,$658=0,$_sum7_i=0,$659=0,$660=0;
 var $662=0,$663=0,$665=0,$666=0,$668=0,$669=0,$T_0_i=0,$K12_0_i=0,$671=0,$672=0,$673=0,$674=0,$676=0,$677=0,$678=0,$679=0,$680=0,$682=0,$683=0,$684=0;
 var $_sum12_i=0,$686=0,$687=0,$_sum13_i=0,$688=0,$689=0,$_sum14_i=0,$690=0,$691=0,$694=0,$695=0,$696=0,$697=0,$698=0,$700=0,$701=0,$703=0,$_sum9_i=0,$704=0,$705=0;
 var $_sum10_i=0,$706=0,$707=0,$_sum11_i=0,$708=0,$709=0,$711=0,$712=0,$713=0,$nb_0=0,$714=0,$715=0,$717=0,$718=0,$719=0,$721=0,$722=0,$723=0,$724=0,$_sum102=0;
 var $725=0,$726=0,$727=0,$728=0,$729=0,$730=0,$732=0,$733=0,$734=0,$_sum101=0,$735=0,$736=0,$737=0,$738=0,$740=0,$741=0,$743=0,$744=0,$746=0,$747=0;
 var $748=0,$749=0,$750=0,$751=0,$_sum=0,$752=0,$753=0,$754=0,$755=0,$756=0,$757=0,$759=0,$760=0,$762=0,$763=0,$764=0,$765=0,$767=0,$768=0,$769=0;
 var $771=0,$772=0,$773=0,$774=0,$775=0,$776=0,$777=0,$779=0,$780=0,$782=0,$783=0,$784=0,$785=0,$or_cond1_i=0,$787=0,$788=0,$789=0,$791=0,$792=0,$794=0;
 var $sp_0_i_i=0,$796=0,$797=0,$798=0,$800=0,$801=0,$802=0,$803=0,$805=0,$806=0,$807=0,$808=0,$809=0,$810=0,$812=0,$813=0,$814=0,$815=0,$816=0,$818=0;
 var $819=0,$820=0,$821=0,$822=0,$ssize_0_i=0,$824=0,$825=0,$826=0,$827=0,$or_cond_i131=0,$829=0,$830=0,$832=0,$833=0,$or_cond2_i=0,$835=0,$836=0,$ssize_0__i=0,$__i=0,$838=0;
 var $839=0,$840=0,$841=0,$843=0,$844=0,$845=0,$846=0,$847=0,$_3_i=0,$_4_i=0,$ssize_1_i=0,$br_0_i=0,$tsize_0_i=0,$tbase_0_i=0,$849=0,$850=0,$852=0,$853=0,$or_cond5_i=0,$854=0;
 var $or_cond6_i=0,$856=0,$857=0,$858=0,$859=0,$860=0,$861=0,$863=0,$864=0,$866=0,$868=0,$ssize_2_i=0,$870=0,$tsize_0303639_i=0,$871=0,$872=0,$tsize_1_i=0,$874=0,$876=0,$877=0;
 var $notlhs_i=0,$notrhs_i=0,$or_cond8_not_i=0,$878=0,$or_cond9_i=0,$879=0,$880=0,$881=0,$882=0,$883=0,$_tsize_1_i=0,$_tbase_1_i=0,$884=0,$tbase_245_i=0,$tsize_244_i=0,$885=0,$886=0,$887=0,$888=0,$890=0;
 var $891=0,$893=0,$894=0,$895=0,$or_cond10_i=0,$897=0,$i_02_i_i=0,$899=0,$900=0,$901=0,$_sum_i_i=0,$902=0,$_sum1_i_i=0,$903=0,$904=0,$905=0,$906=0,$907=0,$908=0,$909=0;
 var $910=0,$912=0,$913=0,$914=0,$915=0,$916=0,$917=0,$918=0,$_sum_i14_i=0,$919=0,$920=0,$_sum2_i_i=0,$921=0,$922=0,$923=0,$sp_067_i=0,$924=0,$925=0,$926=0,$927=0;
 var $928=0,$929=0,$931=0,$932=0,$933=0,$934=0,$935=0,$936=0,$937=0,$939=0,$940=0,$941=0,$or_cond47_i=0,$943=0,$944=0,$945=0,$946=0,$947=0,$948=0,$949=0;
 var $950=0,$951=0,$953=0,$954=0,$955=0,$956=0,$957=0,$958=0,$959=0,$_sum_i18_i=0,$960=0,$961=0,$_sum2_i19_i=0,$962=0,$963=0,$964=0,$965=0,$966=0,$968=0,$sp_160_i=0;
 var $970=0,$971=0,$972=0,$974=0,$975=0,$976=0,$977=0,$978=0,$979=0,$980=0,$982=0,$983=0,$984=0,$985=0,$986=0,$987=0,$988=0,$990=0,$991=0,$993=0;
 var $994=0,$_sum93_i=0,$995=0,$996=0,$997=0,$998=0,$1000=0,$1001=0,$1003=0,$_sum94_i=0,$1004=0,$1005=0,$1006=0,$1007=0,$1008=0,$_sum_i21_i=0,$1009=0,$1010=0,$1011=0,$1012=0;
 var $_sum1_i22_i=0,$1013=0,$1014=0,$1015=0,$1016=0,$1018=0,$1019=0,$1020=0,$_sum46_i_i=0,$1021=0,$1022=0,$1024=0,$1025=0,$1027=0,$1028=0,$1029=0,$_sum44_i_i=0,$1030=0,$1031=0,$_sum45_i_i=0;
 var $1032=0,$1033=0,$_sum2_i23_i=0,$_sum95_i=0,$1035=0,$1036=0,$1037=0,$1038=0,$1039=0,$1041=0,$1042=0,$1043=0,$_sum3940_i_i=0,$_sum105_i=0,$1045=0,$1046=0,$1047=0,$_sum41_i_i=0,$_sum106_i=0,$1048=0;
 var $1049=0,$1050=0,$1051=0,$1052=0,$1053=0,$1054=0,$1056=0,$1057=0,$1058=0,$1060=0,$1061=0,$1062=0,$1063=0,$1065=0,$1066=0,$1067=0,$1068=0,$1070=0,$_pre56_i_i=0,$1072=0;
 var $1073=0,$1074=0,$1076=0,$1077=0,$1078=0,$_pre_phi57_i_i=0,$1079=0,$1081=0,$_sum34_i_i=0,$_sum96_i=0,$1082=0,$1083=0,$1084=0,$_sum5_i_i=0,$_sum97_i=0,$1085=0,$1086=0,$1087=0,$1088=0,$_sum3637_i_i=0;
 var $_sum98_i=0,$1090=0,$1091=0,$1092=0,$1093=0,$1094=0,$1095=0,$1097=0,$1098=0,$1099=0,$1101=0,$1102=0,$1103=0,$_sum67_i_i=0,$_sum103_i=0,$1106=0,$1107=0,$1108=0,$1109=0,$_sum104_i=0;
 var $1111=0,$1112=0,$1113=0,$1114=0,$RP_0_i_i=0,$R_0_i_i=0,$1115=0,$1116=0,$1117=0,$1119=0,$1120=0,$1121=0,$1123=0,$1124=0,$1125=0,$R_1_i_i=0,$1129=0,$_sum31_i_i=0,$_sum99_i=0,$1131=0;
 var $1132=0,$1133=0,$1134=0,$1135=0,$1136=0,$cond_i_i=0,$1138=0,$1139=0,$1140=0,$1141=0,$1142=0,$1144=0,$1145=0,$1146=0,$1148=0,$1149=0,$1150=0,$1153=0,$1156=0,$1158=0;
 var $1159=0,$1160=0,$1162=0,$_sum3233_i_i=0,$_sum100_i=0,$1163=0,$1164=0,$1165=0,$1166=0,$1168=0,$1169=0,$1170=0,$1172=0,$1173=0,$_sum101_i=0,$1176=0,$1177=0,$1178=0,$1179=0,$1181=0;
 var $1182=0,$1183=0,$1185=0,$1186=0,$_sum9_i_i=0,$_sum102_i=0,$1190=0,$1191=0,$1192=0,$qsize_0_i_i=0,$oldfirst_0_i_i=0,$1194=0,$1195=0,$1196=0,$1197=0,$_sum10_i_i=0,$1198=0,$1199=0,$_sum11_i_i=0,$1200=0;
 var $1201=0,$1202=0,$1203=0,$1205=0,$1206=0,$1207=0,$1208=0,$1209=0,$1210=0,$1211=0,$1213=0,$_sum27_pre_i_i=0,$_pre_i24_i=0,$_sum30_i_i=0,$1215=0,$1216=0,$1217=0,$1218=0,$1219=0,$_pre_phi_i25_i=0;
 var $F4_0_i_i=0,$1222=0,$_sum28_i_i=0,$1223=0,$1224=0,$_sum29_i_i=0,$1225=0,$1226=0,$1228=0,$1229=0,$1230=0,$1232=0,$1234=0,$1235=0,$1236=0,$1237=0,$1238=0,$1239=0,$1240=0,$1241=0;
 var $1242=0,$1243=0,$1244=0,$1245=0,$1246=0,$1247=0,$1248=0,$1249=0,$1250=0,$1251=0,$1252=0,$1253=0,$1254=0,$1255=0,$I7_0_i_i=0,$1257=0,$_sum12_i26_i=0,$1258=0,$1259=0,$_sum13_i_i=0;
 var $1260=0,$_sum14_i_i=0,$1261=0,$1262=0,$1263=0,$1264=0,$1265=0,$1266=0,$1267=0,$1269=0,$1270=0,$_sum15_i_i=0,$1271=0,$1272=0,$_sum16_i_i=0,$1273=0,$1274=0,$_sum17_i_i=0,$1275=0,$1276=0;
 var $1278=0,$1279=0,$1281=0,$1282=0,$1284=0,$1285=0,$T_0_i27_i=0,$K8_0_i_i=0,$1287=0,$1288=0,$1289=0,$1290=0,$1292=0,$1293=0,$1294=0,$1295=0,$1296=0,$1298=0,$1299=0,$1300=0;
 var $_sum24_i_i=0,$1302=0,$1303=0,$_sum25_i_i=0,$1304=0,$1305=0,$_sum26_i_i=0,$1306=0,$1307=0,$1310=0,$1311=0,$1312=0,$1313=0,$1314=0,$1316=0,$1317=0,$1319=0,$_sum21_i_i=0,$1320=0,$1321=0;
 var $_sum22_i_i=0,$1322=0,$1323=0,$_sum23_i_i=0,$1324=0,$1325=0,$_sum1819_i_i=0,$1326=0,$1327=0,$sp_0_i_i_i=0,$1329=0,$1330=0,$1331=0,$1333=0,$1334=0,$1335=0,$1336=0,$1338=0,$1339=0,$_sum_i15_i=0;
 var $_sum1_i16_i=0,$1340=0,$1341=0,$1342=0,$1343=0,$1345=0,$1346=0,$1348=0,$_sum2_i17_i=0,$1349=0,$1350=0,$1351=0,$1352=0,$1353=0,$1354=0,$1355=0,$1356=0,$1357=0,$1358=0,$1359=0;
 var $1360=0,$1362=0,$1363=0,$1364=0,$1365=0,$1366=0,$1367=0,$1368=0,$_sum_i_i_i=0,$1369=0,$1370=0,$_sum2_i_i_i=0,$1371=0,$1372=0,$1373=0,$1374=0,$1375=0,$1376=0,$1377=0,$1378=0;
 var $1379=0,$1380=0,$1381=0,$1382=0,$1383=0,$1384=0,$1385=0,$1387=0,$1388=0,$1389=0,$1390=0,$_sum3_i_i=0,$1391=0,$1392=0,$1393=0,$1394=0,$1395=0,$1396=0,$1397=0,$1398=0;
 var $1399=0,$1401=0,$1402=0,$1403=0,$1404=0,$1405=0,$1406=0,$1407=0,$1409=0,$_sum11_pre_i_i=0,$_pre_i_i=0,$_sum12_i_i=0,$1411=0,$1412=0,$1413=0,$1414=0,$1415=0,$_pre_phi_i_i=0,$F_0_i_i=0,$1418=0;
 var $1419=0,$1420=0,$1422=0,$1423=0,$1424=0,$1426=0,$1428=0,$1429=0,$1430=0,$1431=0,$1432=0,$1433=0,$1434=0,$1435=0,$1436=0,$1437=0,$1438=0,$1439=0,$1440=0,$1441=0;
 var $1442=0,$1443=0,$1444=0,$1445=0,$1446=0,$1447=0,$1448=0,$1449=0,$I1_0_i_i=0,$1451=0,$1452=0,$I1_0_c_i_i=0,$1453=0,$1454=0,$1455=0,$1456=0,$1457=0,$1458=0,$1460=0,$1461=0;
 var $_c_i_i=0,$1462=0,$1463=0,$1465=0,$1466=0,$1468=0,$1469=0,$1471=0,$1472=0,$T_0_i_i=0,$K2_0_i_i=0,$1474=0,$1475=0,$1476=0,$1477=0,$1479=0,$1480=0,$1481=0,$1482=0,$1483=0;
 var $1485=0,$1486=0,$1487=0,$1489=0,$T_0_c8_i_i=0,$1490=0,$1491=0,$1494=0,$1495=0,$1496=0,$1497=0,$1498=0,$1500=0,$1501=0,$1503=0,$1504=0,$_c7_i_i=0,$1505=0,$T_0_c_i_i=0,$1506=0;
 var $1507=0,$1508=0,$1510=0,$1511=0,$1512=0,$1513=0,$1514=0,$1515=0,$_sum_i134=0,$1516=0,$1517=0,$1518=0,$1519=0,$1520=0,$1521=0,$1522=0,$mem_0=0,label=0;
 $1=($bytes>>>0)<((245)>>>0);
 do {
  if ($1) {
   $3=($bytes>>>0)<((11)>>>0);
   if ($3) {
    $8=16;
   } else {
    $5=((($bytes)+(11))|0);
    $6=$5&-8;
    $8=$6;
   }
   $9=$8>>>3;
   $10=((HEAP32[((2304)>>2)])|0);
   $11=$10>>>($9>>>0);
   $12=$11&3;
   $13=($12|0)==0;
   if (!($13)) {
    $15=$11&1;
    $16=$15^1;
    $17=((($16)+($9))|0);
    $18=$17<<1;
    $19=((2344+($18<<2))|0);
    $20=$19;
    $_sum111=((($18)+(2))|0);
    $21=((2344+($_sum111<<2))|0);
    $22=((HEAP32[(($21)>>2)])|0);
    $23=(($22+8)|0);
    $24=((HEAP32[(($23)>>2)])|0);
    $25=($20|0)==($24|0);
    do {
     if ($25) {
      $27=1<<$17;
      $28=$27^-1;
      $29=$10&$28;
      HEAP32[((2304)>>2)]=$29;
     } else {
      $31=$24;
      $32=((HEAP32[((2320)>>2)])|0);
      $33=($31>>>0)<($32>>>0);
      if ($33) {
       _abort(); return ((0)|0);
       return ((0)|0);
      }
      $35=(($24+12)|0);
      $36=((HEAP32[(($35)>>2)])|0);
      $37=($36|0)==($22|0);
      if ($37) {
       HEAP32[(($35)>>2)]=$20;
       HEAP32[(($21)>>2)]=$24;
       break;
      } else {
       _abort(); return ((0)|0);
       return ((0)|0);
      }
     }
    } while(0);
    $40=$17<<3;
    $41=$40|3;
    $42=(($22+4)|0);
    HEAP32[(($42)>>2)]=$41;
    $43=$22;
    $_sum113114=$40|4;
    $44=(($43+$_sum113114)|0);
    $45=$44;
    $46=((HEAP32[(($45)>>2)])|0);
    $47=$46|1;
    HEAP32[(($45)>>2)]=$47;
    $48=$23;
    $mem_0=$48;
    return (($mem_0)|0);
   }
   $50=((HEAP32[((2312)>>2)])|0);
   $51=($8>>>0)>($50>>>0);
   if (!($51)) {
    $nb_0=$8;
    break;
   }
   $53=($11|0)==0;
   if (!($53)) {
    $55=$11<<$9;
    $56=2<<$9;
    $57=(((-$56))|0);
    $58=$56|$57;
    $59=$55&$58;
    $60=(((-$59))|0);
    $61=$59&$60;
    $62=((($61)-(1))|0);
    $63=$62>>>12;
    $64=$63&16;
    $65=$62>>>($64>>>0);
    $66=$65>>>5;
    $67=$66&8;
    $68=$67|$64;
    $69=$65>>>($67>>>0);
    $70=$69>>>2;
    $71=$70&4;
    $72=$68|$71;
    $73=$69>>>($71>>>0);
    $74=$73>>>1;
    $75=$74&2;
    $76=$72|$75;
    $77=$73>>>($75>>>0);
    $78=$77>>>1;
    $79=$78&1;
    $80=$76|$79;
    $81=$77>>>($79>>>0);
    $82=((($80)+($81))|0);
    $83=$82<<1;
    $84=((2344+($83<<2))|0);
    $85=$84;
    $_sum104=((($83)+(2))|0);
    $86=((2344+($_sum104<<2))|0);
    $87=((HEAP32[(($86)>>2)])|0);
    $88=(($87+8)|0);
    $89=((HEAP32[(($88)>>2)])|0);
    $90=($85|0)==($89|0);
    do {
     if ($90) {
      $92=1<<$82;
      $93=$92^-1;
      $94=$10&$93;
      HEAP32[((2304)>>2)]=$94;
     } else {
      $96=$89;
      $97=((HEAP32[((2320)>>2)])|0);
      $98=($96>>>0)<($97>>>0);
      if ($98) {
       _abort(); return ((0)|0);
       return ((0)|0);
      }
      $100=(($89+12)|0);
      $101=((HEAP32[(($100)>>2)])|0);
      $102=($101|0)==($87|0);
      if ($102) {
       HEAP32[(($100)>>2)]=$85;
       HEAP32[(($86)>>2)]=$89;
       break;
      } else {
       _abort(); return ((0)|0);
       return ((0)|0);
      }
     }
    } while(0);
    $105=$82<<3;
    $106=((($105)-($8))|0);
    $107=$8|3;
    $108=(($87+4)|0);
    HEAP32[(($108)>>2)]=$107;
    $109=$87;
    $110=(($109+$8)|0);
    $111=$110;
    $112=$106|1;
    $_sum106107=$8|4;
    $113=(($109+$_sum106107)|0);
    $114=$113;
    HEAP32[(($114)>>2)]=$112;
    $115=(($109+$105)|0);
    $116=$115;
    HEAP32[(($116)>>2)]=$106;
    $117=((HEAP32[((2312)>>2)])|0);
    $118=($117|0)==0;
    if (!($118)) {
     $120=((HEAP32[((2324)>>2)])|0);
     $121=$117>>>3;
     $122=$121<<1;
     $123=((2344+($122<<2))|0);
     $124=$123;
     $125=((HEAP32[((2304)>>2)])|0);
     $126=1<<$121;
     $127=$125&$126;
     $128=($127|0)==0;
     do {
      if ($128) {
       $130=$125|$126;
       HEAP32[((2304)>>2)]=$130;
       $_sum109_pre=((($122)+(2))|0);
       $_pre=((2344+($_sum109_pre<<2))|0);
       $F4_0=$124;$_pre_phi=$_pre;
      } else {
       $_sum110=((($122)+(2))|0);
       $132=((2344+($_sum110<<2))|0);
       $133=((HEAP32[(($132)>>2)])|0);
       $134=$133;
       $135=((HEAP32[((2320)>>2)])|0);
       $136=($134>>>0)<($135>>>0);
       if (!($136)) {
        $F4_0=$133;$_pre_phi=$132;
        break;
       }
       _abort(); return ((0)|0);
       return ((0)|0);
      }
     } while(0);
     HEAP32[(($_pre_phi)>>2)]=$120;
     $139=(($F4_0+12)|0);
     HEAP32[(($139)>>2)]=$120;
     $140=(($120+8)|0);
     HEAP32[(($140)>>2)]=$F4_0;
     $141=(($120+12)|0);
     HEAP32[(($141)>>2)]=$124;
    }
    HEAP32[((2312)>>2)]=$106;
    HEAP32[((2324)>>2)]=$111;
    $143=$88;
    $mem_0=$143;
    return (($mem_0)|0);
   }
   $145=((HEAP32[((2308)>>2)])|0);
   $146=($145|0)==0;
   if ($146) {
    $nb_0=$8;
    break;
   }
   $148=(((-$145))|0);
   $149=$145&$148;
   $150=((($149)-(1))|0);
   $151=$150>>>12;
   $152=$151&16;
   $153=$150>>>($152>>>0);
   $154=$153>>>5;
   $155=$154&8;
   $156=$155|$152;
   $157=$153>>>($155>>>0);
   $158=$157>>>2;
   $159=$158&4;
   $160=$156|$159;
   $161=$157>>>($159>>>0);
   $162=$161>>>1;
   $163=$162&2;
   $164=$160|$163;
   $165=$161>>>($163>>>0);
   $166=$165>>>1;
   $167=$166&1;
   $168=$164|$167;
   $169=$165>>>($167>>>0);
   $170=((($168)+($169))|0);
   $171=((2608+($170<<2))|0);
   $172=((HEAP32[(($171)>>2)])|0);
   $173=(($172+4)|0);
   $174=((HEAP32[(($173)>>2)])|0);
   $175=$174&-8;
   $176=((($175)-($8))|0);
   $t_0_i=$172;$v_0_i=$172;$rsize_0_i=$176;
   while(1) {
    $178=(($t_0_i+16)|0);
    $179=((HEAP32[(($178)>>2)])|0);
    $180=($179|0)==0;
    if ($180) {
     $182=(($t_0_i+20)|0);
     $183=((HEAP32[(($182)>>2)])|0);
     $184=($183|0)==0;
     if ($184) {
      break;
     } else {
      $185=$183;
     }
    } else {
     $185=$179;
    }
    $186=(($185+4)|0);
    $187=((HEAP32[(($186)>>2)])|0);
    $188=$187&-8;
    $189=((($188)-($8))|0);
    $190=($189>>>0)<($rsize_0_i>>>0);
    $_rsize_0_i=($190?$189:$rsize_0_i);
    $_v_0_i=($190?$185:$v_0_i);
    $t_0_i=$185;$v_0_i=$_v_0_i;$rsize_0_i=$_rsize_0_i;
   }
   $192=$v_0_i;
   $193=((HEAP32[((2320)>>2)])|0);
   $194=($192>>>0)<($193>>>0);
   if ($194) {
    _abort(); return ((0)|0);
    return ((0)|0);
   }
   $196=(($192+$8)|0);
   $197=$196;
   $198=($192>>>0)<($196>>>0);
   if (!($198)) {
    _abort(); return ((0)|0);
    return ((0)|0);
   }
   $200=(($v_0_i+24)|0);
   $201=((HEAP32[(($200)>>2)])|0);
   $202=(($v_0_i+12)|0);
   $203=((HEAP32[(($202)>>2)])|0);
   $204=($203|0)==($v_0_i|0);
   do {
    if ($204) {
     $220=(($v_0_i+20)|0);
     $221=((HEAP32[(($220)>>2)])|0);
     $222=($221|0)==0;
     if ($222) {
      $224=(($v_0_i+16)|0);
      $225=((HEAP32[(($224)>>2)])|0);
      $226=($225|0)==0;
      if ($226) {
       $R_1_i=0;
       break;
      } else {
       $R_0_i=$225;$RP_0_i=$224;
      }
     } else {
      $R_0_i=$221;$RP_0_i=$220;
     }
     while(1) {
      $227=(($R_0_i+20)|0);
      $228=((HEAP32[(($227)>>2)])|0);
      $229=($228|0)==0;
      if (!($229)) {
       $R_0_i=$228;$RP_0_i=$227;
       continue;
      }
      $231=(($R_0_i+16)|0);
      $232=((HEAP32[(($231)>>2)])|0);
      $233=($232|0)==0;
      if ($233) {
       break;
      } else {
       $R_0_i=$232;$RP_0_i=$231;
      }
     }
     $235=$RP_0_i;
     $236=($235>>>0)<($193>>>0);
     if ($236) {
      _abort(); return ((0)|0);
      return ((0)|0);
     } else {
      HEAP32[(($RP_0_i)>>2)]=0;
      $R_1_i=$R_0_i;
      break;
     }
    } else {
     $206=(($v_0_i+8)|0);
     $207=((HEAP32[(($206)>>2)])|0);
     $208=$207;
     $209=($208>>>0)<($193>>>0);
     if ($209) {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
     $211=(($207+12)|0);
     $212=((HEAP32[(($211)>>2)])|0);
     $213=($212|0)==($v_0_i|0);
     if (!($213)) {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
     $215=(($203+8)|0);
     $216=((HEAP32[(($215)>>2)])|0);
     $217=($216|0)==($v_0_i|0);
     if ($217) {
      HEAP32[(($211)>>2)]=$203;
      HEAP32[(($215)>>2)]=$207;
      $R_1_i=$203;
      break;
     } else {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
    }
   } while(0);
   $240=($201|0)==0;
   L1836: do {
    if (!($240)) {
     $242=(($v_0_i+28)|0);
     $243=((HEAP32[(($242)>>2)])|0);
     $244=((2608+($243<<2))|0);
     $245=((HEAP32[(($244)>>2)])|0);
     $246=($v_0_i|0)==($245|0);
     do {
      if ($246) {
       HEAP32[(($244)>>2)]=$R_1_i;
       $cond_i=($R_1_i|0)==0;
       if (!($cond_i)) {
        break;
       }
       $248=((HEAP32[(($242)>>2)])|0);
       $249=1<<$248;
       $250=$249^-1;
       $251=((HEAP32[((2308)>>2)])|0);
       $252=$251&$250;
       HEAP32[((2308)>>2)]=$252;
       break L1836;
      } else {
       $254=$201;
       $255=((HEAP32[((2320)>>2)])|0);
       $256=($254>>>0)<($255>>>0);
       if ($256) {
        _abort(); return ((0)|0);
        return ((0)|0);
       }
       $258=(($201+16)|0);
       $259=((HEAP32[(($258)>>2)])|0);
       $260=($259|0)==($v_0_i|0);
       if ($260) {
        HEAP32[(($258)>>2)]=$R_1_i;
       } else {
        $263=(($201+20)|0);
        HEAP32[(($263)>>2)]=$R_1_i;
       }
       $266=($R_1_i|0)==0;
       if ($266) {
        break L1836;
       }
      }
     } while(0);
     $268=$R_1_i;
     $269=((HEAP32[((2320)>>2)])|0);
     $270=($268>>>0)<($269>>>0);
     if ($270) {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
     $272=(($R_1_i+24)|0);
     HEAP32[(($272)>>2)]=$201;
     $273=(($v_0_i+16)|0);
     $274=((HEAP32[(($273)>>2)])|0);
     $275=($274|0)==0;
     do {
      if (!($275)) {
       $277=$274;
       $278=((HEAP32[((2320)>>2)])|0);
       $279=($277>>>0)<($278>>>0);
       if ($279) {
        _abort(); return ((0)|0);
        return ((0)|0);
       } else {
        $281=(($R_1_i+16)|0);
        HEAP32[(($281)>>2)]=$274;
        $282=(($274+24)|0);
        HEAP32[(($282)>>2)]=$R_1_i;
        break;
       }
      }
     } while(0);
     $285=(($v_0_i+20)|0);
     $286=((HEAP32[(($285)>>2)])|0);
     $287=($286|0)==0;
     if ($287) {
      break;
     }
     $289=$286;
     $290=((HEAP32[((2320)>>2)])|0);
     $291=($289>>>0)<($290>>>0);
     if ($291) {
      _abort(); return ((0)|0);
      return ((0)|0);
     } else {
      $293=(($R_1_i+20)|0);
      HEAP32[(($293)>>2)]=$286;
      $294=(($286+24)|0);
      HEAP32[(($294)>>2)]=$R_1_i;
      break;
     }
    }
   } while(0);
   $298=($rsize_0_i>>>0)<((16)>>>0);
   if ($298) {
    $300=((($rsize_0_i)+($8))|0);
    $301=$300|3;
    $302=(($v_0_i+4)|0);
    HEAP32[(($302)>>2)]=$301;
    $_sum4_i=((($300)+(4))|0);
    $303=(($192+$_sum4_i)|0);
    $304=$303;
    $305=((HEAP32[(($304)>>2)])|0);
    $306=$305|1;
    HEAP32[(($304)>>2)]=$306;
   } else {
    $308=$8|3;
    $309=(($v_0_i+4)|0);
    HEAP32[(($309)>>2)]=$308;
    $310=$rsize_0_i|1;
    $_sum_i137=$8|4;
    $311=(($192+$_sum_i137)|0);
    $312=$311;
    HEAP32[(($312)>>2)]=$310;
    $_sum1_i=((($rsize_0_i)+($8))|0);
    $313=(($192+$_sum1_i)|0);
    $314=$313;
    HEAP32[(($314)>>2)]=$rsize_0_i;
    $315=((HEAP32[((2312)>>2)])|0);
    $316=($315|0)==0;
    if (!($316)) {
     $318=((HEAP32[((2324)>>2)])|0);
     $319=$315>>>3;
     $320=$319<<1;
     $321=((2344+($320<<2))|0);
     $322=$321;
     $323=((HEAP32[((2304)>>2)])|0);
     $324=1<<$319;
     $325=$323&$324;
     $326=($325|0)==0;
     do {
      if ($326) {
       $328=$323|$324;
       HEAP32[((2304)>>2)]=$328;
       $_sum2_pre_i=((($320)+(2))|0);
       $_pre_i=((2344+($_sum2_pre_i<<2))|0);
       $F1_0_i=$322;$_pre_phi_i=$_pre_i;
      } else {
       $_sum3_i=((($320)+(2))|0);
       $330=((2344+($_sum3_i<<2))|0);
       $331=((HEAP32[(($330)>>2)])|0);
       $332=$331;
       $333=((HEAP32[((2320)>>2)])|0);
       $334=($332>>>0)<($333>>>0);
       if (!($334)) {
        $F1_0_i=$331;$_pre_phi_i=$330;
        break;
       }
       _abort(); return ((0)|0);
       return ((0)|0);
      }
     } while(0);
     HEAP32[(($_pre_phi_i)>>2)]=$318;
     $337=(($F1_0_i+12)|0);
     HEAP32[(($337)>>2)]=$318;
     $338=(($318+8)|0);
     HEAP32[(($338)>>2)]=$F1_0_i;
     $339=(($318+12)|0);
     HEAP32[(($339)>>2)]=$322;
    }
    HEAP32[((2312)>>2)]=$rsize_0_i;
    HEAP32[((2324)>>2)]=$197;
   }
   $342=(($v_0_i+8)|0);
   $343=$342;
   $344=($342|0)==0;
   if ($344) {
    $nb_0=$8;
    break;
   } else {
    $mem_0=$343;
   }
   return (($mem_0)|0);
  } else {
   $346=($bytes>>>0)>((4294967231)>>>0);
   if ($346) {
    $nb_0=-1;
    break;
   }
   $348=((($bytes)+(11))|0);
   $349=$348&-8;
   $350=((HEAP32[((2308)>>2)])|0);
   $351=($350|0)==0;
   if ($351) {
    $nb_0=$349;
    break;
   }
   $353=(((-$349))|0);
   $354=$348>>>8;
   $355=($354|0)==0;
   do {
    if ($355) {
     $idx_0_i=0;
    } else {
     $357=($349>>>0)>((16777215)>>>0);
     if ($357) {
      $idx_0_i=31;
      break;
     }
     $359=((($354)+(1048320))|0);
     $360=$359>>>16;
     $361=$360&8;
     $362=$354<<$361;
     $363=((($362)+(520192))|0);
     $364=$363>>>16;
     $365=$364&4;
     $366=$365|$361;
     $367=$362<<$365;
     $368=((($367)+(245760))|0);
     $369=$368>>>16;
     $370=$369&2;
     $371=$366|$370;
     $372=(((14)-($371))|0);
     $373=$367<<$370;
     $374=$373>>>15;
     $375=((($372)+($374))|0);
     $376=$375<<1;
     $377=((($375)+(7))|0);
     $378=$349>>>($377>>>0);
     $379=$378&1;
     $380=$379|$376;
     $idx_0_i=$380;
    }
   } while(0);
   $382=((2608+($idx_0_i<<2))|0);
   $383=((HEAP32[(($382)>>2)])|0);
   $384=($383|0)==0;
   L1884: do {
    if ($384) {
     $v_2_i=0;$rsize_2_i=$353;$t_1_i=0;
    } else {
     $386=($idx_0_i|0)==31;
     if ($386) {
      $391=0;
     } else {
      $388=$idx_0_i>>>1;
      $389=(((25)-($388))|0);
      $391=$389;
     }
     $392=$349<<$391;
     $v_0_i118=0;$rsize_0_i117=$353;$t_0_i116=$383;$sizebits_0_i=$392;$rst_0_i=0;
     while(1) {
      $394=(($t_0_i116+4)|0);
      $395=((HEAP32[(($394)>>2)])|0);
      $396=$395&-8;
      $397=((($396)-($349))|0);
      $398=($397>>>0)<($rsize_0_i117>>>0);
      if ($398) {
       $400=($396|0)==($349|0);
       if ($400) {
        $v_2_i=$t_0_i116;$rsize_2_i=$397;$t_1_i=$t_0_i116;
        break L1884;
       } else {
        $v_1_i=$t_0_i116;$rsize_1_i=$397;
       }
      } else {
       $v_1_i=$v_0_i118;$rsize_1_i=$rsize_0_i117;
      }
      $402=(($t_0_i116+20)|0);
      $403=((HEAP32[(($402)>>2)])|0);
      $404=$sizebits_0_i>>>31;
      $405=(($t_0_i116+16+($404<<2))|0);
      $406=((HEAP32[(($405)>>2)])|0);
      $407=($403|0)==0;
      $408=($403|0)==($406|0);
      $or_cond_i=$407|$408;
      $rst_1_i=($or_cond_i?$rst_0_i:$403);
      $409=($406|0)==0;
      $410=$sizebits_0_i<<1;
      if ($409) {
       $v_2_i=$v_1_i;$rsize_2_i=$rsize_1_i;$t_1_i=$rst_1_i;
       break;
      } else {
       $v_0_i118=$v_1_i;$rsize_0_i117=$rsize_1_i;$t_0_i116=$406;$sizebits_0_i=$410;$rst_0_i=$rst_1_i;
      }
     }
    }
   } while(0);
   $411=($t_1_i|0)==0;
   $412=($v_2_i|0)==0;
   $or_cond21_i=$411&$412;
   if ($or_cond21_i) {
    $414=2<<$idx_0_i;
    $415=(((-$414))|0);
    $416=$414|$415;
    $417=$350&$416;
    $418=($417|0)==0;
    if ($418) {
     $nb_0=$349;
     break;
    }
    $420=(((-$417))|0);
    $421=$417&$420;
    $422=((($421)-(1))|0);
    $423=$422>>>12;
    $424=$423&16;
    $425=$422>>>($424>>>0);
    $426=$425>>>5;
    $427=$426&8;
    $428=$427|$424;
    $429=$425>>>($427>>>0);
    $430=$429>>>2;
    $431=$430&4;
    $432=$428|$431;
    $433=$429>>>($431>>>0);
    $434=$433>>>1;
    $435=$434&2;
    $436=$432|$435;
    $437=$433>>>($435>>>0);
    $438=$437>>>1;
    $439=$438&1;
    $440=$436|$439;
    $441=$437>>>($439>>>0);
    $442=((($440)+($441))|0);
    $443=((2608+($442<<2))|0);
    $444=((HEAP32[(($443)>>2)])|0);
    $t_2_ph_i=$444;
   } else {
    $t_2_ph_i=$t_1_i;
   }
   $445=($t_2_ph_i|0)==0;
   if ($445) {
    $rsize_3_lcssa_i=$rsize_2_i;$v_3_lcssa_i=$v_2_i;
   } else {
    $t_228_i=$t_2_ph_i;$rsize_329_i=$rsize_2_i;$v_330_i=$v_2_i;
    while(1) {
     $446=(($t_228_i+4)|0);
     $447=((HEAP32[(($446)>>2)])|0);
     $448=$447&-8;
     $449=((($448)-($349))|0);
     $450=($449>>>0)<($rsize_329_i>>>0);
     $_rsize_3_i=($450?$449:$rsize_329_i);
     $t_2_v_3_i=($450?$t_228_i:$v_330_i);
     $451=(($t_228_i+16)|0);
     $452=((HEAP32[(($451)>>2)])|0);
     $453=($452|0)==0;
     if (!($453)) {
      $t_228_i=$452;$rsize_329_i=$_rsize_3_i;$v_330_i=$t_2_v_3_i;
      continue;
     }
     $454=(($t_228_i+20)|0);
     $455=((HEAP32[(($454)>>2)])|0);
     $456=($455|0)==0;
     if ($456) {
      $rsize_3_lcssa_i=$_rsize_3_i;$v_3_lcssa_i=$t_2_v_3_i;
      break;
     } else {
      $t_228_i=$455;$rsize_329_i=$_rsize_3_i;$v_330_i=$t_2_v_3_i;
     }
    }
   }
   $457=($v_3_lcssa_i|0)==0;
   if ($457) {
    $nb_0=$349;
    break;
   }
   $459=((HEAP32[((2312)>>2)])|0);
   $460=((($459)-($349))|0);
   $461=($rsize_3_lcssa_i>>>0)<($460>>>0);
   if (!($461)) {
    $nb_0=$349;
    break;
   }
   $463=$v_3_lcssa_i;
   $464=((HEAP32[((2320)>>2)])|0);
   $465=($463>>>0)<($464>>>0);
   if ($465) {
    _abort(); return ((0)|0);
    return ((0)|0);
   }
   $467=(($463+$349)|0);
   $468=$467;
   $469=($463>>>0)<($467>>>0);
   if (!($469)) {
    _abort(); return ((0)|0);
    return ((0)|0);
   }
   $471=(($v_3_lcssa_i+24)|0);
   $472=((HEAP32[(($471)>>2)])|0);
   $473=(($v_3_lcssa_i+12)|0);
   $474=((HEAP32[(($473)>>2)])|0);
   $475=($474|0)==($v_3_lcssa_i|0);
   do {
    if ($475) {
     $491=(($v_3_lcssa_i+20)|0);
     $492=((HEAP32[(($491)>>2)])|0);
     $493=($492|0)==0;
     if ($493) {
      $495=(($v_3_lcssa_i+16)|0);
      $496=((HEAP32[(($495)>>2)])|0);
      $497=($496|0)==0;
      if ($497) {
       $R_1_i122=0;
       break;
      } else {
       $R_0_i120=$496;$RP_0_i119=$495;
      }
     } else {
      $R_0_i120=$492;$RP_0_i119=$491;
     }
     while(1) {
      $498=(($R_0_i120+20)|0);
      $499=((HEAP32[(($498)>>2)])|0);
      $500=($499|0)==0;
      if (!($500)) {
       $R_0_i120=$499;$RP_0_i119=$498;
       continue;
      }
      $502=(($R_0_i120+16)|0);
      $503=((HEAP32[(($502)>>2)])|0);
      $504=($503|0)==0;
      if ($504) {
       break;
      } else {
       $R_0_i120=$503;$RP_0_i119=$502;
      }
     }
     $506=$RP_0_i119;
     $507=($506>>>0)<($464>>>0);
     if ($507) {
      _abort(); return ((0)|0);
      return ((0)|0);
     } else {
      HEAP32[(($RP_0_i119)>>2)]=0;
      $R_1_i122=$R_0_i120;
      break;
     }
    } else {
     $477=(($v_3_lcssa_i+8)|0);
     $478=((HEAP32[(($477)>>2)])|0);
     $479=$478;
     $480=($479>>>0)<($464>>>0);
     if ($480) {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
     $482=(($478+12)|0);
     $483=((HEAP32[(($482)>>2)])|0);
     $484=($483|0)==($v_3_lcssa_i|0);
     if (!($484)) {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
     $486=(($474+8)|0);
     $487=((HEAP32[(($486)>>2)])|0);
     $488=($487|0)==($v_3_lcssa_i|0);
     if ($488) {
      HEAP32[(($482)>>2)]=$474;
      HEAP32[(($486)>>2)]=$478;
      $R_1_i122=$474;
      break;
     } else {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
    }
   } while(0);
   $511=($472|0)==0;
   L1934: do {
    if (!($511)) {
     $513=(($v_3_lcssa_i+28)|0);
     $514=((HEAP32[(($513)>>2)])|0);
     $515=((2608+($514<<2))|0);
     $516=((HEAP32[(($515)>>2)])|0);
     $517=($v_3_lcssa_i|0)==($516|0);
     do {
      if ($517) {
       HEAP32[(($515)>>2)]=$R_1_i122;
       $cond_i123=($R_1_i122|0)==0;
       if (!($cond_i123)) {
        break;
       }
       $519=((HEAP32[(($513)>>2)])|0);
       $520=1<<$519;
       $521=$520^-1;
       $522=((HEAP32[((2308)>>2)])|0);
       $523=$522&$521;
       HEAP32[((2308)>>2)]=$523;
       break L1934;
      } else {
       $525=$472;
       $526=((HEAP32[((2320)>>2)])|0);
       $527=($525>>>0)<($526>>>0);
       if ($527) {
        _abort(); return ((0)|0);
        return ((0)|0);
       }
       $529=(($472+16)|0);
       $530=((HEAP32[(($529)>>2)])|0);
       $531=($530|0)==($v_3_lcssa_i|0);
       if ($531) {
        HEAP32[(($529)>>2)]=$R_1_i122;
       } else {
        $534=(($472+20)|0);
        HEAP32[(($534)>>2)]=$R_1_i122;
       }
       $537=($R_1_i122|0)==0;
       if ($537) {
        break L1934;
       }
      }
     } while(0);
     $539=$R_1_i122;
     $540=((HEAP32[((2320)>>2)])|0);
     $541=($539>>>0)<($540>>>0);
     if ($541) {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
     $543=(($R_1_i122+24)|0);
     HEAP32[(($543)>>2)]=$472;
     $544=(($v_3_lcssa_i+16)|0);
     $545=((HEAP32[(($544)>>2)])|0);
     $546=($545|0)==0;
     do {
      if (!($546)) {
       $548=$545;
       $549=((HEAP32[((2320)>>2)])|0);
       $550=($548>>>0)<($549>>>0);
       if ($550) {
        _abort(); return ((0)|0);
        return ((0)|0);
       } else {
        $552=(($R_1_i122+16)|0);
        HEAP32[(($552)>>2)]=$545;
        $553=(($545+24)|0);
        HEAP32[(($553)>>2)]=$R_1_i122;
        break;
       }
      }
     } while(0);
     $556=(($v_3_lcssa_i+20)|0);
     $557=((HEAP32[(($556)>>2)])|0);
     $558=($557|0)==0;
     if ($558) {
      break;
     }
     $560=$557;
     $561=((HEAP32[((2320)>>2)])|0);
     $562=($560>>>0)<($561>>>0);
     if ($562) {
      _abort(); return ((0)|0);
      return ((0)|0);
     } else {
      $564=(($R_1_i122+20)|0);
      HEAP32[(($564)>>2)]=$557;
      $565=(($557+24)|0);
      HEAP32[(($565)>>2)]=$R_1_i122;
      break;
     }
    }
   } while(0);
   $569=($rsize_3_lcssa_i>>>0)<((16)>>>0);
   do {
    if ($569) {
     $571=((($rsize_3_lcssa_i)+($349))|0);
     $572=$571|3;
     $573=(($v_3_lcssa_i+4)|0);
     HEAP32[(($573)>>2)]=$572;
     $_sum19_i=((($571)+(4))|0);
     $574=(($463+$_sum19_i)|0);
     $575=$574;
     $576=((HEAP32[(($575)>>2)])|0);
     $577=$576|1;
     HEAP32[(($575)>>2)]=$577;
    } else {
     $579=$349|3;
     $580=(($v_3_lcssa_i+4)|0);
     HEAP32[(($580)>>2)]=$579;
     $581=$rsize_3_lcssa_i|1;
     $_sum_i125136=$349|4;
     $582=(($463+$_sum_i125136)|0);
     $583=$582;
     HEAP32[(($583)>>2)]=$581;
     $_sum1_i126=((($rsize_3_lcssa_i)+($349))|0);
     $584=(($463+$_sum1_i126)|0);
     $585=$584;
     HEAP32[(($585)>>2)]=$rsize_3_lcssa_i;
     $586=$rsize_3_lcssa_i>>>3;
     $587=($rsize_3_lcssa_i>>>0)<((256)>>>0);
     if ($587) {
      $589=$586<<1;
      $590=((2344+($589<<2))|0);
      $591=$590;
      $592=((HEAP32[((2304)>>2)])|0);
      $593=1<<$586;
      $594=$592&$593;
      $595=($594|0)==0;
      do {
       if ($595) {
        $597=$592|$593;
        HEAP32[((2304)>>2)]=$597;
        $_sum15_pre_i=((($589)+(2))|0);
        $_pre_i127=((2344+($_sum15_pre_i<<2))|0);
        $F5_0_i=$591;$_pre_phi_i128=$_pre_i127;
       } else {
        $_sum18_i=((($589)+(2))|0);
        $599=((2344+($_sum18_i<<2))|0);
        $600=((HEAP32[(($599)>>2)])|0);
        $601=$600;
        $602=((HEAP32[((2320)>>2)])|0);
        $603=($601>>>0)<($602>>>0);
        if (!($603)) {
         $F5_0_i=$600;$_pre_phi_i128=$599;
         break;
        }
        _abort(); return ((0)|0);
        return ((0)|0);
       }
      } while(0);
      HEAP32[(($_pre_phi_i128)>>2)]=$468;
      $606=(($F5_0_i+12)|0);
      HEAP32[(($606)>>2)]=$468;
      $_sum16_i=((($349)+(8))|0);
      $607=(($463+$_sum16_i)|0);
      $608=$607;
      HEAP32[(($608)>>2)]=$F5_0_i;
      $_sum17_i=((($349)+(12))|0);
      $609=(($463+$_sum17_i)|0);
      $610=$609;
      HEAP32[(($610)>>2)]=$591;
      break;
     }
     $612=$467;
     $613=$rsize_3_lcssa_i>>>8;
     $614=($613|0)==0;
     do {
      if ($614) {
       $I7_0_i=0;
      } else {
       $616=($rsize_3_lcssa_i>>>0)>((16777215)>>>0);
       if ($616) {
        $I7_0_i=31;
        break;
       }
       $618=((($613)+(1048320))|0);
       $619=$618>>>16;
       $620=$619&8;
       $621=$613<<$620;
       $622=((($621)+(520192))|0);
       $623=$622>>>16;
       $624=$623&4;
       $625=$624|$620;
       $626=$621<<$624;
       $627=((($626)+(245760))|0);
       $628=$627>>>16;
       $629=$628&2;
       $630=$625|$629;
       $631=(((14)-($630))|0);
       $632=$626<<$629;
       $633=$632>>>15;
       $634=((($631)+($633))|0);
       $635=$634<<1;
       $636=((($634)+(7))|0);
       $637=$rsize_3_lcssa_i>>>($636>>>0);
       $638=$637&1;
       $639=$638|$635;
       $I7_0_i=$639;
      }
     } while(0);
     $641=((2608+($I7_0_i<<2))|0);
     $_sum2_i=((($349)+(28))|0);
     $642=(($463+$_sum2_i)|0);
     $643=$642;
     HEAP32[(($643)>>2)]=$I7_0_i;
     $_sum3_i129=((($349)+(16))|0);
     $644=(($463+$_sum3_i129)|0);
     $_sum4_i130=((($349)+(20))|0);
     $645=(($463+$_sum4_i130)|0);
     $646=$645;
     HEAP32[(($646)>>2)]=0;
     $647=$644;
     HEAP32[(($647)>>2)]=0;
     $648=((HEAP32[((2308)>>2)])|0);
     $649=1<<$I7_0_i;
     $650=$648&$649;
     $651=($650|0)==0;
     if ($651) {
      $653=$648|$649;
      HEAP32[((2308)>>2)]=$653;
      HEAP32[(($641)>>2)]=$612;
      $654=$641;
      $_sum5_i=((($349)+(24))|0);
      $655=(($463+$_sum5_i)|0);
      $656=$655;
      HEAP32[(($656)>>2)]=$654;
      $_sum6_i=((($349)+(12))|0);
      $657=(($463+$_sum6_i)|0);
      $658=$657;
      HEAP32[(($658)>>2)]=$612;
      $_sum7_i=((($349)+(8))|0);
      $659=(($463+$_sum7_i)|0);
      $660=$659;
      HEAP32[(($660)>>2)]=$612;
      break;
     }
     $662=((HEAP32[(($641)>>2)])|0);
     $663=($I7_0_i|0)==31;
     if ($663) {
      $668=0;
     } else {
      $665=$I7_0_i>>>1;
      $666=(((25)-($665))|0);
      $668=$666;
     }
     $669=$rsize_3_lcssa_i<<$668;
     $K12_0_i=$669;$T_0_i=$662;
     while(1) {
      $671=(($T_0_i+4)|0);
      $672=((HEAP32[(($671)>>2)])|0);
      $673=$672&-8;
      $674=($673|0)==($rsize_3_lcssa_i|0);
      if ($674) {
       break;
      }
      $676=$K12_0_i>>>31;
      $677=(($T_0_i+16+($676<<2))|0);
      $678=((HEAP32[(($677)>>2)])|0);
      $679=($678|0)==0;
      $680=$K12_0_i<<1;
      if ($679) {
       label = 1493;
       break;
      } else {
       $K12_0_i=$680;$T_0_i=$678;
      }
     }
     if ((label|0) == 1493) {
      $682=$677;
      $683=((HEAP32[((2320)>>2)])|0);
      $684=($682>>>0)<($683>>>0);
      if ($684) {
       _abort(); return ((0)|0);
       return ((0)|0);
      } else {
       HEAP32[(($677)>>2)]=$612;
       $_sum12_i=((($349)+(24))|0);
       $686=(($463+$_sum12_i)|0);
       $687=$686;
       HEAP32[(($687)>>2)]=$T_0_i;
       $_sum13_i=((($349)+(12))|0);
       $688=(($463+$_sum13_i)|0);
       $689=$688;
       HEAP32[(($689)>>2)]=$612;
       $_sum14_i=((($349)+(8))|0);
       $690=(($463+$_sum14_i)|0);
       $691=$690;
       HEAP32[(($691)>>2)]=$612;
       break;
      }
     }
     $694=(($T_0_i+8)|0);
     $695=((HEAP32[(($694)>>2)])|0);
     $696=$T_0_i;
     $697=((HEAP32[((2320)>>2)])|0);
     $698=($696>>>0)<($697>>>0);
     if ($698) {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
     $700=$695;
     $701=($700>>>0)<($697>>>0);
     if ($701) {
      _abort(); return ((0)|0);
      return ((0)|0);
     } else {
      $703=(($695+12)|0);
      HEAP32[(($703)>>2)]=$612;
      HEAP32[(($694)>>2)]=$612;
      $_sum9_i=((($349)+(8))|0);
      $704=(($463+$_sum9_i)|0);
      $705=$704;
      HEAP32[(($705)>>2)]=$695;
      $_sum10_i=((($349)+(12))|0);
      $706=(($463+$_sum10_i)|0);
      $707=$706;
      HEAP32[(($707)>>2)]=$T_0_i;
      $_sum11_i=((($349)+(24))|0);
      $708=(($463+$_sum11_i)|0);
      $709=$708;
      HEAP32[(($709)>>2)]=0;
      break;
     }
    }
   } while(0);
   $711=(($v_3_lcssa_i+8)|0);
   $712=$711;
   $713=($711|0)==0;
   if ($713) {
    $nb_0=$349;
    break;
   } else {
    $mem_0=$712;
   }
   return (($mem_0)|0);
  }
 } while(0);
 $714=((HEAP32[((2312)>>2)])|0);
 $715=($nb_0>>>0)>($714>>>0);
 if (!($715)) {
  $717=((($714)-($nb_0))|0);
  $718=((HEAP32[((2324)>>2)])|0);
  $719=($717>>>0)>((15)>>>0);
  if ($719) {
   $721=$718;
   $722=(($721+$nb_0)|0);
   $723=$722;
   HEAP32[((2324)>>2)]=$723;
   HEAP32[((2312)>>2)]=$717;
   $724=$717|1;
   $_sum102=((($nb_0)+(4))|0);
   $725=(($721+$_sum102)|0);
   $726=$725;
   HEAP32[(($726)>>2)]=$724;
   $727=(($721+$714)|0);
   $728=$727;
   HEAP32[(($728)>>2)]=$717;
   $729=$nb_0|3;
   $730=(($718+4)|0);
   HEAP32[(($730)>>2)]=$729;
  } else {
   HEAP32[((2312)>>2)]=0;
   HEAP32[((2324)>>2)]=0;
   $732=$714|3;
   $733=(($718+4)|0);
   HEAP32[(($733)>>2)]=$732;
   $734=$718;
   $_sum101=((($714)+(4))|0);
   $735=(($734+$_sum101)|0);
   $736=$735;
   $737=((HEAP32[(($736)>>2)])|0);
   $738=$737|1;
   HEAP32[(($736)>>2)]=$738;
  }
  $740=(($718+8)|0);
  $741=$740;
  $mem_0=$741;
  return (($mem_0)|0);
 }
 $743=((HEAP32[((2316)>>2)])|0);
 $744=($nb_0>>>0)<($743>>>0);
 if ($744) {
  $746=((($743)-($nb_0))|0);
  HEAP32[((2316)>>2)]=$746;
  $747=((HEAP32[((2328)>>2)])|0);
  $748=$747;
  $749=(($748+$nb_0)|0);
  $750=$749;
  HEAP32[((2328)>>2)]=$750;
  $751=$746|1;
  $_sum=((($nb_0)+(4))|0);
  $752=(($748+$_sum)|0);
  $753=$752;
  HEAP32[(($753)>>2)]=$751;
  $754=$nb_0|3;
  $755=(($747+4)|0);
  HEAP32[(($755)>>2)]=$754;
  $756=(($747+8)|0);
  $757=$756;
  $mem_0=$757;
  return (($mem_0)|0);
 }
 $759=((HEAP32[((2280)>>2)])|0);
 $760=($759|0)==0;
 do {
  if ($760) {
   $762=((_sysconf(((30)|0)))|0);
   $763=((($762)-(1))|0);
   $764=$763&$762;
   $765=($764|0)==0;
   if ($765) {
    HEAP32[((2288)>>2)]=$762;
    HEAP32[((2284)>>2)]=$762;
    HEAP32[((2292)>>2)]=-1;
    HEAP32[((2296)>>2)]=-1;
    HEAP32[((2300)>>2)]=0;
    HEAP32[((2748)>>2)]=0;
    $767=((_time(((0)|0)))|0);
    $768=$767&-16;
    $769=$768^1431655768;
    HEAP32[((2280)>>2)]=$769;
    break;
   } else {
    _abort(); return ((0)|0);
    return ((0)|0);
   }
  }
 } while(0);
 $771=((($nb_0)+(48))|0);
 $772=((HEAP32[((2288)>>2)])|0);
 $773=((($nb_0)+(47))|0);
 $774=((($772)+($773))|0);
 $775=(((-$772))|0);
 $776=$774&$775;
 $777=($776>>>0)>($nb_0>>>0);
 if (!($777)) {
  $mem_0=0;
  return (($mem_0)|0);
 }
 $779=((HEAP32[((2744)>>2)])|0);
 $780=($779|0)==0;
 do {
  if (!($780)) {
   $782=((HEAP32[((2736)>>2)])|0);
   $783=((($782)+($776))|0);
   $784=($783>>>0)<=($782>>>0);
   $785=($783>>>0)>($779>>>0);
   $or_cond1_i=$784|$785;
   if ($or_cond1_i) {
    $mem_0=0;
   } else {
    break;
   }
   return (($mem_0)|0);
  }
 } while(0);
 $787=((HEAP32[((2748)>>2)])|0);
 $788=$787&4;
 $789=($788|0)==0;
 L2026: do {
  if ($789) {
   $791=((HEAP32[((2328)>>2)])|0);
   $792=($791|0)==0;
   L2028: do {
    if ($792) {
     label = 1523;
    } else {
     $794=$791;
     $sp_0_i_i=2752;
     while(1) {
      $796=(($sp_0_i_i)|0);
      $797=((HEAP32[(($796)>>2)])|0);
      $798=($797>>>0)>($794>>>0);
      if (!($798)) {
       $800=(($sp_0_i_i+4)|0);
       $801=((HEAP32[(($800)>>2)])|0);
       $802=(($797+$801)|0);
       $803=($802>>>0)>($794>>>0);
       if ($803) {
        break;
       }
      }
      $805=(($sp_0_i_i+8)|0);
      $806=((HEAP32[(($805)>>2)])|0);
      $807=($806|0)==0;
      if ($807) {
       label = 1523;
       break L2028;
      } else {
       $sp_0_i_i=$806;
      }
     }
     $808=($sp_0_i_i|0)==0;
     if ($808) {
      label = 1523;
      break;
     }
     $838=((HEAP32[((2316)>>2)])|0);
     $839=((($774)-($838))|0);
     $840=$839&$775;
     $841=($840>>>0)<((2147483647)>>>0);
     if (!($841)) {
      $tsize_0303639_i=0;
      break;
     }
     $843=((_sbrk((($840)|0)))|0);
     $844=((HEAP32[(($796)>>2)])|0);
     $845=((HEAP32[(($800)>>2)])|0);
     $846=(($844+$845)|0);
     $847=($843|0)==($846|0);
     $_3_i=($847?$840:0);
     $_4_i=($847?$843:-1);
     $tbase_0_i=$_4_i;$tsize_0_i=$_3_i;$br_0_i=$843;$ssize_1_i=$840;
     label = 1532;
    }
   } while(0);
   do {
    if ((label|0) == 1523) {
     $809=((_sbrk(((0)|0)))|0);
     $810=($809|0)==-1;
     if ($810) {
      $tsize_0303639_i=0;
      break;
     }
     $812=$809;
     $813=((HEAP32[((2284)>>2)])|0);
     $814=((($813)-(1))|0);
     $815=$814&$812;
     $816=($815|0)==0;
     if ($816) {
      $ssize_0_i=$776;
     } else {
      $818=((($814)+($812))|0);
      $819=(((-$813))|0);
      $820=$818&$819;
      $821=((($776)-($812))|0);
      $822=((($821)+($820))|0);
      $ssize_0_i=$822;
     }
     $824=((HEAP32[((2736)>>2)])|0);
     $825=((($824)+($ssize_0_i))|0);
     $826=($ssize_0_i>>>0)>($nb_0>>>0);
     $827=($ssize_0_i>>>0)<((2147483647)>>>0);
     $or_cond_i131=$826&$827;
     if (!($or_cond_i131)) {
      $tsize_0303639_i=0;
      break;
     }
     $829=((HEAP32[((2744)>>2)])|0);
     $830=($829|0)==0;
     if (!($830)) {
      $832=($825>>>0)<=($824>>>0);
      $833=($825>>>0)>($829>>>0);
      $or_cond2_i=$832|$833;
      if ($or_cond2_i) {
       $tsize_0303639_i=0;
       break;
      }
     }
     $835=((_sbrk((($ssize_0_i)|0)))|0);
     $836=($835|0)==($809|0);
     $ssize_0__i=($836?$ssize_0_i:0);
     $__i=($836?$809:-1);
     $tbase_0_i=$__i;$tsize_0_i=$ssize_0__i;$br_0_i=$835;$ssize_1_i=$ssize_0_i;
     label = 1532;
    }
   } while(0);
   L2048: do {
    if ((label|0) == 1532) {
     $849=(((-$ssize_1_i))|0);
     $850=($tbase_0_i|0)==-1;
     if (!($850)) {
      $tsize_244_i=$tsize_0_i;$tbase_245_i=$tbase_0_i;
      label = 1543;
      break L2026;
     }
     $852=($br_0_i|0)!=-1;
     $853=($ssize_1_i>>>0)<((2147483647)>>>0);
     $or_cond5_i=$852&$853;
     $854=($ssize_1_i>>>0)<($771>>>0);
     $or_cond6_i=$or_cond5_i&$854;
     do {
      if ($or_cond6_i) {
       $856=((HEAP32[((2288)>>2)])|0);
       $857=((($773)-($ssize_1_i))|0);
       $858=((($857)+($856))|0);
       $859=(((-$856))|0);
       $860=$858&$859;
       $861=($860>>>0)<((2147483647)>>>0);
       if (!($861)) {
        $ssize_2_i=$ssize_1_i;
        break;
       }
       $863=((_sbrk((($860)|0)))|0);
       $864=($863|0)==-1;
       if ($864) {
        $868=((_sbrk((($849)|0)))|0);
        $tsize_0303639_i=$tsize_0_i;
        break L2048;
       } else {
        $866=((($860)+($ssize_1_i))|0);
        $ssize_2_i=$866;
        break;
       }
      } else {
       $ssize_2_i=$ssize_1_i;
      }
     } while(0);
     $870=($br_0_i|0)==-1;
     if ($870) {
      $tsize_0303639_i=$tsize_0_i;
     } else {
      $tsize_244_i=$ssize_2_i;$tbase_245_i=$br_0_i;
      label = 1543;
      break L2026;
     }
    }
   } while(0);
   $871=((HEAP32[((2748)>>2)])|0);
   $872=$871|4;
   HEAP32[((2748)>>2)]=$872;
   $tsize_1_i=$tsize_0303639_i;
   label = 1540;
  } else {
   $tsize_1_i=0;
   label = 1540;
  }
 } while(0);
 do {
  if ((label|0) == 1540) {
   $874=($776>>>0)<((2147483647)>>>0);
   if (!($874)) {
    break;
   }
   $876=((_sbrk((($776)|0)))|0);
   $877=((_sbrk(((0)|0)))|0);
   $notlhs_i=($876|0)!=-1;
   $notrhs_i=($877|0)!=-1;
   $or_cond8_not_i=$notrhs_i&$notlhs_i;
   $878=($876>>>0)<($877>>>0);
   $or_cond9_i=$or_cond8_not_i&$878;
   if (!($or_cond9_i)) {
    break;
   }
   $879=$877;
   $880=$876;
   $881=((($879)-($880))|0);
   $882=((($nb_0)+(40))|0);
   $883=($881>>>0)>($882>>>0);
   $_tsize_1_i=($883?$881:$tsize_1_i);
   $_tbase_1_i=($883?$876:-1);
   $884=($_tbase_1_i|0)==-1;
   if (!($884)) {
    $tsize_244_i=$_tsize_1_i;$tbase_245_i=$_tbase_1_i;
    label = 1543;
   }
  }
 } while(0);
 do {
  if ((label|0) == 1543) {
   $885=((HEAP32[((2736)>>2)])|0);
   $886=((($885)+($tsize_244_i))|0);
   HEAP32[((2736)>>2)]=$886;
   $887=((HEAP32[((2740)>>2)])|0);
   $888=($886>>>0)>($887>>>0);
   if ($888) {
    HEAP32[((2740)>>2)]=$886;
   }
   $890=((HEAP32[((2328)>>2)])|0);
   $891=($890|0)==0;
   L2068: do {
    if ($891) {
     $893=((HEAP32[((2320)>>2)])|0);
     $894=($893|0)==0;
     $895=($tbase_245_i>>>0)<($893>>>0);
     $or_cond10_i=$894|$895;
     if ($or_cond10_i) {
      HEAP32[((2320)>>2)]=$tbase_245_i;
     }
     HEAP32[((2752)>>2)]=$tbase_245_i;
     HEAP32[((2756)>>2)]=$tsize_244_i;
     HEAP32[((2764)>>2)]=0;
     $897=((HEAP32[((2280)>>2)])|0);
     HEAP32[((2340)>>2)]=$897;
     HEAP32[((2336)>>2)]=-1;
     $i_02_i_i=0;
     while(1) {
      $899=$i_02_i_i<<1;
      $900=((2344+($899<<2))|0);
      $901=$900;
      $_sum_i_i=((($899)+(3))|0);
      $902=((2344+($_sum_i_i<<2))|0);
      HEAP32[(($902)>>2)]=$901;
      $_sum1_i_i=((($899)+(2))|0);
      $903=((2344+($_sum1_i_i<<2))|0);
      HEAP32[(($903)>>2)]=$901;
      $904=((($i_02_i_i)+(1))|0);
      $905=($904>>>0)<((32)>>>0);
      if ($905) {
       $i_02_i_i=$904;
      } else {
       break;
      }
     }
     $906=((($tsize_244_i)-(40))|0);
     $907=(($tbase_245_i+8)|0);
     $908=$907;
     $909=$908&7;
     $910=($909|0)==0;
     if ($910) {
      $914=0;
     } else {
      $912=(((-$908))|0);
      $913=$912&7;
      $914=$913;
     }
     $915=(($tbase_245_i+$914)|0);
     $916=$915;
     $917=((($906)-($914))|0);
     HEAP32[((2328)>>2)]=$916;
     HEAP32[((2316)>>2)]=$917;
     $918=$917|1;
     $_sum_i14_i=((($914)+(4))|0);
     $919=(($tbase_245_i+$_sum_i14_i)|0);
     $920=$919;
     HEAP32[(($920)>>2)]=$918;
     $_sum2_i_i=((($tsize_244_i)-(36))|0);
     $921=(($tbase_245_i+$_sum2_i_i)|0);
     $922=$921;
     HEAP32[(($922)>>2)]=40;
     $923=((HEAP32[((2296)>>2)])|0);
     HEAP32[((2332)>>2)]=$923;
    } else {
     $sp_067_i=2752;
     while(1) {
      $924=(($sp_067_i)|0);
      $925=((HEAP32[(($924)>>2)])|0);
      $926=(($sp_067_i+4)|0);
      $927=((HEAP32[(($926)>>2)])|0);
      $928=(($925+$927)|0);
      $929=($tbase_245_i|0)==($928|0);
      if ($929) {
       label = 1555;
       break;
      }
      $931=(($sp_067_i+8)|0);
      $932=((HEAP32[(($931)>>2)])|0);
      $933=($932|0)==0;
      if ($933) {
       break;
      } else {
       $sp_067_i=$932;
      }
     }
     do {
      if ((label|0) == 1555) {
       $934=(($sp_067_i+12)|0);
       $935=((HEAP32[(($934)>>2)])|0);
       $936=$935&8;
       $937=($936|0)==0;
       if (!($937)) {
        break;
       }
       $939=$890;
       $940=($939>>>0)>=($925>>>0);
       $941=($939>>>0)<($tbase_245_i>>>0);
       $or_cond47_i=$940&$941;
       if (!($or_cond47_i)) {
        break;
       }
       $943=((($927)+($tsize_244_i))|0);
       HEAP32[(($926)>>2)]=$943;
       $944=((HEAP32[((2328)>>2)])|0);
       $945=((HEAP32[((2316)>>2)])|0);
       $946=((($945)+($tsize_244_i))|0);
       $947=$944;
       $948=(($944+8)|0);
       $949=$948;
       $950=$949&7;
       $951=($950|0)==0;
       if ($951) {
        $955=0;
       } else {
        $953=(((-$949))|0);
        $954=$953&7;
        $955=$954;
       }
       $956=(($947+$955)|0);
       $957=$956;
       $958=((($946)-($955))|0);
       HEAP32[((2328)>>2)]=$957;
       HEAP32[((2316)>>2)]=$958;
       $959=$958|1;
       $_sum_i18_i=((($955)+(4))|0);
       $960=(($947+$_sum_i18_i)|0);
       $961=$960;
       HEAP32[(($961)>>2)]=$959;
       $_sum2_i19_i=((($946)+(4))|0);
       $962=(($947+$_sum2_i19_i)|0);
       $963=$962;
       HEAP32[(($963)>>2)]=40;
       $964=((HEAP32[((2296)>>2)])|0);
       HEAP32[((2332)>>2)]=$964;
       break L2068;
      }
     } while(0);
     $965=((HEAP32[((2320)>>2)])|0);
     $966=($tbase_245_i>>>0)<($965>>>0);
     if ($966) {
      HEAP32[((2320)>>2)]=$tbase_245_i;
     }
     $968=(($tbase_245_i+$tsize_244_i)|0);
     $sp_160_i=2752;
     while(1) {
      $970=(($sp_160_i)|0);
      $971=((HEAP32[(($970)>>2)])|0);
      $972=($971|0)==($968|0);
      if ($972) {
       label = 1565;
       break;
      }
      $974=(($sp_160_i+8)|0);
      $975=((HEAP32[(($974)>>2)])|0);
      $976=($975|0)==0;
      if ($976) {
       break;
      } else {
       $sp_160_i=$975;
      }
     }
     do {
      if ((label|0) == 1565) {
       $977=(($sp_160_i+12)|0);
       $978=((HEAP32[(($977)>>2)])|0);
       $979=$978&8;
       $980=($979|0)==0;
       if (!($980)) {
        break;
       }
       HEAP32[(($970)>>2)]=$tbase_245_i;
       $982=(($sp_160_i+4)|0);
       $983=((HEAP32[(($982)>>2)])|0);
       $984=((($983)+($tsize_244_i))|0);
       HEAP32[(($982)>>2)]=$984;
       $985=(($tbase_245_i+8)|0);
       $986=$985;
       $987=$986&7;
       $988=($987|0)==0;
       if ($988) {
        $993=0;
       } else {
        $990=(((-$986))|0);
        $991=$990&7;
        $993=$991;
       }
       $994=(($tbase_245_i+$993)|0);
       $_sum93_i=((($tsize_244_i)+(8))|0);
       $995=(($tbase_245_i+$_sum93_i)|0);
       $996=$995;
       $997=$996&7;
       $998=($997|0)==0;
       if ($998) {
        $1003=0;
       } else {
        $1000=(((-$996))|0);
        $1001=$1000&7;
        $1003=$1001;
       }
       $_sum94_i=((($1003)+($tsize_244_i))|0);
       $1004=(($tbase_245_i+$_sum94_i)|0);
       $1005=$1004;
       $1006=$1004;
       $1007=$994;
       $1008=((($1006)-($1007))|0);
       $_sum_i21_i=((($993)+($nb_0))|0);
       $1009=(($tbase_245_i+$_sum_i21_i)|0);
       $1010=$1009;
       $1011=((($1008)-($nb_0))|0);
       $1012=$nb_0|3;
       $_sum1_i22_i=((($993)+(4))|0);
       $1013=(($tbase_245_i+$_sum1_i22_i)|0);
       $1014=$1013;
       HEAP32[(($1014)>>2)]=$1012;
       $1015=((HEAP32[((2328)>>2)])|0);
       $1016=($1005|0)==($1015|0);
       do {
        if ($1016) {
         $1018=((HEAP32[((2316)>>2)])|0);
         $1019=((($1018)+($1011))|0);
         HEAP32[((2316)>>2)]=$1019;
         HEAP32[((2328)>>2)]=$1010;
         $1020=$1019|1;
         $_sum46_i_i=((($_sum_i21_i)+(4))|0);
         $1021=(($tbase_245_i+$_sum46_i_i)|0);
         $1022=$1021;
         HEAP32[(($1022)>>2)]=$1020;
        } else {
         $1024=((HEAP32[((2324)>>2)])|0);
         $1025=($1005|0)==($1024|0);
         if ($1025) {
          $1027=((HEAP32[((2312)>>2)])|0);
          $1028=((($1027)+($1011))|0);
          HEAP32[((2312)>>2)]=$1028;
          HEAP32[((2324)>>2)]=$1010;
          $1029=$1028|1;
          $_sum44_i_i=((($_sum_i21_i)+(4))|0);
          $1030=(($tbase_245_i+$_sum44_i_i)|0);
          $1031=$1030;
          HEAP32[(($1031)>>2)]=$1029;
          $_sum45_i_i=((($1028)+($_sum_i21_i))|0);
          $1032=(($tbase_245_i+$_sum45_i_i)|0);
          $1033=$1032;
          HEAP32[(($1033)>>2)]=$1028;
          break;
         }
         $_sum2_i23_i=((($tsize_244_i)+(4))|0);
         $_sum95_i=((($_sum2_i23_i)+($1003))|0);
         $1035=(($tbase_245_i+$_sum95_i)|0);
         $1036=$1035;
         $1037=((HEAP32[(($1036)>>2)])|0);
         $1038=$1037&3;
         $1039=($1038|0)==1;
         if ($1039) {
          $1041=$1037&-8;
          $1042=$1037>>>3;
          $1043=($1037>>>0)<((256)>>>0);
          L2113: do {
           if ($1043) {
            $_sum3940_i_i=$1003|8;
            $_sum105_i=((($_sum3940_i_i)+($tsize_244_i))|0);
            $1045=(($tbase_245_i+$_sum105_i)|0);
            $1046=$1045;
            $1047=((HEAP32[(($1046)>>2)])|0);
            $_sum41_i_i=((($tsize_244_i)+(12))|0);
            $_sum106_i=((($_sum41_i_i)+($1003))|0);
            $1048=(($tbase_245_i+$_sum106_i)|0);
            $1049=$1048;
            $1050=((HEAP32[(($1049)>>2)])|0);
            $1051=$1042<<1;
            $1052=((2344+($1051<<2))|0);
            $1053=$1052;
            $1054=($1047|0)==($1053|0);
            do {
             if (!($1054)) {
              $1056=$1047;
              $1057=((HEAP32[((2320)>>2)])|0);
              $1058=($1056>>>0)<($1057>>>0);
              if ($1058) {
               _abort(); return ((0)|0);
               return ((0)|0);
              }
              $1060=(($1047+12)|0);
              $1061=((HEAP32[(($1060)>>2)])|0);
              $1062=($1061|0)==($1005|0);
              if ($1062) {
               break;
              }
              _abort(); return ((0)|0);
              return ((0)|0);
             }
            } while(0);
            $1063=($1050|0)==($1047|0);
            if ($1063) {
             $1065=1<<$1042;
             $1066=$1065^-1;
             $1067=((HEAP32[((2304)>>2)])|0);
             $1068=$1067&$1066;
             HEAP32[((2304)>>2)]=$1068;
             break;
            }
            $1070=($1050|0)==($1053|0);
            do {
             if ($1070) {
              $_pre56_i_i=(($1050+8)|0);
              $_pre_phi57_i_i=$_pre56_i_i;
             } else {
              $1072=$1050;
              $1073=((HEAP32[((2320)>>2)])|0);
              $1074=($1072>>>0)<($1073>>>0);
              if ($1074) {
               _abort(); return ((0)|0);
               return ((0)|0);
              }
              $1076=(($1050+8)|0);
              $1077=((HEAP32[(($1076)>>2)])|0);
              $1078=($1077|0)==($1005|0);
              if ($1078) {
               $_pre_phi57_i_i=$1076;
               break;
              }
              _abort(); return ((0)|0);
              return ((0)|0);
             }
            } while(0);
            $1079=(($1047+12)|0);
            HEAP32[(($1079)>>2)]=$1050;
            HEAP32[(($_pre_phi57_i_i)>>2)]=$1047;
           } else {
            $1081=$1004;
            $_sum34_i_i=$1003|24;
            $_sum96_i=((($_sum34_i_i)+($tsize_244_i))|0);
            $1082=(($tbase_245_i+$_sum96_i)|0);
            $1083=$1082;
            $1084=((HEAP32[(($1083)>>2)])|0);
            $_sum5_i_i=((($tsize_244_i)+(12))|0);
            $_sum97_i=((($_sum5_i_i)+($1003))|0);
            $1085=(($tbase_245_i+$_sum97_i)|0);
            $1086=$1085;
            $1087=((HEAP32[(($1086)>>2)])|0);
            $1088=($1087|0)==($1081|0);
            do {
             if ($1088) {
              $_sum67_i_i=$1003|16;
              $_sum103_i=((($_sum2_i23_i)+($_sum67_i_i))|0);
              $1106=(($tbase_245_i+$_sum103_i)|0);
              $1107=$1106;
              $1108=((HEAP32[(($1107)>>2)])|0);
              $1109=($1108|0)==0;
              if ($1109) {
               $_sum104_i=((($_sum67_i_i)+($tsize_244_i))|0);
               $1111=(($tbase_245_i+$_sum104_i)|0);
               $1112=$1111;
               $1113=((HEAP32[(($1112)>>2)])|0);
               $1114=($1113|0)==0;
               if ($1114) {
                $R_1_i_i=0;
                break;
               } else {
                $R_0_i_i=$1113;$RP_0_i_i=$1112;
               }
              } else {
               $R_0_i_i=$1108;$RP_0_i_i=$1107;
              }
              while(1) {
               $1115=(($R_0_i_i+20)|0);
               $1116=((HEAP32[(($1115)>>2)])|0);
               $1117=($1116|0)==0;
               if (!($1117)) {
                $R_0_i_i=$1116;$RP_0_i_i=$1115;
                continue;
               }
               $1119=(($R_0_i_i+16)|0);
               $1120=((HEAP32[(($1119)>>2)])|0);
               $1121=($1120|0)==0;
               if ($1121) {
                break;
               } else {
                $R_0_i_i=$1120;$RP_0_i_i=$1119;
               }
              }
              $1123=$RP_0_i_i;
              $1124=((HEAP32[((2320)>>2)])|0);
              $1125=($1123>>>0)<($1124>>>0);
              if ($1125) {
               _abort(); return ((0)|0);
               return ((0)|0);
              } else {
               HEAP32[(($RP_0_i_i)>>2)]=0;
               $R_1_i_i=$R_0_i_i;
               break;
              }
             } else {
              $_sum3637_i_i=$1003|8;
              $_sum98_i=((($_sum3637_i_i)+($tsize_244_i))|0);
              $1090=(($tbase_245_i+$_sum98_i)|0);
              $1091=$1090;
              $1092=((HEAP32[(($1091)>>2)])|0);
              $1093=$1092;
              $1094=((HEAP32[((2320)>>2)])|0);
              $1095=($1093>>>0)<($1094>>>0);
              if ($1095) {
               _abort(); return ((0)|0);
               return ((0)|0);
              }
              $1097=(($1092+12)|0);
              $1098=((HEAP32[(($1097)>>2)])|0);
              $1099=($1098|0)==($1081|0);
              if (!($1099)) {
               _abort(); return ((0)|0);
               return ((0)|0);
              }
              $1101=(($1087+8)|0);
              $1102=((HEAP32[(($1101)>>2)])|0);
              $1103=($1102|0)==($1081|0);
              if ($1103) {
               HEAP32[(($1097)>>2)]=$1087;
               HEAP32[(($1101)>>2)]=$1092;
               $R_1_i_i=$1087;
               break;
              } else {
               _abort(); return ((0)|0);
               return ((0)|0);
              }
             }
            } while(0);
            $1129=($1084|0)==0;
            if ($1129) {
             break;
            }
            $_sum31_i_i=((($tsize_244_i)+(28))|0);
            $_sum99_i=((($_sum31_i_i)+($1003))|0);
            $1131=(($tbase_245_i+$_sum99_i)|0);
            $1132=$1131;
            $1133=((HEAP32[(($1132)>>2)])|0);
            $1134=((2608+($1133<<2))|0);
            $1135=((HEAP32[(($1134)>>2)])|0);
            $1136=($1081|0)==($1135|0);
            do {
             if ($1136) {
              HEAP32[(($1134)>>2)]=$R_1_i_i;
              $cond_i_i=($R_1_i_i|0)==0;
              if (!($cond_i_i)) {
               break;
              }
              $1138=((HEAP32[(($1132)>>2)])|0);
              $1139=1<<$1138;
              $1140=$1139^-1;
              $1141=((HEAP32[((2308)>>2)])|0);
              $1142=$1141&$1140;
              HEAP32[((2308)>>2)]=$1142;
              break L2113;
             } else {
              $1144=$1084;
              $1145=((HEAP32[((2320)>>2)])|0);
              $1146=($1144>>>0)<($1145>>>0);
              if ($1146) {
               _abort(); return ((0)|0);
               return ((0)|0);
              }
              $1148=(($1084+16)|0);
              $1149=((HEAP32[(($1148)>>2)])|0);
              $1150=($1149|0)==($1081|0);
              if ($1150) {
               HEAP32[(($1148)>>2)]=$R_1_i_i;
              } else {
               $1153=(($1084+20)|0);
               HEAP32[(($1153)>>2)]=$R_1_i_i;
              }
              $1156=($R_1_i_i|0)==0;
              if ($1156) {
               break L2113;
              }
             }
            } while(0);
            $1158=$R_1_i_i;
            $1159=((HEAP32[((2320)>>2)])|0);
            $1160=($1158>>>0)<($1159>>>0);
            if ($1160) {
             _abort(); return ((0)|0);
             return ((0)|0);
            }
            $1162=(($R_1_i_i+24)|0);
            HEAP32[(($1162)>>2)]=$1084;
            $_sum3233_i_i=$1003|16;
            $_sum100_i=((($_sum3233_i_i)+($tsize_244_i))|0);
            $1163=(($tbase_245_i+$_sum100_i)|0);
            $1164=$1163;
            $1165=((HEAP32[(($1164)>>2)])|0);
            $1166=($1165|0)==0;
            do {
             if (!($1166)) {
              $1168=$1165;
              $1169=((HEAP32[((2320)>>2)])|0);
              $1170=($1168>>>0)<($1169>>>0);
              if ($1170) {
               _abort(); return ((0)|0);
               return ((0)|0);
              } else {
               $1172=(($R_1_i_i+16)|0);
               HEAP32[(($1172)>>2)]=$1165;
               $1173=(($1165+24)|0);
               HEAP32[(($1173)>>2)]=$R_1_i_i;
               break;
              }
             }
            } while(0);
            $_sum101_i=((($_sum2_i23_i)+($_sum3233_i_i))|0);
            $1176=(($tbase_245_i+$_sum101_i)|0);
            $1177=$1176;
            $1178=((HEAP32[(($1177)>>2)])|0);
            $1179=($1178|0)==0;
            if ($1179) {
             break;
            }
            $1181=$1178;
            $1182=((HEAP32[((2320)>>2)])|0);
            $1183=($1181>>>0)<($1182>>>0);
            if ($1183) {
             _abort(); return ((0)|0);
             return ((0)|0);
            } else {
             $1185=(($R_1_i_i+20)|0);
             HEAP32[(($1185)>>2)]=$1178;
             $1186=(($1178+24)|0);
             HEAP32[(($1186)>>2)]=$R_1_i_i;
             break;
            }
           }
          } while(0);
          $_sum9_i_i=$1041|$1003;
          $_sum102_i=((($_sum9_i_i)+($tsize_244_i))|0);
          $1190=(($tbase_245_i+$_sum102_i)|0);
          $1191=$1190;
          $1192=((($1041)+($1011))|0);
          $oldfirst_0_i_i=$1191;$qsize_0_i_i=$1192;
         } else {
          $oldfirst_0_i_i=$1005;$qsize_0_i_i=$1011;
         }
         $1194=(($oldfirst_0_i_i+4)|0);
         $1195=((HEAP32[(($1194)>>2)])|0);
         $1196=$1195&-2;
         HEAP32[(($1194)>>2)]=$1196;
         $1197=$qsize_0_i_i|1;
         $_sum10_i_i=((($_sum_i21_i)+(4))|0);
         $1198=(($tbase_245_i+$_sum10_i_i)|0);
         $1199=$1198;
         HEAP32[(($1199)>>2)]=$1197;
         $_sum11_i_i=((($qsize_0_i_i)+($_sum_i21_i))|0);
         $1200=(($tbase_245_i+$_sum11_i_i)|0);
         $1201=$1200;
         HEAP32[(($1201)>>2)]=$qsize_0_i_i;
         $1202=$qsize_0_i_i>>>3;
         $1203=($qsize_0_i_i>>>0)<((256)>>>0);
         if ($1203) {
          $1205=$1202<<1;
          $1206=((2344+($1205<<2))|0);
          $1207=$1206;
          $1208=((HEAP32[((2304)>>2)])|0);
          $1209=1<<$1202;
          $1210=$1208&$1209;
          $1211=($1210|0)==0;
          do {
           if ($1211) {
            $1213=$1208|$1209;
            HEAP32[((2304)>>2)]=$1213;
            $_sum27_pre_i_i=((($1205)+(2))|0);
            $_pre_i24_i=((2344+($_sum27_pre_i_i<<2))|0);
            $F4_0_i_i=$1207;$_pre_phi_i25_i=$_pre_i24_i;
           } else {
            $_sum30_i_i=((($1205)+(2))|0);
            $1215=((2344+($_sum30_i_i<<2))|0);
            $1216=((HEAP32[(($1215)>>2)])|0);
            $1217=$1216;
            $1218=((HEAP32[((2320)>>2)])|0);
            $1219=($1217>>>0)<($1218>>>0);
            if (!($1219)) {
             $F4_0_i_i=$1216;$_pre_phi_i25_i=$1215;
             break;
            }
            _abort(); return ((0)|0);
            return ((0)|0);
           }
          } while(0);
          HEAP32[(($_pre_phi_i25_i)>>2)]=$1010;
          $1222=(($F4_0_i_i+12)|0);
          HEAP32[(($1222)>>2)]=$1010;
          $_sum28_i_i=((($_sum_i21_i)+(8))|0);
          $1223=(($tbase_245_i+$_sum28_i_i)|0);
          $1224=$1223;
          HEAP32[(($1224)>>2)]=$F4_0_i_i;
          $_sum29_i_i=((($_sum_i21_i)+(12))|0);
          $1225=(($tbase_245_i+$_sum29_i_i)|0);
          $1226=$1225;
          HEAP32[(($1226)>>2)]=$1207;
          break;
         }
         $1228=$1009;
         $1229=$qsize_0_i_i>>>8;
         $1230=($1229|0)==0;
         do {
          if ($1230) {
           $I7_0_i_i=0;
          } else {
           $1232=($qsize_0_i_i>>>0)>((16777215)>>>0);
           if ($1232) {
            $I7_0_i_i=31;
            break;
           }
           $1234=((($1229)+(1048320))|0);
           $1235=$1234>>>16;
           $1236=$1235&8;
           $1237=$1229<<$1236;
           $1238=((($1237)+(520192))|0);
           $1239=$1238>>>16;
           $1240=$1239&4;
           $1241=$1240|$1236;
           $1242=$1237<<$1240;
           $1243=((($1242)+(245760))|0);
           $1244=$1243>>>16;
           $1245=$1244&2;
           $1246=$1241|$1245;
           $1247=(((14)-($1246))|0);
           $1248=$1242<<$1245;
           $1249=$1248>>>15;
           $1250=((($1247)+($1249))|0);
           $1251=$1250<<1;
           $1252=((($1250)+(7))|0);
           $1253=$qsize_0_i_i>>>($1252>>>0);
           $1254=$1253&1;
           $1255=$1254|$1251;
           $I7_0_i_i=$1255;
          }
         } while(0);
         $1257=((2608+($I7_0_i_i<<2))|0);
         $_sum12_i26_i=((($_sum_i21_i)+(28))|0);
         $1258=(($tbase_245_i+$_sum12_i26_i)|0);
         $1259=$1258;
         HEAP32[(($1259)>>2)]=$I7_0_i_i;
         $_sum13_i_i=((($_sum_i21_i)+(16))|0);
         $1260=(($tbase_245_i+$_sum13_i_i)|0);
         $_sum14_i_i=((($_sum_i21_i)+(20))|0);
         $1261=(($tbase_245_i+$_sum14_i_i)|0);
         $1262=$1261;
         HEAP32[(($1262)>>2)]=0;
         $1263=$1260;
         HEAP32[(($1263)>>2)]=0;
         $1264=((HEAP32[((2308)>>2)])|0);
         $1265=1<<$I7_0_i_i;
         $1266=$1264&$1265;
         $1267=($1266|0)==0;
         if ($1267) {
          $1269=$1264|$1265;
          HEAP32[((2308)>>2)]=$1269;
          HEAP32[(($1257)>>2)]=$1228;
          $1270=$1257;
          $_sum15_i_i=((($_sum_i21_i)+(24))|0);
          $1271=(($tbase_245_i+$_sum15_i_i)|0);
          $1272=$1271;
          HEAP32[(($1272)>>2)]=$1270;
          $_sum16_i_i=((($_sum_i21_i)+(12))|0);
          $1273=(($tbase_245_i+$_sum16_i_i)|0);
          $1274=$1273;
          HEAP32[(($1274)>>2)]=$1228;
          $_sum17_i_i=((($_sum_i21_i)+(8))|0);
          $1275=(($tbase_245_i+$_sum17_i_i)|0);
          $1276=$1275;
          HEAP32[(($1276)>>2)]=$1228;
          break;
         }
         $1278=((HEAP32[(($1257)>>2)])|0);
         $1279=($I7_0_i_i|0)==31;
         if ($1279) {
          $1284=0;
         } else {
          $1281=$I7_0_i_i>>>1;
          $1282=(((25)-($1281))|0);
          $1284=$1282;
         }
         $1285=$qsize_0_i_i<<$1284;
         $K8_0_i_i=$1285;$T_0_i27_i=$1278;
         while(1) {
          $1287=(($T_0_i27_i+4)|0);
          $1288=((HEAP32[(($1287)>>2)])|0);
          $1289=$1288&-8;
          $1290=($1289|0)==($qsize_0_i_i|0);
          if ($1290) {
           break;
          }
          $1292=$K8_0_i_i>>>31;
          $1293=(($T_0_i27_i+16+($1292<<2))|0);
          $1294=((HEAP32[(($1293)>>2)])|0);
          $1295=($1294|0)==0;
          $1296=$K8_0_i_i<<1;
          if ($1295) {
           label = 1638;
           break;
          } else {
           $K8_0_i_i=$1296;$T_0_i27_i=$1294;
          }
         }
         if ((label|0) == 1638) {
          $1298=$1293;
          $1299=((HEAP32[((2320)>>2)])|0);
          $1300=($1298>>>0)<($1299>>>0);
          if ($1300) {
           _abort(); return ((0)|0);
           return ((0)|0);
          } else {
           HEAP32[(($1293)>>2)]=$1228;
           $_sum24_i_i=((($_sum_i21_i)+(24))|0);
           $1302=(($tbase_245_i+$_sum24_i_i)|0);
           $1303=$1302;
           HEAP32[(($1303)>>2)]=$T_0_i27_i;
           $_sum25_i_i=((($_sum_i21_i)+(12))|0);
           $1304=(($tbase_245_i+$_sum25_i_i)|0);
           $1305=$1304;
           HEAP32[(($1305)>>2)]=$1228;
           $_sum26_i_i=((($_sum_i21_i)+(8))|0);
           $1306=(($tbase_245_i+$_sum26_i_i)|0);
           $1307=$1306;
           HEAP32[(($1307)>>2)]=$1228;
           break;
          }
         }
         $1310=(($T_0_i27_i+8)|0);
         $1311=((HEAP32[(($1310)>>2)])|0);
         $1312=$T_0_i27_i;
         $1313=((HEAP32[((2320)>>2)])|0);
         $1314=($1312>>>0)<($1313>>>0);
         if ($1314) {
          _abort(); return ((0)|0);
          return ((0)|0);
         }
         $1316=$1311;
         $1317=($1316>>>0)<($1313>>>0);
         if ($1317) {
          _abort(); return ((0)|0);
          return ((0)|0);
         } else {
          $1319=(($1311+12)|0);
          HEAP32[(($1319)>>2)]=$1228;
          HEAP32[(($1310)>>2)]=$1228;
          $_sum21_i_i=((($_sum_i21_i)+(8))|0);
          $1320=(($tbase_245_i+$_sum21_i_i)|0);
          $1321=$1320;
          HEAP32[(($1321)>>2)]=$1311;
          $_sum22_i_i=((($_sum_i21_i)+(12))|0);
          $1322=(($tbase_245_i+$_sum22_i_i)|0);
          $1323=$1322;
          HEAP32[(($1323)>>2)]=$T_0_i27_i;
          $_sum23_i_i=((($_sum_i21_i)+(24))|0);
          $1324=(($tbase_245_i+$_sum23_i_i)|0);
          $1325=$1324;
          HEAP32[(($1325)>>2)]=0;
          break;
         }
        }
       } while(0);
       $_sum1819_i_i=$993|8;
       $1326=(($tbase_245_i+$_sum1819_i_i)|0);
       $mem_0=$1326;
       return (($mem_0)|0);
      }
     } while(0);
     $1327=$890;
     $sp_0_i_i_i=2752;
     while(1) {
      $1329=(($sp_0_i_i_i)|0);
      $1330=((HEAP32[(($1329)>>2)])|0);
      $1331=($1330>>>0)>($1327>>>0);
      if (!($1331)) {
       $1333=(($sp_0_i_i_i+4)|0);
       $1334=((HEAP32[(($1333)>>2)])|0);
       $1335=(($1330+$1334)|0);
       $1336=($1335>>>0)>($1327>>>0);
       if ($1336) {
        break;
       }
      }
      $1338=(($sp_0_i_i_i+8)|0);
      $1339=((HEAP32[(($1338)>>2)])|0);
      $sp_0_i_i_i=$1339;
     }
     $_sum_i15_i=((($1334)-(47))|0);
     $_sum1_i16_i=((($1334)-(39))|0);
     $1340=(($1330+$_sum1_i16_i)|0);
     $1341=$1340;
     $1342=$1341&7;
     $1343=($1342|0)==0;
     if ($1343) {
      $1348=0;
     } else {
      $1345=(((-$1341))|0);
      $1346=$1345&7;
      $1348=$1346;
     }
     $_sum2_i17_i=((($_sum_i15_i)+($1348))|0);
     $1349=(($1330+$_sum2_i17_i)|0);
     $1350=(($890+16)|0);
     $1351=$1350;
     $1352=($1349>>>0)<($1351>>>0);
     $1353=($1352?$1327:$1349);
     $1354=(($1353+8)|0);
     $1355=$1354;
     $1356=((($tsize_244_i)-(40))|0);
     $1357=(($tbase_245_i+8)|0);
     $1358=$1357;
     $1359=$1358&7;
     $1360=($1359|0)==0;
     if ($1360) {
      $1364=0;
     } else {
      $1362=(((-$1358))|0);
      $1363=$1362&7;
      $1364=$1363;
     }
     $1365=(($tbase_245_i+$1364)|0);
     $1366=$1365;
     $1367=((($1356)-($1364))|0);
     HEAP32[((2328)>>2)]=$1366;
     HEAP32[((2316)>>2)]=$1367;
     $1368=$1367|1;
     $_sum_i_i_i=((($1364)+(4))|0);
     $1369=(($tbase_245_i+$_sum_i_i_i)|0);
     $1370=$1369;
     HEAP32[(($1370)>>2)]=$1368;
     $_sum2_i_i_i=((($tsize_244_i)-(36))|0);
     $1371=(($tbase_245_i+$_sum2_i_i_i)|0);
     $1372=$1371;
     HEAP32[(($1372)>>2)]=40;
     $1373=((HEAP32[((2296)>>2)])|0);
     HEAP32[((2332)>>2)]=$1373;
     $1374=(($1353+4)|0);
     $1375=$1374;
     HEAP32[(($1375)>>2)]=27;
     HEAP32[(($1354)>>2)]=((HEAP32[((2752)>>2)])|0);HEAP32[((($1354)+(4))>>2)]=((HEAP32[((2756)>>2)])|0);HEAP32[((($1354)+(8))>>2)]=((HEAP32[((2760)>>2)])|0);HEAP32[((($1354)+(12))>>2)]=((HEAP32[((2764)>>2)])|0);
     HEAP32[((2752)>>2)]=$tbase_245_i;
     HEAP32[((2756)>>2)]=$tsize_244_i;
     HEAP32[((2764)>>2)]=0;
     HEAP32[((2760)>>2)]=$1355;
     $1376=(($1353+28)|0);
     $1377=$1376;
     HEAP32[(($1377)>>2)]=7;
     $1378=(($1353+32)|0);
     $1379=($1378>>>0)<($1335>>>0);
     if ($1379) {
      $1380=$1377;
      while(1) {
       $1381=(($1380+4)|0);
       HEAP32[(($1381)>>2)]=7;
       $1382=(($1380+8)|0);
       $1383=$1382;
       $1384=($1383>>>0)<($1335>>>0);
       if ($1384) {
        $1380=$1381;
       } else {
        break;
       }
      }
     }
     $1385=($1353|0)==($1327|0);
     if ($1385) {
      break;
     }
     $1387=$1353;
     $1388=$890;
     $1389=((($1387)-($1388))|0);
     $1390=(($1327+$1389)|0);
     $_sum3_i_i=((($1389)+(4))|0);
     $1391=(($1327+$_sum3_i_i)|0);
     $1392=$1391;
     $1393=((HEAP32[(($1392)>>2)])|0);
     $1394=$1393&-2;
     HEAP32[(($1392)>>2)]=$1394;
     $1395=$1389|1;
     $1396=(($890+4)|0);
     HEAP32[(($1396)>>2)]=$1395;
     $1397=$1390;
     HEAP32[(($1397)>>2)]=$1389;
     $1398=$1389>>>3;
     $1399=($1389>>>0)<((256)>>>0);
     if ($1399) {
      $1401=$1398<<1;
      $1402=((2344+($1401<<2))|0);
      $1403=$1402;
      $1404=((HEAP32[((2304)>>2)])|0);
      $1405=1<<$1398;
      $1406=$1404&$1405;
      $1407=($1406|0)==0;
      do {
       if ($1407) {
        $1409=$1404|$1405;
        HEAP32[((2304)>>2)]=$1409;
        $_sum11_pre_i_i=((($1401)+(2))|0);
        $_pre_i_i=((2344+($_sum11_pre_i_i<<2))|0);
        $F_0_i_i=$1403;$_pre_phi_i_i=$_pre_i_i;
       } else {
        $_sum12_i_i=((($1401)+(2))|0);
        $1411=((2344+($_sum12_i_i<<2))|0);
        $1412=((HEAP32[(($1411)>>2)])|0);
        $1413=$1412;
        $1414=((HEAP32[((2320)>>2)])|0);
        $1415=($1413>>>0)<($1414>>>0);
        if (!($1415)) {
         $F_0_i_i=$1412;$_pre_phi_i_i=$1411;
         break;
        }
        _abort(); return ((0)|0);
        return ((0)|0);
       }
      } while(0);
      HEAP32[(($_pre_phi_i_i)>>2)]=$890;
      $1418=(($F_0_i_i+12)|0);
      HEAP32[(($1418)>>2)]=$890;
      $1419=(($890+8)|0);
      HEAP32[(($1419)>>2)]=$F_0_i_i;
      $1420=(($890+12)|0);
      HEAP32[(($1420)>>2)]=$1403;
      break;
     }
     $1422=$890;
     $1423=$1389>>>8;
     $1424=($1423|0)==0;
     do {
      if ($1424) {
       $I1_0_i_i=0;
      } else {
       $1426=($1389>>>0)>((16777215)>>>0);
       if ($1426) {
        $I1_0_i_i=31;
        break;
       }
       $1428=((($1423)+(1048320))|0);
       $1429=$1428>>>16;
       $1430=$1429&8;
       $1431=$1423<<$1430;
       $1432=((($1431)+(520192))|0);
       $1433=$1432>>>16;
       $1434=$1433&4;
       $1435=$1434|$1430;
       $1436=$1431<<$1434;
       $1437=((($1436)+(245760))|0);
       $1438=$1437>>>16;
       $1439=$1438&2;
       $1440=$1435|$1439;
       $1441=(((14)-($1440))|0);
       $1442=$1436<<$1439;
       $1443=$1442>>>15;
       $1444=((($1441)+($1443))|0);
       $1445=$1444<<1;
       $1446=((($1444)+(7))|0);
       $1447=$1389>>>($1446>>>0);
       $1448=$1447&1;
       $1449=$1448|$1445;
       $I1_0_i_i=$1449;
      }
     } while(0);
     $1451=((2608+($I1_0_i_i<<2))|0);
     $1452=(($890+28)|0);
     $I1_0_c_i_i=$I1_0_i_i;
     HEAP32[(($1452)>>2)]=$I1_0_c_i_i;
     $1453=(($890+20)|0);
     HEAP32[(($1453)>>2)]=0;
     $1454=(($890+16)|0);
     HEAP32[(($1454)>>2)]=0;
     $1455=((HEAP32[((2308)>>2)])|0);
     $1456=1<<$I1_0_i_i;
     $1457=$1455&$1456;
     $1458=($1457|0)==0;
     if ($1458) {
      $1460=$1455|$1456;
      HEAP32[((2308)>>2)]=$1460;
      HEAP32[(($1451)>>2)]=$1422;
      $1461=(($890+24)|0);
      $_c_i_i=$1451;
      HEAP32[(($1461)>>2)]=$_c_i_i;
      $1462=(($890+12)|0);
      HEAP32[(($1462)>>2)]=$890;
      $1463=(($890+8)|0);
      HEAP32[(($1463)>>2)]=$890;
      break;
     }
     $1465=((HEAP32[(($1451)>>2)])|0);
     $1466=($I1_0_i_i|0)==31;
     if ($1466) {
      $1471=0;
     } else {
      $1468=$I1_0_i_i>>>1;
      $1469=(((25)-($1468))|0);
      $1471=$1469;
     }
     $1472=$1389<<$1471;
     $K2_0_i_i=$1472;$T_0_i_i=$1465;
     while(1) {
      $1474=(($T_0_i_i+4)|0);
      $1475=((HEAP32[(($1474)>>2)])|0);
      $1476=$1475&-8;
      $1477=($1476|0)==($1389|0);
      if ($1477) {
       break;
      }
      $1479=$K2_0_i_i>>>31;
      $1480=(($T_0_i_i+16+($1479<<2))|0);
      $1481=((HEAP32[(($1480)>>2)])|0);
      $1482=($1481|0)==0;
      $1483=$K2_0_i_i<<1;
      if ($1482) {
       label = 1673;
       break;
      } else {
       $K2_0_i_i=$1483;$T_0_i_i=$1481;
      }
     }
     if ((label|0) == 1673) {
      $1485=$1480;
      $1486=((HEAP32[((2320)>>2)])|0);
      $1487=($1485>>>0)<($1486>>>0);
      if ($1487) {
       _abort(); return ((0)|0);
       return ((0)|0);
      } else {
       HEAP32[(($1480)>>2)]=$1422;
       $1489=(($890+24)|0);
       $T_0_c8_i_i=$T_0_i_i;
       HEAP32[(($1489)>>2)]=$T_0_c8_i_i;
       $1490=(($890+12)|0);
       HEAP32[(($1490)>>2)]=$890;
       $1491=(($890+8)|0);
       HEAP32[(($1491)>>2)]=$890;
       break;
      }
     }
     $1494=(($T_0_i_i+8)|0);
     $1495=((HEAP32[(($1494)>>2)])|0);
     $1496=$T_0_i_i;
     $1497=((HEAP32[((2320)>>2)])|0);
     $1498=($1496>>>0)<($1497>>>0);
     if ($1498) {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
     $1500=$1495;
     $1501=($1500>>>0)<($1497>>>0);
     if ($1501) {
      _abort(); return ((0)|0);
      return ((0)|0);
     } else {
      $1503=(($1495+12)|0);
      HEAP32[(($1503)>>2)]=$1422;
      HEAP32[(($1494)>>2)]=$1422;
      $1504=(($890+8)|0);
      $_c7_i_i=$1495;
      HEAP32[(($1504)>>2)]=$_c7_i_i;
      $1505=(($890+12)|0);
      $T_0_c_i_i=$T_0_i_i;
      HEAP32[(($1505)>>2)]=$T_0_c_i_i;
      $1506=(($890+24)|0);
      HEAP32[(($1506)>>2)]=0;
      break;
     }
    }
   } while(0);
   $1507=((HEAP32[((2316)>>2)])|0);
   $1508=($1507>>>0)>($nb_0>>>0);
   if (!($1508)) {
    break;
   }
   $1510=((($1507)-($nb_0))|0);
   HEAP32[((2316)>>2)]=$1510;
   $1511=((HEAP32[((2328)>>2)])|0);
   $1512=$1511;
   $1513=(($1512+$nb_0)|0);
   $1514=$1513;
   HEAP32[((2328)>>2)]=$1514;
   $1515=$1510|1;
   $_sum_i134=((($nb_0)+(4))|0);
   $1516=(($1512+$_sum_i134)|0);
   $1517=$1516;
   HEAP32[(($1517)>>2)]=$1515;
   $1518=$nb_0|3;
   $1519=(($1511+4)|0);
   HEAP32[(($1519)>>2)]=$1518;
   $1520=(($1511+8)|0);
   $1521=$1520;
   $mem_0=$1521;
   return (($mem_0)|0);
  }
 } while(0);
 $1522=((___errno_location())|0);
 HEAP32[(($1522)>>2)]=12;
 $mem_0=0;
 return (($mem_0)|0);
}
function _free($mem){
 $mem=($mem)|0;
 var $1=0,$3=0,$4=0,$5=0,$6=0,$8=0,$9=0,$10=0,$11=0,$12=0,$14=0,$_sum=0,$15=0,$16=0,$17=0,$18=0,$20=0,$21=0,$22=0,$_sum232=0;
 var $24=0,$25=0,$26=0,$27=0,$29=0,$30=0,$32=0,$33=0,$_sum276=0,$35=0,$36=0,$37=0,$_sum277=0,$38=0,$39=0,$40=0,$41=0,$42=0,$43=0,$44=0;
 var $46=0,$47=0,$49=0,$50=0,$51=0,$52=0,$54=0,$55=0,$56=0,$57=0,$59=0,$_pre305=0,$61=0,$62=0,$64=0,$65=0,$66=0,$_pre_phi306=0,$67=0,$69=0;
 var $_sum266=0,$70=0,$71=0,$72=0,$_sum267=0,$73=0,$74=0,$75=0,$76=0,$_sum273=0,$78=0,$79=0,$80=0,$81=0,$82=0,$84=0,$85=0,$86=0,$88=0,$89=0;
 var $90=0,$_sum269=0,$93=0,$94=0,$95=0,$96=0,$_sum268=0,$98=0,$99=0,$100=0,$101=0,$RP_0=0,$R_0=0,$102=0,$103=0,$104=0,$106=0,$107=0,$108=0,$110=0;
 var $111=0,$R_1=0,$115=0,$_sum270=0,$117=0,$118=0,$119=0,$120=0,$121=0,$122=0,$cond=0,$124=0,$125=0,$126=0,$127=0,$128=0,$130=0,$131=0,$132=0,$134=0;
 var $135=0,$136=0,$139=0,$142=0,$144=0,$145=0,$146=0,$148=0,$_sum271=0,$149=0,$150=0,$151=0,$152=0,$154=0,$155=0,$156=0,$158=0,$159=0,$_sum272=0,$162=0;
 var $163=0,$164=0,$165=0,$167=0,$168=0,$169=0,$171=0,$172=0,$_sum233=0,$176=0,$177=0,$178=0,$179=0,$180=0,$182=0,$183=0,$184=0,$_sum264=0,$185=0,$186=0;
 var $187=0,$psize_0=0,$p_0=0,$189=0,$190=0,$_sum263=0,$192=0,$193=0,$194=0,$195=0,$phitmp=0,$197=0,$198=0,$200=0,$201=0,$203=0,$204=0,$205=0,$206=0,$207=0;
 var $208=0,$211=0,$212=0,$214=0,$215=0,$216=0,$217=0,$218=0,$219=0,$221=0,$222=0,$223=0,$224=0,$226=0,$227=0,$228=0,$_sum257258=0,$229=0,$230=0,$231=0;
 var $232=0,$233=0,$234=0,$235=0,$237=0,$238=0,$239=0,$241=0,$242=0,$243=0,$244=0,$246=0,$247=0,$248=0,$249=0,$251=0,$_pre303=0,$253=0,$254=0,$255=0;
 var $257=0,$258=0,$259=0,$_pre_phi304=0,$260=0,$262=0,$_sum235=0,$263=0,$264=0,$265=0,$_sum236237=0,$266=0,$267=0,$268=0,$269=0,$271=0,$272=0,$273=0,$274=0,$275=0;
 var $276=0,$278=0,$279=0,$280=0,$282=0,$283=0,$284=0,$_sum239=0,$287=0,$288=0,$289=0,$290=0,$_sum238=0,$292=0,$293=0,$294=0,$295=0,$RP9_0=0,$R7_0=0,$296=0;
 var $297=0,$298=0,$300=0,$301=0,$302=0,$304=0,$305=0,$306=0,$R7_1=0,$310=0,$_sum250=0,$312=0,$313=0,$314=0,$315=0,$316=0,$317=0,$cond298=0,$319=0,$320=0;
 var $321=0,$322=0,$323=0,$325=0,$326=0,$327=0,$329=0,$330=0,$331=0,$334=0,$337=0,$339=0,$340=0,$341=0,$343=0,$_sum251=0,$344=0,$345=0,$346=0,$347=0;
 var $349=0,$350=0,$351=0,$353=0,$354=0,$_sum252=0,$357=0,$358=0,$359=0,$360=0,$362=0,$363=0,$364=0,$366=0,$367=0,$371=0,$372=0,$373=0,$374=0,$375=0;
 var $376=0,$379=0,$380=0,$381=0,$382=0,$383=0,$psize_1=0,$385=0,$386=0,$388=0,$389=0,$390=0,$391=0,$392=0,$393=0,$394=0,$396=0,$_sum248_pre=0,$_pre=0,$_sum249=0;
 var $398=0,$399=0,$400=0,$401=0,$402=0,$_pre_phi=0,$F16_0=0,$405=0,$406=0,$407=0,$409=0,$410=0,$411=0,$413=0,$415=0,$416=0,$417=0,$418=0,$419=0,$420=0;
 var $421=0,$422=0,$423=0,$424=0,$425=0,$426=0,$427=0,$428=0,$429=0,$430=0,$431=0,$432=0,$433=0,$434=0,$435=0,$436=0,$I18_0=0,$438=0,$439=0,$I18_0_c=0;
 var $440=0,$441=0,$442=0,$443=0,$444=0,$445=0,$447=0,$448=0,$_c=0,$449=0,$450=0,$452=0,$453=0,$455=0,$456=0,$458=0,$459=0,$T_0=0,$K19_0=0,$461=0;
 var $462=0,$463=0,$464=0,$466=0,$467=0,$468=0,$469=0,$470=0,$472=0,$473=0,$474=0,$476=0,$T_0_c245=0,$477=0,$478=0,$481=0,$482=0,$483=0,$484=0,$485=0;
 var $487=0,$488=0,$490=0,$491=0,$_c244=0,$492=0,$T_0_c=0,$493=0,$495=0,$496=0,$497=0,$sp_0_in_i=0,$sp_0_i=0,$498=0,$499=0,label=0;
 $1=($mem|0)==0;
 if ($1) {
  return;
 }
 $3=((($mem)-(8))|0);
 $4=$3;
 $5=((HEAP32[((2320)>>2)])|0);
 $6=($3>>>0)<($5>>>0);
 if ($6) {
  _abort();
 }
 $8=((($mem)-(4))|0);
 $9=$8;
 $10=((HEAP32[(($9)>>2)])|0);
 $11=$10&3;
 $12=($11|0)==1;
 if ($12) {
  _abort();
 }
 $14=$10&-8;
 $_sum=((($14)-(8))|0);
 $15=(($mem+$_sum)|0);
 $16=$15;
 $17=$10&1;
 $18=($17|0)==0;
 L2285: do {
  if ($18) {
   $20=$3;
   $21=((HEAP32[(($20)>>2)])|0);
   $22=($11|0)==0;
   if ($22) {
    return;
   }
   $_sum232=(((-8)-($21))|0);
   $24=(($mem+$_sum232)|0);
   $25=$24;
   $26=((($21)+($14))|0);
   $27=($24>>>0)<($5>>>0);
   if ($27) {
    _abort();
   }
   $29=((HEAP32[((2324)>>2)])|0);
   $30=($25|0)==($29|0);
   if ($30) {
    $_sum233=((($14)-(4))|0);
    $176=(($mem+$_sum233)|0);
    $177=$176;
    $178=((HEAP32[(($177)>>2)])|0);
    $179=$178&3;
    $180=($179|0)==3;
    if (!($180)) {
     $p_0=$25;$psize_0=$26;
     break;
    }
    HEAP32[((2312)>>2)]=$26;
    $182=((HEAP32[(($177)>>2)])|0);
    $183=$182&-2;
    HEAP32[(($177)>>2)]=$183;
    $184=$26|1;
    $_sum264=((($_sum232)+(4))|0);
    $185=(($mem+$_sum264)|0);
    $186=$185;
    HEAP32[(($186)>>2)]=$184;
    $187=$15;
    HEAP32[(($187)>>2)]=$26;
    return;
   }
   $32=$21>>>3;
   $33=($21>>>0)<((256)>>>0);
   if ($33) {
    $_sum276=((($_sum232)+(8))|0);
    $35=(($mem+$_sum276)|0);
    $36=$35;
    $37=((HEAP32[(($36)>>2)])|0);
    $_sum277=((($_sum232)+(12))|0);
    $38=(($mem+$_sum277)|0);
    $39=$38;
    $40=((HEAP32[(($39)>>2)])|0);
    $41=$32<<1;
    $42=((2344+($41<<2))|0);
    $43=$42;
    $44=($37|0)==($43|0);
    do {
     if (!($44)) {
      $46=$37;
      $47=($46>>>0)<($5>>>0);
      if ($47) {
       _abort();
      }
      $49=(($37+12)|0);
      $50=((HEAP32[(($49)>>2)])|0);
      $51=($50|0)==($25|0);
      if ($51) {
       break;
      }
      _abort();
     }
    } while(0);
    $52=($40|0)==($37|0);
    if ($52) {
     $54=1<<$32;
     $55=$54^-1;
     $56=((HEAP32[((2304)>>2)])|0);
     $57=$56&$55;
     HEAP32[((2304)>>2)]=$57;
     $p_0=$25;$psize_0=$26;
     break;
    }
    $59=($40|0)==($43|0);
    do {
     if ($59) {
      $_pre305=(($40+8)|0);
      $_pre_phi306=$_pre305;
     } else {
      $61=$40;
      $62=($61>>>0)<($5>>>0);
      if ($62) {
       _abort();
      }
      $64=(($40+8)|0);
      $65=((HEAP32[(($64)>>2)])|0);
      $66=($65|0)==($25|0);
      if ($66) {
       $_pre_phi306=$64;
       break;
      }
      _abort();
     }
    } while(0);
    $67=(($37+12)|0);
    HEAP32[(($67)>>2)]=$40;
    HEAP32[(($_pre_phi306)>>2)]=$37;
    $p_0=$25;$psize_0=$26;
    break;
   }
   $69=$24;
   $_sum266=((($_sum232)+(24))|0);
   $70=(($mem+$_sum266)|0);
   $71=$70;
   $72=((HEAP32[(($71)>>2)])|0);
   $_sum267=((($_sum232)+(12))|0);
   $73=(($mem+$_sum267)|0);
   $74=$73;
   $75=((HEAP32[(($74)>>2)])|0);
   $76=($75|0)==($69|0);
   do {
    if ($76) {
     $_sum269=((($_sum232)+(20))|0);
     $93=(($mem+$_sum269)|0);
     $94=$93;
     $95=((HEAP32[(($94)>>2)])|0);
     $96=($95|0)==0;
     if ($96) {
      $_sum268=((($_sum232)+(16))|0);
      $98=(($mem+$_sum268)|0);
      $99=$98;
      $100=((HEAP32[(($99)>>2)])|0);
      $101=($100|0)==0;
      if ($101) {
       $R_1=0;
       break;
      } else {
       $R_0=$100;$RP_0=$99;
      }
     } else {
      $R_0=$95;$RP_0=$94;
     }
     while(1) {
      $102=(($R_0+20)|0);
      $103=((HEAP32[(($102)>>2)])|0);
      $104=($103|0)==0;
      if (!($104)) {
       $R_0=$103;$RP_0=$102;
       continue;
      }
      $106=(($R_0+16)|0);
      $107=((HEAP32[(($106)>>2)])|0);
      $108=($107|0)==0;
      if ($108) {
       break;
      } else {
       $R_0=$107;$RP_0=$106;
      }
     }
     $110=$RP_0;
     $111=($110>>>0)<($5>>>0);
     if ($111) {
      _abort();
     } else {
      HEAP32[(($RP_0)>>2)]=0;
      $R_1=$R_0;
      break;
     }
    } else {
     $_sum273=((($_sum232)+(8))|0);
     $78=(($mem+$_sum273)|0);
     $79=$78;
     $80=((HEAP32[(($79)>>2)])|0);
     $81=$80;
     $82=($81>>>0)<($5>>>0);
     if ($82) {
      _abort();
     }
     $84=(($80+12)|0);
     $85=((HEAP32[(($84)>>2)])|0);
     $86=($85|0)==($69|0);
     if (!($86)) {
      _abort();
     }
     $88=(($75+8)|0);
     $89=((HEAP32[(($88)>>2)])|0);
     $90=($89|0)==($69|0);
     if ($90) {
      HEAP32[(($84)>>2)]=$75;
      HEAP32[(($88)>>2)]=$80;
      $R_1=$75;
      break;
     } else {
      _abort();
     }
    }
   } while(0);
   $115=($72|0)==0;
   if ($115) {
    $p_0=$25;$psize_0=$26;
    break;
   }
   $_sum270=((($_sum232)+(28))|0);
   $117=(($mem+$_sum270)|0);
   $118=$117;
   $119=((HEAP32[(($118)>>2)])|0);
   $120=((2608+($119<<2))|0);
   $121=((HEAP32[(($120)>>2)])|0);
   $122=($69|0)==($121|0);
   do {
    if ($122) {
     HEAP32[(($120)>>2)]=$R_1;
     $cond=($R_1|0)==0;
     if (!($cond)) {
      break;
     }
     $124=((HEAP32[(($118)>>2)])|0);
     $125=1<<$124;
     $126=$125^-1;
     $127=((HEAP32[((2308)>>2)])|0);
     $128=$127&$126;
     HEAP32[((2308)>>2)]=$128;
     $p_0=$25;$psize_0=$26;
     break L2285;
    } else {
     $130=$72;
     $131=((HEAP32[((2320)>>2)])|0);
     $132=($130>>>0)<($131>>>0);
     if ($132) {
      _abort();
     }
     $134=(($72+16)|0);
     $135=((HEAP32[(($134)>>2)])|0);
     $136=($135|0)==($69|0);
     if ($136) {
      HEAP32[(($134)>>2)]=$R_1;
     } else {
      $139=(($72+20)|0);
      HEAP32[(($139)>>2)]=$R_1;
     }
     $142=($R_1|0)==0;
     if ($142) {
      $p_0=$25;$psize_0=$26;
      break L2285;
     }
    }
   } while(0);
   $144=$R_1;
   $145=((HEAP32[((2320)>>2)])|0);
   $146=($144>>>0)<($145>>>0);
   if ($146) {
    _abort();
   }
   $148=(($R_1+24)|0);
   HEAP32[(($148)>>2)]=$72;
   $_sum271=((($_sum232)+(16))|0);
   $149=(($mem+$_sum271)|0);
   $150=$149;
   $151=((HEAP32[(($150)>>2)])|0);
   $152=($151|0)==0;
   do {
    if (!($152)) {
     $154=$151;
     $155=((HEAP32[((2320)>>2)])|0);
     $156=($154>>>0)<($155>>>0);
     if ($156) {
      _abort();
     } else {
      $158=(($R_1+16)|0);
      HEAP32[(($158)>>2)]=$151;
      $159=(($151+24)|0);
      HEAP32[(($159)>>2)]=$R_1;
      break;
     }
    }
   } while(0);
   $_sum272=((($_sum232)+(20))|0);
   $162=(($mem+$_sum272)|0);
   $163=$162;
   $164=((HEAP32[(($163)>>2)])|0);
   $165=($164|0)==0;
   if ($165) {
    $p_0=$25;$psize_0=$26;
    break;
   }
   $167=$164;
   $168=((HEAP32[((2320)>>2)])|0);
   $169=($167>>>0)<($168>>>0);
   if ($169) {
    _abort();
   } else {
    $171=(($R_1+20)|0);
    HEAP32[(($171)>>2)]=$164;
    $172=(($164+24)|0);
    HEAP32[(($172)>>2)]=$R_1;
    $p_0=$25;$psize_0=$26;
    break;
   }
  } else {
   $p_0=$4;$psize_0=$14;
  }
 } while(0);
 $189=$p_0;
 $190=($189>>>0)<($15>>>0);
 if (!($190)) {
  _abort();
 }
 $_sum263=((($14)-(4))|0);
 $192=(($mem+$_sum263)|0);
 $193=$192;
 $194=((HEAP32[(($193)>>2)])|0);
 $195=$194&1;
 $phitmp=($195|0)==0;
 if ($phitmp) {
  _abort();
 }
 $197=$194&2;
 $198=($197|0)==0;
 do {
  if ($198) {
   $200=((HEAP32[((2328)>>2)])|0);
   $201=($16|0)==($200|0);
   if ($201) {
    $203=((HEAP32[((2316)>>2)])|0);
    $204=((($203)+($psize_0))|0);
    HEAP32[((2316)>>2)]=$204;
    HEAP32[((2328)>>2)]=$p_0;
    $205=$204|1;
    $206=(($p_0+4)|0);
    HEAP32[(($206)>>2)]=$205;
    $207=((HEAP32[((2324)>>2)])|0);
    $208=($p_0|0)==($207|0);
    if (!($208)) {
     return;
    }
    HEAP32[((2324)>>2)]=0;
    HEAP32[((2312)>>2)]=0;
    return;
   }
   $211=((HEAP32[((2324)>>2)])|0);
   $212=($16|0)==($211|0);
   if ($212) {
    $214=((HEAP32[((2312)>>2)])|0);
    $215=((($214)+($psize_0))|0);
    HEAP32[((2312)>>2)]=$215;
    HEAP32[((2324)>>2)]=$p_0;
    $216=$215|1;
    $217=(($p_0+4)|0);
    HEAP32[(($217)>>2)]=$216;
    $218=(($189+$215)|0);
    $219=$218;
    HEAP32[(($219)>>2)]=$215;
    return;
   }
   $221=$194&-8;
   $222=((($221)+($psize_0))|0);
   $223=$194>>>3;
   $224=($194>>>0)<((256)>>>0);
   L2388: do {
    if ($224) {
     $226=(($mem+$14)|0);
     $227=$226;
     $228=((HEAP32[(($227)>>2)])|0);
     $_sum257258=$14|4;
     $229=(($mem+$_sum257258)|0);
     $230=$229;
     $231=((HEAP32[(($230)>>2)])|0);
     $232=$223<<1;
     $233=((2344+($232<<2))|0);
     $234=$233;
     $235=($228|0)==($234|0);
     do {
      if (!($235)) {
       $237=$228;
       $238=((HEAP32[((2320)>>2)])|0);
       $239=($237>>>0)<($238>>>0);
       if ($239) {
        _abort();
       }
       $241=(($228+12)|0);
       $242=((HEAP32[(($241)>>2)])|0);
       $243=($242|0)==($16|0);
       if ($243) {
        break;
       }
       _abort();
      }
     } while(0);
     $244=($231|0)==($228|0);
     if ($244) {
      $246=1<<$223;
      $247=$246^-1;
      $248=((HEAP32[((2304)>>2)])|0);
      $249=$248&$247;
      HEAP32[((2304)>>2)]=$249;
      break;
     }
     $251=($231|0)==($234|0);
     do {
      if ($251) {
       $_pre303=(($231+8)|0);
       $_pre_phi304=$_pre303;
      } else {
       $253=$231;
       $254=((HEAP32[((2320)>>2)])|0);
       $255=($253>>>0)<($254>>>0);
       if ($255) {
        _abort();
       }
       $257=(($231+8)|0);
       $258=((HEAP32[(($257)>>2)])|0);
       $259=($258|0)==($16|0);
       if ($259) {
        $_pre_phi304=$257;
        break;
       }
       _abort();
      }
     } while(0);
     $260=(($228+12)|0);
     HEAP32[(($260)>>2)]=$231;
     HEAP32[(($_pre_phi304)>>2)]=$228;
    } else {
     $262=$15;
     $_sum235=((($14)+(16))|0);
     $263=(($mem+$_sum235)|0);
     $264=$263;
     $265=((HEAP32[(($264)>>2)])|0);
     $_sum236237=$14|4;
     $266=(($mem+$_sum236237)|0);
     $267=$266;
     $268=((HEAP32[(($267)>>2)])|0);
     $269=($268|0)==($262|0);
     do {
      if ($269) {
       $_sum239=((($14)+(12))|0);
       $287=(($mem+$_sum239)|0);
       $288=$287;
       $289=((HEAP32[(($288)>>2)])|0);
       $290=($289|0)==0;
       if ($290) {
        $_sum238=((($14)+(8))|0);
        $292=(($mem+$_sum238)|0);
        $293=$292;
        $294=((HEAP32[(($293)>>2)])|0);
        $295=($294|0)==0;
        if ($295) {
         $R7_1=0;
         break;
        } else {
         $R7_0=$294;$RP9_0=$293;
        }
       } else {
        $R7_0=$289;$RP9_0=$288;
       }
       while(1) {
        $296=(($R7_0+20)|0);
        $297=((HEAP32[(($296)>>2)])|0);
        $298=($297|0)==0;
        if (!($298)) {
         $R7_0=$297;$RP9_0=$296;
         continue;
        }
        $300=(($R7_0+16)|0);
        $301=((HEAP32[(($300)>>2)])|0);
        $302=($301|0)==0;
        if ($302) {
         break;
        } else {
         $R7_0=$301;$RP9_0=$300;
        }
       }
       $304=$RP9_0;
       $305=((HEAP32[((2320)>>2)])|0);
       $306=($304>>>0)<($305>>>0);
       if ($306) {
        _abort();
       } else {
        HEAP32[(($RP9_0)>>2)]=0;
        $R7_1=$R7_0;
        break;
       }
      } else {
       $271=(($mem+$14)|0);
       $272=$271;
       $273=((HEAP32[(($272)>>2)])|0);
       $274=$273;
       $275=((HEAP32[((2320)>>2)])|0);
       $276=($274>>>0)<($275>>>0);
       if ($276) {
        _abort();
       }
       $278=(($273+12)|0);
       $279=((HEAP32[(($278)>>2)])|0);
       $280=($279|0)==($262|0);
       if (!($280)) {
        _abort();
       }
       $282=(($268+8)|0);
       $283=((HEAP32[(($282)>>2)])|0);
       $284=($283|0)==($262|0);
       if ($284) {
        HEAP32[(($278)>>2)]=$268;
        HEAP32[(($282)>>2)]=$273;
        $R7_1=$268;
        break;
       } else {
        _abort();
       }
      }
     } while(0);
     $310=($265|0)==0;
     if ($310) {
      break;
     }
     $_sum250=((($14)+(20))|0);
     $312=(($mem+$_sum250)|0);
     $313=$312;
     $314=((HEAP32[(($313)>>2)])|0);
     $315=((2608+($314<<2))|0);
     $316=((HEAP32[(($315)>>2)])|0);
     $317=($262|0)==($316|0);
     do {
      if ($317) {
       HEAP32[(($315)>>2)]=$R7_1;
       $cond298=($R7_1|0)==0;
       if (!($cond298)) {
        break;
       }
       $319=((HEAP32[(($313)>>2)])|0);
       $320=1<<$319;
       $321=$320^-1;
       $322=((HEAP32[((2308)>>2)])|0);
       $323=$322&$321;
       HEAP32[((2308)>>2)]=$323;
       break L2388;
      } else {
       $325=$265;
       $326=((HEAP32[((2320)>>2)])|0);
       $327=($325>>>0)<($326>>>0);
       if ($327) {
        _abort();
       }
       $329=(($265+16)|0);
       $330=((HEAP32[(($329)>>2)])|0);
       $331=($330|0)==($262|0);
       if ($331) {
        HEAP32[(($329)>>2)]=$R7_1;
       } else {
        $334=(($265+20)|0);
        HEAP32[(($334)>>2)]=$R7_1;
       }
       $337=($R7_1|0)==0;
       if ($337) {
        break L2388;
       }
      }
     } while(0);
     $339=$R7_1;
     $340=((HEAP32[((2320)>>2)])|0);
     $341=($339>>>0)<($340>>>0);
     if ($341) {
      _abort();
     }
     $343=(($R7_1+24)|0);
     HEAP32[(($343)>>2)]=$265;
     $_sum251=((($14)+(8))|0);
     $344=(($mem+$_sum251)|0);
     $345=$344;
     $346=((HEAP32[(($345)>>2)])|0);
     $347=($346|0)==0;
     do {
      if (!($347)) {
       $349=$346;
       $350=((HEAP32[((2320)>>2)])|0);
       $351=($349>>>0)<($350>>>0);
       if ($351) {
        _abort();
       } else {
        $353=(($R7_1+16)|0);
        HEAP32[(($353)>>2)]=$346;
        $354=(($346+24)|0);
        HEAP32[(($354)>>2)]=$R7_1;
        break;
       }
      }
     } while(0);
     $_sum252=((($14)+(12))|0);
     $357=(($mem+$_sum252)|0);
     $358=$357;
     $359=((HEAP32[(($358)>>2)])|0);
     $360=($359|0)==0;
     if ($360) {
      break;
     }
     $362=$359;
     $363=((HEAP32[((2320)>>2)])|0);
     $364=($362>>>0)<($363>>>0);
     if ($364) {
      _abort();
     } else {
      $366=(($R7_1+20)|0);
      HEAP32[(($366)>>2)]=$359;
      $367=(($359+24)|0);
      HEAP32[(($367)>>2)]=$R7_1;
      break;
     }
    }
   } while(0);
   $371=$222|1;
   $372=(($p_0+4)|0);
   HEAP32[(($372)>>2)]=$371;
   $373=(($189+$222)|0);
   $374=$373;
   HEAP32[(($374)>>2)]=$222;
   $375=((HEAP32[((2324)>>2)])|0);
   $376=($p_0|0)==($375|0);
   if (!($376)) {
    $psize_1=$222;
    break;
   }
   HEAP32[((2312)>>2)]=$222;
   return;
  } else {
   $379=$194&-2;
   HEAP32[(($193)>>2)]=$379;
   $380=$psize_0|1;
   $381=(($p_0+4)|0);
   HEAP32[(($381)>>2)]=$380;
   $382=(($189+$psize_0)|0);
   $383=$382;
   HEAP32[(($383)>>2)]=$psize_0;
   $psize_1=$psize_0;
  }
 } while(0);
 $385=$psize_1>>>3;
 $386=($psize_1>>>0)<((256)>>>0);
 if ($386) {
  $388=$385<<1;
  $389=((2344+($388<<2))|0);
  $390=$389;
  $391=((HEAP32[((2304)>>2)])|0);
  $392=1<<$385;
  $393=$391&$392;
  $394=($393|0)==0;
  do {
   if ($394) {
    $396=$391|$392;
    HEAP32[((2304)>>2)]=$396;
    $_sum248_pre=((($388)+(2))|0);
    $_pre=((2344+($_sum248_pre<<2))|0);
    $F16_0=$390;$_pre_phi=$_pre;
   } else {
    $_sum249=((($388)+(2))|0);
    $398=((2344+($_sum249<<2))|0);
    $399=((HEAP32[(($398)>>2)])|0);
    $400=$399;
    $401=((HEAP32[((2320)>>2)])|0);
    $402=($400>>>0)<($401>>>0);
    if (!($402)) {
     $F16_0=$399;$_pre_phi=$398;
     break;
    }
    _abort();
   }
  } while(0);
  HEAP32[(($_pre_phi)>>2)]=$p_0;
  $405=(($F16_0+12)|0);
  HEAP32[(($405)>>2)]=$p_0;
  $406=(($p_0+8)|0);
  HEAP32[(($406)>>2)]=$F16_0;
  $407=(($p_0+12)|0);
  HEAP32[(($407)>>2)]=$390;
  return;
 }
 $409=$p_0;
 $410=$psize_1>>>8;
 $411=($410|0)==0;
 do {
  if ($411) {
   $I18_0=0;
  } else {
   $413=($psize_1>>>0)>((16777215)>>>0);
   if ($413) {
    $I18_0=31;
    break;
   }
   $415=((($410)+(1048320))|0);
   $416=$415>>>16;
   $417=$416&8;
   $418=$410<<$417;
   $419=((($418)+(520192))|0);
   $420=$419>>>16;
   $421=$420&4;
   $422=$421|$417;
   $423=$418<<$421;
   $424=((($423)+(245760))|0);
   $425=$424>>>16;
   $426=$425&2;
   $427=$422|$426;
   $428=(((14)-($427))|0);
   $429=$423<<$426;
   $430=$429>>>15;
   $431=((($428)+($430))|0);
   $432=$431<<1;
   $433=((($431)+(7))|0);
   $434=$psize_1>>>($433>>>0);
   $435=$434&1;
   $436=$435|$432;
   $I18_0=$436;
  }
 } while(0);
 $438=((2608+($I18_0<<2))|0);
 $439=(($p_0+28)|0);
 $I18_0_c=$I18_0;
 HEAP32[(($439)>>2)]=$I18_0_c;
 $440=(($p_0+20)|0);
 HEAP32[(($440)>>2)]=0;
 $441=(($p_0+16)|0);
 HEAP32[(($441)>>2)]=0;
 $442=((HEAP32[((2308)>>2)])|0);
 $443=1<<$I18_0;
 $444=$442&$443;
 $445=($444|0)==0;
 do {
  if ($445) {
   $447=$442|$443;
   HEAP32[((2308)>>2)]=$447;
   HEAP32[(($438)>>2)]=$409;
   $448=(($p_0+24)|0);
   $_c=$438;
   HEAP32[(($448)>>2)]=$_c;
   $449=(($p_0+12)|0);
   HEAP32[(($449)>>2)]=$p_0;
   $450=(($p_0+8)|0);
   HEAP32[(($450)>>2)]=$p_0;
  } else {
   $452=((HEAP32[(($438)>>2)])|0);
   $453=($I18_0|0)==31;
   if ($453) {
    $458=0;
   } else {
    $455=$I18_0>>>1;
    $456=(((25)-($455))|0);
    $458=$456;
   }
   $459=$psize_1<<$458;
   $K19_0=$459;$T_0=$452;
   while(1) {
    $461=(($T_0+4)|0);
    $462=((HEAP32[(($461)>>2)])|0);
    $463=$462&-8;
    $464=($463|0)==($psize_1|0);
    if ($464) {
     break;
    }
    $466=$K19_0>>>31;
    $467=(($T_0+16+($466<<2))|0);
    $468=((HEAP32[(($467)>>2)])|0);
    $469=($468|0)==0;
    $470=$K19_0<<1;
    if ($469) {
     label = 1850;
     break;
    } else {
     $K19_0=$470;$T_0=$468;
    }
   }
   if ((label|0) == 1850) {
    $472=$467;
    $473=((HEAP32[((2320)>>2)])|0);
    $474=($472>>>0)<($473>>>0);
    if ($474) {
     _abort();
    } else {
     HEAP32[(($467)>>2)]=$409;
     $476=(($p_0+24)|0);
     $T_0_c245=$T_0;
     HEAP32[(($476)>>2)]=$T_0_c245;
     $477=(($p_0+12)|0);
     HEAP32[(($477)>>2)]=$p_0;
     $478=(($p_0+8)|0);
     HEAP32[(($478)>>2)]=$p_0;
     break;
    }
   }
   $481=(($T_0+8)|0);
   $482=((HEAP32[(($481)>>2)])|0);
   $483=$T_0;
   $484=((HEAP32[((2320)>>2)])|0);
   $485=($483>>>0)<($484>>>0);
   if ($485) {
    _abort();
   }
   $487=$482;
   $488=($487>>>0)<($484>>>0);
   if ($488) {
    _abort();
   } else {
    $490=(($482+12)|0);
    HEAP32[(($490)>>2)]=$409;
    HEAP32[(($481)>>2)]=$409;
    $491=(($p_0+8)|0);
    $_c244=$482;
    HEAP32[(($491)>>2)]=$_c244;
    $492=(($p_0+12)|0);
    $T_0_c=$T_0;
    HEAP32[(($492)>>2)]=$T_0_c;
    $493=(($p_0+24)|0);
    HEAP32[(($493)>>2)]=0;
    break;
   }
  }
 } while(0);
 $495=((HEAP32[((2336)>>2)])|0);
 $496=((($495)-(1))|0);
 HEAP32[((2336)>>2)]=$496;
 $497=($496|0)==0;
 if ($497) {
  $sp_0_in_i=2760;
 } else {
  return;
 }
 while(1) {
  $sp_0_i=((HEAP32[(($sp_0_in_i)>>2)])|0);
  $498=($sp_0_i|0)==0;
  $499=(($sp_0_i+8)|0);
  if ($498) {
   break;
  } else {
   $sp_0_in_i=$499;
  }
 }
 HEAP32[((2336)>>2)]=-1;
 return;
}
function _realloc($oldmem,$bytes){
 $oldmem=($oldmem)|0;
 $bytes=($bytes)|0;
 var $1=0,$3=0,$5=0,$7=0,$9=0,$11=0,$12=0,$14=0,$15=0,$16=0,$17=0,$18=0,$20=0,$21=0,$23=0,$24=0,$26=0,$27=0,$28=0,$29=0;
 var $30=0,$31=0,$32=0,$33=0,$34=0,$35=0,$mem_0=0,label=0;
 $1=($oldmem|0)==0;
 if ($1) {
  $3=((_malloc($bytes))|0);
  $mem_0=$3;
  return (($mem_0)|0);
 }
 $5=($bytes>>>0)>((4294967231)>>>0);
 if ($5) {
  $7=((___errno_location())|0);
  HEAP32[(($7)>>2)]=12;
  $mem_0=0;
  return (($mem_0)|0);
 }
 $9=($bytes>>>0)<((11)>>>0);
 if ($9) {
  $14=16;
 } else {
  $11=((($bytes)+(11))|0);
  $12=$11&-8;
  $14=$12;
 }
 $15=((($oldmem)-(8))|0);
 $16=$15;
 $17=((_try_realloc_chunk($16,$14))|0);
 $18=($17|0)==0;
 if (!($18)) {
  $20=(($17+8)|0);
  $21=$20;
  $mem_0=$21;
  return (($mem_0)|0);
 }
 $23=((_malloc($bytes))|0);
 $24=($23|0)==0;
 if ($24) {
  $mem_0=0;
  return (($mem_0)|0);
 }
 $26=((($oldmem)-(4))|0);
 $27=$26;
 $28=((HEAP32[(($27)>>2)])|0);
 $29=$28&-8;
 $30=$28&3;
 $31=($30|0)==0;
 $32=($31?8:4);
 $33=((($29)-($32))|0);
 $34=($33>>>0)<($bytes>>>0);
 $35=($34?$33:$bytes);
 (_memcpy((($23)|0), (($oldmem)|0), $35)|0);
 _free($oldmem);
 $mem_0=$23;
 return (($mem_0)|0);
}
function _try_realloc_chunk($p,$nb){
 $p=($p)|0;
 $nb=($nb)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$8=0,$10=0,$11=0,$12=0,$or_cond=0,$_sum3334=0,$14=0,$15=0,$16=0,$17=0,$phitmp=0,$19=0,$21=0;
 var $23=0,$24=0,$26=0,$27=0,$28=0,$29=0,$32=0,$34=0,$35=0,$37=0,$38=0,$39=0,$40=0,$41=0,$_sum29=0,$42=0,$43=0,$44=0,$45=0,$46=0;
 var $48=0,$49=0,$51=0,$52=0,$53=0,$55=0,$56=0,$57=0,$58=0,$59=0,$60=0,$_sum28=0,$61=0,$62=0,$63=0,$65=0,$66=0,$68=0,$69=0,$70=0;
 var $72=0,$73=0,$75=0,$76=0,$77=0,$78=0,$79=0,$80=0,$_sum25=0,$81=0,$82=0,$83=0,$84=0,$_sum26=0,$85=0,$86=0,$87=0,$88=0,$90=0,$91=0;
 var $92=0,$_sum23=0,$93=0,$94=0,$95=0,$96=0,$storemerge27=0,$storemerge=0,$99=0,$100=0,$102=0,$103=0,$104=0,$106=0,$107=0,$108=0,$_sum17=0,$110=0,$111=0,$112=0;
 var $_sum18=0,$113=0,$114=0,$115=0,$116=0,$117=0,$118=0,$119=0,$121=0,$122=0,$124=0,$125=0,$126=0,$127=0,$129=0,$130=0,$131=0,$132=0,$134=0,$_pre=0;
 var $136=0,$137=0,$139=0,$140=0,$141=0,$_pre_phi=0,$142=0,$144=0,$_sum=0,$145=0,$146=0,$147=0,$_sum2=0,$148=0,$149=0,$150=0,$151=0,$_sum14=0,$153=0,$154=0;
 var $155=0,$156=0,$157=0,$159=0,$160=0,$161=0,$163=0,$164=0,$165=0,$_sum4=0,$168=0,$169=0,$170=0,$171=0,$_sum3=0,$173=0,$174=0,$175=0,$176=0,$RP_0=0;
 var $R_0=0,$177=0,$178=0,$179=0,$181=0,$182=0,$183=0,$185=0,$186=0,$R_1=0,$190=0,$_sum11=0,$192=0,$193=0,$194=0,$195=0,$196=0,$197=0,$cond=0,$199=0;
 var $200=0,$201=0,$202=0,$203=0,$205=0,$206=0,$207=0,$209=0,$210=0,$211=0,$214=0,$217=0,$219=0,$220=0,$221=0,$223=0,$_sum12=0,$224=0,$225=0,$226=0;
 var $227=0,$229=0,$230=0,$231=0,$233=0,$234=0,$_sum13=0,$237=0,$238=0,$239=0,$240=0,$242=0,$243=0,$244=0,$246=0,$247=0,$251=0,$253=0,$254=0,$255=0;
 var $256=0,$_sum910=0,$257=0,$258=0,$259=0,$260=0,$262=0,$263=0,$264=0,$265=0,$266=0,$267=0,$_sum5=0,$268=0,$269=0,$270=0,$_sum78=0,$271=0,$272=0,$273=0;
 var $274=0,$newp_0=0,label=0;
 $1=(($p+4)|0);
 $2=((HEAP32[(($1)>>2)])|0);
 $3=$2&-8;
 $4=$p;
 $5=(($4+$3)|0);
 $6=$5;
 $7=((HEAP32[((2320)>>2)])|0);
 $8=($4>>>0)<($7>>>0);
 if ($8) {
  _abort(); return ((0)|0);
  return ((0)|0);
 }
 $10=$2&3;
 $11=($10|0)!=1;
 $12=($4>>>0)<($5>>>0);
 $or_cond=$11&$12;
 if (!($or_cond)) {
  _abort(); return ((0)|0);
  return ((0)|0);
 }
 $_sum3334=$3|4;
 $14=(($4+$_sum3334)|0);
 $15=$14;
 $16=((HEAP32[(($15)>>2)])|0);
 $17=$16&1;
 $phitmp=($17|0)==0;
 if ($phitmp) {
  _abort(); return ((0)|0);
  return ((0)|0);
 }
 $19=($10|0)==0;
 if ($19) {
  $21=($nb>>>0)<((256)>>>0);
  if ($21) {
   $newp_0=0;
   return (($newp_0)|0);
  }
  $23=((($nb)+(4))|0);
  $24=($3>>>0)<($23>>>0);
  do {
   if (!($24)) {
    $26=((($3)-($nb))|0);
    $27=((HEAP32[((2288)>>2)])|0);
    $28=$27<<1;
    $29=($26>>>0)>($28>>>0);
    if ($29) {
     break;
    } else {
     $newp_0=$p;
    }
    return (($newp_0)|0);
   }
  } while(0);
  $newp_0=0;
  return (($newp_0)|0);
 }
 $32=($3>>>0)<($nb>>>0);
 if (!($32)) {
  $34=((($3)-($nb))|0);
  $35=($34>>>0)>((15)>>>0);
  if (!($35)) {
   $newp_0=$p;
   return (($newp_0)|0);
  }
  $37=(($4+$nb)|0);
  $38=$37;
  $39=$2&1;
  $40=$39|$nb;
  $41=$40|2;
  HEAP32[(($1)>>2)]=$41;
  $_sum29=((($nb)+(4))|0);
  $42=(($4+$_sum29)|0);
  $43=$42;
  $44=$34|3;
  HEAP32[(($43)>>2)]=$44;
  $45=((HEAP32[(($15)>>2)])|0);
  $46=$45|1;
  HEAP32[(($15)>>2)]=$46;
  _dispose_chunk($38,$34);
  $newp_0=$p;
  return (($newp_0)|0);
 }
 $48=((HEAP32[((2328)>>2)])|0);
 $49=($6|0)==($48|0);
 if ($49) {
  $51=((HEAP32[((2316)>>2)])|0);
  $52=((($51)+($3))|0);
  $53=($52>>>0)>($nb>>>0);
  if (!($53)) {
   $newp_0=0;
   return (($newp_0)|0);
  }
  $55=((($52)-($nb))|0);
  $56=(($4+$nb)|0);
  $57=$56;
  $58=$2&1;
  $59=$58|$nb;
  $60=$59|2;
  HEAP32[(($1)>>2)]=$60;
  $_sum28=((($nb)+(4))|0);
  $61=(($4+$_sum28)|0);
  $62=$61;
  $63=$55|1;
  HEAP32[(($62)>>2)]=$63;
  HEAP32[((2328)>>2)]=$57;
  HEAP32[((2316)>>2)]=$55;
  $newp_0=$p;
  return (($newp_0)|0);
 }
 $65=((HEAP32[((2324)>>2)])|0);
 $66=($6|0)==($65|0);
 if ($66) {
  $68=((HEAP32[((2312)>>2)])|0);
  $69=((($68)+($3))|0);
  $70=($69>>>0)<($nb>>>0);
  if ($70) {
   $newp_0=0;
   return (($newp_0)|0);
  }
  $72=((($69)-($nb))|0);
  $73=($72>>>0)>((15)>>>0);
  if ($73) {
   $75=(($4+$nb)|0);
   $76=$75;
   $77=(($4+$69)|0);
   $78=$2&1;
   $79=$78|$nb;
   $80=$79|2;
   HEAP32[(($1)>>2)]=$80;
   $_sum25=((($nb)+(4))|0);
   $81=(($4+$_sum25)|0);
   $82=$81;
   $83=$72|1;
   HEAP32[(($82)>>2)]=$83;
   $84=$77;
   HEAP32[(($84)>>2)]=$72;
   $_sum26=((($69)+(4))|0);
   $85=(($4+$_sum26)|0);
   $86=$85;
   $87=((HEAP32[(($86)>>2)])|0);
   $88=$87&-2;
   HEAP32[(($86)>>2)]=$88;
   $storemerge=$76;$storemerge27=$72;
  } else {
   $90=$2&1;
   $91=$90|$69;
   $92=$91|2;
   HEAP32[(($1)>>2)]=$92;
   $_sum23=((($69)+(4))|0);
   $93=(($4+$_sum23)|0);
   $94=$93;
   $95=((HEAP32[(($94)>>2)])|0);
   $96=$95|1;
   HEAP32[(($94)>>2)]=$96;
   $storemerge=0;$storemerge27=0;
  }
  HEAP32[((2312)>>2)]=$storemerge27;
  HEAP32[((2324)>>2)]=$storemerge;
  $newp_0=$p;
  return (($newp_0)|0);
 }
 $99=$16&2;
 $100=($99|0)==0;
 if (!($100)) {
  $newp_0=0;
  return (($newp_0)|0);
 }
 $102=$16&-8;
 $103=((($102)+($3))|0);
 $104=($103>>>0)<($nb>>>0);
 if ($104) {
  $newp_0=0;
  return (($newp_0)|0);
 }
 $106=((($103)-($nb))|0);
 $107=$16>>>3;
 $108=($16>>>0)<((256)>>>0);
 L2574: do {
  if ($108) {
   $_sum17=((($3)+(8))|0);
   $110=(($4+$_sum17)|0);
   $111=$110;
   $112=((HEAP32[(($111)>>2)])|0);
   $_sum18=((($3)+(12))|0);
   $113=(($4+$_sum18)|0);
   $114=$113;
   $115=((HEAP32[(($114)>>2)])|0);
   $116=$107<<1;
   $117=((2344+($116<<2))|0);
   $118=$117;
   $119=($112|0)==($118|0);
   do {
    if (!($119)) {
     $121=$112;
     $122=($121>>>0)<($7>>>0);
     if ($122) {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
     $124=(($112+12)|0);
     $125=((HEAP32[(($124)>>2)])|0);
     $126=($125|0)==($6|0);
     if ($126) {
      break;
     }
     _abort(); return ((0)|0);
     return ((0)|0);
    }
   } while(0);
   $127=($115|0)==($112|0);
   if ($127) {
    $129=1<<$107;
    $130=$129^-1;
    $131=((HEAP32[((2304)>>2)])|0);
    $132=$131&$130;
    HEAP32[((2304)>>2)]=$132;
    break;
   }
   $134=($115|0)==($118|0);
   do {
    if ($134) {
     $_pre=(($115+8)|0);
     $_pre_phi=$_pre;
    } else {
     $136=$115;
     $137=($136>>>0)<($7>>>0);
     if ($137) {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
     $139=(($115+8)|0);
     $140=((HEAP32[(($139)>>2)])|0);
     $141=($140|0)==($6|0);
     if ($141) {
      $_pre_phi=$139;
      break;
     }
     _abort(); return ((0)|0);
     return ((0)|0);
    }
   } while(0);
   $142=(($112+12)|0);
   HEAP32[(($142)>>2)]=$115;
   HEAP32[(($_pre_phi)>>2)]=$112;
  } else {
   $144=$5;
   $_sum=((($3)+(24))|0);
   $145=(($4+$_sum)|0);
   $146=$145;
   $147=((HEAP32[(($146)>>2)])|0);
   $_sum2=((($3)+(12))|0);
   $148=(($4+$_sum2)|0);
   $149=$148;
   $150=((HEAP32[(($149)>>2)])|0);
   $151=($150|0)==($144|0);
   do {
    if ($151) {
     $_sum4=((($3)+(20))|0);
     $168=(($4+$_sum4)|0);
     $169=$168;
     $170=((HEAP32[(($169)>>2)])|0);
     $171=($170|0)==0;
     if ($171) {
      $_sum3=((($3)+(16))|0);
      $173=(($4+$_sum3)|0);
      $174=$173;
      $175=((HEAP32[(($174)>>2)])|0);
      $176=($175|0)==0;
      if ($176) {
       $R_1=0;
       break;
      } else {
       $R_0=$175;$RP_0=$174;
      }
     } else {
      $R_0=$170;$RP_0=$169;
     }
     while(1) {
      $177=(($R_0+20)|0);
      $178=((HEAP32[(($177)>>2)])|0);
      $179=($178|0)==0;
      if (!($179)) {
       $R_0=$178;$RP_0=$177;
       continue;
      }
      $181=(($R_0+16)|0);
      $182=((HEAP32[(($181)>>2)])|0);
      $183=($182|0)==0;
      if ($183) {
       break;
      } else {
       $R_0=$182;$RP_0=$181;
      }
     }
     $185=$RP_0;
     $186=($185>>>0)<($7>>>0);
     if ($186) {
      _abort(); return ((0)|0);
      return ((0)|0);
     } else {
      HEAP32[(($RP_0)>>2)]=0;
      $R_1=$R_0;
      break;
     }
    } else {
     $_sum14=((($3)+(8))|0);
     $153=(($4+$_sum14)|0);
     $154=$153;
     $155=((HEAP32[(($154)>>2)])|0);
     $156=$155;
     $157=($156>>>0)<($7>>>0);
     if ($157) {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
     $159=(($155+12)|0);
     $160=((HEAP32[(($159)>>2)])|0);
     $161=($160|0)==($144|0);
     if (!($161)) {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
     $163=(($150+8)|0);
     $164=((HEAP32[(($163)>>2)])|0);
     $165=($164|0)==($144|0);
     if ($165) {
      HEAP32[(($159)>>2)]=$150;
      HEAP32[(($163)>>2)]=$155;
      $R_1=$150;
      break;
     } else {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
    }
   } while(0);
   $190=($147|0)==0;
   if ($190) {
    break;
   }
   $_sum11=((($3)+(28))|0);
   $192=(($4+$_sum11)|0);
   $193=$192;
   $194=((HEAP32[(($193)>>2)])|0);
   $195=((2608+($194<<2))|0);
   $196=((HEAP32[(($195)>>2)])|0);
   $197=($144|0)==($196|0);
   do {
    if ($197) {
     HEAP32[(($195)>>2)]=$R_1;
     $cond=($R_1|0)==0;
     if (!($cond)) {
      break;
     }
     $199=((HEAP32[(($193)>>2)])|0);
     $200=1<<$199;
     $201=$200^-1;
     $202=((HEAP32[((2308)>>2)])|0);
     $203=$202&$201;
     HEAP32[((2308)>>2)]=$203;
     break L2574;
    } else {
     $205=$147;
     $206=((HEAP32[((2320)>>2)])|0);
     $207=($205>>>0)<($206>>>0);
     if ($207) {
      _abort(); return ((0)|0);
      return ((0)|0);
     }
     $209=(($147+16)|0);
     $210=((HEAP32[(($209)>>2)])|0);
     $211=($210|0)==($144|0);
     if ($211) {
      HEAP32[(($209)>>2)]=$R_1;
     } else {
      $214=(($147+20)|0);
      HEAP32[(($214)>>2)]=$R_1;
     }
     $217=($R_1|0)==0;
     if ($217) {
      break L2574;
     }
    }
   } while(0);
   $219=$R_1;
   $220=((HEAP32[((2320)>>2)])|0);
   $221=($219>>>0)<($220>>>0);
   if ($221) {
    _abort(); return ((0)|0);
    return ((0)|0);
   }
   $223=(($R_1+24)|0);
   HEAP32[(($223)>>2)]=$147;
   $_sum12=((($3)+(16))|0);
   $224=(($4+$_sum12)|0);
   $225=$224;
   $226=((HEAP32[(($225)>>2)])|0);
   $227=($226|0)==0;
   do {
    if (!($227)) {
     $229=$226;
     $230=((HEAP32[((2320)>>2)])|0);
     $231=($229>>>0)<($230>>>0);
     if ($231) {
      _abort(); return ((0)|0);
      return ((0)|0);
     } else {
      $233=(($R_1+16)|0);
      HEAP32[(($233)>>2)]=$226;
      $234=(($226+24)|0);
      HEAP32[(($234)>>2)]=$R_1;
      break;
     }
    }
   } while(0);
   $_sum13=((($3)+(20))|0);
   $237=(($4+$_sum13)|0);
   $238=$237;
   $239=((HEAP32[(($238)>>2)])|0);
   $240=($239|0)==0;
   if ($240) {
    break;
   }
   $242=$239;
   $243=((HEAP32[((2320)>>2)])|0);
   $244=($242>>>0)<($243>>>0);
   if ($244) {
    _abort(); return ((0)|0);
    return ((0)|0);
   } else {
    $246=(($R_1+20)|0);
    HEAP32[(($246)>>2)]=$239;
    $247=(($239+24)|0);
    HEAP32[(($247)>>2)]=$R_1;
    break;
   }
  }
 } while(0);
 $251=($106>>>0)<((16)>>>0);
 if ($251) {
  $253=((HEAP32[(($1)>>2)])|0);
  $254=$253&1;
  $255=$103|$254;
  $256=$255|2;
  HEAP32[(($1)>>2)]=$256;
  $_sum910=$103|4;
  $257=(($4+$_sum910)|0);
  $258=$257;
  $259=((HEAP32[(($258)>>2)])|0);
  $260=$259|1;
  HEAP32[(($258)>>2)]=$260;
  $newp_0=$p;
  return (($newp_0)|0);
 } else {
  $262=(($4+$nb)|0);
  $263=$262;
  $264=((HEAP32[(($1)>>2)])|0);
  $265=$264&1;
  $266=$265|$nb;
  $267=$266|2;
  HEAP32[(($1)>>2)]=$267;
  $_sum5=((($nb)+(4))|0);
  $268=(($4+$_sum5)|0);
  $269=$268;
  $270=$106|3;
  HEAP32[(($269)>>2)]=$270;
  $_sum78=$103|4;
  $271=(($4+$_sum78)|0);
  $272=$271;
  $273=((HEAP32[(($272)>>2)])|0);
  $274=$273|1;
  HEAP32[(($272)>>2)]=$274;
  _dispose_chunk($263,$106);
  $newp_0=$p;
  return (($newp_0)|0);
 }
  return 0;
}
function _dispose_chunk($p,$psize){
 $p=($p)|0;
 $psize=($psize)|0;
 var $1=0,$2=0,$3=0,$4=0,$5=0,$6=0,$7=0,$9=0,$10=0,$11=0,$12=0,$14=0,$15=0,$16=0,$17=0,$18=0,$19=0,$21=0,$22=0,$24=0;
 var $25=0,$_sum35=0,$27=0,$28=0,$29=0,$_sum36=0,$30=0,$31=0,$32=0,$33=0,$34=0,$35=0,$36=0,$38=0,$39=0,$41=0,$42=0,$43=0,$44=0,$46=0;
 var $47=0,$48=0,$49=0,$51=0,$_pre62=0,$53=0,$54=0,$56=0,$57=0,$58=0,$_pre_phi63=0,$59=0,$61=0,$_sum26=0,$62=0,$63=0,$64=0,$_sum27=0,$65=0,$66=0;
 var $67=0,$68=0,$_sum33=0,$70=0,$71=0,$72=0,$73=0,$74=0,$76=0,$77=0,$78=0,$80=0,$81=0,$82=0,$_sum28=0,$_sum29=0,$85=0,$86=0,$87=0,$88=0;
 var $90=0,$91=0,$92=0,$93=0,$RP_0=0,$R_0=0,$94=0,$95=0,$96=0,$98=0,$99=0,$100=0,$102=0,$103=0,$R_1=0,$107=0,$_sum30=0,$109=0,$110=0,$111=0;
 var $112=0,$113=0,$114=0,$cond=0,$116=0,$117=0,$118=0,$119=0,$120=0,$122=0,$123=0,$124=0,$126=0,$127=0,$128=0,$131=0,$134=0,$136=0,$137=0,$138=0;
 var $140=0,$_sum31=0,$141=0,$142=0,$143=0,$144=0,$146=0,$147=0,$148=0,$150=0,$151=0,$_sum32=0,$154=0,$155=0,$156=0,$157=0,$159=0,$160=0,$161=0,$163=0;
 var $164=0,$_sum=0,$168=0,$169=0,$170=0,$171=0,$172=0,$174=0,$175=0,$176=0,$_sum24=0,$177=0,$178=0,$179=0,$_0277=0,$_0=0,$181=0,$182=0,$_sum1=0,$184=0;
 var $185=0,$186=0,$187=0,$188=0,$190=0,$191=0,$193=0,$194=0,$195=0,$196=0,$197=0,$198=0,$201=0,$202=0,$204=0,$205=0,$206=0,$207=0,$208=0,$209=0;
 var $210=0,$212=0,$213=0,$214=0,$215=0,$_sum20=0,$217=0,$218=0,$219=0,$_sum21=0,$220=0,$221=0,$222=0,$223=0,$224=0,$225=0,$226=0,$228=0,$229=0,$231=0;
 var $232=0,$233=0,$234=0,$236=0,$237=0,$238=0,$239=0,$241=0,$_pre60=0,$243=0,$244=0,$246=0,$247=0,$248=0,$_pre_phi61=0,$249=0,$251=0,$_sum2=0,$252=0,$253=0;
 var $254=0,$_sum3=0,$255=0,$256=0,$257=0,$258=0,$_sum18=0,$260=0,$261=0,$262=0,$263=0,$264=0,$266=0,$267=0,$268=0,$270=0,$271=0,$272=0,$_sum5=0,$275=0;
 var $276=0,$277=0,$278=0,$_sum4=0,$280=0,$281=0,$282=0,$283=0,$RP9_0=0,$R7_0=0,$284=0,$285=0,$286=0,$288=0,$289=0,$290=0,$292=0,$293=0,$R7_1=0,$297=0;
 var $_sum15=0,$299=0,$300=0,$301=0,$302=0,$303=0,$304=0,$cond53=0,$306=0,$307=0,$308=0,$309=0,$310=0,$312=0,$313=0,$314=0,$316=0,$317=0,$318=0,$321=0;
 var $324=0,$326=0,$327=0,$328=0,$330=0,$_sum16=0,$331=0,$332=0,$333=0,$334=0,$336=0,$337=0,$338=0,$340=0,$341=0,$_sum17=0,$344=0,$345=0,$346=0,$347=0;
 var $349=0,$350=0,$351=0,$353=0,$354=0,$358=0,$359=0,$360=0,$361=0,$362=0,$363=0,$364=0,$367=0,$368=0,$369=0,$370=0,$371=0,$372=0,$_1=0,$374=0;
 var $375=0,$377=0,$378=0,$379=0,$380=0,$381=0,$382=0,$383=0,$385=0,$_sum13_pre=0,$_pre=0,$_sum14=0,$387=0,$388=0,$389=0,$390=0,$391=0,$_pre_phi=0,$F16_0=0,$394=0;
 var $395=0,$396=0,$398=0,$399=0,$400=0,$402=0,$404=0,$405=0,$406=0,$407=0,$408=0,$409=0,$410=0,$411=0,$412=0,$413=0,$414=0,$415=0,$416=0,$417=0;
 var $418=0,$419=0,$420=0,$421=0,$422=0,$423=0,$424=0,$425=0,$I19_0=0,$427=0,$428=0,$I19_0_c=0,$429=0,$430=0,$431=0,$432=0,$433=0,$434=0,$436=0,$437=0;
 var $_c=0,$438=0,$439=0,$441=0,$442=0,$444=0,$445=0,$447=0,$448=0,$T_0=0,$K20_0=0,$450=0,$451=0,$452=0,$453=0,$455=0,$456=0,$457=0,$458=0,$459=0;
 var $461=0,$462=0,$463=0,$465=0,$T_0_c10=0,$466=0,$467=0,$470=0,$471=0,$472=0,$473=0,$474=0,$476=0,$477=0,$479=0,$480=0,$_c9=0,$481=0,$T_0_c=0,$482=0;
 var label=0;
 $1=$p;
 $2=(($1+$psize)|0);
 $3=$2;
 $4=(($p+4)|0);
 $5=((HEAP32[(($4)>>2)])|0);
 $6=$5&1;
 $7=($6|0)==0;
 L2650: do {
  if ($7) {
   $9=(($p)|0);
   $10=((HEAP32[(($9)>>2)])|0);
   $11=$5&3;
   $12=($11|0)==0;
   if ($12) {
    return;
   }
   $14=(((-$10))|0);
   $15=(($1+$14)|0);
   $16=$15;
   $17=((($10)+($psize))|0);
   $18=((HEAP32[((2320)>>2)])|0);
   $19=($15>>>0)<($18>>>0);
   if ($19) {
    _abort();
   }
   $21=((HEAP32[((2324)>>2)])|0);
   $22=($16|0)==($21|0);
   if ($22) {
    $_sum=((($psize)+(4))|0);
    $168=(($1+$_sum)|0);
    $169=$168;
    $170=((HEAP32[(($169)>>2)])|0);
    $171=$170&3;
    $172=($171|0)==3;
    if (!($172)) {
     $_0=$16;$_0277=$17;
     break;
    }
    HEAP32[((2312)>>2)]=$17;
    $174=((HEAP32[(($169)>>2)])|0);
    $175=$174&-2;
    HEAP32[(($169)>>2)]=$175;
    $176=$17|1;
    $_sum24=(((4)-($10))|0);
    $177=(($1+$_sum24)|0);
    $178=$177;
    HEAP32[(($178)>>2)]=$176;
    $179=$2;
    HEAP32[(($179)>>2)]=$17;
    return;
   }
   $24=$10>>>3;
   $25=($10>>>0)<((256)>>>0);
   if ($25) {
    $_sum35=(((8)-($10))|0);
    $27=(($1+$_sum35)|0);
    $28=$27;
    $29=((HEAP32[(($28)>>2)])|0);
    $_sum36=(((12)-($10))|0);
    $30=(($1+$_sum36)|0);
    $31=$30;
    $32=((HEAP32[(($31)>>2)])|0);
    $33=$24<<1;
    $34=((2344+($33<<2))|0);
    $35=$34;
    $36=($29|0)==($35|0);
    do {
     if (!($36)) {
      $38=$29;
      $39=($38>>>0)<($18>>>0);
      if ($39) {
       _abort();
      }
      $41=(($29+12)|0);
      $42=((HEAP32[(($41)>>2)])|0);
      $43=($42|0)==($16|0);
      if ($43) {
       break;
      }
      _abort();
     }
    } while(0);
    $44=($32|0)==($29|0);
    if ($44) {
     $46=1<<$24;
     $47=$46^-1;
     $48=((HEAP32[((2304)>>2)])|0);
     $49=$48&$47;
     HEAP32[((2304)>>2)]=$49;
     $_0=$16;$_0277=$17;
     break;
    }
    $51=($32|0)==($35|0);
    do {
     if ($51) {
      $_pre62=(($32+8)|0);
      $_pre_phi63=$_pre62;
     } else {
      $53=$32;
      $54=($53>>>0)<($18>>>0);
      if ($54) {
       _abort();
      }
      $56=(($32+8)|0);
      $57=((HEAP32[(($56)>>2)])|0);
      $58=($57|0)==($16|0);
      if ($58) {
       $_pre_phi63=$56;
       break;
      }
      _abort();
     }
    } while(0);
    $59=(($29+12)|0);
    HEAP32[(($59)>>2)]=$32;
    HEAP32[(($_pre_phi63)>>2)]=$29;
    $_0=$16;$_0277=$17;
    break;
   }
   $61=$15;
   $_sum26=(((24)-($10))|0);
   $62=(($1+$_sum26)|0);
   $63=$62;
   $64=((HEAP32[(($63)>>2)])|0);
   $_sum27=(((12)-($10))|0);
   $65=(($1+$_sum27)|0);
   $66=$65;
   $67=((HEAP32[(($66)>>2)])|0);
   $68=($67|0)==($61|0);
   do {
    if ($68) {
     $_sum28=(((16)-($10))|0);
     $_sum29=((($_sum28)+(4))|0);
     $85=(($1+$_sum29)|0);
     $86=$85;
     $87=((HEAP32[(($86)>>2)])|0);
     $88=($87|0)==0;
     if ($88) {
      $90=(($1+$_sum28)|0);
      $91=$90;
      $92=((HEAP32[(($91)>>2)])|0);
      $93=($92|0)==0;
      if ($93) {
       $R_1=0;
       break;
      } else {
       $R_0=$92;$RP_0=$91;
      }
     } else {
      $R_0=$87;$RP_0=$86;
     }
     while(1) {
      $94=(($R_0+20)|0);
      $95=((HEAP32[(($94)>>2)])|0);
      $96=($95|0)==0;
      if (!($96)) {
       $R_0=$95;$RP_0=$94;
       continue;
      }
      $98=(($R_0+16)|0);
      $99=((HEAP32[(($98)>>2)])|0);
      $100=($99|0)==0;
      if ($100) {
       break;
      } else {
       $R_0=$99;$RP_0=$98;
      }
     }
     $102=$RP_0;
     $103=($102>>>0)<($18>>>0);
     if ($103) {
      _abort();
     } else {
      HEAP32[(($RP_0)>>2)]=0;
      $R_1=$R_0;
      break;
     }
    } else {
     $_sum33=(((8)-($10))|0);
     $70=(($1+$_sum33)|0);
     $71=$70;
     $72=((HEAP32[(($71)>>2)])|0);
     $73=$72;
     $74=($73>>>0)<($18>>>0);
     if ($74) {
      _abort();
     }
     $76=(($72+12)|0);
     $77=((HEAP32[(($76)>>2)])|0);
     $78=($77|0)==($61|0);
     if (!($78)) {
      _abort();
     }
     $80=(($67+8)|0);
     $81=((HEAP32[(($80)>>2)])|0);
     $82=($81|0)==($61|0);
     if ($82) {
      HEAP32[(($76)>>2)]=$67;
      HEAP32[(($80)>>2)]=$72;
      $R_1=$67;
      break;
     } else {
      _abort();
     }
    }
   } while(0);
   $107=($64|0)==0;
   if ($107) {
    $_0=$16;$_0277=$17;
    break;
   }
   $_sum30=(((28)-($10))|0);
   $109=(($1+$_sum30)|0);
   $110=$109;
   $111=((HEAP32[(($110)>>2)])|0);
   $112=((2608+($111<<2))|0);
   $113=((HEAP32[(($112)>>2)])|0);
   $114=($61|0)==($113|0);
   do {
    if ($114) {
     HEAP32[(($112)>>2)]=$R_1;
     $cond=($R_1|0)==0;
     if (!($cond)) {
      break;
     }
     $116=((HEAP32[(($110)>>2)])|0);
     $117=1<<$116;
     $118=$117^-1;
     $119=((HEAP32[((2308)>>2)])|0);
     $120=$119&$118;
     HEAP32[((2308)>>2)]=$120;
     $_0=$16;$_0277=$17;
     break L2650;
    } else {
     $122=$64;
     $123=((HEAP32[((2320)>>2)])|0);
     $124=($122>>>0)<($123>>>0);
     if ($124) {
      _abort();
     }
     $126=(($64+16)|0);
     $127=((HEAP32[(($126)>>2)])|0);
     $128=($127|0)==($61|0);
     if ($128) {
      HEAP32[(($126)>>2)]=$R_1;
     } else {
      $131=(($64+20)|0);
      HEAP32[(($131)>>2)]=$R_1;
     }
     $134=($R_1|0)==0;
     if ($134) {
      $_0=$16;$_0277=$17;
      break L2650;
     }
    }
   } while(0);
   $136=$R_1;
   $137=((HEAP32[((2320)>>2)])|0);
   $138=($136>>>0)<($137>>>0);
   if ($138) {
    _abort();
   }
   $140=(($R_1+24)|0);
   HEAP32[(($140)>>2)]=$64;
   $_sum31=(((16)-($10))|0);
   $141=(($1+$_sum31)|0);
   $142=$141;
   $143=((HEAP32[(($142)>>2)])|0);
   $144=($143|0)==0;
   do {
    if (!($144)) {
     $146=$143;
     $147=((HEAP32[((2320)>>2)])|0);
     $148=($146>>>0)<($147>>>0);
     if ($148) {
      _abort();
     } else {
      $150=(($R_1+16)|0);
      HEAP32[(($150)>>2)]=$143;
      $151=(($143+24)|0);
      HEAP32[(($151)>>2)]=$R_1;
      break;
     }
    }
   } while(0);
   $_sum32=((($_sum31)+(4))|0);
   $154=(($1+$_sum32)|0);
   $155=$154;
   $156=((HEAP32[(($155)>>2)])|0);
   $157=($156|0)==0;
   if ($157) {
    $_0=$16;$_0277=$17;
    break;
   }
   $159=$156;
   $160=((HEAP32[((2320)>>2)])|0);
   $161=($159>>>0)<($160>>>0);
   if ($161) {
    _abort();
   } else {
    $163=(($R_1+20)|0);
    HEAP32[(($163)>>2)]=$156;
    $164=(($156+24)|0);
    HEAP32[(($164)>>2)]=$R_1;
    $_0=$16;$_0277=$17;
    break;
   }
  } else {
   $_0=$p;$_0277=$psize;
  }
 } while(0);
 $181=((HEAP32[((2320)>>2)])|0);
 $182=($2>>>0)<($181>>>0);
 if ($182) {
  _abort();
 }
 $_sum1=((($psize)+(4))|0);
 $184=(($1+$_sum1)|0);
 $185=$184;
 $186=((HEAP32[(($185)>>2)])|0);
 $187=$186&2;
 $188=($187|0)==0;
 do {
  if ($188) {
   $190=((HEAP32[((2328)>>2)])|0);
   $191=($3|0)==($190|0);
   if ($191) {
    $193=((HEAP32[((2316)>>2)])|0);
    $194=((($193)+($_0277))|0);
    HEAP32[((2316)>>2)]=$194;
    HEAP32[((2328)>>2)]=$_0;
    $195=$194|1;
    $196=(($_0+4)|0);
    HEAP32[(($196)>>2)]=$195;
    $197=((HEAP32[((2324)>>2)])|0);
    $198=($_0|0)==($197|0);
    if (!($198)) {
     return;
    }
    HEAP32[((2324)>>2)]=0;
    HEAP32[((2312)>>2)]=0;
    return;
   }
   $201=((HEAP32[((2324)>>2)])|0);
   $202=($3|0)==($201|0);
   if ($202) {
    $204=((HEAP32[((2312)>>2)])|0);
    $205=((($204)+($_0277))|0);
    HEAP32[((2312)>>2)]=$205;
    HEAP32[((2324)>>2)]=$_0;
    $206=$205|1;
    $207=(($_0+4)|0);
    HEAP32[(($207)>>2)]=$206;
    $208=$_0;
    $209=(($208+$205)|0);
    $210=$209;
    HEAP32[(($210)>>2)]=$205;
    return;
   }
   $212=$186&-8;
   $213=((($212)+($_0277))|0);
   $214=$186>>>3;
   $215=($186>>>0)<((256)>>>0);
   L2749: do {
    if ($215) {
     $_sum20=((($psize)+(8))|0);
     $217=(($1+$_sum20)|0);
     $218=$217;
     $219=((HEAP32[(($218)>>2)])|0);
     $_sum21=((($psize)+(12))|0);
     $220=(($1+$_sum21)|0);
     $221=$220;
     $222=((HEAP32[(($221)>>2)])|0);
     $223=$214<<1;
     $224=((2344+($223<<2))|0);
     $225=$224;
     $226=($219|0)==($225|0);
     do {
      if (!($226)) {
       $228=$219;
       $229=($228>>>0)<($181>>>0);
       if ($229) {
        _abort();
       }
       $231=(($219+12)|0);
       $232=((HEAP32[(($231)>>2)])|0);
       $233=($232|0)==($3|0);
       if ($233) {
        break;
       }
       _abort();
      }
     } while(0);
     $234=($222|0)==($219|0);
     if ($234) {
      $236=1<<$214;
      $237=$236^-1;
      $238=((HEAP32[((2304)>>2)])|0);
      $239=$238&$237;
      HEAP32[((2304)>>2)]=$239;
      break;
     }
     $241=($222|0)==($225|0);
     do {
      if ($241) {
       $_pre60=(($222+8)|0);
       $_pre_phi61=$_pre60;
      } else {
       $243=$222;
       $244=($243>>>0)<($181>>>0);
       if ($244) {
        _abort();
       }
       $246=(($222+8)|0);
       $247=((HEAP32[(($246)>>2)])|0);
       $248=($247|0)==($3|0);
       if ($248) {
        $_pre_phi61=$246;
        break;
       }
       _abort();
      }
     } while(0);
     $249=(($219+12)|0);
     HEAP32[(($249)>>2)]=$222;
     HEAP32[(($_pre_phi61)>>2)]=$219;
    } else {
     $251=$2;
     $_sum2=((($psize)+(24))|0);
     $252=(($1+$_sum2)|0);
     $253=$252;
     $254=((HEAP32[(($253)>>2)])|0);
     $_sum3=((($psize)+(12))|0);
     $255=(($1+$_sum3)|0);
     $256=$255;
     $257=((HEAP32[(($256)>>2)])|0);
     $258=($257|0)==($251|0);
     do {
      if ($258) {
       $_sum5=((($psize)+(20))|0);
       $275=(($1+$_sum5)|0);
       $276=$275;
       $277=((HEAP32[(($276)>>2)])|0);
       $278=($277|0)==0;
       if ($278) {
        $_sum4=((($psize)+(16))|0);
        $280=(($1+$_sum4)|0);
        $281=$280;
        $282=((HEAP32[(($281)>>2)])|0);
        $283=($282|0)==0;
        if ($283) {
         $R7_1=0;
         break;
        } else {
         $R7_0=$282;$RP9_0=$281;
        }
       } else {
        $R7_0=$277;$RP9_0=$276;
       }
       while(1) {
        $284=(($R7_0+20)|0);
        $285=((HEAP32[(($284)>>2)])|0);
        $286=($285|0)==0;
        if (!($286)) {
         $R7_0=$285;$RP9_0=$284;
         continue;
        }
        $288=(($R7_0+16)|0);
        $289=((HEAP32[(($288)>>2)])|0);
        $290=($289|0)==0;
        if ($290) {
         break;
        } else {
         $R7_0=$289;$RP9_0=$288;
        }
       }
       $292=$RP9_0;
       $293=($292>>>0)<($181>>>0);
       if ($293) {
        _abort();
       } else {
        HEAP32[(($RP9_0)>>2)]=0;
        $R7_1=$R7_0;
        break;
       }
      } else {
       $_sum18=((($psize)+(8))|0);
       $260=(($1+$_sum18)|0);
       $261=$260;
       $262=((HEAP32[(($261)>>2)])|0);
       $263=$262;
       $264=($263>>>0)<($181>>>0);
       if ($264) {
        _abort();
       }
       $266=(($262+12)|0);
       $267=((HEAP32[(($266)>>2)])|0);
       $268=($267|0)==($251|0);
       if (!($268)) {
        _abort();
       }
       $270=(($257+8)|0);
       $271=((HEAP32[(($270)>>2)])|0);
       $272=($271|0)==($251|0);
       if ($272) {
        HEAP32[(($266)>>2)]=$257;
        HEAP32[(($270)>>2)]=$262;
        $R7_1=$257;
        break;
       } else {
        _abort();
       }
      }
     } while(0);
     $297=($254|0)==0;
     if ($297) {
      break;
     }
     $_sum15=((($psize)+(28))|0);
     $299=(($1+$_sum15)|0);
     $300=$299;
     $301=((HEAP32[(($300)>>2)])|0);
     $302=((2608+($301<<2))|0);
     $303=((HEAP32[(($302)>>2)])|0);
     $304=($251|0)==($303|0);
     do {
      if ($304) {
       HEAP32[(($302)>>2)]=$R7_1;
       $cond53=($R7_1|0)==0;
       if (!($cond53)) {
        break;
       }
       $306=((HEAP32[(($300)>>2)])|0);
       $307=1<<$306;
       $308=$307^-1;
       $309=((HEAP32[((2308)>>2)])|0);
       $310=$309&$308;
       HEAP32[((2308)>>2)]=$310;
       break L2749;
      } else {
       $312=$254;
       $313=((HEAP32[((2320)>>2)])|0);
       $314=($312>>>0)<($313>>>0);
       if ($314) {
        _abort();
       }
       $316=(($254+16)|0);
       $317=((HEAP32[(($316)>>2)])|0);
       $318=($317|0)==($251|0);
       if ($318) {
        HEAP32[(($316)>>2)]=$R7_1;
       } else {
        $321=(($254+20)|0);
        HEAP32[(($321)>>2)]=$R7_1;
       }
       $324=($R7_1|0)==0;
       if ($324) {
        break L2749;
       }
      }
     } while(0);
     $326=$R7_1;
     $327=((HEAP32[((2320)>>2)])|0);
     $328=($326>>>0)<($327>>>0);
     if ($328) {
      _abort();
     }
     $330=(($R7_1+24)|0);
     HEAP32[(($330)>>2)]=$254;
     $_sum16=((($psize)+(16))|0);
     $331=(($1+$_sum16)|0);
     $332=$331;
     $333=((HEAP32[(($332)>>2)])|0);
     $334=($333|0)==0;
     do {
      if (!($334)) {
       $336=$333;
       $337=((HEAP32[((2320)>>2)])|0);
       $338=($336>>>0)<($337>>>0);
       if ($338) {
        _abort();
       } else {
        $340=(($R7_1+16)|0);
        HEAP32[(($340)>>2)]=$333;
        $341=(($333+24)|0);
        HEAP32[(($341)>>2)]=$R7_1;
        break;
       }
      }
     } while(0);
     $_sum17=((($psize)+(20))|0);
     $344=(($1+$_sum17)|0);
     $345=$344;
     $346=((HEAP32[(($345)>>2)])|0);
     $347=($346|0)==0;
     if ($347) {
      break;
     }
     $349=$346;
     $350=((HEAP32[((2320)>>2)])|0);
     $351=($349>>>0)<($350>>>0);
     if ($351) {
      _abort();
     } else {
      $353=(($R7_1+20)|0);
      HEAP32[(($353)>>2)]=$346;
      $354=(($346+24)|0);
      HEAP32[(($354)>>2)]=$R7_1;
      break;
     }
    }
   } while(0);
   $358=$213|1;
   $359=(($_0+4)|0);
   HEAP32[(($359)>>2)]=$358;
   $360=$_0;
   $361=(($360+$213)|0);
   $362=$361;
   HEAP32[(($362)>>2)]=$213;
   $363=((HEAP32[((2324)>>2)])|0);
   $364=($_0|0)==($363|0);
   if (!($364)) {
    $_1=$213;
    break;
   }
   HEAP32[((2312)>>2)]=$213;
   return;
  } else {
   $367=$186&-2;
   HEAP32[(($185)>>2)]=$367;
   $368=$_0277|1;
   $369=(($_0+4)|0);
   HEAP32[(($369)>>2)]=$368;
   $370=$_0;
   $371=(($370+$_0277)|0);
   $372=$371;
   HEAP32[(($372)>>2)]=$_0277;
   $_1=$_0277;
  }
 } while(0);
 $374=$_1>>>3;
 $375=($_1>>>0)<((256)>>>0);
 if ($375) {
  $377=$374<<1;
  $378=((2344+($377<<2))|0);
  $379=$378;
  $380=((HEAP32[((2304)>>2)])|0);
  $381=1<<$374;
  $382=$380&$381;
  $383=($382|0)==0;
  do {
   if ($383) {
    $385=$380|$381;
    HEAP32[((2304)>>2)]=$385;
    $_sum13_pre=((($377)+(2))|0);
    $_pre=((2344+($_sum13_pre<<2))|0);
    $F16_0=$379;$_pre_phi=$_pre;
   } else {
    $_sum14=((($377)+(2))|0);
    $387=((2344+($_sum14<<2))|0);
    $388=((HEAP32[(($387)>>2)])|0);
    $389=$388;
    $390=((HEAP32[((2320)>>2)])|0);
    $391=($389>>>0)<($390>>>0);
    if (!($391)) {
     $F16_0=$388;$_pre_phi=$387;
     break;
    }
    _abort();
   }
  } while(0);
  HEAP32[(($_pre_phi)>>2)]=$_0;
  $394=(($F16_0+12)|0);
  HEAP32[(($394)>>2)]=$_0;
  $395=(($_0+8)|0);
  HEAP32[(($395)>>2)]=$F16_0;
  $396=(($_0+12)|0);
  HEAP32[(($396)>>2)]=$379;
  return;
 }
 $398=$_0;
 $399=$_1>>>8;
 $400=($399|0)==0;
 do {
  if ($400) {
   $I19_0=0;
  } else {
   $402=($_1>>>0)>((16777215)>>>0);
   if ($402) {
    $I19_0=31;
    break;
   }
   $404=((($399)+(1048320))|0);
   $405=$404>>>16;
   $406=$405&8;
   $407=$399<<$406;
   $408=((($407)+(520192))|0);
   $409=$408>>>16;
   $410=$409&4;
   $411=$410|$406;
   $412=$407<<$410;
   $413=((($412)+(245760))|0);
   $414=$413>>>16;
   $415=$414&2;
   $416=$411|$415;
   $417=(((14)-($416))|0);
   $418=$412<<$415;
   $419=$418>>>15;
   $420=((($417)+($419))|0);
   $421=$420<<1;
   $422=((($420)+(7))|0);
   $423=$_1>>>($422>>>0);
   $424=$423&1;
   $425=$424|$421;
   $I19_0=$425;
  }
 } while(0);
 $427=((2608+($I19_0<<2))|0);
 $428=(($_0+28)|0);
 $I19_0_c=$I19_0;
 HEAP32[(($428)>>2)]=$I19_0_c;
 $429=(($_0+20)|0);
 HEAP32[(($429)>>2)]=0;
 $430=(($_0+16)|0);
 HEAP32[(($430)>>2)]=0;
 $431=((HEAP32[((2308)>>2)])|0);
 $432=1<<$I19_0;
 $433=$431&$432;
 $434=($433|0)==0;
 if ($434) {
  $436=$431|$432;
  HEAP32[((2308)>>2)]=$436;
  HEAP32[(($427)>>2)]=$398;
  $437=(($_0+24)|0);
  $_c=$427;
  HEAP32[(($437)>>2)]=$_c;
  $438=(($_0+12)|0);
  HEAP32[(($438)>>2)]=$_0;
  $439=(($_0+8)|0);
  HEAP32[(($439)>>2)]=$_0;
  return;
 }
 $441=((HEAP32[(($427)>>2)])|0);
 $442=($I19_0|0)==31;
 if ($442) {
  $447=0;
 } else {
  $444=$I19_0>>>1;
  $445=(((25)-($444))|0);
  $447=$445;
 }
 $448=$_1<<$447;
 $K20_0=$448;$T_0=$441;
 while(1) {
  $450=(($T_0+4)|0);
  $451=((HEAP32[(($450)>>2)])|0);
  $452=$451&-8;
  $453=($452|0)==($_1|0);
  if ($453) {
   break;
  }
  $455=$K20_0>>>31;
  $456=(($T_0+16+($455<<2))|0);
  $457=((HEAP32[(($456)>>2)])|0);
  $458=($457|0)==0;
  $459=$K20_0<<1;
  if ($458) {
   label = 2130;
   break;
  } else {
   $K20_0=$459;$T_0=$457;
  }
 }
 if ((label|0) == 2130) {
  $461=$456;
  $462=((HEAP32[((2320)>>2)])|0);
  $463=($461>>>0)<($462>>>0);
  if ($463) {
   _abort();
  }
  HEAP32[(($456)>>2)]=$398;
  $465=(($_0+24)|0);
  $T_0_c10=$T_0;
  HEAP32[(($465)>>2)]=$T_0_c10;
  $466=(($_0+12)|0);
  HEAP32[(($466)>>2)]=$_0;
  $467=(($_0+8)|0);
  HEAP32[(($467)>>2)]=$_0;
  return;
 }
 $470=(($T_0+8)|0);
 $471=((HEAP32[(($470)>>2)])|0);
 $472=$T_0;
 $473=((HEAP32[((2320)>>2)])|0);
 $474=($472>>>0)<($473>>>0);
 if ($474) {
  _abort();
 }
 $476=$471;
 $477=($476>>>0)<($473>>>0);
 if ($477) {
  _abort();
 }
 $479=(($471+12)|0);
 HEAP32[(($479)>>2)]=$398;
 HEAP32[(($470)>>2)]=$398;
 $480=(($_0+8)|0);
 $_c9=$471;
 HEAP32[(($480)>>2)]=$_c9;
 $481=(($_0+12)|0);
 $T_0_c=$T_0;
 HEAP32[(($481)>>2)]=$T_0_c;
 $482=(($_0+24)|0);
 HEAP32[(($482)>>2)]=0;
 return;
}
function _memset(ptr, value, num) {
    ptr = ptr|0; value = value|0; num = num|0;
    var stop = 0, value4 = 0, stop4 = 0, unaligned = 0;
    stop = (ptr + num)|0;
    if ((num|0) >= 20) {
      // This is unaligned, but quite large, so work hard to get to aligned settings
      value = value & 0xff;
      unaligned = ptr & 3;
      value4 = value | (value << 8) | (value << 16) | (value << 24);
      stop4 = stop & ~3;
      if (unaligned) {
        unaligned = (ptr + 4 - unaligned)|0;
        while ((ptr|0) < (unaligned|0)) { // no need to check for stop, since we have large num
          HEAP8[(ptr)]=value;
          ptr = (ptr+1)|0;
        }
      }
      while ((ptr|0) < (stop4|0)) {
        HEAP32[((ptr)>>2)]=value4;
        ptr = (ptr+4)|0;
      }
    }
    while ((ptr|0) < (stop|0)) {
      HEAP8[(ptr)]=value;
      ptr = (ptr+1)|0;
    }
}
function _saveSetjmp(env, label, table) {
    // Not particularly fast: slow table lookup of setjmpId to label. But setjmp
    // prevents relooping anyhow, so slowness is to be expected. And typical case
    // is 1 setjmp per invocation, or less.
    env = env|0;
    label = label|0;
    table = table|0;
    var i = 0;
    setjmpId = (setjmpId+1)|0;
    HEAP32[((env)>>2)]=setjmpId;
    while ((i|0) < 40) {
      if (((HEAP32[(((table)+((i<<2)))>>2)])|0) == 0) {
        HEAP32[(((table)+((i<<2)))>>2)]=setjmpId;
        HEAP32[(((table)+((i<<2)+4))>>2)]=label;
        // prepare next slot
        HEAP32[(((table)+((i<<2)+8))>>2)]=0;
        return 0;
      }
      i = (i+2)|0;
    }
    _putchar(116);_putchar(111);_putchar(111);_putchar(32);_putchar(109);_putchar(97);_putchar(110);_putchar(121);_putchar(32);_putchar(115);_putchar(101);_putchar(116);_putchar(106);_putchar(109);_putchar(112);_putchar(115);_putchar(32);_putchar(105);_putchar(110);_putchar(32);_putchar(97);_putchar(32);_putchar(102);_putchar(117);_putchar(110);_putchar(99);_putchar(116);_putchar(105);_putchar(111);_putchar(110);_putchar(32);_putchar(99);_putchar(97);_putchar(108);_putchar(108);_putchar(44);_putchar(32);_putchar(98);_putchar(117);_putchar(105);_putchar(108);_putchar(100);_putchar(32);_putchar(119);_putchar(105);_putchar(116);_putchar(104);_putchar(32);_putchar(97);_putchar(32);_putchar(104);_putchar(105);_putchar(103);_putchar(104);_putchar(101);_putchar(114);_putchar(32);_putchar(118);_putchar(97);_putchar(108);_putchar(117);_putchar(101);_putchar(32);_putchar(102);_putchar(111);_putchar(114);_putchar(32);_putchar(77);_putchar(65);_putchar(88);_putchar(95);_putchar(83);_putchar(69);_putchar(84);_putchar(74);_putchar(77);_putchar(80);_putchar(83);_putchar(10);
    abort(0);
    return 0;
}
function _testSetjmp(id, table) {
    id = id|0;
    table = table|0;
    var i = 0, curr = 0;
    while ((i|0) < 20) {
      curr = ((HEAP32[(((table)+((i<<2)))>>2)])|0);
      if ((curr|0) == 0) break;
      if ((curr|0) == (id|0)) {
        return ((HEAP32[(((table)+((i<<2)+4))>>2)])|0);
      }
      i = (i+2)|0;
    }
    return 0;
}
function _memcpy(dest, src, num) {
    dest = dest|0; src = src|0; num = num|0;
    var ret = 0;
    ret = dest|0;
    if ((dest&3) == (src&3)) {
      while (dest & 3) {
        if ((num|0) == 0) return ret|0;
        HEAP8[(dest)]=((HEAP8[(src)])|0);
        dest = (dest+1)|0;
        src = (src+1)|0;
        num = (num-1)|0;
      }
      while ((num|0) >= 4) {
        HEAP32[((dest)>>2)]=((HEAP32[((src)>>2)])|0);
        dest = (dest+4)|0;
        src = (src+4)|0;
        num = (num-4)|0;
      }
    }
    while ((num|0) > 0) {
      HEAP8[(dest)]=((HEAP8[(src)])|0);
      dest = (dest+1)|0;
      src = (src+1)|0;
      num = (num-1)|0;
    }
    return ret|0;
}
function _strlen(ptr) {
    ptr = ptr|0;
    var curr = 0;
    curr = ptr;
    while (((HEAP8[(curr)])|0)) {
      curr = (curr + 1)|0;
    }
    return (curr - ptr)|0;
}
// EMSCRIPTEN_END_FUNCS
  function vii__longjmp__wrapper(a1,a2) { a1=((a1)|0);a2=((a2)|0); ; _longjmp(((a1)|0),((a2)|0)) }
  function dynCall_ii(index,a1) {
    index = index|0;
    a1=a1|0;
    return FUNCTION_TABLE_ii[index&7](a1|0)|0;
  }
  function dynCall_viiiii(index,a1,a2,a3,a4,a5) {
    index = index|0;
    a1=a1|0; a2=a2|0; a3=a3|0; a4=a4|0; a5=a5|0;
    FUNCTION_TABLE_viiiii[index&3](a1|0,a2|0,a3|0,a4|0,a5|0);
  }
  function dynCall_vi(index,a1) {
    index = index|0;
    a1=a1|0;
    FUNCTION_TABLE_vi[index&7](a1|0);
  }
  function dynCall_vii(index,a1,a2) {
    index = index|0;
    a1=a1|0; a2=a2|0;
    FUNCTION_TABLE_vii[index&7](a1|0,a2|0);
  }
  function dynCall_iiii(index,a1,a2,a3) {
    index = index|0;
    a1=a1|0; a2=a2|0; a3=a3|0;
    return FUNCTION_TABLE_iiii[index&7](a1|0,a2|0,a3|0)|0;
  }
  function dynCall_viii(index,a1,a2,a3) {
    index = index|0;
    a1=a1|0; a2=a2|0; a3=a3|0;
    FUNCTION_TABLE_viii[index&3](a1|0,a2|0,a3|0);
  }
  function dynCall_v(index) {
    index = index|0;
    FUNCTION_TABLE_v[index&1]();
  }
  function dynCall_iii(index,a1,a2) {
    index = index|0;
    a1=a1|0; a2=a2|0;
    return FUNCTION_TABLE_iii[index&7](a1|0,a2|0)|0;
  }
function b0(p0) { p0 = p0|0; abort(0); return 0 }
  function b1(p0,p1,p2,p3,p4) { p0 = p0|0;p1 = p1|0;p2 = p2|0;p3 = p3|0;p4 = p4|0; abort(1);  }
  function b2(p0) { p0 = p0|0; abort(2);  }
  function b3(p0,p1) { p0 = p0|0;p1 = p1|0; abort(3);  }
  function b4(p0,p1,p2) { p0 = p0|0;p1 = p1|0;p2 = p2|0; abort(4); return 0 }
  function b5(p0,p1,p2) { p0 = p0|0;p1 = p1|0;p2 = p2|0; abort(5);  }
  function b6() { ; abort(6);  }
  function b7(p0,p1) { p0 = p0|0;p1 = p1|0; abort(7); return 0 }
  // EMSCRIPTEN_END_FUNCS
  var FUNCTION_TABLE_ii = [b0,b0,_tessComputeInterior,b0,_tessMeshTessellateInterior,b0,b0,b0];
  var FUNCTION_TABLE_viiiii = [b1,b1,_OutputPolymesh,b1];
  var FUNCTION_TABLE_vi = [b2,b2,_tessProjectPolygon,b2,_tessMeshCheckMesh,b2,b2,b2];
  var FUNCTION_TABLE_vii = [b3,b3,vii__longjmp__wrapper,b3,_heapFree,b3,_tessMeshDeleteMesh,b3];
  var FUNCTION_TABLE_iiii = [b4,b4,_EdgeLeq,b4,_heapRealloc,b4,_tessMeshSetWindingNumber,b4];
  var FUNCTION_TABLE_viii = [b5,b5,_OutputContours,b5];
  var FUNCTION_TABLE_v = [b6,b6];
  var FUNCTION_TABLE_iii = [b7,b7,_tesvertLeq,b7,_heapAlloc,b7,b7,b7];
  return { _testSetjmp: _testSetjmp, _strlen: _strlen, _tesselate: _tesselate, _free: _free, _getVertexCount: _getVertexCount, _getElementCount: _getElementCount, _deleteTess: _deleteTess, _getVertexIndices: _getVertexIndices, _memset: _memset, _malloc: _malloc, _saveSetjmp: _saveSetjmp, _memcpy: _memcpy, _newTess: _newTess, _addContour: _addContour, _realloc: _realloc, _getVertices: _getVertices, _getElements: _getElements, runPostSets: runPostSets, stackAlloc: stackAlloc, stackSave: stackSave, stackRestore: stackRestore, setThrew: setThrew, setTempRet0: setTempRet0, setTempRet1: setTempRet1, setTempRet2: setTempRet2, setTempRet3: setTempRet3, setTempRet4: setTempRet4, setTempRet5: setTempRet5, setTempRet6: setTempRet6, setTempRet7: setTempRet7, setTempRet8: setTempRet8, setTempRet9: setTempRet9, dynCall_ii: dynCall_ii, dynCall_viiiii: dynCall_viiiii, dynCall_vi: dynCall_vi, dynCall_vii: dynCall_vii, dynCall_iiii: dynCall_iiii, dynCall_viii: dynCall_viii, dynCall_v: dynCall_v, dynCall_iii: dynCall_iii };
})
// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "invoke_ii": invoke_ii, "invoke_viiiii": invoke_viiiii, "invoke_vi": invoke_vi, "invoke_vii": invoke_vii, "invoke_iiii": invoke_iiii, "invoke_viii": invoke_viii, "invoke_v": invoke_v, "invoke_iii": invoke_iii, "_fputc": _fputc, "_pwrite": _pwrite, "_putchar": _putchar, "_sbrk": _sbrk, "___assert_fail": ___assert_fail, "___setErrNo": ___setErrNo, "___errno_location": ___errno_location, "_abort": _abort, "_send": _send, "_write": _write, "_time": _time, "_sysconf": _sysconf, "_longjmp": _longjmp, "_fflush": _fflush, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "NaN": NaN, "Infinity": Infinity }, buffer);
var _testSetjmp = Module["_testSetjmp"] = asm["_testSetjmp"];
var _strlen = Module["_strlen"] = asm["_strlen"];
var _tesselate = Module["_tesselate"] = asm["_tesselate"];
var _free = Module["_free"] = asm["_free"];
var _getVertexCount = Module["_getVertexCount"] = asm["_getVertexCount"];
var _getElementCount = Module["_getElementCount"] = asm["_getElementCount"];
var _deleteTess = Module["_deleteTess"] = asm["_deleteTess"];
var _getVertexIndices = Module["_getVertexIndices"] = asm["_getVertexIndices"];
var _memset = Module["_memset"] = asm["_memset"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _saveSetjmp = Module["_saveSetjmp"] = asm["_saveSetjmp"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var _newTess = Module["_newTess"] = asm["_newTess"];
var _addContour = Module["_addContour"] = asm["_addContour"];
var _realloc = Module["_realloc"] = asm["_realloc"];
var _getVertices = Module["_getVertices"] = asm["_getVertices"];
var _getElements = Module["_getElements"] = asm["_getElements"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_viii = Module["dynCall_viii"] = asm["dynCall_viii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };
// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;
// === Auto-generated postamble setup entry stuff ===
if (memoryInitializer) {
  function applyData(data) {
    HEAPU8.set(data, STATIC_BASE);
  }
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    applyData(Module['readBinary'](memoryInitializer));
  } else {
    addRunDependency('memory initializer');
    Browser.asyncLoad(memoryInitializer, function(data) {
      applyData(data);
      removeRunDependency('memory initializer');
    }, function(data) {
      throw 'could not load memory initializer ' + memoryInitializer;
    });
  }
}
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;
var initialStackTop;
var preloadStartTime = null;
var calledMain = false;
dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun'] && shouldRunNow) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}
Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');
  args = args || [];
  if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
    Module.printErr('preload time: ' + (Date.now() - preloadStartTime) + ' ms');
  }
  ensureInitRuntime();
  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);
  initialStackTop = STACKTOP;
  try {
    var ret = Module['_main'](argc, argv, 0);
    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
      throw e;
    }
  } finally {
    calledMain = true;
  }
}
function run(args) {
  args = args || Module['arguments'];
  if (preloadStartTime === null) preloadStartTime = Date.now();
  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }
  preRun();
  if (runDependencies > 0) {
    // a preRun added a dependency, run will be called later
    return;
  }
  function doRun() {
    ensureInitRuntime();
    preMain();
    Module['calledRun'] = true;
    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }
    postRun();
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;
function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;
  // exit the runtime
  exitRuntime();
  // TODO We should handle this differently based on environment.
  // In the browser, the best we can do is throw an exception
  // to halt execution, but in node we could process.exit and
  // I'd imagine SM shell would have something equivalent.
  // This would let us set a proper exit status (which
  // would be great for checking test exit statuses).
  // https://github.com/kripken/emscripten/issues/1371
  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;
function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }
  ABORT = true;
  EXITSTATUS = 1;
  throw 'abort() at ' + stackTrace();
}
Module['abort'] = Module.abort = abort;
// {{PRE_RUN_ADDITIONS}}
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}
run();
// {{POST_RUN_ADDITIONS}}
// {{MODULE_ADDITIONS}}

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

