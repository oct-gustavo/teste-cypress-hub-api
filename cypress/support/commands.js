// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('admtoken', (email, password) => {
    cy.request({
        method: 'POST',
        url: 'login',
        body: {
            "email": 'admin@biblioteca.com',
            "password": 'admin123'
        }
    }).then((response) => {
        expect(response.status).to.equal(200)
        return response.body.token
    })
})

Cypress.Commands.add('cadastro', (name, email, password) => {
    cy.api({
        method: 'POST',
        url: 'users',
        body: {
            name: 'Louis Gustavo de Araújo',
            email: 'usuarioteste@outlook.com',
            password: 'teste123'
        }
    }).then(response => {
        expect(response.status).to.equal(201)
        return response.body.token
    })
})

Cypress.Commands.add('login', (email, password) => {
    cy.api({
        method: 'POST',
        url: 'login',
        body: {
            email: 'usuarioprimeiro@teste.com',
            password: 'user123'
        }
    }).then(response => {
        expect(response.status).to.equal(200)
        return response.body.token
    })
})

Cypress.Commands.add('criarLivro',
    (livro = {}) => {
        const dadosLivro = {
            title: livro.title || "Livro aleatório",
            author: livro.author || "Autor aleatório",
            category: livro.category || "Categoria aleatória"
        };
        
        return cy.api ({
            method: 'POST',
            url: 'books',
            body: dadosLivro,
            failOnStatusCode: false
        }).then((response ) => {
            expect(response.status).to.equal(201);

            return response.body
        })
    }
)