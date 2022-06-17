/// <reference types="cypress" />
import * as fixture from "../fixtures/fixtures.json"

describe('Business Critical Scenarios', () => {
    before(() => {
        cy.goToLandingpage();
    })

    beforeEach(() => {
        cy.acceptCookies()
    })

    it('1. Do a product search and add the result to the wishlist', () => {
        const itemName = 'cap';
        const itemId = 0;
        cy.doSearch(itemName)
        cy.waitUntilPageLoads()
        cy.getItemName(itemId).then($element => {
            const searchResultName = $element[itemId].textContent
            cy.log(`The name in the search result list is: ${searchResultName} `)
            cy.clickOnItems(itemId)
            cy.addToWishList()
            cy.goToWishList()
            cy.get(fixture.wishlistElements).then($element => {
                const wishlistName = $element.text()
                cy.log(`The name in the wishlist is: ${wishlistName} `)
                expect(wishlistName).to.contain(searchResultName)
            })
        })
    });

    it('2. Verify the wishlist increases properly after adding new product', () => {
        const itemName = 'shirt';
        const item1Id = 0;
        const item2Id = 1;
        cy.searchItemAndAddItToWishList(itemName, item1Id)

        cy.get(fixture.wishlistElements).then($element => {
            const itemsCount = $element.length
            cy.log(`The amount of items in the wishlist is: ${itemsCount} `)

            cy.searchItemAndAddItToWishList(itemName, item2Id)
            cy.get(fixture.wishlistElements).then($element => {
                const newItemsCount = $element.length
                cy.log(`Now the amount of items in the wishlist is: ${newItemsCount} `)
                expect(newItemsCount).to.be.eq(itemsCount + 1)
            })
        })
    });

    it('3. Add a product to the cart and verify it increases properly', () => {
        const itemName = 'pant';
        const itemId = 0;
        const size = "XS"

        cy.goToCartNavBar()
        cy.getItemsCountInCart().then(element => {
            const itemsCount = element === 0 ? 0 : element.length
            cy.log(`The number of items in cart is ${itemsCount}`)
            cy.doSearch(itemName)
            cy.waitUntilPageLoads()
            cy.clickOnItems(itemId)
            cy.selectItemSize(size)
            cy.addToCart()
            cy.findByText(/Successfully added/i).should('exist')
            cy.clickOnContinueShopping()
            cy.goToCartNavBar()
            cy.getItemsCountInCart().then(element => {
                const newItemsCount = element === 0 ? 0 : element.length
                cy.log(`Now, the number of items in cart is ${newItemsCount}`)
                expect(newItemsCount).to.be.eq(itemsCount + 1)
            })
        })
    })

    it('4. Add product to shopping cart and go to Checkout', () => {
        const itemName = 'bag';
        const itemId = 1;
        cy.doSearch(itemName)
        cy.waitUntilPageLoads()
        cy.clickOnItems(itemId)
        cy.addToCart()
        cy.findByText(/Successfully added/i).should('exist')
        cy.goToCartItem()
        cy.clickOnCheckout()
        cy.waitUntilPageLoads()
        cy.findAllByText(/Log in/i).should('exist')
    })

});