part of wCommon;

class Observable {

  JsFunction _jsObservable; // the Observable instance in JS land

  Observable(JsFunction this._jsObservable);

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
