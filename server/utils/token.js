export const jsontoken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  // Determine the cookie name based on the user's role
  let cookieName;
  if (user.rol === "Administrador") {
    cookieName = "adminToken";
  } else if (user.rol === "Doctor") {
    cookieName = "doctorToken";
  } else if (user.rol === "Paciente") {
    cookieName = "patientToken";
  } else {
    throw new Error("Invalid user role"); // Handle unexpected roles
  }

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: "lax", // permite cookies cross-site en localhost y producción
      secure: false,    // true si usas https
    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
