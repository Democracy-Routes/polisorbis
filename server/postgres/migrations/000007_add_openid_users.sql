-- This migration creates a new users table needed to register OpenID users.
-- The main problem arises from the fact that the index is a string in this case and not an integer

CREATE TABLE openid_users (
    uid INTEGER NOT NULL REFERENCES users(uid),
    sub VARCHAR(64) NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    preferred_username VARCHAR(999) NOT NULL,
    name VARCHAR(999),
    given_name VARCHAR(999) NOT NULL,
    family_name VARCHAR(999) NOT NULL,
    modified BIGINT NOT NULL DEFAULT now_as_millis(),
    created BIGINT NOT NULL DEFAULT now_as_millis(),
    UNIQUE(uid),
    UNIQUE(sub)
);

ALTER TABLE conversations
ADD auth_opt_openid BOOLEAN;