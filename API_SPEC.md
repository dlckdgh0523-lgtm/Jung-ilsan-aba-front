# 정지은 일산 ABA — 백엔드 API 명세

이 문서는 현재 프론트엔드(`ui_kits/website/`)가 기대하는 백엔드 인터페이스의 단일 출처입니다. Claude Code 등에서 백엔드 작업을 의뢰할 때 그대로 첨부하세요.

- 베이스 URL: `https://api.<도메인>/v1`
- 응답 포맷: `application/json; charset=utf-8`
- 인증: 관리자 엔드포인트는 `Authorization: Bearer <jwt>` 헤더 필요. 그 외 공개 엔드포인트(GET, 상담 신청 POST)는 무인증.
- 시간: ISO 8601 (`2026-06-02T14:30:00+09:00`)
- ID: 서버 발급 ULID 또는 UUID 권장. 프론트 더미 데이터는 `p1`, `t1`, `n1` 같은 짧은 ID를 쓰지만 신규 서버는 새 ID를 발급해도 됩니다.

---

## 0. 공통 규약

### 0.1 페이지네이션
목록 GET 엔드포인트 공통 쿼리:
- `page` (기본 1)
- `pageSize` (기본 20, 최대 100)
- `sort` — 예: `order:asc`, `createdAt:desc`
- `q` — 자유 검색어 (제목/이름/내용)
- `visible` — `true | false | all` (관리자만 `all` 허용)

응답 envelope:
```json
{
  "items": [...],
  "page": 1,
  "pageSize": 20,
  "total": 134
}
```

### 0.2 오류 응답
```json
{ "error": { "code": "VALIDATION", "message": "title is required", "fields": { "title": "required" } } }
```
HTTP 코드: 400 / 401 / 403 / 404 / 409 / 422 / 500.

### 0.3 이미지 업로드
프론트는 현재 이미지를 base64 data URI로 즉시 인라인합니다. 백엔드 도입 시 다음 흐름을 권장합니다.

```
POST /uploads               (multipart/form-data, key: "file")
  -> 200 { "url": "https://cdn.../uploads/2026/06/abc.jpg", "width": 1200, "height": 800, "bytes": 234567 }
```

모든 리소스의 `photo`, `imageUrl`, `images[]` 필드는 이렇게 받은 URL을 저장합니다.

### 0.4 순서 변경
드래그/위아래 버튼으로 순서를 바꾸는 모든 리소스(`hero`, `programs`, `therapists`, `notices`, `gallery`, `popups`, `nav`)는 정렬 키 `order: number`를 가집니다. 일괄 재정렬 엔드포인트:

```
PUT /<resource>/order        Body: { "ids": ["p1","p3","p2","p4"] }
  -> 204
```

서버는 받은 순서대로 `order`를 0..N-1로 다시 부여합니다.

### 0.5 공개/비공개 토글
모든 리소스에 `visible: boolean` 필드. 토글 전용 엔드포인트:

```
PATCH /<resource>/{id}/visibility    Body: { "visible": true|false }
  -> 200 { updated resource }
```

### 0.6 Soft delete
삭제는 기본 soft. `deletedAt` 컬럼을 둡니다. 관리자 GET에 `?trashed=only|with` 옵션, 복구 엔드포인트:

```
POST /<resource>/{id}/restore        -> 200 { resource }
DELETE /<resource>/{id}?hard=true    -> 204 (영구 삭제, 관리자 confirm 후만)
```

---

## 1. 인증 — `/auth`

### POST /auth/login
관리자 로그인.
```json
Request:  { "username": "admin", "password": "..." }
Response: {
  "token": "eyJhbGciOi...",
  "expiresAt": "2026-06-02T20:00:00+09:00",
  "user": { "id": "u1", "username": "admin", "role": "admin" }
}
```

### POST /auth/logout      (토큰 폐기) -> 204
### GET  /auth/me          (현재 사용자) -> 200 { user }

---

## 2. 사이트 설정 — `/site`

페이지 헤더/푸터에서 쓰는 단일 객체. 한 번의 GET으로 사이트 골격을 그릴 수 있어야 합니다.

