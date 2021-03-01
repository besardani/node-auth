const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")


/**
 * @route POST /users/register
 * @description Register User to the database.
 * @access Public.
 */
router.post("/register", async (req, res) => {
  const { email, password } = req.body
  try {
    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." })
    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long." })

    const existingUser = await User.findOne({ email: email })
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." })

    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new User({
      email,
      password: passwordHash,
    })
    const savedUser = await newUser.save()
    res.json(savedUser)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * @route POST /users/login
 * @description Login User.
 * @access Public.
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  try {
    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." })

    const user = await User.findOne({ email: email })
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    console.log("token",token)
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})



module.exports = router