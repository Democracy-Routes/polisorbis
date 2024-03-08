/** @jsx jsx */
import React from 'react'
import { jsx } from 'theme-ui'

const pLogoIcoUrl = process.env.P_LOGO_ICO_URL;

class Logomark extends React.Component {
  render() {
    return <img src={pLogoIcoUrl}
                width="20"
                style={this.props.style}
    ></img>

    /*
    return (
      <svg
        width="20"
        viewBox="0 0 88 100"
        style={this.props.style}
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M44 0L87.3013 25V75L44 100L0.69873 75V25L44 0Z"
          fill={this.props.fill}
        />
      </svg>
    )
    */
  }
}

export default Logomark
