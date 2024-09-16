## Todo 예제 (Supabase 사용)

- **프론트엔드**:

  - [Next.js](https://github.com/vercel/next.js): 프로덕션용 React 프레임워크
  - [Tailwind CSS](https://tailwindcss.com/): 스타일링과 레이아웃을 위한 도구
  - [Supabase.js](https://supabase.com/docs/library/getting-started): 사용자 관리 및 실시간 데이터 동기화

- **백엔드**:
  - [supabase.com/dashboard](https://supabase.com/dashboard/): Supabase.js와 함께 사용되는 RESTful API가 제공되는 호스팅 Postgres 데이터베이스

---

## Vercel을 통한 배포

Vercel을 사용한 배포는 Supabase 계정 및 프로젝트를 생성하는 과정을 안내합니다. Supabase 통합 설치 후 모든 관련 환경 변수가 자동으로 설정되므로 배포 직후 프로젝트를 사용할 수 있습니다 🚀

[![Vercel로 배포](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsupabase%2Fsupabase%2Ftree%2Fmaster%2Fexamples%2Ftodo-list%2Fnextjs-todo-list&project-name=supabase-nextjs-todo-list&repository-name=supabase-nextjs-todo-list&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6&external-id=https%3A%2F%2Fgithub.com%2Fsupabase%2Fsupabase%2Ftree%2Fmaster%2Fexamples%2Ftodo-list%2Fnextjs-todo-list)

---

## 처음부터 빌드하기

### 1. 새 프로젝트 생성

[Supabase에 가입](https://supabase.com/dashboard)하고 새로운 프로젝트를 생성하세요. 데이터베이스가 시작될 때까지 기다립니다.

### 2. "Todo List" Quickstart 실행

데이터베이스가 시작되면 "Todo List" 빠른 시작을 실행하세요. 프로젝트 내에서 `SQL Editor` 탭으로 이동하여 `TODO LIST: Build a basic todo list with Row Level Security`를 찾아 실행합니다.

### 3. URL 및 Key 가져오기

프로젝트 설정(톱니바퀴 아이콘)으로 이동하여 API 탭을 열고, API URL과 `anon` 키를 찾습니다. 이는 다음 단계에서 필요합니다.

`anon` 키는 클라이언트 측 API 키로, 로그인하기 전까지는 익명 접근을 허용합니다. 사용자가 로그인하면 키는 해당 사용자의 로그인 토큰으로 전환되어 Row Level Security가 활성화됩니다.

![API 정보](https://user-images.githubusercontent.com/10214025/88916245-528c2680-d298-11ea-8a71-708f93e1ce4f.png)

**주의**: `service_role` 키는 모든 데이터에 대한 완전한 접근 권한을 가지고 있으며, 보안 정책을 무시합니다. 이 키는 서버 환경에서만 사용되며, 절대 클라이언트나 브라우저에서 사용하면 안 됩니다.

---

## Supabase 세부 정보

### Postgres Row Level Security

이 프로젝트는 Postgres의 Row Level Security(RLS)를 사용한 고수준의 권한 관리를 활용합니다. 사용자가 로그인하면 `authenticated` 역할과 UUID가 포함된 JWT가 발급됩니다. 이를 통해 각 사용자가 자신의 데이터만 접근할 수 있도록 세밀한 제어가 가능합니다.

다음은 정책이 포함된 간소화된 스키마입니다:

```sql
create table todos (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users not null,
  task text check (char_length(task) > 3),
  is_complete boolean default false,
  inserted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table todos enable row level security;

create policy "Individuals can create todos." on todos for
    insert with check ((select auth.uid()) = user_id);

create policy "Individuals can view their own todos." on todos for
    select using ((select auth.uid()) = user_id);

create policy "Individuals can update their own todos." on todos for
    update using ((select auth.uid()) = user_id);

create policy "Individuals can delete their own todos." on todos for
    delete using ((select auth.uid()) = user_id);
```

---

## 추가 사항

### Swagger 설정

이 프로젝트에서는 Swagger를 통해 API 문서화를 지원합니다. `/api-docs` 경로에서 API 스펙을 확인할 수 있으며, 추가적인 수정 사항은 다음과 같이 Swagger 설정 파일에 반영됩니다.

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: "Todo 항목의 고유 식별자"
 *         user_id:
 *           type: string
 *           description: "사용자 ID"
 *         task:
 *           type: string
 *           description: "Todo 항목의 작업 내용"
 *         is_complete:
 *           type: boolean
 *           description: "Todo 완료 여부"
 *         inserted_at:
 *           type: string
 *           format: date-time
 *           description: "생성 시각"
 */
```

### Profile 페이지 추가

사용자 프로필을 확인 및 업데이트할 수 있는 `Profile` 페이지를 추가했습니다. 사용자는 자신의 정보와 관련된 사항을 조회 및 수정할 수 있습니다.

---

## 저자

- [Supabase](https://supabase.com)

Supabase는 오픈 소스 프로젝트입니다. 자세한 정보는 [GitHub](https://github.com/supabase/supabase)에서 확인하고 참여할 수 있습니다.
