import { Avatar, List } from "antd";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { BookingRequest } from "../types/bookingRequest.ts";
import {useTranslation} from "react-i18next";

interface Props {
  requests: BookingRequest[];
}

export default function BookingHighlights({ requests }: Props) {
    
  const { t } = useTranslation();
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
            description={t('eventDetails', {
                startDate: getDateString(item.startDate),
                endDate: getDateString(item.endDate),
                peopleCount: item.peopleCount,
            })}
          />
        </List.Item>
      )}
    />
  );
}
