import { Avatar, List } from "antd";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { BookingRequest } from "../types/bookingRequest.ts";

interface Props {
  requests: BookingRequest[];
}

export default function BookingHighlights({ requests }: Props) {
  dayjs.extend(utc);

  function getDateString(item: string) {
    const date = dayjs.utc(item);
    return date.format("DD-MM-YYYY");
  }

  return (
    <List
      itemLayout="horizontal"
      dataSource={requests}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item.id}`}
              />
            }
            title={<a href="https://ant.design">{item.name}</a>}
            description={`дати: ${getDateString(item.startDate)} - ${getDateString(item.endDate)}, брой хора: ${item.peopleCount}`}
          />
        </List.Item>
      )}
    />
  );
}
