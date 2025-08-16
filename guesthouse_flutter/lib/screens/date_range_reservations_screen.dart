import 'package:flutter/material.dart';
import '../services/requests_service.dart';

class DateRangeReservationsScreen extends StatefulWidget {
  final String accessToken;
  const DateRangeReservationsScreen({super.key, required this.accessToken});

  @override
  State<DateRangeReservationsScreen> createState() => _DateRangeReservationsScreenState();
}

class _DateRangeReservationsScreenState extends State<DateRangeReservationsScreen> {
  final _requests = RequestsService();
  DateTime? _from;
  DateTime? _to;
  Future<List<BookingRequest>>? _future;
  bool _searchedOnce = false;

  String _fmt(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  Future<void> _pickFrom() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _from ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
    );
    if (picked != null) {
      setState(() {
        _from = picked;
        if (_to != null && _to!.isBefore(_from!)) {
          _to = _from;
        }
      });
    }
  }

  Future<void> _pickTo() async {
    final base = _from ?? DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _to ?? base,
      firstDate: _from ?? DateTime(2000),
      lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
    );
    if (picked != null) {
      setState(() => _to = picked);
    }
  }

  void _search() {
    setState(() {
      _searchedOnce = true;
      _future = _requests.getRequests(
        widget.accessToken,
        from: _from,
        to: _to,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Резервации от до')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _pickFrom,
                      icon: const Icon(Icons.date_range),
                      label: Text(_from == null ? 'От дата' : _fmt(_from!)),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _pickTo,
                      icon: const Icon(Icons.event),
                      label: Text(_to == null ? 'До дата' : _fmt(_to!)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _search,
                      icon: const Icon(Icons.search),
                      label: const Text('Търси'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    tooltip: 'Изчисти',
                    onPressed: () {
                      setState(() {
                        _from = null;
                        _to = null;
                        _future = null;
                        _searchedOnce = false;
                      });
                    },
                    icon: const Icon(Icons.clear),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Expanded(
                child: _future == null
                    ? Center(
                        child: Text(
                          _searchedOnce
                              ? 'Няма резултати за избрания период'
                              : 'Изберете период и натиснете „Търси“',
                          textAlign: TextAlign.center,
                        ),
                      )
                    : FutureBuilder<List<BookingRequest>>(
                        future: _future,
                        builder: (context, snapshot) {
                          if (snapshot.connectionState == ConnectionState.waiting) {
                            return const Center(child: CircularProgressIndicator());
                          }
                          if (snapshot.hasError) {
                            return Center(
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Text(snapshot.error.toString(), textAlign: TextAlign.center),
                              ),
                            );
                          }
                          final items = snapshot.data ?? const <BookingRequest>[];
                          if (items.isEmpty) {
                            return const Center(child: Text('Няма резултати'));
                          }
                          return ListView.separated(
                            itemCount: items.length,
                            separatorBuilder: (_, __) => const Divider(height: 1),
                            itemBuilder: (context, i) {
                              final r = items[i];
                              final start = DateTime.parse(r.startDate).toLocal();
                              final end = DateTime.parse(r.endDate).toLocal();
                              return ListTile(
                                leading: const Icon(Icons.event_available, color: Colors.green),
                                title: Text(r.name),
                                subtitle: Text(
                                  '${_fmt(start)} → ${_fmt(end)}'
                                  '${r.city.isNotEmpty ? ' · ${r.city}' : ''}'
                                  '${r.phone.isNotEmpty ? ' · ${r.phone}' : ''}',
                                ),
                                trailing: r.approved
                                    ? const Icon(Icons.check_circle, color: Colors.green)
                                    : const Icon(Icons.hourglass_bottom, color: Colors.orange),
                              );
                            },
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
