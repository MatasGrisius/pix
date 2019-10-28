using Microsoft.Extensions.Options;
using Moq;
using pix.Helpers;
using pix.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace XUnitTests.Services
{
    public class UserServiceTest
    {
        UserService userService;
        public UserServiceTest()
        {
            var a = new AppSettings() { Secret = "MySuperSecret22222222222" };

            var appSettingsMock = new Mock<IOptions<AppSettings>>();
            appSettingsMock.SetupGet(x => x.Value).Returns(a);
            userService = new UserService(appSettingsMock.Object);
        }

        [Theory]
        [InlineData("p@assword", "80d26ed52e7b6badb777932dfb020cd3d1ad705c5d326195c15797bb8ec09905")]
        [InlineData("baseball", "a01edad91c00abe7be5b72b5e36bf4ce3c6f26e8bce3340eba365642813ab8b6")]
        [InlineData("abc123", "6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090")]
        [InlineData("Football", "cbe1b7d7f446e134f78cefe973dfbbde9969b81e541853b56eec04a77a6505c3")]
        [InlineData("654321", "481f6cc0511143ccdd7e2d1b1b94faf0a700a8b49cd13922a70b5ae28acaa8c5")]
        [InlineData("monkey", "000c285457fc971f862a79b786476c78812c8897063c6fa9c045f579a3b2d63f")]
        [InlineData("@#a145as86d2a4s89da1s4d8s19ad42as864dasd", "74b57317b845b84db0742dd398b86de632a4f4bbf56abac6f07808a460ac638d")]
        [InlineData("trustno1", "203b70b5ae883932161bbd0bded9357e763e63afce98b16230be33f0b94c2cc5")]
        public void ComputeSha256HashTest(string input, string expected)
        {
            var result = UserService.ComputeSha256Hash(input);
            Assert.Equal(expected, result);
        }

        [Fact]
        public void GetByIdTest()
        {
            var result = userService.GetById(1);
            Assert.Equal("Admin", result.FirstName);
            Assert.Equal("User", result.LastName);
        }

        [Fact]
        public void GetAllTest()
        {
            var result = userService.GetAll();
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public void AuthenticateTest()
        {
            var result = userService.Authenticate("admin", "trustno1");
            Assert.Equal("Admin", result.FirstName);
            Assert.Equal("admin", result.Username);
            Assert.Equal("Admin", result.Role);
        }

        [Fact]
        public void AuthenticateInexistingUserFail()
        {
            var result = userService.Authenticate("name","Wrong_password");
            Assert.Null(result);
        }
    }
}
