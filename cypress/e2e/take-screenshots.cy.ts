describe('Cattura Screenshot ad Alta Qualità', () => {
  it('Scatta foto in formato mobile per Dashboard, Budget e Transazioni', () => {
    // Imposta la dimensione esatta di uno smartphone (iPhone 12 Pro)
    cy.viewport(390, 844)
    
    cy.visit('/login')
    
    
    // Metti in pausa e aspetta che tu inserisca la password e clicchi su Accedi
    cy.url({ timeout: 60000 }).should('include', '/dashboard')
    
    // Diamo qualche secondo all'app per caricare i grafici e i dati
    cy.wait(3000)
    
    // 1. Screenshot Dashboard
    // Cypress salva l'immagine in cypress/screenshots/
    cy.screenshot('dashboard-mobile', { capture: 'viewport' })
    
    // 2. Vai alla pagina Budget e fai lo screenshot
    cy.visit('/budgets')
    cy.wait(3000)
    cy.screenshot('budget-mobile', { capture: 'viewport' })
    
    // 3. Vai alla pagina Transazioni e fai lo screenshot
    cy.visit('/transazioni')
    cy.wait(3000)
    cy.screenshot('transactions-mobile', { capture: 'viewport' })
  })
})
