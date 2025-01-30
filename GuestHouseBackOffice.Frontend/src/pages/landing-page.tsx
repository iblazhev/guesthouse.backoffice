import { Button, Col, Row } from "antd";
import CreateRequestForm from "../components/create_request_form.tsx";
import { useEffect, useState } from "react";
import BookingsCalendar from "../components/booking_calendar/bookings_calendar.tsx";
import BookingHighlights from "../components/booking_highlights.tsx";
import { useBookingRequestStore } from "../store/booking_request/get_booking_requests.ts";
import { BookingRequest } from "../types/bookingRequest.ts";
import {useTranslation} from "react-i18next";

export default function LandingPage() {
    const { t } = useTranslation(); // Access the translation function
  const [formOpen, setFormOpen] = useState(false);
  const { getRequests, requests } = useBookingRequestStore((state) => state);
  const [selectedRequests, setSelectedRequests] = useState<BookingRequest[]>(
    [],
  );

  useEffect(() => {
    getRequests({});
  }, []); // Empty dependency array [] ensures fetch only on initial render

  return (
    <>
      <div className={"table-button-header"}>
        <Button
          size={"large"}
          type={"primary"}
          onClick={() => setFormOpen(true)}
        >
            {t('create-booking')}
        </Button>
      </div>
      <CreateRequestForm formOpen={formOpen} setFormOpen={setFormOpen} />
      <Row>
        <Col span={12}>
          {" "}
          <BookingsCalendar requests={requests} onClick={setSelectedRequests} />
        </Col>
        <Col span={12}>
          <BookingHighlights requests={selectedRequests} />
        </Col>
      </Row>
    </>
  );
}
