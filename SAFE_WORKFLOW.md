# Safe Development Workflow for Aura Bloom

To ensure the project remains stable and "targeted" while using AI coding assistants, the following rules must be followed for every task.

## 1. Branching Strategy
- **NEVER** work directly on the `main` branch.
- For every new task (improvement, bug fix, or feature), a new branch must be created from `main`.
- Branch naming convention:
  - `feat/feature-name` (for new things)
  - `fix/bug-name` (for fixing issues)
  - `improve/feature-name` (for enhancing existing features)

## 2. Targeted AI Edits
- The AI must only modify files directly related to the task.
- Use **Atomic Edits**: Change specific lines of code instead of rewriting entire files.
- If a change requires touching a shared file (like `ShopContext.tsx`), the AI must explain WHY it is touching it before proceeding.
- **Zero Cleanup**: No "refactoring" or "cleaning" of unrelated code. Keep changes targeted.

## 3. Testing & Merging
1. Create branch.
2. Perform task.
3. Verify on Vercel Preview (or local dev).
4. Review the "Diff" (the changes).
5. Merge into `main` ONLY if no other features are affected and the user provides explicit approval.

## 4. Emergency Rollback
If a merge causes an unexpected bug in another part of the project:
1. Immediately identify the last stable commit.
2. Run `git reset --hard [commit-id]` on the `main` branch.
3. Delete the problematic feature branch and start over with a narrower focus.

## 5. Backend & Database Safety (Enterprise Protocol)
### Environment Separation
- **DEVELOPMENT**: Local machine work. Uses `.env` with a non-production Supabase URL.
- **STAGING/PREVIEW**: Vercel branch deployments. Used for your physical testing.
- **PRODUCTION**: The live `main` branch. Connected to your real customer database.

### Database Change Rules
1. **Staging First**: Any database change (new tables, columns) MUST be applied and tested on a Development/Staging project before touching Production.
2. **Schema Protection**: Never modify `supabase/schema.sql` without a corresponding migration task.
3. **RLS & Security**: Row Level Security (RLS) policies and Auth settings are "Locked." Any change requires a dedicated security review branch.
4. **No Direct Edits**: No AI agent is allowed to run SQL commands directly on the Production Database via the Supabase dashboard or API.

## 6. Strict Approval Flow
- **Code**: Branch -> Vercel Preview -> User Test -> Merge.
- **Backend/Data**: Dev DB -> Staging Test -> Written Plan -> User Approval -> Production Apply.
