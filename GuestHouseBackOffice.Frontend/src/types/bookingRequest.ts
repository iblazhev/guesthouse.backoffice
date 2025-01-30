export interface BookingRequest {
    id?: number;
    name: string;
    email: string;
    phone: string;
    startDate: string;
    endDate: string;
    peopleCount: number;
    adultsCount: number;
    kidsCount: number;
    city: string;
    comments: string;
    approved: boolean;
    approvedAt?: Date;
    createdAt: Date;
}