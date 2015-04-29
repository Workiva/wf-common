library wCommon.test;

// Testing imports
import 'package:guinness/guinness.dart';
import 'package:unittest/html_enhanced_config.dart';


// Testing dependencies
import 'dart:async';
import 'dart:js';
import 'package:wCommon/wCommon.dart';

class MockJsObject extends SpyObject {}

main() {

  useHtmlEnhancedConfiguration();

  var observable;
  var jsObservable;

  describe('Observable', () {
    beforeEach(() {
      jsObservable = new MockJsObject();

      observable = new Observable(jsObservable);
    });

    it('should return a stream for the stream property', () {
      expect(observable.stream).toBeA(Stream);
    });

    it('should proxy calls to the dispatch method down to the jsObservable', () {
      var params = [];
      var callback = () {};
      observable.dispatch(params, callback);

      expect(jsObservable.spy('callMethod')).toHaveBeenCalled();
    });

  });
}
