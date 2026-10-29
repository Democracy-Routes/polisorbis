// SPDX-FileCopyrightText: 2026 Philip <philip@decentsoftwa.re>
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// A small modal confirmation (used for deleting a conversation).

/** @jsx jsx */
import React from 'react'
import PropTypes from 'prop-types'
import { Box, Flex, Text, Button, jsx } from 'theme-ui'

const ConfirmDialog = ({ open, title, children, confirmLabel, onConfirm, onCancel }) => {
  if (!open) return null
  return (
    <Box
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        e.stopPropagation()
        onCancel()
      }}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        bg: 'rgba(15,23,42,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}>
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{ variant: 'cards.primary', width: '100%', maxWidth: '28em', p: [3, 4] }}>
        {title ? <Text sx={{ fontWeight: 'bold', fontSize: 3, mb: 2 }}>{title}</Text> : null}
        <Text sx={{ color: 'muted', mb: 3 }}>{children}</Text>
        <Flex sx={{ justifyContent: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel || 'Delete'}
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node,
  confirmLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

export default ConfirmDialog
