import React from "react";
import _ from "lodash";

const pLogoURL = process.env.P_LOGO_URL;
const pLogoIcoURL = process.env.P_LOGO_ICO_URL;
const pTitle = process.env.P_TITLE;

const HexLogo = () => {
  return (
    <a href={pLogoURL} style={{
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            color: "#0f172a",
            textDecoration: "none",
            fontFamily: "inherit",
            fontSize: 16,
            lineHeight: 1.5,
            fontWeight: 600,
            cursor: "pointer",
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
  )
}

export default HexLogo;
