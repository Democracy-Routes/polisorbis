/** @jsx jsx */
import React from 'react'
import { Box, jsx, Link as ThemeUILink } from 'theme-ui'
import { Link } from 'react-router-dom'
import Logomark from './framework/logomark'

const pTitle = process.env.P_TITLE;
const pLogoURL = process.env.P_LOGO_URL;

class InteriorHeader extends React.Component {
    render() {
        return (
            <Box>
                <Box
                    sx={{
                        width: '100%',
                        backgroundColor: 'primary',
                        color: 'background',
                        zIndex: 1000,
                        py: [3],
                        px: [4],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                    <ThemeUILink sx={{ variant: 'links.nav' }} to={pLogoURL}>
                        <Logomark
                            style={{ marginRight: 10, position: 'relative', top: 6 }}
                            fill={'white'}
                        />
                        {pTitle}
                    </ThemeUILink>
                    <Link id="signoutLink" sx={{ variant: 'links.header' }} to="/signout">
                        sign out
                    </Link>
                </Box>
                <Box>{this.props.children}</Box>
            </Box>
        )
    }
}

export default InteriorHeader
