import 'package:flutter/material.dart';
import '../l10n/app_localizations.dart';
import '../services/requests_service.dart';

class DateRangeReservationsScreen extends StatefulWidget {
  final String accessToken;
  const DateRangeReservationsScreen({super.key, required this.accessToken});

  @override
  State<DateRangeReservationsScreen> createState() => _DateRangeReservationsScreenState();
}

class _DateRangeReservationsScreenState extends State<DateRangeReservationsScreen> {
  final _requests = RequestsService();
  final List<DateTimeRange> _ranges = [];
  Future<List<BookingRequest>>? _future;
  bool _searchedOnce = false;

  String _fmt(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  DateTime _atMidnight(DateTime d) => DateTime(d.year, d.month, d.day);

  Future<void> _addRange() async {
    final initialStart = DateTime.now();
    final initialEnd = initialStart.add(const Duration(days: 1));
    final initial = _ranges.isNotEmpty
        ? _ranges.last
        : DateTimeRange(start: initialStart, end: initialEnd);

    final picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2000),
      lastDate: DateTime.now().add(const Duration(days: 365 * 2)),
      initialDateRange: initial,
      saveText: AppLocalizations.of(context)!.translate('select'),
      helpText: AppLocalizations.of(context)!.translate('choosePeriod'),
      builder: (ctx, child) => child ?? const SizedBox.shrink(),
    );

    if (picked != null) {
      // Normalize to midnight for both boundaries
      final start = _atMidnight(picked.start);
      final end = _atMidnight(picked.end);
      setState(() {
        _ranges.add(DateTimeRange(start: start, end: end));
      });
    }
  }

  void _removeRange(int index) {
    setState(() {
      _ranges.removeAt(index);
    });
  }

  Future<List<BookingRequest>> _fetchForRanges() async {
    // If no ranges, return empty list to prompt user to add some
    if (_ranges.isEmpty) return <BookingRequest>[];

    final List<BookingRequest> combined = [];
    final ids = <int>{};
    final fallbacks = <String>{};

    for (final r in _ranges) {
      final results = await _requests.getRequests(
        widget.accessToken,
        from: r.start,
        to: r.end,
      );
      for (final br in results) {
        if (br.id != null) {
          if (ids.add(br.id!)) {
            combined.add(br);
          }
        } else {
          // Fallback uniqueness by name + start + end
          final key = '${br.name}-${br.startDate}-${br.endDate}';
          if (fallbacks.add(key)) {
            combined.add(br);
          }
        }
      }
    }
    return combined;
  }

  void _search() {
    setState(() {
      _searchedOnce = true;
      _future = _fetchForRanges();
    });
  }

  void _clear() {
    setState(() {
      _ranges.clear();
      _future = null;
      _searchedOnce = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(AppLocalizations.of(context)!.translate('reservationsFromTo'))),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _addRange,
                      icon: const Icon(Icons.date_range),
                      label: Text(AppLocalizations.of(context)!.translate('addPeriod')),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    tooltip: AppLocalizations.of(context)!.translate('clear'),
                    onPressed: _clear,
                    icon: const Icon(Icons.clear),
                  ),
                ],
              ),
              if (_ranges.isNotEmpty) ...[
                const SizedBox(height: 12),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 4,
                    children: List.generate(_ranges.length, (i) {
                      final r = _ranges[i];
                      final label = '${_fmt(r.start)} → ${_fmt(r.end)}';
                      return Chip(
                        label: Text(label),
                        deleteIcon: const Icon(Icons.close),
                        onDeleted: () => _removeRange(i),
                      );
                    }),
                  ),
                ),
              ],
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _search,
                      icon: const Icon(Icons.search),
                      label: Text(AppLocalizations.of(context)!.translate('search')),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Expanded(
                child: _future == null
                    ? Center(
                        child: Text(
                          _searchedOnce
                              ? AppLocalizations.of(context)!.translate('noResultsForSelectedRanges')
                              : AppLocalizations.of(context)!.translate('addRangesTip'),
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
                            return Center(child: Text(AppLocalizations.of(context)!.translate('noResults')));
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
