// Copyright (C) 2012-present, The Authors. This program is free software: you can redistribute it and/or  modify it under the terms of the GNU Affero General Public License, version 3, as published by the Free Software Foundation. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React from "react";

const pLogoIcoURL = process.env.P_LOGO_ICO_URL;
const pLogoURL = process.env.P_LOGO_URL;
const pTitle = process.env.P_TITLE;

class PolisLogo extends React.Component {
    render() {
        return (
            <a href={pLogoURL} style={{
                userSelect: "none",
                display: "flex",
                alignItems: "center",
                color: "#60656F",
                "&:hover": {
                    color: "#60656F",
                    borderBottom: "solid",
                    borderWidth: 2,
                    borderColor: "#60656F"
                },
                textDecoration: "none",
                fontFamily: "'Space Mono', monospace",
                lineHeight: 1.5,
                fontWeight: 700,
                cursor: "pointer",
                borderBottom: "solid",
                borderWidth: 2,
                borderColor: "#FFF",
                marginTop: "auto",
                marginBottom: "auto"
            }} width="20" viewBox="0 0 264 304">
                <img
                    src={pLogoIcoURL}
                    // src="https://cdn.brandisty.com/img?id=542da2347b11bf3f3b0000d1&format=png&w=600&h=208"
                    width="20"
                    style={{marginRight: "10px", position: "relative"}}
                    alt="">
                </img>
                {pTitle}
            </a>
        );
    }
}

export default PolisLogo;
