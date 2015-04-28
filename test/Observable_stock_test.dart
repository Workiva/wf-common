library wCommon.test;

// Testing imports
import 'package:unittest/unittest.dart';
import 'package:mock/mock.dart';
import 'package:unittest/html_enhanced_config.dart';

// Testing dependencies
import 'dart:async';
import 'dart:js';
import 'package:wCommon/wCommon.dart';

class MockJsObject extends Mock implements JsObject {}

main() {

  useHtmlEnhancedConfiguration();

  var observable;
  MockJsObject jsObservable;

  group('Observable', () {

    setUp(() {
      jsObservable = new MockJsObject();

      observable = new Observable(jsObservable);
    });

    test('it should return a stream for the stream property', () {
      var stream = observable.stream;

      expect(stream, new isInstanceOf<Stream>() );
    });

    test('it should proxy calls to the dispatch method down to the jsObservable', () {
      var params = [];
      var callback = () {};
      var mockReturnValue = 'dispatch called';
      jsObservable.when(callsTo('callMethod', 'dispatch')).alwaysReturn(mockReturnValue);

      observable.dispatch(params, callback);

      jsObservable.getLogs(callsTo('callMethod'), returning(mockReturnValue)).verify(happenedExactly(1));
    });
  });
}