// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from 'react'
import LegalPage from './legal-page'
import PrivacyEn from '../../content/privacy.md'
import PrivacyIt from '../../content/privacy.it.md'

class Privacy extends React.Component {
  render() {
    return <LegalPage en={PrivacyEn} it={PrivacyIt} />
  }
}

export default Privacy
