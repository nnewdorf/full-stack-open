describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Random Soul',
      username: 'randomsoul',
      password: 'please'
    }
    cy.addUser(user)
  })

  // it('Login form is shown', function() {
  //   cy.contains('log in to application')
  // })

  // describe('Login',function() {
  //   it('succeeds with correct credentials', function() {
  //     cy.get('#username').type('randomsoul')
  //     cy.get('#password').type('please')
  //     cy.get('#login-button').click()
  //     cy.contains('blogs')
  //   })

  //   it('fails with wrong credentials', function() {
  //     cy.get('#username').type('wrong')
  //     cy.get('#password').type('incorrect')
  //     cy.get('#login-button').click()
  //     cy.contains('log in to application')
  //   })
  // })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'randomsoul', password: 'please' })
    })

    // it('A blog can be created', function() {
    //   cy.contains('create new blog').click()
    //   cy.get('input[name="Title"]').type('A Title')
    //   cy.get('input[name="Author"]').type('First Last')
    //   cy.get('input[name="URL"]').type('http://www.test.com')
    //   cy.contains(new RegExp('^' + 'create' + '$', 'g')).click()

    //   cy.contains('A Title First Last')
    // })

    // it('A blog can be liked', function() {
    //   const blog = {
    //     title: 'A Title',
    //     author: 'First Last',
    //     url: 'http://www.test.com'
    //   }
    //   cy.addBlog(blog)

    //   cy.contains('view').click()
    //   cy.contains('likes 0')
    //   cy.contains('like').click()
    //   cy.contains('likes 1')
    // })

    // it('A blog removed by the poster', function() {
    //   const blog = {
    //     title: 'A Title',
    //     author: 'First Last',
    //     url: 'http://www.test.com'
    //   }
    //   cy.addBlog(blog)

    //   cy.contains('A Title First Last')
    //   cy.contains('view').click()
    //   cy.contains('remove').click()
    //   cy.contains('A Title First Last').should('not.exist')
    // })

    // it('A blog cannot be removed if user is not the poster', function() {
    //   const blog = {
    //     title: 'A Title',
    //     author: 'First Last',
    //     url: 'http://www.test.com'
    //   }
    //   cy.addBlog(blog)

    //   cy.contains('logout').click()

    //   const user = {
    //     name: 'RS Two',
    //     username: 'secondsoul',
    //     password: 'thankyou'
    //   }
    //   cy.addUser(user)
    //   cy.login({ username: 'secondsoul', password: 'thankyou' })

    //   cy.contains('A Title First Last')
    //   cy.contains('view').click()
    //   cy.contains('remove').should('not.exist')
    // })

    it('blogs are ordered by likes', function() {
      const blog = {
        title: 'A Title',
        author: 'First Last',
        url: 'http://www.test.com'
      }
      cy.addBlog(blog)

      const blog2 = {
        title: 'Second Title',
        author: 'Second Last',
        url: 'http://www.test2.com'
      }
      cy.addBlog(blog2)
      cy.contains('view').click()
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('likes 1')

      cy.get('.blog').eq(0).should('contain', 'A Title')
      cy.get('.blog').eq(1).should('contain', 'Second Title')

      cy.get('.blog').eq(1).contains('like').click().click()
      cy.get('.blog').eq(0).should('contain', 'A Title')
      cy.get('.blog').eq(1).should('contain', 'Second Title')
    })
  })
})
