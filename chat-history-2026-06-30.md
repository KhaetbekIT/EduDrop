# Chat History - 2026-06-30

## Task
Modify only the homework upload form in the existing Next.js + React + TypeScript project.

## Implemented Changes
- Replaced the previous text-based group input with a homework select field using mock data.
- Added optional project link field with URL validation.
- Kept full name as required.
- Preserved archive upload behavior (drag/drop, file validation, upload flow, styles).
- Updated client/server schema and payload handling for optional project link.
- Updated RU/UZ translations for new labels/placeholders.

## Files Changed
- `src/mocks/homeworks.mock.ts` (new)
- `src/app/[locale]/(app)/_components/homework-upload-form.tsx`
- `src/schemas/homework.schema.ts`
- `src/types/homework.types.ts`
- `src/app/api/homework/upload/route.ts`
- `messages/ru.json`
- `messages/uz.json`

## Verification
- `pnpm build` completed successfully after changes.
