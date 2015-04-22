part of wCommon;

class JsObservableProxy {

  JsFunction _jsObservable; // the Observable instance in JS land

  JsObservableProxy(JsFunction this._jsObservable);

// TODO Future: Allow creating a new JS observable
// Requires the JS Observable constructor on window somewhere
//  JsObservableProxy([scope]) {
//    _jsObservable = new JsObject(context['Observable'], [
//      scope != null ? new JsObject.jsify(scope) : null
//    ]);
//  }


  add(Function fn) {
    _jsObservable.apply([fn]);
  }

  remove(Function fn) {
    _jsObservable.callMethod('remove', [fn]);
  }

  dispatch([List<Object> parameters, Function observed]) {
    _jsObservable.callMethod('dispatch', [
      parameters != null ? new JsObject.jsify(parameters) : [],
      observed
      ]);
  }
}