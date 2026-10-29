/** @jsx jsx */
import { Component } from 'react'
import { Flex, Box, jsx, Link as ThemeUILink } from 'theme-ui'

import { Link } from 'react-router-dom'
import Logomark from '../framework/logomark'

const pTitle = process.env.P_TITLE;
const pLogoURL = process.env.P_LOGO_URL;

class Header extends Component {
    render() {
        return (
            <Box>
                <Flex
                    sx={{
                        margin: `0 auto`,
                        width: '100%',
                        paddingTop: '2rem',
                        paddingBottom: '1.45rem',
                        justifyContent: 'space-between'
                    }}>
                    <Box sx={{ zIndex: 1000 }}>
                        <ThemeUILink sx={{ variant: 'links.nav' }} as="a" href={pLogoURL}>
                            <Logomark
                                style={{ marginRight: 10, position: 'relative', top: 6 }}
                                fill={'#1d4ed8'}
                            />
                            {pTitle}
                        </ThemeUILink>
                    </Box>
                    <Box>
                        <Link sx={{ variant: 'links.nav' }} to="/signin">
                            Sign in
                        </Link>
                    </Box>
                </Flex>
            </Box>
        )
    }
}

export default Header
