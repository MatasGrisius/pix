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
    public class TagCountersControllerTest
    {
        TagCountersController TagCountersController;
        PixDbContext context;
        Picture firstPicture = new Picture() { Name = "MyPicture" };
        Tag firstTag = new Tag() { Name = "MyTag" };
        TagCounter firstTagCounter = new TagCounter() { PictureId = 1};
        TagCounter secondTagCounter = new TagCounter() { PictureId = 1, TagId = 1};
        public TagCountersControllerTest()
        {
            var options = new DbContextOptionsBuilder<PixDbContext>()
                              .UseInMemoryDatabase(Guid.NewGuid().ToString())
                              .Options;
            context = new PixDbContext(options);
            context.Add(firstPicture);
            context.Add(firstTag);
            context.Add(firstTagCounter);
            context.Add(secondTagCounter);
            context.SaveChanges();
            TagCountersController = new TagCountersController(context);
        }

        [Fact]
        public async void GetAll()
        {
            var response = await TagCountersController.GetTagCounters();

            var Tag = ((List<TagCounter>)((OkObjectResult)response.Result).Value).FirstOrDefault();

            Assert.Equal(firstTagCounter.Tag, Tag.Tag);
            Assert.Equal(200, ((OkObjectResult)response.Result).StatusCode);
        }

        [Fact]
        public async void GetOne()
        {
            var response = await TagCountersController.GetTagCounter(1);

            var Tag = ((TagCounter)((OkObjectResult)response.Result).Value);

            Assert.Equal(firstTagCounter.Tag, Tag.Tag);
            Assert.Equal(200, ((OkObjectResult)response.Result).StatusCode);

        }

        [Fact]
        public async void FailGetOne()
        {
            var response = await TagCountersController.GetTagCounter(8);

            Assert.Null(response.Value);
            Assert.Equal(404, ((NotFoundResult)response.Result).StatusCode);
        }

        [Fact]
        public async void Put()
        {
            TagCounter TagCounter = new TagCounter() { TagId = 1, Id = 2};
            context.Entry(TagCounter).State = EntityState.Detached;
            var response = await TagCountersController.PutTagCounter(2, TagCounter);

            Assert.Equal(200, ((OkResult)response).StatusCode);
        }

        [Fact]
        public async void PutFailInexistingId()
        {
            TagCounter TagCounter = new TagCounter() { TagId = 8, Id = 8 };
            var response = await TagCountersController.PutTagCounter(8, TagCounter);

            Assert.Equal(404, ((NotFoundResult)response).StatusCode);
        }

        [Fact]
        public async void PutFailUnmatchingIds()
        {
            TagCounter TagCounter = new TagCounter() { TagId = 1, Id = 1 };
            var response = await TagCountersController.PutTagCounter(2, TagCounter);

            Assert.Equal(400, ((BadRequestResult)response).StatusCode);
        }

        [Fact]
        public async void PutFailInexistingForeignKey()
        {
            TagCounter TagCounter = new TagCounter() { Id = 2, Picture = new Picture { Id = 7 } };
            var response = await TagCountersController.PutTagCounter(2, TagCounter);

            Assert.Equal(400, ((BadRequestResult)response).StatusCode);
        }

        [Fact]
        public async void Post()
        {
            TagCounter TagCounter = new TagCounter() { TagId = 1};
            var response = await TagCountersController.PostTagCounter(TagCounter);
            var postedTag = ((TagCounter)((CreatedAtActionResult)response.Result).Value);

            Assert.Equal(201, ((CreatedAtActionResult) response.Result).StatusCode);
        }

        [Fact]
        public async void PostFailIdGiven()
        {
            TagCounter TagCounter = new TagCounter() { Id = 1, TagId = 2};
            var response = await TagCountersController.PostTagCounter(TagCounter);

            Assert.Equal(400, ((BadRequestResult)response.Result).StatusCode);
        }

        [Fact]
        public async void Delete()
        {
            var response = await TagCountersController.DeleteTagCounter(2);

            var deletedTag = response.Value;

            Assert.Equal(secondTagCounter.Picture, deletedTag.Picture);
        }

        [Fact]
        public async void DeleteFailInexistingId()
        {
            var response = await TagCountersController.DeleteTagCounter(8);


            Assert.Equal(404, ((NotFoundResult) response.Result).StatusCode);
        }
    }
}
