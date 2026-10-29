-- SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
-- SPDX-License-Identifier: AGPL-3.0-only
-- Conversations the organizer chose to show on the home page
-- (GET /api/v3/listed-conversations). Fresh databases get it from here;
-- existing ones through deploy/prod/migrate.sh in the Citizens-Polis repo.
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_listed BOOLEAN NOT NULL DEFAULT FALSE;
