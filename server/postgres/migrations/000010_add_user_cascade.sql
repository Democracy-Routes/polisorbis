ALTER TABLE metrics
    DROP CONSTRAINT IF EXISTS metrics_uid_fkey,
    ADD CONSTRAINT metrics_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE auth_tokens
    DROP CONSTRAINT IF EXISTS auth_tokens_uid_fkey,
    ADD CONSTRAINT auth_tokens_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE jianiuevyew
DROP CONSTRAINT IF EXISTS jianiuevyew_uid_fkey,
    ADD CONSTRAINT jianiuevyew_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE apikeysndvweifu
    DROP CONSTRAINT IF EXISTS apikeysndvweifu_uid_fkey,
    ADD CONSTRAINT apikeysndvweifu_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE courses
    DROP CONSTRAINT IF EXISTS courses_owner_fkey,
    ADD CONSTRAINT courses_owner_fkey FOREIGN KEY (owner) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE conversations
    DROP CONSTRAINT IF EXISTS conversations_owner_fkey,
    ADD CONSTRAINT conversations_owner_fkey FOREIGN KEY (owner) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE conversations
    DROP CONSTRAINT IF EXISTS conversations_org_id_fkey,
    ADD CONSTRAINT conversations_org_id_fkey FOREIGN KEY (org_id) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE contexts
    DROP CONSTRAINT IF EXISTS contexts_creator_fkey,
    ADD CONSTRAINT contexts_creator_fkey FOREIGN KEY (creator) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE inviters
    DROP CONSTRAINT IF EXISTS inviters_inviter_uid_fkey,
    ADD CONSTRAINT inviters_inviter_uid_fkey FOREIGN KEY (inviter_uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE upvotes
    DROP CONSTRAINT IF EXISTS upvotes_uid_fkey,
    ADD CONSTRAINT upvotes_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE pwreset_tokens
    DROP CONSTRAINT IF EXISTS pwreset_tokens_uid_fkey,
    ADD CONSTRAINT pwreset_tokens_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE participants
    DROP CONSTRAINT IF EXISTS participants_uid_fkey,
    ADD CONSTRAINT participants_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE participants_extended
    DROP CONSTRAINT IF EXISTS participants_extended_uid_fkey,
    ADD CONSTRAINT participants_extended_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE participant_locations
    DROP CONSTRAINT IF EXISTS participant_locations_uid_fkey,
    ADD CONSTRAINT participant_locations_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE xids
    DROP CONSTRAINT IF EXISTS xids_uid_fkey,
    ADD CONSTRAINT xids_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE xids
    DROP CONSTRAINT IF EXISTS xids_owner_fkey,
    ADD CONSTRAINT xids_owner_fkey FOREIGN KEY (owner) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE xid_whitelist
    DROP CONSTRAINT IF EXISTS xid_whitelist_owner_fkey,
    ADD CONSTRAINT xid_whitelist_owner_fkey FOREIGN KEY (owner) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE twitter_users
    DROP CONSTRAINT IF EXISTS twitter_users_uid_fkey,
    ADD CONSTRAINT twitter_users_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE facebook_users
    DROP CONSTRAINT IF EXISTS facebook_users_uid_fkey,
    ADD CONSTRAINT facebook_users_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE social_settings
    DROP CONSTRAINT IF EXISTS social_settings_uid_fkey,
    ADD CONSTRAINT social_settings_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE facebook_friends
    DROP CONSTRAINT IF EXISTS facebook_friends_uid_fkey,
    ADD CONSTRAINT facebook_friends_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE facebook_friends
    DROP CONSTRAINT IF EXISTS facebook_friends_friend_fkey,
    ADD CONSTRAINT facebook_friends_friend_fkey FOREIGN KEY (friend) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE suzinvites
    DROP CONSTRAINT IF EXISTS suzinvites_owner_fkey,
    ADD CONSTRAINT suzinvites_owner_fkey FOREIGN KEY (owner) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE comments
    DROP CONSTRAINT IF EXISTS comments_uid_fkey,
    ADD CONSTRAINT comments_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;

ALTER TABLE openid_users
    DROP CONSTRAINT IF EXISTS openid_users_uid_fkey,
    ADD CONSTRAINT openid_users_uid_fkey FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE;
