/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

let token
beforeEach(() => {
  cy.admtoken('admin@biblioteca.com', 'admin123').then(tkn => {
    token = tkn
  })
});

describe('GET - TESTES API - HUB DE LEITURA', () => {

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

describe('POST - TESTE API - HUB DE LEITURA', () => {

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

  it('CENÁRIO NEGATIVO: DEVE FALHAR AO TENTAR ADICIONAR UM LIVRO JÁ EXISTENTE', () => {
    cy.api({
      method: 'POST',
      url: 'books',
      headers: { 'Authorization': token },
      body: {
        title: "Jardim de Iracema",
        author: "José de Alencar",
        category: "Literatura Brasileira",
        total_copies: 2
      },
      failOnStatusCode: false
    }).should(response => {
      expect(response.status).to.equal(400)
      expect(response.body).to.have.property('message')
    })
  });

  it('CENÁRIO NEGATIVO: DEVE FALHAR AO TENTAR ADICIONAR UM LIVRO SEM TOKEN ', () => {
    cy.api({
      method: 'POST',
      url: 'books',
      headers: { 'Authorization': 'Bearer 588885558485855444' },
      body: {
        title: "Jardim de Iracema",
        author: "José de Alencar",
        category: "Literatura Brasileira",
        total_copies: 2
      },
      failOnStatusCode: false
    }).should(response => {
      expect(response.status).to.equal(401)
      expect(response.body).to.have.property('message')
    })
  });

  it('CENÁRIO NEGATIVO: DEVE FALHAR AO TENTAR ADICIONAR UM LIVRO SEM AUTORIZAÇÃO', () => {
    cy.login('usuarioprimeiro@teste.com', 'user123').then((tknormal) => {

      cy.api({
        method: 'POST',
        url: 'books',
        headers: {
          Authorization: `Bearer ${tknormal}`
        },
        body: {
          title: "Jardim de Iracema",
          author: "José de Alencar",
          category: "Literatura Brasileira",
          total_copies: 2
        },
        failOnStatusCode: false
      })
    }).should(response => {
      expect(response.status).to.equal(401)
      expect(response.body).to.have.property('message')
    })
  });
});

describe('PUT - TESTE API - HUB DE LEITURA', () => {
  it('CENÁRIO POSITIVO: DEVE ATUALIZAR UM LIVRO COM SUCESSO.', () => {
    cy.api({
      method: 'PUT',
      url: 'books/1',
      headers: { 'Authorization': token },
      body: {
        "title": 'Livro Atualizado',
        "author": 'Autor atualizado',
        "category": 'categoria atualizada',
        "total_copies": 2
      }
    }).should(response => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('message')
      expect(response.body.bookId).to.eq(1)
    })
  });

  it('CENÁRIO NEGATIVO: DEVE FALHAR AO TENTAR ATUALIZAR UM LIVRO SEM TOKEN', () => {

    cy.api({
      method: 'PUT',
      url: 'books/1',
      headers: { 'Authorization': ''},
      body: {
        "title": 'Livro Atualizado',
        "author": 'Autor atualizado',
        "category": 'categoria atualizada',
        "total_copies": 2
      },

      failOnStatusCode: false
    }).should(response => {
      expect(response.status).to.equal(401)
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.equal('Token de acesso necessário')
    })
  });

  it('CENÁRIO NEGATIVO: DEVE FALHAR AO TENTAR ATUALIZAR UM LIVRO COM TOKEN COMUM', () => {
    
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