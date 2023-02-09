beforeEach(() => {
	cy.visit('/');
});

describe('Test submit handler', () => {
	it('should find movies on submit', () => {
		cy.get('#searchText').type('Star Wars').should('have.value', 'Star Wars');
		cy.get('#searchForm').submit();

		cy.get('#movie-container').children().should('have.length', 10);
		cy.get('#movie-container').children().first().get('h3').contains('Star Wars: Episode IV - A New Hope');
		cy.get('#movie-container').children().first().get('img').should('have.attr', 'src');
	});

	describe('should test errors', () => {
		it('should display error if input is empty', () => {
			cy.intercept('GET', 'http://omdbapi.com/*', { body: [] }).as('intercepted');

			cy.get('#searchText').should('have.value', '');
			cy.get('#searchForm').submit();

			cy.wait('@intercepted');

			cy.get('body').contains('Inga sökresultat att visa');
		});

		it('should display error if input value is not found', () => {
			cy.intercept('GET', 'http://omdbapi.com/*', { body: [] }).as('intercepted');

			cy.get('#searchText').type("I don't exist").should('have.value', "I don't exist");
			cy.get('#searchForm').submit();

			cy.wait('@intercepted');

			cy.get('body').contains('Inga sökresultat att visa');
		});

		it('should display error if API request fails', () => {
			cy.intercept('GET', 'http://omdbapi.com/*', { fixture: 'error' }).as('intercepted');

			cy.get('#searchText').type('Star Wars').should('have.value', 'Star Wars');
			cy.get('#searchForm').submit();

			cy.wait('@intercepted');

			cy.get('body').contains('Inga sökresultat att visa');
		});
	});
});
