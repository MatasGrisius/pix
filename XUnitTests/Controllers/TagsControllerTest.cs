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
    public class TagsControllerTest
    {
        TagsController TagsController;
        PixDbContext context;
        Tag firstTag = new Tag() { Name = "MyTag"};
        Tag secondTag = new Tag() { Name = "SecondTag"};
        public TagsControllerTest()
        {
            var options = new DbContextOptionsBuilder<PixDbContext>()
                              .UseInMemoryDatabase(Guid.NewGuid().ToString())
                              .Options;
            context = new PixDbContext(options);
            context.Add(firstTag);
            context.Add(secondTag);
            context.SaveChanges();
            TagsController = new TagsController(context);
        }

        [Fact]
        public async void GetAll()
        {
            var response = await TagsController.GetTags();

            var Tag = ((List<Tag>)((OkObjectResult)response.Result).Value).FirstOrDefault();

            Assert.Equal(firstTag.Name, Tag.Name);
            Assert.Equal(200, ((OkObjectResult)response.Result).StatusCode);
        }

        [Fact]
        public async void GetOne()
        {
            var response = await TagsController.GetTag(1);

            var Tag = ((Tag)((OkObjectResult)response.Result).Value);

            Assert.Equal(firstTag.Name, Tag.Name);
            Assert.Equal(200, ((OkObjectResult)response.Result).StatusCode);

        }

        [Fact]
        public async void FailGetOne()
        {
            var response = await TagsController.GetTag(8);

            Assert.Null(response.Value);
            Assert.Equal(404, ((NotFoundResult)response.Result).StatusCode);
        }

        [Fact]
        public async void Put()
        {
            Tag Tag = new Tag() { Name = "TestName", Id = 2};
            context.Entry(Tag).State = EntityState.Detached;
            var response = await TagsController.PutTag(2, Tag);

            Assert.Equal(200, ((OkResult)response).StatusCode);
        }

        [Fact]
        public async void PutFailInexistingId()
        {
            Tag Tag = new Tag() { Name = "TestName", Id = 8 };
            var response = await TagsController.PutTag(8, Tag);

            Assert.Equal(404, ((NotFoundResult)response).StatusCode);
        }

        [Fact]
        public async void PutFailUnmatchingIds()
        {
            Tag Tag = new Tag() { Name = "TestName", Id = 1 };
            var response = await TagsController.PutTag(2, Tag);

            Assert.Equal(400, ((BadRequestResult)response).StatusCode);
        }

        [Fact]
        public async void Post()
        {
            Tag Tag = new Tag() { Name = "TestName"};
            var response = await TagsController.PostTag(Tag);
            var postedTag = ((Tag)((CreatedAtActionResult)response.Result).Value);

            Assert.Equal(201, ((CreatedAtActionResult) response.Result).StatusCode);
            Assert.Equal("TestName", postedTag.Name);
        }

        [Fact]
        public async void PostFailIdGiven()
        {
            Tag Tag = new Tag() { Id = 1, Name = "TestName"};
            var response = await TagsController.PostTag(Tag);

            Assert.Equal(400, ((BadRequestResult)response.Result).StatusCode);
        }

        [Fact]
        public async void Delete()
        {
            var response = await TagsController.DeleteTag(2);

            var deletedTag = response.Value;

            Assert.Equal(secondTag.Name, deletedTag.Name);
        }

        [Fact]
        public async void DeleteFailInexistingId()
        {
            var response = await TagsController.DeleteTag(8);


            Assert.Equal(404, ((NotFoundResult) response.Result).StatusCode);
        }

        /*[Fact]
        public async void DeleteFailHasChildren()
        {
            context.Tags.Add(new Tag { TagId = 2 });
            context.SaveChanges();
            var response = await TagsController.DeleteTag(2);


            Assert.Equal(404, ((BadRequestResult)response.Result).StatusCode);
        }*/
    }
}
