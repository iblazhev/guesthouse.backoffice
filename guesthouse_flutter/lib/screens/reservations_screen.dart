import 'package:flutter/material.dart';
import '../services/requests_service.dart';
import '../widgets/monthly_calendar.dart';

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
    final formKey = GlobalKey<FormState>();
    final nameCtrl = TextEditingController();
    final emailCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final peopleCtrl = TextEditingController(text: '2');
    final adultsCtrl = TextEditingController(text: '2');
    final kidsCtrl = TextEditingController(text: '0');
    final cityCtrl = TextEditingController();
    final commentsCtrl = TextEditingController();

    DateTime? start;
    DateTime? end;
    bool saved = false;

    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(ctx).viewInsets.bottom,
            ),
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: StatefulBuilder(
                builder: (ctx, setModalState) {
                  String fmt(DateTime d) => '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
                  return Form(
                    key: formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Нова резервация', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 12),
                        TextFormField(
                          controller: nameCtrl,
                          decoration: const InputDecoration(labelText: 'Име'),
                          validator: (v) => v == null || v.trim().isEmpty ? 'Въведете име' : null,
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: emailCtrl,
                          decoration: const InputDecoration(labelText: 'Имейл'),
                          keyboardType: TextInputType.emailAddress,
                          validator: (v) => v == null || v.trim().isEmpty ? 'Въведете имейл' : null,
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: phoneCtrl,
                          decoration: const InputDecoration(labelText: 'Телефон'),
                          keyboardType: TextInputType.phone,
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                onPressed: () async {
                                  final picked = await showDatePicker(
                                    context: ctx,
                                    initialDate: DateTime.now(),
                                    firstDate: DateTime.now(),
                                    lastDate: DateTime.now().add(const Duration(days: 365)),
                                  );
                                  if (picked != null) setModalState(() => start = picked);
                                },
                                child: Text(start == null ? 'Начална дата' : fmt(start!)),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: OutlinedButton(
                                onPressed: () async {
                                  final picked = await showDatePicker(
                                    context: ctx,
                                    initialDate: start ?? DateTime.now(),
                                    firstDate: start ?? DateTime.now(),
                                    lastDate: DateTime.now().add(const Duration(days: 365)),
                                  );
                                  if (picked != null) setModalState(() => end = picked);
                                },
                                child: Text(end == null ? 'Крайна дата' : fmt(end!)),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: TextFormField(
                                controller: peopleCtrl,
                                decoration: const InputDecoration(labelText: 'Хора'),
                                keyboardType: TextInputType.number,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: TextFormField(
                                controller: adultsCtrl,
                                decoration: const InputDecoration(labelText: 'Възрастни'),
                                keyboardType: TextInputType.number,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: TextFormField(
                                controller: kidsCtrl,
                                decoration: const InputDecoration(labelText: 'Деца'),
                                keyboardType: TextInputType.number,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: cityCtrl,
                          decoration: const InputDecoration(labelText: 'Град'),
                        ),
                        const SizedBox(height: 8),
                        TextFormField(
                          controller: commentsCtrl,
                          decoration: const InputDecoration(labelText: 'Коментар'),
                          maxLines: 3,
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () async {
                                  if (!formKey.currentState!.validate()) return;
                                  if (start == null || end == null) {
                                    ScaffoldMessenger.of(ctx).showSnackBar(
                                      const SnackBar(content: Text('Изберете начална и крайна дата')),
                                    );
                                    return;
                                  }
                                  final body = _requests.createRequestBody(
                                    name: nameCtrl.text.trim(),
                                    email: emailCtrl.text.trim(),
                                    phone: phoneCtrl.text.trim(),
                                    startDate: DateTime(start!.year, start!.month, start!.day),
                                    endDate: DateTime(end!.year, end!.month, end!.day),
                                    peopleCount: int.tryParse(peopleCtrl.text) ?? 1,
                                    adultsCount: int.tryParse(adultsCtrl.text) ?? 1,
                                    kidsCount: int.tryParse(kidsCtrl.text) ?? 0,
                                    city: cityCtrl.text.trim(),
                                    comments: commentsCtrl.text.trim(),
                                    approved: false,
                                  );
                                  try {
                                    await _requests.createRequest(
                                      accessToken: widget.accessToken,
                                      body: body,
                                    );
                                    saved = true;
                                    if (context.mounted) Navigator.of(ctx).pop(true);
                                  } catch (e) {
                                    ScaffoldMessenger.of(ctx).showSnackBar(
                                      SnackBar(content: Text(e.toString())),
                                    );
                                  }
                                },
                                child: const Text('Запази'),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: OutlinedButton(
                                onPressed: () => Navigator.of(ctx).pop(false),
                                child: const Text('Отказ'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
        );
      },
    );

    // Dispose controllers
    nameCtrl.dispose();
    emailCtrl.dispose();
    phoneCtrl.dispose();
    peopleCtrl.dispose();
    adultsCtrl.dispose();
    kidsCtrl.dispose();
    cityCtrl.dispose();
    commentsCtrl.dispose();

    // Refresh list if saved
    if (saved) {
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
      appBar: AppBar(title: const Text('Резервации')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _openCreateReservation,
        icon: const Icon(Icons.add),
        label: const Text('Нова резервация'),
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
                    const Text('Грешка при зареждане на заявки'),
                    const SizedBox(height: 8),
                    Text(snapshot.error.toString(), textAlign: TextAlign.center),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () => setState(() {
                        _future = _requests.getRequests(widget.accessToken);
                      }),
                      child: const Text('Опитайте отново'),
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
