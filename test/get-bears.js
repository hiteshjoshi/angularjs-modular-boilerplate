


describe('Bears', function() {

  before(function(done) {
    done();
  });

  after(function(done) {
    done();
  });
  
  describe('Creating a bear', function() {

    it('It should return status 200 and no errors.', function(done) {
      request(app)
      .post('/bears')
      .send({name: 'hitesh bear'})    
      .end(function(err, res) {
              if (err) {
                throw err;
              }
              (err === null).should.be.true
              res.statusCode.should.equal(200);
              done();
            });
    });

  });


  describe('Get the bears', function() {

    it('It should return 200 and no errors', function(done) {
      request(app)
      .get('/bears')
      .end(function(err, res) {
              if (err) {
                throw err;
              }
              (err === null).should.be.true
              res.statusCode.should.equal(200);
              done();
          });
    });

  });




});

  