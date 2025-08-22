import 'package:flutter/material.dart';
import '../l10n/app_localizations.dart';
import '../services/auth_service.dart';
import '../main.dart';
import 'reservations_screen.dart';
import 'date_range_reservations_screen.dart';

class HomeScreen extends StatelessWidget {
  final UserState user;
  const HomeScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${AppLocalizations.of(context)!.translate('hello')}, ${user.username}!'),
        actions: [
          IconButton(
            icon: const Icon(Icons.language),
            tooltip: AppLocalizations.of(context)!.translate('switchLanguage'),
            onPressed: () {
              final current = Localizations.localeOf(context).languageCode;
              final next = current == 'bg' ? const Locale('en') : const Locale('bg');
              MyApp.of(context)?.setLocale(next);
            },
          ),
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
            title: Text(
              AppLocalizations.of(context)!.translate('reservations'),
              style: const TextStyle(fontSize: 18),
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
          ListTile(
            leading: const Icon(Icons.date_range, color: Colors.blue),
            title: Text(
              AppLocalizations.of(context)!.translate('reservationsFromTo'),
              style: const TextStyle(fontSize: 18),
            ),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => DateRangeReservationsScreen(accessToken: user.accessToken),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
