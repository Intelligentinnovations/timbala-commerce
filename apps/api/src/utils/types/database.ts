import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type User = {
  id: Generated<string>;
  email: string;
  name: string;
  password: string;
  isVerified: Generated<boolean>;
  bvn: string | null;
  typeOfWork: string | null;
  companyName: string | null;
  workTitle: string | null;
  workDescription: string | null;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp | null;
};
export type DB = {
  User: User;
};