### GET /site
공개. 캐시 가능.

```json
{
  "brand": {
    "nameKo": "정지은 일산 ABA",
    "nameEn": "CHUNG ji eun applied behavior analysis",
    "tagline": "아이의 행동을 이해하고, 가정과 함께 변화를 만들어갑니다.",
    "address": "경기도 고양시 일산서구 주엽동 18번지 자유프라자 606호",
    "phone": "031-977-2575",
    "fax":   "031-977-2575",
    "hours": "AM 09:00 ~ PM 21:00 (주말 휴무)",
    "kakaoId": "@정지은일산ABA",
    "kakaoQrUrl": "https://cdn.../kakao-qr.png",
    "coords": { "lat": 37.6707, "lng": 126.7547 },
    "kakaoMapUrl": "https://map.kakao.com/?q=...",
    "naverMapUrl": "https://map.naver.com/?q=..."
  },
  "nav": [
    { "id": "about", "label": "센터 소개", "visible": true, "order": 0 },
    { "id": "programs", "label": "프로그램", "visible": true, "order": 1 }
  ],
  "sections": {
    "hero": true, "about": true, "programs": true,
    "therapists": true, "notices": true, "gallery": true, "contact": true
  }
}
```

### PUT  /site                 (관리자) 본문은 위 객체 전체 또는 부분 patch
### PUT  /site/nav             (관리자) Body: 위 nav 배열로 전체 교체
### PATCH /site/nav/{id}       (관리자) Body: `{ "label": "...", "visible": true }`

---

## 3. Hero 슬라이드 — `/hero`

```json
{
  "id": "h1",
  "eyebrow": "정지은 일산 ABA",
  "title": "아이의 행동을 이해하고,\n가정과 함께 변화를 만들어갑니다.",
  "subtitle": "박사 센터장과 석사 전문 선생님들이 함께하는 ABA 전문기관 — 초기상담부터 의료 연계까지 체계적으로 지원합니다.",
  "imageUrl": "https://cdn.../reception.jpg",
  "buttonText": "상담 신청하기",
  "buttonLink": "contact",
  "visible": true,
  "order": 0,
  "createdAt": "...",
  "updatedAt": "..."
}
```

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| GET    | /hero            | 공개 | `visible=true`만 정렬해서 반환 |
| GET    | /hero/{id}       | 공개 | 단건 |
| POST   | /hero            | 관리자 | 생성 |
| PUT    | /hero/{id}       | 관리자 | 전체 갱신 |
| PATCH  | /hero/{id}       | 관리자 | 부분 갱신 |
| DELETE | /hero/{id}       | 관리자 | soft delete |
| PUT    | /hero/order      | 관리자 | 일괄 재정렬 |
| PATCH  | /hero/{id}/visibility | 관리자 | 토글 |

---

## 4. 센터 소개(About) — `/about`

단일 객체. `brand`와는 분리.

```json
{
  "eyebrow": "ABOUT US",
  "title": "아이의 발달을\n함께 책임지는 ABA 전문기관",
  "lead": ["편안한 마음으로 상담해보세요.", "..."],
  "body": ["정지은 일산 ABA는 ...", "..."],
  "values": [
    { "icon": "eye",      "title": "관찰",  "desc": "..." },
    { "icon": "users",    "title": "동행", "desc": "..." }
  ]
}
```

| Method | Path | 인증 |
|---|---|---|
| GET   | /about | 공개 |
| PUT   | /about | 관리자 |
| PATCH | /about | 관리자 |

---

## 5. 센터장 프로필 — `/director`

```json
{
  "name": "정지은",
  "role": "원장 · BCBA",
  "sub":  "QABA 지속교육기관 승인 프로바이더 인증",
  "photoUrl": "https://cdn.../director.jpg",
  "certifications": [
    { "code": "BCBA",   "desc": "Board Certified Behavior Analyst · 국제공인행동분석가" },
    { "code": "QABA®", "desc": "Qualified Applied Behavior Analysis Credentialing Board" }
  ],
  "education":      ["백석대학교 대학원 응용행동분석 박사수료", "..."],
  "organizations":  ["한국 ABA 전문가협회 정회원", "..."],
  "career": [
    { "period": "현", "text": "..." },
    { "period": "전", "text": "..." }
  ],
  "awards":   ["백석대학교 총장 공로상 수여"],
  "training": ["...", "..."]
}
```

