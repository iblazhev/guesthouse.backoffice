import 'package:flutter/material.dart';
import '../l10n/app_localizations.dart';
import '../services/requests_service.dart';
import '../widgets/monthly_calendar.dart';
import './add_reservation_screen.dart';

class ReservationsScreen extends StatefulWidget {
  final String accessToken;
  const ReservationsScreen({super.key, required this.accessToken});

  @override
  State<ReservationsScreen> createState() => _ReservationsScreenState();
}

class _ReservationsScreenState extends State<ReservationsScreen> {
  final _requests = RequestsService();
  late Future<List<BookingRequest>> _future;
  final _scrollController = ScrollController();
  final List<GlobalKey> _monthKeys = List.generate(12, (_) => GlobalKey());
  bool _scrolledToCurrent = false;

  @override
  void initState() {
    super.initState();
    _future = _requests.getRequests(widget.accessToken);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _openCreateReservation() async {
    final saved = await Navigator.of(context).push<bool>(
      MaterialPageRoute(
        builder: (_) => AddReservationScreen(accessToken: widget.accessToken),
        fullscreenDialog: true,
      ),
    );

    if (saved == true && mounted) {
      setState(() {
        _future = _requests.getRequests(widget.accessToken);
        _scrolledToCurrent = false; // allow re-scroll after refresh
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();

    return Scaffold(
      appBar: AppBar(title: Text(AppLocalizations.of(context)!.translate('reservations'))),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _openCreateReservation,
        icon: const Icon(Icons.add),
        label: Text(AppLocalizations.of(context)!.translate('newReservation')),
      ),
      body: FutureBuilder<List<BookingRequest>>(
        future: _future,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(AppLocalizations.of(context)!.translate('errorLoadingRequests')),
                    const SizedBox(height: 8),
                    Text(snapshot.error.toString(), textAlign: TextAlign.center),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () => setState(() {
                        _future = _requests.getRequests(widget.accessToken);
                      }),
                      child: Text(AppLocalizations.of(context)!.translate('tryAgain')),
                    ),
                  ],
                ),
              ),
            );
          }

          final reservations = (snapshot.data ?? const <BookingRequest>[])
              .map((r) {
            final start = DateTime.parse(r.startDate).toLocal();
            final end = DateTime.parse(r.endDate).toLocal();
            return DateTimeRange(
              start: DateTime(start.year, start.month, start.day),
              end: DateTime(end.year, end.month, end.day),
            );
          }).toList();

          // Build all months Jan -> Dec for the current year
          final year = now.year;
          final monthWidgets = List<Widget>.generate(12, (i) {
            final m = i + 1;
            return Padding(
              key: _monthKeys[i],
              padding: const EdgeInsets.only(bottom: 16),
              child: MonthlyCalendar(
                year: year,
                month: m,
                reservations: reservations,
                reservationColor: Colors.lightGreenAccent.shade200,
              ),
            );
          });

          // After first successful build, scroll current month into view
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (!_scrolledToCurrent) {
              final ctx = _monthKeys[now.month - 1].currentContext;
              if (ctx != null) {
                Scrollable.ensureVisible(
                  ctx,
                  alignment: 0.0, // align to top
                  duration: const Duration(milliseconds: 300),
                );
                _scrolledToCurrent = true;
              }
            }
          });

          return SingleChildScrollView(
            controller: _scrollController,
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child: Column(children: monthWidgets),
            ),
          );
        },
      ),
    );
  }
}
