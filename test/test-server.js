const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Post', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list blog-posts on GET', function() {
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      const expectedKeys = ['id','title','content','author','publishDate']
      res.body.forEach(function(post) {
        expect(post).to.be.a('object');
        expect(post).to.include.keys(expectedKeys);
      });
    });
  });

  it('should add a blog-post on POST', function() {

    const newPost = {
      title: 'Blog Post Title',
      content: 'Some crazy inspiring content to generate ad revenue',
      author: 'Someone W This',
      publishDate: 'August 12'
    };

    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id','title','content','author','publishDate');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id}));
      });
  });

  it('Should update blog-posts on Put', function() {

    const updatePost = {
      title: 'Blog Post Title New',
      content: 'Some crazy inspiring content to generate ad revenue New',
      author: 'Someone Wrote This',
      publishDate: 'August 3'
    };

    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        updatePost.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog-posts/${updatePost.id}`)
          .send(updatePost);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });

  it('Should delete blog-posts on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});
