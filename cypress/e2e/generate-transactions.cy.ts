describe('Generazione Automatica Dati per Screenshot', () => {
  it('Aggiunge diverse transazioni per popolare l\'interfaccia', () => {
    // Visita la pagina di login
    cy.visit('/login')
    
    // Compila l'email basandosi sui log recenti
    
    // Non sapendo la tua password, fermiamo il test qui.
    // Inserisci la tua password nella finestra di Cypress e clicca su "Accedi".
    // Il test riprenderà automaticamente quando rileverà che sei arrivato alla dashboard!
    cy.url({ timeout: 60000 }).should('include', '/dashboard')
    
    // Passiamo alla pagina transazioni
    cy.visit('/transazioni')
    cy.url().should('include', '/transazioni')
    
    // Array di dati finti da inserire
    const dummyTransactions = [
      { title: 'Spesa Supermercato', amount: '120.50', type: 'expense', category: 'Casa' },
      { title: 'Stipendio Mese', amount: '2500.00', type: 'income', category: 'Stipendio' },
      { title: 'Cena con amici', amount: '45.00', type: 'expense', category: 'Cibo & Bevande' },
      { title: 'Biglietto Treno', amount: '25.00', type: 'expense', category: 'Trasporti' },
      { title: 'Regalo Compleanno', amount: '50.00', type: 'income', category: 'Regalo' }
    ]
    
    // Funzione helper per aggiungere una singola transazione
    dummyTransactions.forEach(t => {
      // Trova il pulsante che apre il modal
      cy.get('body').then($body => {
        if ($body.find('button:contains("Aggiungi Prima Transazione")').length > 0) {
          cy.contains('button', 'Aggiungi Prima Transazione').click({ force: true })
        } else {
          // Seleziona il pulsante col + in alto a destra cercando le classi specifiche
          cy.get('button[class*="sm:w-10 sm:h-10"]').click({ force: true })
        }
      })
    
      // Aspetta che il modale sia aperto cercando il titolo "Transazione"
      cy.contains('h2, div', 'Transazione').should('be.visible')
    
      // Compila il titolo
      cy.get('input#title').clear().type(t.title)
    
      // Compila l'importo. Essendo un input custom, potrebbe avere placeholder "0.00"
      cy.get('input[placeholder="0.00"], input[type="text"]').last().clear().type(t.amount)
    
      // Seleziona Tipo (Entrata o Uscita)
      if (t.type === 'income') {
        cy.contains('button', 'Entrata').click()
      } else {
        cy.contains('button', 'Uscita').click()
      }
    
      // Sottomette il form
      cy.contains('button', 'Aggiungi').click()
    
      // Aspetta un momento per l'aggiornamento UI
      cy.wait(1500)
    })
  })
})
