const isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    console.log("User is Not loggedIn");
    return res.status(401).json({ message: "Unauthorized" }); // Respond with 401 if not authenticated
  }
  next();
};

export default isAuth;
