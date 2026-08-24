/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

let token
beforeEach(() => {
  cy.admtoken('admin@biblioteca.com', 'admin123').then(tkn => {
    token = tkn
  })
});

describe('GET - TESTES API (POSITIVOS) - HUB DE LEITURA', () => {

  it('CENÁRIO POSITIVO: DEVE LISTAR O CATÁLOGO DE LIVROS', () => {
    cy.api({
      method: 'GET',
      url: 'books',
    }).should(response => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('books')
    })
  });

  it('CENÁRIO POSITIVO: DEVE LISTAR AS CATEGORIAS DE LIVROS.', () => {
    cy.api({
      method: 'GET',
      url: 'books/categories',
    }).should(response => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('categories')
    })
  });

  it('CENÁRIO POSITIVO: DEVE LISTAR OS AUTORES DOS LIVROS.', () => {
    cy.api({
      method: 'GET',
      url: 'books/authors',
    }).should(response => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('authors')
    })
  });

  it('CENÁRIO POSITIVO: OBTER DETALHES DE UM LIVRO POR ID.', () => {
    cy.api({
      method: 'GET',
      url: 'books/10'
    }).should(response => {
      expect(response.status).to.equal(200)
      expect(response.body.book).to.have.property('id')
      expect(response.body.book.title).to.equal('Harry Potter e a Pedra Filosofal')
    })
  });
});

describe('POST - TESTE API (POSITIVOS) - HUB DE LEITURA', () => {

  it('CENÁRIO POSITIVO: DEVE ADICIONAR UM LIVRO.', () => {

    let bookT = faker.book.title()
    let bookA = faker.book.author()
    let bookG = faker.book.genre()

    cy.api({
      method: 'POST',
      url: 'books',
      headers: { 'Authorization': token },
      body: {
        "title": bookT,
        "author": bookA,
        "category": bookG,
        "total_copies": 2
      }
    }).should(response => {
      expect(response.status).to.equal(201)
      expect(response.body).to.have.property('message')
    })
  });
});

describe('PUT - TESTE API (POSITIVOS) - HUB DE LEITURA', () => {
  it('CENÁRIO POSITIVO: DEVE MODIFICAR UM LIVRO CADASTRADO', () => {

    cy.criarLivro().then((livro) => {

      cy.api({
        method: 'PUT',
        url: `books/${livro.id}`,
        headers: { 'Authorization': token },
        body: {
          title: 'A Menina Que Roubava Livros',
          author: 'Autor aleatorio',
          category: 'Categoria aleatoria'
        }
      }).then(response => {
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('message')
      })
    })
  });
});

describe('DELETE - TESTE API (POSITIVOS) - HUB DE LEITURA', () => {
  it('CÉNARIO POSITIVO: DEVE DELETAR UM LIVRO CADASTRADO', () => {
    cy.api({
      method: 'DELETE',
      url: 'books/8',
      headers: { 'Authorization': token }
    }).should(response => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('message')
    })
  });
});