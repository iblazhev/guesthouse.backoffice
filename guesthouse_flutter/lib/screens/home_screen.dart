import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'reservations_screen.dart';

class HomeScreen extends StatelessWidget {
  final UserState user;
  const HomeScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Здравей, ${user.username}!'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () {
              Navigator.popUntil(context, (route) => route.isFirst);
            },
          )
        ],
      ),
      body: ListView(
        children: [
          ListTile(
            leading: const Icon(Icons.book_online, color: Colors.blue),
            title: const Text(
              'Резервации',
              style: TextStyle(fontSize: 18),
            ),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ReservationsScreen(accessToken: user.accessToken),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
