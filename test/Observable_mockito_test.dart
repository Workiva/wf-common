library wCommon.test;

// This is a working example of Dart unit tests using the mockito mocking library and unittest for
// assertions.  It tests the same functionality as Observable_stock_test.dart.

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

      // This should be matching the arguments, but it is not.  Bug in Mockito?
      verify(jsObservable.callMethod('dispatch', [params, callback])).called(1);
    });
  });
}
