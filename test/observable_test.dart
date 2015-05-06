library wCommon.test;

// Testing imports
import 'package:unittest/unittest.dart';
import 'package:mockito/mockito.dart';
import 'package:unittest/html_enhanced_config.dart';

// Testing dependencies
import 'dart:async';
import 'dart:js';
import 'package:wCommon/wCommon.dart';

class MockJsObject extends Mock {}

main() {

  useHtmlEnhancedConfiguration();

  var observable;
  var jsObservable;

  group('Observable', () {

    setUp(() {
      jsObservable = new MockJsObject();

      observable = new Observable(jsObservable);
    });

    test('it should return a stream for the stream property', () {
      var stream = observable.stream;

      expect(stream, new isInstanceOf<Stream>());
    });

    test('it should proxy calls to the dispatch method down to the jsObservable', () {
      var params = [];
      var callback = () {};

      observable.dispatch(params, callback);

      verify(jsObservable.callMethod('dispatch', [params, callback])).called(1);
    });
  });
}
