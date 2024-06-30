describe('Admin Coupons', () => {
    let couponId: number | null = null;

    beforeEach(() => {
        // Log in
        cy.visit('http://localhost:4200/auth/login');
        cy.get('input[formControlName=email]').type('bob@admin.com');
        cy.get('input[formControlName=password]').type('AdminPassword123!');
        cy.get('button[type=submit]').click();

        cy.contains('a', 'Admin').click();
        cy.contains('button', 'Coupons').click();
    });

    it('maakt een coupon aan en checkt of deze toe wordt gevoegd aan de lijst van coupons', () => {
        cy.get('.coupons-container').children().its('length').then(initialLength => {
            console.log("array lenght:", initialLength);
            cy.intercept('POST', '**/coupon').as('createCoupon');

            cy.contains('button', 'Create Coupon').click();
            cy.wait(500);
            cy.get('input#code').type('NEWCOUPON');
            cy.get('input#discountAmount').type('10');
            cy.get('input#usageAmount').type('5');
            cy.get('input#expiryDate').type('2024-12-14');
            cy.get('input#active').check();
            cy.get('input#percentage').uncheck();
            cy.get('button[type=submit]').contains("Create").click();

            cy.wait('@createCoupon');

            cy.get('.coupons-container').children().its('length').should('eq', initialLength + 1);
        });
    });

    it('past een coupon aan en kijkt of deze correct wordt opgeslagen', () => {
        cy.intercept('PUT', '**/coupon/*').as('updateCoupon');

        cy.get('.coupon').first().within(() => {
            cy.get('input[name=code]').clear().type('EDITEDCOUPON');
            cy.get('button[type=submit]').click();
        });

        cy.wait('@updateCoupon').then((interception) => {
            if (interception.response) {
                couponId = interception.response.body.id;
            }
        });

        cy.get('.coupon').first().within(() => {
            cy.get('input[name=code]').should('have.value', 'EDITEDCOUPON');
        });
    });
});