export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'BLOCKED';
}

export interface IEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  eventType: 'PUBLIC' | 'PRIVATE';
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  fee: number;
  isPaid: boolean;
  isFeatured: boolean;
  organizerId: string;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    participations: number;
    reviews: number;
  };
}

export interface IParticipation {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'BANNED';
  userId: string;
  eventId: string;
  event?: IEvent;
}

export interface IReview {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  eventId: string;
  user?: { id: string; name: string };
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}