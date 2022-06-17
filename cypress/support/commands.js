import * as fixture from "../fixtures/fixtures.json"

Cypress.Commands.add('goToLandingpage', () => {
    cy.visit('/', {
        headers: {
            'user-agent': 'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0'
        }
    });
    cy.selectEnglishLanguage()
    cy.acceptCookies()
});

Cypress.Commands.add('acceptCookies', () => {
    cy.get('body').then($body => {
        if ($body.find('#onetrust-accept-btn-handler').length) {
            cy.get('#onetrust-accept-btn-handler').click({ force: true })
        }
    });
});

Cypress.Commands.add('selectEnglishLanguage', () => {
    cy.get('body').then($body => {
        if ($body.find('[data-testid="languageSwitchCurrentLanguage"]').length) {
            cy.get('[data-testid="languageSwitchCurrentLanguage"]').click({ force: true })
        }
    });
});

Cypress.Commands.add('waitUntilPageLoads', () => {
    window.onload = () => {
        cy.log('page is fully loaded');
    };
});

Cypress.Commands.add('doSearch', (itemName) => {
    cy.get('[data-testid="HeaderSearch"]').click({ force: true })
    cy.get('[data-testid="searchInputText"]').clear().type(itemName)
});

Cypress.Commands.add('addToWishList', () => {
    cy.get('[data-testid="addToWishlist"]').click({ force: true })
});

Cypress.Commands.add('addToCart', () => {
    cy.get('[data-testid="addToBasketButton"]').click({ force: true })
});

Cypress.Commands.add('clickOnContinueShopping', () => {
    cy.get(fixture.continueShoppingButton).click({ force: true })
});

Cypress.Commands.add('selectItemSize', (size) => {
    cy.get('[data-testid="sizeFlyoutOpener"]')
        .should('be.visible')
        .click({ force: true })

    cy.get('[data-testid="optionContentLabel"]')
        .contains(size)
        .closest('li')
        .find('input')
        .click({ force: true })
});

Cypress.Commands.add('searchItemAndAddItToWishList', (itemName, itemId) => {
    cy.doSearch(itemName)
    cy.waitUntilPageLoads()
    cy.clickOnItems(itemId)
    cy.addToWishList()
    cy.goToWishList()
    cy.waitUntilPageLoads()
});

function clickOnItems(id) {
    cy.get('[data-testid="ProductSuggestionItemImage"]')
        .then((elements) => {
            if (!elements) {
                throw new Error(`Error: There's no items to be selected!`)
            }
            elements[id].click();
        })
}

Cypress.Commands.add('clickOnItems', clickOnItems)

function getItemName(id) {
    let name;
    cy.get('[data-testid="ProductSuggestionItemBrand"]')
        .then((elements) => {
            if (!elements) {
                throw new Error(`Error: There's no items to be retrieved!`)
            }
            name = elements[id].textContent
        })
    return name
}

Cypress.Commands.add('getItemName', getItemName)

Cypress.Commands.add('goToWishList', () => {
    cy.get('[data-testid="HeaderWishlist_filled"]').click()
});

Cypress.Commands.add('getItemsCountInCart', () => {
    let itemCount;
    cy.get('body').then($body => {
        if ($body.find('[data-testid="emptyBasketMsg"]').length) {
            return itemCount = 0
        } else {
            cy.get('[data-testid="basketItemDescription"]')
                .then((elements) => {
                    itemCount = elements.length
                })
            return itemCount
        }
    });
});

Cypress.Commands.add('goToCartNavBar', () => {
    cy.get('[data-testid="HeaderBasket"]')
        .click({ force: true })
});

Cypress.Commands.add('goToCartItem', () => {
    cy.get('[data-testid="goToBasketButton"]')
        .click({ force: true })
});

Cypress.Commands.add('clickOnCheckout', () => {
    cy.get(':nth-child(3) > [data-testid="CheckoutButton"]')
        .click({ force: true })
});