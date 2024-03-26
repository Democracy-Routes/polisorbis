// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";

const privacyURL = process.env.P_PRIVACY_POLICY_URL;
const tosURL = process.env.P_TOS_URL;

const Footer = (/*{conversation}*/) => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 40,
            marginBottom: 60,
            }}>
            <a
                href={privacyURL}
                target="_blank"
                style={{
                fontFamily: "Georgia",
                color: "#969696",
                fontSize: "18px",
                letterSpacing: "2px",
                marginInlineEnd: "5px"
                }}>
                Privacy
            </a>
            <a
                href={tosURL}
                target="_blank"
                style={{
                fontFamily: "Georgia",
                color: "#969696",
                fontSize: "18px",
                letterSpacing: "2px"
                }}>
                TOS
            </a>
        </div>
    )
};

export default Footer;
