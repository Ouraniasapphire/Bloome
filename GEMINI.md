# Bloome

## General Contexts
- Framework: React-Router
- Typescript & TSX
- Tailwind v4.0
- Supabase and auth provider Google-Auth
- Uses the XQ Competencies in the app, found [here](https://xqcompetencies.xqsuperschool.org/)
- All file formatting should stay the same and should be based off of best practice, Prettier will format on file save
- Any mention of "Classes" are to equal the use of "Studios"

## Project Contexts 
- Bloome is a 'Studio' based learning platform akin to Google Classroom
- All branding, logos, and colors have been pre-defined
- This will be used to create a working concept of what a leanring platform can be
- This platform will combine place based learning and the XQ competencies into one learning environment (Studio)
- Project will have 3 roles: Student, Teacher, Admin

## Supabase table outline 
---
- users:
```postgres
create table public.users (
  id uuid not null default gen_random_uuid (),
  name character varying null,
  email character varying null,
  role public.roletypes null,
  created_at timestamp with time zone null default now(),
  teacher_initials text null,
  dynamic_key text not null default encode(extensions.gen_random_bytes (8), 'hex'::text),
  initial_login boolean null default true,
  constraint users_pkey primary key (id),
  constraint users_dynamickey_key unique (dynamic_key),
  constraint users_email_key unique (email),
  constraint users_id_fkey foreign KEY (id) references auth.users (id),
  constraint users_check check ((length('dynamicKey'::text) < 16))
) TABLESPACE pg_default;
```
---
- user_settings
``` postgres 
create table public.user_settings (
  id uuid not null,
  created_at timestamp with time zone not null default now(),
  preferred_name text not null,
  updated_at timestamp without time zone null default now(),
  profile_color text not null default '0'::text,
  constraint user_settings_pkey primary key (id),
  constraint user_settings_id_fkey foreign KEY (id) references users (id)
) TABLESPACE pg_default;
```
---
- submissions

``` postgres
create table public.submissions (
  id uuid not null default gen_random_uuid (),
  assignment_id uuid null,
  student_id uuid null,
  submitted_at timestamp with time zone null default now(),
  file_url character varying null,
  content text null,
  grade double precision null,
  feedback text null,
  graded_at timestamp with time zone null,
  constraint submissions_pkey primary key (id),
  constraint submissions_assignment_id_fkey foreign KEY (assignment_id) references assignments (id) on delete CASCADE,
  constraint submissions_student_id_fkey foreign KEY (student_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;
```
---
- posts 
``` postgres
create table public.posts (
  id uuid not null default gen_random_uuid (),
  class_id uuid null,
  author_id uuid null,
  content text null,
  type public.posttypes null,
  created_at timestamp with time zone null default now(),
  constraint posts_pkey primary key (id),
  constraint posts_author_id_fkey foreign KEY (author_id) references users (id) on delete CASCADE,
  constraint posts_class_id_fkey foreign KEY (class_id) references classes (id) on delete CASCADE
) TABLESPACE pg_default;
```
---
- memberships 
``` postgres 
create table public.memberships (
  id uuid not null default gen_random_uuid (),
  class_id uuid null,
  user_id uuid null,
  role public.roletypes null,
  joined_at timestamp with time zone null default now(),
  constraint memberships_pkey primary key (id),
  constraint memberships_class_user_unique unique (class_id, user_id),
  constraint memberships_id_key unique (id),
  constraint memberships_class_id_fkey foreign KEY (class_id) references classes (id) on delete CASCADE,
  constraint memberships_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;
```
---
- grades 
``` postgres 
create table public.grades (
  id uuid not null default gen_random_uuid (),
  submission_id uuid null,
  graded_by uuid null,
  points double precision null,
  feedback text null,
  created_at timestamp with time zone null default now(),
  constraint grades_pkey primary key (id),
  constraint grades_graded_by_fkey foreign KEY (graded_by) references users (id) on delete CASCADE,
  constraint grades_submission_id_fkey foreign KEY (submission_id) references submissions (id) on delete CASCADE
) TABLESPACE pg_default;
```
---
- comments 
``` postgres 
create table public.comments (
  id uuid not null default gen_random_uuid (),
  parent_type public.commenttypes null,
  parent_id uuid null,
  author_id uuid null,
  content text null,
  created_at timestamp with time zone null default now(),
  constraint comments_pkey primary key (id),
  constraint comments_author_id_fkey foreign KEY (author_id) references users (id) on delete CASCADE
) TABLESPACE pg_default;
```
---
- classes 
``` postgres 
create table public.classes (
  id uuid not null default gen_random_uuid (),
  name character varying null,
  section character varying null,
  description text null,
  teacher_id uuid null,
  invite_code character varying null,
  created_at timestamp with time zone null default now(),
  hero_url text null default 'https://ksilnlvowovhdaevcdfh.supabase.co/storage/v1/object/public/class-hero/Placeholder-image.png'::text,
  room text null,
  constraint classes_pkey primary key (id),
  constraint classes_teacher_id_fkey foreign KEY (teacher_id) references users (id) on delete set null
) TABLESPACE pg_default;
```
---
- assignments
``` postgres
create table public.assignments (
  id uuid not null default gen_random_uuid (),
  class_id uuid null,
  title character varying null,
  description text null,
  due_date timestamp with time zone null,
  max_points integer null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint assignments_pkey primary key (id),
  constraint assignments_class_id_fkey foreign KEY (class_id) references classes (id) on delete CASCADE
) TABLESPACE pg_default;
```
---
- app_settings 

``` postgres
create table public.app_settings (
  id serial not null,
  allow_teacher_admin_signup boolean null default false,
  constraint app_settings_pkey primary key (id)
) TABLESPACE pg_default;
```