// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react'
import LegalPage from './legal-page'
import TosEn from '../../content/tos.md'
import TosIt from '../../content/tos.it.md'

class TOS extends React.Component {
  render() {
    return <LegalPage en={TosEn} it={TosIt} />
  }
}

export default TOS
