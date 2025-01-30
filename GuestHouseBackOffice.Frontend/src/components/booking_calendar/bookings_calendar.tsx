import { Calendar, CalendarProps, Col, Radio, Row, Select } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import { numberToLightColor } from "../../utils/helpers.ts";
import styles from "./booking_calendar.module.scss";
import { RadioChangeEvent } from "antd/lib";
import { HeaderRender } from "antd/es/calendar/generateCalendar";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/bg";
import { BookingRequest } from "../../types/bookingRequest.ts";

dayjs.locale("bg");

interface BookingsCalendarProps {
  requests: BookingRequest[];
  onClick: (requests: BookingRequest[]) => void;
}

export default function BookingsCalendar({
  requests,
  onClick,
}: BookingsCalendarProps) {
  dayjs.extend(isBetween);
  dayjs.extend(utc);
  dayjs.extend(updateLocale);
  dayjs.updateLocale("en", {
    weekStart: 1,
  });
  const months = [
    "Януари",
    "Февруари",
    "Март",
    "Април",
    "Май",
    "Юни",
    "Юли",
    "Август",
    "Септември",
    "Октомври",
    "Ноември",
    "Декември",
  ];

  const monthCellRender = (value: Dayjs) => {
    if (value) {
      const monthIndex = value.month();
      return (
        <div className="notes-month">
          <section>{monthIndex + 1}</section>
          <span>{months[monthIndex]}</span>
        </div>
      );
    } else {
      return null;
    }
  };

  const dateCellRender = (value: Dayjs) => {
    const valueCompare = value.utc();
    const requestsFound = requests.filter((x) => {
      const startDate = dayjs.utc(x.startDate);
      const endDate = dayjs.utc(x.endDate);
      if (valueCompare.isBetween(startDate, endDate, "date", "[]")) {
        return true;
      }
      return false;
    });

    if (requestsFound.length > 0) {
      if (requestsFound.length === 2) {
        const dateOne = dayjs(requestsFound[0].startDate);
        const dateTwo = dayjs(requestsFound[1].startDate);
        const isFirstIndex = dateOne.isBefore(dateTwo);
        const colorOne = numberToLightColor(
          requestsFound[isFirstIndex ? 0 : 1].id ?? 0,
        );
        const colorTwo = numberToLightColor(
          requestsFound[isFirstIndex ? 1 : 0].id ?? 0,
        );
        return (
          <div
            className={styles.bookingCellSplit}
            style={
              {
                "--color1": colorOne,
                "--color2": colorTwo,
              } as React.CSSProperties
            }
          >
            <div
              className={styles.bookingDay}
              onClick={() => onClick(requestsFound)}
            >
              {valueCompare.get("date")}
            </div>
          </div>
        );
      } else {
        const color = numberToLightColor(requestsFound[0].id ?? 0);

        const isStart = dayjs
          .utc(requestsFound[0].startDate)
          .isSame(valueCompare, "date");
        const isEnd = dayjs
          .utc(requestsFound[0].endDate)
          .isSame(valueCompare, "date");
        if (isStart || isEnd) {
          return (
            <div
              className={styles.bookingCellSplit}
              style={
                {
                  "--color1": isEnd ? color : undefined,
                  "--color2": isStart ? color : undefined,
                } as React.CSSProperties
              }
            >
              <div
                className={styles.bookingDay}
                onClick={() => onClick(requestsFound)}
              >
                {valueCompare.get("date")}
              </div>
            </div>
          );
        } else {
          return (
            <div
              className={styles.bookingCell}
              style={
                {
                  "--color1": color,
                } as React.CSSProperties
              }
            >
              <div
                className={styles.bookingDay}
                onClick={() => onClick(requestsFound)}
              >
                {valueCompare.get("date")}
              </div>
            </div>
          );
        }
      }
    } else {
      return (
        <div className={styles.bookingCellEmpty}>
          <div
            className={styles.bookingDay}
            onClick={() => onClick(requestsFound)}
          >
            {valueCompare.get("date")}
          </div>
        </div>
      );
    }
  };

  const fullCellRender: CalendarProps<Dayjs>["fullCellRender"] = (
    current,
    info,
  ) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  interface HeaderRenderProps {
    value: Dayjs;
    type: string;
    onChange: (date: Dayjs) => void;
    onTypeChange: (value: string) => void;
  }

  function headerRender({
    value,
    type,
    onChange,
    onTypeChange,
  }: HeaderRenderProps) {
    const monthOptions = [];
    for (let i = 0; i < months.length; i++) {
      monthOptions.push(
        <Select.Option key={i} value={i} className="month-item">
          {months[i]}
        </Select.Option>,
      );
    }

    const year = value.year();
    const month = value.month();
    const options = [];
    for (let i = year - 10; i < year + 10; i += 1) {
      options.push(
        <Select.Option key={i} value={i} className="year-item">
          {i}
        </Select.Option>,
      );
    }
    return (
      <div style={{ padding: 8 }}>
        <Row gutter={8}>
          <Col>
            <Radio.Group
              size="small"
              onChange={(e: RadioChangeEvent) => onTypeChange(e.target.value)}
              value={type}
            >
              <Radio.Button value="month">Месец</Radio.Button>
              <Radio.Button value="year">Година</Radio.Button>
            </Radio.Group>
          </Col>
          <Col>
            <Select
              size="small"
              popupMatchSelectWidth={false}
              className="my-year-select"
              value={year}
              onChange={(newYear: number) => {
                const now = value.clone().year(newYear);
                onChange(now);
              }}
            >
              {options}
            </Select>
          </Col>
          <Col>
            <Select
              size="small"
              popupMatchSelectWidth={false}
              value={month}
              onChange={(newMonth) => {
                const now = value.clone().month(newMonth);
                onChange(now);
              }}
            >
              {monthOptions}
            </Select>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <Calendar
      headerRender={headerRender as HeaderRender<Dayjs>}
      fullCellRender={fullCellRender}
    />
  );
}
