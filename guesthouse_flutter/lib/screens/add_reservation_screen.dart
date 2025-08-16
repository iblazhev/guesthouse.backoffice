import 'package:flutter/material.dart';
import '../services/requests_service.dart';

class AddReservationScreen extends StatefulWidget {
  final String accessToken;
  const AddReservationScreen({super.key, required this.accessToken});

  @override
  State<AddReservationScreen> createState() => _AddReservationScreenState();
}

class _AddReservationScreenState extends State<AddReservationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _peopleCtrl = TextEditingController(text: '2');
  final _adultsCtrl = TextEditingController(text: '2');
  final _kidsCtrl = TextEditingController(text: '0');
  final _cityCtrl = TextEditingController();
  final _commentsCtrl = TextEditingController();

  DateTime? _start;
  DateTime? _end;
  bool _saving = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _peopleCtrl.dispose();
    _adultsCtrl.dispose();
    _kidsCtrl.dispose();
    _cityCtrl.dispose();
    _commentsCtrl.dispose();
    super.dispose();
  }

  String _fmt(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    if (_start == null || _end == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Изберете начална и крайна дата')),
      );
      return;
    }
    setState(() => _saving = true);

    final service = RequestsService();
    final body = service.createRequestBody(
      name: _nameCtrl.text.trim(),
      email: _emailCtrl.text.trim(),
      phone: _phoneCtrl.text.trim(),
      startDate: DateTime(_start!.year, _start!.month, _start!.day),
      endDate: DateTime(_end!.year, _end!.month, _end!.day),
      peopleCount: int.tryParse(_peopleCtrl.text) ?? 1,
      adultsCount: int.tryParse(_adultsCtrl.text) ?? 1,
      kidsCount: int.tryParse(_kidsCtrl.text) ?? 0,
      city: _cityCtrl.text.trim(),
      comments: _commentsCtrl.text.trim(),
      approved: false,
    );

    try {
      await service.createRequest(
        accessToken: widget.accessToken,
        body: body,
      );
      if (mounted) Navigator.of(context).pop(true);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
      setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Нова резервация'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextFormField(
                  controller: _nameCtrl,
                  decoration: const InputDecoration(labelText: 'Име'),
                  validator: (v) =>
                      v == null || v.trim().isEmpty ? 'Въведете име' : null,
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _emailCtrl,
                  decoration: const InputDecoration(labelText: 'Имейл'),
                  keyboardType: TextInputType.emailAddress,
                  validator: (v) =>
                      v == null || v.trim().isEmpty ? 'Въведете имейл' : null,
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _phoneCtrl,
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
                            context: context,
                            initialDate: DateTime.now(),
                            firstDate: DateTime.now(),
                            lastDate: DateTime.now().add(const Duration(days: 365)),
                          );
                          if (picked != null) setState(() => _start = picked);
                        },
                        child: Text(
                            _start == null ? 'Начална дата' : _fmt(_start!)),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () async {
                          final picked = await showDatePicker(
                            context: context,
                            initialDate: _start ?? DateTime.now(),
                            firstDate: _start ?? DateTime.now(),
                            lastDate: DateTime.now().add(const Duration(days: 365)),
                          );
                          if (picked != null) setState(() => _end = picked);
                        },
                        child:
                            Text(_end == null ? 'Крайна дата' : _fmt(_end!)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _peopleCtrl,
                        decoration: const InputDecoration(labelText: 'Хора'),
                        keyboardType: TextInputType.number,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextFormField(
                        controller: _adultsCtrl,
                        decoration: const InputDecoration(labelText: 'Възрастни'),
                        keyboardType: TextInputType.number,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextFormField(
                        controller: _kidsCtrl,
                        decoration: const InputDecoration(labelText: 'Деца'),
                        keyboardType: TextInputType.number,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _cityCtrl,
                  decoration: const InputDecoration(labelText: 'Град'),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _commentsCtrl,
                  decoration: const InputDecoration(labelText: 'Коментар'),
                  maxLines: 3,
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        onPressed: _saving ? null : _save,
                        child: const Text('Запази'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _saving
                            ? null
                            : () => Navigator.of(context).pop(false),
                        child: const Text('Отказ'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
