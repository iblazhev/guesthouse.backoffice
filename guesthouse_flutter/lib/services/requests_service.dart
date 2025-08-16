import 'dart:convert';
import 'package:http/http.dart' as http;
import '../common/api_base.dart';

class BookingRequest {
  final int? id;
  final String name;
  final String email;
  final String phone;
  final String startDate; // ISO string
  final String endDate; // ISO string
  final int peopleCount;
  final int adultsCount;
  final int kidsCount;
  final String city;
  final String comments;
  final bool approved;
  final DateTime? approvedAt;
  final DateTime createdAt;

  BookingRequest({
    this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.startDate,
    required this.endDate,
    required this.peopleCount,
    required this.adultsCount,
    required this.kidsCount,
    required this.city,
    required this.comments,
    required this.approved,
    this.approvedAt,
    required this.createdAt,
  });

  factory BookingRequest.fromJson(Map<String, dynamic> json) => BookingRequest(
        id: json['id'] as int?,
        name: json['name'] as String,
        email: json['email'] as String,
        phone: json['phone'] as String,
        startDate: json['startDate'] as String,
        endDate: json['endDate'] as String,
        peopleCount: (json['peopleCount'] as num).toInt(),
        adultsCount: (json['adultsCount'] as num).toInt(),
        kidsCount: (json['kidsCount'] as num).toInt(),
        city: json['city'] as String,
        comments: json['comments'] as String,
        approved: json['approved'] as bool,
        approvedAt: json['approvedAt'] != null
            ? DateTime.tryParse(json['approvedAt'].toString())
            : null,
        createdAt: DateTime.parse(json['createdAt'].toString()),
      );
}

class RequestsService {
  final String baseUrl;
  RequestsService({String? baseUrl}) : baseUrl = baseUrl ?? defaultBaseUrl();

  Future<List<BookingRequest>> getRequests(String accessToken) async {
    final uri = Uri.parse('$baseUrl/requests');
    final resp = await http.get(
      uri,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    ).timeout(const Duration(seconds: 15));

    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      final data = jsonDecode(resp.body);
      if (data is List) {
        return data
            .whereType<Map<String, dynamic>>()
            .map((e) => BookingRequest.fromJson(e))
            .toList();
      }
      if (data is Map<String, dynamic> && data['items'] is List) {
        return (data['items'] as List)
            .whereType<Map<String, dynamic>>()
            .map((e) => BookingRequest.fromJson(e))
            .toList();
      }
      throw const FormatException('Unexpected response shape for /requests');
    }

    String message = 'Error ${resp.statusCode}';
    try {
      final err = jsonDecode(resp.body);
      if (err is Map && err['message'] != null) message = err['message'].toString();
    } catch (_) {}
    throw Exception(message);
  }

  // New: DTO for creating a booking request
  Map<String, dynamic> createRequestBody({
    required String name,
    required String email,
    required String phone,
    required DateTime startDate,
    required DateTime endDate,
    required int peopleCount,
    required int adultsCount,
    required int kidsCount,
    required String city,
    required String comments,
    bool approved = false,
  }) {
    return {
      'name': name,
      'email': email,
      'phone': phone,
      'startDate': startDate.toUtc().toIso8601String(),
      'endDate': endDate.toUtc().toIso8601String(),
      'peopleCount': peopleCount,
      'adultsCount': adultsCount,
      'kidsCount': kidsCount,
      'city': city,
      'comments': comments,
      'approved': approved,
    };
  }

  // New: POST /requests
  Future<BookingRequest> createRequest({
    required String accessToken,
    required Map<String, dynamic> body,
  }) async {
    final uri = Uri.parse('$baseUrl/requests');
    final resp = await http
        .post(
          uri,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer $accessToken',
          },
          body: jsonEncode(body),
        )
        .timeout(const Duration(seconds: 15));

    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      final data = jsonDecode(resp.body);
      if (data is Map<String, dynamic>) {
        return BookingRequest.fromJson(data);
      }
      throw const FormatException('Unexpected response for create /requests');
    }

    String message = 'Error ${resp.statusCode}';
    try {
      final err = jsonDecode(resp.body);
      if (err is Map && err['message'] != null) message = err['message'].toString();
    } catch (_) {}
    throw Exception(message);
  }
}