| Method | Path | 인증 |
|---|---|---|
| GET   | /director | 공개 |
| PUT   | /director | 관리자 |
| PATCH | /director | 관리자 |
| POST  | /director/photo | 관리자 (multipart, 별도 단일 사진 업로드 후 URL 반환·세팅) |

---

## 6. 프로그램 — `/programs`

목록 카드 + 상세 페이지를 모두 다룹니다.

```json
{
  "id": "p1",
  "title": "조기교실",
  "ageRange": "AGES 3–5",
  "photoUrl": "https://cdn.../program-1.jpg",
  "desc": "착석, 지시 따르기, 기다리기, 전환하기, 또래와 함께하기 등 ...",
  "icon": "sparkles",
  "tone": "orange",                         // orange | green | yellow | green-soft
  "tags": ["개별중재", "조기개입"],
  "meta": "1:1 또는 소그룹 · 주 2–3회 · 각 50분",
  "detail": {
    "intro": "만 3–5세 아이들이 첫 학습 환경에 부드럽게 적응할 수 있도록 ...",
    "sections": [
      { "heading": "프로그램 목적", "body": "..." },
      { "heading": "운영 방식",     "body": "..." },
      { "heading": "기대 효과",     "body": "..." }
    ]
  },
  "visible": true,
  "order": 2
}
```

| Method | Path | 인증 |
|---|---|---|
| GET    | /programs                  | 공개 |
| GET    | /programs/{id}             | 공개 |
| POST   | /programs                  | 관리자 |
| PUT    | /programs/{id}             | 관리자 |
| PATCH  | /programs/{id}             | 관리자 |
| DELETE | /programs/{id}             | 관리자 |
| PUT    | /programs/order            | 관리자 |
| PATCH  | /programs/{id}/visibility  | 관리자 |

서버 측 검증: `tone` enum, `detail.sections[*].heading` 50자 / `.body` 1000자 한도.

---

## 7. 치료사 — `/therapists`

```json
{
  "id": "t1",
  "name": "강OO",
  "role": "치료사",
  "tone": "blue",
  "photoUrl": "https://cdn.../therapist-1.jpg",
  "summary": "정지은 일산 ABA 개별치료 치료사 · QBA 자격증",
  "education":      ["...", "..."],
  "career":         [{ "period": "현", "text": "..." }],
  "certifications": ["...", "..."],
  "completion":     "정지은 일산 ABA 프로그램 CA 과정 이수",
  "visible": true,
  "order": 0
}
```

| Method | Path | 인증 |
|---|---|---|
| GET    | /therapists                 | 공개 |
| GET    | /therapists/{id}            | 공개 |
| POST   | /therapists                 | 관리자 |
| PUT    | /therapists/{id}            | 관리자 |
| PATCH  | /therapists/{id}            | 관리자 |
| DELETE | /therapists/{id}            | 관리자 |
| PUT    | /therapists/order           | 관리자 |
| PATCH  | /therapists/{id}/visibility | 관리자 |

---

## 8. 공지사항 — `/notices`

```json
{
  "id": "n1",
  "title": "여름방학 특별 운영안내",
  "body": "정지은 일산 ABA는 7월 15일부터 ...",
  "date": "2026-05-12",
  "pinned": true,
  "views": 142,
  "visible": true,
  "order": 0
}
```

| Method | Path | 인증 |
|---|---|---|
| GET    | /notices?pinned=true       | 공개 |
| GET    | /notices/{id}              | 공개 (서버가 views +1) |
| POST   | /notices                   | 관리자 |
| PUT/PATCH/DELETE/order/visibility | 표준 패턴 동일 | 관리자 |

---

