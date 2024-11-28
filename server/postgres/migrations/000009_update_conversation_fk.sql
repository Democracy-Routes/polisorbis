ALTER table participant_metadata_questions
    DROP CONSTRAINT participant_metadata_questions_zid_fkey,
    ADD CONSTRAINT participant_metadata_questions_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table participant_metadata_answers
    DROP CONSTRAINT participant_metadata_answers_zid_fkey,
    ADD CONSTRAINT participant_metadata_answers_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table upvotes
    DROP CONSTRAINT upvotes_zid_fkey,
    ADD CONSTRAINT upvotes_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table zinvites
    DROP CONSTRAINT zinvites_zid_fkey,
    ADD CONSTRAINT zinvites_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table participants
    DROP CONSTRAINT participants_zid_fkey,
    ADD CONSTRAINT participants_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table participants_extended
    DROP CONSTRAINT participants_extended_zid_fkey,
    ADD CONSTRAINT participants_extended_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table participant_locations
    DROP CONSTRAINT participant_locations_zid_fkey,
    ADD CONSTRAINT participant_locations_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table notification_tasks
    DROP CONSTRAINT notification_tasks_zid_fkey,
    ADD CONSTRAINT notification_tasks_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table participant_metadata_choices
    DROP CONSTRAINT participant_metadata_choices_zid_pid_fkey,
    ADD CONSTRAINT participant_metadata_choices_zid_pid_fkey
    FOREIGN KEY (zid, pid) REFERENCES participants(zid, pid) ON DELETE CASCADE;

ALTER table suzinvites
    DROP CONSTRAINT suzinvites_zid_fkey,
    ADD CONSTRAINT suzinvites_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table comments
    DROP CONSTRAINT comments_zid_pid_fkey,
    ADD CONSTRAINT comments_zid_pid_fkey
    FOREIGN KEY (zid, pid) REFERENCES participants(zid, pid) ON DELETE CASCADE;

ALTER table comment_translations
    DROP CONSTRAINT comment_translations_zid_fkey,
    ADD CONSTRAINT comment_translations_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table conversation_translations
    DROP CONSTRAINT conversation_translations_zid_fkey,
    ADD CONSTRAINT conversation_translations_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table reports
    DROP CONSTRAINT reports_zid_fkey,
    ADD CONSTRAINT reports_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table report_comment_selections
    DROP CONSTRAINT report_comment_selections_zid_fkey,
    ADD CONSTRAINT report_comment_selections_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table math_ticks
    DROP CONSTRAINT math_ticks_zid_fkey,
    ADD CONSTRAINT math_ticks_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table math_main
    DROP CONSTRAINT math_main_zid_fkey,
    ADD CONSTRAINT math_main_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table math_profile
    DROP CONSTRAINT math_profile_zid_fkey,
    ADD CONSTRAINT math_profile_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table math_ptptstats
    DROP CONSTRAINT math_ptptstats_zid_fkey,
    ADD CONSTRAINT math_ptptstats_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table math_cache
    DROP CONSTRAINT math_cache_zid_fkey,
    ADD CONSTRAINT math_cache_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table math_bidtopid
    DROP CONSTRAINT math_bidtopid_zid_fkey,
    ADD CONSTRAINT math_bidtopid_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table math_exportstatus
    DROP CONSTRAINT math_exportstatus_zid_fkey,
    ADD CONSTRAINT math_exportstatus_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table votes
    ADD CONSTRAINT votes_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table votes_latest_unique
    ADD CONSTRAINT votes_latest_unique_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table crowd_mod
    ADD CONSTRAINT crowd_mod_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table event_ptpt_no_more_comments
    ADD CONSTRAINT event_ptpt_no_more_comments_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table stars
    ADD CONSTRAINT stars_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table trashes
    ADD CONSTRAINT trashes_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table permanentCookieZidJoins
    ADD CONSTRAINT permanentCookieZidJoins_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;

ALTER table page_ids
    DROP CONSTRAINT page_ids_zid_fkey,
    ADD CONSTRAINT page_ids_zid_fkey
    FOREIGN KEY (zid) REFERENCES conversations(zid) ON DELETE CASCADE;



ALTER table math_report_correlationmatrix
    DROP CONSTRAINT math_report_correlationmatrix_rid_fkey,
    ADD CONSTRAINT math_report_correlationmatrix_rid_fkey
    FOREIGN KEY (rid) REFERENCES reports(rid) ON DELETE CASCADE;