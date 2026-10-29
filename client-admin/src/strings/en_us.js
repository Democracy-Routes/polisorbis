// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

const s = {}

// login/createuser strings
s.polis_err_param_parse_failed_email = 'Please enter a valid email address.'
s.polis_err_reg_bad_email = 'Please enter a valid email address.'
s.polis_err_param_parse_failed_password = 'Please enter a valid password.'
s.polis_err_login_unknown_user_or_password_noresults =
  'Login failed: invalid username/password combination.'
s.polis_err_login_unknown_user_or_password =
  'Login failed: invalid username/password combination.'
s.polis_err_reg_user_with_that_email_exists =
  'Email address already in use, Try logging in instead.'
s.polis_err_reg_need_name = 'Please include your name.'

s.polis_err_post_comment_duplicate =
  'Error posting: This comment already exists!'

s.polis_err_csv_header = 'The first row must be "position,statement" or "comment_text".'
s.polis_err_csv_malformed = 'The file is not a valid CSV (check quotes and line breaks).'
s.polis_err_ai_not_configured = 'AI drafting is not configured on this server.'
s.polis_err_ai_rate_limited = 'You have used this hour\u2019s budget of drafts. Try again in a few minutes.'
s.polis_err_ai_upstream = 'The AI provider did not answer. Try again later.'
s.polis_err_ai_bad_response = 'The model did not answer usefully. Try again, or reword the request.'
s.polis_err_fetching_tweet =
  'Error fetching tweet. Expected a URL to a twitter tweet.'

s.share_but_no_comments_warning =
  "This conversation has no comments. We recommend you add a few comments before inviting participants. This will help participants get started. Go to 'Configure' and then 'Seed Comments'."
s.share_but_no_visible_comments_warning =
  'This conversation has no visible comments. We recommend you add a few comments (or moderate the comments that exist) before inviting participants, since this will help them understand what kind of comments they should submit.'

s.no_permission =
  'Your account does not have the permissions to view this page.'

export default s