## 9. 갤러리 — `/gallery`

```json
{
  "id": "g1",
  "caption": "조기교실 — 함께 만든 가을 모빌",
  "imageUrl": "https://cdn.../gallery-1.jpg",
  "tags": ["조기교실"],
  "visible": true,
  "order": 0
}
```

표준 CRUD + order + visibility.

---

## 10. 팝업 — `/popups`

```json
{
  "id": "pop1",
  "title": "여름방학 특강 안내",
  "content": "<p>설명...</p>",
  "imageUrl": "https://cdn.../popup-summer.jpg",
  "linkUrl": "https://...",
  "startAt": "2026-06-15T00:00:00+09:00",
  "endAt":   "2026-06-30T23:59:59+09:00",
  "isActive": true,
  "allowHideToday": true,
  "createdAt": "...",
  "updatedAt": "...",
  "deletedAt": null
}
```

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| GET    | /popups/active   | 공개 | `isActive=true && now∈[startAt,endAt] && deletedAt=null` 만 반환 |
| GET    | /popups          | 관리자 | 전체 목록 (상태 필터: `state=active|scheduled|ended|deleted`) |
| POST   | /popups          | 관리자 | |
| PUT/PATCH/DELETE | /popups/{id} | 관리자 | soft delete |
| POST   | /popups/{id}/restore | 관리자 | |

상태 계산 규칙:
- `now < startAt` → `scheduled`
- `startAt ≤ now ≤ endAt && isActive` → `active`
- `now > endAt` → `ended`
- `deletedAt != null` → `deleted`

---

## 11. 상담 신청 — `/consultations`

공개 POST + 관리자 조회/관리.

```json
{
  "id": "c1",
  "parent": "홍길동",
  "child":  { "age": 5, "diagnosis": "ASD 진단" },
  "phone":  "010-1234-5678",
  "email":  "parent@example.com",
  "topic":  "p1",
  "preferred": ["평일 오전", "토요일"],
  "message": "...",
  "privacyConsent": true,
  "status": "new",          // new | contacted | done
  "isRead": false,
  "createdAt": "...",
  "ip": "203.0.113.5"
}
```

| Method | Path | 인증 |
|---|---|---|
| POST   | /consultations            | 공개 (필수: `privacyConsent=true`) |
| GET    | /consultations            | 관리자 (필터: `status`, `isRead`, `from`, `to`) |
| GET    | /consultations/{id}       | 관리자 |
| PATCH  | /consultations/{id}       | 관리자 (`status`, `isRead`, 메모 등) |
| DELETE | /consultations/{id}       | 관리자 (soft) |

신청 접수 시:
1. DB 저장
2. SSE 채널 `/realtime/consultations`로 즉시 push (5번 참조)
3. 카카오톡/이메일 알림(선택)

---

## 12. 실시간 — Server-Sent Events

### GET /realtime/consultations          (관리자 토큰 쿼리 `?token=`)
```
event: new
data: { "id": "c123", "parent": "...", "createdAt": "..." }

event: ping
data: { "ts": "..." }
```

### GET /realtime/stats                  (관리자)
30초마다 `concurrentUsers`, `pendingConsultations` push.

WebSocket 대안도 동일 페이로드로 가능. 프론트는 EventSource + 폴백 폴링(20초)을 가정합니다.

---

## 13. 방문자 통계 — `/stats`

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| POST | /stats/hit          | 공개 | 페이지뷰 1건 기록. Body: `{ "path": "/", "session": "uuid" }` |
| GET  | /stats/summary      | 관리자 | `{ concurrent, today, total, last7days: [{date, hits}] }` |
| GET  | /stats/range?from=&to=&group=day | 관리자 | 시계열 |

`concurrent`는 최근 90초 안에 hit 한 고유 session 수.

---

## 14. 개인정보 처리 — `/privacy`

| Method | Path | 인증 |
|---|---|---|
| GET | /privacy/policy       | 공개 (개인정보처리방침 마크다운) |
| GET | /privacy/consent      | 공개 (수집·이용 동의서) |
| PUT | /privacy/policy       | 관리자 |
| PUT | /privacy/consent      | 관리자 |

