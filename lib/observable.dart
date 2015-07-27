part of wCommon;

class Observable {
  JsFunction _jsObservable; // the Observable instance in JS land
  StreamController _streamController = new StreamController.broadcast();

  Observable(JsFunction this._jsObservable) {
    _add(_addToStream);
  }

  Stream get stream {
    return _streamController.stream;
  }

  void _add(Function callback) {
    // The jsObservable is an object that also works as a function.  So, we are calling the jsObservable as a
    // function, and passing in the callback to that function.  See the Observable.js file.
    _jsObservable.apply([callback]);
  }

  void _remove(Function callback) {
    _jsObservable.callMethod('remove', [callback]);
  }

  void dispatch([List<Object> parameters, Function observed]) {
    _jsObservable.callMethod(
        'dispatch',
        [parameters != null ? new JsObject.jsify(parameters) : [], observed]);
  }

  void _addToStream([a, b, c, d, e, f, g, h, i, j, k]) {
    List params = [];
    List vars = [];
    bool found = false;

    params.addAll([a, b, c, d, e, f, g, h, i, j, k]);

    params.reversed.forEach((p) {
      if (p != null || found) {
        vars.add(p);
        found = true;
      }
    });
    _streamController.add(vars.reversed);
  }
}
