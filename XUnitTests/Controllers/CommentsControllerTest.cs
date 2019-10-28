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
    public class CommentsControllerTest
    {
        CommentsController commentsController;
        PixDbContext context;
        Picture firstPicture = new Picture() { Name = "MyPicture" };
        Comment firstComment = new Comment() { Text = "MyComment", PictureId = 1 };
        Comment secondComment = new Comment() { Text = "SecondComment", PictureId = 1 };
        public CommentsControllerTest()
        {
            var options = new DbContextOptionsBuilder<PixDbContext>()
                              .UseInMemoryDatabase(Guid.NewGuid().ToString())
                              .Options;
            context = new PixDbContext(options);
            context.Pictures.Add(firstPicture);
            context.Add(firstComment);
            context.Add(secondComment);
            context.SaveChanges();
            commentsController = new CommentsController(context);
        }

        [Fact]
        public async void GetAll()
        {
            var response = await commentsController.GetComments();

            var Comment = ((List<Comment>)((OkObjectResult)response.Result).Value).FirstOrDefault();

            Assert.Equal(firstComment.Picture, Comment.Picture);
            Assert.Equal(firstComment.Text, Comment.Text);
            Assert.Equal(200, ((OkObjectResult)response.Result).StatusCode);
        }

        [Fact]
        public async void GetOne()
        {
            var response = await commentsController.GetComment(1);

            var Comment = ((Comment)((OkObjectResult)response.Result).Value);

            Assert.Equal(firstComment.Picture, Comment.Picture);
            Assert.Equal(firstComment.Text, Comment.Text);
            Assert.Equal(200, ((OkObjectResult)response.Result).StatusCode);

        }

        [Fact]
        public async void FailGetOne()
        {
            var response = await commentsController.GetComment(8);

            Assert.Null(response.Value);
            Assert.Equal(404, ((NotFoundResult)response.Result).StatusCode);
        }

        [Fact]
        public async void Put()
        {
            Comment Comment = new Comment() { Text = "TestName", Id = 2};
            context.Entry(Comment).State = EntityState.Detached;
            var response = await commentsController.PutComment(2, Comment);

            Assert.Equal(200, ((OkResult)response).StatusCode);
        }

        [Fact]
        public async void PutFailInexistingId()
        {
            Comment Comment = new Comment() { Text = "TestName", Id = 8 };
            var response = await commentsController.PutComment(8, Comment);

            Assert.Equal(404, ((NotFoundResult)response).StatusCode);
        }

        [Fact]
        public async void PutFailInexistingForeignKey()
        {
            Comment Comment = new Comment() { Text = "TestName", Id = 2, Picture = new Picture { Id = 20 } };
            var response = await commentsController.PutComment(2, Comment);

            Assert.Equal(400, ((BadRequestResult)response).StatusCode);
        }

        [Fact]
        public async void PutFailUnmatchingIds()
        {
            Comment Comment = new Comment() { Text = "TestName", Id = 1 };
            var response = await commentsController.PutComment(2, Comment);

            Assert.Equal(400, ((BadRequestResult)response).StatusCode);
        }

        [Fact]
        public async void Post()
        {
            Comment Comment = new Comment() { Text = "TestName"};
            var response = await commentsController.PostComment(Comment);
            var postedComment = ((Comment)((CreatedAtActionResult)response.Result).Value);

            Assert.Equal(201, ((CreatedAtActionResult) response.Result).StatusCode);
            Assert.Equal("TestName", postedComment.Text);
        }

        [Fact]
        public async void PostFailIdGiven()
        {
            Comment Comment = new Comment() { Id = 1, Text = "TestName"};
            var response = await commentsController.PostComment(Comment);

            Assert.Equal(400, ((BadRequestResult)response.Result).StatusCode);
        }

        [Fact]
        public async void Delete()
        {
            var response = await commentsController.DeleteComment(2);

            var deletedComment = response.Value;

            Assert.Equal(secondComment.Text, deletedComment.Text);
            Assert.Equal(secondComment.Created, deletedComment.Created);
        }

        [Fact]
        public async void DeleteFailInexistingId()
        {
            var response = await commentsController.DeleteComment(8);


            Assert.Equal(404, ((NotFoundResult) response.Result).StatusCode);
        }

        /*[Fact]
        public async void DeleteFailHasChildren()
        {
            context.Comments.Add(new Comment { CommentId = 2 });
            context.SaveChanges();
            var response = await commentsController.DeleteComment(2);


            Assert.Equal(404, ((BadRequestResult)response.Result).StatusCode);
        }*/
    }
}
