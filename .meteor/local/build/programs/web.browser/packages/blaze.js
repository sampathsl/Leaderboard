//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;
var HTML = Package.htmljs.HTML;
var ObserveSequence = Package['observe-sequence'].ObserveSequence;
var ReactiveVar = Package['reactive-var'].ReactiveVar;

/* Package-scope variables */
var Blaze, UI, Handlebars, AttributeHandler, makeAttributeHandler, ElementAttributesUpdater;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/preamble.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * @namespace Blaze                                                                                                    // 2
 * @summary The namespace for all Blaze-related methods and classes.                                                   // 3
 */                                                                                                                    // 4
Blaze = {};                                                                                                            // 5
                                                                                                                       // 6
// Utility to HTML-escape a string.  Included for legacy reasons.                                                      // 7
Blaze._escape = (function() {                                                                                          // 8
  var escape_map = {                                                                                                   // 9
    "<": "&lt;",                                                                                                       // 10
    ">": "&gt;",                                                                                                       // 11
    '"': "&quot;",                                                                                                     // 12
    "'": "&#x27;",                                                                                                     // 13
    "`": "&#x60;", /* IE allows backtick-delimited attributes?? */                                                     // 14
    "&": "&amp;"                                                                                                       // 15
  };                                                                                                                   // 16
  var escape_one = function(c) {                                                                                       // 17
    return escape_map[c];                                                                                              // 18
  };                                                                                                                   // 19
                                                                                                                       // 20
  return function (x) {                                                                                                // 21
    return x.replace(/[&<>"'`]/g, escape_one);                                                                         // 22
  };                                                                                                                   // 23
})();                                                                                                                  // 24
                                                                                                                       // 25
Blaze._warn = function (msg) {                                                                                         // 26
  msg = 'Warning: ' + msg;                                                                                             // 27
                                                                                                                       // 28
  if ((typeof Log !== 'undefined') && Log && Log.warn)                                                                 // 29
    Log.warn(msg); // use Meteor's "logging" package                                                                   // 30
  else if ((typeof console !== 'undefined') && console.log)                                                            // 31
    console.log(msg);                                                                                                  // 32
};                                                                                                                     // 33
                                                                                                                       // 34
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/dombackend.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var DOMBackend = {};                                                                                                   // 1
Blaze._DOMBackend = DOMBackend;                                                                                        // 2
                                                                                                                       // 3
var $jq = (typeof jQuery !== 'undefined' ? jQuery :                                                                    // 4
           (typeof Package !== 'undefined' ?                                                                           // 5
            Package.jquery && Package.jquery.jQuery : null));                                                          // 6
if (! $jq)                                                                                                             // 7
  throw new Error("jQuery not found");                                                                                 // 8
                                                                                                                       // 9
DOMBackend._$jq = $jq;                                                                                                 // 10
                                                                                                                       // 11
DOMBackend.parseHTML = function (html) {                                                                               // 12
  // Return an array of nodes.                                                                                         // 13
  //                                                                                                                   // 14
  // jQuery does fancy stuff like creating an appropriate                                                              // 15
  // container element and setting innerHTML on it, as well                                                            // 16
  // as working around various IE quirks.                                                                              // 17
  return $jq.parseHTML(html) || [];                                                                                    // 18
};                                                                                                                     // 19
                                                                                                                       // 20
DOMBackend.Events = {                                                                                                  // 21
  // `selector` is non-null.  `type` is one type (but                                                                  // 22
  // may be in backend-specific form, e.g. have namespaces).                                                           // 23
  // Order fired must be order bound.                                                                                  // 24
  delegateEvents: function (elem, type, selector, handler) {                                                           // 25
    $jq(elem).on(type, selector, handler);                                                                             // 26
  },                                                                                                                   // 27
                                                                                                                       // 28
  undelegateEvents: function (elem, type, handler) {                                                                   // 29
    $jq(elem).off(type, '**', handler);                                                                                // 30
  },                                                                                                                   // 31
                                                                                                                       // 32
  bindEventCapturer: function (elem, type, selector, handler) {                                                        // 33
    var $elem = $jq(elem);                                                                                             // 34
                                                                                                                       // 35
    var wrapper = function (event) {                                                                                   // 36
      event = $jq.event.fix(event);                                                                                    // 37
      event.currentTarget = event.target;                                                                              // 38
                                                                                                                       // 39
      // Note: It might improve jQuery interop if we called into jQuery                                                // 40
      // here somehow.  Since we don't use jQuery to dispatch the event,                                               // 41
      // we don't fire any of jQuery's event hooks or anything.  However,                                              // 42
      // since jQuery can't bind capturing handlers, it's not clear                                                    // 43
      // where we would hook in.  Internal jQuery functions like `dispatch`                                            // 44
      // are too high-level.                                                                                           // 45
      var $target = $jq(event.currentTarget);                                                                          // 46
      if ($target.is($elem.find(selector)))                                                                            // 47
        handler.call(elem, event);                                                                                     // 48
    };                                                                                                                 // 49
                                                                                                                       // 50
    handler._meteorui_wrapper = wrapper;                                                                               // 51
                                                                                                                       // 52
    type = DOMBackend.Events.parseEventType(type);                                                                     // 53
    // add *capturing* event listener                                                                                  // 54
    elem.addEventListener(type, wrapper, true);                                                                        // 55
  },                                                                                                                   // 56
                                                                                                                       // 57
  unbindEventCapturer: function (elem, type, handler) {                                                                // 58
    type = DOMBackend.Events.parseEventType(type);                                                                     // 59
    elem.removeEventListener(type, handler._meteorui_wrapper, true);                                                   // 60
  },                                                                                                                   // 61
                                                                                                                       // 62
  parseEventType: function (type) {                                                                                    // 63
    // strip off namespaces                                                                                            // 64
    var dotLoc = type.indexOf('.');                                                                                    // 65
    if (dotLoc >= 0)                                                                                                   // 66
      return type.slice(0, dotLoc);                                                                                    // 67
    return type;                                                                                                       // 68
  }                                                                                                                    // 69
};                                                                                                                     // 70
                                                                                                                       // 71
                                                                                                                       // 72
///// Removal detection and interoperability.                                                                          // 73
                                                                                                                       // 74
// For an explanation of this technique, see:                                                                          // 75
// http://bugs.jquery.com/ticket/12213#comment:23 .                                                                    // 76
//                                                                                                                     // 77
// In short, an element is considered "removed" when jQuery                                                            // 78
// cleans up its *private* userdata on the element,                                                                    // 79
// which we can detect using a custom event with a teardown                                                            // 80
// hook.                                                                                                               // 81
                                                                                                                       // 82
var NOOP = function () {};                                                                                             // 83
                                                                                                                       // 84
// Circular doubly-linked list                                                                                         // 85
var TeardownCallback = function (func) {                                                                               // 86
  this.next = this;                                                                                                    // 87
  this.prev = this;                                                                                                    // 88
  this.func = func;                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
// Insert newElt before oldElt in the circular list                                                                    // 92
TeardownCallback.prototype.linkBefore = function(oldElt) {                                                             // 93
  this.prev = oldElt.prev;                                                                                             // 94
  this.next = oldElt;                                                                                                  // 95
  oldElt.prev.next = this;                                                                                             // 96
  oldElt.prev = this;                                                                                                  // 97
};                                                                                                                     // 98
                                                                                                                       // 99
TeardownCallback.prototype.unlink = function () {                                                                      // 100
  this.prev.next = this.next;                                                                                          // 101
  this.next.prev = this.prev;                                                                                          // 102
};                                                                                                                     // 103
                                                                                                                       // 104
TeardownCallback.prototype.go = function () {                                                                          // 105
  var func = this.func;                                                                                                // 106
  func && func();                                                                                                      // 107
};                                                                                                                     // 108
                                                                                                                       // 109
TeardownCallback.prototype.stop = TeardownCallback.prototype.unlink;                                                   // 110
                                                                                                                       // 111
DOMBackend.Teardown = {                                                                                                // 112
  _JQUERY_EVENT_NAME: 'blaze_teardown_watcher',                                                                        // 113
  _CB_PROP: '$blaze_teardown_callbacks',                                                                               // 114
  // Registers a callback function to be called when the given element or                                              // 115
  // one of its ancestors is removed from the DOM via the backend library.                                             // 116
  // The callback function is called at most once, and it receives the element                                         // 117
  // in question as an argument.                                                                                       // 118
  onElementTeardown: function (elem, func) {                                                                           // 119
    var elt = new TeardownCallback(func);                                                                              // 120
                                                                                                                       // 121
    var propName = DOMBackend.Teardown._CB_PROP;                                                                       // 122
    if (! elem[propName]) {                                                                                            // 123
      // create an empty node that is never unlinked                                                                   // 124
      elem[propName] = new TeardownCallback;                                                                           // 125
                                                                                                                       // 126
      // Set up the event, only the first time.                                                                        // 127
      $jq(elem).on(DOMBackend.Teardown._JQUERY_EVENT_NAME, NOOP);                                                      // 128
    }                                                                                                                  // 129
                                                                                                                       // 130
    elt.linkBefore(elem[propName]);                                                                                    // 131
                                                                                                                       // 132
    return elt; // so caller can call stop()                                                                           // 133
  },                                                                                                                   // 134
  // Recursively call all teardown hooks, in the backend and registered                                                // 135
  // through DOMBackend.onElementTeardown.                                                                             // 136
  tearDownElement: function (elem) {                                                                                   // 137
    var elems = [];                                                                                                    // 138
    // Array.prototype.slice.call doesn't work when given a NodeList in                                                // 139
    // IE8 ("JScript object expected").                                                                                // 140
    var nodeList = elem.getElementsByTagName('*');                                                                     // 141
    for (var i = 0; i < nodeList.length; i++) {                                                                        // 142
      elems.push(nodeList[i]);                                                                                         // 143
    }                                                                                                                  // 144
    elems.push(elem);                                                                                                  // 145
    $jq.cleanData(elems);                                                                                              // 146
  }                                                                                                                    // 147
};                                                                                                                     // 148
                                                                                                                       // 149
$jq.event.special[DOMBackend.Teardown._JQUERY_EVENT_NAME] = {                                                          // 150
  setup: function () {                                                                                                 // 151
    // This "setup" callback is important even though it is empty!                                                     // 152
    // Without it, jQuery will call addEventListener, which is a                                                       // 153
    // performance hit, especially with Chrome's async stack trace                                                     // 154
    // feature enabled.                                                                                                // 155
  },                                                                                                                   // 156
  teardown: function() {                                                                                               // 157
    var elem = this;                                                                                                   // 158
    var callbacks = elem[DOMBackend.Teardown._CB_PROP];                                                                // 159
    if (callbacks) {                                                                                                   // 160
      var elt = callbacks.next;                                                                                        // 161
      while (elt !== callbacks) {                                                                                      // 162
        elt.go();                                                                                                      // 163
        elt = elt.next;                                                                                                // 164
      }                                                                                                                // 165
      callbacks.go();                                                                                                  // 166
                                                                                                                       // 167
      elem[DOMBackend.Teardown._CB_PROP] = null;                                                                       // 168
    }                                                                                                                  // 169
  }                                                                                                                    // 170
};                                                                                                                     // 171
                                                                                                                       // 172
                                                                                                                       // 173
// Must use jQuery semantics for `context`, not                                                                        // 174
// querySelectorAll's.  In other words, all the parts                                                                  // 175
// of `selector` must be found under `context`.                                                                        // 176
DOMBackend.findBySelector = function (selector, context) {                                                             // 177
  return $jq(selector, context);                                                                                       // 178
};                                                                                                                     // 179
                                                                                                                       // 180
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/domrange.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
// A constant empty array (frozen if the JS engine supports it).                                                       // 2
var _emptyArray = Object.freeze ? Object.freeze([]) : [];                                                              // 3
                                                                                                                       // 4
// `[new] Blaze._DOMRange([nodeAndRangeArray])`                                                                        // 5
//                                                                                                                     // 6
// A DOMRange consists of an array of consecutive nodes and DOMRanges,                                                 // 7
// which may be replaced at any time with a new array.  If the DOMRange                                                // 8
// has been attached to the DOM at some location, then updating                                                        // 9
// the array will cause the DOM to be updated at that location.                                                        // 10
Blaze._DOMRange = function (nodeAndRangeArray) {                                                                       // 11
  if (! (this instanceof DOMRange))                                                                                    // 12
    // called without `new`                                                                                            // 13
    return new DOMRange(nodeAndRangeArray);                                                                            // 14
                                                                                                                       // 15
  var members = (nodeAndRangeArray || _emptyArray);                                                                    // 16
  if (! (members && (typeof members.length) === 'number'))                                                             // 17
    throw new Error("Expected array");                                                                                 // 18
                                                                                                                       // 19
  for (var i = 0; i < members.length; i++)                                                                             // 20
    this._memberIn(members[i]);                                                                                        // 21
                                                                                                                       // 22
  this.members = members;                                                                                              // 23
  this.emptyRangePlaceholder = null;                                                                                   // 24
  this.attached = false;                                                                                               // 25
  this.parentElement = null;                                                                                           // 26
  this.parentRange = null;                                                                                             // 27
  this.attachedCallbacks = _emptyArray;                                                                                // 28
};                                                                                                                     // 29
var DOMRange = Blaze._DOMRange;                                                                                        // 30
                                                                                                                       // 31
// In IE 8, don't use empty text nodes as placeholders                                                                 // 32
// in empty DOMRanges, use comment nodes instead.  Using                                                               // 33
// empty text nodes in modern browsers is great because                                                                // 34
// it doesn't clutter the web inspector.  In IE 8, however,                                                            // 35
// it seems to lead in some roundabout way to the OAuth                                                                // 36
// pop-up crashing the browser completely.  In the past,                                                               // 37
// we didn't use empty text nodes on IE 8 because they                                                                 // 38
// don't accept JS properties, so just use the same logic                                                              // 39
// even though we don't need to set properties on the                                                                  // 40
// placeholder anymore.                                                                                                // 41
DOMRange._USE_COMMENT_PLACEHOLDERS = (function () {                                                                    // 42
  var result = false;                                                                                                  // 43
  var textNode = document.createTextNode("");                                                                          // 44
  try {                                                                                                                // 45
    textNode.someProp = true;                                                                                          // 46
  } catch (e) {                                                                                                        // 47
    // IE 8                                                                                                            // 48
    result = true;                                                                                                     // 49
  }                                                                                                                    // 50
  return result;                                                                                                       // 51
})();                                                                                                                  // 52
                                                                                                                       // 53
// static methods                                                                                                      // 54
DOMRange._insert = function (rangeOrNode, parentElement, nextNode, _isMove) {                                          // 55
  var m = rangeOrNode;                                                                                                 // 56
  if (m instanceof DOMRange) {                                                                                         // 57
    m.attach(parentElement, nextNode, _isMove);                                                                        // 58
  } else {                                                                                                             // 59
    if (_isMove)                                                                                                       // 60
      DOMRange._moveNodeWithHooks(m, parentElement, nextNode);                                                         // 61
    else                                                                                                               // 62
      DOMRange._insertNodeWithHooks(m, parentElement, nextNode);                                                       // 63
  }                                                                                                                    // 64
};                                                                                                                     // 65
                                                                                                                       // 66
DOMRange._remove = function (rangeOrNode) {                                                                            // 67
  var m = rangeOrNode;                                                                                                 // 68
  if (m instanceof DOMRange) {                                                                                         // 69
    m.detach();                                                                                                        // 70
  } else {                                                                                                             // 71
    DOMRange._removeNodeWithHooks(m);                                                                                  // 72
  }                                                                                                                    // 73
};                                                                                                                     // 74
                                                                                                                       // 75
DOMRange._removeNodeWithHooks = function (n) {                                                                         // 76
  if (! n.parentNode)                                                                                                  // 77
    return;                                                                                                            // 78
  if (n.nodeType === 1 &&                                                                                              // 79
      n.parentNode._uihooks && n.parentNode._uihooks.removeElement) {                                                  // 80
    n.parentNode._uihooks.removeElement(n);                                                                            // 81
  } else {                                                                                                             // 82
    n.parentNode.removeChild(n);                                                                                       // 83
  }                                                                                                                    // 84
};                                                                                                                     // 85
                                                                                                                       // 86
DOMRange._insertNodeWithHooks = function (n, parent, next) {                                                           // 87
  // `|| null` because IE throws an error if 'next' is undefined                                                       // 88
  next = next || null;                                                                                                 // 89
  if (n.nodeType === 1 &&                                                                                              // 90
      parent._uihooks && parent._uihooks.insertElement) {                                                              // 91
    parent._uihooks.insertElement(n, next);                                                                            // 92
  } else {                                                                                                             // 93
    parent.insertBefore(n, next);                                                                                      // 94
  }                                                                                                                    // 95
};                                                                                                                     // 96
                                                                                                                       // 97
DOMRange._moveNodeWithHooks = function (n, parent, next) {                                                             // 98
  if (n.parentNode !== parent)                                                                                         // 99
    return;                                                                                                            // 100
  // `|| null` because IE throws an error if 'next' is undefined                                                       // 101
  next = next || null;                                                                                                 // 102
  if (n.nodeType === 1 &&                                                                                              // 103
      parent._uihooks && parent._uihooks.moveElement) {                                                                // 104
    parent._uihooks.moveElement(n, next);                                                                              // 105
  } else {                                                                                                             // 106
    parent.insertBefore(n, next);                                                                                      // 107
  }                                                                                                                    // 108
};                                                                                                                     // 109
                                                                                                                       // 110
DOMRange.forElement = function (elem) {                                                                                // 111
  if (elem.nodeType !== 1)                                                                                             // 112
    throw new Error("Expected element, found: " + elem);                                                               // 113
  var range = null;                                                                                                    // 114
  while (elem && ! range) {                                                                                            // 115
    range = (elem.$blaze_range || null);                                                                               // 116
    if (! range)                                                                                                       // 117
      elem = elem.parentNode;                                                                                          // 118
  }                                                                                                                    // 119
  return range;                                                                                                        // 120
};                                                                                                                     // 121
                                                                                                                       // 122
DOMRange.prototype.attach = function (parentElement, nextNode, _isMove, _isReplace) {                                  // 123
  // This method is called to insert the DOMRange into the DOM for                                                     // 124
  // the first time, but it's also used internally when                                                                // 125
  // updating the DOM.                                                                                                 // 126
  //                                                                                                                   // 127
  // If _isMove is true, move this attached range to a different                                                       // 128
  // location under the same parentElement.                                                                            // 129
  if (_isMove || _isReplace) {                                                                                         // 130
    if (! (this.parentElement === parentElement &&                                                                     // 131
           this.attached))                                                                                             // 132
      throw new Error("Can only move or replace an attached DOMRange, and only under the same parent element");        // 133
  }                                                                                                                    // 134
                                                                                                                       // 135
  var members = this.members;                                                                                          // 136
  if (members.length) {                                                                                                // 137
    this.emptyRangePlaceholder = null;                                                                                 // 138
    for (var i = 0; i < members.length; i++) {                                                                         // 139
      DOMRange._insert(members[i], parentElement, nextNode, _isMove);                                                  // 140
    }                                                                                                                  // 141
  } else {                                                                                                             // 142
    var placeholder = (                                                                                                // 143
      DOMRange._USE_COMMENT_PLACEHOLDERS ?                                                                             // 144
        document.createComment("") :                                                                                   // 145
        document.createTextNode(""));                                                                                  // 146
    this.emptyRangePlaceholder = placeholder;                                                                          // 147
    parentElement.insertBefore(placeholder, nextNode || null);                                                         // 148
  }                                                                                                                    // 149
  this.attached = true;                                                                                                // 150
  this.parentElement = parentElement;                                                                                  // 151
                                                                                                                       // 152
  if (! (_isMove || _isReplace)) {                                                                                     // 153
    for(var i = 0; i < this.attachedCallbacks.length; i++) {                                                           // 154
      var obj = this.attachedCallbacks[i];                                                                             // 155
      obj.attached && obj.attached(this, parentElement);                                                               // 156
    }                                                                                                                  // 157
  }                                                                                                                    // 158
};                                                                                                                     // 159
                                                                                                                       // 160
DOMRange.prototype.setMembers = function (newNodeAndRangeArray) {                                                      // 161
  var newMembers = newNodeAndRangeArray;                                                                               // 162
  if (! (newMembers && (typeof newMembers.length) === 'number'))                                                       // 163
    throw new Error("Expected array");                                                                                 // 164
                                                                                                                       // 165
  var oldMembers = this.members;                                                                                       // 166
                                                                                                                       // 167
  for (var i = 0; i < oldMembers.length; i++)                                                                          // 168
    this._memberOut(oldMembers[i]);                                                                                    // 169
  for (var i = 0; i < newMembers.length; i++)                                                                          // 170
    this._memberIn(newMembers[i]);                                                                                     // 171
                                                                                                                       // 172
  if (! this.attached) {                                                                                               // 173
    this.members = newMembers;                                                                                         // 174
  } else {                                                                                                             // 175
    // don't do anything if we're going from empty to empty                                                            // 176
    if (newMembers.length || oldMembers.length) {                                                                      // 177
      // detach the old members and insert the new members                                                             // 178
      var nextNode = this.lastNode().nextSibling;                                                                      // 179
      var parentElement = this.parentElement;                                                                          // 180
      // Use detach/attach, but don't fire attached/detached hooks                                                     // 181
      this.detach(true /*_isReplace*/);                                                                                // 182
      this.members = newMembers;                                                                                       // 183
      this.attach(parentElement, nextNode, false, true /*_isReplace*/);                                                // 184
    }                                                                                                                  // 185
  }                                                                                                                    // 186
};                                                                                                                     // 187
                                                                                                                       // 188
DOMRange.prototype.firstNode = function () {                                                                           // 189
  if (! this.attached)                                                                                                 // 190
    throw new Error("Must be attached");                                                                               // 191
                                                                                                                       // 192
  if (! this.members.length)                                                                                           // 193
    return this.emptyRangePlaceholder;                                                                                 // 194
                                                                                                                       // 195
  var m = this.members[0];                                                                                             // 196
  return (m instanceof DOMRange) ? m.firstNode() : m;                                                                  // 197
};                                                                                                                     // 198
                                                                                                                       // 199
DOMRange.prototype.lastNode = function () {                                                                            // 200
  if (! this.attached)                                                                                                 // 201
    throw new Error("Must be attached");                                                                               // 202
                                                                                                                       // 203
  if (! this.members.length)                                                                                           // 204
    return this.emptyRangePlaceholder;                                                                                 // 205
                                                                                                                       // 206
  var m = this.members[this.members.length - 1];                                                                       // 207
  return (m instanceof DOMRange) ? m.lastNode() : m;                                                                   // 208
};                                                                                                                     // 209
                                                                                                                       // 210
DOMRange.prototype.detach = function (_isReplace) {                                                                    // 211
  if (! this.attached)                                                                                                 // 212
    throw new Error("Must be attached");                                                                               // 213
                                                                                                                       // 214
  var oldParentElement = this.parentElement;                                                                           // 215
  var members = this.members;                                                                                          // 216
  if (members.length) {                                                                                                // 217
    for (var i = 0; i < members.length; i++) {                                                                         // 218
      DOMRange._remove(members[i]);                                                                                    // 219
    }                                                                                                                  // 220
  } else {                                                                                                             // 221
    var placeholder = this.emptyRangePlaceholder;                                                                      // 222
    this.parentElement.removeChild(placeholder);                                                                       // 223
    this.emptyRangePlaceholder = null;                                                                                 // 224
  }                                                                                                                    // 225
                                                                                                                       // 226
  if (! _isReplace) {                                                                                                  // 227
    this.attached = false;                                                                                             // 228
    this.parentElement = null;                                                                                         // 229
                                                                                                                       // 230
    for(var i = 0; i < this.attachedCallbacks.length; i++) {                                                           // 231
      var obj = this.attachedCallbacks[i];                                                                             // 232
      obj.detached && obj.detached(this, oldParentElement);                                                            // 233
    }                                                                                                                  // 234
  }                                                                                                                    // 235
};                                                                                                                     // 236
                                                                                                                       // 237
DOMRange.prototype.addMember = function (newMember, atIndex, _isMove) {                                                // 238
  var members = this.members;                                                                                          // 239
  if (! (atIndex >= 0 && atIndex <= members.length))                                                                   // 240
    throw new Error("Bad index in range.addMember: " + atIndex);                                                       // 241
                                                                                                                       // 242
  if (! _isMove)                                                                                                       // 243
    this._memberIn(newMember);                                                                                         // 244
                                                                                                                       // 245
  if (! this.attached) {                                                                                               // 246
    // currently detached; just updated members                                                                        // 247
    members.splice(atIndex, 0, newMember);                                                                             // 248
  } else if (members.length === 0) {                                                                                   // 249
    // empty; use the empty-to-nonempty handling of setMembers                                                         // 250
    this.setMembers([newMember]);                                                                                      // 251
  } else {                                                                                                             // 252
    var nextNode;                                                                                                      // 253
    if (atIndex === members.length) {                                                                                  // 254
      // insert at end                                                                                                 // 255
      nextNode = this.lastNode().nextSibling;                                                                          // 256
    } else {                                                                                                           // 257
      var m = members[atIndex];                                                                                        // 258
      nextNode = (m instanceof DOMRange) ? m.firstNode() : m;                                                          // 259
    }                                                                                                                  // 260
    members.splice(atIndex, 0, newMember);                                                                             // 261
    DOMRange._insert(newMember, this.parentElement, nextNode, _isMove);                                                // 262
  }                                                                                                                    // 263
};                                                                                                                     // 264
                                                                                                                       // 265
DOMRange.prototype.removeMember = function (atIndex, _isMove) {                                                        // 266
  var members = this.members;                                                                                          // 267
  if (! (atIndex >= 0 && atIndex < members.length))                                                                    // 268
    throw new Error("Bad index in range.removeMember: " + atIndex);                                                    // 269
                                                                                                                       // 270
  if (_isMove) {                                                                                                       // 271
    members.splice(atIndex, 1);                                                                                        // 272
  } else {                                                                                                             // 273
    var oldMember = members[atIndex];                                                                                  // 274
    this._memberOut(oldMember);                                                                                        // 275
                                                                                                                       // 276
    if (members.length === 1) {                                                                                        // 277
      // becoming empty; use the logic in setMembers                                                                   // 278
      this.setMembers(_emptyArray);                                                                                    // 279
    } else {                                                                                                           // 280
      members.splice(atIndex, 1);                                                                                      // 281
      if (this.attached)                                                                                               // 282
        DOMRange._remove(oldMember);                                                                                   // 283
    }                                                                                                                  // 284
  }                                                                                                                    // 285
};                                                                                                                     // 286
                                                                                                                       // 287
DOMRange.prototype.moveMember = function (oldIndex, newIndex) {                                                        // 288
  var member = this.members[oldIndex];                                                                                 // 289
  this.removeMember(oldIndex, true /*_isMove*/);                                                                       // 290
  this.addMember(member, newIndex, true /*_isMove*/);                                                                  // 291
};                                                                                                                     // 292
                                                                                                                       // 293
DOMRange.prototype.getMember = function (atIndex) {                                                                    // 294
  var members = this.members;                                                                                          // 295
  if (! (atIndex >= 0 && atIndex < members.length))                                                                    // 296
    throw new Error("Bad index in range.getMember: " + atIndex);                                                       // 297
  return this.members[atIndex];                                                                                        // 298
};                                                                                                                     // 299
                                                                                                                       // 300
DOMRange.prototype._memberIn = function (m) {                                                                          // 301
  if (m instanceof DOMRange)                                                                                           // 302
    m.parentRange = this;                                                                                              // 303
  else if (m.nodeType === 1) // DOM Element                                                                            // 304
    m.$blaze_range = this;                                                                                             // 305
};                                                                                                                     // 306
                                                                                                                       // 307
DOMRange._destroy = function (m, _skipNodes) {                                                                         // 308
  if (m instanceof DOMRange) {                                                                                         // 309
    if (m.view)                                                                                                        // 310
      Blaze._destroyView(m.view, _skipNodes);                                                                          // 311
  } else if ((! _skipNodes) && m.nodeType === 1) {                                                                     // 312
    // DOM Element                                                                                                     // 313
    if (m.$blaze_range) {                                                                                              // 314
      Blaze._destroyNode(m);                                                                                           // 315
      m.$blaze_range = null;                                                                                           // 316
    }                                                                                                                  // 317
  }                                                                                                                    // 318
};                                                                                                                     // 319
                                                                                                                       // 320
DOMRange.prototype._memberOut = DOMRange._destroy;                                                                     // 321
                                                                                                                       // 322
// Tear down, but don't remove, the members.  Used when chunks                                                         // 323
// of DOM are being torn down or replaced.                                                                             // 324
DOMRange.prototype.destroyMembers = function (_skipNodes) {                                                            // 325
  var members = this.members;                                                                                          // 326
  for (var i = 0; i < members.length; i++)                                                                             // 327
    this._memberOut(members[i], _skipNodes);                                                                           // 328
};                                                                                                                     // 329
                                                                                                                       // 330
DOMRange.prototype.destroy = function (_skipNodes) {                                                                   // 331
  DOMRange._destroy(this, _skipNodes);                                                                                 // 332
};                                                                                                                     // 333
                                                                                                                       // 334
DOMRange.prototype.containsElement = function (elem) {                                                                 // 335
  if (! this.attached)                                                                                                 // 336
    throw new Error("Must be attached");                                                                               // 337
                                                                                                                       // 338
  // An element is contained in this DOMRange if it's possible to                                                      // 339
  // reach it by walking parent pointers, first through the DOM and                                                    // 340
  // then parentRange pointers.  In other words, the element or some                                                   // 341
  // ancestor of it is at our level of the DOM (a child of our                                                         // 342
  // parentElement), and this element is one of our members or                                                         // 343
  // is a member of a descendant Range.                                                                                // 344
                                                                                                                       // 345
  // First check that elem is a descendant of this.parentElement,                                                      // 346
  // according to the DOM.                                                                                             // 347
  if (! Blaze._elementContains(this.parentElement, elem))                                                              // 348
    return false;                                                                                                      // 349
                                                                                                                       // 350
  // If elem is not an immediate child of this.parentElement,                                                          // 351
  // walk up to its ancestor that is.                                                                                  // 352
  while (elem.parentNode !== this.parentElement)                                                                       // 353
    elem = elem.parentNode;                                                                                            // 354
                                                                                                                       // 355
  var range = elem.$blaze_range;                                                                                       // 356
  while (range && range !== this)                                                                                      // 357
    range = range.parentRange;                                                                                         // 358
                                                                                                                       // 359
  return range === this;                                                                                               // 360
};                                                                                                                     // 361
                                                                                                                       // 362
DOMRange.prototype.containsRange = function (range) {                                                                  // 363
  if (! this.attached)                                                                                                 // 364
    throw new Error("Must be attached");                                                                               // 365
                                                                                                                       // 366
  if (! range.attached)                                                                                                // 367
    return false;                                                                                                      // 368
                                                                                                                       // 369
  // A DOMRange is contained in this DOMRange if it's possible                                                         // 370
  // to reach this range by following parent pointers.  If the                                                         // 371
  // DOMRange has the same parentElement, then it should be                                                            // 372
  // a member, or a member of a member etc.  Otherwise, we must                                                        // 373
  // contain its parentElement.                                                                                        // 374
                                                                                                                       // 375
  if (range.parentElement !== this.parentElement)                                                                      // 376
    return this.containsElement(range.parentElement);                                                                  // 377
                                                                                                                       // 378
  if (range === this)                                                                                                  // 379
    return false; // don't contain self                                                                                // 380
                                                                                                                       // 381
  while (range && range !== this)                                                                                      // 382
    range = range.parentRange;                                                                                         // 383
                                                                                                                       // 384
  return range === this;                                                                                               // 385
};                                                                                                                     // 386
                                                                                                                       // 387
DOMRange.prototype.onAttached = function (attached) {                                                                  // 388
  this.onAttachedDetached({ attached: attached });                                                                     // 389
};                                                                                                                     // 390
                                                                                                                       // 391
// callbacks are `attached(range, element)` and                                                                        // 392
// `detached(range, element)`, and they may                                                                            // 393
// access the `callbacks` object in `this`.                                                                            // 394
// The arguments to `detached` are the same                                                                            // 395
// range and element that were passed to `attached`.                                                                   // 396
DOMRange.prototype.onAttachedDetached = function (callbacks) {                                                         // 397
  if (this.attachedCallbacks === _emptyArray)                                                                          // 398
    this.attachedCallbacks = [];                                                                                       // 399
  this.attachedCallbacks.push(callbacks);                                                                              // 400
};                                                                                                                     // 401
                                                                                                                       // 402
DOMRange.prototype.$ = function (selector) {                                                                           // 403
  var self = this;                                                                                                     // 404
                                                                                                                       // 405
  var parentNode = this.parentElement;                                                                                 // 406
  if (! parentNode)                                                                                                    // 407
    throw new Error("Can't select in removed DomRange");                                                               // 408
                                                                                                                       // 409
  // Strategy: Find all selector matches under parentNode,                                                             // 410
  // then filter out the ones that aren't in this DomRange                                                             // 411
  // using `DOMRange#containsElement`.  This is                                                                        // 412
  // asymptotically slow in the presence of O(N) sibling                                                               // 413
  // content that is under parentNode but not in our range,                                                            // 414
  // so if performance is an issue, the selector should be                                                             // 415
  // run on a child element.                                                                                           // 416
                                                                                                                       // 417
  // Since jQuery can't run selectors on a DocumentFragment,                                                           // 418
  // we don't expect findBySelector to work.                                                                           // 419
  if (parentNode.nodeType === 11 /* DocumentFragment */)                                                               // 420
    throw new Error("Can't use $ on an offscreen range");                                                              // 421
                                                                                                                       // 422
  var results = Blaze._DOMBackend.findBySelector(selector, parentNode);                                                // 423
                                                                                                                       // 424
  // We don't assume `results` has jQuery API; a plain array                                                           // 425
  // should do just as well.  However, if we do have a jQuery                                                          // 426
  // array, we want to end up with one also, so we use                                                                 // 427
  // `.filter`.                                                                                                        // 428
                                                                                                                       // 429
  // Function that selects only elements that are actually                                                             // 430
  // in this DomRange, rather than simply descending from                                                              // 431
  // `parentNode`.                                                                                                     // 432
  var filterFunc = function (elem) {                                                                                   // 433
    // handle jQuery's arguments to filter, where the node                                                             // 434
    // is in `this` and the index is the first argument.                                                               // 435
    if (typeof elem === 'number')                                                                                      // 436
      elem = this;                                                                                                     // 437
                                                                                                                       // 438
    return self.containsElement(elem);                                                                                 // 439
  };                                                                                                                   // 440
                                                                                                                       // 441
  if (! results.filter) {                                                                                              // 442
    // not a jQuery array, and not a browser with                                                                      // 443
    // Array.prototype.filter (e.g. IE <9)                                                                             // 444
    var newResults = [];                                                                                               // 445
    for (var i = 0; i < results.length; i++) {                                                                         // 446
      var x = results[i];                                                                                              // 447
      if (filterFunc(x))                                                                                               // 448
        newResults.push(x);                                                                                            // 449
    }                                                                                                                  // 450
    results = newResults;                                                                                              // 451
  } else {                                                                                                             // 452
    // `results.filter` is either jQuery's or ECMAScript's `filter`                                                    // 453
    results = results.filter(filterFunc);                                                                              // 454
  }                                                                                                                    // 455
                                                                                                                       // 456
  return results;                                                                                                      // 457
};                                                                                                                     // 458
                                                                                                                       // 459
// Returns true if element a contains node b and is not node b.                                                        // 460
//                                                                                                                     // 461
// The restriction that `a` be an element (not a document fragment,                                                    // 462
// say) is based on what's easy to implement cross-browser.                                                            // 463
Blaze._elementContains = function (a, b) {                                                                             // 464
  if (a.nodeType !== 1) // ELEMENT                                                                                     // 465
    return false;                                                                                                      // 466
  if (a === b)                                                                                                         // 467
    return false;                                                                                                      // 468
                                                                                                                       // 469
  if (a.compareDocumentPosition) {                                                                                     // 470
    return a.compareDocumentPosition(b) & 0x10;                                                                        // 471
  } else {                                                                                                             // 472
    // Should be only old IE and maybe other old browsers here.                                                        // 473
    // Modern Safari has both functions but seems to get contains() wrong.                                             // 474
    // IE can't handle b being a text node.  We work around this                                                       // 475
    // by doing a direct parent test now.                                                                              // 476
    b = b.parentNode;                                                                                                  // 477
    if (! (b && b.nodeType === 1)) // ELEMENT                                                                          // 478
      return false;                                                                                                    // 479
    if (a === b)                                                                                                       // 480
      return true;                                                                                                     // 481
                                                                                                                       // 482
    return a.contains(b);                                                                                              // 483
  }                                                                                                                    // 484
};                                                                                                                     // 485
                                                                                                                       // 486
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/events.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var EventSupport = Blaze._EventSupport = {};                                                                           // 1
                                                                                                                       // 2
var DOMBackend = Blaze._DOMBackend;                                                                                    // 3
                                                                                                                       // 4
// List of events to always delegate, never capture.                                                                   // 5
// Since jQuery fakes bubbling for certain events in                                                                   // 6
// certain browsers (like `submit`), we don't want to                                                                  // 7
// get in its way.                                                                                                     // 8
//                                                                                                                     // 9
// We could list all known bubbling                                                                                    // 10
// events here to avoid creating speculative capturers                                                                 // 11
// for them, but it would only be an optimization.                                                                     // 12
var eventsToDelegate = EventSupport.eventsToDelegate = {                                                               // 13
  blur: 1, change: 1, click: 1, focus: 1, focusin: 1,                                                                  // 14
  focusout: 1, reset: 1, submit: 1                                                                                     // 15
};                                                                                                                     // 16
                                                                                                                       // 17
var EVENT_MODE = EventSupport.EVENT_MODE = {                                                                           // 18
  TBD: 0,                                                                                                              // 19
  BUBBLING: 1,                                                                                                         // 20
  CAPTURING: 2                                                                                                         // 21
};                                                                                                                     // 22
                                                                                                                       // 23
var NEXT_HANDLERREC_ID = 1;                                                                                            // 24
                                                                                                                       // 25
var HandlerRec = function (elem, type, selector, handler, recipient) {                                                 // 26
  this.elem = elem;                                                                                                    // 27
  this.type = type;                                                                                                    // 28
  this.selector = selector;                                                                                            // 29
  this.handler = handler;                                                                                              // 30
  this.recipient = recipient;                                                                                          // 31
  this.id = (NEXT_HANDLERREC_ID++);                                                                                    // 32
                                                                                                                       // 33
  this.mode = EVENT_MODE.TBD;                                                                                          // 34
                                                                                                                       // 35
  // It's important that delegatedHandler be a different                                                               // 36
  // instance for each handlerRecord, because its identity                                                             // 37
  // is used to remove it.                                                                                             // 38
  //                                                                                                                   // 39
  // It's also important that the closure have access to                                                               // 40
  // `this` when it is not called with it set.                                                                         // 41
  this.delegatedHandler = (function (h) {                                                                              // 42
    return function (evt) {                                                                                            // 43
      if ((! h.selector) && evt.currentTarget !== evt.target)                                                          // 44
        // no selector means only fire on target                                                                       // 45
        return;                                                                                                        // 46
      return h.handler.apply(h.recipient, arguments);                                                                  // 47
    };                                                                                                                 // 48
  })(this);                                                                                                            // 49
                                                                                                                       // 50
  // WHY CAPTURE AND DELEGATE: jQuery can't delegate                                                                   // 51
  // non-bubbling events, because                                                                                      // 52
  // event capture doesn't work in IE 8.  However, there                                                               // 53
  // are all sorts of new-fangled non-bubbling events                                                                  // 54
  // like "play" and "touchenter".  We delegate these                                                                  // 55
  // events using capture in all browsers except IE 8.                                                                 // 56
  // IE 8 doesn't support these events anyway.                                                                         // 57
                                                                                                                       // 58
  var tryCapturing = elem.addEventListener &&                                                                          // 59
        (! _.has(eventsToDelegate,                                                                                     // 60
                 DOMBackend.Events.parseEventType(type)));                                                             // 61
                                                                                                                       // 62
  if (tryCapturing) {                                                                                                  // 63
    this.capturingHandler = (function (h) {                                                                            // 64
      return function (evt) {                                                                                          // 65
        if (h.mode === EVENT_MODE.TBD) {                                                                               // 66
          // must be first time we're called.                                                                          // 67
          if (evt.bubbles) {                                                                                           // 68
            // this type of event bubbles, so don't                                                                    // 69
            // get called again.                                                                                       // 70
            h.mode = EVENT_MODE.BUBBLING;                                                                              // 71
            DOMBackend.Events.unbindEventCapturer(                                                                     // 72
              h.elem, h.type, h.capturingHandler);                                                                     // 73
            return;                                                                                                    // 74
          } else {                                                                                                     // 75
            // this type of event doesn't bubble,                                                                      // 76
            // so unbind the delegation, preventing                                                                    // 77
            // it from ever firing.                                                                                    // 78
            h.mode = EVENT_MODE.CAPTURING;                                                                             // 79
            DOMBackend.Events.undelegateEvents(                                                                        // 80
              h.elem, h.type, h.delegatedHandler);                                                                     // 81
          }                                                                                                            // 82
        }                                                                                                              // 83
                                                                                                                       // 84
        h.delegatedHandler(evt);                                                                                       // 85
      };                                                                                                               // 86
    })(this);                                                                                                          // 87
                                                                                                                       // 88
  } else {                                                                                                             // 89
    this.mode = EVENT_MODE.BUBBLING;                                                                                   // 90
  }                                                                                                                    // 91
};                                                                                                                     // 92
EventSupport.HandlerRec = HandlerRec;                                                                                  // 93
                                                                                                                       // 94
HandlerRec.prototype.bind = function () {                                                                              // 95
  // `this.mode` may be EVENT_MODE_TBD, in which case we bind both. in                                                 // 96
  // this case, 'capturingHandler' is in charge of detecting the                                                       // 97
  // correct mode and turning off one or the other handlers.                                                           // 98
  if (this.mode !== EVENT_MODE.BUBBLING) {                                                                             // 99
    DOMBackend.Events.bindEventCapturer(                                                                               // 100
      this.elem, this.type, this.selector || '*',                                                                      // 101
      this.capturingHandler);                                                                                          // 102
  }                                                                                                                    // 103
                                                                                                                       // 104
  if (this.mode !== EVENT_MODE.CAPTURING)                                                                              // 105
    DOMBackend.Events.delegateEvents(                                                                                  // 106
      this.elem, this.type,                                                                                            // 107
      this.selector || '*', this.delegatedHandler);                                                                    // 108
};                                                                                                                     // 109
                                                                                                                       // 110
HandlerRec.prototype.unbind = function () {                                                                            // 111
  if (this.mode !== EVENT_MODE.BUBBLING)                                                                               // 112
    DOMBackend.Events.unbindEventCapturer(this.elem, this.type,                                                        // 113
                                          this.capturingHandler);                                                      // 114
                                                                                                                       // 115
  if (this.mode !== EVENT_MODE.CAPTURING)                                                                              // 116
    DOMBackend.Events.undelegateEvents(this.elem, this.type,                                                           // 117
                                       this.delegatedHandler);                                                         // 118
};                                                                                                                     // 119
                                                                                                                       // 120
EventSupport.listen = function (element, events, selector, handler, recipient, getParentRecipient) {                   // 121
                                                                                                                       // 122
  // Prevent this method from being JITed by Safari.  Due to a                                                         // 123
  // presumed JIT bug in Safari -- observed in Version 7.0.6                                                           // 124
  // (9537.78.2) -- this method may crash the Safari render process if                                                 // 125
  // it is JITed.                                                                                                      // 126
  // Repro: https://github.com/dgreensp/public/tree/master/safari-crash                                                // 127
  try { element = element; } finally {}                                                                                // 128
                                                                                                                       // 129
  var eventTypes = [];                                                                                                 // 130
  events.replace(/[^ /]+/g, function (e) {                                                                             // 131
    eventTypes.push(e);                                                                                                // 132
  });                                                                                                                  // 133
                                                                                                                       // 134
  var newHandlerRecs = [];                                                                                             // 135
  for (var i = 0, N = eventTypes.length; i < N; i++) {                                                                 // 136
    var type = eventTypes[i];                                                                                          // 137
                                                                                                                       // 138
    var eventDict = element.$blaze_events;                                                                             // 139
    if (! eventDict)                                                                                                   // 140
      eventDict = (element.$blaze_events = {});                                                                        // 141
                                                                                                                       // 142
    var info = eventDict[type];                                                                                        // 143
    if (! info) {                                                                                                      // 144
      info = eventDict[type] = {};                                                                                     // 145
      info.handlers = [];                                                                                              // 146
    }                                                                                                                  // 147
    var handlerList = info.handlers;                                                                                   // 148
    var handlerRec = new HandlerRec(                                                                                   // 149
      element, type, selector, handler, recipient);                                                                    // 150
    newHandlerRecs.push(handlerRec);                                                                                   // 151
    handlerRec.bind();                                                                                                 // 152
    handlerList.push(handlerRec);                                                                                      // 153
    // Move handlers of enclosing ranges to end, by unbinding and rebinding                                            // 154
    // them.  In jQuery (or other DOMBackend) this causes them to fire                                                 // 155
    // later when the backend dispatches event handlers.                                                               // 156
    if (getParentRecipient) {                                                                                          // 157
      for (var r = getParentRecipient(recipient); r;                                                                   // 158
           r = getParentRecipient(r)) {                                                                                // 159
        // r is an enclosing range (recipient)                                                                         // 160
        for (var j = 0, Nj = handlerList.length;                                                                       // 161
             j < Nj; j++) {                                                                                            // 162
          var h = handlerList[j];                                                                                      // 163
          if (h.recipient === r) {                                                                                     // 164
            h.unbind();                                                                                                // 165
            h.bind();                                                                                                  // 166
            handlerList.splice(j, 1); // remove handlerList[j]                                                         // 167
            handlerList.push(h);                                                                                       // 168
            j--; // account for removed handler                                                                        // 169
            Nj--; // don't visit appended handlers                                                                     // 170
          }                                                                                                            // 171
        }                                                                                                              // 172
      }                                                                                                                // 173
    }                                                                                                                  // 174
  }                                                                                                                    // 175
                                                                                                                       // 176
  return {                                                                                                             // 177
    // closes over just `element` and `newHandlerRecs`                                                                 // 178
    stop: function () {                                                                                                // 179
      var eventDict = element.$blaze_events;                                                                           // 180
      if (! eventDict)                                                                                                 // 181
        return;                                                                                                        // 182
      // newHandlerRecs has only one item unless you specify multiple                                                  // 183
      // event types.  If this code is slow, it's because we have to                                                   // 184
      // iterate over handlerList here.  Clearing a whole handlerList                                                  // 185
      // via stop() methods is O(N^2) in the number of handlers on                                                     // 186
      // an element.                                                                                                   // 187
      for (var i = 0; i < newHandlerRecs.length; i++) {                                                                // 188
        var handlerToRemove = newHandlerRecs[i];                                                                       // 189
        var info = eventDict[handlerToRemove.type];                                                                    // 190
        if (! info)                                                                                                    // 191
          continue;                                                                                                    // 192
        var handlerList = info.handlers;                                                                               // 193
        for (var j = handlerList.length - 1; j >= 0; j--) {                                                            // 194
          if (handlerList[j] === handlerToRemove) {                                                                    // 195
            handlerToRemove.unbind();                                                                                  // 196
            handlerList.splice(j, 1); // remove handlerList[j]                                                         // 197
          }                                                                                                            // 198
        }                                                                                                              // 199
      }                                                                                                                // 200
      newHandlerRecs.length = 0;                                                                                       // 201
    }                                                                                                                  // 202
  };                                                                                                                   // 203
};                                                                                                                     // 204
                                                                                                                       // 205
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/attrs.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var jsUrlsAllowed = false;                                                                                             // 1
Blaze._allowJavascriptUrls = function () {                                                                             // 2
  jsUrlsAllowed = true;                                                                                                // 3
};                                                                                                                     // 4
Blaze._javascriptUrlsAllowed = function () {                                                                           // 5
  return jsUrlsAllowed;                                                                                                // 6
};                                                                                                                     // 7
                                                                                                                       // 8
// An AttributeHandler object is responsible for updating a particular attribute                                       // 9
// of a particular element.  AttributeHandler subclasses implement                                                     // 10
// browser-specific logic for dealing with particular attributes across                                                // 11
// different browsers.                                                                                                 // 12
//                                                                                                                     // 13
// To define a new type of AttributeHandler, use                                                                       // 14
// `var FooHandler = AttributeHandler.extend({ update: function ... })`                                                // 15
// where the `update` function takes arguments `(element, oldValue, value)`.                                           // 16
// The `element` argument is always the same between calls to `update` on                                              // 17
// the same instance.  `oldValue` and `value` are each either `null` or                                                // 18
// a Unicode string of the type that might be passed to the value argument                                             // 19
// of `setAttribute` (i.e. not an HTML string with character references).                                              // 20
// When an AttributeHandler is installed, an initial call to `update` is                                               // 21
// always made with `oldValue = null`.  The `update` method can access                                                 // 22
// `this.name` if the AttributeHandler class is a generic one that applies                                             // 23
// to multiple attribute names.                                                                                        // 24
//                                                                                                                     // 25
// AttributeHandlers can store custom properties on `this`, as long as they                                            // 26
// don't use the names `element`, `name`, `value`, and `oldValue`.                                                     // 27
//                                                                                                                     // 28
// AttributeHandlers can't influence how attributes appear in rendered HTML,                                           // 29
// only how they are updated after materialization as DOM.                                                             // 30
                                                                                                                       // 31
AttributeHandler = function (name, value) {                                                                            // 32
  this.name = name;                                                                                                    // 33
  this.value = value;                                                                                                  // 34
};                                                                                                                     // 35
Blaze._AttributeHandler = AttributeHandler;                                                                            // 36
                                                                                                                       // 37
AttributeHandler.prototype.update = function (element, oldValue, value) {                                              // 38
  if (value === null) {                                                                                                // 39
    if (oldValue !== null)                                                                                             // 40
      element.removeAttribute(this.name);                                                                              // 41
  } else {                                                                                                             // 42
    element.setAttribute(this.name, value);                                                                            // 43
  }                                                                                                                    // 44
};                                                                                                                     // 45
                                                                                                                       // 46
AttributeHandler.extend = function (options) {                                                                         // 47
  var curType = this;                                                                                                  // 48
  var subType = function AttributeHandlerSubtype(/*arguments*/) {                                                      // 49
    AttributeHandler.apply(this, arguments);                                                                           // 50
  };                                                                                                                   // 51
  subType.prototype = new curType;                                                                                     // 52
  subType.extend = curType.extend;                                                                                     // 53
  if (options)                                                                                                         // 54
    _.extend(subType.prototype, options);                                                                              // 55
  return subType;                                                                                                      // 56
};                                                                                                                     // 57
                                                                                                                       // 58
/// Apply the diff between the attributes of "oldValue" and "value" to "element."                                      // 59
//                                                                                                                     // 60
// Each subclass must implement a parseValue method which takes a string                                               // 61
// as an input and returns a dict of attributes. The keys of the dict                                                  // 62
// are unique identifiers (ie. css properties in the case of styles), and the                                          // 63
// values are the entire attribute which will be injected into the element.                                            // 64
//                                                                                                                     // 65
// Extended below to support classes, SVG elements and styles.                                                         // 66
                                                                                                                       // 67
var DiffingAttributeHandler = AttributeHandler.extend({                                                                // 68
  update: function (element, oldValue, value) {                                                                        // 69
    if (!this.getCurrentValue || !this.setValue || !this.parseValue)                                                   // 70
      throw new Error("Missing methods in subclass of 'DiffingAttributeHandler'");                                     // 71
                                                                                                                       // 72
    var oldAttrsMap = oldValue ? this.parseValue(oldValue) : {};                                                       // 73
    var newAttrsMap = value ? this.parseValue(value) : {};                                                             // 74
                                                                                                                       // 75
    // the current attributes on the element, which we will mutate.                                                    // 76
                                                                                                                       // 77
    var attrString = this.getCurrentValue(element);                                                                    // 78
    var attrsMap = attrString ? this.parseValue(attrString) : {};                                                      // 79
                                                                                                                       // 80
    _.each(_.keys(oldAttrsMap), function (t) {                                                                         // 81
      if (! (t in newAttrsMap))                                                                                        // 82
        delete attrsMap[t];                                                                                            // 83
    });                                                                                                                // 84
                                                                                                                       // 85
    _.each(_.keys(newAttrsMap), function (t) {                                                                         // 86
      attrsMap[t] = newAttrsMap[t];                                                                                    // 87
    });                                                                                                                // 88
                                                                                                                       // 89
    this.setValue(element, _.values(attrsMap).join(' '));                                                              // 90
  }                                                                                                                    // 91
});                                                                                                                    // 92
                                                                                                                       // 93
var ClassHandler = DiffingAttributeHandler.extend({                                                                    // 94
  // @param rawValue {String}                                                                                          // 95
  getCurrentValue: function (element) {                                                                                // 96
    return element.className;                                                                                          // 97
  },                                                                                                                   // 98
  setValue: function (element, className) {                                                                            // 99
    element.className = className;                                                                                     // 100
  },                                                                                                                   // 101
  parseValue: function (attrString) {                                                                                  // 102
    var tokens = {};                                                                                                   // 103
                                                                                                                       // 104
    _.each(attrString.split(' '), function(token) {                                                                    // 105
      if (token)                                                                                                       // 106
        tokens[token] = token;                                                                                         // 107
    });                                                                                                                // 108
    return tokens;                                                                                                     // 109
  }                                                                                                                    // 110
});                                                                                                                    // 111
                                                                                                                       // 112
var SVGClassHandler = ClassHandler.extend({                                                                            // 113
  getCurrentValue: function (element) {                                                                                // 114
    return element.className.baseVal;                                                                                  // 115
  },                                                                                                                   // 116
  setValue: function (element, className) {                                                                            // 117
    element.setAttribute('class', className);                                                                          // 118
  }                                                                                                                    // 119
});                                                                                                                    // 120
                                                                                                                       // 121
var StyleHandler = DiffingAttributeHandler.extend({                                                                    // 122
  getCurrentValue: function (element) {                                                                                // 123
    return element.getAttribute('style');                                                                              // 124
  },                                                                                                                   // 125
  setValue: function (element, style) {                                                                                // 126
    if (style === '') {                                                                                                // 127
      element.removeAttribute('style');                                                                                // 128
    } else {                                                                                                           // 129
      element.setAttribute('style', style);                                                                            // 130
    }                                                                                                                  // 131
  },                                                                                                                   // 132
                                                                                                                       // 133
  // Parse a string to produce a map from property to attribute string.                                                // 134
  //                                                                                                                   // 135
  // Example:                                                                                                          // 136
  // "color:red; foo:12px" produces a token {color: "color:red", foo:"foo:12px"}                                       // 137
  parseValue: function (attrString) {                                                                                  // 138
    var tokens = {};                                                                                                   // 139
                                                                                                                       // 140
    // Regex for parsing a css attribute declaration, taken from css-parse:                                            // 141
    // https://github.com/reworkcss/css-parse/blob/7cef3658d0bba872cde05a85339034b187cb3397/index.js#L219              // 142
    var regex = /(\*?[-#\/\*\\\w]+(?:\[[0-9a-z_-]+\])?)\s*:\s*(?:\'(?:\\\'|.)*?\'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+[;\s]*/g;
    var match = regex.exec(attrString);                                                                                // 144
    while (match) {                                                                                                    // 145
      // match[0] = entire matching string                                                                             // 146
      // match[1] = css property                                                                                       // 147
      // Prefix the token to prevent conflicts with existing properties.                                               // 148
                                                                                                                       // 149
      // XXX No `String.trim` on Safari 4. Swap out $.trim if we want to                                               // 150
      // remove strong dep on jquery.                                                                                  // 151
      tokens[' ' + match[1]] = match[0].trim ?                                                                         // 152
        match[0].trim() : $.trim(match[0]);                                                                            // 153
                                                                                                                       // 154
      match = regex.exec(attrString);                                                                                  // 155
    }                                                                                                                  // 156
                                                                                                                       // 157
    return tokens;                                                                                                     // 158
  }                                                                                                                    // 159
});                                                                                                                    // 160
                                                                                                                       // 161
var BooleanHandler = AttributeHandler.extend({                                                                         // 162
  update: function (element, oldValue, value) {                                                                        // 163
    var name = this.name;                                                                                              // 164
    if (value == null) {                                                                                               // 165
      if (oldValue != null)                                                                                            // 166
        element[name] = false;                                                                                         // 167
    } else {                                                                                                           // 168
      element[name] = true;                                                                                            // 169
    }                                                                                                                  // 170
  }                                                                                                                    // 171
});                                                                                                                    // 172
                                                                                                                       // 173
var ValueHandler = AttributeHandler.extend({                                                                           // 174
  update: function (element, oldValue, value) {                                                                        // 175
    if (value !== element.value)                                                                                       // 176
      element.value = value;                                                                                           // 177
  }                                                                                                                    // 178
});                                                                                                                    // 179
                                                                                                                       // 180
// attributes of the type 'xlink:something' should be set using                                                        // 181
// the correct namespace in order to work                                                                              // 182
var XlinkHandler = AttributeHandler.extend({                                                                           // 183
  update: function(element, oldValue, value) {                                                                         // 184
    var NS = 'http://www.w3.org/1999/xlink';                                                                           // 185
    if (value === null) {                                                                                              // 186
      if (oldValue !== null)                                                                                           // 187
        element.removeAttributeNS(NS, this.name);                                                                      // 188
    } else {                                                                                                           // 189
      element.setAttributeNS(NS, this.name, this.value);                                                               // 190
    }                                                                                                                  // 191
  }                                                                                                                    // 192
});                                                                                                                    // 193
                                                                                                                       // 194
// cross-browser version of `instanceof SVGElement`                                                                    // 195
var isSVGElement = function (elem) {                                                                                   // 196
  return 'ownerSVGElement' in elem;                                                                                    // 197
};                                                                                                                     // 198
                                                                                                                       // 199
var isUrlAttribute = function (tagName, attrName) {                                                                    // 200
  // Compiled from http://www.w3.org/TR/REC-html40/index/attributes.html                                               // 201
  // and                                                                                                               // 202
  // http://www.w3.org/html/wg/drafts/html/master/index.html#attributes-1                                              // 203
  var urlAttrs = {                                                                                                     // 204
    FORM: ['action'],                                                                                                  // 205
    BODY: ['background'],                                                                                              // 206
    BLOCKQUOTE: ['cite'],                                                                                              // 207
    Q: ['cite'],                                                                                                       // 208
    DEL: ['cite'],                                                                                                     // 209
    INS: ['cite'],                                                                                                     // 210
    OBJECT: ['classid', 'codebase', 'data', 'usemap'],                                                                 // 211
    APPLET: ['codebase'],                                                                                              // 212
    A: ['href'],                                                                                                       // 213
    AREA: ['href'],                                                                                                    // 214
    LINK: ['href'],                                                                                                    // 215
    BASE: ['href'],                                                                                                    // 216
    IMG: ['longdesc', 'src', 'usemap'],                                                                                // 217
    FRAME: ['longdesc', 'src'],                                                                                        // 218
    IFRAME: ['longdesc', 'src'],                                                                                       // 219
    HEAD: ['profile'],                                                                                                 // 220
    SCRIPT: ['src'],                                                                                                   // 221
    INPUT: ['src', 'usemap', 'formaction'],                                                                            // 222
    BUTTON: ['formaction'],                                                                                            // 223
    BASE: ['href'],                                                                                                    // 224
    MENUITEM: ['icon'],                                                                                                // 225
    HTML: ['manifest'],                                                                                                // 226
    VIDEO: ['poster']                                                                                                  // 227
  };                                                                                                                   // 228
                                                                                                                       // 229
  if (attrName === 'itemid') {                                                                                         // 230
    return true;                                                                                                       // 231
  }                                                                                                                    // 232
                                                                                                                       // 233
  var urlAttrNames = urlAttrs[tagName] || [];                                                                          // 234
  return _.contains(urlAttrNames, attrName);                                                                           // 235
};                                                                                                                     // 236
                                                                                                                       // 237
// To get the protocol for a URL, we let the browser normalize it for                                                  // 238
// us, by setting it as the href for an anchor tag and then reading out                                                // 239
// the 'protocol' property.                                                                                            // 240
if (Meteor.isClient) {                                                                                                 // 241
  var anchorForNormalization = document.createElement('A');                                                            // 242
}                                                                                                                      // 243
                                                                                                                       // 244
var getUrlProtocol = function (url) {                                                                                  // 245
  if (Meteor.isClient) {                                                                                               // 246
    anchorForNormalization.href = url;                                                                                 // 247
    return (anchorForNormalization.protocol || "").toLowerCase();                                                      // 248
  } else {                                                                                                             // 249
    throw new Error('getUrlProtocol not implemented on the server');                                                   // 250
  }                                                                                                                    // 251
};                                                                                                                     // 252
                                                                                                                       // 253
// UrlHandler is an attribute handler for all HTML attributes that take                                                // 254
// URL values. It disallows javascript: URLs, unless                                                                   // 255
// Blaze._allowJavascriptUrls() has been called. To detect javascript:                                                 // 256
// urls, we set the attribute on a dummy anchor element and then read                                                  // 257
// out the 'protocol' property of the attribute.                                                                       // 258
var origUpdate = AttributeHandler.prototype.update;                                                                    // 259
var UrlHandler = AttributeHandler.extend({                                                                             // 260
  update: function (element, oldValue, value) {                                                                        // 261
    var self = this;                                                                                                   // 262
    var args = arguments;                                                                                              // 263
                                                                                                                       // 264
    if (Blaze._javascriptUrlsAllowed()) {                                                                              // 265
      origUpdate.apply(self, args);                                                                                    // 266
    } else {                                                                                                           // 267
      var isJavascriptProtocol = (getUrlProtocol(value) === "javascript:");                                            // 268
      if (isJavascriptProtocol) {                                                                                      // 269
        Blaze._warn("URLs that use the 'javascript:' protocol are not " +                                              // 270
                    "allowed in URL attribute values. " +                                                              // 271
                    "Call Blaze._allowJavascriptUrls() " +                                                             // 272
                    "to enable them.");                                                                                // 273
        origUpdate.apply(self, [element, oldValue, null]);                                                             // 274
      } else {                                                                                                         // 275
        origUpdate.apply(self, args);                                                                                  // 276
      }                                                                                                                // 277
    }                                                                                                                  // 278
  }                                                                                                                    // 279
});                                                                                                                    // 280
                                                                                                                       // 281
// XXX make it possible for users to register attribute handlers!                                                      // 282
makeAttributeHandler = function (elem, name, value) {                                                                  // 283
  // generally, use setAttribute but certain attributes need to be set                                                 // 284
  // by directly setting a JavaScript property on the DOM element.                                                     // 285
  if (name === 'class') {                                                                                              // 286
    if (isSVGElement(elem)) {                                                                                          // 287
      return new SVGClassHandler(name, value);                                                                         // 288
    } else {                                                                                                           // 289
      return new ClassHandler(name, value);                                                                            // 290
    }                                                                                                                  // 291
  } else if (name === 'style') {                                                                                       // 292
    return new StyleHandler(name, value);                                                                              // 293
  } else if ((elem.tagName === 'OPTION' && name === 'selected') ||                                                     // 294
             (elem.tagName === 'INPUT' && name === 'checked')) {                                                       // 295
    return new BooleanHandler(name, value);                                                                            // 296
  } else if ((elem.tagName === 'TEXTAREA' || elem.tagName === 'INPUT')                                                 // 297
             && name === 'value') {                                                                                    // 298
    // internally, TEXTAREAs tracks their value in the 'value'                                                         // 299
    // attribute just like INPUTs.                                                                                     // 300
    return new ValueHandler(name, value);                                                                              // 301
  } else if (name.substring(0,6) === 'xlink:') {                                                                       // 302
    return new XlinkHandler(name.substring(6), value);                                                                 // 303
  } else if (isUrlAttribute(elem.tagName, name)) {                                                                     // 304
    return new UrlHandler(name, value);                                                                                // 305
  } else {                                                                                                             // 306
    return new AttributeHandler(name, value);                                                                          // 307
  }                                                                                                                    // 308
                                                                                                                       // 309
  // XXX will need one for 'style' on IE, though modern browsers                                                       // 310
  // seem to handle setAttribute ok.                                                                                   // 311
};                                                                                                                     // 312
                                                                                                                       // 313
                                                                                                                       // 314
ElementAttributesUpdater = function (elem) {                                                                           // 315
  this.elem = elem;                                                                                                    // 316
  this.handlers = {};                                                                                                  // 317
};                                                                                                                     // 318
                                                                                                                       // 319
// Update attributes on `elem` to the dictionary `attrs`, whose                                                        // 320
// values are strings.                                                                                                 // 321
ElementAttributesUpdater.prototype.update = function(newAttrs) {                                                       // 322
  var elem = this.elem;                                                                                                // 323
  var handlers = this.handlers;                                                                                        // 324
                                                                                                                       // 325
  for (var k in handlers) {                                                                                            // 326
    if (! _.has(newAttrs, k)) {                                                                                        // 327
      // remove attributes (and handlers) for attribute names                                                          // 328
      // that don't exist as keys of `newAttrs` and so won't                                                           // 329
      // be visited when traversing it.  (Attributes that                                                              // 330
      // exist in the `newAttrs` object but are `null`                                                                 // 331
      // are handled later.)                                                                                           // 332
      var handler = handlers[k];                                                                                       // 333
      var oldValue = handler.value;                                                                                    // 334
      handler.value = null;                                                                                            // 335
      handler.update(elem, oldValue, null);                                                                            // 336
      delete handlers[k];                                                                                              // 337
    }                                                                                                                  // 338
  }                                                                                                                    // 339
                                                                                                                       // 340
  for (var k in newAttrs) {                                                                                            // 341
    var handler = null;                                                                                                // 342
    var oldValue;                                                                                                      // 343
    var value = newAttrs[k];                                                                                           // 344
    if (! _.has(handlers, k)) {                                                                                        // 345
      if (value !== null) {                                                                                            // 346
        // make new handler                                                                                            // 347
        handler = makeAttributeHandler(elem, k, value);                                                                // 348
        handlers[k] = handler;                                                                                         // 349
        oldValue = null;                                                                                               // 350
      }                                                                                                                // 351
    } else {                                                                                                           // 352
      handler = handlers[k];                                                                                           // 353
      oldValue = handler.value;                                                                                        // 354
    }                                                                                                                  // 355
    if (oldValue !== value) {                                                                                          // 356
      handler.value = value;                                                                                           // 357
      handler.update(elem, oldValue, value);                                                                           // 358
      if (value === null)                                                                                              // 359
        delete handlers[k];                                                                                            // 360
    }                                                                                                                  // 361
  }                                                                                                                    // 362
};                                                                                                                     // 363
                                                                                                                       // 364
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/materializer.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// new Blaze._DOMMaterializer(options)                                                                                 // 1
//                                                                                                                     // 2
// An HTML.Visitor that turns HTMLjs into DOM nodes and DOMRanges.                                                     // 3
//                                                                                                                     // 4
// Options: `parentView`                                                                                               // 5
Blaze._DOMMaterializer = HTML.Visitor.extend();                                                                        // 6
Blaze._DOMMaterializer.def({                                                                                           // 7
  visitNull: function (x, intoArray) {                                                                                 // 8
    return intoArray;                                                                                                  // 9
  },                                                                                                                   // 10
  visitPrimitive: function (primitive, intoArray) {                                                                    // 11
    var string = String(primitive);                                                                                    // 12
    intoArray.push(document.createTextNode(string));                                                                   // 13
    return intoArray;                                                                                                  // 14
  },                                                                                                                   // 15
  visitCharRef: function (charRef, intoArray) {                                                                        // 16
    return this.visitPrimitive(charRef.str, intoArray);                                                                // 17
  },                                                                                                                   // 18
  visitArray: function (array, intoArray) {                                                                            // 19
    for (var i = 0; i < array.length; i++)                                                                             // 20
      this.visit(array[i], intoArray);                                                                                 // 21
    return intoArray;                                                                                                  // 22
  },                                                                                                                   // 23
  visitComment: function (comment, intoArray) {                                                                        // 24
    intoArray.push(document.createComment(comment.sanitizedValue));                                                    // 25
    return intoArray;                                                                                                  // 26
  },                                                                                                                   // 27
  visitRaw: function (raw, intoArray) {                                                                                // 28
    // Get an array of DOM nodes by using the browser's HTML parser                                                    // 29
    // (like innerHTML).                                                                                               // 30
    var nodes = Blaze._DOMBackend.parseHTML(raw.value);                                                                // 31
    for (var i = 0; i < nodes.length; i++)                                                                             // 32
      intoArray.push(nodes[i]);                                                                                        // 33
                                                                                                                       // 34
    return intoArray;                                                                                                  // 35
  },                                                                                                                   // 36
  visitTag: function (tag, intoArray) {                                                                                // 37
    var self = this;                                                                                                   // 38
    var tagName = tag.tagName;                                                                                         // 39
    var elem;                                                                                                          // 40
    if ((HTML.isKnownSVGElement(tagName) || isSVGAnchor(tag))                                                          // 41
        && document.createElementNS) {                                                                                 // 42
      // inline SVG                                                                                                    // 43
      elem = document.createElementNS('http://www.w3.org/2000/svg', tagName);                                          // 44
    } else {                                                                                                           // 45
      // normal elements                                                                                               // 46
      elem = document.createElement(tagName);                                                                          // 47
    }                                                                                                                  // 48
                                                                                                                       // 49
    var rawAttrs = tag.attrs;                                                                                          // 50
    var children = tag.children;                                                                                       // 51
    if (tagName === 'textarea' && tag.children.length &&                                                               // 52
        ! (rawAttrs && ('value' in rawAttrs))) {                                                                       // 53
      // Provide very limited support for TEXTAREA tags with children                                                  // 54
      // rather than a "value" attribute.                                                                              // 55
      // Reactivity in the form of Views nested in the tag's children                                                  // 56
      // won't work.  Compilers should compile textarea contents into                                                  // 57
      // the "value" attribute of the tag, wrapped in a function if there                                              // 58
      // is reactivity.                                                                                                // 59
      if (typeof rawAttrs === 'function' ||                                                                            // 60
          HTML.isArray(rawAttrs)) {                                                                                    // 61
        throw new Error("Can't have reactive children of TEXTAREA node; " +                                            // 62
                        "use the 'value' attribute instead.");                                                         // 63
      }                                                                                                                // 64
      rawAttrs = _.extend({}, rawAttrs || null);                                                                       // 65
      rawAttrs.value = Blaze._expand(children, self.parentView);                                                       // 66
      children = [];                                                                                                   // 67
    }                                                                                                                  // 68
                                                                                                                       // 69
    if (rawAttrs) {                                                                                                    // 70
      var attrUpdater = new ElementAttributesUpdater(elem);                                                            // 71
      var updateAttributes = function () {                                                                             // 72
        var parentView = self.parentView;                                                                              // 73
        var expandedAttrs = Blaze._expandAttributes(rawAttrs, parentView);                                             // 74
        var flattenedAttrs = HTML.flattenAttributes(expandedAttrs);                                                    // 75
        var stringAttrs = {};                                                                                          // 76
        for (var attrName in flattenedAttrs) {                                                                         // 77
          stringAttrs[attrName] = Blaze._toText(flattenedAttrs[attrName],                                              // 78
                                                parentView,                                                            // 79
                                                HTML.TEXTMODE.STRING);                                                 // 80
        }                                                                                                              // 81
        attrUpdater.update(stringAttrs);                                                                               // 82
      };                                                                                                               // 83
      var updaterComputation;                                                                                          // 84
      if (self.parentView) {                                                                                           // 85
        updaterComputation = self.parentView.autorun(updateAttributes);                                                // 86
      } else {                                                                                                         // 87
        updaterComputation = Tracker.nonreactive(function () {                                                         // 88
          return Tracker.autorun(function () {                                                                         // 89
            Tracker._withCurrentView(self.parentView, updateAttributes);                                               // 90
          });                                                                                                          // 91
        });                                                                                                            // 92
      }                                                                                                                // 93
      Blaze._DOMBackend.Teardown.onElementTeardown(elem, function attrTeardown() {                                     // 94
        updaterComputation.stop();                                                                                     // 95
      });                                                                                                              // 96
    }                                                                                                                  // 97
                                                                                                                       // 98
    var childNodesAndRanges = self.visit(children, []);                                                                // 99
    for (var i = 0; i < childNodesAndRanges.length; i++) {                                                             // 100
      var x = childNodesAndRanges[i];                                                                                  // 101
      if (x instanceof Blaze._DOMRange)                                                                                // 102
        x.attach(elem);                                                                                                // 103
      else                                                                                                             // 104
        elem.appendChild(x);                                                                                           // 105
    }                                                                                                                  // 106
                                                                                                                       // 107
    intoArray.push(elem);                                                                                              // 108
                                                                                                                       // 109
    return intoArray;                                                                                                  // 110
  },                                                                                                                   // 111
  visitObject: function (x, intoArray) {                                                                               // 112
    if (x instanceof Blaze.Template)                                                                                   // 113
      x = x.constructView();                                                                                           // 114
                                                                                                                       // 115
    if (x instanceof Blaze.View) {                                                                                     // 116
      intoArray.push(Blaze._materializeView(x, this.parentView));                                                      // 117
      return intoArray;                                                                                                // 118
    }                                                                                                                  // 119
                                                                                                                       // 120
    // throw the default error                                                                                         // 121
    return HTML.Visitor.prototype.visitObject.call(this, x);                                                           // 122
  }                                                                                                                    // 123
});                                                                                                                    // 124
                                                                                                                       // 125
var isSVGAnchor = function (node) {                                                                                    // 126
  // We generally aren't able to detect SVG <a> elements because                                                       // 127
  // if "A" were in our list of known svg element names, then all                                                      // 128
  // <a> nodes would be created using                                                                                  // 129
  // `document.createElementNS`. But in the special case of <a                                                         // 130
  // xlink:href="...">, we can at least detect that attribute and                                                      // 131
  // create an SVG <a> tag in that case.                                                                               // 132
  //                                                                                                                   // 133
  // However, we still have a general problem of knowing when to                                                       // 134
  // use document.createElementNS and when to use                                                                      // 135
  // document.createElement; for example, font tags will always                                                        // 136
  // be created as SVG elements which can cause other                                                                  // 137
  // problems. #1977                                                                                                   // 138
  return (node.tagName === "a" &&                                                                                      // 139
          node.attrs &&                                                                                                // 140
          node.attrs["xlink:href"] !== undefined);                                                                     // 141
};                                                                                                                     // 142
                                                                                                                       // 143
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/exceptions.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var debugFunc;                                                                                                         // 1
                                                                                                                       // 2
// We call into user code in many places, and it's nice to catch exceptions                                            // 3
// propagated from user code immediately so that the whole system doesn't just                                         // 4
// break.  Catching exceptions is easy; reporting them is hard.  This helper                                           // 5
// reports exceptions.                                                                                                 // 6
//                                                                                                                     // 7
// Usage:                                                                                                              // 8
//                                                                                                                     // 9
// ```                                                                                                                 // 10
// try {                                                                                                               // 11
//   // ... someStuff ...                                                                                              // 12
// } catch (e) {                                                                                                       // 13
//   reportUIException(e);                                                                                             // 14
// }                                                                                                                   // 15
// ```                                                                                                                 // 16
//                                                                                                                     // 17
// An optional second argument overrides the default message.                                                          // 18
                                                                                                                       // 19
// Set this to `true` to cause `reportException` to throw                                                              // 20
// the next exception rather than reporting it.  This is                                                               // 21
// useful in unit tests that test error messages.                                                                      // 22
Blaze._throwNextException = false;                                                                                     // 23
                                                                                                                       // 24
Blaze._reportException = function (e, msg) {                                                                           // 25
  if (Blaze._throwNextException) {                                                                                     // 26
    Blaze._throwNextException = false;                                                                                 // 27
    throw e;                                                                                                           // 28
  }                                                                                                                    // 29
                                                                                                                       // 30
  if (! debugFunc)                                                                                                     // 31
    // adapted from Tracker                                                                                            // 32
    debugFunc = function () {                                                                                          // 33
      return (typeof Meteor !== "undefined" ? Meteor._debug :                                                          // 34
              ((typeof console !== "undefined") && console.log ? console.log :                                         // 35
               function () {}));                                                                                       // 36
    };                                                                                                                 // 37
                                                                                                                       // 38
  // In Chrome, `e.stack` is a multiline string that starts with the message                                           // 39
  // and contains a stack trace.  Furthermore, `console.log` makes it clickable.                                       // 40
  // `console.log` supplies the space between the two arguments.                                                       // 41
  debugFunc()(msg || 'Exception caught in template:', e.stack || e.message);                                           // 42
};                                                                                                                     // 43
                                                                                                                       // 44
Blaze._wrapCatchingExceptions = function (f, where) {                                                                  // 45
  if (typeof f !== 'function')                                                                                         // 46
    return f;                                                                                                          // 47
                                                                                                                       // 48
  return function () {                                                                                                 // 49
    try {                                                                                                              // 50
      return f.apply(this, arguments);                                                                                 // 51
    } catch (e) {                                                                                                      // 52
      Blaze._reportException(e, 'Exception in ' + where + ':');                                                        // 53
    }                                                                                                                  // 54
  };                                                                                                                   // 55
};                                                                                                                     // 56
                                                                                                                       // 57
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/view.js                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/// [new] Blaze.View([name], renderMethod)                                                                             // 1
///                                                                                                                    // 2
/// Blaze.View is the building block of reactive DOM.  Views have                                                      // 3
/// the following features:                                                                                            // 4
///                                                                                                                    // 5
/// * lifecycle callbacks - Views are created, rendered, and destroyed,                                                // 6
///   and callbacks can be registered to fire when these things happen.                                                // 7
///                                                                                                                    // 8
/// * parent pointer - A View points to its parentView, which is the                                                   // 9
///   View that caused it to be rendered.  These pointers form a                                                       // 10
///   hierarchy or tree of Views.                                                                                      // 11
///                                                                                                                    // 12
/// * render() method - A View's render() method specifies the DOM                                                     // 13
///   (or HTML) content of the View.  If the method establishes                                                        // 14
///   reactive dependencies, it may be re-run.                                                                         // 15
///                                                                                                                    // 16
/// * a DOMRange - If a View is rendered to DOM, its position and                                                      // 17
///   extent in the DOM are tracked using a DOMRange object.                                                           // 18
///                                                                                                                    // 19
/// When a View is constructed by calling Blaze.View, the View is                                                      // 20
/// not yet considered "created."  It doesn't have a parentView yet,                                                   // 21
/// and no logic has been run to initialize the View.  All real                                                        // 22
/// work is deferred until at least creation time, when the onViewCreated                                              // 23
/// callbacks are fired, which happens when the View is "used" in                                                      // 24
/// some way that requires it to be rendered.                                                                          // 25
///                                                                                                                    // 26
/// ...more lifecycle stuff                                                                                            // 27
///                                                                                                                    // 28
/// `name` is an optional string tag identifying the View.  The only                                                   // 29
/// time it's used is when looking in the View tree for a View of a                                                    // 30
/// particular name; for example, data contexts are stored on Views                                                    // 31
/// of name "with".  Names are also useful when debugging, so in                                                       // 32
/// general it's good for functions that create Views to set the name.                                                 // 33
/// Views associated with templates have names of the form "Template.foo".                                             // 34
                                                                                                                       // 35
/**                                                                                                                    // 36
 * @class                                                                                                              // 37
 * @summary Constructor for a View, which represents a reactive region of DOM.                                         // 38
 * @locus Client                                                                                                       // 39
 * @param {String} [name] Optional.  A name for this type of View.  See [`view.name`](#view_name).                     // 40
 * @param {Function} renderFunction A function that returns [*renderable content*](#renderable_content).  In this function, `this` is bound to the View.
 */                                                                                                                    // 42
Blaze.View = function (name, render) {                                                                                 // 43
  if (! (this instanceof Blaze.View))                                                                                  // 44
    // called without `new`                                                                                            // 45
    return new Blaze.View(name, render);                                                                               // 46
                                                                                                                       // 47
  if (typeof name === 'function') {                                                                                    // 48
    // omitted "name" argument                                                                                         // 49
    render = name;                                                                                                     // 50
    name = '';                                                                                                         // 51
  }                                                                                                                    // 52
  this.name = name;                                                                                                    // 53
  this._render = render;                                                                                               // 54
                                                                                                                       // 55
  this._callbacks = {                                                                                                  // 56
    created: null,                                                                                                     // 57
    rendered: null,                                                                                                    // 58
    destroyed: null                                                                                                    // 59
  };                                                                                                                   // 60
                                                                                                                       // 61
  // Setting all properties here is good for readability,                                                              // 62
  // and also may help Chrome optimize the code by keeping                                                             // 63
  // the View object from changing shape too much.                                                                     // 64
  this.isCreated = false;                                                                                              // 65
  this._isCreatedForExpansion = false;                                                                                 // 66
  this.isRendered = false;                                                                                             // 67
  this._isAttached = false;                                                                                            // 68
  this.isDestroyed = false;                                                                                            // 69
  this._isInRender = false;                                                                                            // 70
  this.parentView = null;                                                                                              // 71
  this._domrange = null;                                                                                               // 72
  // This flag is normally set to false except for the cases when view's parent                                        // 73
  // was generated as part of expanding some syntactic sugar expressions or                                            // 74
  // methods.                                                                                                          // 75
  // Ex.: Blaze.renderWithData is an equivalent to creating a view with regular                                        // 76
  // Blaze.render and wrapping it into {{#with data}}{{/with}} view. Since the                                         // 77
  // users don't know anything about these generated parent views, Blaze needs                                         // 78
  // this information to be available on views to make smarter decisions. For                                          // 79
  // example: removing the generated parent view with the view on Blaze.remove.                                        // 80
  this._hasGeneratedParent = false;                                                                                    // 81
                                                                                                                       // 82
  this.renderCount = 0;                                                                                                // 83
};                                                                                                                     // 84
                                                                                                                       // 85
Blaze.View.prototype._render = function () { return null; };                                                           // 86
                                                                                                                       // 87
Blaze.View.prototype.onViewCreated = function (cb) {                                                                   // 88
  this._callbacks.created = this._callbacks.created || [];                                                             // 89
  this._callbacks.created.push(cb);                                                                                    // 90
};                                                                                                                     // 91
                                                                                                                       // 92
Blaze.View.prototype._onViewRendered = function (cb) {                                                                 // 93
  this._callbacks.rendered = this._callbacks.rendered || [];                                                           // 94
  this._callbacks.rendered.push(cb);                                                                                   // 95
};                                                                                                                     // 96
                                                                                                                       // 97
Blaze.View.prototype.onViewReady = function (cb) {                                                                     // 98
  var self = this;                                                                                                     // 99
  var fire = function () {                                                                                             // 100
    Tracker.afterFlush(function () {                                                                                   // 101
      if (! self.isDestroyed) {                                                                                        // 102
        Blaze._withCurrentView(self, function () {                                                                     // 103
          cb.call(self);                                                                                               // 104
        });                                                                                                            // 105
      }                                                                                                                // 106
    });                                                                                                                // 107
  };                                                                                                                   // 108
  self._onViewRendered(function onViewRendered() {                                                                     // 109
    if (self.isDestroyed)                                                                                              // 110
      return;                                                                                                          // 111
    if (! self._domrange.attached)                                                                                     // 112
      self._domrange.onAttached(fire);                                                                                 // 113
    else                                                                                                               // 114
      fire();                                                                                                          // 115
  });                                                                                                                  // 116
};                                                                                                                     // 117
                                                                                                                       // 118
Blaze.View.prototype.onViewDestroyed = function (cb) {                                                                 // 119
  this._callbacks.destroyed = this._callbacks.destroyed || [];                                                         // 120
  this._callbacks.destroyed.push(cb);                                                                                  // 121
};                                                                                                                     // 122
                                                                                                                       // 123
/// View#autorun(func)                                                                                                 // 124
///                                                                                                                    // 125
/// Sets up a Tracker autorun that is "scoped" to this View in two                                                     // 126
/// important ways: 1) Blaze.currentView is automatically set                                                          // 127
/// on every re-run, and 2) the autorun is stopped when the                                                            // 128
/// View is destroyed.  As with Tracker.autorun, the first run of                                                      // 129
/// the function is immediate, and a Computation object that can                                                       // 130
/// be used to stop the autorun is returned.                                                                           // 131
///                                                                                                                    // 132
/// View#autorun is meant to be called from View callbacks like                                                        // 133
/// onViewCreated, or from outside the rendering process.  It may not                                                  // 134
/// be called before the onViewCreated callbacks are fired (too early),                                                // 135
/// or from a render() method (too confusing).                                                                         // 136
///                                                                                                                    // 137
/// Typically, autoruns that update the state                                                                          // 138
/// of the View (as in Blaze.With) should be started from an onViewCreated                                             // 139
/// callback.  Autoruns that update the DOM should be started                                                          // 140
/// from either onViewCreated (guarded against the absence of                                                          // 141
/// view._domrange), or onViewReady.                                                                                   // 142
Blaze.View.prototype.autorun = function (f, _inViewScope) {                                                            // 143
  var self = this;                                                                                                     // 144
                                                                                                                       // 145
  // The restrictions on when View#autorun can be called are in order                                                  // 146
  // to avoid bad patterns, like creating a Blaze.View and immediately                                                 // 147
  // calling autorun on it.  A freshly created View is not ready to                                                    // 148
  // have logic run on it; it doesn't have a parentView, for example.                                                  // 149
  // It's when the View is materialized or expanded that the onViewCreated                                             // 150
  // handlers are fired and the View starts up.                                                                        // 151
  //                                                                                                                   // 152
  // Letting the render() method call `this.autorun()` is problematic                                                  // 153
  // because of re-render.  The best we can do is to stop the old                                                      // 154
  // autorun and start a new one for each render, but that's a pattern                                                 // 155
  // we try to avoid internally because it leads to helpers being                                                      // 156
  // called extra times, in the case where the autorun causes the                                                      // 157
  // view to re-render (and thus the autorun to be torn down and a                                                     // 158
  // new one established).                                                                                             // 159
  //                                                                                                                   // 160
  // We could lift these restrictions in various ways.  One interesting                                                // 161
  // idea is to allow you to call `view.autorun` after instantiating                                                   // 162
  // `view`, and automatically wrap it in `view.onViewCreated`, deferring                                              // 163
  // the autorun so that it starts at an appropriate time.  However,                                                   // 164
  // then we can't return the Computation object to the caller, because                                                // 165
  // it doesn't exist yet.                                                                                             // 166
  if (! self.isCreated) {                                                                                              // 167
    throw new Error("View#autorun must be called from the created callback at the earliest");                          // 168
  }                                                                                                                    // 169
  if (this._isInRender) {                                                                                              // 170
    throw new Error("Can't call View#autorun from inside render(); try calling it from the created or rendered callback");
  }                                                                                                                    // 172
  if (Tracker.active) {                                                                                                // 173
    throw new Error("Can't call View#autorun from a Tracker Computation; try calling it from the created or rendered callback");
  }                                                                                                                    // 175
                                                                                                                       // 176
  var c = Tracker.autorun(function viewAutorun(c) {                                                                    // 177
    return Blaze._withCurrentView(_inViewScope || self, function () {                                                  // 178
      return f.call(self, c);                                                                                          // 179
    });                                                                                                                // 180
  });                                                                                                                  // 181
  self.onViewDestroyed(function () { c.stop(); });                                                                     // 182
                                                                                                                       // 183
  return c;                                                                                                            // 184
};                                                                                                                     // 185
                                                                                                                       // 186
Blaze.View.prototype.firstNode = function () {                                                                         // 187
  if (! this._isAttached)                                                                                              // 188
    throw new Error("View must be attached before accessing its DOM");                                                 // 189
                                                                                                                       // 190
  return this._domrange.firstNode();                                                                                   // 191
};                                                                                                                     // 192
                                                                                                                       // 193
Blaze.View.prototype.lastNode = function () {                                                                          // 194
  if (! this._isAttached)                                                                                              // 195
    throw new Error("View must be attached before accessing its DOM");                                                 // 196
                                                                                                                       // 197
  return this._domrange.lastNode();                                                                                    // 198
};                                                                                                                     // 199
                                                                                                                       // 200
Blaze._fireCallbacks = function (view, which) {                                                                        // 201
  Blaze._withCurrentView(view, function () {                                                                           // 202
    Tracker.nonreactive(function fireCallbacks() {                                                                     // 203
      var cbs = view._callbacks[which];                                                                                // 204
      for (var i = 0, N = (cbs && cbs.length); i < N; i++)                                                             // 205
        cbs[i].call(view);                                                                                             // 206
    });                                                                                                                // 207
  });                                                                                                                  // 208
};                                                                                                                     // 209
                                                                                                                       // 210
Blaze._createView = function (view, parentView, forExpansion) {                                                        // 211
  if (view.isCreated)                                                                                                  // 212
    throw new Error("Can't render the same View twice");                                                               // 213
                                                                                                                       // 214
  view.parentView = (parentView || null);                                                                              // 215
  view.isCreated = true;                                                                                               // 216
  if (forExpansion)                                                                                                    // 217
    view._isCreatedForExpansion = true;                                                                                // 218
                                                                                                                       // 219
  Blaze._fireCallbacks(view, 'created');                                                                               // 220
};                                                                                                                     // 221
                                                                                                                       // 222
Blaze._materializeView = function (view, parentView) {                                                                 // 223
  Blaze._createView(view, parentView);                                                                                 // 224
                                                                                                                       // 225
  var domrange;                                                                                                        // 226
  var lastHtmljs;                                                                                                      // 227
  // We don't expect to be called in a Computation, but just in case,                                                  // 228
  // wrap in Tracker.nonreactive.                                                                                      // 229
  Tracker.nonreactive(function () {                                                                                    // 230
    view.autorun(function doRender(c) {                                                                                // 231
      // `view.autorun` sets the current view.                                                                         // 232
      view.renderCount++;                                                                                              // 233
      view._isInRender = true;                                                                                         // 234
      // Any dependencies that should invalidate this Computation come                                                 // 235
      // from this line:                                                                                               // 236
      var htmljs = view._render();                                                                                     // 237
      view._isInRender = false;                                                                                        // 238
                                                                                                                       // 239
      Tracker.nonreactive(function doMaterialize() {                                                                   // 240
        var materializer = new Blaze._DOMMaterializer({parentView: view});                                             // 241
        var rangesAndNodes = materializer.visit(htmljs, []);                                                           // 242
        if (c.firstRun || ! Blaze._isContentEqual(lastHtmljs, htmljs)) {                                               // 243
          if (c.firstRun) {                                                                                            // 244
            domrange = new Blaze._DOMRange(rangesAndNodes);                                                            // 245
            view._domrange = domrange;                                                                                 // 246
            domrange.view = view;                                                                                      // 247
            view.isRendered = true;                                                                                    // 248
          } else {                                                                                                     // 249
            domrange.setMembers(rangesAndNodes);                                                                       // 250
          }                                                                                                            // 251
          Blaze._fireCallbacks(view, 'rendered');                                                                      // 252
        }                                                                                                              // 253
      });                                                                                                              // 254
      lastHtmljs = htmljs;                                                                                             // 255
                                                                                                                       // 256
      // Causes any nested views to stop immediately, not when we call                                                 // 257
      // `setMembers` the next time around the autorun.  Otherwise,                                                    // 258
      // helpers in the DOM tree to be replaced might be scheduled                                                     // 259
      // to re-run before we have a chance to stop them.                                                               // 260
      Tracker.onInvalidate(function () {                                                                               // 261
        domrange.destroyMembers();                                                                                     // 262
      });                                                                                                              // 263
    });                                                                                                                // 264
                                                                                                                       // 265
    var teardownHook = null;                                                                                           // 266
                                                                                                                       // 267
    domrange.onAttached(function attached(range, element) {                                                            // 268
      view._isAttached = true;                                                                                         // 269
                                                                                                                       // 270
      teardownHook = Blaze._DOMBackend.Teardown.onElementTeardown(                                                     // 271
        element, function teardown() {                                                                                 // 272
          Blaze._destroyView(view, true /* _skipNodes */);                                                             // 273
        });                                                                                                            // 274
    });                                                                                                                // 275
                                                                                                                       // 276
    // tear down the teardown hook                                                                                     // 277
    view.onViewDestroyed(function () {                                                                                 // 278
      teardownHook && teardownHook.stop();                                                                             // 279
      teardownHook = null;                                                                                             // 280
    });                                                                                                                // 281
  });                                                                                                                  // 282
                                                                                                                       // 283
  return domrange;                                                                                                     // 284
};                                                                                                                     // 285
                                                                                                                       // 286
// Expands a View to HTMLjs, calling `render` recursively on all                                                       // 287
// Views and evaluating any dynamic attributes.  Calls the `created`                                                   // 288
// callback, but not the `materialized` or `rendered` callbacks.                                                       // 289
// Destroys the view immediately, unless called in a Tracker Computation,                                              // 290
// in which case the view will be destroyed when the Computation is                                                    // 291
// invalidated.  If called in a Tracker Computation, the result is a                                                   // 292
// reactive string; that is, the Computation will be invalidated                                                       // 293
// if any changes are made to the view or subviews that might affect                                                   // 294
// the HTML.                                                                                                           // 295
Blaze._expandView = function (view, parentView) {                                                                      // 296
  Blaze._createView(view, parentView, true /*forExpansion*/);                                                          // 297
                                                                                                                       // 298
  view._isInRender = true;                                                                                             // 299
  var htmljs = Blaze._withCurrentView(view, function () {                                                              // 300
    return view._render();                                                                                             // 301
  });                                                                                                                  // 302
  view._isInRender = false;                                                                                            // 303
                                                                                                                       // 304
  var result = Blaze._expand(htmljs, view);                                                                            // 305
                                                                                                                       // 306
  if (Tracker.active) {                                                                                                // 307
    Tracker.onInvalidate(function () {                                                                                 // 308
      Blaze._destroyView(view);                                                                                        // 309
    });                                                                                                                // 310
  } else {                                                                                                             // 311
    Blaze._destroyView(view);                                                                                          // 312
  }                                                                                                                    // 313
                                                                                                                       // 314
  return result;                                                                                                       // 315
};                                                                                                                     // 316
                                                                                                                       // 317
// Options: `parentView`                                                                                               // 318
Blaze._HTMLJSExpander = HTML.TransformingVisitor.extend();                                                             // 319
Blaze._HTMLJSExpander.def({                                                                                            // 320
  visitObject: function (x) {                                                                                          // 321
    if (x instanceof Blaze.Template)                                                                                   // 322
      x = x.constructView();                                                                                           // 323
    if (x instanceof Blaze.View)                                                                                       // 324
      return Blaze._expandView(x, this.parentView);                                                                    // 325
                                                                                                                       // 326
    // this will throw an error; other objects are not allowed!                                                        // 327
    return HTML.TransformingVisitor.prototype.visitObject.call(this, x);                                               // 328
  },                                                                                                                   // 329
  visitAttributes: function (attrs) {                                                                                  // 330
    // expand dynamic attributes                                                                                       // 331
    if (typeof attrs === 'function')                                                                                   // 332
      attrs = Blaze._withCurrentView(this.parentView, attrs);                                                          // 333
                                                                                                                       // 334
    // call super (e.g. for case where `attrs` is an array)                                                            // 335
    return HTML.TransformingVisitor.prototype.visitAttributes.call(this, attrs);                                       // 336
  },                                                                                                                   // 337
  visitAttribute: function (name, value, tag) {                                                                        // 338
    // expand attribute values that are functions.  Any attribute value                                                // 339
    // that contains Views must be wrapped in a function.                                                              // 340
    if (typeof value === 'function')                                                                                   // 341
      value = Blaze._withCurrentView(this.parentView, value);                                                          // 342
                                                                                                                       // 343
    return HTML.TransformingVisitor.prototype.visitAttribute.call(                                                     // 344
      this, name, value, tag);                                                                                         // 345
  }                                                                                                                    // 346
});                                                                                                                    // 347
                                                                                                                       // 348
// Return Blaze.currentView, but only if it is being rendered                                                          // 349
// (i.e. we are in its render() method).                                                                               // 350
var currentViewIfRendering = function () {                                                                             // 351
  var view = Blaze.currentView;                                                                                        // 352
  return (view && view._isInRender) ? view : null;                                                                     // 353
};                                                                                                                     // 354
                                                                                                                       // 355
Blaze._expand = function (htmljs, parentView) {                                                                        // 356
  parentView = parentView || currentViewIfRendering();                                                                 // 357
  return (new Blaze._HTMLJSExpander(                                                                                   // 358
    {parentView: parentView})).visit(htmljs);                                                                          // 359
};                                                                                                                     // 360
                                                                                                                       // 361
Blaze._expandAttributes = function (attrs, parentView) {                                                               // 362
  parentView = parentView || currentViewIfRendering();                                                                 // 363
  return (new Blaze._HTMLJSExpander(                                                                                   // 364
    {parentView: parentView})).visitAttributes(attrs);                                                                 // 365
};                                                                                                                     // 366
                                                                                                                       // 367
Blaze._destroyView = function (view, _skipNodes) {                                                                     // 368
  if (view.isDestroyed)                                                                                                // 369
    return;                                                                                                            // 370
  view.isDestroyed = true;                                                                                             // 371
                                                                                                                       // 372
  Blaze._fireCallbacks(view, 'destroyed');                                                                             // 373
                                                                                                                       // 374
  // Destroy views and elements recursively.  If _skipNodes,                                                           // 375
  // only recurse up to views, not elements, for the case where                                                        // 376
  // the backend (jQuery) is recursing over the elements already.                                                      // 377
                                                                                                                       // 378
  if (view._domrange)                                                                                                  // 379
    view._domrange.destroyMembers(_skipNodes);                                                                         // 380
};                                                                                                                     // 381
                                                                                                                       // 382
Blaze._destroyNode = function (node) {                                                                                 // 383
  if (node.nodeType === 1)                                                                                             // 384
    Blaze._DOMBackend.Teardown.tearDownElement(node);                                                                  // 385
};                                                                                                                     // 386
                                                                                                                       // 387
// Are the HTMLjs entities `a` and `b` the same?  We could be                                                          // 388
// more elaborate here but the point is to catch the most basic                                                        // 389
// cases.                                                                                                              // 390
Blaze._isContentEqual = function (a, b) {                                                                              // 391
  if (a instanceof HTML.Raw) {                                                                                         // 392
    return (b instanceof HTML.Raw) && (a.value === b.value);                                                           // 393
  } else if (a == null) {                                                                                              // 394
    return (b == null);                                                                                                // 395
  } else {                                                                                                             // 396
    return (a === b) &&                                                                                                // 397
      ((typeof a === 'number') || (typeof a === 'boolean') ||                                                          // 398
       (typeof a === 'string'));                                                                                       // 399
  }                                                                                                                    // 400
};                                                                                                                     // 401
                                                                                                                       // 402
/**                                                                                                                    // 403
 * @summary The View corresponding to the current template helper, event handler, callback, or autorun.  If there isn't one, `null`.
 * @locus Client                                                                                                       // 405
 * @type {Blaze.View}                                                                                                  // 406
 */                                                                                                                    // 407
Blaze.currentView = null;                                                                                              // 408
                                                                                                                       // 409
Blaze._withCurrentView = function (view, func) {                                                                       // 410
  var oldView = Blaze.currentView;                                                                                     // 411
  try {                                                                                                                // 412
    Blaze.currentView = view;                                                                                          // 413
    return func();                                                                                                     // 414
  } finally {                                                                                                          // 415
    Blaze.currentView = oldView;                                                                                       // 416
  }                                                                                                                    // 417
};                                                                                                                     // 418
                                                                                                                       // 419
// Blaze.render publicly takes a View or a Template.                                                                   // 420
// Privately, it takes any HTMLJS (extended with Views and Templates)                                                  // 421
// except null or undefined, or a function that returns any extended                                                   // 422
// HTMLJS.                                                                                                             // 423
var checkRenderContent = function (content) {                                                                          // 424
  if (content === null)                                                                                                // 425
    throw new Error("Can't render null");                                                                              // 426
  if (typeof content === 'undefined')                                                                                  // 427
    throw new Error("Can't render undefined");                                                                         // 428
                                                                                                                       // 429
  if ((content instanceof Blaze.View) ||                                                                               // 430
      (content instanceof Blaze.Template) ||                                                                           // 431
      (typeof content === 'function'))                                                                                 // 432
    return;                                                                                                            // 433
                                                                                                                       // 434
  try {                                                                                                                // 435
    // Throw if content doesn't look like HTMLJS at the top level                                                      // 436
    // (i.e. verify that this is an HTML.Tag, or an array,                                                             // 437
    // or a primitive, etc.)                                                                                           // 438
    (new HTML.Visitor).visit(content);                                                                                 // 439
  } catch (e) {                                                                                                        // 440
    // Make error message suitable for public API                                                                      // 441
    throw new Error("Expected Template or View");                                                                      // 442
  }                                                                                                                    // 443
};                                                                                                                     // 444
                                                                                                                       // 445
// For Blaze.render and Blaze.toHTML, take content and                                                                 // 446
// wrap it in a View, unless it's a single View or                                                                     // 447
// Template already.                                                                                                   // 448
var contentAsView = function (content) {                                                                               // 449
  checkRenderContent(content);                                                                                         // 450
                                                                                                                       // 451
  if (content instanceof Blaze.Template) {                                                                             // 452
    return content.constructView();                                                                                    // 453
  } else if (content instanceof Blaze.View) {                                                                          // 454
    return content;                                                                                                    // 455
  } else {                                                                                                             // 456
    var func = content;                                                                                                // 457
    if (typeof func !== 'function') {                                                                                  // 458
      func = function () {                                                                                             // 459
        return content;                                                                                                // 460
      };                                                                                                               // 461
    }                                                                                                                  // 462
    return Blaze.View('render', func);                                                                                 // 463
  }                                                                                                                    // 464
};                                                                                                                     // 465
                                                                                                                       // 466
// For Blaze.renderWithData and Blaze.toHTMLWithData, wrap content                                                     // 467
// in a function, if necessary, so it can be a content arg to                                                          // 468
// a Blaze.With.                                                                                                       // 469
var contentAsFunc = function (content) {                                                                               // 470
  checkRenderContent(content);                                                                                         // 471
                                                                                                                       // 472
  if (typeof content !== 'function') {                                                                                 // 473
    return function () {                                                                                               // 474
      return content;                                                                                                  // 475
    };                                                                                                                 // 476
  } else {                                                                                                             // 477
    return content;                                                                                                    // 478
  }                                                                                                                    // 479
};                                                                                                                     // 480
                                                                                                                       // 481
/**                                                                                                                    // 482
 * @summary Renders a template or View to DOM nodes and inserts it into the DOM, returning a rendered [View](#blaze_view) which can be passed to [`Blaze.remove`](#blaze_remove).
 * @locus Client                                                                                                       // 484
 * @param {Template|Blaze.View} templateOrView The template (e.g. `Template.myTemplate`) or View object to render.  If a template, a View object is [constructed](#template_constructview).  If a View, it must be an unrendered View, which becomes a rendered View and is returned.
 * @param {DOMNode} parentNode The node that will be the parent of the rendered template.  It must be an Element node. // 486
 * @param {DOMNode} [nextNode] Optional. If provided, must be a child of <em>parentNode</em>; the template will be inserted before this node. If not provided, the template will be inserted as the last child of parentNode.
 * @param {Blaze.View} [parentView] Optional. If provided, it will be set as the rendered View's [`parentView`](#view_parentview).
 */                                                                                                                    // 489
Blaze.render = function (content, parentElement, nextNode, parentView) {                                               // 490
  if (! parentElement) {                                                                                               // 491
    Blaze._warn("Blaze.render without a parent element is deprecated. " +                                              // 492
                "You must specify where to insert the rendered content.");                                             // 493
  }                                                                                                                    // 494
                                                                                                                       // 495
  if (nextNode instanceof Blaze.View) {                                                                                // 496
    // handle omitted nextNode                                                                                         // 497
    parentView = nextNode;                                                                                             // 498
    nextNode = null;                                                                                                   // 499
  }                                                                                                                    // 500
                                                                                                                       // 501
  // parentElement must be a DOM node. in particular, can't be the                                                     // 502
  // result of a call to `$`. Can't check if `parentElement instanceof                                                 // 503
  // Node` since 'Node' is undefined in IE8.                                                                           // 504
  if (parentElement && typeof parentElement.nodeType !== 'number')                                                     // 505
    throw new Error("'parentElement' must be a DOM node");                                                             // 506
  if (nextNode && typeof nextNode.nodeType !== 'number') // 'nextNode' is optional                                     // 507
    throw new Error("'nextNode' must be a DOM node");                                                                  // 508
                                                                                                                       // 509
  parentView = parentView || currentViewIfRendering();                                                                 // 510
                                                                                                                       // 511
  var view = contentAsView(content);                                                                                   // 512
  Blaze._materializeView(view, parentView);                                                                            // 513
                                                                                                                       // 514
  if (parentElement) {                                                                                                 // 515
    view._domrange.attach(parentElement, nextNode);                                                                    // 516
  }                                                                                                                    // 517
                                                                                                                       // 518
  return view;                                                                                                         // 519
};                                                                                                                     // 520
                                                                                                                       // 521
Blaze.insert = function (view, parentElement, nextNode) {                                                              // 522
  Blaze._warn("Blaze.insert has been deprecated.  Specify where to insert the " +                                      // 523
              "rendered content in the call to Blaze.render.");                                                        // 524
                                                                                                                       // 525
  if (! (view && (view._domrange instanceof Blaze._DOMRange)))                                                         // 526
    throw new Error("Expected template rendered with Blaze.render");                                                   // 527
                                                                                                                       // 528
  view._domrange.attach(parentElement, nextNode);                                                                      // 529
};                                                                                                                     // 530
                                                                                                                       // 531
/**                                                                                                                    // 532
 * @summary Renders a template or View to DOM nodes with a data context.  Otherwise identical to `Blaze.render`.       // 533
 * @locus Client                                                                                                       // 534
 * @param {Template|Blaze.View} templateOrView The template (e.g. `Template.myTemplate`) or View object to render.     // 535
 * @param {Object|Function} data The data context to use, or a function returning a data context.  If a function is provided, it will be reactively re-run.
 * @param {DOMNode} parentNode The node that will be the parent of the rendered template.  It must be an Element node. // 537
 * @param {DOMNode} [nextNode] Optional. If provided, must be a child of <em>parentNode</em>; the template will be inserted before this node. If not provided, the template will be inserted as the last child of parentNode.
 * @param {Blaze.View} [parentView] Optional. If provided, it will be set as the rendered View's [`parentView`](#view_parentview).
 */                                                                                                                    // 540
Blaze.renderWithData = function (content, data, parentElement, nextNode, parentView) {                                 // 541
  // We defer the handling of optional arguments to Blaze.render.  At this point,                                      // 542
  // `nextNode` may actually be `parentView`.                                                                          // 543
  return Blaze.render(Blaze._TemplateWith(data, contentAsFunc(content)),                                               // 544
                          parentElement, nextNode, parentView);                                                        // 545
};                                                                                                                     // 546
                                                                                                                       // 547
/**                                                                                                                    // 548
 * @summary Removes a rendered View from the DOM, stopping all reactive updates and event listeners on it.             // 549
 * @locus Client                                                                                                       // 550
 * @param {Blaze.View} renderedView The return value from `Blaze.render` or `Blaze.renderWithData`.                    // 551
 */                                                                                                                    // 552
Blaze.remove = function (view) {                                                                                       // 553
  if (! (view && (view._domrange instanceof Blaze._DOMRange)))                                                         // 554
    throw new Error("Expected template rendered with Blaze.render");                                                   // 555
                                                                                                                       // 556
  while (view) {                                                                                                       // 557
    if (! view.isDestroyed) {                                                                                          // 558
      var range = view._domrange;                                                                                      // 559
      if (range.attached && ! range.parentRange)                                                                       // 560
        range.detach();                                                                                                // 561
      range.destroy();                                                                                                 // 562
    }                                                                                                                  // 563
                                                                                                                       // 564
    view = view._hasGeneratedParent && view.parentView;                                                                // 565
  }                                                                                                                    // 566
};                                                                                                                     // 567
                                                                                                                       // 568
/**                                                                                                                    // 569
 * @summary Renders a template or View to a string of HTML.                                                            // 570
 * @locus Client                                                                                                       // 571
 * @param {Template|Blaze.View} templateOrView The template (e.g. `Template.myTemplate`) or View object from which to generate HTML.
 */                                                                                                                    // 573
Blaze.toHTML = function (content, parentView) {                                                                        // 574
  parentView = parentView || currentViewIfRendering();                                                                 // 575
                                                                                                                       // 576
  return HTML.toHTML(Blaze._expandView(contentAsView(content), parentView));                                           // 577
};                                                                                                                     // 578
                                                                                                                       // 579
/**                                                                                                                    // 580
 * @summary Renders a template or View to HTML with a data context.  Otherwise identical to `Blaze.toHTML`.            // 581
 * @locus Client                                                                                                       // 582
 * @param {Template|Blaze.View} templateOrView The template (e.g. `Template.myTemplate`) or View object from which to generate HTML.
 * @param {Object|Function} data The data context to use, or a function returning a data context.                      // 584
 */                                                                                                                    // 585
Blaze.toHTMLWithData = function (content, data, parentView) {                                                          // 586
  parentView = parentView || currentViewIfRendering();                                                                 // 587
                                                                                                                       // 588
  return HTML.toHTML(Blaze._expandView(Blaze._TemplateWith(                                                            // 589
    data, contentAsFunc(content)), parentView));                                                                       // 590
};                                                                                                                     // 591
                                                                                                                       // 592
Blaze._toText = function (htmljs, parentView, textMode) {                                                              // 593
  if (typeof htmljs === 'function')                                                                                    // 594
    throw new Error("Blaze._toText doesn't take a function, just HTMLjs");                                             // 595
                                                                                                                       // 596
  if ((parentView != null) && ! (parentView instanceof Blaze.View)) {                                                  // 597
    // omitted parentView argument                                                                                     // 598
    textMode = parentView;                                                                                             // 599
    parentView = null;                                                                                                 // 600
  }                                                                                                                    // 601
  parentView = parentView || currentViewIfRendering();                                                                 // 602
                                                                                                                       // 603
  if (! textMode)                                                                                                      // 604
    throw new Error("textMode required");                                                                              // 605
  if (! (textMode === HTML.TEXTMODE.STRING ||                                                                          // 606
         textMode === HTML.TEXTMODE.RCDATA ||                                                                          // 607
         textMode === HTML.TEXTMODE.ATTRIBUTE))                                                                        // 608
    throw new Error("Unknown textMode: " + textMode);                                                                  // 609
                                                                                                                       // 610
  return HTML.toText(Blaze._expand(htmljs, parentView), textMode);                                                     // 611
};                                                                                                                     // 612
                                                                                                                       // 613
/**                                                                                                                    // 614
 * @summary Returns the current data context, or the data context that was used when rendering a particular DOM element or View from a Meteor template.
 * @locus Client                                                                                                       // 616
 * @param {DOMElement|Blaze.View} [elementOrView] Optional.  An element that was rendered by a Meteor, or a View.      // 617
 */                                                                                                                    // 618
Blaze.getData = function (elementOrView) {                                                                             // 619
  var theWith;                                                                                                         // 620
                                                                                                                       // 621
  if (! elementOrView) {                                                                                               // 622
    theWith = Blaze.getView('with');                                                                                   // 623
  } else if (elementOrView instanceof Blaze.View) {                                                                    // 624
    var view = elementOrView;                                                                                          // 625
    theWith = (view.name === 'with' ? view :                                                                           // 626
               Blaze.getView(view, 'with'));                                                                           // 627
  } else if (typeof elementOrView.nodeType === 'number') {                                                             // 628
    if (elementOrView.nodeType !== 1)                                                                                  // 629
      throw new Error("Expected DOM element");                                                                         // 630
    theWith = Blaze.getView(elementOrView, 'with');                                                                    // 631
  } else {                                                                                                             // 632
    throw new Error("Expected DOM element or View");                                                                   // 633
  }                                                                                                                    // 634
                                                                                                                       // 635
  return theWith ? theWith.dataVar.get() : null;                                                                       // 636
};                                                                                                                     // 637
                                                                                                                       // 638
// For back-compat                                                                                                     // 639
Blaze.getElementData = function (element) {                                                                            // 640
  Blaze._warn("Blaze.getElementData has been deprecated.  Use " +                                                      // 641
              "Blaze.getData(element) instead.");                                                                      // 642
                                                                                                                       // 643
  if (element.nodeType !== 1)                                                                                          // 644
    throw new Error("Expected DOM element");                                                                           // 645
                                                                                                                       // 646
  return Blaze.getData(element);                                                                                       // 647
};                                                                                                                     // 648
                                                                                                                       // 649
// Both arguments are optional.                                                                                        // 650
                                                                                                                       // 651
/**                                                                                                                    // 652
 * @summary Gets either the current View, or the View enclosing the given DOM element.                                 // 653
 * @locus Client                                                                                                       // 654
 * @param {DOMElement} [element] Optional.  If specified, the View enclosing `element` is returned.                    // 655
 */                                                                                                                    // 656
Blaze.getView = function (elementOrView, _viewName) {                                                                  // 657
  var viewName = _viewName;                                                                                            // 658
                                                                                                                       // 659
  if ((typeof elementOrView) === 'string') {                                                                           // 660
    // omitted elementOrView; viewName present                                                                         // 661
    viewName = elementOrView;                                                                                          // 662
    elementOrView = null;                                                                                              // 663
  }                                                                                                                    // 664
                                                                                                                       // 665
  // We could eventually shorten the code by folding the logic                                                         // 666
  // from the other methods into this method.                                                                          // 667
  if (! elementOrView) {                                                                                               // 668
    return Blaze._getCurrentView(viewName);                                                                            // 669
  } else if (elementOrView instanceof Blaze.View) {                                                                    // 670
    return Blaze._getParentView(elementOrView, viewName);                                                              // 671
  } else if (typeof elementOrView.nodeType === 'number') {                                                             // 672
    return Blaze._getElementView(elementOrView, viewName);                                                             // 673
  } else {                                                                                                             // 674
    throw new Error("Expected DOM element or View");                                                                   // 675
  }                                                                                                                    // 676
};                                                                                                                     // 677
                                                                                                                       // 678
// Gets the current view or its nearest ancestor of name                                                               // 679
// `name`.                                                                                                             // 680
Blaze._getCurrentView = function (name) {                                                                              // 681
  var view = Blaze.currentView;                                                                                        // 682
  // Better to fail in cases where it doesn't make sense                                                               // 683
  // to use Blaze._getCurrentView().  There will be a current                                                          // 684
  // view anywhere it does.  You can check Blaze.currentView                                                           // 685
  // if you want to know whether there is one or not.                                                                  // 686
  if (! view)                                                                                                          // 687
    throw new Error("There is no current view");                                                                       // 688
                                                                                                                       // 689
  if (name) {                                                                                                          // 690
    while (view && view.name !== name)                                                                                 // 691
      view = view.parentView;                                                                                          // 692
    return view || null;                                                                                               // 693
  } else {                                                                                                             // 694
    // Blaze._getCurrentView() with no arguments just returns                                                          // 695
    // Blaze.currentView.                                                                                              // 696
    return view;                                                                                                       // 697
  }                                                                                                                    // 698
};                                                                                                                     // 699
                                                                                                                       // 700
Blaze._getParentView = function (view, name) {                                                                         // 701
  var v = view.parentView;                                                                                             // 702
                                                                                                                       // 703
  if (name) {                                                                                                          // 704
    while (v && v.name !== name)                                                                                       // 705
      v = v.parentView;                                                                                                // 706
  }                                                                                                                    // 707
                                                                                                                       // 708
  return v || null;                                                                                                    // 709
};                                                                                                                     // 710
                                                                                                                       // 711
Blaze._getElementView = function (elem, name) {                                                                        // 712
  var range = Blaze._DOMRange.forElement(elem);                                                                        // 713
  var view = null;                                                                                                     // 714
  while (range && ! view) {                                                                                            // 715
    view = (range.view || null);                                                                                       // 716
    if (! view) {                                                                                                      // 717
      if (range.parentRange)                                                                                           // 718
        range = range.parentRange;                                                                                     // 719
      else                                                                                                             // 720
        range = Blaze._DOMRange.forElement(range.parentElement);                                                       // 721
    }                                                                                                                  // 722
  }                                                                                                                    // 723
                                                                                                                       // 724
  if (name) {                                                                                                          // 725
    while (view && view.name !== name)                                                                                 // 726
      view = view.parentView;                                                                                          // 727
    return view || null;                                                                                               // 728
  } else {                                                                                                             // 729
    return view;                                                                                                       // 730
  }                                                                                                                    // 731
};                                                                                                                     // 732
                                                                                                                       // 733
Blaze._addEventMap = function (view, eventMap, thisInHandler) {                                                        // 734
  thisInHandler = (thisInHandler || null);                                                                             // 735
  var handles = [];                                                                                                    // 736
                                                                                                                       // 737
  if (! view._domrange)                                                                                                // 738
    throw new Error("View must have a DOMRange");                                                                      // 739
                                                                                                                       // 740
  view._domrange.onAttached(function attached_eventMaps(range, element) {                                              // 741
    _.each(eventMap, function (handler, spec) {                                                                        // 742
      var clauses = spec.split(/,\s+/);                                                                                // 743
      // iterate over clauses of spec, e.g. ['click .foo', 'click .bar']                                               // 744
      _.each(clauses, function (clause) {                                                                              // 745
        var parts = clause.split(/\s+/);                                                                               // 746
        if (parts.length === 0)                                                                                        // 747
          return;                                                                                                      // 748
                                                                                                                       // 749
        var newEvents = parts.shift();                                                                                 // 750
        var selector = parts.join(' ');                                                                                // 751
        handles.push(Blaze._EventSupport.listen(                                                                       // 752
          element, newEvents, selector,                                                                                // 753
          function (evt) {                                                                                             // 754
            if (! range.containsElement(evt.currentTarget))                                                            // 755
              return null;                                                                                             // 756
            var handlerThis = thisInHandler || this;                                                                   // 757
            var handlerArgs = arguments;                                                                               // 758
            return Blaze._withCurrentView(view, function () {                                                          // 759
              return handler.apply(handlerThis, handlerArgs);                                                          // 760
            });                                                                                                        // 761
          },                                                                                                           // 762
          range, function (r) {                                                                                        // 763
            return r.parentRange;                                                                                      // 764
          }));                                                                                                         // 765
      });                                                                                                              // 766
    });                                                                                                                // 767
  });                                                                                                                  // 768
                                                                                                                       // 769
  view.onViewDestroyed(function () {                                                                                   // 770
    _.each(handles, function (h) {                                                                                     // 771
      h.stop();                                                                                                        // 772
    });                                                                                                                // 773
    handles.length = 0;                                                                                                // 774
  });                                                                                                                  // 775
};                                                                                                                     // 776
                                                                                                                       // 777
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/builtins.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Blaze._calculateCondition = function (cond) {                                                                          // 1
  if (cond instanceof Array && cond.length === 0)                                                                      // 2
    cond = false;                                                                                                      // 3
  return !! cond;                                                                                                      // 4
};                                                                                                                     // 5
                                                                                                                       // 6
/**                                                                                                                    // 7
 * @summary Constructs a View that renders content with a data context.                                                // 8
 * @locus Client                                                                                                       // 9
 * @param {Object|Function} data An object to use as the data context, or a function returning such an object.  If a function is provided, it will be reactively re-run.
 * @param {Function} contentFunc A Function that returns [*renderable content*](#renderable_content).                  // 11
 */                                                                                                                    // 12
Blaze.With = function (data, contentFunc) {                                                                            // 13
  var view = Blaze.View('with', contentFunc);                                                                          // 14
                                                                                                                       // 15
  view.dataVar = new ReactiveVar;                                                                                      // 16
                                                                                                                       // 17
  view.onViewCreated(function () {                                                                                     // 18
    if (typeof data === 'function') {                                                                                  // 19
      // `data` is a reactive function                                                                                 // 20
      view.autorun(function () {                                                                                       // 21
        view.dataVar.set(data());                                                                                      // 22
      }, view.parentView);                                                                                             // 23
    } else {                                                                                                           // 24
      view.dataVar.set(data);                                                                                          // 25
    }                                                                                                                  // 26
  });                                                                                                                  // 27
                                                                                                                       // 28
  return view;                                                                                                         // 29
};                                                                                                                     // 30
                                                                                                                       // 31
/**                                                                                                                    // 32
 * @summary Constructs a View that renders content conditionally.                                                      // 33
 * @locus Client                                                                                                       // 34
 * @param {Function} conditionFunc A function to reactively re-run.  Whether the result is truthy or falsy determines whether `contentFunc` or `elseFunc` is shown.  An empty array is considered falsy.
 * @param {Function} contentFunc A Function that returns [*renderable content*](#renderable_content).                  // 36
 * @param {Function} [elseFunc] Optional.  A Function that returns [*renderable content*](#renderable_content).  If no `elseFunc` is supplied, no content is shown in the "else" case.
 */                                                                                                                    // 38
Blaze.If = function (conditionFunc, contentFunc, elseFunc, _not) {                                                     // 39
  var conditionVar = new ReactiveVar;                                                                                  // 40
                                                                                                                       // 41
  var view = Blaze.View(_not ? 'unless' : 'if', function () {                                                          // 42
    return conditionVar.get() ? contentFunc() :                                                                        // 43
      (elseFunc ? elseFunc() : null);                                                                                  // 44
  });                                                                                                                  // 45
  view.__conditionVar = conditionVar;                                                                                  // 46
  view.onViewCreated(function () {                                                                                     // 47
    this.autorun(function () {                                                                                         // 48
      var cond = Blaze._calculateCondition(conditionFunc());                                                           // 49
      conditionVar.set(_not ? (! cond) : cond);                                                                        // 50
    }, this.parentView);                                                                                               // 51
  });                                                                                                                  // 52
                                                                                                                       // 53
  return view;                                                                                                         // 54
};                                                                                                                     // 55
                                                                                                                       // 56
/**                                                                                                                    // 57
 * @summary An inverted [`Blaze.If`](#blaze_if).                                                                       // 58
 * @locus Client                                                                                                       // 59
 * @param {Function} conditionFunc A function to reactively re-run.  If the result is falsy, `contentFunc` is shown, otherwise `elseFunc` is shown.  An empty array is considered falsy.
 * @param {Function} contentFunc A Function that returns [*renderable content*](#renderable_content).                  // 61
 * @param {Function} [elseFunc] Optional.  A Function that returns [*renderable content*](#renderable_content).  If no `elseFunc` is supplied, no content is shown in the "else" case.
 */                                                                                                                    // 63
Blaze.Unless = function (conditionFunc, contentFunc, elseFunc) {                                                       // 64
  return Blaze.If(conditionFunc, contentFunc, elseFunc, true /*_not*/);                                                // 65
};                                                                                                                     // 66
                                                                                                                       // 67
/**                                                                                                                    // 68
 * @summary Constructs a View that renders `contentFunc` for each item in a sequence.                                  // 69
 * @locus Client                                                                                                       // 70
 * @param {Function} argFunc A function to reactively re-run.  The function may return a Cursor, an array, null, or undefined.
 * @param {Function} contentFunc A Function that returns [*renderable content*](#renderable_content).                  // 72
 * @param {Function} [elseFunc] Optional.  A Function that returns [*renderable content*](#renderable_content) to display in the case when there are no items to display.
 */                                                                                                                    // 74
Blaze.Each = function (argFunc, contentFunc, elseFunc) {                                                               // 75
  var eachView = Blaze.View('each', function () {                                                                      // 76
    var subviews = this.initialSubviews;                                                                               // 77
    this.initialSubviews = null;                                                                                       // 78
    if (this._isCreatedForExpansion) {                                                                                 // 79
      this.expandedValueDep = new Tracker.Dependency;                                                                  // 80
      this.expandedValueDep.depend();                                                                                  // 81
    }                                                                                                                  // 82
    return subviews;                                                                                                   // 83
  });                                                                                                                  // 84
  eachView.initialSubviews = [];                                                                                       // 85
  eachView.numItems = 0;                                                                                               // 86
  eachView.inElseMode = false;                                                                                         // 87
  eachView.stopHandle = null;                                                                                          // 88
  eachView.contentFunc = contentFunc;                                                                                  // 89
  eachView.elseFunc = elseFunc;                                                                                        // 90
  eachView.argVar = new ReactiveVar;                                                                                   // 91
                                                                                                                       // 92
  eachView.onViewCreated(function () {                                                                                 // 93
    // We evaluate argFunc in an autorun to make sure                                                                  // 94
    // Blaze.currentView is always set when it runs (rather than                                                       // 95
    // passing argFunc straight to ObserveSequence).                                                                   // 96
    eachView.autorun(function () {                                                                                     // 97
      eachView.argVar.set(argFunc());                                                                                  // 98
    }, eachView.parentView);                                                                                           // 99
                                                                                                                       // 100
    eachView.stopHandle = ObserveSequence.observe(function () {                                                        // 101
      return eachView.argVar.get();                                                                                    // 102
    }, {                                                                                                               // 103
      addedAt: function (id, item, index) {                                                                            // 104
        Tracker.nonreactive(function () {                                                                              // 105
          var newItemView = Blaze.With(item, eachView.contentFunc);                                                    // 106
          eachView.numItems++;                                                                                         // 107
                                                                                                                       // 108
          if (eachView.expandedValueDep) {                                                                             // 109
            eachView.expandedValueDep.changed();                                                                       // 110
          } else if (eachView._domrange) {                                                                             // 111
            if (eachView.inElseMode) {                                                                                 // 112
              eachView._domrange.removeMember(0);                                                                      // 113
              eachView.inElseMode = false;                                                                             // 114
            }                                                                                                          // 115
                                                                                                                       // 116
            var range = Blaze._materializeView(newItemView, eachView);                                                 // 117
            eachView._domrange.addMember(range, index);                                                                // 118
          } else {                                                                                                     // 119
            eachView.initialSubviews.splice(index, 0, newItemView);                                                    // 120
          }                                                                                                            // 121
        });                                                                                                            // 122
      },                                                                                                               // 123
      removedAt: function (id, item, index) {                                                                          // 124
        Tracker.nonreactive(function () {                                                                              // 125
          eachView.numItems--;                                                                                         // 126
          if (eachView.expandedValueDep) {                                                                             // 127
            eachView.expandedValueDep.changed();                                                                       // 128
          } else if (eachView._domrange) {                                                                             // 129
            eachView._domrange.removeMember(index);                                                                    // 130
            if (eachView.elseFunc && eachView.numItems === 0) {                                                        // 131
              eachView.inElseMode = true;                                                                              // 132
              eachView._domrange.addMember(                                                                            // 133
                Blaze._materializeView(                                                                                // 134
                  Blaze.View('each_else',eachView.elseFunc),                                                           // 135
                  eachView), 0);                                                                                       // 136
            }                                                                                                          // 137
          } else {                                                                                                     // 138
            eachView.initialSubviews.splice(index, 1);                                                                 // 139
          }                                                                                                            // 140
        });                                                                                                            // 141
      },                                                                                                               // 142
      changedAt: function (id, newItem, oldItem, index) {                                                              // 143
        Tracker.nonreactive(function () {                                                                              // 144
          var itemView;                                                                                                // 145
          if (eachView.expandedValueDep) {                                                                             // 146
            eachView.expandedValueDep.changed();                                                                       // 147
          } else if (eachView._domrange) {                                                                             // 148
            itemView = eachView._domrange.getMember(index).view;                                                       // 149
          } else {                                                                                                     // 150
            itemView = eachView.initialSubviews[index];                                                                // 151
          }                                                                                                            // 152
          itemView.dataVar.set(newItem);                                                                               // 153
        });                                                                                                            // 154
      },                                                                                                               // 155
      movedTo: function (id, item, fromIndex, toIndex) {                                                               // 156
        Tracker.nonreactive(function () {                                                                              // 157
          if (eachView.expandedValueDep) {                                                                             // 158
            eachView.expandedValueDep.changed();                                                                       // 159
          } else if (eachView._domrange) {                                                                             // 160
            eachView._domrange.moveMember(fromIndex, toIndex);                                                         // 161
          } else {                                                                                                     // 162
            var subviews = eachView.initialSubviews;                                                                   // 163
            var itemView = subviews[fromIndex];                                                                        // 164
            subviews.splice(fromIndex, 1);                                                                             // 165
            subviews.splice(toIndex, 0, itemView);                                                                     // 166
          }                                                                                                            // 167
        });                                                                                                            // 168
      }                                                                                                                // 169
    });                                                                                                                // 170
                                                                                                                       // 171
    if (eachView.elseFunc && eachView.numItems === 0) {                                                                // 172
      eachView.inElseMode = true;                                                                                      // 173
      eachView.initialSubviews[0] =                                                                                    // 174
        Blaze.View('each_else', eachView.elseFunc);                                                                    // 175
    }                                                                                                                  // 176
  });                                                                                                                  // 177
                                                                                                                       // 178
  eachView.onViewDestroyed(function () {                                                                               // 179
    if (eachView.stopHandle)                                                                                           // 180
      eachView.stopHandle.stop();                                                                                      // 181
  });                                                                                                                  // 182
                                                                                                                       // 183
  return eachView;                                                                                                     // 184
};                                                                                                                     // 185
                                                                                                                       // 186
Blaze._TemplateWith = function (arg, contentFunc) {                                                                    // 187
  var w;                                                                                                               // 188
                                                                                                                       // 189
  var argFunc = arg;                                                                                                   // 190
  if (typeof arg !== 'function') {                                                                                     // 191
    argFunc = function () {                                                                                            // 192
      return arg;                                                                                                      // 193
    };                                                                                                                 // 194
  }                                                                                                                    // 195
                                                                                                                       // 196
  // This is a little messy.  When we compile `{{> Template.contentBlock}}`, we                                        // 197
  // wrap it in Blaze._InOuterTemplateScope in order to skip the intermediate                                          // 198
  // parent Views in the current template.  However, when there's an argument                                          // 199
  // (`{{> Template.contentBlock arg}}`), the argument needs to be evaluated                                           // 200
  // in the original scope.  There's no good order to nest                                                             // 201
  // Blaze._InOuterTemplateScope and Spacebars.TemplateWith to achieve this,                                           // 202
  // so we wrap argFunc to run it in the "original parentView" of the                                                  // 203
  // Blaze._InOuterTemplateScope.                                                                                      // 204
  //                                                                                                                   // 205
  // To make this better, reconsider _InOuterTemplateScope as a primitive.                                             // 206
  // Longer term, evaluate expressions in the proper lexical scope.                                                    // 207
  var wrappedArgFunc = function () {                                                                                   // 208
    var viewToEvaluateArg = null;                                                                                      // 209
    if (w.parentView && w.parentView.name === 'InOuterTemplateScope') {                                                // 210
      viewToEvaluateArg = w.parentView.originalParentView;                                                             // 211
    }                                                                                                                  // 212
    if (viewToEvaluateArg) {                                                                                           // 213
      return Blaze._withCurrentView(viewToEvaluateArg, argFunc);                                                       // 214
    } else {                                                                                                           // 215
      return argFunc();                                                                                                // 216
    }                                                                                                                  // 217
  };                                                                                                                   // 218
                                                                                                                       // 219
  var wrappedContentFunc = function () {                                                                               // 220
    var content = contentFunc.call(this);                                                                              // 221
                                                                                                                       // 222
    // Since we are generating the Blaze._TemplateWith view for the                                                    // 223
    // user, set the flag on the child view.  If `content` is a template,                                              // 224
    // construct the View so that we can set the flag.                                                                 // 225
    if (content instanceof Blaze.Template) {                                                                           // 226
      content = content.constructView();                                                                               // 227
    }                                                                                                                  // 228
    if (content instanceof Blaze.View) {                                                                               // 229
      content._hasGeneratedParent = true;                                                                              // 230
    }                                                                                                                  // 231
                                                                                                                       // 232
    return content;                                                                                                    // 233
  };                                                                                                                   // 234
                                                                                                                       // 235
  w = Blaze.With(wrappedArgFunc, wrappedContentFunc);                                                                  // 236
  w.__isTemplateWith = true;                                                                                           // 237
  return w;                                                                                                            // 238
};                                                                                                                     // 239
                                                                                                                       // 240
Blaze._InOuterTemplateScope = function (templateView, contentFunc) {                                                   // 241
  var view = Blaze.View('InOuterTemplateScope', contentFunc);                                                          // 242
  var parentView = templateView.parentView;                                                                            // 243
                                                                                                                       // 244
  // Hack so that if you call `{{> foo bar}}` and it expands into                                                      // 245
  // `{{#with bar}}{{> foo}}{{/with}}`, and then `foo` is a template                                                   // 246
  // that inserts `{{> Template.contentBlock}}`, the data context for                                                  // 247
  // `Template.contentBlock` is not `bar` but the one enclosing that.                                                  // 248
  if (parentView.__isTemplateWith)                                                                                     // 249
    parentView = parentView.parentView;                                                                                // 250
                                                                                                                       // 251
  view.onViewCreated(function () {                                                                                     // 252
    this.originalParentView = this.parentView;                                                                         // 253
    this.parentView = parentView;                                                                                      // 254
  });                                                                                                                  // 255
  return view;                                                                                                         // 256
};                                                                                                                     // 257
                                                                                                                       // 258
// XXX COMPAT WITH 0.9.0                                                                                               // 259
Blaze.InOuterTemplateScope = Blaze._InOuterTemplateScope;                                                              // 260
                                                                                                                       // 261
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/lookup.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Blaze._globalHelpers = {};                                                                                             // 1
                                                                                                                       // 2
// Documented as Template.registerHelper.                                                                              // 3
// This definition also provides back-compat for `UI.registerHelper`.                                                  // 4
Blaze.registerHelper = function (name, func) {                                                                         // 5
  Blaze._globalHelpers[name] = func;                                                                                   // 6
};                                                                                                                     // 7
                                                                                                                       // 8
                                                                                                                       // 9
var bindIfIsFunction = function (x, target) {                                                                          // 10
  if (typeof x !== 'function')                                                                                         // 11
    return x;                                                                                                          // 12
  return function () {                                                                                                 // 13
    return x.apply(target, arguments);                                                                                 // 14
  };                                                                                                                   // 15
};                                                                                                                     // 16
                                                                                                                       // 17
// If `x` is a function, binds the value of `this` for that function                                                   // 18
// to the current data context.                                                                                        // 19
var bindDataContext = function (x) {                                                                                   // 20
  if (typeof x === 'function') {                                                                                       // 21
    return function () {                                                                                               // 22
      var data = Blaze.getData();                                                                                      // 23
      if (data == null)                                                                                                // 24
        data = {};                                                                                                     // 25
      return x.apply(data, arguments);                                                                                 // 26
    };                                                                                                                 // 27
  }                                                                                                                    // 28
  return x;                                                                                                            // 29
};                                                                                                                     // 30
                                                                                                                       // 31
Blaze._OLDSTYLE_HELPER = {};                                                                                           // 32
                                                                                                                       // 33
var getTemplateHelper = Blaze._getTemplateHelper = function (template, name) {                                         // 34
  // XXX COMPAT WITH 0.9.3                                                                                             // 35
  var isKnownOldStyleHelper = false;                                                                                   // 36
                                                                                                                       // 37
  if (template.__helpers.has(name)) {                                                                                  // 38
    var helper = template.__helpers.get(name);                                                                         // 39
    if (helper === Blaze._OLDSTYLE_HELPER) {                                                                           // 40
      isKnownOldStyleHelper = true;                                                                                    // 41
    } else {                                                                                                           // 42
      return helper;                                                                                                   // 43
    }                                                                                                                  // 44
  }                                                                                                                    // 45
                                                                                                                       // 46
  // old-style helper                                                                                                  // 47
  if (name in template) {                                                                                              // 48
    // Only warn once per helper                                                                                       // 49
    if (! isKnownOldStyleHelper) {                                                                                     // 50
      template.__helpers.set(name, Blaze._OLDSTYLE_HELPER);                                                            // 51
      if (! template._NOWARN_OLDSTYLE_HELPERS) {                                                                       // 52
        Blaze._warn('Assigning helper with `' + template.viewName + '.' +                                              // 53
                    name + ' = ...` is deprecated.  Use `' + template.viewName +                                       // 54
                    '.helpers(...)` instead.');                                                                        // 55
      }                                                                                                                // 56
    }                                                                                                                  // 57
    return template[name];                                                                                             // 58
  }                                                                                                                    // 59
                                                                                                                       // 60
  return null;                                                                                                         // 61
};                                                                                                                     // 62
                                                                                                                       // 63
var wrapHelper = function (f) {                                                                                        // 64
  return Blaze._wrapCatchingExceptions(f, 'template helper');                                                          // 65
};                                                                                                                     // 66
                                                                                                                       // 67
// Looks up a name, like "foo" or "..", as a helper of the                                                             // 68
// current template; a global helper; the name of a template;                                                          // 69
// or a property of the data context.  Called on the View of                                                           // 70
// a template (i.e. a View with a `.template` property,                                                                // 71
// where the helpers are).  Used for the first name in a                                                               // 72
// "path" in a template tag, like "foo" in `{{foo.bar}}` or                                                            // 73
// ".." in `{{frobulate ../blah}}`.                                                                                    // 74
//                                                                                                                     // 75
// Returns a function, a non-function value, or null.  If                                                              // 76
// a function is found, it is bound appropriately.                                                                     // 77
//                                                                                                                     // 78
// NOTE: This function must not establish any reactive                                                                 // 79
// dependencies itself.  If there is any reactivity in the                                                             // 80
// value, lookup should return a function.                                                                             // 81
Blaze.View.prototype.lookup = function (name, _options) {                                                              // 82
  var template = this.template;                                                                                        // 83
  var lookupTemplate = _options && _options.template;                                                                  // 84
  var helper;                                                                                                          // 85
                                                                                                                       // 86
  if (/^\./.test(name)) {                                                                                              // 87
    // starts with a dot. must be a series of dots which maps to an                                                    // 88
    // ancestor of the appropriate height.                                                                             // 89
    if (!/^(\.)+$/.test(name))                                                                                         // 90
      throw new Error("id starting with dot must be a series of dots");                                                // 91
                                                                                                                       // 92
    return Blaze._parentData(name.length - 1, true /*_functionWrapped*/);                                              // 93
                                                                                                                       // 94
  } else if (template &&                                                                                               // 95
             ((helper = getTemplateHelper(template, name)) != null)) {                                                 // 96
    return wrapHelper(bindDataContext(helper));                                                                        // 97
  } else if (lookupTemplate && (name in Blaze.Template) &&                                                             // 98
             (Blaze.Template[name] instanceof Blaze.Template)) {                                                       // 99
    return Blaze.Template[name];                                                                                       // 100
  } else if (Blaze._globalHelpers[name] != null) {                                                                     // 101
    return wrapHelper(bindDataContext(Blaze._globalHelpers[name]));                                                    // 102
  } else {                                                                                                             // 103
    return function () {                                                                                               // 104
      var isCalledAsFunction = (arguments.length > 0);                                                                 // 105
      var data = Blaze.getData();                                                                                      // 106
      if (lookupTemplate && ! (data && data[name])) {                                                                  // 107
        throw new Error("No such template: " + name);                                                                  // 108
      }                                                                                                                // 109
      if (isCalledAsFunction && ! (data && data[name])) {                                                              // 110
        throw new Error("No such function: " + name);                                                                  // 111
      }                                                                                                                // 112
      if (! data)                                                                                                      // 113
        return null;                                                                                                   // 114
      var x = data[name];                                                                                              // 115
      if (typeof x !== 'function') {                                                                                   // 116
        if (isCalledAsFunction) {                                                                                      // 117
          throw new Error("Can't call non-function: " + x);                                                            // 118
        }                                                                                                              // 119
        return x;                                                                                                      // 120
      }                                                                                                                // 121
      return x.apply(data, arguments);                                                                                 // 122
    };                                                                                                                 // 123
  }                                                                                                                    // 124
  return null;                                                                                                         // 125
};                                                                                                                     // 126
                                                                                                                       // 127
// Implement Spacebars' {{../..}}.                                                                                     // 128
// @param height {Number} The number of '..'s                                                                          // 129
Blaze._parentData = function (height, _functionWrapped) {                                                              // 130
  // If height is null or undefined, we default to 1, the first parent.                                                // 131
  if (height == null) {                                                                                                // 132
    height = 1;                                                                                                        // 133
  }                                                                                                                    // 134
  var theWith = Blaze.getView('with');                                                                                 // 135
  for (var i = 0; (i < height) && theWith; i++) {                                                                      // 136
    theWith = Blaze.getView(theWith, 'with');                                                                          // 137
  }                                                                                                                    // 138
                                                                                                                       // 139
  if (! theWith)                                                                                                       // 140
    return null;                                                                                                       // 141
  if (_functionWrapped)                                                                                                // 142
    return function () { return theWith.dataVar.get(); };                                                              // 143
  return theWith.dataVar.get();                                                                                        // 144
};                                                                                                                     // 145
                                                                                                                       // 146
                                                                                                                       // 147
Blaze.View.prototype.lookupTemplate = function (name) {                                                                // 148
  return this.lookup(name, {template:true});                                                                           // 149
};                                                                                                                     // 150
                                                                                                                       // 151
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/template.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// [new] Blaze.Template([viewName], renderFunction)                                                                    // 1
//                                                                                                                     // 2
// `Blaze.Template` is the class of templates, like `Template.foo` in                                                  // 3
// Meteor, which is `instanceof Template`.                                                                             // 4
//                                                                                                                     // 5
// `viewKind` is a string that looks like "Template.foo" for templates                                                 // 6
// defined by the compiler.                                                                                            // 7
                                                                                                                       // 8
/**                                                                                                                    // 9
 * @class                                                                                                              // 10
 * @summary Constructor for a Template, which is used to construct Views with particular name and content.             // 11
 * @locus Client                                                                                                       // 12
 * @param {String} [viewName] Optional.  A name for Views constructed by this Template.  See [`view.name`](#view_name).
 * @param {Function} renderFunction A function that returns [*renderable content*](#renderable_content).  This function is used as the `renderFunction` for Views constructed by this Template.
 */                                                                                                                    // 15
Blaze.Template = function (viewName, renderFunction) {                                                                 // 16
  if (! (this instanceof Blaze.Template))                                                                              // 17
    // called without `new`                                                                                            // 18
    return new Blaze.Template(viewName, renderFunction);                                                               // 19
                                                                                                                       // 20
  if (typeof viewName === 'function') {                                                                                // 21
    // omitted "viewName" argument                                                                                     // 22
    renderFunction = viewName;                                                                                         // 23
    viewName = '';                                                                                                     // 24
  }                                                                                                                    // 25
  if (typeof viewName !== 'string')                                                                                    // 26
    throw new Error("viewName must be a String (or omitted)");                                                         // 27
  if (typeof renderFunction !== 'function')                                                                            // 28
    throw new Error("renderFunction must be a function");                                                              // 29
                                                                                                                       // 30
  this.viewName = viewName;                                                                                            // 31
  this.renderFunction = renderFunction;                                                                                // 32
                                                                                                                       // 33
  this.__helpers = new HelperMap;                                                                                      // 34
  this.__eventMaps = [];                                                                                               // 35
};                                                                                                                     // 36
var Template = Blaze.Template;                                                                                         // 37
                                                                                                                       // 38
var HelperMap = function () {};                                                                                        // 39
HelperMap.prototype.get = function (name) {                                                                            // 40
  return this[' '+name];                                                                                               // 41
};                                                                                                                     // 42
HelperMap.prototype.set = function (name, helper) {                                                                    // 43
  this[' '+name] = helper;                                                                                             // 44
};                                                                                                                     // 45
HelperMap.prototype.has = function (name) {                                                                            // 46
  return (' '+name) in this;                                                                                           // 47
};                                                                                                                     // 48
                                                                                                                       // 49
/**                                                                                                                    // 50
 * @summary Returns true if `value` is a template object like `Template.myTemplate`.                                   // 51
 * @locus Client                                                                                                       // 52
 * @param {Any} value The value to test.                                                                               // 53
 */                                                                                                                    // 54
Blaze.isTemplate = function (t) {                                                                                      // 55
  return (t instanceof Blaze.Template);                                                                                // 56
};                                                                                                                     // 57
                                                                                                                       // 58
Template.prototype.constructView = function (contentFunc, elseFunc) {                                                  // 59
  var self = this;                                                                                                     // 60
  var view = Blaze.View(self.viewName, self.renderFunction);                                                           // 61
  view.template = self;                                                                                                // 62
                                                                                                                       // 63
  view.templateContentBlock = (                                                                                        // 64
    contentFunc ? new Template('(contentBlock)', contentFunc) : null);                                                 // 65
  view.templateElseBlock = (                                                                                           // 66
    elseFunc ? new Template('(elseBlock)', elseFunc) : null);                                                          // 67
                                                                                                                       // 68
  if (self.__eventMaps || typeof self.events === 'object') {                                                           // 69
    view._onViewRendered(function () {                                                                                 // 70
      if (view.renderCount !== 1)                                                                                      // 71
        return;                                                                                                        // 72
                                                                                                                       // 73
      if (! self.__eventMaps.length && typeof self.events === "object") {                                              // 74
        // Provide limited back-compat support for `.events = {...}`                                                   // 75
        // syntax.  Pass `template.events` to the original `.events(...)`                                              // 76
        // function.  This code must run only once per template, in                                                    // 77
        // order to not bind the handlers more than once, which is                                                     // 78
        // ensured by the fact that we only do this when `__eventMaps`                                                 // 79
        // is falsy, and we cause it to be set now.                                                                    // 80
        Template.prototype.events.call(self, self.events);                                                             // 81
      }                                                                                                                // 82
                                                                                                                       // 83
      _.each(self.__eventMaps, function (m) {                                                                          // 84
        Blaze._addEventMap(view, m, view);                                                                             // 85
      });                                                                                                              // 86
    });                                                                                                                // 87
  }                                                                                                                    // 88
                                                                                                                       // 89
  view._templateInstance = new Blaze.TemplateInstance(view);                                                           // 90
  view.templateInstance = function () {                                                                                // 91
    // Update data, firstNode, and lastNode, and return the TemplateInstance                                           // 92
    // object.                                                                                                         // 93
    var inst = view._templateInstance;                                                                                 // 94
                                                                                                                       // 95
    /**                                                                                                                // 96
     * @instance                                                                                                       // 97
     * @memberOf Blaze.TemplateInstance                                                                                // 98
     * @name  data                                                                                                     // 99
     * @summary The data context of this instance's latest invocation.                                                 // 100
     * @locus Client                                                                                                   // 101
     */                                                                                                                // 102
    inst.data = Blaze.getData(view);                                                                                   // 103
                                                                                                                       // 104
    if (view._domrange && !view.isDestroyed) {                                                                         // 105
      inst.firstNode = view._domrange.firstNode();                                                                     // 106
      inst.lastNode = view._domrange.lastNode();                                                                       // 107
    } else {                                                                                                           // 108
      // on 'created' or 'destroyed' callbacks we don't have a DomRange                                                // 109
      inst.firstNode = null;                                                                                           // 110
      inst.lastNode = null;                                                                                            // 111
    }                                                                                                                  // 112
                                                                                                                       // 113
    return inst;                                                                                                       // 114
  };                                                                                                                   // 115
                                                                                                                       // 116
  /**                                                                                                                  // 117
   * @name  created                                                                                                    // 118
   * @instance                                                                                                         // 119
   * @memberOf Template                                                                                                // 120
   * @summary Provide a callback when an instance of a template is created.                                            // 121
   * @locus Client                                                                                                     // 122
   */                                                                                                                  // 123
  if (self.created) {                                                                                                  // 124
    view.onViewCreated(function () {                                                                                   // 125
      self.created.call(view.templateInstance());                                                                      // 126
    });                                                                                                                // 127
  }                                                                                                                    // 128
                                                                                                                       // 129
  /**                                                                                                                  // 130
   * @name  rendered                                                                                                   // 131
   * @instance                                                                                                         // 132
   * @memberOf Template                                                                                                // 133
   * @summary Provide a callback when an instance of a template is rendered.                                           // 134
   * @locus Client                                                                                                     // 135
   */                                                                                                                  // 136
  if (self.rendered) {                                                                                                 // 137
    view.onViewReady(function () {                                                                                     // 138
      self.rendered.call(view.templateInstance());                                                                     // 139
    });                                                                                                                // 140
  }                                                                                                                    // 141
                                                                                                                       // 142
  /**                                                                                                                  // 143
   * @name  destroyed                                                                                                  // 144
   * @instance                                                                                                         // 145
   * @memberOf Template                                                                                                // 146
   * @summary Provide a callback when an instance of a template is destroyed.                                          // 147
   * @locus Client                                                                                                     // 148
   */                                                                                                                  // 149
  if (self.destroyed) {                                                                                                // 150
    view.onViewDestroyed(function () {                                                                                 // 151
      self.destroyed.call(view.templateInstance());                                                                    // 152
    });                                                                                                                // 153
  }                                                                                                                    // 154
                                                                                                                       // 155
  return view;                                                                                                         // 156
};                                                                                                                     // 157
                                                                                                                       // 158
/**                                                                                                                    // 159
 * @class                                                                                                              // 160
 * @summary The class for template instances                                                                           // 161
 * @param {Blaze.View} view                                                                                            // 162
 * @instanceName template                                                                                              // 163
 */                                                                                                                    // 164
Blaze.TemplateInstance = function (view) {                                                                             // 165
  if (! (this instanceof Blaze.TemplateInstance))                                                                      // 166
    // called without `new`                                                                                            // 167
    return new Blaze.TemplateInstance(view);                                                                           // 168
                                                                                                                       // 169
  if (! (view instanceof Blaze.View))                                                                                  // 170
    throw new Error("View required");                                                                                  // 171
                                                                                                                       // 172
  view._templateInstance = this;                                                                                       // 173
                                                                                                                       // 174
  /**                                                                                                                  // 175
   * @name view                                                                                                        // 176
   * @memberOf Blaze.TemplateInstance                                                                                  // 177
   * @instance                                                                                                         // 178
   * @summary The [View](#blaze_view) object for this invocation of the template.                                      // 179
   * @locus Client                                                                                                     // 180
   * @type {Blaze.View}                                                                                                // 181
   */                                                                                                                  // 182
  this.view = view;                                                                                                    // 183
  this.data = null;                                                                                                    // 184
                                                                                                                       // 185
  /**                                                                                                                  // 186
   * @name firstNode                                                                                                   // 187
   * @memberOf Blaze.TemplateInstance                                                                                  // 188
   * @instance                                                                                                         // 189
   * @summary The first top-level DOM node in this template instance.                                                  // 190
   * @locus Client                                                                                                     // 191
   * @type {DOMNode}                                                                                                   // 192
   */                                                                                                                  // 193
  this.firstNode = null;                                                                                               // 194
                                                                                                                       // 195
  /**                                                                                                                  // 196
   * @name lastNode                                                                                                    // 197
   * @memberOf Blaze.TemplateInstance                                                                                  // 198
   * @instance                                                                                                         // 199
   * @summary The last top-level DOM node in this template instance.                                                   // 200
   * @locus Client                                                                                                     // 201
   * @type {DOMNode}                                                                                                   // 202
   */                                                                                                                  // 203
  this.lastNode = null;                                                                                                // 204
};                                                                                                                     // 205
                                                                                                                       // 206
/**                                                                                                                    // 207
 * @summary Find all elements matching `selector` in this template instance, and return them as a JQuery object.       // 208
 * @locus Client                                                                                                       // 209
 * @param {String} selector The CSS selector to match, scoped to the template contents.                                // 210
 * @returns {DOMNode[]}                                                                                                // 211
 */                                                                                                                    // 212
Blaze.TemplateInstance.prototype.$ = function (selector) {                                                             // 213
  var view = this.view;                                                                                                // 214
  if (! view._domrange)                                                                                                // 215
    throw new Error("Can't use $ on template instance with no DOM");                                                   // 216
  return view._domrange.$(selector);                                                                                   // 217
};                                                                                                                     // 218
                                                                                                                       // 219
/**                                                                                                                    // 220
 * @summary Find all elements matching `selector` in this template instance.                                           // 221
 * @locus Client                                                                                                       // 222
 * @param {String} selector The CSS selector to match, scoped to the template contents.                                // 223
 * @returns {DOMElement[]}                                                                                             // 224
 */                                                                                                                    // 225
Blaze.TemplateInstance.prototype.findAll = function (selector) {                                                       // 226
  return Array.prototype.slice.call(this.$(selector));                                                                 // 227
};                                                                                                                     // 228
                                                                                                                       // 229
/**                                                                                                                    // 230
 * @summary Find one element matching `selector` in this template instance.                                            // 231
 * @locus Client                                                                                                       // 232
 * @param {String} selector The CSS selector to match, scoped to the template contents.                                // 233
 * @returns {DOMElement}                                                                                               // 234
 */                                                                                                                    // 235
Blaze.TemplateInstance.prototype.find = function (selector) {                                                          // 236
  var result = this.$(selector);                                                                                       // 237
  return result[0] || null;                                                                                            // 238
};                                                                                                                     // 239
                                                                                                                       // 240
/**                                                                                                                    // 241
 * @summary A version of [Tracker.autorun](#tracker_autorun) that is stopped when the template is destroyed.           // 242
 * @locus Client                                                                                                       // 243
 * @param {Function} runFunc The function to run. It receives one argument: a Tracker.Computation object.              // 244
 */                                                                                                                    // 245
Blaze.TemplateInstance.prototype.autorun = function (f) {                                                              // 246
  return this.view.autorun(f);                                                                                         // 247
};                                                                                                                     // 248
                                                                                                                       // 249
/**                                                                                                                    // 250
 * @summary Specify template helpers available to this template.                                                       // 251
 * @locus Client                                                                                                       // 252
 * @param {Object} helpers Dictionary of helper functions by name.                                                     // 253
 */                                                                                                                    // 254
Template.prototype.helpers = function (dict) {                                                                         // 255
  for (var k in dict)                                                                                                  // 256
    this.__helpers.set(k, dict[k]);                                                                                    // 257
};                                                                                                                     // 258
                                                                                                                       // 259
/**                                                                                                                    // 260
 * @summary Specify event handlers for this template.                                                                  // 261
 * @locus Client                                                                                                       // 262
 * @param {EventMap} eventMap Event handlers to associate with this template.                                          // 263
 */                                                                                                                    // 264
Template.prototype.events = function (eventMap) {                                                                      // 265
  var template = this;                                                                                                 // 266
  var eventMap2 = {};                                                                                                  // 267
  for (var k in eventMap) {                                                                                            // 268
    eventMap2[k] = (function (k, v) {                                                                                  // 269
      return function (event/*, ...*/) {                                                                               // 270
        var view = this; // passed by EventAugmenter                                                                   // 271
        var data = Blaze.getData(event.currentTarget);                                                                 // 272
        if (data == null)                                                                                              // 273
          data = {};                                                                                                   // 274
        var args = Array.prototype.slice.call(arguments);                                                              // 275
        var tmplInstance = view.templateInstance();                                                                    // 276
        args.splice(1, 0, tmplInstance);                                                                               // 277
        return v.apply(data, args);                                                                                    // 278
      };                                                                                                               // 279
    })(k, eventMap[k]);                                                                                                // 280
  }                                                                                                                    // 281
                                                                                                                       // 282
  template.__eventMaps.push(eventMap2);                                                                                // 283
};                                                                                                                     // 284
                                                                                                                       // 285
/**                                                                                                                    // 286
 * @function                                                                                                           // 287
 * @name instance                                                                                                      // 288
 * @memberOf Template                                                                                                  // 289
 * @summary The [template instance](#template_inst) corresponding to the current template helper, event handler, callback, or autorun.  If there isn't one, `null`.
 * @locus Client                                                                                                       // 291
 * @returns Blaze.TemplateInstance                                                                                     // 292
 */                                                                                                                    // 293
Template.instance = function () {                                                                                      // 294
  var view = Blaze.currentView;                                                                                        // 295
                                                                                                                       // 296
  while (view && ! view.template)                                                                                      // 297
    view = view.parentView;                                                                                            // 298
                                                                                                                       // 299
  if (! view)                                                                                                          // 300
    return null;                                                                                                       // 301
                                                                                                                       // 302
  return view.templateInstance();                                                                                      // 303
};                                                                                                                     // 304
                                                                                                                       // 305
// Note: Template.currentData() is documented to take zero arguments,                                                  // 306
// while Blaze.getData takes up to one.                                                                                // 307
                                                                                                                       // 308
/**                                                                                                                    // 309
 * @summary Returns the data context of the current helper, or the data context of the template that declares the current event handler or callback.  Establishes a reactive dependency on the result.
 * @locus Client                                                                                                       // 311
 * @function                                                                                                           // 312
 */                                                                                                                    // 313
Template.currentData = Blaze.getData;                                                                                  // 314
                                                                                                                       // 315
/**                                                                                                                    // 316
 * @summary Accesses other data contexts that enclose the current data context.                                        // 317
 * @locus Client                                                                                                       // 318
 * @function                                                                                                           // 319
 * @param {Integer} [numLevels] The number of levels beyond the current data context to look. Defaults to 1.           // 320
 */                                                                                                                    // 321
Template.parentData = Blaze._parentData;                                                                               // 322
                                                                                                                       // 323
/**                                                                                                                    // 324
 * @summary Defines a [helper function](#template_helpers) which can be used from all templates.                       // 325
 * @locus Client                                                                                                       // 326
 * @function                                                                                                           // 327
 * @param {String} name The name of the helper function you are defining.                                              // 328
 * @param {Function} function The helper function itself.                                                              // 329
 */                                                                                                                    // 330
Template.registerHelper = Blaze.registerHelper;                                                                        // 331
                                                                                                                       // 332
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/blaze/backcompat.js                                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
UI = Blaze;                                                                                                            // 1
                                                                                                                       // 2
Blaze.ReactiveVar = ReactiveVar;                                                                                       // 3
UI._templateInstance = Blaze.Template.instance;                                                                        // 4
                                                                                                                       // 5
Handlebars = {};                                                                                                       // 6
Handlebars.registerHelper = Blaze.registerHelper;                                                                      // 7
                                                                                                                       // 8
Handlebars._escape = Blaze._escape;                                                                                    // 9
                                                                                                                       // 10
// Return these from {{...}} helpers to achieve the same as returning                                                  // 11
// strings from {{{...}}} helpers                                                                                      // 12
Handlebars.SafeString = function(string) {                                                                             // 13
  this.string = string;                                                                                                // 14
};                                                                                                                     // 15
Handlebars.SafeString.prototype.toString = function() {                                                                // 16
  return this.string.toString();                                                                                       // 17
};                                                                                                                     // 18
                                                                                                                       // 19
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.blaze = {
  Blaze: Blaze,
  UI: UI,
  Handlebars: Handlebars
};

})();
