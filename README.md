# Personal Notes Service

A minimal Supabase backend for a personal notes service.

## Schema Design

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Why this schema?**

- UUID primary key provides globally unique IDs suitable for distributed systems and future scaling
- TEXT type for title and content allows for variable-length entries without arbitrary limits
- Timestamps with timezone support ensures consistent time representation across different regions
- Default values for timestamps reduce application code complexity and ensure data consistency

## Edge Functions

The API includes two Edge Functions:

### POST /notes

```typescript
// POST /notes - Creates a new note by reading JSON from request body for cleaner payload handling
```

**Why?** POST is the appropriate HTTP method for creating resources. The request body cleanly encapsulates the structured data (title and content) needed to create a note, following REST conventions.

### GET /notes

```typescript
// GET /notes - Retrieves all notes for the authenticated user via JWT token for secure access control
```

**Why?** GET is the correct HTTP method for retrieving resources. Authentication via JWT token in the request header follows security best practices. Query parameters enable flexible result filtering and pagination.

## Setup & Deployment

1. **Create a Supabase Project**:

   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Apply Database Schema**:

   - Go to the SQL Editor in your Supabase dashboard
   - Run the contents of `schema.sql`

3. **Deploy Edge Functions**:

   - Connect to Supabase: `npx supabase login`
   - Link your project: `npx supabase link --project-ref YOUR_PROJECT_REF`
   - Deploy functions:
     ```
     npx supabase functions deploy post-notes
     npx supabase functions deploy get-notes
     ```

4. **Environment Variables**:
   These are automatically available in your Edge Functions:
   - `SUPABASE_URL`: Your project URL
   - `SUPABASE_ANON_KEY`: Your project's anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your project's service role key

## Demo

### Create a Note

```bash
curl -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/post-notes" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Shopping List", "content": "Milk, Eggs, Bread"}'
```

Example Response:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "auth0|user123",
  "title": "Shopping List",
  "content": "Milk, Eggs, Bread",
  "created_at": "2023-09-16T14:30:22.987654+00:00",
  "updated_at": "2023-09-16T14:30:22.987654+00:00"
}
```

### List Notes

```bash
curl -X GET "https://YOUR_PROJECT_REF.supabase.co/functions/v1/get-notes?limit=10&order=desc" \
  -H "Authorization: Bearer USER_JWT_TOKEN"
```

Example Response:

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "auth0|user123",
    "title": "Shopping List",
    "content": "Milk, Eggs, Bread",
    "created_at": "2023-09-16T14:30:22.987654+00:00",
    "updated_at": "2023-09-16T14:30:22.987654+00:00"
  },
  {
    "id": "c3a7fea1-d29b-11ec-9d64-0242ac120002",
    "user_id": "auth0|user123",
    "title": "Meeting Notes",
    "content": "Discuss project timeline and resource allocation",
    "created_at": "2023-09-15T10:15:30.123456+00:00",
    "updated_at": "2023-09-15T10:15:30.123456+00:00"
  }
]
```
