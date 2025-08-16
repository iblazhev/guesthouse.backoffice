import 'dart:convert';
import 'package:http/http.dart' as http;
import '../common/api_base.dart';

class LoginData {
  final String email;
  final String password;
  const LoginData({required this.email, required this.password});

  Map<String, dynamic> toJson() => {
        'email': email,
        'password': password,
      };
}

class UserState {
  final String username;
  final String accessToken; 
  final int expiresIn;
  final String refreshToken;

  const UserState({
    required this.username,
    required this.accessToken,
    required this.expiresIn,
    required this.refreshToken,
  });

  // Keep factory for direct JSON mapping when API provides all fields
  factory UserState.fromJson(Map<String, dynamic> json) => UserState(
        username: json['username'] as String,
        accessToken: json['accessToken'] as String,
        expiresIn: (json['expiresIn'] as num).toInt(),
        refreshToken: json['refreshToken'] as String,
      );
}

class AuthService {
  final String baseUrl;
  AuthService({String? baseUrl}) : baseUrl = baseUrl ?? defaultBaseUrl();

  String _usernameFromEmail(String email) {
    final at = email.indexOf('@');
    return at > 0 ? email.substring(0, at) : email;
  }

  Future<UserState> login(LoginData data) async {
    final uri = Uri.parse('$baseUrl/login');
    final resp = await http
        .post(
          uri,
          headers: const {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: jsonEncode(data.toJson()),
        )
        .timeout(const Duration(seconds: 15));

    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      final Map<String, dynamic> json = jsonDecode(resp.body) as Map<String, dynamic>;

      // Use username from API if present, otherwise derive from email
      final username = (json['username'] as String?) ?? _usernameFromEmail(data.email);

      // Build UserState manually to allow fallback username
      return UserState(
        username: username,
        accessToken: json['accessToken'] as String,
        expiresIn: (json['expiresIn'] as num).toInt(),
        refreshToken: json['refreshToken'] as String,
      );
    }

    String message = 'Възникна грешка (${resp.statusCode})';
    try {
      final Map<String, dynamic> err = jsonDecode(resp.body) as Map<String, dynamic>;
      message = (err['message'] ?? err['error'] ?? message).toString();
    } catch (_) {}
    throw Exception(message);
  }
}
