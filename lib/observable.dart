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

  void _add(Function fn) {
    _jsObservable.apply([fn]);
  }

 void _remove(Function fn) {
   _jsObservable.callMethod('remove', [fn]);
 }

 void dispatch([List<Object> parameters, Function observed]) {
   _jsObservable.callMethod('dispatch', [
     parameters != null ? new JsObject.jsify(parameters) : [],
     observed
   ]);
 }

  void _addToStream([a, b, c, d, e, f, g, h, i, j, k]) {
    List params = [];
    List vars = [];
    bool found = false;

    params.add(a);
    params.add(b);
    params.add(c);
    params.add(d);
    params.add(e);
    params.add(f);
    params.add(g);
    params.add(h);
    params.add(i);
    params.add(j);
    params.add(k);

    params.reversed.forEach( (p) {
      if (p != null || found) {
        vars.add(p);
        found = true;
      }
    });
    _streamController.add(vars);
  }
}
