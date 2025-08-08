import 'package:flutter/material.dart';

class MonthlyCalendar extends StatelessWidget {
  final int year;
  final int month; // 1-12
  final List<DateTimeRange> reservations;
  final Color reservationColor;
  final EdgeInsetsGeometry padding;
  final bool showHeader;
  final bool showWeekdayHeaders;

  const MonthlyCalendar({
    super.key,
    required this.year,
    required this.month,
    this.reservations = const [],
    this.reservationColor = const Color(0xFF90CAF9),
    this.padding = const EdgeInsets.all(8),
    this.showHeader = true,
    this.showWeekdayHeaders = true,
  });

  DateTime _dateOnly(DateTime d) => DateTime(d.year, d.month, d.day);

  @override
  Widget build(BuildContext context) {
    final firstDayOfMonth = DateTime(year, month, 1);
    final lastDayOfMonth = DateTime(year, month + 1, 0);

    // Make a set of reserved dates (normalized to date-only), end treated as exclusive
    final reservedDays = <DateTime>{};
    for (final range in reservations) {
      var d = _dateOnly(range.start);
      final endExcl = _dateOnly(range.end);
      while (d.isBefore(endExcl)) {
        reservedDays.add(d);
        d = d.add(const Duration(days: 1));
      }
    }

    // Start on Monday of the first week containing the 1st
    final int firstWeekday = firstDayOfMonth.weekday; // Mon=1..Sun=7
    final startDate = firstDayOfMonth.subtract(Duration(days: firstWeekday - 1));

    const weekdayLabelsBg = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
    const monthNamesBg = [
      'Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни',
      'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'
    ];

    return Padding(
      padding: padding,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (showHeader)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child: Text(
                '${monthNamesBg[month - 1]} $year',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ),
          if (showWeekdayHeaders)
            Row(
              children: List.generate(7, (index) {
                final isWeekend = index >= 5; // Sat, Sun
                return Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 6.0),
                    child: Text(
                      weekdayLabelsBg[index],
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        color: isWeekend ? Colors.redAccent : Colors.grey[700],
                      ),
                    ),
                  ),
                );
              }),
            ),
          // 6 rows x 7 columns (42 cells)
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 42,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              mainAxisSpacing: 6,
              crossAxisSpacing: 6,
            ),
            itemBuilder: (context, index) {
              final date = startDate.add(Duration(days: index));
              final inMonth = date.month == month && date.isAfter(firstDayOfMonth.subtract(const Duration(days: 1))) && date.isBefore(lastDayOfMonth.add(const Duration(days: 1)));
              final isReserved = reservedDays.contains(_dateOnly(date));

              final bgColor = isReserved
                  ? reservationColor
                  : (inMonth ? Colors.white : Colors.grey[200]);

              final borderColor = isReserved
                  ? reservationColor
                  : Colors.grey.withOpacity(0.3);

              return Container
                (
                decoration: BoxDecoration(
                  color: bgColor,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: borderColor),
                ),
                child: Align(
                  alignment: Alignment.topRight,
                  child: Padding(
                    padding: const EdgeInsets.all(6.0),
                    child: Text(
                      '${date.day}',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: inMonth ? Colors.black87 : Colors.grey,
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
          // Legend
          Padding(
            padding: const EdgeInsets.only(top: 8.0),
            child: Row(
              children: [
                Container(
                  width: 14,
                  height: 14,
                  decoration: BoxDecoration(
                    color: reservationColor,
                    borderRadius: BorderRadius.circular(3),
                    border: Border.all(color: reservationColor),
                  ),
                ),
                const SizedBox(width: 6),
                const Text('Резервация'),
              ],
            ),
          )
        ],
      ),
    );
  }
}
