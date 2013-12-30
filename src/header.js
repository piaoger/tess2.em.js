
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

