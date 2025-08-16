import 'dart:io';

/// Returns the default API base URL depending on the platform.
/// Android emulators use 10.0.2.2 to access host machine localhost.
String defaultBaseUrl() {
  if (Platform.isAndroid) return 'http://10.0.2.2:5005';
  return 'http://localhost:5005';
}
