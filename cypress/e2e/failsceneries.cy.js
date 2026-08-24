/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('GET - TESTES API (NEGATIVOS) - HUB DE LEITURA', () => {

    it('CENÁRIO NEGATIVO: DEVE FALHAR AO TENTAR LISTAR UM LIVRO INEXISTENTE', () => {
        cy.api({
            method: 'GET',
            url: 'books/66',
            failOnStatusCode: false
        }).should(response => {
            expect(response.status).to.equal(404)
            expect(response.body).to.have.property('message')
        })
    });

    it('CENÁRIO NEGATIVO: DEVE FALHAR AO TENTAR LISTAR UM ID INVÁLIDO.', () => {
        cy.api({
            method: 'GET',
            url: 'books/a',
            failOnStatusCode: false
        }).should(response => {
            expect(response.status).to.equal(400)
            expect(response.body).to.have.property('message')
        })
    });
});