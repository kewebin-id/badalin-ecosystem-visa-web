export interface User {
  name: string;
  email: string;
}

export interface FamilyMember {
  relation: string;
  selfieUrl: string;
}

export interface Agency {
  name: string;
}

export const MOCK_USER: User = {
  name: 'Brilian RN',
  email: 'brilian@badalin.com',
};

export const MOCK_FAMILY: FamilyMember[] = [
  {
    relation: 'Saya Sendiri',
    selfieUrl:
      'https://ipdbnagmooxlihfeoima.supabase.co/storage/v1/object/sign/assets/images.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84MzUzZTNhNy05N2I5LTQ3NzktOWY1MS0yMjY0ZDJlOWY4ODYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhc3NldHMvaW1hZ2VzLmpwZWciLCJpYXQiOjE3NzQyNTgzNzEsImV4cCI6MTgwNTc5NDM3MX0.ccLNCmwWPuJ9FwCCe1S8Zu75AddDUXGhB4A4webX1fc',
  },
];

export const MOCK_AGENCY: Agency = {
  name: 'Badalin Global Digital',
};
