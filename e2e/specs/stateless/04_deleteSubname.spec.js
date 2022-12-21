import { acceptMetamaskAccess, connectFromExisting } from '../../setup'

describe('Delete subnames', () => {
  before(() => {
    acceptMetamaskAccess(2, true)
  })

  it('should be able to delete subname', () => {
    cy.visit('/profile/with-subnames.arb/details?tab=subnames')
    connectFromExisting()
    cy.findByTestId('name-item-xyz.with-subnames.arb').click()
    cy.wait(500)
    cy.findByTestId('profile-actions').click({ force: true })

    cy.get('button').contains('Delete subname').click()

    cy.findByTestId('transaction-modal-confirm-button').click()
    cy.confirmMetamaskTransaction()
    cy.findByTestId('transaction-modal-complete-button').click()

    cy.findByTestId('profile-actions').should('not.exist')
    cy.go('back')

    cy.findByTestId('name-item-xyz.with-subnames.arb').should('not.exist')
  })
})
