const jwt = require("jsonwebtoken");
const AuthService = require("../../services/authService");

const authService = new AuthService();

jest.mock("jsonwebtoken");

describe("signToken", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sign and return tokens", async () => {
    const username = "testUser";
    const user = {
      id: "1",
      avatar: "avatar.jpg",
      email: "test@test.com",
      role: "user",
      username: "testUser",
    };
    const courses = ["course1", "course2"];

    authService.courseService.fetchUserCourseById.mockResolvedValue(courses);
    jwt.sign.mockImplementation((payload, secret, options) => `${payload.user}-token`);

    const result = await authService.signToken(username, user);

    expect(yourModule.courseService.fetchUserCourseById).toHaveBeenCalledWith(user.username);
    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expect(jwt.sign).toHaveBeenNthCalledWith(
      1,
      {
        id: user.id,
        avatar: user.avatar,
        user: username,
        email: user.email,
        role: user.role,
        courses: courses,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    expect(jwt.sign).toHaveBeenNthCalledWith(
      2,
      {
        user: username,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2d" }
    );
    expect(result).toEqual({
      accessToken: "Bearer testUser-token",
      refreshToken: "Bearer testUser-token",
    });
  });
});
