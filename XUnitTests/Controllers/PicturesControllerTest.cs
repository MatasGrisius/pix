using pix.Controllers;
using System;
using Xunit;
using Microsoft.EntityFrameworkCore;
using pix.Entities;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace XUnitTests
{
    public class PicturesControllerTest
    {
        PicturesController picturesController;
        PixDbContext context;
        Picture firstPicture = new Picture() { Name = "MyPicture" };
        Picture secondPicture = new Picture() { Name = "SecondPicture" };
        public PicturesControllerTest()
        {
            var options = new DbContextOptionsBuilder<PixDbContext>()
                              .UseInMemoryDatabase(Guid.NewGuid().ToString())
                              .Options;
            context = new PixDbContext(options);
            context.Add(firstPicture);
            context.Add(secondPicture);
            context.SaveChanges();
            picturesController = new PicturesController(context);
        }

        [Fact]
        public async void GetAll()
        {
            var response = await picturesController.GetPictures();

            var picture = ((List<Picture>)((OkObjectResult)response.Result).Value).FirstOrDefault();

            Assert.Equal(firstPicture.Comments, picture.Comments);
            Assert.Equal(firstPicture.Name, picture.Name);
            Assert.Equal(firstPicture.Created, picture.Created);
            Assert.Equal(firstPicture.Content, picture.Content);
            Assert.Equal(firstPicture.Description, picture.Description);
            Assert.Equal(200, ((OkObjectResult)response.Result).StatusCode);
        }

        [Fact]
        public async void GetOne()
        {
            var response = await picturesController.GetPicture(1);

            var picture = ((Picture)((OkObjectResult)response.Result).Value);

            Assert.Equal(firstPicture.Comments, picture.Comments);
            Assert.Equal(firstPicture.Name, picture.Name);
            Assert.Equal(firstPicture.Created, picture.Created);
            Assert.Equal(firstPicture.Content, picture.Content);
            Assert.Equal(firstPicture.Description, picture.Description);
            Assert.Equal(200, ((OkObjectResult)response.Result).StatusCode);

        }

        [Fact]
        public async void FailGetOne()
        {
            var response = await picturesController.GetPicture(8);

            Assert.Null(response.Value);
            Assert.Equal(404, ((NotFoundResult)response.Result).StatusCode);
        }

        [Fact]
        public async void Put()
        {
            Picture picture = new Picture() { Name = "TestName", Id = 2, Description = "Description" };
            context.Entry(picture).State = EntityState.Detached;
            var response = await picturesController.PutPicture(2, picture);

            Assert.Equal(200, ((OkResult)response).StatusCode);
        }

        [Fact]
        public async void PutFailInexistingId()
        {
            Picture picture = new Picture() { Name = "TestName", Id = 8 };
            var response = await picturesController.PutPicture(8, picture);

            Assert.Equal(404, ((NotFoundResult)response).StatusCode);
        }

        [Fact]
        public async void PutFailInexistingForeignKey()
        {
            Picture picture = new Picture() { Name = "TestName", Id = 2, Comments = new List<Comment> { new Comment { Id = 7 } }};
            var response = await picturesController.PutPicture(2, picture);

            Assert.Equal(400, ((BadRequestResult)response).StatusCode);
        }

        [Fact]
        public async void PutFailUnmatchingIds()
        {
            Picture picture = new Picture() { Name = "TestName", Id = 1 };
            var response = await picturesController.PutPicture(2, picture);

            Assert.Equal(400, ((BadRequestResult)response).StatusCode);
        }

        [Fact]
        public async void Post()
        {
            Picture picture = new Picture() { Name = "TestName", Description = "Description" };
            var response = await picturesController.PostPicture(picture);
            var postedPicture = ((Picture)((CreatedAtActionResult)response.Result).Value);

            Assert.Equal(201, ((CreatedAtActionResult) response.Result).StatusCode);
            Assert.Equal("TestName", postedPicture.Name);
            Assert.Equal("Description", postedPicture.Description);
        }

        [Fact]
        public async void PostFailIdGiven()
        {
            Picture picture = new Picture() { Id = 1, Name = "TestName", Description = "Description" };
            var response = await picturesController.PostPicture(picture);

            Assert.Equal(400, ((BadRequestResult)response.Result).StatusCode);
        }

        [Fact]
        public async void Delete()
        {
            var response = await picturesController.DeletePicture(2);

            var deletedPicture = response.Value;

            Assert.Equal(secondPicture.Name, deletedPicture.Name);
            Assert.Equal(secondPicture.Description, deletedPicture.Description);
            Assert.Equal(secondPicture.Created, deletedPicture.Created);
        }

        [Fact]
        public async void DeleteFailInexistingId()
        {
            var response = await picturesController.DeletePicture(8);


            Assert.Equal(404, ((NotFoundResult) response.Result).StatusCode);
        }
    }
}