응답:
```json
{ "version": "2026-06-02", "body": "..." }
```

신규 버전 PUT 시 `version`은 서버가 ISO 날짜로 갱신.

---

## 15. 카카오 지도

지도는 클라이언트가 `kakao.maps.LatLng(brand.coords.lat, brand.coords.lng)`로 직접 렌더링하므로 서버는 좌표 + 외부 링크만 `/site` 응답에 포함하면 됩니다. 별도 엔드포인트 없음.

---

## 16. 데이터베이스 스케치 (참고)

| Table | 핵심 컬럼 |
|---|---|
| site_settings  | id (singleton=1), brand JSONB, sections JSONB |
| nav_items      | id, label, order, visible, deleted_at |
| hero_slides    | id, eyebrow, title, subtitle, image_url, button_text, button_link, order, visible, deleted_at, timestamps |
| about          | id (singleton=1), title, lead JSONB, body JSONB, values JSONB |
| director       | id (singleton=1), name, role, sub, photo_url, certifications JSONB, education JSONB, organizations JSONB, career JSONB, awards JSONB, training JSONB |
| programs       | id, title, age_range, photo_url, desc, icon, tone, tags JSONB, meta, detail JSONB, order, visible, deleted_at, timestamps |
| therapists     | id, name, role, tone, photo_url, summary, education JSONB, career JSONB, certifications JSONB, completion, order, visible, deleted_at, timestamps |
| notices        | id, title, body, date, pinned, views, order, visible, deleted_at, timestamps |
| gallery_items  | id, caption, image_url, tags JSONB, order, visible, deleted_at, timestamps |
| popups         | id, title, content, image_url, link_url, start_at, end_at, is_active, allow_hide_today, deleted_at, timestamps |
| consultations  | id, parent, child JSONB, phone, email, topic, preferred JSONB, message, privacy_consent, status, is_read, ip, created_at, deleted_at |
| privacy_docs   | kind ("policy"\|"consent"), version, body |
| page_views     | id, path, session, created_at (인덱스: created_at) |
| admin_users    | id, username, password_hash, role, created_at |

---

## 17. 환경 변수 가이드

```
DATABASE_URL=postgres://...
JWT_SECRET=...
JWT_TTL_SECONDS=43200            # 12h
UPLOAD_BUCKET=...
UPLOAD_CDN_BASE=https://cdn.example.com
KAKAO_REST_KEY=...
ADMIN_DEFAULT_USERNAME=admin
ADMIN_DEFAULT_PASSWORD=...
```

---

## 18. 보안 체크리스트

- 관리자 라우트 전부 `Authorization` 검증 미들웨어
- 공개 POST(`/consultations`)는 rate limit 분당 5건/IP
- 파일 업로드 mimetype/확장자 화이트리스트 + 5MB 제한
- 이미지 리사이즈 파이프라인(1600px max)
- privacy_consent 미체크 신청은 422 거부
- soft delete 우선, hard delete는 관리자 confirm 후만
- /realtime SSE는 토큰 만료 시 401 + close

---

## 19. 마이그레이션 노트 (프론트 ↔ 백엔드 연결)

현재 프론트는 `window.SITE_DATA` 단일 객체에서 모든 데이터를 읽습니다. 백엔드 도입 시:

1. `ui_kits/website/data.js` 의 `window.SITE_DATA = { ... }` 블록을 비우고
2. 부트스트랩 직전에 `GET /site`, `GET /hero`, `GET /programs`, `GET /therapists`, `GET /notices`, `GET /gallery`, `GET /about`, `GET /director`, `GET /popups/active` 를 병렬 fetch
3. 응답을 합쳐 `window.SITE_DATA` 에 주입 → 기존 React 컴포넌트는 그대로 동작

관리자 페이지(`admin.html`) 역시 동일 패턴이며, CRUD 액션은 위 표의 PUT/POST/DELETE 엔드포인트를 호출하도록 fetch 래퍼만 추가하면 됩니다.
