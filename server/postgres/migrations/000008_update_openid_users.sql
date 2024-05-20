-- This migration updates the openid_users table needed to register OpenID users.
-- It adds some of the most common fields present in OIDC UserInfo or ID token

ALTER TABLE openid_users
ADD middle_name VARCHAR(999),
ADD nickname VARCHAR(999),
ADD profile VARCHAR(9999),
ADD picture VARCHAR(9999),
ADD website VARCHAR(9999),
ADD gender VARCHAR(256),
ADD birthdate VARCHAR(16),
ADD zoneinfo VARCHAR(256),
ADD locale VARCHAR(16),
ADD phone_number VARCHAR(256),
ADD phone_number_verified BOOLEAN DEFAULT FALSE,
ADD address	JSON;

ALTER TABLE openid_users
ALTER COLUMN sub TYPE VARCHAR(256),
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN given_name DROP NOT NULL,
ALTER COLUMN family_name DROP NOT NULL,
ALTER COLUMN preferred_username DROP NOT NULL,
ALTER COLUMN email_verified DROP NOT NULL;