using pix.Controllers;
using System;
using Xunit;
using Microsoft.EntityFrameworkCore;
using pix.Entities;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using pix.Services;
using Moq;

namespace XUnitTests
{
    public class UsersControllerTest
    {

        UsersController usersController;
        public UsersControllerTest()
        {

            User user = new User() { FirstName = "Testusername" };

            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(x => x.Authenticate("Testusername", "TestP@ssw0rd")).Returns(user);
            userServiceMock.Setup(x => x.GetAll()).Returns(new List<User>() { new User() { FirstName = "firstName" } });
            userServiceMock.Setup(x => x.GetById(1)).Returns(new User() { FirstName = "firstName" });
            usersController = new UsersController(userServiceMock.Object);
        }

        [Fact]
        public void AuthenticateTest()
        {
            var response = usersController.Authenticate(new User() { Username = "Testusername", Password = "TestP@ssw0rd" });

            Assert.Equal(200, ((OkObjectResult)response).StatusCode);
        }

        [Fact]
        public void AuthenticateFailTest()
        {
            var response = usersController.Authenticate(new User() { Username = "Testusername", Password = "wrong_password" });

            Assert.Equal(400, ((BadRequestObjectResult)response).StatusCode);
        }

        [Fact]
        public void GetAllTest()
        {
            var response = usersController.GetAll();

            Assert.Equal(200, ((OkObjectResult)response).StatusCode);
        }

        [Fact]
        public void GetByIdBadIdFailTest()
        {
            var response = usersController.GetById(2);

            Assert.Equal(404, ((NotFoundResult)response).StatusCode);
        }
    }
}
